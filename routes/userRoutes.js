import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  getMe,
  updateProfile,
  addContact,
  getUserById,
  getContacts
} from '../controllers/userController.js';

const router = express.Router();

// ✅ Authenticated user info
router.get('/me', verifyToken, getMe);

// ✅ Update authenticated user's profile
router.put('/me', verifyToken, updateProfile);

// ✅ Add a contact to the current user's contact list
router.post('/add-contact', verifyToken, addContact);

// ✅ Get all contacts of the current user
router.get('/contacts', verifyToken, getContacts);

// ✅ Get user by ID (probably used to fetch user info for display/chat)
router.get('/:id', verifyToken, getUserById);

export default router;
