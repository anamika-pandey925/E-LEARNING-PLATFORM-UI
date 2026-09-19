import express from 'express';
import {
  getQuizzes,
  getQuizById,
  submitQuiz,
  getQuizAttempts,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} from '../controllers/quizController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getQuizzes);
router.get('/:id', getQuizById);
router.post('/:id/submit', protect, submitQuiz);
router.get('/:id/attempts', protect, getQuizAttempts);

// Instructor / Admin management
router.post('/', protect, authorize('instructor', 'admin'), createQuiz);
router.put('/:id', protect, authorize('instructor', 'admin'), updateQuiz);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteQuiz);

export default router;
