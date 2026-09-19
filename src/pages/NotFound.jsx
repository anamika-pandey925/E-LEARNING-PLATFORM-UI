import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8 sm:py-16 relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-80 h-72 sm:h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-800 text-center space-y-4 sm:space-y-6 relative"
      >
        <h1 className="font-poppins font-extrabold text-6xl sm:text-7xl text-emerald-400">404</h1>
        <div className="space-y-2">
          <h2 className="font-poppins font-bold text-lg sm:text-xl text-slate-100">Page Not Found</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            The page you are looking for does not exist or has been moved to another path.
          </p>
        </div>

        <div className="pt-2">
          <Button to="/" variant="primary" className="w-full justify-center">
            Go Back Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
