import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import Progress from '../models/Progress.js';
import Notification from '../models/Notification.js';
import { initialAssignments } from '../utils/seedData.js';
import { resolveCourseId, isStudentEnrolled } from '../middleware/authMiddleware.js';

// @desc    Get all assignments with optional search and subject filter
// @route   GET /api/assignments
// @access  Public
export const getAssignments = async (req, res, next) => {
  try {
    const { search, subject, courseId } = req.query;

    let query = {};

    if (subject && subject !== 'All') {
      query.subject = subject;
    }

    if (courseId) {
      query.courseId = courseId;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }, { subject: searchRegex }];
    }

    let assignments = await Assignment.find(query).sort({ createdAt: -1 });

    if (assignments.length === 0 && !search && (!subject || subject === 'All') && !courseId) {
      const count = await Assignment.countDocuments();
      if (count === 0) {
        await Assignment.insertMany(initialAssignments);
        assignments = await Assignment.find(query).sort({ createdAt: -1 });
      }
    }

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single assignment by ID (requires login + enrollment)
// @route   GET /api/assignments/:id
// @access  Private (Enrolled only)
export const getAssignmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    let assignment = await Assignment.findOne({
      $or: [{ assignmentId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!assignment) {
      assignment = initialAssignments.find((a) => a.id === id || a.assignmentId === id);
    }

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found.',
      });
    }

    if (req.user.role === 'student') {
      const courseId = resolveCourseId(assignment);
      const enrolled = await isStudentEnrolled(userId, courseId);

      if (!enrolled) {
        return res.status(403).json({
          success: false,
          message: 'Please enroll in this course to access the assignment curriculum.',
          isEnrolled: false,
        });
      }
    }

    // Also fetch current user submission if exists
    const targetAssignmentId = assignment.assignmentId || assignment.id;
    const userSubmission = await AssignmentSubmission.findOne({
      user: userId,
      assignmentId: targetAssignmentId,
    });

    res.status(200).json({
      success: true,
      data: {
        ...assignment.toObject(),
        submission: userSubmission || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit an assignment solution
// @route   POST /api/assignments/:id/submit
// @access  Private
export const submitAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { content, fileUrl } = req.body;

    let assignment = await Assignment.findOne({
      $or: [{ assignmentId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!assignment) {
      assignment = initialAssignments.find((a) => a.id === id || a.assignmentId === id);
    }

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found.',
      });
    }

    const courseId = resolveCourseId(assignment);

    if (req.user.role === 'student') {
      const enrolled = await isStudentEnrolled(userId, courseId);
      if (!enrolled) {
        return res.status(403).json({
          success: false,
          message: 'Please enroll in this course to submit assignments.',
          isEnrolled: false,
        });
      }
    }

    const targetAssignmentId = assignment.assignmentId || assignment.id;

    // Create or update submission record
    const submission = await AssignmentSubmission.findOneAndUpdate(
      { user: userId, assignmentId: targetAssignmentId },
      {
        studentName: req.user.name,
        courseId,
        content: content || 'Practical solution code submitted via platform.',
        fileUrl: fileUrl || '',
        status: 'submitted',
        submittedAt: new Date(),
        maxMarks: assignment.maxMarks || 100,
        marks: 100,
        feedback: 'Submission logged. Instructor review in progress.',
      },
      { upsert: true, new: true }
    );

    // Update student progress record
    const progress = await Progress.findOneAndUpdate(
      { user: userId },
      { $addToSet: { completedAssignments: targetAssignmentId } },
      { upsert: true, new: true }
    );

    // Create confirmation notification
    await Notification.create({
      user: userId,
      title: '📁 Assignment Submitted',
      message: `Your assignment "${assignment.title}" has been received and logged for review.`,
      type: 'assignment_due',
      link: '/assignments',
    });

    res.status(200).json({
      success: true,
      message: 'Assignment submitted successfully!',
      data: {
        submission,
        completedAssignments: progress.completedAssignments,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all submissions for a particular assignment (Instructor/Admin)
// @route   GET /api/assignments/:id/submissions
// @access  Private (Instructor/Admin)
export const getSubmissionsForAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const submissions = await AssignmentSubmission.find({ assignmentId: id })
      .populate('user', 'name email avatar')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pending and reviewed submissions across all assignments (Instructor/Admin)
// @route   GET /api/assignments/admin/all-submissions
// @access  Private (Instructor/Admin)
export const getAllSubmissions = async (req, res, next) => {
  try {
    const submissions = await AssignmentSubmission.find()
      .populate('user', 'name email avatar')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Grade an assignment submission and give feedback (Instructor/Admin)
// @route   PUT /api/assignments/submissions/:id/grade
// @access  Private (Instructor/Admin)
export const gradeSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { marks, feedback, status } = req.body;

    const submission = await AssignmentSubmission.findById(id);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found.',
      });
    }

    if (marks !== undefined) submission.marks = Number(marks);
    if (feedback !== undefined) submission.feedback = feedback;
    submission.status = status || 'graded';
    submission.gradedBy = req.user._id;
    submission.gradedAt = new Date();

    await submission.save();

    // Notify student of grading feedback
    await Notification.create({
      user: submission.user,
      title: '🎯 Assignment Graded',
      message: `Your submission for assignment "${submission.assignmentId}" has been graded: ${submission.marks}/${submission.maxMarks || 100} marks. Feedback: "${submission.feedback}"`,
      type: 'assignment_graded',
      link: '/assignments',
    });

    res.status(200).json({
      success: true,
      message: 'Submission graded successfully.',
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new assignment (Instructor/Admin)
// @route   POST /api/assignments
// @access  Private (Instructor/Admin)
export const createAssignment = async (req, res, next) => {
  try {
    const { title, subject, courseId, deadline, description, instructions, maxMarks, pages, fileUrl } = req.body;

    if (!title || !subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title, subject, and description are required.',
      });
    }

    const assignmentId = `assignment-${(subject || 'general').toLowerCase()}-${Date.now()}`;
    const assignment = await Assignment.create({
      assignmentId,
      title,
      subject,
      courseId: courseId || 'web-dev-basics',
      deadline: deadline || 'Aug 30, 2026',
      description,
      instructions: instructions || 'Follow the task guidelines and submit solution.',
      maxMarks: maxMarks || 100,
      fileUrl: fileUrl || '/assignment pdf/Assignments.pdf',
      pages: pages || [
        {
          pageNum: 1,
          title: `${title} Task Sheet`,
          content: description,
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully.',
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update assignment (Instructor/Admin)
// @route   PUT /api/assignments/:id
// @access  Private (Instructor/Admin)
export const updateAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findOneAndUpdate(
      { $or: [{ assignmentId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      req.body,
      { new: true, runValidators: true }
    );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Assignment updated successfully.',
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete assignment (Instructor/Admin)
// @route   DELETE /api/assignments/:id
// @access  Private (Instructor/Admin)
export const deleteAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findOneAndDelete({
      $or: [{ assignmentId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
