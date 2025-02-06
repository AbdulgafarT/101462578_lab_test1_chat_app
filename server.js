require('dotenv').config();
console.log("📌 Loaded MONGO_URI:", process.env.MONGO_URI); // Debugging Line

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

// Import routes
const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');
const { setupSocket } = require('./socket');

// Initialize app and server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Setup Socket.IO
setupSocket(io);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
