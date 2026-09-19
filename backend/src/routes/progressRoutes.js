import express from 'express';
import { getCourseProgress, updateCourseProgress } from '../controllers/progressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:courseId', protect, getCourseProgress);
router.put('/:courseId', protect, updateCourseProgress);

export default router;
