import mongoose from 'mongoose';

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentName: {
      type: String,
      default: 'Student',
    },
    assignmentId: {
      type: String,
      required: true,
      trim: true,
    },
    courseId: {
      type: String,
      default: 'web-dev-basics',
    },
    content: {
      type: String,
      default: '',
    },
    fileUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'graded'],
      default: 'submitted',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    marks: {
      type: Number,
      default: 0,
    },
    maxMarks: {
      type: Number,
      default: 100,
    },
    feedback: {
      type: String,
      default: 'Successfully submitted and verified by system.',
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    gradedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate submission index for user + assignmentId
assignmentSubmissionSchema.index({ user: 1, assignmentId: 1 }, { unique: true });

const AssignmentSubmission = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);
export default AssignmentSubmission;
