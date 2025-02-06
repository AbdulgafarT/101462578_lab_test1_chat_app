const express = require('express');
const GroupMessage = require('../models/GroupMessage');

const router = express.Router();

// Send a message
router.post('/', async (req, res) => {
  const { from_user, room, message } = req.body;

  if (!from_user || !room || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const chatMessage = new GroupMessage({ from_user, room, message });
    await chatMessage.save();
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Message error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get messages
router.get('/', async (req, res) => {
  const { room } = req.query;

  if (!room) {
    return res.status(400).json({ message: 'Room is required' });
  }

  try {
    const messages = await GroupMessage.find({ room }).sort({ date_sent: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
