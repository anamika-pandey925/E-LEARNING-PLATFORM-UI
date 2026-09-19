import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiUserPlus, FiShield } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';

const Signup = () => {
  const { signup } = useApp();
  const [searchParams] = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const redirectParam = searchParams.get('redirect');
  const safeRedirect = redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')
    ? redirectParam
    : '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await signup(name, email, password, role);
      if (result && result.success) {
        navigate(safeRedirect, { replace: true });
      } else {
        setError(result?.message || 'Registration failed. Please check inputs.');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8 sm:py-16 relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass w-full max-w-md p-5 sm:p-8 rounded-3xl border border-slate-800 flex flex-col space-y-5 sm:space-y-6 relative"
      >
        <div className="text-center space-y-1.5">
          <h2 className="font-poppins font-extrabold text-xl sm:text-2xl text-slate-100">
            Join Study Point
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Create your free account to access courses, submit assignments, and earn verified certificates.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Full Name
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
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
                placeholder="john@example.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
              <div className="absolute left-3 text-slate-500">
                <FiMail size={16} />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••• (min 6 characters)"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
              <div className="absolute left-3 text-slate-500">
                <FiLock size={16} />
              </div>
            </div>
          </div>

          {/* Account Role Selector */}
          <div className="space-y-1 pt-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Account Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  role === 'student'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                👨‍🎓 Student Learner
              </button>
              <button
                type="button"
                onClick={() => setRole('instructor')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  role === 'instructor'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                👨‍🏫 Course Instructor
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center space-x-2 py-3 text-xs sm:text-sm font-bold"
              disabled={loading}
            >
              <FiUserPlus size={16} />
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            </Button>
          </div>
        </form>

        <div className="text-center text-xs text-slate-400">
          <span>Already have an account? </span>
          <Link
            to={redirectParam ? `/login?redirect=${encodeURIComponent(redirectParam)}` : '/login'}
            className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
          >
            Log in here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
