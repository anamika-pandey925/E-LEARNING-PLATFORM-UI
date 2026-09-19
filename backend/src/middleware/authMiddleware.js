import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Enrollment from '../models/Enrollment.js';

// Protect routes requiring JWT authentication
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'studypoint_jwt_secret_key_2026_super_secure_auth'
      );

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required. User not found.',
        });
      }

      return next();
    } catch (error) {
      console.error('[Auth Middleware Error]:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Invalid or expired token.',
      });
    }
  }

  return res.status(401).json({
    success: false,
    message: 'Authentication required. No token provided.',
  });
};

export const authenticateUser = protect;

// Grant access to specific roles (e.g. 'instructor', 'admin')
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user?.role || 'guest'}' is not authorized to perform this operation.`,
      });
    }
    next();
  };
};

export const requireRole = authorize;

// Helper to resolve category/subject to courseId
export const resolveCourseId = (item) => {
  if (!item) return 'web-dev-basics';
  if (item.courseId) return item.courseId;

  const key = (item.category || item.subject || '').toLowerCase();
  if (key.includes('html') || key.includes('css') || key.includes('web')) {
    return 'web-dev-basics';
  }
  if (key.includes('js') || key.includes('javascript') || key.includes('react') || key.includes('program')) {
    return 'javascript-beginners';
  }
  if (key.includes('python') || key.includes('data')) {
    return 'python-data-science';
  }
  if (key.includes('math') || key.includes('english') || key.includes('science') || key.includes('academic')) {
    return 'math-competitive';
  }
  return 'web-dev-basics';
};

// Check if student is enrolled in a specific courseId
export const isStudentEnrolled = async (userId, targetCourseId) => {
  if (!userId || !targetCourseId) return false;
  const enrollment = await Enrollment.findOne({
    user: userId,
    courseId: targetCourseId,
  });
  return !!enrollment;
};

// Middleware: Require enrollment in the course
export const requireEnrollment = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    // Admins and instructors bypass enrollment check
    if (req.user.role === 'admin' || req.user.role === 'instructor') {
      return next();
    }

    const courseId = req.params.courseId || req.params.id || req.body.courseId;
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course identifier is required to verify enrollment.',
      });
    }

    const enrolled = await isStudentEnrolled(userId, courseId);
    if (!enrolled) {
      return res.status(403).json({
        success: false,
        message: 'Please enroll in this course to access the content.',
        isEnrolled: false,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
