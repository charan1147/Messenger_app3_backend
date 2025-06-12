import Message from '../models/Message.js';

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, type } = req.body;
    const message = await Message.create({
      sender: req.userId,
      receiver: receiverId,
      content,
      type,
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { contactId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.userId, receiver: contactId },
        { sender: contactId, receiver: req.userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'name')    // populate sender name only
      .populate('receiver', 'name'); // populate receiver name only

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
