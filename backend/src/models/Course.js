import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
    },
    duration: {
      type: String,
      default: '10 hrs',
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    students: {
      type: String,
      default: '1.2k',
    },
    studentsCount: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Course category is required'],
      default: 'Web Dev',
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80',
    },
    instructor: {
      type: String,
      default: 'Study Point Faculty',
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'Beginner',
    },
    price: {
      type: Number,
      default: 0,
    },
    requirements: {
      type: [String],
      default: ['Basic computer literacy', 'Desire to learn'],
    },
    whatYouWillLearn: {
      type: [String],
      default: ['Comprehensive industry skills', 'Real-world project construction', 'Best practices and design patterns'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Search indexes
courseSchema.index({ title: 'text', description: 'text', category: 'text' });
courseSchema.index({ category: 1, level: 1, rating: -1 });

const Course = mongoose.model('Course', courseSchema);
export default Course;
