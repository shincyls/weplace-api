const express = require('express');
const router = express.Router();
const { ChatRoom, ChatMessage } = require('../models/chatModel');
const { authMiddleware } = require('../middleware/authMiddleware');

// Get all chat rooms for the current user
router.get('/rooms', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const userModel = req.user.role === 'user' ? 'User' : 'Seller';
    
    const rooms = await ChatRoom.find({
      participants: userId,
      isActive: true
    })
    .sort({ 'lastMessage.timestamp': -1 })
    .populate({
      path: 'participants',
      select: 'name profileImage',
      model: function(doc) {
        return doc.participantModel;
      }
    });
    
    // Get unread message count for each room
    const roomsWithUnreadCount = await Promise.all(rooms.map(async (room) => {
      const unreadCount = await ChatMessage.countDocuments({
        roomId: room._id,
        sender: { $ne: userId },
        'readBy.user': { $ne: userId }
      });
      
      return {
        ...room.toObject(),
        unreadCount
      };
    }));
    
    res.json({
      success: true,
      data: roomsWithUnreadCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get messages for a specific room
router.get('/rooms/:roomId/messages', authMiddleware, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    // Check if user is a participant
    const room = await ChatRoom.findOne({
      _id: roomId,
      participants: req.user.id
    });
    
    if (!room) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this room'
      });
    }
    
    const messages = await ChatMessage.find({ roomId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate({
        path: 'sender',
        select: 'name profileImage',
        model: function(doc) {
          return doc.senderModel;
        }
      });
    
    const totalMessages = await ChatMessage.countDocuments({ roomId });
    
    res.json({
      success: true,
      data: {
        messages: messages.reverse(),
        pagination: {
          total: totalMessages,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(totalMessages / limit)
        }
      }
    });
    
    // Mark messages as read
    await ChatMessage.updateMany(
      { 
        roomId,
        sender: { $ne: req.user.id },
        'readBy.user': { $ne: req.user.id }
      },
      { 
        $push: { 
          readBy: { 
            user: req.user.id, 
            userModel: req.user.role === 'user' ? 'User' : 'Seller',
            timestamp: new Date() 
          } 
        } 
      }
    );
    
    // Notify other participants that messages were read
    const io = req.app.get('io');
    if (io) {
      io.to(roomId).emit('messages-read', { 
        roomId, 
        userId: req.user.id,
        userModel: req.user.role === 'user' ? 'User' : 'Seller'
      });
    }
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create a new chat room
router.post('/rooms', authMiddleware, async (req, res) => {
  try {
    const { participants, type = 'direct', name } = req.body;
    
    // Validate participants
    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid participants'
      });
    }
    
    // Format participants with their models
    const formattedParticipants = participants.map(p => ({
      id: p.id,
      model: p.model || 'User'
    }));
    
    // Add current user if not already included
    const currentUserIncluded = formattedParticipants.some(
      p => p.id.toString() === req.user.id.toString()
    );
    
    if (!currentUserIncluded) {
      formattedParticipants.push({
        id: req.user.id,
        model: req.user.role === 'user' ? 'User' : 'Seller'
      });
    }
    
    // Check if room already exists for direct chats
    if (type === 'direct' && formattedParticipants.length === 2) {
      const participantIds = formattedParticipants.map(p => p.id);
      
      const existingRoom = await ChatRoom.findOne({
        type: 'direct',
        participants: { $all: participantIds, $size: 2 },
        isActive: true
      });
      
      if (existingRoom) {
        return res.json({
          success: true,
          data: existingRoom,
          message: 'Existing room found'
        });
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
    
    // Notify all participants
    const io = req.app.get('io');
    if (io) {
      formattedParticipants.forEach(participant => {
        io.to(participant.id.toString()).emit('room-created', room);
      });
    }
    
    res.status(201).json({
      success: true,
      data: room
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Send a message (REST fallback for when socket is not available)
router.post('/rooms/:roomId/messages', authMiddleware, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { content, attachments = [] } = req.body;
    
    if (!content && (!attachments || attachments.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Message content or attachments required'
      });
    }
    
    // Check if user is a participant
    const room = await ChatRoom.findOne({
      _id: roomId,
      participants: req.user.id,
      isActive: true
    });
    
    if (!room) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send messages to this room'
      });
    }
    
    // Create message
    const message = new ChatMessage({
      roomId,
      sender: req.user.id,
      senderModel: req.user.role === 'user' ? 'User' : 'Seller',
      content: content || '',
      attachments,
      readBy: [{
        user: req.user.id,
        userModel: req.user.role === 'user' ? 'User' : 'Seller',
        timestamp: new Date()
      }]
    });
    
    await message.save();
    
    // Update room's last message
    room.lastMessage = {
      content: content || 'Attachment',
      sender: req.user.id,
      senderModel: req.user.role === 'user' ? 'User' : 'Seller',
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
    
    // Broadcast to room via Socket.IO if available
    const io = req.app.get('io');
    if (io) {
      io.to(roomId).emit('new-message', populatedMessage);
    }
    
    res.status(201).json({
      success: true,
      data: populatedMessage
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Mark messages as read
router.post('/rooms/:roomId/read', authMiddleware, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { messageIds } = req.body;
    
    // Check if user is a participant
    const room = await ChatRoom.findOne({
      _id: roomId,
      participants: req.user.id
    });
    
    if (!room) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this room'
      });
    }
    
    // Mark messages as read
    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      // Mark all messages as read
      await ChatMessage.updateMany(
        { 
          roomId,
          sender: { $ne: req.user.id },
          'readBy.user': { $ne: req.user.id }
        },
        { 
          $push: { 
            readBy: { 
              user: req.user.id, 
              userModel: req.user.role === 'user' ? 'User' : 'Seller',
              timestamp: new Date() 
            } 
          } 
        }
      );
    } else {
      // Mark specific messages as read
      await ChatMessage.updateMany(
        { 
          _id: { $in: messageIds },
          roomId,
          'readBy.user': { $ne: req.user.id }
        },
        { 
          $push: { 
            readBy: { 
              user: req.user.id, 
              userModel: req.user.role === 'user' ? 'User' : 'Seller',
              timestamp: new Date() 
            } 
          } 
        }
      );
    }
    
    // Notify other participants
    const io = req.app.get('io');
    if (io) {
      io.to(roomId).emit('messages-read', { 
        roomId, 
        userId: req.user.id,
        userModel: req.user.role === 'user' ? 'User' : 'Seller'
      });
    }
    
    res.json({
      success: true,
      message: 'Messages marked as read'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get unread message count
router.get('/unread', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all rooms for the user
    const rooms = await ChatRoom.find({
      participants: userId,
      isActive: true
    });
    
    const roomIds = rooms.map(room => room._id);
    
    // Count unread messages across all rooms
    const totalUnread = await ChatMessage.countDocuments({
      roomId: { $in: roomIds },
      sender: { $ne: userId },
      'readBy.user': { $ne: userId }
    });
    
    // Get unread count per room
    const unreadByRoom = await Promise.all(roomIds.map(async (roomId) => {
      const count = await ChatMessage.countDocuments({
        roomId,
        sender: { $ne: userId },
        'readBy.user': { $ne: userId }
      });
      
      return {
        roomId,
        count
      };
    }));
    
    res.json({
      success: true,
      data: {
        total: totalUnread,
        byRoom: unreadByRoom
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete/Archive a chat room
router.delete('/rooms/:roomId', authMiddleware, async (req, res) => {
  try {
    const { roomId } = req.params;
    
    // Check if user is a participant
    const room = await ChatRoom.findOne({
      _id: roomId,
      participants: req.user.id
    });
    
    if (!room) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this room'
      });
    }
    
    // Soft delete (archive) the room
    room.isActive = false;
    await room.save();
    
    // Notify other participants
    const io = req.app.get('io');
    if (io) {
      room.participants.forEach(participantId => {
        if (participantId.toString() !== req.user.id.toString()) {
          io.to(participantId.toString()).emit('room-archived', { roomId });
        }
      });
    }
    
    res.json({
      success: true,
      message: 'Chat room archived'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

