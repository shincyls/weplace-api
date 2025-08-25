const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const mobileUserRoutes = require('./src/routes/mobile/userRoutes');
const mobileAuthRoutes = require('./src/routes/mobile/authRoutes');
const mobileLocationRoutes = require('./src/routes/mobile/locationRoutes');
const mobileSellerRoutes = require('./src/routes/mobile/sellerRoutes');
// const chatRoutes = require('./src/routes/mobile/chatRoutes');
// const webhookRoutes = require('./src/routes/mobile/webhookRoutes'); // Uncomment if/when you add webhook routes
// const { initializeSocketServer } = require('./src/socket/socketServer');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create HTTP server
const server = http.createServer(app);
// const io = initializeSocketServer(server);

// API routes
app.use('/api/v1/auth', mobileAuthRoutes);
app.use('/api/v1/location', mobileLocationRoutes);
app.use('/api/v1/seller', mobileSellerRoutes);
app.use('/api/v1/user', mobileUserRoutes);

// app.use('/api/v1/chat', chatRoutes);
// app.use('/api/v1/webhook', webhookRoutes); // Uncomment if/when you add webhook routes
// app.set('io', io);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
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
