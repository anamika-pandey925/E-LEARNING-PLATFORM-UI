import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
      trim: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    instructorName: {
      type: String,
      default: 'Study Point Faculty',
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    grade: {
      type: String,
      default: 'Excellence (100%)',
    },
  },
  {
    timestamps: true,
  }
);

certificateSchema.index({ user: 1, courseId: 1 }, { unique: true });
certificateSchema.index({ certificateId: 1 });

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;
