import React from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiEye, FiCheckCircle, FiFileText } from 'react-icons/fi';
import Button from './Button';

const AssignmentCard = ({ 
  assignment, 
  onView, 
  onDownload, 
  isCompleted, 
  onSubmit 
}) => {
  const { id, title, subject, description, fileUrl, deadline } = assignment;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="glass rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/30 transition-all duration-300 flex flex-col h-full hover:shadow-lg hover:shadow-emerald-500/5 group text-left"
    >
      <div className="flex items-start justify-between mb-4">
        {/* File icon and title info */}
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
            <FiFileText size={22} />
          </div>
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-0.5">
              {subject}
            </span>
            <h3 className="font-poppins font-bold text-base text-slate-100 group-hover:text-emerald-400 transition-colors">
              {title}
            </h3>
          </div>
        </div>

        {/* Status indicator */}
        {isCompleted && (
          <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full">
            <FiCheckCircle className="mr-1 shrink-0" /> Done
          </span>
        )}
      </div>

      <p className="text-slate-400 text-sm leading-relaxed mb-5 flex-grow line-clamp-3">
        {description}
      </p>

      {/* Deadline Info */}
      <div className="text-xs text-slate-500 mb-5 border-t border-slate-800/60 pt-4 flex justify-between items-center">
        <span>Deadline: {deadline}</span>
        <span>Format: PDF</span>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3 mt-auto pt-1">
        <Button
          variant="glass"
          onClick={() => onView(assignment)}
          className="flex items-center justify-center space-x-2 py-2 px-3 text-xs md:text-sm"
        >
          <FiEye size={16} />
          <span>View PDF</span>
        </Button>

        <a
          href={fileUrl}
          download
          onClick={() => onDownload(id)}
          className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg border border-slate-700/60 hover:bg-slate-800/80 text-slate-300 text-xs md:text-sm font-semibold transition-all hover:text-emerald-400 hover:border-emerald-500/20 active:scale-95 transform cursor-pointer text-center"
        >
          <FiDownload size={16} />
          <span>Download</span>
        </a>
      </div>

      {!isCompleted && onSubmit && (
        <Button
          variant="secondary"
          onClick={() => onSubmit(id)}
          className="w-full justify-center mt-3 text-xs md:text-sm bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
        >
          Submit Assignment
        </Button>
      )}
    </motion.div>
  );
};

export default AssignmentCard;
