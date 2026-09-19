import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = 'Search...', 
  className = '',
  onSubmit
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit(value);
    }
  };

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full pl-10 sm:pl-11 pr-4 py-2 sm:py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 text-xs sm:text-sm md:text-base glass"
      />
      <div className="absolute left-3 sm:left-3.5 text-slate-400 pointer-events-none">
        <FiSearch size={16} className="sm:w-[18px] sm:h-[18px]" />
      </div>
    </div>
  );
};

export default SearchBar;
