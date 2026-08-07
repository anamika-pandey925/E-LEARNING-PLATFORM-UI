import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FiUser, FiMail, FiCalendar, FiShield, FiSave, FiCheckCircle } from 'react-icons/fi';
import Button from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const { user, updateUserProfile } = useApp();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile({ name, email, avatar });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const avatarsList = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-left">
      
      {/* Toast alert success */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="flex items-center space-x-3 p-4 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-400 max-w-sm shadow-2xl glass pointer-events-auto"
            >
              <FiCheckCircle size={22} className="shrink-0" />
              <div>
                <p className="text-sm font-semibold">Settings Updated!</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your profile changes have been successfully saved.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <h1 className="font-poppins font-extrabold text-3xl text-slate-100">
        Account Settings
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Avatar Card */}
        <section className="lg:col-span-4 glass p-6 rounded-3xl border border-slate-800 flex flex-col items-center text-center space-y-5">
          <img
            src={avatar}
            alt="Profile Avatar"
            className="w-24 h-24 rounded-full border-2 border-emerald-500 object-cover shadow-xl"
          />
          
          <div className="space-y-1">
            <h3 className="font-poppins font-bold text-lg text-slate-200">{user.name}</h3>
            <p className="text-xs text-slate-500">Member since August 2026</p>
          </div>

          <div className="w-full space-y-3 pt-3 border-t border-slate-850">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Choose Avatar Profile
            </span>
            <div className="flex justify-center gap-2">
              {avatarsList.map((av, idx) => (
                <button
                  key={idx}
                  onClick={() => setAvatar(av)}
                  className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                    avatar === av ? 'border-emerald-500 scale-105 shadow-md' : 'border-transparent hover:border-slate-700'
                  }`}
                >
                  <img src={av} alt="avatar option" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Profile Details Form */}
        <section className="lg:col-span-8 glass p-6 sm:p-8 rounded-3xl border border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="font-poppins font-bold text-lg text-slate-250 border-b border-slate-855 pb-3">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/80 transition-colors"
                    required
                  />
                  <div className="absolute left-3 text-slate-505">
                    <FiUser size={16} />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/80 transition-colors"
                    required
                  />
                  <div className="absolute left-3 text-slate-505">
                    <FiMail size={16} />
                  </div>
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  User Role
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={user.role}
                    disabled
                    className="w-full bg-slate-900/40 border border-slate-850 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-500 cursor-not-allowed"
                  />
                  <div className="absolute left-3 text-slate-650">
                    <FiShield size={16} />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Joined Date
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value="August 07, 2026"
                    disabled
                    className="w-full bg-slate-900/40 border border-slate-850 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-505 cursor-not-allowed"
                  />
                  <div className="absolute left-3 text-slate-600">
                    <FiCalendar size={16} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-850 flex justify-end">
              <Button type="submit" variant="primary" className="space-x-2">
                <FiSave />
                <span>Save Profile Changes</span>
              </Button>
            </div>
          </form>
        </section>

      </div>

    </div>
  );
};

export default Profile;
