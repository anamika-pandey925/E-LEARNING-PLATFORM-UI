import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Category from './models/Category.js';
import Course from './models/Course.js';
import VideoLesson from './models/VideoLesson.js';
import Assignment from './models/Assignment.js';
import AssignmentSubmission from './models/AssignmentSubmission.js';
import Progress from './models/Progress.js';
import Enrollment from './models/Enrollment.js';
import Quiz from './models/Quiz.js';
import QuizAttempt from './models/QuizAttempt.js';
import Review from './models/Review.js';
import Certificate from './models/Certificate.js';
import Notification from './models/Notification.js';
import Discussion from './models/Discussion.js';
import ContactMessage from './models/ContactMessage.js';
import { initialCourses, initialVideos, initialAssignments } from './utils/seedData.js';

dotenv.config();

const defaultCategories = [
  { name: 'Web Dev', slug: 'web-dev', description: 'HTML, CSS, modern JavaScript, frontend frameworks and web stacks.', icon: 'FiCode' },
  { name: 'Programming', slug: 'programming', description: 'Core programming constructs, data structures, algorithms, and logic.', icon: 'FiTerminal' },
  { name: 'Data Science', slug: 'data-science', description: 'Data analysis, Python, Pandas, machine learning, and visualization.', icon: 'FiDatabase' },
  { name: 'Academic', slug: 'academic', description: 'Competitive test prep, mathematics, science fundamentals, and English grammar.', icon: 'FiBookOpen' },
  { name: 'UI/UX Design', slug: 'ui-ux', description: 'Wireframing, prototyping, design systems, and responsive interface design.', icon: 'FiLayout' },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Clearing old records...');
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Course.deleteMany(),
      VideoLesson.deleteMany(),
      Assignment.deleteMany(),
      AssignmentSubmission.deleteMany(),
      Progress.deleteMany(),
      Enrollment.deleteMany(),
      Quiz.deleteMany(),
      QuizAttempt.deleteMany(),
      Review.deleteMany(),
      Certificate.deleteMany(),
      Notification.deleteMany(),
      Discussion.deleteMany(),
      ContactMessage.deleteMany(),
    ]);

    console.log('[Seeder] Seeding default users (Student, Instructor, Admin)...');
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@studypoint.com',
      password: 'password123',
      role: 'admin',
      avatar: '/studypoint-avatar.png',
      bio: 'Head Administrator of Study Point Platform.',
    });

    const instructor = await User.create({
      name: 'Alex Rivera',
      email: 'instructor@studypoint.com',
      password: 'password123',
      role: 'instructor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
      bio: 'Senior Web Architect and Lead Instructor for Full-Stack Technologies.',
    });

    const student = await User.create({
      name: 'Demo Student',
      email: 'student@studypoint.com',
      password: 'password123',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
      bio: 'Full-stack enthusiast and certified student at Study Point.',
    });

    console.log('[Seeder] Seeding categories...');
    await Category.insertMany(defaultCategories);

    console.log('[Seeder] Seeding courses with instructor associations...');
    const coursesWithInstructor = initialCourses.map((c) => ({
      ...c,
      instructorId: instructor._id,
      studentsCount: parseInt(c.students) * 1000 || 1200,
    }));
    await Course.insertMany(coursesWithInstructor);

    console.log('[Seeder] Seeding video lessons...');
    await VideoLesson.insertMany(initialVideos);

    console.log('[Seeder] Seeding practical assignments...');
    await Assignment.insertMany(initialAssignments);

    console.log('[Seeder] Seeding sample quizzes...');
    await Quiz.create([
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
            questionText: 'Which JavaScript method is used to write text into the browser console?',
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
        ],
      },
    ]);

    console.log('[Seeder] Seeding initial student enrollments, progress, and submissions...');
    await Enrollment.create({
      user: student._id,
      courseId: 'web-dev-basics',
      progressPercentage: 50,
      status: 'active',
      enrolledAt: new Date(),
    });

    await Enrollment.create({
      user: student._id,
      courseId: 'javascript-beginners',
      progressPercentage: 100,
      status: 'completed',
      completedAt: new Date(),
      enrolledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    });

    await Progress.create({
      user: student._id,
      enrolledCourses: ['web-dev-basics', 'javascript-beginners'],
      watchedVideos: ['video-html-basics', 'video-js-beginners'],
      completedAssignments: ['html-basics'],
      courseProgress: [
        {
          courseId: 'web-dev-basics',
          completedLessons: ['video-html-basics'],
          percentage: 50,
          lastAccessedLesson: 'video-html-basics',
          completed: false,
          updatedAt: new Date(),
        },
        {
          courseId: 'javascript-beginners',
          completedLessons: ['video-js-beginners'],
          percentage: 100,
          lastAccessedLesson: 'video-js-beginners',
          completed: true,
          updatedAt: new Date(),
        },
      ],
    });

    // Sample assignment submission
    await AssignmentSubmission.create({
      user: student._id,
      studentName: student.name,
      assignmentId: 'html-basics',
      courseId: 'web-dev-basics',
      content: 'Responsive HTML landing page with validated form inputs created according to specs.',
      status: 'graded',
      marks: 95,
      maxMarks: 100,
      feedback: 'Excellent work! Clean semantic tag usage and good form accessibility tags.',
      gradedBy: instructor._id,
      gradedAt: new Date(),
    });

    // Sample Certificate
    const sampleCertId = 'CERT-JS-2026-9842';
    await Certificate.create({
      certificateId: sampleCertId,
      user: student._id,
      studentName: student.name,
      courseId: 'javascript-beginners',
      courseName: 'JavaScript for Beginners',
      instructorName: 'Sarah Chen, Full-Stack Developer',
      issueDate: new Date(),
      grade: 'Distinction (100%)',
    });

    // Sample Reviews
    await Review.create([
      {
        user: student._id,
        userName: student.name,
        userAvatar: student.avatar,
        courseId: 'web-dev-basics',
        rating: 5,
        comment: 'Fantastic starting curriculum! The video walkthroughs and PDF assignments made learning crystal clear.',
      },
      {
        user: instructor._id,
        userName: instructor.name,
        userAvatar: instructor.avatar,
        courseId: 'javascript-beginners',
        rating: 5,
        comment: 'Comprehensive deep dive into modern asynchronous JavaScript, DOM, and event handling.',
      },
    ]);

    // Sample Notifications
    await Notification.create([
      {
        user: student._id,
        title: '🎓 Certificate Issued!',
        message: 'Congratulations! Your certificate for "JavaScript for Beginners" is ready for viewing and download.',
        type: 'certificate_available',
        link: `/certificates/${sampleCertId}`,
        read: false,
      },
      {
        user: student._id,
        title: '📝 Assignment Graded',
        message: 'Your assignment "HTML Structure & Forms" was graded: 95/100 marks.',
        type: 'assignment_graded',
        link: '/assignments',
        read: false,
      },
    ]);

    // Sample Discussion Thread
    await Discussion.create({
      courseId: 'web-dev-basics',
      user: student._id,
      userName: student.name,
      userAvatar: student.avatar,
      question: 'What is the best way to center a child div using modern CSS Flexbox vs Grid?',
      replies: [
        {
          user: instructor._id,
          userName: instructor.name,
          userAvatar: instructor.avatar,
          userRole: 'instructor',
          answer: 'For Flexbox, set "display: flex; justify-content: center; align-items: center;" on the parent. With CSS Grid, "display: grid; place-items: center;" is a super clean single-line shorthand!',
          createdAt: new Date(),
        },
      ],
    });

    // Sample Contact Message
    await ContactMessage.create({
      name: 'Alice Johnson',
      email: 'alice@example.com',
      subject: 'Inquiry on Full Stack Curriculum',
      message: 'Hello, I would like to know if upcoming modules will cover TypeScript and Next.js. Thank you!',
      status: 'unread',
    });

    console.log('========================================================');
    console.log('✅ [Seeder] Database Seeded Successfully with Real Data!');
    console.log('========================================================');
    console.log('Demo Credentials for Testing:');
    console.log('👑 Admin:      admin@studypoint.com      / password123');
    console.log('👨‍🏫 Instructor: instructor@studypoint.com / password123');
    console.log('👨‍🎓 Student:    student@studypoint.com    / password123');
    console.log('========================================================');
    process.exit(0);
  } catch (error) {
    console.error(`❌ [Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
