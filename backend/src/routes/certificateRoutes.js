import express from 'express';
import {
  getMyCertificates,
  getCertificateById,
  generateCertificate,
} from '../controllers/certificateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my', protect, getMyCertificates);
router.get('/:id', getCertificateById);
router.post('/generate/:courseId', protect, generateCertificate);

export default router;
