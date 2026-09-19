import express from 'express';
import {
  getAssignments,
  getAssignmentById,
  submitAssignment,
  getSubmissionsForAssignment,
  getAllSubmissions,
  gradeSubmission,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from '../controllers/assignmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAssignments);
router.get('/admin/all-submissions', protect, authorize('instructor', 'admin'), getAllSubmissions);
router.get('/:id', protect, getAssignmentById);
router.post('/:id/submit', protect, submitAssignment);

// Instructor review & grading
router.get('/:id/submissions', protect, authorize('instructor', 'admin'), getSubmissionsForAssignment);
router.put('/submissions/:id/grade', protect, authorize('instructor', 'admin'), gradeSubmission);

// Instructor / Admin assignment creation & management
router.post('/', protect, authorize('instructor', 'admin'), createAssignment);
router.put('/:id', protect, authorize('instructor', 'admin'), updateAssignment);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteAssignment);

export default router;
