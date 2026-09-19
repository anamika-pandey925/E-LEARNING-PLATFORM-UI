import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiStar, FiUser, FiCheckCircle, FiHeart, FiEye, FiArrowRight } from 'react-icons/fi';
import Button from './Button';
import { useApp } from '../context/AppContext';

const CourseCard = ({ course, onEnroll, isEnrolled, isEnrolling }) => {
  const { isWishlisted, toggleWishlist } = useApp();
  const { id, title, description, duration, rating, students, category, image, level, instructor } = course;
  const courseId = id || course.courseId;
  const wishlisted = isWishlisted(courseId);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(courseId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-2xl overflow-hidden border border-slate-800/80 hover:border-emerald-500/30 transition-all duration-300 flex flex-col h-full hover:shadow-xl hover:shadow-emerald-500/5 group text-left relative"
    >
      {/* Course Image & Badges */}
      <div className="relative h-48 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 opacity-70" />
        <img
          src={image || 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Category Pill */}
        <span className="absolute top-3.5 left-3.5 z-20 px-2.5 py-1 rounded-md bg-emerald-500 text-slate-950 text-[11px] font-bold uppercase tracking-wider shadow-sm">
          {category}
        </span>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3.5 right-3.5 z-20 p-2 rounded-full backdrop-blur-md border transition-all ${
            wishlisted
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 scale-110'
              : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:text-rose-400 hover:scale-105'
          }`}
        >
          <FiHeart size={16} className={wishlisted ? 'fill-rose-400' : ''} />
        </button>

        {level && (
          <span className="absolute bottom-3 right-3.5 z-20 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700/60 text-[10px] text-slate-300 font-medium">
            {level}
          </span>
        )}
      </div>

      {/* Course Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow space-y-3.5">
        <div className="space-y-1.5 flex-grow">
          {instructor && (
            <p className="text-[11px] text-emerald-400 font-medium line-clamp-1">{instructor}</p>
          )}
          <Link to={`/courses/${courseId}`} className="block group-hover:text-emerald-400 transition-colors">
            <h3 className="font-poppins font-bold text-sm sm:text-base text-slate-100 line-clamp-1">
              {title}
            </h3>
          </Link>
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 min-h-[2.25rem]">
            {description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-1 py-2.5 border-y border-slate-800/60 text-slate-400 text-[11px] font-medium">
          <div className="flex items-center space-x-1 justify-center truncate">
            <FiClock className="text-slate-500 shrink-0" size={13} />
            <span className="truncate">{duration}</span>
          </div>
          <div className="flex items-center space-x-1 justify-center truncate">
            <FiStar className="text-amber-400 fill-amber-400 shrink-0" size={13} />
            <span className="truncate font-semibold text-slate-200">{rating || 4.8}</span>
          </div>
          <div className="flex items-center space-x-1 justify-center truncate">
            <FiUser className="text-slate-500 shrink-0" size={13} />
            <span className="truncate">{students || '1.2k'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-1 mt-auto flex items-center gap-2">
          <Link
            to={`/courses/${courseId}`}
            className="p-2 sm:px-3 sm:py-2 rounded-lg border border-slate-700/60 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 text-xs font-semibold transition-colors flex items-center justify-center space-x-1 shrink-0"
            title="Course Overview & Reviews"
          >
            <FiEye size={15} />
            <span className="hidden sm:inline">Details</span>
          </Link>

          {isEnrolled ? (
            <Button
              variant="secondary"
              to="/videos"
              className="flex-grow justify-center !text-emerald-400 space-x-1.5 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 py-2 text-xs"
            >
              <FiCheckCircle size={15} />
              <span>Continue</span>
            </Button>
          ) : (
            <Button
              variant="primary"
              className="flex-grow justify-center py-2 text-xs font-semibold"
              onClick={() => onEnroll(courseId)}
              disabled={isEnrolling}
            >
              {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
