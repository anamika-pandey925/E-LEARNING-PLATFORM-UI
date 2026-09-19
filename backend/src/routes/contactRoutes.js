import express from 'express';
import {
  submitContactMessage,
  getContactMessages,
  updateContactStatus,
  deleteContactMessage,
} from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', submitContactMessage);
router.get('/', protect, authorize('admin'), getContactMessages);
router.put('/:id/status', protect, authorize('admin'), updateContactStatus);
router.delete('/:id', protect, authorize('admin'), deleteContactMessage);

export default router;
