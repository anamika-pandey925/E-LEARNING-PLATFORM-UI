import Discussion from '../models/Discussion.js';
import Notification from '../models/Notification.js';

// @desc    Get all discussion threads for a course
// @route   GET /api/discussions/:courseId
// @access  Public
export const getCourseDiscussions = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const discussions = await Discussion.find({ courseId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: discussions.length,
      data: discussions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new discussion question thread
// @route   POST /api/discussions/:courseId
// @access  Private
export const createDiscussionThread = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { question } = req.body;
    const userId = req.user._id;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Question text is required.',
      });
    }

    const thread = await Discussion.create({
      courseId,
      user: userId,
      userName: req.user.name,
      userAvatar: req.user.avatar,
      question: question.trim(),
      replies: [],
    });

    res.status(201).json({
      success: true,
      message: 'Question posted to course forum!',
      data: thread,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reply to a discussion thread
// @route   POST /api/discussions/:id/reply
// @access  Private
export const replyToThread = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;
    const userId = req.user._id;

    if (!answer || !answer.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Reply message cannot be empty.',
      });
    }

    const thread = await Discussion.findById(id);
    if (!thread) {
      return res.status(404).json({
        success: false,
        message: 'Discussion thread not found.',
      });
    }

    const reply = {
      user: userId,
      userName: req.user.name,
      userAvatar: req.user.avatar,
      userRole: req.user.role || 'student',
      answer: answer.trim(),
      createdAt: new Date(),
    };

    thread.replies.push(reply);
    await thread.save();

    // If replier is not original author, send notification
    if (thread.user.toString() !== userId.toString()) {
      await Notification.create({
        user: thread.user,
        title: '💬 New Reply to Your Question',
        message: `${req.user.name} replied to your forum question in ${thread.courseId}.`,
        type: 'general',
        link: `/videos`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reply posted successfully.',
      data: thread,
    });
  } catch (error) {
    next(error);
  }
};
