const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const { ChatRoom, ChatMessage } = require('../models/chatModel');
const { User } = require('../models/user/userModel');
const { Seller } = require('../models/user/sellerModel');

// User and room tracking
const connectedUsers = new Map(); // userId -> socketId
const connectedSellers = new Map(); // sellerId -> socketId
const userRooms = new Map(); // userId -> Set of roomIds

// Initialize Socket.IO server
function initializeSocketServer(server) {
  const io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: Token required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.role === 'user') {
        const user = await User.findById(decoded.id);
        if (!user) {
          return next(new Error('Authentication error: User not found'));
        }
        socket.user = { id: user._id, role: 'user' };
      } else if (decoded.role === 'seller') {
        const seller = await Seller.findById(decoded.id);
        if (!seller) {
          return next(new Error('Authentication error: Seller not found'));
        }
        socket.user = { id: seller._id, role: 'seller' };
      } else {
        return next(new Error('Authentication error: Invalid role'));
      }
      
      next();
    } catch (error) {
      next(new Error('Authentication error: ' + error.message));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id} (${socket.user.role})`);
    
    // Track connected user
    if (socket.user.role === 'user') {
      connectedUsers.set(socket.user.id.toString(), socket.id);
    } else {
      connectedSellers.set(socket.user.id.toString(), socket.id);
    }

    // Join rooms
    socket.on('join-room', async (roomId) => {
      try {
        const room = await ChatRoom.findById(roomId);
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Check if user is a participant
        const isParticipant = room.participants.some(p => 
          p.toString() === socket.user.id.toString()
        );

        if (!isParticipant) {
          socket.emit('error', { message: 'Not authorized to join this room' });
          return;
        }

        socket.join(roomId);
        
        // Track user's rooms
        if (!userRooms.has(socket.user.id.toString())) {
          userRooms.set(socket.user.id.toString(), new Set());
        }
        userRooms.get(socket.user.id.toString()).add(roomId);
        
        // Get recent messages
        const messages = await ChatMessage.find({ roomId })
          .sort({ createdAt: -1 })
          .limit(50)
          .populate({
            path: 'sender',
            select: 'name profileImage',
            model: function(doc) {
              return doc.senderModel;
            }
          });
        
        socket.emit('room-history', { roomId, messages: messages.reverse() });
        
        // Mark messages as read
        await ChatMessage.updateMany(
          { 
            roomId,
            'readBy.user': { $ne: socket.user.id }
          },
          { 
            $push: { 
              readBy: { 
                user: socket.user.id, 
                userModel: socket.user.role === 'user' ? 'User' : 'Seller',
                timestamp: new Date() 
              } 
            } 
          }
        );
        
        // Notify other participants that messages were read
        socket.to(roomId).emit('messages-read', { 
          roomId, 
          userId: socket.user.id,
          userModel: socket.user.role === 'user' ? 'User' : 'Seller'
        });
        
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Send message
    socket.on('send-message', async (data) => {
      try {
        const { roomId, content, attachments = [] } = data;
        
        // Validate room
        const room = await ChatRoom.findById(roomId);
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Check if user is a participant
        const isParticipant = room.participants.some(p => 
          p.toString() === socket.user.id.toString()
        );

        if (!isParticipant) {
          socket.emit('error', { message: 'Not authorized to send messages to this room' });
          return;
        }

        // Create message
        const message = new ChatMessage({
          roomId,
          sender: socket.user.id,
          senderModel: socket.user.role === 'user' ? 'User' : 'Seller',
          content,
          attachments,
          readBy: [{
            user: socket.user.id,
            userModel: socket.user.role === 'user' ? 'User' : 'Seller',
            timestamp: new Date()
          }]
        });

        await message.save();
        
        // Update room's last message
        room.lastMessage = {
          content,
          sender: socket.user.id,
          senderModel: socket.user.role === 'user' ? 'User' : 'Seller',
          timestamp: new Date()
        };
        await room.save();

        // Populate sender info
        const populatedMessage = await ChatMessage.findById(message._id)
          .populate({
            path: 'sender',
            select: 'name profileImage',
            model: message.senderModel
          });

        // Broadcast to room
        io.to(roomId).emit('new-message', populatedMessage);
        
        // Send notifications to offline participants
        room.participants.forEach(async (participantId) => {
          const participantIdStr = participantId.toString();
          
          // Skip sender
          if (participantIdStr === socket.user.id.toString()) {
            return;
          }
          
          // Check if participant is online
          const isUserOnline = connectedUsers.has(participantIdStr);
          const isSellerOnline = connectedSellers.has(participantIdStr);
          
          if (!isUserOnline && !isSellerOnline) {
            // TODO: Send push notification or email
            console.log(`User ${participantIdStr} is offline, sending notification`);
          }
        });
        
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Create new room
    socket.on('create-room', async (data) => {
      try {
        const { participants, type = 'direct', name } = data;
        
        // Validate participants
        if (!participants || !Array.isArray(participants)) {
          socket.emit('error', { message: 'Invalid participants' });
          return;
        }
        
        // Add current user to participants if not already included
        const allParticipants = [...new Set([
          ...participants.map(p => p.id.toString()),
          socket.user.id.toString()
        ])];
        
        // Format participants with their models
        const formattedParticipants = participants.map(p => ({
          id: p.id,
          model: p.model || 'User'
        }));
        
        // Add current user
        formattedParticipants.push({
          id: socket.user.id,
          model: socket.user.role === 'user' ? 'User' : 'Seller'
        });
        
        // Check if room already exists for direct chats
        if (type === 'direct' && formattedParticipants.length === 2) {
          const existingRoom = await ChatRoom.findOne({
            type: 'direct',
            participants: { $all: allParticipants, $size: 2 }
          });
          
          if (existingRoom) {
            socket.emit('room-created', existingRoom);
            return;
          }
        }
        
        // Create new room
        const room = new ChatRoom({
          name: name || `Chat ${Date.now()}`,
          type,
          participants: formattedParticipants.map(p => p.id),
          participantModel: formattedParticipants[0].model // This is a simplification, needs refinement
        });
        
        await room.save();
        
        // Join the room
        socket.join(room._id.toString());
        
        // Track user's rooms
        if (!userRooms.has(socket.user.id.toString())) {
          userRooms.set(socket.user.id.toString(), new Set());
        }
        userRooms.get(socket.user.id.toString()).add(room._id.toString());
        
        // Notify all participants
        formattedParticipants.forEach(participant => {
          const socketId = participant.model === 'User' 
            ? connectedUsers.get(participant.id.toString())
            : connectedSellers.get(participant.id.toString());
            
          if (socketId) {
            io.to(socketId).emit('room-created', room);
          }
        });
        
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Mark messages as read
    socket.on('mark-read', async (data) => {
      try {
        const { roomId, messageIds } = data;
        
        if (!messageIds || !Array.isArray(messageIds)) {
          await ChatMessage.updateMany(
            { 
              roomId,
              'readBy.user': { $ne: socket.user.id }
            },
            { 
              $push: { 
                readBy: { 
                  user: socket.user.id, 
                  userModel: socket.user.role === 'user' ? 'User' : 'Seller',
                  timestamp: new Date() 
                } 
              } 
            }
          );
        } else {
          await ChatMessage.updateMany(
            { 
              _id: { $in: messageIds },
              'readBy.user': { $ne: socket.user.id }
            },
            { 
              $push: { 
                readBy: { 
                  user: socket.user.id, 
                  userModel: socket.user.role === 'user' ? 'User' : 'Seller',
                  timestamp: new Date() 
                } 
              } 
            }
          );
        }
        
        // Notify other participants
        socket.to(roomId).emit('messages-read', { 
          roomId, 
          userId: socket.user.id,
          userModel: socket.user.role === 'user' ? 'User' : 'Seller'
        });
        
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.id}`);
      
      // Remove from tracking
      if (socket.user.role === 'user') {
        connectedUsers.delete(socket.user.id.toString());
      } else {
        connectedSellers.delete(socket.user.id.toString());
      }
      
      // Leave all rooms
      const rooms = userRooms.get(socket.user.id.toString());
      if (rooms) {
        rooms.forEach(roomId => {
          socket.leave(roomId);
        });
        userRooms.delete(socket.user.id.toString());
      }
    });
  });

  return io;
}

module.exports = { initializeSocketServer };