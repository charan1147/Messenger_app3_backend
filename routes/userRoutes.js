import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getMe, updateProfile, addContact,getUserById, getContacts } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', verifyToken, getMe);
router.put('/me', verifyToken, updateProfile);
router.post('/add-contact', verifyToken, addContact);
router.get('/contacts', verifyToken, getContacts);
router.get("/:id", verifyToken, getUserById);

export default router;
