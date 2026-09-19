import Wishlist from '../models/Wishlist.js';
import Course from '../models/Course.js';

// @desc    Get logged in user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const wishlistItems = await Wishlist.find({ user: userId });
    const courseIds = wishlistItems.map((w) => w.courseId);

    const courses = await Course.find({ courseId: { $in: courseIds } });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
      courseIds,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add course to wishlist
// @route   POST /api/wishlist/:courseId
// @access  Private
export const addToWishlist = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const exists = await Wishlist.findOne({ user: userId, courseId });
    if (exists) {
      return res.status(200).json({
        success: true,
        message: 'Course is already in your wishlist.',
      });
    }

    await Wishlist.create({ user: userId, courseId });

    res.status(201).json({
      success: true,
      message: 'Course added to wishlist!',
      courseId,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove course from wishlist
// @route   DELETE /api/wishlist/:courseId
// @access  Private
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    await Wishlist.findOneAndDelete({ user: userId, courseId });

    res.status(200).json({
      success: true,
      message: 'Course removed from wishlist.',
      courseId,
    });
  } catch (error) {
    next(error);
  }
};
