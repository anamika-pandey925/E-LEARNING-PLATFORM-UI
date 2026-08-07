import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Button = ({
  children,
  to,
  onClick,
  type = 'button',
  variant = 'primary', // primary | secondary | outline | glass
  className = '',
  disabled = false
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:pointer-events-none px-6 py-2.5 text-sm md:text-base';
  
  const variants = {
    primary: 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 transform',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 hover:shadow-lg border border-slate-700 active:scale-95 transform',
    outline: 'border-2 border-emerald-500/80 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 active:scale-95 transform',
    glass: 'glass hover:bg-emerald-500 hover:text-slate-950 text-slate-200 border-white/10 hover:border-emerald-500 active:scale-95 transform',
  };

  const combinedStyle = `${baseStyle} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <motion.span whileTap={{ scale: 0.98 }}>
        <Link to={to} className={combinedStyle}>
          {children}
        </Link>
      </motion.span>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={combinedStyle}
      disabled={disabled}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
};

export default Button;
