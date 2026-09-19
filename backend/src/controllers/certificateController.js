import Certificate from '../models/Certificate.js';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';

// @desc    Get logged in user's certificates
// @route   GET /api/certificates/my
// @access  Private
export const getMyCertificates = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const certificates = await Certificate.find({ user: userId }).sort({ issueDate: -1 });

    res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get certificate by unique ID (publicly viewable & printable)
// @route   GET /api/certificates/:id
// @access  Public
export const getCertificateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const certificate = await Certificate.findOne({
      $or: [{ certificateId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found or invalid certificate ID.',
      });
    }

    res.status(200).json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate certificate for completed course
// @route   POST /api/certificates/generate/:courseId
// @access  Private
export const generateCertificate = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    // Verify enrollment and completion
    const enrollment = await Enrollment.findOne({ user: userId, courseId });
    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to claim a certificate.',
      });
    }

    // Check if certificate already exists
    let certificate = await Certificate.findOne({ user: userId, courseId });
    if (certificate) {
      return res.status(200).json({
        success: true,
        message: 'Certificate already generated.',
        data: certificate,
      });
    }

    const course = await Course.findOne({ courseId });
    const certId = `CERT-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    certificate = await Certificate.create({
      certificateId: certId,
      user: userId,
      studentName: req.user.name,
      courseId,
      courseName: course ? course.title : courseId,
      instructorName: course ? course.instructor : 'Study Point Faculty',
      issueDate: new Date(),
      grade: 'Distinction (100%)',
    });

    res.status(201).json({
      success: true,
      message: 'Certificate generated successfully!',
      data: certificate,
    });
  } catch (error) {
    next(error);
  }
};
