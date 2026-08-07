import React from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiStar, FiUser, FiCheckCircle } from 'react-icons/fi';
import Button from './Button';

const CourseCard = ({ course, onEnroll, isEnrolled }) => {
  const { id, title, description, duration, rating, students, category, image } = course;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-2xl overflow-hidden border border-slate-800/80 hover:border-emerald-500/30 transition-all duration-300 flex flex-col h-full hover:shadow-xl hover:shadow-emerald-500/5 group"
    >
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 opacity-60" />
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <span className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded-md bg-emerald-500 text-slate-950 text-xs font-semibold uppercase tracking-wider shadow-sm">
          {category}
        </span>
      </div>

      {/* Course Content */}
      <div className="p-6 flex flex-col flex-grow text-left space-y-4">
        <div className="space-y-2">
          <h3 className="font-poppins font-bold text-lg text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 h-10">
            {description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800/60 text-slate-400 text-xs font-medium">
          <div className="flex items-center space-x-1.5 justify-center">
            <FiClock className="text-slate-500" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center space-x-1.5 justify-center">
            <FiStar className="text-amber-500 fill-amber-500" />
            <span>{rating}</span>
          </div>
          <div className="flex items-center space-x-1.5 justify-center">
            <FiUser className="text-slate-500" />
            <span>{students}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 mt-auto">
          {isEnrolled ? (
            <Button
              variant="secondary"
              className="w-full justify-center !text-emerald-400 space-x-2 border-slate-800 hover:bg-slate-800 cursor-default"
              disabled={true}
            >
              <FiCheckCircle size={18} />
              <span>Enrolled</span>
            </Button>
          ) : (
            <Button
              variant="primary"
              className="w-full justify-center"
              onClick={() => onEnroll(id)}
            >
              Enroll Now
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
