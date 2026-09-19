import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiLogIn, FiInfo, FiKey } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';

const Login = () => {
  const { login } = useApp();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const redirectParam = searchParams.get('redirect');
  const safeRedirect = redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')
    ? redirectParam
    : '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await login(email, password);
      if (result && result.success) {
        navigate(safeRedirect, { replace: true });
      } else {
        setError(result?.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Login Helper
  const handleQuickDemo = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    setError('');
    try {
      const result = await login(demoEmail, demoPass);
      if (result && result.success) {
        navigate(safeRedirect, { replace: true });
      } else {
        setError(result?.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.message || 'Login error.');
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
            Welcome Back
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Sign in to access your course curriculum, progress, and assignments.
          </p>
        </div>

        {redirectParam && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center space-x-2.5">
            <FiInfo size={18} className="shrink-0" />
            <span>Please log in to continue to your requested content.</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative flex items-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@studypoint.com"
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
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
              <div className="absolute left-3 text-slate-500">
                <FiLock size={16} />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center space-x-2 py-3 text-xs sm:text-sm font-bold"
              disabled={loading}
            >
              <FiLogIn size={16} />
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            </Button>
          </div>
        </form>

        {/* Demo Quick Logins */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center">
            Demo Credentials (1-Click Fill)
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemo('student@studypoint.com', 'password123')}
              className="py-1.5 px-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-[11px] font-semibold text-emerald-400 border border-slate-700/60 transition-colors truncate"
            >
              👨‍🎓 Student
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('instructor@studypoint.com', 'password123')}
              className="py-1.5 px-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-[11px] font-semibold text-sky-400 border border-slate-700/60 transition-colors truncate"
            >
              👨‍🏫 Instructor
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin@studypoint.com', 'password123')}
              className="py-1.5 px-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-[11px] font-semibold text-purple-400 border border-slate-700/60 transition-colors truncate"
            >
              👑 Admin
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400">
          <span>Don't have an account? </span>
          <Link
            to={redirectParam ? `/signup?redirect=${encodeURIComponent(redirectParam)}` : '/signup'}
            className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
          >
            Sign up free
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
