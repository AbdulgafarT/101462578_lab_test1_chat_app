const GroupMessage = require('../models/GroupMessage');

function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('New user connected');

    // Join a room
    socket.on('joinRoom', ({ username, room }) => {
        console.log('Username:', username); // Debug the username being sent
        console.log('Room:', room);         // Debug the room being joined
      
        if (!username || !room) {
          console.error('Missing username or room');
          return;
        }
      
        socket.join(room);
        io.to(room).emit('message', { from_user: 'System', message: `${username} has joined the room.` });
      });
      

    // Send a chat message
    socket.on('chatMessage', async ({ from_user, room, message }) => {
      const chatMessage = new GroupMessage({ from_user, room, message });
      await chatMessage.save();
      io.to(room).emit('message', { from_user, message });
    });

    // Typing indicator
    socket.on('typing', ({ username, room }) => {
      socket.to(room).emit('typing', `${username} is typing...`);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
}

module.exports = { setupSocket };
