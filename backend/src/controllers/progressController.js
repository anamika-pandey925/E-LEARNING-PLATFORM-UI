import Progress from '../models/Progress.js';
import Enrollment from '../models/Enrollment.js';

// @desc    Get progress for logged-in user in a specific course
// @route   GET /api/progress/:courseId
// @access  Private
export const getCourseProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const progress = await Progress.findOne({ user: userId });
    const enrollment = await Enrollment.findOne({ user: userId, courseId });

    const cp = progress?.courseProgress?.find((c) => c.courseId === courseId) || null;

    res.status(200).json({
      success: true,
      data: {
        courseId,
        percentage: enrollment?.progressPercentage || cp?.percentage || 0,
        completedLessons: cp?.completedLessons || [],
        lastAccessedLesson: cp?.lastAccessedLesson || '',
        completed: enrollment?.status === 'completed' || cp?.completed || false,
        watchedVideos: progress?.watchedVideos || [],
        completedAssignments: progress?.completedAssignments || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update progress for course
// @route   PUT /api/progress/:courseId
// @access  Private
export const updateCourseProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { completedLessons, percentage, lastAccessedLesson } = req.body;
    const userId = req.user._id;

    let progress = await Progress.findOne({ user: userId });
    if (!progress) {
      progress = await Progress.create({
        user: userId,
        watchedVideos: completedLessons || [],
        completedAssignments: [],
        enrolledCourses: [courseId],
        courseProgress: [
          {
            courseId,
            completedLessons: completedLessons || [],
            percentage: percentage || 0,
            lastAccessedLesson: lastAccessedLesson || '',
            completed: (percentage || 0) >= 100,
            updatedAt: new Date(),
          },
        ],
      });
    } else {
      let cp = progress.courseProgress.find((c) => c.courseId === courseId);
      if (cp) {
        if (completedLessons) cp.completedLessons = completedLessons;
        if (percentage !== undefined) cp.percentage = percentage;
        if (lastAccessedLesson) cp.lastAccessedLesson = lastAccessedLesson;
        cp.completed = (cp.percentage >= 100);
        cp.updatedAt = new Date();
      } else {
        progress.courseProgress.push({
          courseId,
          completedLessons: completedLessons || [],
          percentage: percentage || 0,
          lastAccessedLesson: lastAccessedLesson || '',
          completed: (percentage || 0) >= 100,
          updatedAt: new Date(),
        });
      }
      await progress.save();
    }

    if (percentage !== undefined) {
      await Enrollment.findOneAndUpdate(
        { user: userId, courseId },
        {
          progressPercentage: percentage,
          status: percentage >= 100 ? 'completed' : 'active',
          ...(percentage >= 100 ? { completedAt: new Date() } : {}),
        }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully.',
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};
