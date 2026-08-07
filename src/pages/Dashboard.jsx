import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FiBookOpen, FiPlayCircle, FiFileText, FiAward, FiArrowRight } from 'react-icons/fi';
import Button from '../components/Button';

const Dashboard = () => {
  const { user, enrolledCourses, watchedVideos, completedAssignments } = useApp();

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Pre-mapped course titles for details display
  const courseDetails = {
    'web-dev-basics': { title: 'Web Development Basics', progress: 40, category: 'Web Dev' },
    'javascript-beginners': { title: 'JavaScript for Beginners', progress: 20, category: 'Programming' },
    'python-data-science': { title: 'Python for Data Science', progress: 0, category: 'Data Science' },
    'math-competitive': { title: 'Mathematics for Competitive Exams', progress: 10, category: 'Academic' },
    'english-grammar': { title: 'Comprehensive English Grammar', progress: 50, category: 'Academic' },
    'chemistry-physics-basics': { title: 'Fundamentals of Science', progress: 0, category: 'Academic' },
  };

  const statCards = [
    {
      icon: <FiBookOpen size={20} />,
      label: 'Enrolled Courses',
      value: enrolledCourses.length,
      color: 'text-sky-400 bg-sky-400/10 border-sky-400/20'
    },
    {
      icon: <FiPlayCircle size={20} />,
      label: 'Videos Watched',
      value: watchedVideos.length,
      color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
    },
    {
      icon: <FiFileText size={20} />,
      label: 'Assignments Completed',
      value: completedAssignments.length,
      color: 'text-purple-400 bg-purple-400/10 border-purple-400/20'
    },
    {
      icon: <FiAward size={20} />,
      label: 'Certificates Earned',
      value: enrolledCourses.length > 0 && watchedVideos.length >= 4 && completedAssignments.length >= 2 ? 1 : 0,
      color: 'text-amber-400 bg-amber-400/10 border-amber-400/20'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-left">
      
      {/* Welcome Banner */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 glass">
        <div className="space-y-2">
          <h1 className="font-poppins font-extrabold text-3xl text-slate-100 leading-tight">
            Welcome back, {user.name}!
          </h1>
          <p className="text-sm text-slate-400">
            Track your schedule, submit course evaluations, and resume where you left off.
          </p>
        </div>

        <div className="flex items-center space-x-3.5">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-14 h-14 rounded-full border-2 border-emerald-500/60 object-cover shadow-lg"
          />
          <div>
            <div className="text-sm font-semibold text-slate-200">{user.name}</div>
            <div className="text-xs text-slate-500">{user.role}</div>
          </div>
        </div>
      </section>

      {/* Stats Summary Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border flex items-center space-x-4 glass ${stat.color.split(' ')[2]}`}
          >
            <div className={`p-3 rounded-xl flex items-center justify-center shrink-0 ${stat.color.split(' ')[0]} ${stat.color.split(' ')[1]}`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-2xl font-bold font-poppins text-slate-100">{stat.value}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">{stat.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Main Grid: Left = Enrolled Courses, Right = Recommendations/Progress info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col = Courses */}
        <section className="lg:col-span-8 space-y-6">
          <h2 className="font-poppins font-bold text-xl text-slate-100">
            My Learning Subscriptions
          </h2>

          {enrolledCourses.length > 0 ? (
            <div className="space-y-4">
              {enrolledCourses.map((courseId) => {
                const info = courseDetails[courseId] || { title: courseId, progress: 10, category: 'General' };
                return (
                  <div
                    key={courseId}
                    className="p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700/60 transition-all bg-slate-900/40 hover:bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass"
                  >
                    <div className="space-y-1.5 text-left">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider bg-slate-800 text-emerald-400 border border-slate-700/60 uppercase">
                        {info.category}
                      </span>
                      <h3 className="font-poppins font-bold text-base text-slate-200">
                        {info.title}
                      </h3>
                    </div>

                    <div className="flex items-center space-x-6 sm:text-right">
                      <div className="w-28 space-y-1">
                        <div className="flex justify-between text-xs text-slate-400 font-semibold">
                          <span>Progress</span>
                          <span>{info.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-1.5 border border-slate-900 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${info.progress}%` }}
                          />
                        </div>
                      </div>

                      <Link
                        to="/videos"
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 flex items-center justify-center transition-colors"
                      >
                        <FiArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 rounded-2xl border border-dashed border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
              <div className="text-slate-500 text-sm">
                You are not enrolled in any courses yet. Start your training journey today!
              </div>
              <Button to="/courses" variant="primary">
                Browse Courses
              </Button>
            </div>
          )}
        </section>

        {/* Right Col = Sidebar actions */}
        <section className="lg:col-span-4 space-y-6">
          <h2 className="font-poppins font-bold text-xl text-slate-100">
            Quick Navigation
          </h2>

          <div className="p-6 rounded-2xl border border-slate-800/80 glass space-y-4">
            <Link
              to="/assignments"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 transition-all font-medium text-sm"
            >
              <div className="flex items-center space-x-3">
                <FiFileText size={18} />
                <span>Submit Assignments</span>
              </div>
              <FiArrowRight />
            </Link>

            <Link
              to="/videos"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 transition-all font-medium text-sm"
            >
              <div className="flex items-center space-x-3">
                <FiPlayCircle size={18} />
                <span>Resume Lectures</span>
              </div>
              <FiArrowRight />
            </Link>

            <Link
              to="/profile"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 transition-all font-medium text-sm"
            >
              <div className="flex items-center space-x-3">
                <FiAward size={18} />
                <span>View Certificates</span>
              </div>
              <FiArrowRight />
            </Link>
          </div>
        </section>

      </div>

    </div>
  );
};

export default Dashboard;
