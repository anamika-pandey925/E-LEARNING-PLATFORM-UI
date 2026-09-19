import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiClock,
  FiStar,
  FiUser,
  FiCheckCircle,
  FiLock,
  FiPlay,
  FiFileText,
  FiAward,
  FiHeart,
  FiArrowLeft,
  FiSend,
  FiCheck,
  FiBookOpen,
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import courseService from '../services/courseService';
import reviewService from '../services/reviewService';
import Button from '../components/Button';
import Loader from '../components/Loader';

const CourseDetails = () => {
  const { id, courseId: paramCourseId } = useParams();
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    isEnrolled,
    enrollInCourse,
    isWishlisted,
    toggleWishlist,
  } = useApp();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const courseId = id || paramCourseId;
  const enrolled = isEnrolled(courseId);
  const wishlisted = isWishlisted(courseId);

  const fetchCourseData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await courseService.getCourseById(courseId);
      if (res?.success && res.data) {
        setCourse(res.data);
        if (res.data.reviews) {
          setReviews(res.data.reviews);
        }
      } else {
        setError('Course details not found.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load course details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(`/courses/${courseId}`)}`);
      return;
    }

    setEnrolling(true);
    try {
      const res = await enrollInCourse(courseId);
      setToastMessage(res?.message || 'Enrolled successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      fetchCourseData();
    } finally {
      setEnrolling(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await reviewService.addReview(courseId, { rating, comment });
      if (res?.success) {
        setComment('');
        fetchCourseData();
        setToastMessage('Review submitted successfully!');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (err) {
      setToastMessage(err.message || 'Could not submit review.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-rose-400">{error || 'Course not found'}</h2>
        <Button to="/courses" variant="secondary">
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 text-left">
      {/* Toast Alert */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 pointer-events-none">
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="flex items-center space-x-3 p-4 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-400 max-w-sm shadow-2xl glass pointer-events-auto ml-auto"
            >
              <FiCheckCircle size={22} className="shrink-0" />
              <div>
                <p className="text-sm font-semibold">{toastMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Back button */}
      <Link
        to="/courses"
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
      >
        <FiArrowLeft size={16} />
        <span>Back to All Courses</span>
      </Link>

      {/* Course Hero Banner */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start glass p-6 sm:p-10 rounded-3xl border border-slate-800 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="lg:col-span-8 space-y-4 sm:space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-md bg-emerald-500 text-slate-950 text-xs font-bold uppercase tracking-wider">
              {course.category}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold">
              {course.level || 'Beginner'}
            </span>
          </div>

          <h1 className="font-poppins font-extrabold text-2xl sm:text-3xl md:text-4xl text-slate-100 leading-tight">
            {course.title}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-400 pt-2 border-t border-slate-800/80">
            <div className="flex items-center space-x-1.5">
              <FiUser className="text-emerald-400" />
              <span>Instructor: <strong className="text-slate-200">{course.instructor}</strong></span>
            </div>
            <div className="flex items-center space-x-1.5">
              <FiStar className="text-amber-400 fill-amber-400" />
              <span>{course.rating || 4.8} ({course.numReviews || reviews.length} reviews)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <FiClock className="text-slate-400" />
              <span>{course.duration}</span>
            </div>
          </div>
        </div>

        {/* Right CTA Card */}
        <div className="lg:col-span-4 glass p-5 sm:p-6 rounded-2xl border border-slate-800 flex flex-col space-y-4 sm:space-y-5 bg-slate-950/60 shadow-xl">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
            <img
              src={course.image || 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80'}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/90 text-slate-950 flex items-center justify-center shadow-lg">
                <FiPlay size={20} className="ml-1" />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {enrolled ? (
              <Button
                variant="primary"
                to="/videos"
                className="w-full justify-center py-3 space-x-2 text-sm font-semibold"
              >
                <FiPlay size={16} />
                <span>Resume Learning</span>
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full justify-center py-3 space-x-2 text-sm font-semibold"
              >
                <FiBookOpen size={16} />
                <span>{enrolling ? 'Enrolling...' : 'Enroll in Course (Free)'}</span>
              </Button>
            )}

            <button
              onClick={() => toggleWishlist(courseId)}
              className="w-full py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-300 hover:text-emerald-400 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
            >
              <FiHeart className={wishlisted ? 'text-rose-400 fill-rose-400' : ''} />
              <span>{wishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>

          <ul className="text-xs text-slate-400 space-y-2 pt-3 border-t border-slate-800">
            <li className="flex items-center space-x-2">
              <FiCheck className="text-emerald-400" />
              <span>Full lifetime curriculum access</span>
            </li>
            <li className="flex items-center space-x-2">
              <FiCheck className="text-emerald-400" />
              <span>Interactive coding assignments</span>
            </li>
            <li className="flex items-center space-x-2">
              <FiCheck className="text-emerald-400" />
              <span>Verified Course Graduation Certificate</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Main Details Grid: Left = Syllabus & What You'll Learn, Right = Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* What You Will Learn */}
          <section className="glass p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="font-poppins font-bold text-lg sm:text-xl text-slate-100">
              What You Will Learn
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(course.whatYouWillLearn || [
                'Master core foundations and best practices',
                'Build interactive real-world projects',
                'Understand responsive design patterns',
                'Prepare for industry and competitive evaluations',
              ]).map((item, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <FiCheck size={12} />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Curriculum / Syllabus Preview */}
          <section className="glass p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-poppins font-bold text-lg sm:text-xl text-slate-100">
                Course Curriculum
              </h2>
              <span className="text-xs text-slate-400 font-semibold">
                {course.lessons?.length || 4} Lessons • {course.duration}
              </span>
            </div>

            <div className="space-y-3">
              {(course.lessons && course.lessons.length > 0 ? course.lessons : [
                { title: 'HTML5 Semantic Architecture & Tags', duration: '45 mins' },
                { title: 'Modern CSS3 Layouts, Grid & Flexbox', duration: '50 mins' },
                { title: 'JavaScript Logic & DOM Manipulation', duration: '65 mins' },
                { title: 'Python Processing & Data Structures', duration: '70 mins' },
              ]).map((lesson, idx) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-200 truncate">
                      {lesson.title}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0 text-xs text-slate-400">
                    <span>{lesson.duration || '45 mins'}</span>
                    {enrolled ? (
                      <Link
                        to="/videos"
                        className="p-1 text-emerald-400 hover:text-emerald-300"
                        title="Watch Lesson"
                      >
                        <FiPlay size={16} />
                      </Link>
                    ) : (
                      <FiLock className="text-slate-500" size={16} title="Enroll to unlock" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Requirements */}
          <section className="glass p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-3">
            <h2 className="font-poppins font-bold text-lg sm:text-xl text-slate-100">
              Requirements
            </h2>
            <ul className="list-disc list-inside text-xs sm:text-sm text-slate-400 space-y-1.5 leading-relaxed">
              {(course.requirements || ['Basic computer usage', 'Standard modern browser', 'Eagerness to learn']).map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right Column: Reviews & Feedback */}
        <div className="lg:col-span-4 space-y-6">
          <section className="glass p-6 rounded-2xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-poppins font-bold text-base sm:text-lg text-slate-100">
                Student Feedback
              </h2>
              <div className="flex items-center space-x-1 text-amber-400 text-sm font-bold">
                <FiStar className="fill-amber-400" />
                <span>{course.rating || 4.8}</span>
              </div>
            </div>

            {/* Submit Review Form (if enrolled) */}
            {enrolled ? (
              <form onSubmit={handleReviewSubmit} className="space-y-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Write a Review
                </h4>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Rating</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-lg transition-transform ${star <= rating ? 'text-amber-400 scale-110' : 'text-slate-600'}`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="text-xs text-slate-400 ml-2">{rating}/5 Stars</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Your Feedback</label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share what you liked about this course..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full justify-center py-2 text-xs font-semibold"
                  disabled={submittingReview}
                >
                  <FiSend size={13} className="mr-1.5" />
                  <span>{submittingReview ? 'Submitting...' : 'Post Review'}</span>
                </Button>
              </form>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
                Enroll in this course to leave student feedback.
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
              {reviews.length > 0 ? (
                reviews.map((r, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={r.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'}
                          alt={r.userName}
                          className="w-6 h-6 rounded-full object-cover border border-emerald-500/40"
                        />
                        <span className="text-xs font-semibold text-slate-200">{r.userName}</span>
                      </div>
                      <div className="flex text-amber-400 text-xs">
                        {'★'.repeat(r.rating || 5)}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{r.comment}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">
                  No student reviews yet. Be the first to review!
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
