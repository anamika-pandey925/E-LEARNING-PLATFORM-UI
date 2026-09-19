import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiPlayCircle, FiEye, FiLock, FiLogIn, FiBookOpen } from 'react-icons/fi';
import Button from './Button';

const VideoCard = ({
  video,
  isWatched,
  isEnrolled,
  isAuthenticated,
  onToggleWatched,
  onLoginRequired,
  onEnroll,
  isEnrolling,
}) => {
  const { id, title, embedUrl, duration, category, description } = video;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden border border-slate-800 hover:border-emerald-500/20 transition-all duration-300 flex flex-col h-full hover:shadow-lg hover:shadow-emerald-500/5 group text-left"
    >
      {/* Video / Lock Screen Container */}
      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden flex items-center justify-center">
        {!isAuthenticated ? (
          /* Unauthenticated Lock Screen */
          <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center space-y-3 z-10">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-amber-400 flex items-center justify-center shadow-lg">
              <FiLock size={22} />
            </div>
            <div className="space-y-1 max-w-xs">
              <h4 className="font-poppins font-bold text-sm text-slate-200">Lecture Protected</h4>
              <p className="text-xs text-slate-400">Please login to continue.</p>
            </div>
            <Button
              variant="primary"
              onClick={onLoginRequired}
              className="py-1.5 px-4 text-xs font-semibold space-x-1.5"
            >
              <FiLogIn size={14} />
              <span>Login to Watch</span>
            </Button>
          </div>
        ) : !isEnrolled ? (
          /* Authenticated but Not Enrolled Lock Screen */
          <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center space-y-3 z-10">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg">
              <FiBookOpen size={22} />
            </div>
            <div className="space-y-1 max-w-xs">
              <h4 className="font-poppins font-bold text-sm text-slate-200">Enrollment Required</h4>
              <p className="text-xs text-slate-400">Please enroll in this course to access the lessons.</p>
            </div>
            <Button
              variant="primary"
              onClick={onEnroll}
              disabled={isEnrolling}
              className="py-1.5 px-4 text-xs font-semibold space-x-1.5"
            >
              <FiPlayCircle size={14} />
              <span>{isEnrolling ? 'Enrolling...' : 'Enroll Now'}</span>
            </Button>
          </div>
        ) : (
          /* Enrolled & Authenticated -> Full Video Playback */
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-none"
          />
        )}
      </div>

      {/* Video Info */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow space-y-3 sm:space-y-3.5">
        <div className="flex items-start justify-between space-x-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold tracking-wider bg-slate-800 text-emerald-400 border border-slate-700/60 uppercase">
            {category}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {duration}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="font-poppins font-bold text-sm sm:text-base text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 min-h-[2rem]">
            {description}
          </p>
        </div>

        {/* Watch Action Status */}
        <div className="pt-3 border-t border-slate-800/60 mt-auto flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
          {!isAuthenticated ? (
            <Button
              variant="primary"
              onClick={onLoginRequired}
              className="py-1.5 px-3 text-xs font-semibold space-x-1.5"
            >
              <FiLogIn size={14} />
              <span>Login to Watch</span>
            </Button>
          ) : !isEnrolled ? (
            <Button
              variant="primary"
              onClick={onEnroll}
              disabled={isEnrolling}
              className="py-1.5 px-3 text-xs font-semibold space-x-1.5"
            >
              <FiPlayCircle size={14} />
              <span>{isEnrolling ? 'Enrolling...' : 'Enroll to Watch'}</span>
            </Button>
          ) : (
            <button
              onClick={() => onToggleWatched(id)}
              className={`flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all border ${
                isWatched
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/20'
              }`}
            >
              {isWatched ? (
                <>
                  <FiCheckCircle className="stroke-[2.5] shrink-0" />
                  <span>Completed</span>
                </>
              ) : (
                <>
                  <FiPlayCircle className="stroke-[2.5] shrink-0" />
                  <span>Mark as Completed</span>
                </>
              )}
            </button>
          )}

          <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium flex items-center space-x-1 shrink-0 ml-auto">
            <FiEye className="text-slate-600 shrink-0" />
            <span>Interactive Class</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCard;
