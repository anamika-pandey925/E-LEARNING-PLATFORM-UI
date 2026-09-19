import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import Notification from '../models/Notification.js';
import Progress from '../models/Progress.js';

// Sample default quizzes
const defaultQuizzes = [
  {
    quizId: 'web-dev-quiz-1',
    title: 'Web Technologies & Basics Quiz',
    description: 'Evaluate your knowledge of HTML semantics, CSS selectors, and JavaScript core syntax.',
    courseId: 'web-dev-basics',
    courseCategory: 'Web Dev',
    durationMinutes: 15,
    passingPercentage: 60,
    questions: [
      {
        questionText: 'Which HTML tag is used to define an internal stylesheet?',
        options: ['<script>', '<css>', '<style>', '<link>'],
        correctOptionIndex: 2,
        points: 10,
        explanation: 'The <style> element is used inside HTML to declare embedded CSS rules.',
      },
      {
        questionText: 'What is the correct CSS syntax to select an element with id="main"?',
        options: ['#main', '.main', 'main', '*main'],
        correctOptionIndex: 0,
        points: 10,
        explanation: 'In CSS, the hash symbol (#) denotes an ID selector.',
      },
      {
        questionText: 'Which JavaScript method is used to write output into the browser console?',
        options: ['console.print()', 'console.log()', 'browser.log()', 'document.write()'],
        correctOptionIndex: 1,
        points: 10,
        explanation: 'console.log() is standard across all modern browser engines for diagnostic logging.',
      },
      {
        questionText: 'Which CSS layout model allows distributing items along rows and columns simultaneously?',
        options: ['Floats', 'CSS Grid', 'Flexbox', 'Position Absolute'],
        correctOptionIndex: 1,
        points: 10,
        explanation: 'CSS Grid is a 2-dimensional layout system handling both columns and rows.',
      },
      {
        questionText: 'What does the "typeof" operator in JavaScript return for an Array?',
        options: ['"array"', '"list"', '"object"', '"collection"'],
        correctOptionIndex: 2,
        points: 10,
        explanation: 'In JavaScript, Arrays are technically objects, so typeof [] returns "object". Use Array.isArray() to distinguish.',
      },
    ],
  },
  {
    quizId: 'js-quiz-1',
    title: 'JavaScript Asynchronous & DOM Master Quiz',
    description: 'Test your understanding of promises, event bubbling, array transformations, and closures.',
    courseId: 'javascript-beginners',
    courseCategory: 'Programming',
    durationMinutes: 20,
    passingPercentage: 60,
    questions: [
      {
        questionText: 'Which keyword creates a block-scoped variable in modern ES6 JavaScript?',
        options: ['var', 'let', 'set', 'define'],
        correctOptionIndex: 1,
        points: 10,
        explanation: 'let and const provide block-scoping in JavaScript.',
      },
      {
        questionText: 'What will Promise.all() do if any of the passed promises rejects?',
        options: ['Ignore the rejection', 'Reject immediately with that error', 'Wait for others to finish', 'Retry automatically'],
        correctOptionIndex: 1,
        points: 10,
        explanation: 'Promise.all fails fast and rejects as soon as any single promise rejects.',
      },
      {
        questionText: 'Which array method returns a brand new array with transformed items?',
        options: ['forEach()', 'map()', 'filter()', 'reduce()'],
        correctOptionIndex: 1,
        points: 10,
        explanation: 'map() invokes a callback on each element and returns a new array of returned items.',
      },
    ],
  },
];

// @desc    Get all quizzes or filtered by courseId
// @route   GET /api/quizzes
// @access  Public
export const getQuizzes = async (req, res, next) => {
  try {
    const { courseId } = req.query;
    let query = {};
    if (courseId) query.courseId = courseId;

    let quizzes = await Quiz.find(query).select('-questions.correctOptionIndex');

    if (quizzes.length === 0 && !courseId) {
      const count = await Quiz.countDocuments();
      if (count === 0) {
        await Quiz.insertMany(defaultQuizzes);
        quizzes = await Quiz.find(query).select('-questions.correctOptionIndex');
      }
    }

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single quiz by ID (without leaking answers to frontend)
// @route   GET /api/quizzes/:id
// @access  Public
export const getQuizById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let quiz = await Quiz.findOne({
      $or: [{ quizId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    }).select('-questions.correctOptionIndex');

    if (!quiz) {
      quiz = defaultQuizzes.find((q) => q.quizId === id);
    }

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit quiz and calculate score safely on backend
// @route   POST /api/quizzes/:id/submit
// @access  Private
export const submitQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { answers } = req.body; // array of selected option indices
    const userId = req.user._id;

    const quiz = await Quiz.findOne({
      $or: [{ quizId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    }).select('+questions.correctOptionIndex');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found.',
      });
    }

    let score = 0;
    let maxScore = 0;
    const totalQuestions = quiz.questions.length;
    let correctAnswersCount = 0;
    const gradedAnswers = [];

    quiz.questions.forEach((question, index) => {
      const pts = question.points || 10;
      maxScore += pts;
      const selectedIndex = answers && answers[index] !== undefined ? answers[index] : null;
      const isCorrect = selectedIndex === question.correctOptionIndex;

      if (isCorrect) {
        score += pts;
        correctAnswersCount++;
      }

      gradedAnswers.push({
        questionIndex: index,
        selectedOptionIndex: selectedIndex,
        correctOptionIndex: question.correctOptionIndex,
        isCorrect,
        explanation: question.explanation || '',
      });
    });

    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const passed = percentage >= (quiz.passingPercentage || 60);

    // Save attempt record in MongoDB
    const attempt = await QuizAttempt.create({
      user: userId,
      quizId: quiz.quizId,
      courseId: quiz.courseId,
      answers: gradedAnswers,
      score,
      totalQuestions,
      percentage,
      passed,
      submittedAt: new Date(),
    });

    // Create student notification
    await Notification.create({
      user: userId,
      title: passed ? '🎉 Quiz Passed!' : '📝 Quiz Result Available',
      message: `You scored ${percentage}% (${correctAnswersCount}/${totalQuestions} correct) on "${quiz.title}".`,
      type: 'quiz_result',
      link: `/quizzes`,
    });

    res.status(200).json({
      success: true,
      message: passed ? 'Congratulations, you passed the quiz!' : 'Quiz completed. Review your answers and try again!',
      data: {
        attemptId: attempt._id,
        score,
        maxScore,
        totalQuestions,
        correctAnswersCount,
        percentage,
        passed,
        passingPercentage: quiz.passingPercentage || 60,
        answersFeedback: gradedAnswers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's past attempts for a quiz
// @route   GET /api/quizzes/:id/attempts
// @access  Private
export const getQuizAttempts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const quiz = await Quiz.findOne({
      $or: [{ quizId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    const targetQuizId = quiz ? quiz.quizId : id;

    const attempts = await QuizAttempt.find({
      user: userId,
      quizId: targetQuizId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a quiz (Instructor/Admin)
// @route   POST /api/quizzes
// @access  Private (Instructor/Admin)
export const createQuiz = async (req, res, next) => {
  try {
    const { title, description, courseId, courseCategory, durationMinutes, passingPercentage, questions } = req.body;

    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Title and questions array are required.',
      });
    }

    const quizId = `quiz-${courseId || 'general'}-${Date.now()}`;
    const quiz = await Quiz.create({
      quizId,
      title,
      description: description || 'Course evaluation quiz',
      courseId: courseId || 'web-dev-basics',
      courseCategory: courseCategory || 'Web Dev',
      durationMinutes: durationMinutes || 15,
      passingPercentage: passingPercentage || 60,
      questions,
    });

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully.',
      data: quiz,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a quiz (Instructor/Admin)
// @route   PUT /api/quizzes/:id
// @access  Private (Instructor/Admin)
export const updateQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findOneAndUpdate(
      { $or: [{ quizId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      req.body,
      { new: true, runValidators: true }
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Quiz updated successfully.',
      data: quiz,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a quiz (Instructor/Admin)
// @route   DELETE /api/quizzes/:id
// @access  Private (Instructor/Admin)
export const deleteQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findOneAndDelete({
      $or: [{ quizId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
