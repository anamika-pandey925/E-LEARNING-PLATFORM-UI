import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiBell } from 'react-icons/fi';
import Button from './Button';

const HeroSection = ({ type = 'home' }) => {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 4000);
  };

  if (type === 'courses') {
    return (
      <section className="relative overflow-hidden py-20 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 text-center">
        {/* Background glow overlay */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 space-y-6 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-poppins font-extrabold text-4xl sm:text-5xl text-white tracking-tight"
          >
            Learn & Grow with Study Point
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-emerald-50 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Join our interactive courses and enhance your skills.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="pt-2"
          >
            <Button to="/videos" variant="secondary" className="!bg-slate-900 !text-slate-100 hover:!bg-slate-800 border-none shadow-lg">
              Watch Videos
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Text Content */}
        <motion.div 
          className="lg:col-span-7 space-y-6 text-left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs md:text-sm font-semibold tracking-wide">
            <FiBell className="animate-bounce" />
            <span>Interactive Learning Platform</span>
          </div>

          <h1 className="font-poppins font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-slate-100 leading-tight">
            The Future of <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">Education</span> is Here
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            Study Point is an online platform offering diverse courses like Mathematics, Science, and modern web technologies including HTML, CSS, JavaScript, and Python. Empower your learning with our certification courses.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Button to="/courses" variant="primary" className="shadow-lg shadow-emerald-500/10">
              Explore Courses
            </Button>
            
            <Button onClick={handleSubscribe} variant="outline">
              Subscribe Now
            </Button>
          </div>

          {/* Subscribed Success Toast / Alert */}
          <AnimatePresence>
            {subscribed && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex items-center space-x-2.5 p-4 rounded-xl bg-slate-800 border border-emerald-500/30 text-emerald-400 max-w-md shadow-2xl glass"
              >
                <FiCheckCircle size={20} className="text-emerald-400 shrink-0" />
                <div className="text-sm font-medium">
                  Thank you for subscribing!
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Hero Image / Illustration */}
        <motion.div 
          className="lg:col-span-5 flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <div className="relative group max-w-md w-full aspect-video lg:aspect-square overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-emerald-500/5">
            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/10 transition-colors duration-300 z-10" />
            <img 
              src="/image/book.jpg" 
              alt="Educational Material" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
