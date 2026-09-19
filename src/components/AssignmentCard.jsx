import React from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiEye, FiCheckCircle, FiFileText, FiLock, FiBookOpen, FiLogIn } from 'react-icons/fi';
import Button from './Button';

const AssignmentCard = ({ 
  assignment, 
  onView, 
  onDownload, 
  isCompleted, 
  onSubmit,
  isEnrolled,
  isAuthenticated,
  onLoginRequired,
  onEnroll,
  isEnrolling,
}) => {
  const { id, title, subject, description, fileUrl, deadline } = assignment;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="glass rounded-2xl p-5 sm:p-6 border border-slate-800 hover:border-emerald-500/30 transition-all duration-300 flex flex-col h-full hover:shadow-lg hover:shadow-emerald-500/5 group text-left"
    >
      <div className="flex items-start justify-between gap-2 mb-4">
        {/* File icon and title info */}
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/10 transition-colors shrink-0">
            <FiFileText size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] sm:text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-0.5 truncate">
              {subject}
            </span>
            <h3 className="font-poppins font-bold text-sm sm:text-base text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
              {title}
            </h3>
          </div>
        </div>

        {/* Status indicator */}
        {isCompleted && (
          <span className="flex items-center text-[10px] sm:text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 sm:px-2.5 py-1 rounded-full shrink-0">
            <FiCheckCircle className="mr-1 shrink-0" /> Done
          </span>
        )}
      </div>

      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5 flex-grow line-clamp-3">
        {description}
      </p>

      {/* Deadline Info */}
      <div className="text-[11px] sm:text-xs text-slate-500 mb-4 sm:mb-5 border-t border-slate-800/60 pt-3.5 sm:pt-4 flex justify-between items-center">
        <span>Deadline: {deadline}</span>
        <span>Format: PDF</span>
      </div>

      {/* Action buttons based on auth/enrollment */}
      <div className="mt-auto pt-1">
        {!isAuthenticated ? (
          <Button
            variant="primary"
            onClick={onLoginRequired}
            className="w-full justify-center space-x-2 py-2 sm:py-2.5 text-xs sm:text-sm"
          >
            <FiLogIn size={15} />
            <span>Login to Access</span>
          </Button>
        ) : !isEnrolled ? (
          <Button
            variant="primary"
            onClick={onEnroll}
            disabled={isEnrolling}
            className="w-full justify-center space-x-2 py-2 sm:py-2.5 text-xs sm:text-sm"
          >
            <FiBookOpen size={15} />
            <span>{isEnrolling ? 'Enrolling...' : 'Enroll to Access'}</span>
          </Button>
        ) : (
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <Button
                variant="primary"
                onClick={() => onView(assignment)}
                className="flex items-center justify-center space-x-1.5 sm:space-x-2 py-2 px-2 sm:px-3 text-xs sm:text-sm"
              >
                <FiEye size={15} />
                <span>Open Assignment</span>
              </Button>

              <a
                href={fileUrl}
                download
                onClick={() => onDownload(id)}
                className="flex items-center justify-center space-x-1.5 sm:space-x-2 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg border border-slate-700/60 hover:bg-slate-800/80 text-slate-300 text-xs sm:text-sm font-semibold transition-all hover:text-emerald-400 hover:border-emerald-500/20 active:scale-95 transform cursor-pointer text-center"
              >
                <FiDownload size={15} />
                <span>Download</span>
              </a>
            </div>

            {!isCompleted && onSubmit && (
              <Button
                variant="secondary"
                onClick={() => onSubmit(id)}
                className="w-full justify-center text-xs sm:text-sm bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 py-2"
              >
                Submit Assignment
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AssignmentCard;
