import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiBookOpen,
  FiBell,
  FiHeart,
  FiCheckCircle,
  FiAward,
  FiShield,
  FiLayers,
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const {
    user,
    role,
    logout,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    wishlist,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/courses', label: 'Courses' },
    { path: '/assignments', label: 'Assignments' },
    { path: '/videos', label: 'Videos' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-slate-900/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2.5 sm:space-x-3 text-slate-100 focus:outline-none shrink-0 group"
          >
            <img
              src="/logo.png"
              alt="Study Point Logo"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-contain shadow-lg shadow-emerald-500/20 shrink-0 border border-emerald-500/30 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col text-left">
              <span className="font-poppins font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                Study Point
              </span>
              <span className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:block">
                E-Learning Ecosystem
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-emerald-400 bg-slate-800/60 font-semibold'
                      : 'text-slate-300 hover:text-emerald-400 hover:bg-slate-800/30'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Controls - Notifications, Wishlist, Auth */}
          <div className="hidden lg:flex items-center space-x-3">
            {user && (
              <>
                {/* Wishlist Link */}
                <Link
                  to="/courses"
                  title="My Wishlist"
                  className="relative p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  <FiHeart size={18} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                {/* Notifications Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowDropdown(false);
                    }}
                    title="Notifications"
                    className="relative p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-slate-300 hover:text-emerald-400 transition-colors"
                  >
                    <FiBell size={18} />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowNotifications(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl z-20 overflow-hidden text-left glass"
                        >
                          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <FiBell className="text-emerald-400" />
                              <span className="font-poppins font-bold text-sm text-slate-200">
                                Notifications
                              </span>
                            </div>
                            {unreadNotificationsCount > 0 && (
                              <button
                                onClick={markAllNotificationsRead}
                                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
                              >
                                Mark all as read
                              </button>
                            )}
                          </div>

                          <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                            {notifications.length > 0 ? (
                              notifications.map((n) => (
                                <div
                                  key={n._id}
                                  onClick={() => {
                                    markNotificationRead(n._id);
                                    if (n.link) {
                                      setShowNotifications(false);
                                      navigate(n.link);
                                    }
                                  }}
                                  className={`p-3.5 hover:bg-slate-800/50 cursor-pointer transition-colors space-y-1 ${
                                    !n.read ? 'bg-emerald-500/5 border-l-2 border-emerald-500' : ''
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-xs text-slate-200 line-clamp-1">
                                      {n.title}
                                    </h4>
                                    <span className="text-[10px] text-slate-500">
                                      {new Date(n.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                                    {n.message}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <div className="p-6 text-center text-xs text-slate-500">
                                No new notifications at this time.
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}

            {/* User Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowDropdown(!showDropdown);
                    setShowNotifications(false);
                  }}
                  className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-slate-200 transition-all focus:outline-none"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-emerald-500/40"
                  />
                  <span className="text-sm font-medium max-w-[110px] truncate">{user.name}</span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {role}
                  </span>
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2.5 w-52 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-1.5 z-20 text-left glass"
                      >
                        <div className="px-4 py-2 border-b border-slate-800">
                          <p className="text-xs font-semibold text-slate-200 truncate">{user.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                        </div>

                        <Link
                          to="/dashboard"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center space-x-2.5 px-4 py-2 text-xs sm:text-sm text-slate-200 hover:bg-slate-800 transition-colors"
                        >
                          {role === 'admin' ? <FiShield size={16} className="text-purple-400" /> : <FiUser size={16} className="text-emerald-400" />}
                          <span>{role === 'admin' ? 'Admin Dashboard' : role === 'instructor' ? 'Instructor Portal' : 'Student Dashboard'}</span>
                        </Link>

                        <Link
                          to="/profile"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center space-x-2.5 px-4 py-2 text-xs sm:text-sm text-slate-200 hover:bg-slate-800 transition-colors"
                        >
                          <FiUser size={16} />
                          <span>Profile Settings</span>
                        </Link>

                        <div className="h-px bg-slate-800 my-1" />

                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2.5 w-full text-left px-4 py-2 text-xs sm:text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <FiLogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-lg text-sm shadow-md hover:shadow-emerald-500/20 active:scale-95 transform transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            {user && unreadNotificationsCount > 0 && (
              <Link
                to="/dashboard"
                className="relative p-1.5 text-rose-400 bg-slate-800 rounded-lg"
              >
                <FiBell size={18} />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/30 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 transition-all focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-t border-slate-800/60 bg-slate-900 max-h-[calc(100vh-4.5rem)] overflow-y-auto text-left"
          >
            <div className="px-4 py-4 space-y-1.5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'text-emerald-400 bg-slate-800/50 border-l-2 border-emerald-500 font-semibold'
                        : 'text-slate-300 hover:text-emerald-400 hover:bg-slate-800/30'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <div className="h-px bg-slate-800 my-3" />

              {/* Mobile Auth Controls */}
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 px-4 py-2">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border border-emerald-500/55 object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-slate-200 font-medium truncate flex items-center space-x-2">
                        <span>{user.name}</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                          {role}
                        </span>
                      </div>
                      <div className="text-slate-500 text-xs truncate">{user.email}</div>
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-800/30 rounded-lg text-sm font-medium"
                  >
                    {role === 'admin' ? 'Admin Dashboard' : role === 'instructor' ? 'Instructor Dashboard' : 'Student Dashboard'}
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-800/30 rounded-lg text-sm font-medium"
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full text-left px-4 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg text-sm font-medium"
                  >
                    <FiLogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center items-center py-2.5 text-center text-slate-300 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg text-xs font-semibold transition-all"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center items-center py-2.5 text-center bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg text-xs font-semibold transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
