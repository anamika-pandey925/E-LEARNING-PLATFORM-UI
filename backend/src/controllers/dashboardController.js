import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Progress from '../models/Progress.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import VideoLesson from '../models/VideoLesson.js';
import Certificate from '../models/Certificate.js';
import QuizAttempt from '../models/QuizAttempt.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import ContactMessage from '../models/ContactMessage.js';
import Quiz from '../models/Quiz.js';
import Assignment from '../models/Assignment.js';
import Notification from '../models/Notification.js';

// @desc    Get aggregated student dashboard metrics, enrolled courses & continue learning
// @route   GET /api/dashboard/student
// @access  Private
export const getStudentDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch all related entities concurrently
    const [progress, enrollments, certificates, submissions, quizAttempts, notificationsCount] = await Promise.all([
      Progress.findOne({ user: userId }),
      Enrollment.find({ user: userId }).sort({ enrolledAt: -1 }),
      Certificate.find({ user: userId }).sort({ issueDate: -1 }),
      AssignmentSubmission.find({ user: userId }).sort({ submittedAt: -1 }),
      QuizAttempt.find({ user: userId }).sort({ submittedAt: -1 }),
      Notification.countDocuments({ user: userId, read: false }),
    ]);

    const watchedVideos = progress ? progress.watchedVideos : [];
    const completedAssignments = progress ? progress.completedAssignments : [];
    const enrolledCourseIds = enrollments.map((e) => e.courseId);

    // Fetch details for enrolled courses
    const dbCourses = await Course.find({ courseId: { $in: enrolledCourseIds } });
    const courseMap = {};
    dbCourses.forEach((c) => {
      courseMap[c.courseId] = c;
    });

    const enrolledCoursesList = enrolledCourseIds.map((cId) => {
      const dbCourse = courseMap[cId];
      const enrollRecord = enrollments.find((e) => e.courseId === cId);
      const cpRecord = progress?.courseProgress?.find((cp) => cp.courseId === cId);

      const progressVal = enrollRecord ? enrollRecord.progressPercentage : (cpRecord ? cpRecord.percentage : 0);
      const statusVal = enrollRecord ? enrollRecord.status : (progressVal >= 100 ? 'completed' : 'active');

      return {
        courseId: cId,
        title: dbCourse ? dbCourse.title : cId,
        category: dbCourse ? dbCourse.category : 'General',
        image: dbCourse ? dbCourse.image : null,
        duration: dbCourse ? dbCourse.duration : '10 hrs',
        instructor: dbCourse ? dbCourse.instructor : 'Study Point Faculty',
        progress: progressVal,
        status: statusVal,
        enrolledAt: enrollRecord ? enrollRecord.enrolledAt : new Date(),
      };
    });

    // Determine Continue Learning target
    let continueLearning = null;
    const activeCourse = enrolledCoursesList.find((c) => c.status === 'active') || enrolledCoursesList[0];
    if (activeCourse) {
      const nextLesson = await VideoLesson.findOne({
        courseId: activeCourse.courseId,
        videoId: { $nin: watchedVideos },
      }).sort({ order: 1 });

      continueLearning = {
        courseId: activeCourse.courseId,
        courseTitle: activeCourse.title,
        category: activeCourse.category,
        progress: activeCourse.progress,
        lesson: nextLesson
          ? { videoId: nextLesson.videoId, title: nextLesson.title, duration: nextLesson.duration }
          : null,
        isCompleted: activeCourse.progress >= 100,
      };
    }

    const completedCoursesCount = enrollments.filter((e) => e.status === 'completed' || e.progressPercentage >= 100).length;

    const stats = {
      enrolledCoursesCount: enrolledCourseIds.length,
      watchedVideosCount: watchedVideos.length,
      completedAssignmentsCount: completedAssignments.length,
      completedCoursesCount,
      certificatesEarnedCount: certificates.length,
      quizAttemptsCount: quizAttempts.length,
      unreadNotificationsCount: notificationsCount,
    };

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          avatar: req.user.avatar,
          bio: req.user.bio,
        },
        stats,
        continueLearning,
        enrolledCourses: enrolledCoursesList,
        watchedVideos,
        completedAssignments,
        certificates,
        recentSubmissions: submissions.slice(0, 5),
        recentQuizAttempts: quizAttempts.slice(0, 5),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get instructor dashboard metrics, authored courses, and student submissions to grade
// @route   GET /api/dashboard/instructor
// @access  Private (Instructor/Admin)
export const getInstructorDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Find instructor's authored courses
    const isInstructor = req.user.role === 'instructor';
    const courseQuery = isInstructor ? { $or: [{ instructorId: userId }, { instructor: req.user.name }] } : {};

    const myCourses = await Course.find(courseQuery).sort({ createdAt: -1 });
    const myCourseIds = myCourses.map((c) => c.courseId);

    const [totalEnrollmentsCount, pendingSubmissions, lessons, quizzes] = await Promise.all([
      Enrollment.countDocuments({ courseId: { $in: myCourseIds } }),
      AssignmentSubmission.find({ courseId: { $in: myCourseIds } })
        .populate('user', 'name email avatar')
        .sort({ submittedAt: -1 }),
      VideoLesson.find({ courseId: { $in: myCourseIds } }),
      Quiz.find({ courseId: { $in: myCourseIds } }),
    ]);

    const stats = {
      totalCourses: myCourses.length,
      totalStudents: totalEnrollmentsCount,
      totalLessons: lessons.length,
      totalQuizzes: quizzes.length,
      pendingSubmissionsCount: pendingSubmissions.filter((s) => s.status === 'submitted' || s.status === 'under_review').length,
    };

    res.status(200).json({
      success: true,
      data: {
        stats,
        courses: myCourses,
        submissions: pendingSubmissions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin platform overview, total counts, user breakdown, contact messages
// @route   GET /api/dashboard/admin
// @access  Private (Admin)
export const getAdminDashboard = async (req, res, next) => {
  try {
    const [
      totalUsers,
      studentsCount,
      instructorsCount,
      coursesCount,
      categoriesCount,
      enrollmentsCount,
      completedEnrollmentsCount,
      certificatesCount,
      contactMessagesCount,
      recentUsers,
      recentMessages,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'instructor' }),
      Course.countDocuments(),
      Category.countDocuments(),
      Enrollment.countDocuments(),
      Enrollment.countDocuments({ status: 'completed' }),
      Certificate.countDocuments(),
      ContactMessage.countDocuments(),
      User.find().select('-password').sort({ createdAt: -1 }).limit(6),
      ContactMessage.find().sort({ createdAt: -1 }).limit(5),
    ]);

    const stats = {
      totalUsers,
      studentsCount,
      instructorsCount,
      coursesCount,
      categoriesCount,
      enrollmentsCount,
      completedEnrollmentsCount,
      certificatesCount,
      contactMessagesCount,
    };

    res.status(200).json({
      success: true,
      data: {
        stats,
        recentUsers,
        recentMessages,
      },
    });
  } catch (error) {
    next(error);
  }
};
