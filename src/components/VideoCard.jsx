import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiPlayCircle, FiEye } from 'react-icons/fi';

const VideoCard = ({ video, isWatched, onToggleWatched }) => {
  const { id, title, embedUrl, duration, category, description } = video;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden border border-slate-800 hover:border-emerald-500/20 transition-all duration-300 flex flex-col h-full hover:shadow-lg hover:shadow-emerald-500/5 group text-left"
    >
      {/* Video Iframe Container */}
      <div className="relative aspect-video w-full bg-slate-950">
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-none"
        />
      </div>

      {/* Video Info */}
      <div className="p-5 flex flex-col flex-grow space-y-3.5">
        <div className="flex items-start justify-between space-x-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold tracking-wider bg-slate-800 text-emerald-400 border border-slate-700/60 uppercase">
            {category}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {duration}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="font-poppins font-bold text-base text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 h-8">
            {description}
          </p>
        </div>

        {/* Watch Action Status */}
        <div className="pt-3 border-t border-slate-800/60 mt-auto flex items-center justify-between">
          <button
            onClick={() => onToggleWatched(id)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              isWatched
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/20'
            }`}
          >
            {isWatched ? (
              <>
                <FiCheckCircle className="stroke-[2.5]" />
                <span>Completed</span>
              </>
            ) : (
              <>
                <FiPlayCircle className="stroke-[2.5]" />
                <span>Mark as Completed</span>
              </>
            )}
          </button>

          <span className="text-[11px] text-slate-500 font-medium flex items-center space-x-1">
            <FiEye className="text-slate-600" />
            <span>Interactive Class</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCard;
