import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    watchedVideos: {
      type: [String],
      default: [],
    },
    completedAssignments: {
      type: [String],
      default: [],
    },
    enrolledCourses: {
      type: [String],
      default: [],
    },
    courseProgress: [
      {
        courseId: { type: String, required: true },
        completedLessons: { type: [String], default: [] },
        percentage: { type: Number, default: 0 },
        lastAccessedLesson: { type: String, default: '' },
        completed: { type: Boolean, default: false },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
