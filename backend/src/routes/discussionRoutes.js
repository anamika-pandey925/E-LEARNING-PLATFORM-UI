import express from 'express';
import {
  getCourseDiscussions,
  createDiscussionThread,
  replyToThread,
} from '../controllers/discussionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:courseId', getCourseDiscussions);
router.post('/:courseId', protect, createDiscussionThread);
router.post('/:id/reply', protect, replyToThread);

export default router;
