import mongoose from "mongoose";
import Message from '../models/Message.js';

// ✅ Send a message
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, type = "text" } = req.body;

    // 🔐 Validation
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid receiver ID." });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content,
      type,
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("❌ Send Message Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all messages with a contact
export const getMessages = async (req, res) => {
  try {
    const { contactId } = req.params;
    const userId = req.user?._id;

    // 🔐 Validate IDs
    if (
      !userId ||
      !contactId ||
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(contactId)
    ) {
      return res.status(400).json({ message: "Invalid user or contact ID." });
    }

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: contactId },
        { sender: contactId, receiver: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name email") // 🆕 also populate email
      .populate("receiver", "name email");

    res.json(messages);
  } catch (error) {
    console.error("❌ ERROR in getMessages:", error);
    res.status(500).json({ message: error.message });
  }
};
