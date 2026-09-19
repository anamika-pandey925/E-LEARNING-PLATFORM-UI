import express from 'express';
import {
  getCourses,
  getCourseById,
  getEnrollmentStatus,
  enrollCourse,
  getMyEnrollments,
  getCourseContent,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getCourses);
router.get('/my/enrollments', protect, getMyEnrollments);
router.get('/:id', getCourseById);

// Protected student routes
router.post('/:id/enroll', protect, enrollCourse);
router.get('/:id/enrollment-status', protect, getEnrollmentStatus);
router.get('/:id/content', protect, getCourseContent);

// Instructor / Admin management routes
router.post('/', protect, authorize('instructor', 'admin'), createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);

export default router;
