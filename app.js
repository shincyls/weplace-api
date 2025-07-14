const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');
const locationRoutes = require('./src/routes/locationRoutes');
const sellerRoutes = require('./src/routes/sellerRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const { initializeSocketServer } = require('./src/socket/socketServer');

// Read Config From .env File
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocketServer(server);

// API routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/location', locationRoutes);
app.use('/api/v1/seller', sellerRoutes);
app.use('/api/v1/chat', chatRoutes);

// Make io accessible to routes
app.set('io', io);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = { app, server };
