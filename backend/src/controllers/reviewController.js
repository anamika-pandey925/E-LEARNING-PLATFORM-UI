import Review from '../models/Review.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

// @desc    Get all reviews for a course
// @route   GET /api/reviews/course/:courseId
// @access  Public
export const getCourseReviews = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const reviews = await Review.find({ courseId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review for a course (Enrolled students only)
// @route   POST /api/reviews/course/:courseId
// @access  Private
export const addReview = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Rating and review comment are required.',
      });
    }

    // Verify enrollment
    const isEnrolled = await Enrollment.findOne({ user: userId, courseId });
    if (!isEnrolled && req.user.role === 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only enrolled students can review this course.',
      });
    }

    // Check if already reviewed
    let review = await Review.findOne({ user: userId, courseId });
    if (review) {
      review.rating = Number(rating);
      review.comment = comment;
      review.userName = req.user.name;
      review.userAvatar = req.user.avatar;
      await review.save();
    } else {
      review = await Review.create({
        user: userId,
        userName: req.user.name,
        userAvatar: req.user.avatar,
        courseId,
        rating: Number(rating),
        comment,
      });
    }

    // Recalculate average rating on Course
    const allReviews = await Review.find({ courseId });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    const roundedRating = Math.round(avgRating * 10) / 10;

    await Course.findOneAndUpdate(
      { courseId },
      { rating: roundedRating, numReviews: allReviews.length }
    );

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.',
      });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review.',
      });
    }

    const courseId = review.courseId;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate avg rating
    const allReviews = await Review.find({ courseId });
    const avgRating = allReviews.length > 0
      ? Math.round((allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length) * 10) / 10
      : 5.0;

    await Course.findOneAndUpdate(
      { courseId },
      { rating: avgRating, numReviews: allReviews.length }
    );

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
