import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema({
  pageNum: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const assignmentSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Assignment title is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
    },
    courseId: {
      type: String,
      default: 'web-dev-basics',
    },
    deadline: {
      type: String,
      default: 'Aug 30, 2026',
    },
    dueDate: {
      type: Date,
    },
    maxMarks: {
      type: Number,
      default: 100,
    },
    fileUrl: {
      type: String,
      default: '/assignment pdf/Assignments.pdf',
    },
    description: {
      type: String,
      required: [true, 'Assignment description is required'],
    },
    instructions: {
      type: String,
      default: 'Please follow the curriculum requirements, test thoroughly, and submit your solution.',
    },
    pages: [pageSchema],
  },
  {
    timestamps: true,
  }
);

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;
