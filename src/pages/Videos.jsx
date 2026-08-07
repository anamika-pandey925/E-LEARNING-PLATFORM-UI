import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import VideoCard from '../components/VideoCard';
import { FiCheckCircle, FiPlay, FiAward } from 'react-icons/fi';

const Videos = () => {
  const { watchedVideos, toggleVideoWatched } = useApp();

  const videosList = [
    {
      id: 'video-html-basics',
      title: 'HTML Complete Crash Course',
      embedUrl: 'https://www.youtube.com/embed/HcOc7P5BMi4?enablejsapi=1',
      duration: '45 mins',
      category: 'HTML',
      description: 'Understand core tag structures, document sections, link embeddings, and layout rules for HTML templates.'
    },
    {
      id: 'video-css-layouts',
      title: 'Advanced CSS Flexbox & Grid',
      embedUrl: 'https://www.youtube.com/embed/ESnrn1kAD4E?enablejsapi=1',
      duration: '50 mins',
      category: 'CSS',
      description: 'Master aligning web content elements. Deep dive into container styling, wraps, grid lines, and adaptive viewports.'
    },
    {
      id: 'video-js-beginners',
      title: 'JavaScript DOM Manipulation',
      embedUrl: 'https://www.youtube.com/embed/ajdRvxDWH4w?enablejsapi=1',
      duration: '65 mins',
      category: 'JavaScript',
      description: 'Learn to interact dynamically with web pages. Attach listeners, update classes, and handle page structure events.'
    },
    {
      id: 'video-python-science',
      title: 'Python for Data Analysis',
      embedUrl: 'https://www.youtube.com/embed/UrsmFxEIp5k?enablejsapi=1',
      duration: '70 mins',
      category: 'Python',
      description: 'Get started with Pandas datasets. Load raw csv text, compile statistics data, and run graphs using math plots.'
    }
  ];

  const totalVideos = videosList.length;
  const completedCount = videosList.filter(vid => watchedVideos.includes(vid.id)).length;
  const progressPercent = totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <section className="text-center space-y-4 py-8 max-w-3xl mx-auto">
        <h1 className="font-poppins font-extrabold text-4xl text-slate-100 leading-tight">
          Watch & Track <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">Lectures</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Access high-fidelity video tutorials on HTML, CSS, JavaScript, and Python. Mark lectures completed as you watch to update your academic tracker.
        </p>
      </section>

      {/* Progress Card Section */}
      <section className="glass p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 text-left">
          <div className="flex items-center space-x-2.5 text-emerald-400">
            <FiAward size={22} />
            <h3 className="font-poppins font-bold text-lg text-slate-200">
              Your Learning Progress
            </h3>
          </div>
          <p className="text-sm text-slate-450">
            Complete all {totalVideos} lectures to earn your course graduation certificate badge.
          </p>
        </div>

        {/* Progress Bar and Indicator */}
        <div className="flex-grow max-w-md w-full space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
            <span className="text-slate-400">{completedCount} of {totalVideos} completed</span>
            <span className="text-emerald-400">{progressPercent}% Completed</span>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-3.5 border border-slate-800 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </section>

      {/* Video Lecture Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videosList.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              isWatched={watchedVideos.includes(video.id)}
              onToggleWatched={toggleVideoWatched}
            />
          ))}
        </div>
      </section>

    </div>
  );
};

export default Videos;
