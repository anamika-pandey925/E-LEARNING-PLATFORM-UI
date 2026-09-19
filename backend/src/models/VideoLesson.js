import mongoose from 'mongoose';

const videoLessonSchema = new mongoose.Schema(
  {
    videoId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    courseId: {
      type: String,
      required: [true, 'Course ID reference is required'],
      default: 'web-dev-basics',
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
    },
    embedUrl: {
      type: String,
      required: [true, 'Video embed URL is required'],
    },
    duration: {
      type: String,
      default: '45 mins',
    },
    category: {
      type: String,
      required: [true, 'Video category is required'],
      default: 'Web Dev',
    },
    description: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 1,
    },
    resources: [
      {
        title: { type: String },
        url: { type: String },
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

videoLessonSchema.index({ courseId: 1, order: 1 });

const VideoLesson = mongoose.model('VideoLesson', videoLessonSchema);
export default VideoLesson;
