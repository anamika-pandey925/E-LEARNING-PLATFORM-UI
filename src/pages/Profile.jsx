import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiShield,
  FiSave,
  FiCheckCircle,
  FiLock,
  FiKey,
} from 'react-icons/fi';
import Button from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const { user, role, updateUserProfile, changePassword } = useApp();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password'

  // Profile states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(
    user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
  );
  const [bio, setBio] = useState(user?.bio || '');
  const [isSaving, setIsSaving] = useState(false);

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Toast / feedback
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const formattedJoinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'August 07, 2026';

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }
    setIsSaving(true);
    setError('');
    try {
      await updateUserProfile({ name, email, avatar, bio });
      setToastMessage('Profile settings updated successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setError('Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    setIsChangingPassword(true);
    setError('');
    try {
      const res = await changePassword(currentPassword, newPassword);
      if (res?.success) {
        setToastMessage('Password changed successfully!');
        setShowToast(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setShowToast(false), 3500);
      } else {
        setError(res?.message || 'Password update failed.');
      }
    } catch (err) {
      setError(err.message || 'Failed to change password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const avatarsList = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-8 text-left">
      {/* Toast Alert */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 pointer-events-none">
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="flex items-center space-x-3 p-4 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-400 max-w-sm shadow-2xl glass pointer-events-auto ml-auto"
            >
              <FiCheckCircle size={22} className="shrink-0" />
              <div>
                <p className="text-sm font-semibold">{toastMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="font-poppins font-extrabold text-2xl sm:text-3xl text-slate-100">
          Account Settings
        </h1>

        <div className="flex rounded-xl bg-slate-800/80 p-1 border border-slate-700/60">
          <button
            onClick={() => {
              setActiveTab('profile');
              setError('');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Profile Info
          </button>
          <button
            onClick={() => {
              setActiveTab('password');
              setError('');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'password'
                ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Security & Password
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Avatar & Role Info Card */}
        <section className="lg:col-span-4 glass p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800 flex flex-col items-center text-center space-y-4">
          <img
            src={avatar}
            alt="Profile Avatar"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-emerald-500 object-cover shadow-xl"
          />

          <div className="space-y-1">
            <h3 className="font-poppins font-bold text-base sm:text-lg text-slate-200">
              {user.name}
            </h3>
            <span className="inline-block text-[11px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {role}
            </span>
            <p className="text-xs text-slate-500 pt-1">Member since {formattedJoinedDate}</p>
          </div>

          <div className="w-full space-y-2.5 pt-3 border-t border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Choose Avatar
            </span>
            <div className="flex justify-center gap-2 flex-wrap">
              {avatarsList.map((av, idx) => (
                <button
                  key={idx}
                  onClick={() => setAvatar(av)}
                  className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${
                    avatar === av ? 'border-emerald-500 scale-105 shadow-md' : 'border-transparent hover:border-slate-700'
                  }`}
                >
                  <img src={av} alt="avatar option" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Tab Form Card */}
        <section className="lg:col-span-8 glass p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-800">
          {error && (
            <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          {activeTab === 'profile' ? (
            <form onSubmit={handleProfileSubmit} className="space-y-4 sm:space-y-5">
              <h2 className="font-poppins font-bold text-base sm:text-lg text-slate-200 border-b border-slate-800 pb-3">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                      required
                    />
                    <div className="absolute left-3 text-slate-500">
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
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                      required
                    />
                    <div className="absolute left-3 text-slate-500">
                      <FiMail size={16} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Bio / About Me
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a few words about your learning track..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <Button type="submit" variant="primary" disabled={isSaving} className="space-x-2 py-2.5 px-5 text-xs font-semibold">
                  <FiSave size={16} />
                  <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-4 sm:space-y-5">
              <h2 className="font-poppins font-bold text-base sm:text-lg text-slate-200 border-b border-slate-800 pb-3">
                Change Password
              </h2>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Current Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <div className="absolute left-3 text-slate-500">
                    <FiLock size={16} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    New Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                      required
                    />
                    <div className="absolute left-3 text-slate-500">
                      <FiKey size={16} />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Confirm New Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                      required
                    />
                    <div className="absolute left-3 text-slate-500">
                      <FiKey size={16} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <Button type="submit" variant="primary" disabled={isChangingPassword} className="space-x-2 py-2.5 px-5 text-xs font-semibold">
                  <FiKey size={16} />
                  <span>{isChangingPassword ? 'Updating Password...' : 'Update Password'}</span>
                </Button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

export default Profile;
