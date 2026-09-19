import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true, select: false },
  points: { type: Number, default: 10 },
  explanation: { type: String, default: '' },
});

const quizSchema = new mongoose.Schema(
  {
    quizId: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true },
    description: { type: String, default: 'Test your understanding with this course quiz.' },
    courseId: { type: String, default: 'web-dev-basics' },
    courseCategory: { type: String, default: 'Web Dev' },
    durationMinutes: { type: Number, default: 15 },
    passingPercentage: { type: Number, default: 60 },
    questions: [questionSchema],
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
