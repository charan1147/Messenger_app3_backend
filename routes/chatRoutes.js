import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { sendMessage, getMessages } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', verifyToken, sendMessage);         // Send a message
router.get('/:contactId', verifyToken, getMessages); // Get messages with a contact

export default router;
