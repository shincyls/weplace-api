import io from 'socket.io-client';
import { getToken } from './authService';

let socket = null;
let isConnected = false;
let messageCallbacks = [];
let roomCallbacks = [];
let errorCallbacks = [];
let readCallbacks = [];

// Initialize socket connection
export const initializeSocket = () => {
  if (socket) {
    socket.disconnect();
  }

  const token = getToken();
  if (!token) {
    console.error('No authentication token found');
    return false;
  }

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  socket = io(API_URL, {
    auth: {
      token
    }
  });

  socket.on('connect', () => {
    console.log('Socket connected');
    isConnected = true;
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
    isConnected = false;
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
    errorCallbacks.forEach(callback => callback(error));
  });

  socket.on('new-message', (message) => {
    messageCallbacks.forEach(callback => callback(message));
  });

  socket.on('room-created', (room) => {
    roomCallbacks.forEach(callback => callback(room));
  });

  socket.on('messages-read', (data) => {
    readCallbacks.forEach(callback => callback(data));
  });

  return true;
};

// Disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    isConnected = false;
  }
};

// Join a chat room
export const joinRoom = (roomId) => {
  if (!isConnected || !socket) {
    console.error('Socket not connected');
    return false;
  }

  socket.emit('join-room', roomId);
  return true;
};

// Send a message
export const sendMessage = (roomId, content, attachments = []) => {
  if (!isConnected || !socket) {
    console.error('Socket not connected');
    return false;
  }

  socket.emit('send-message', { roomId, content, attachments });
  return true;
};

// Create a new room
export const createRoom = (participants, type = 'direct', name = '') => {
  if (!isConnected || !socket) {
    console.error('Socket not connected');
    return false;
  }

  socket.emit('create-room', { participants, type, name });
  return true;
};

// Mark messages as read
export const markAsRead = (roomId, messageIds = null) => {
  if (!isConnected || !socket) {
    console.error('Socket not connected');
    return false;
  }

  socket.emit('mark-read', { roomId, messageIds });
  return true;
};

// Register callback for new messages
export const onNewMessage = (callback) => {
  messageCallbacks.push(callback);
  return () => {
    messageCallbacks = messageCallbacks.filter(cb => cb !== callback);
  };
};

// Register callback for room creation
export const onRoomCreated = (callback) => {
  roomCallbacks.push(callback);
  return () => {
    roomCallbacks = roomCallbacks.filter(cb => cb !== callback);
  };
};

// Register callback for errors
export const onError = (callback) => {
  errorCallbacks.push(callback);
  return () => {
    errorCallbacks = errorCallbacks.filter(cb => cb !== callback);
  };
};

// Register callback for read receipts
export const onMessagesRead = (callback) => {
  readCallbacks.push(callback);
  return () => {
    readCallbacks = readCallbacks.filter(cb => cb !== callback);
  };
};

// REST API fallbacks for when socket is not available
export const fetchRooms = async () => {
  const response = await fetch('/api/v1/chat/rooms', {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch chat rooms');
  }
  
  return response.json();
};

export const fetchMessages = async (roomId, page = 1, limit = 50) => {
  const response = await fetch(`/api/v1/chat/rooms/${roomId}/messages?page=${page}&limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  
  return response.json();
};

export const sendMessageREST = async (roomId, content, attachments = []) => {
  const response = await fetch(`/api/v1/chat/rooms/${roomId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ content, attachments })
  });
  
  if (!response.ok) {
    throw new Error('Failed to send message');
  }
  
  return response.json();
};

export const createRoomREST = async (participants, type = 'direct', name = '') => {
  const response = await fetch('/api/v1/chat/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ participants, type, name })
  });
  
  if (!response.ok) {
    throw new Error('Failed to create chat room');
  }
  
  return response.json();
};

export const markAsReadREST = async (roomId, messageIds = null) => {
  const response = await fetch(`/api/v1/chat/rooms/${roomId}/read`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      '