import express from 'express';
import {
  getCourseReviews,
  addReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/course/:courseId', getCourseReviews);
router.post('/course/:courseId', protect, addReview);
router.delete('/:id', protect, deleteReview);

export default router;
