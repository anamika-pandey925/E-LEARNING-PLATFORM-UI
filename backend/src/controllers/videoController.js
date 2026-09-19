import VideoLesson from '../models/VideoLesson.js';
import Progress from '../models/Progress.js';
import Enrollment from '../models/Enrollment.js';
import Certificate from '../models/Certificate.js';
import Notification from '../models/Notification.js';
import Course from '../models/Course.js';
import { initialVideos } from '../utils/seedData.js';
import { resolveCourseId, isStudentEnrolled } from '../middleware/authMiddleware.js';

// @desc    Get all video lectures or filtered by course
// @route   GET /api/videos
// @access  Public
export const getVideos = async (req, res, next) => {
  try {
    const { courseId, category } = req.query;
    let query = {};

    if (courseId) query.courseId = courseId;
    if (category && category !== 'All') query.category = category;

    let videos = await VideoLesson.find(query).sort({ order: 1 });

    if (videos.length === 0 && !courseId && (!category || category === 'All')) {
      const count = await VideoLesson.countDocuments();
      if (count === 0) {
        await VideoLesson.insertMany(initialVideos);
        videos = await VideoLesson.find(query).sort({ order: 1 });
      }
    }

    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single video lecture by ID (requires login + enrollment)
// @route   GET /api/videos/:id
// @access  Private (Enrolled only)
export const getVideoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    let video = await VideoLesson.findOne({
      $or: [{ videoId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!video) {
      video = initialVideos.find((v) => v.id === id || v.videoId === id);
    }

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video lesson not found.',
      });
    }

    // Role bypass
    if (req.user.role === 'student') {
      const courseId = resolveCourseId(video);
      const enrolled = await isStudentEnrolled(userId, courseId);

      if (!enrolled) {
        return res.status(403).json({
          success: false,
          message: 'Please enroll in this course to access the video.',
          isEnrolled: false,
        });
      }
    }

    res.status(200).json({
      success: true,
      data: video,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle watched status of video lesson for logged-in user & update course progress
// @route   POST /api/videos/:id/toggle-watch
// @access  Private
export const toggleVideoWatched = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    let video = await VideoLesson.findOne({
      $or: [{ videoId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!video) {
      video = initialVideos.find((v) => v.id === id || v.videoId === id);
    }

    const targetCourseId = video ? resolveCourseId(video) : 'web-dev-basics';

    if (req.user.role === 'student') {
      const enrolled = await isStudentEnrolled(userId, targetCourseId);
      if (!enrolled) {
        return res.status(403).json({
          success: false,
          message: 'Please enroll in this course to access the content.',
          isEnrolled: false,
        });
      }
    }

    let progress = await Progress.findOne({ user: userId });
    const targetVideoId = video ? (video.videoId || video.id) : id;

    if (!progress) {
      progress = await Progress.create({
        user: userId,
        watchedVideos: [targetVideoId],
        completedAssignments: [],
        enrolledCourses: [targetCourseId],
        courseProgress: [
          {
            courseId: targetCourseId,
            completedLessons: [targetVideoId],
            percentage: 25,
            lastAccessedLesson: targetVideoId,
            completed: false,
            updatedAt: new Date(),
          },
        ],
      });
    } else {
      if (progress.watchedVideos.includes(targetVideoId)) {
        progress.watchedVideos = progress.watchedVideos.filter((vId) => vId !== targetVideoId);
      } else {
        progress.watchedVideos.push(targetVideoId);
      }

      // Update per-course progress
      const totalLessons = await VideoLesson.countDocuments({ courseId: targetCourseId });
      const watchedForThisCourse = await VideoLesson.find({
        courseId: targetCourseId,
        videoId: { $in: progress.watchedVideos },
      });

      const effectiveTotal = Math.max(totalLessons, 1);
      const percentage = Math.min(Math.round((watchedForThisCourse.length / effectiveTotal) * 100), 100);
      const isCourseComplete = percentage >= 100;

      let cp = progress.courseProgress.find((c) => c.courseId === targetCourseId);
      if (cp) {
        cp.completedLessons = watchedForThisCourse.map((v) => v.videoId);
        cp.percentage = percentage;
        cp.lastAccessedLesson = targetVideoId;
        cp.completed = isCourseComplete;
        cp.updatedAt = new Date();
      } else {
        progress.courseProgress.push({
          courseId: targetCourseId,
          completedLessons: watchedForThisCourse.map((v) => v.videoId),
          percentage,
          lastAccessedLesson: targetVideoId,
          completed: isCourseComplete,
          updatedAt: new Date(),
        });
      }

      await progress.save();

      // Update enrollment progress percentage & status
      await Enrollment.findOneAndUpdate(
        { user: userId, courseId: targetCourseId },
        {
          progressPercentage: percentage,
          status: isCourseComplete ? 'completed' : 'active',
          ...(isCourseComplete ? { completedAt: new Date() } : {}),
        }
      );

      // If course is newly completed, generate certificate and notification
      if (isCourseComplete) {
        const courseDoc = await Course.findOne({ courseId: targetCourseId });
        const certExists = await Certificate.findOne({ user: userId, courseId: targetCourseId });
        if (!certExists) {
          const certId = `CERT-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
          await Certificate.create({
            certificateId: certId,
            user: userId,
            studentName: req.user.name,
            courseId: targetCourseId,
            courseName: courseDoc ? courseDoc.title : targetCourseId,
            instructorName: courseDoc ? courseDoc.instructor : 'Study Point Faculty',
            issueDate: new Date(),
            grade: 'Excellence (100%)',
          });

          await Notification.create({
            user: userId,
            title: '🎓 Course Completed & Certificate Ready!',
            message: `Congratulations! You have completed all lessons for ${courseDoc ? courseDoc.title : targetCourseId}. Your official certificate is now available.`,
            type: 'certificate_available',
            link: `/certificates/${certId}`,
          });
        }
      }
    }

    const isWatched = progress.watchedVideos.includes(targetVideoId);

    res.status(200).json({
      success: true,
      message: isWatched ? 'Lesson marked as completed!' : 'Lesson marked as incomplete.',
      data: {
        videoId: targetVideoId,
        isWatched,
        watchedVideos: progress.watchedVideos,
        courseProgress: progress.courseProgress,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new lesson / video
// @route   POST /api/videos
// @access  Private (Instructor/Admin)
export const createVideoLesson = async (req, res, next) => {
  try {
    const { title, courseId, embedUrl, duration, category, description, order } = req.body;

    if (!title || !embedUrl || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Title, courseId, and embedUrl are required.',
      });
    }

    const videoId = `video-${courseId}-${Date.now()}`;
    const lesson = await VideoLesson.create({
      videoId,
      courseId,
      title,
      embedUrl,
      duration: duration || '45 mins',
      category: category || 'Web Dev',
      description: description || '',
      order: order || 1,
    });

    res.status(201).json({
      success: true,
      message: 'Lesson added successfully.',
      data: lesson,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lesson / video
// @route   PUT /api/videos/:id
// @access  Private (Instructor/Admin)
export const updateVideoLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lesson = await VideoLesson.findOneAndUpdate(
      { $or: [{ videoId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      req.body,
      { new: true, runValidators: true }
    );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lesson updated successfully.',
      data: lesson,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lesson / video
// @route   DELETE /api/videos/:id
// @access  Private (Instructor/Admin)
export const deleteVideoLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lesson = await VideoLesson.findOneAndDelete({
      $or: [{ videoId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
