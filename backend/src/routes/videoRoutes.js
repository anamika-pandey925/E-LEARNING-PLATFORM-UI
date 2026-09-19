import express from 'express';
import {
  getVideos,
  getVideoById,
  toggleVideoWatched,
  createVideoLesson,
  updateVideoLesson,
  deleteVideoLesson,
} from '../controllers/videoController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getVideos);
router.get('/:id', protect, getVideoById);
router.post('/:id/toggle-watch', protect, toggleVideoWatched);

// Instructor / Admin management
router.post('/', protect, authorize('instructor', 'admin'), createVideoLesson);
router.put('/:id', protect, authorize('instructor', 'admin'), updateVideoLesson);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteVideoLesson);

export default router;
