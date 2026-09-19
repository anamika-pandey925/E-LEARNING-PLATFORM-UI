import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Progress from '../models/Progress.js';
import VideoLesson from '../models/VideoLesson.js';
import Assignment from '../models/Assignment.js';
import Quiz from '../models/Quiz.js';
import Review from '../models/Review.js';
import { initialCourses, initialVideos, initialAssignments } from '../utils/seedData.js';

// @desc    Get all courses with search, category, level, rating filters, and pagination
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res, next) => {
  try {
    const {
      search,
      category,
      level,
      minRating,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    let query = {};

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (level && level !== 'All' && level !== 'All Levels') {
      query.level = level;
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { instructor: searchRegex },
      ];
    }

    // Determine sort
    let sortOption = { createdAt: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'popular') sortOption = { studentsCount: -1 };
    if (sort === 'title') sortOption = { title: 1 };

    const total = await Course.countDocuments(query);
    let courses = await Course.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    // Initial seeding fallback if database is empty
    if (courses.length === 0 && !search && (!category || category === 'All') && pageNum === 1) {
      const globalCount = await Course.countDocuments();
      if (globalCount === 0) {
        await Course.insertMany(initialCourses);
        courses = await Course.find(query).sort(sortOption).limit(limitNum);
      }
    }

    const totalPages = Math.ceil(total / limitNum) || 1;

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by ID or slug with full curriculum preview
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let course = await Course.findOne({
      $or: [{ courseId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course not found with identifier '${id}'.`,
      });
    }

    // Fetch related lessons, assignments, quizzes, and reviews
    const targetCourseId = course.courseId;
    const [lessons, assignments, quizzes, reviews] = await Promise.all([
      VideoLesson.find({ courseId: targetCourseId }).sort({ order: 1 }).select('-embedUrl'),
      Assignment.find({ courseId: targetCourseId }).select('-pages.content'),
      Quiz.find({ courseId: targetCourseId }).select('-questions.correctOptionIndex'),
      Review.find({ courseId: targetCourseId }).sort({ createdAt: -1 }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...course.toObject(),
        lessonsCount: lessons.length,
        lessons,
        assignmentsCount: assignments.length,
        assignments,
        quizzesCount: quizzes.length,
        quizzes,
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check enrollment status of logged-in student for a course
// @route   GET /api/courses/:id/enrollment-status
// @access  Private
export const getEnrollmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const course = await Course.findOne({
      $or: [{ courseId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    const enrollment = await Enrollment.findOne({
      user: userId,
      courseId: course.courseId,
    });

    res.status(200).json({
      success: true,
      isEnrolled: !!enrollment,
      enrollment: enrollment || null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Enroll logged-in user in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
export const enrollCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const course = await Course.findOne({
      $or: [{ courseId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    const targetCourseId = course.courseId;

    // Check existing enrollment
    let existingEnrollment = await Enrollment.findOne({
      user: userId,
      courseId: targetCourseId,
    });

    if (existingEnrollment) {
      return res.status(200).json({
        success: true,
        message: 'You are already enrolled in this course.',
        data: existingEnrollment,
        enrollment: existingEnrollment,
      });
    }

    const enrollment = await Enrollment.create({
      user: userId,
      courseId: targetCourseId,
      progressPercentage: 0,
      status: 'active',
      enrolledAt: new Date(),
    });

    // Increment students count
    await Course.findByIdAndUpdate(course._id, {
      $inc: { studentsCount: 1 },
    });

    // Update user's progress record
    await Progress.findOneAndUpdate(
      { user: userId },
      {
        $addToSet: { enrolledCourses: targetCourseId },
        $push: {
          courseProgress: {
            courseId: targetCourseId,
            completedLessons: [],
            percentage: 0,
            lastAccessedLesson: '',
            completed: false,
            updatedAt: new Date(),
          },
        },
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in the course!',
      data: enrollment,
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all enrollments for logged-in user
// @route   GET /api/courses/my/enrollments
// @access  Private
export const getMyEnrollments = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const enrollments = await Enrollment.find({ user: userId }).sort({ enrolledAt: -1 });

    const courseIds = enrollments.map((e) => e.courseId);
    const courses = await Course.find({ courseId: { $in: courseIds } });
    const courseMap = {};
    courses.forEach((c) => {
      courseMap[c.courseId] = c;
    });

    const populatedEnrollments = enrollments.map((e) => ({
      _id: e._id,
      courseId: e.courseId,
      progressPercentage: e.progressPercentage,
      status: e.status,
      enrolledAt: e.enrolledAt,
      completedAt: e.completedAt,
      course: courseMap[e.courseId] || null,
    }));

    res.status(200).json({
      success: true,
      count: populatedEnrollments.length,
      data: populatedEnrollments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get protected course content (curriculum & lessons for enrolled students)
// @route   GET /api/courses/:id/content
// @access  Private (requires enrollment)
export const getCourseContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const course = await Course.findOne({
      $or: [{ courseId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    const targetCourseId = course.courseId;

    // Check enrollment unless admin/instructor
    if (req.user.role === 'student') {
      const enrollment = await Enrollment.findOne({
        user: userId,
        courseId: targetCourseId,
      });

      if (!enrollment) {
        return res.status(403).json({
          success: false,
          message: 'Please enroll in this course to access the curriculum content.',
        });
      }
    }

    const [lessons, assignments, quizzes] = await Promise.all([
      VideoLesson.find({ courseId: targetCourseId }).sort({ order: 1 }),
      Assignment.find({ courseId: targetCourseId }),
      Quiz.find({ courseId: targetCourseId }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        course,
        lessons,
        assignments,
        quizzes,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new course (Instructor/Admin)
// @route   POST /api/courses
// @access  Private (Instructor/Admin)
export const createCourse = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      duration,
      image,
      price,
      level,
      requirements,
      whatYouWillLearn,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and category are required.',
      });
    }

    const courseId = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existingCourse = await Course.findOne({ courseId });
    if (existingCourse) {
      return res.status(409).json({
        success: false,
        message: 'A course with this title/slug already exists.',
      });
    }

    const course = await Course.create({
      courseId,
      title,
      description,
      category,
      duration: duration || '10 hrs',
      image: image || 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80',
      instructor: req.user.name,
      instructorId: req.user._id,
      level: level || 'Beginner',
      price: price || 0,
      requirements: requirements || ['Basic computer literacy'],
      whatYouWillLearn: whatYouWillLearn || ['Course core competencies'],
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully.',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course (Instructor/Admin)
// @route   PUT /api/courses/:id
// @access  Private (Instructor/Admin)
export const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    let course = await Course.findOne({
      $or: [{ courseId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    // Check instructor ownership or admin
    if (req.user.role === 'instructor' && course.instructorId && course.instructorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit courses you authored.',
      });
    }

    const {
      title,
      description,
      category,
      duration,
      image,
      price,
      level,
      requirements,
      whatYouWillLearn,
      isPublished,
    } = req.body;

    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (duration) course.duration = duration;
    if (image) course.image = image;
    if (price !== undefined) course.price = price;
    if (level) course.level = level;
    if (requirements) course.requirements = requirements;
    if (whatYouWillLearn) course.whatYouWillLearn = whatYouWillLearn;
    if (isPublished !== undefined) course.isPublished = isPublished;

    const updated = await course.save();

    res.status(200).json({
      success: true,
      message: 'Course updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course (Instructor/Admin)
// @route   DELETE /api/courses/:id
// @access  Private (Instructor/Admin)
export const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    let course = await Course.findOne({
      $or: [{ courseId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    if (req.user.role === 'instructor' && course.instructorId && course.instructorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete courses you authored.',
      });
    }

    const targetCourseId = course.courseId;
    await Course.findByIdAndDelete(course._id);
    await VideoLesson.deleteMany({ courseId: targetCourseId });
    await Assignment.deleteMany({ courseId: targetCourseId });
    await Quiz.deleteMany({ courseId: targetCourseId });
    await Enrollment.deleteMany({ courseId: targetCourseId });
    await Review.deleteMany({ courseId: targetCourseId });

    res.status(200).json({
      success: true,
      message: 'Course and related lessons/assignments removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};
