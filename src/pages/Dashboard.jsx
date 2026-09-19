import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  FiBookOpen,
  FiPlayCircle,
  FiFileText,
  FiAward,
  FiArrowRight,
  FiCheckCircle,
  FiLoader,
  FiShield,
  FiUsers,
  FiCheck,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiX,
  FiMail,
  FiClock,
  FiHelpCircle,
} from 'react-icons/fi';
import Button from '../components/Button';
import dashboardService from '../services/dashboardService';
import courseService from '../services/courseService';
import assignmentService from '../services/assignmentService';
import authService from '../services/authService';
import contactService from '../services/contactService';

const Dashboard = () => {
  const { user, role, refreshUserData } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Instructor grading state
  const [gradingModalSubmission, setGradingModalSubmission] = useState(null);
  const [gradeMarks, setGradeMarks] = useState(100);
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [gradingLoading, setGradingLoading] = useState(false);

  // Instructor create course modal state
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('Web Dev');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseDuration, setNewCourseDuration] = useState('12 hrs');
  const [creatingCourse, setCreatingCourse] = useState(false);

  // Admin user management state
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Admin contact messages state
  const [contactMessages, setContactMessages] = useState([]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      if (role === 'admin') {
        const [dashRes, usersRes, contactRes] = await Promise.all([
          dashboardService.getAdminDashboard(),
          authService.getAllUsers(),
          contactService.getMessages(),
        ]);
        if (dashRes?.success) setData(dashRes.data);
        if (usersRes?.success) setUsersList(usersRes.data);
        if (contactRes?.success) setContactMessages(contactRes.data);
      } else if (role === 'instructor') {
        const dashRes = await dashboardService.getInstructorDashboard();
        if (dashRes?.success) setData(dashRes.data);
      } else {
        const dashRes = await dashboardService.getStudentDashboard();
        if (dashRes?.success) setData(dashRes.data);
      }
    } catch (err) {
      console.warn('[Dashboard] Could not load metrics:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [role]);

  // Instructor: Submit Grade
  const handleGradeSubmission = async (e) => {
    e.preventDefault();
    if (!gradingModalSubmission) return;
    setGradingLoading(true);
    try {
      await assignmentService.gradeSubmission(gradingModalSubmission._id, {
        marks: gradeMarks,
        feedback: gradeFeedback,
        status: 'graded',
      });
      setGradingModalSubmission(null);
      loadDashboardData();
    } catch (err) {
      alert(err.message || 'Grading failed.');
    } finally {
      setGradingLoading(false);
    }
  };

  // Instructor: Create Course
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!newCourseTitle || !newCourseDesc) return;
    setCreatingCourse(true);
    try {
      await courseService.createCourse({
        title: newCourseTitle,
        category: newCourseCategory,
        description: newCourseDesc,
        duration: newCourseDuration,
      });
      setShowCreateCourseModal(false);
      setNewCourseTitle('');
      setNewCourseDesc('');
      loadDashboardData();
    } catch (err) {
      alert(err.message || 'Course creation failed.');
    } finally {
      setCreatingCourse(false);
    }
  };

  // Admin: Update User Role
  const handleUpdateRole = async (userId, newRole) => {
    try {
      await authService.updateUserRole(userId, newRole);
      loadDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to update role.');
    }
  };

  // Admin: Delete User
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await authService.deleteUser(userId);
      loadDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to delete user.');
    }
  };

  // Admin: Update Contact Status
  const handleUpdateContactStatus = async (msgId, status) => {
    try {
      await contactService.updateMessageStatus(msgId, status);
      loadDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to update message status.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <FiLoader className="w-10 h-10 text-emerald-400 animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Loading your customized dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 text-left">
      {/* Welcome Banner */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-slate-900 to-teal-500/10 border border-emerald-500/20 glass">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <h1 className="font-poppins font-extrabold text-2xl sm:text-3xl text-slate-100">
              Welcome back, {user.name}!
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {role}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            {role === 'admin'
              ? 'Platform Administrator Console: Manage users, catalog, content, and inquiries.'
              : role === 'instructor'
              ? 'Instructor Management Suite: Review submissions, create courses, and monitor learners.'
              : 'Track your schedule, submit course evaluations, and resume where you left off.'}
          </p>
        </div>

        <div className="flex items-center space-x-3.5 shrink-0">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-emerald-500/60 object-cover shadow-lg shrink-0"
          />
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-200 truncate">{user.name}</div>
            <div className="text-xs text-slate-400 truncate">{user.email}</div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* STUDENT DASHBOARD VIEW */}
      {/* ========================================================================= */}
      {role === 'student' && data && (
        <div className="space-y-8">
          {/* Stats Summary Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <div className="p-5 rounded-2xl border border-sky-400/20 glass flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-sky-400/10 text-sky-400">
                <FiBookOpen size={22} />
              </div>
              <div>
                <div className="text-2xl font-bold font-poppins text-slate-100">
                  {data.stats?.enrolledCoursesCount || 0}
                </div>
                <div className="text-xs text-slate-400 font-medium">Enrolled Courses</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-emerald-400/20 glass flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-emerald-400/10 text-emerald-400">
                <FiPlayCircle size={22} />
              </div>
              <div>
                <div className="text-2xl font-bold font-poppins text-slate-100">
                  {data.stats?.watchedVideosCount || 0}
                </div>
                <div className="text-xs text-slate-400 font-medium">Lectures Completed</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-purple-400/20 glass flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-purple-400/10 text-purple-400">
                <FiFileText size={22} />
              </div>
              <div>
                <div className="text-2xl font-bold font-poppins text-slate-100">
                  {data.stats?.completedAssignmentsCount || 0}
                </div>
                <div className="text-xs text-slate-400 font-medium">Assignments Submitted</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-amber-400/20 glass flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-amber-400/10 text-amber-400">
                <FiAward size={22} />
              </div>
              <div>
                <div className="text-2xl font-bold font-poppins text-slate-100">
                  {data.stats?.certificatesEarnedCount || 0}
                </div>
                <div className="text-xs text-slate-400 font-medium">Certificates Earned</div>
              </div>
            </div>
          </section>

          {/* Continue Learning Banner */}
          {data.continueLearning && (
            <section className="glass p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/15 via-slate-900 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Continue Learning
                  </span>
                  <span className="text-xs text-slate-400">
                    {data.continueLearning.category}
                  </span>
                </div>
                <h3 className="font-poppins font-bold text-lg sm:text-xl text-slate-100">
                  {data.continueLearning.courseTitle}
                </h3>
                {data.continueLearning.lesson && (
                  <p className="text-xs text-slate-300">
                    Next Lesson: <strong className="text-emerald-300">{data.continueLearning.lesson.title}</strong> ({data.continueLearning.lesson.duration})
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-4 shrink-0">
                <div className="w-32 space-y-1 text-right">
                  <span className="text-xs font-bold text-emerald-400">{data.continueLearning.progress}% Complete</span>
                  <div className="w-full bg-slate-950 rounded-full h-2 border border-slate-800">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${data.continueLearning.progress}%` }}
                    />
                  </div>
                </div>

                <Button
                  variant="primary"
                  to={`/videos?vid=${data.continueLearning.lesson?.videoId || ''}`}
                  className="py-2.5 px-4 text-xs font-semibold space-x-1.5"
                >
                  <span>Resume</span>
                  <FiArrowRight size={14} />
                </Button>
              </div>
            </section>
          )}

          {/* Enrolled Courses & Certificates Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: My Courses */}
            <div className="lg:col-span-8 space-y-5">
              <h2 className="font-poppins font-bold text-lg text-slate-100">
                My Enrolled Courses
              </h2>

              {data.enrolledCourses && data.enrolledCourses.length > 0 ? (
                <div className="space-y-3.5">
                  {data.enrolledCourses.map((c) => (
                    <div
                      key={c.courseId}
                      className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                          {c.category}
                        </span>
                        <h3 className="font-poppins font-bold text-sm sm:text-base text-slate-200 truncate">
                          {c.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 truncate">{c.instructor}</p>
                      </div>

                      <div className="flex items-center space-x-4 shrink-0">
                        <div className="w-28 space-y-1 text-right">
                          <span className="text-xs font-semibold text-slate-300">{c.progress}%</span>
                          <div className="w-full bg-slate-950 rounded-full h-1.5 border border-slate-800">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${c.progress}%` }}
                            />
                          </div>
                        </div>

                        <Link
                          to="/videos"
                          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 flex items-center justify-center transition-colors"
                          title="Open Video Classroom"
                        >
                          <FiArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl border border-dashed border-slate-800 text-center space-y-3">
                  <p className="text-xs sm:text-sm text-slate-400">
                    You have not enrolled in any courses yet.
                  </p>
                  <Button to="/courses" variant="primary">
                    Explore Catalog
                  </Button>
                </div>
              )}
            </div>

            {/* Right Col: Certificates & Quick Actions */}
            <div className="lg:col-span-4 space-y-6">
              {/* Official Certificates */}
              <div className="glass p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <FiAward size={20} />
                  <h3 className="font-poppins font-bold text-sm text-slate-200">
                    My Certificates
                  </h3>
                </div>

                {data.certificates && data.certificates.length > 0 ? (
                  <div className="space-y-3">
                    {data.certificates.map((cert) => (
                      <div
                        key={cert.certificateId}
                        className="p-3.5 rounded-xl bg-slate-900/60 border border-emerald-500/20 space-y-2"
                      >
                        <div className="text-xs font-bold text-slate-200 line-clamp-1">
                          {cert.courseName}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                          <span className="text-emerald-400 font-bold">{cert.grade}</span>
                        </div>
                        <Link
                          to={`/certificates/${cert.certificateId}`}
                          className="block text-center py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors"
                        >
                          View / Print Certificate
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400 space-y-1">
                    <p>No certificates earned yet.</p>
                    <p className="text-[11px] text-slate-500">Complete all lessons in a course to unlock your official diploma.</p>
                  </div>
                )}
              </div>

              {/* Recent Quiz Scores */}
              <div className="glass p-5 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="font-poppins font-bold text-sm text-slate-200">
                  Recent Quiz Attempts
                </h3>
                {data.recentQuizAttempts && data.recentQuizAttempts.length > 0 ? (
                  <div className="space-y-2.5">
                    {data.recentQuizAttempts.map((q, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/40 border border-slate-800 text-xs">
                        <span className="text-slate-300 truncate max-w-[140px]">{q.quizId}</span>
                        <span className={`font-bold ${q.passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {q.percentage}% ({q.passed ? 'Passed' : 'Failed'})
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No quiz attempts logged yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INSTRUCTOR DASHBOARD VIEW */}
      {/* ========================================================================= */}
      {role === 'instructor' && data && (
        <div className="space-y-8">
          {/* Stats Summary */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-emerald-400/20 glass flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-emerald-400/10 text-emerald-400">
                <FiBookOpen size={22} />
              </div>
              <div>
                <div className="text-2xl font-bold font-poppins text-slate-100">{data.stats?.totalCourses || 0}</div>
                <div className="text-xs text-slate-400 font-medium">Authored Courses</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-sky-400/20 glass flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-sky-400/10 text-sky-400">
                <FiUsers size={22} />
              </div>
              <div>
                <div className="text-2xl font-bold font-poppins text-slate-100">{data.stats?.totalStudents || 0}</div>
                <div className="text-xs text-slate-400 font-medium">Total Enrollments</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-amber-400/20 glass flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-amber-400/10 text-amber-400">
                <FiFileText size={22} />
              </div>
              <div>
                <div className="text-2xl font-bold font-poppins text-slate-100">{data.stats?.pendingSubmissionsCount || 0}</div>
                <div className="text-xs text-slate-400 font-medium">Submissions to Grade</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-purple-400/20 glass flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-purple-400/10 text-purple-400">
                <FiHelpCircle size={22} />
              </div>
              <div>
                <div className="text-2xl font-bold font-poppins text-slate-100">{data.stats?.totalQuizzes || 0}</div>
                <div className="text-xs text-slate-400 font-medium">Active Quizzes</div>
              </div>
            </div>
          </section>

          {/* Instructor Courses Management */}
          <section className="glass p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-poppins font-bold text-lg text-slate-100">
                My Authored Courses
              </h2>
              <Button
                variant="primary"
                onClick={() => setShowCreateCourseModal(true)}
                className="py-1.5 px-3 text-xs font-semibold space-x-1.5"
              >
                <FiPlus size={14} />
                <span>Create New Course</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.courses && data.courses.length > 0 ? (
                data.courses.map((course) => (
                  <div key={course._id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        {course.category}
                      </span>
                      <span className="text-xs text-slate-400">{course.duration}</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-100 line-clamp-1">{course.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{course.description}</p>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-xs">
                      <span className="text-slate-500">Rating: {course.rating} ★</span>
                      <Link to={`/courses/${course.courseId}`} className="text-emerald-400 font-semibold hover:underline">
                        View Course
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-xs text-slate-500">
                  No courses created yet. Click "Create New Course" above.
                </div>
              )}
            </div>
          </section>

          {/* Student Submissions Review Panel */}
          <section className="glass p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="font-poppins font-bold text-lg text-slate-100">
              Student Submissions to Evaluate & Grade
            </h2>

            {data.submissions && data.submissions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3">Student</th>
                      <th className="p-3">Assignment</th>
                      <th className="p-3">Submitted Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Marks</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {data.submissions.map((sub) => (
                      <tr key={sub._id} className="hover:bg-slate-900/40">
                        <td className="p-3 font-semibold text-slate-200">
                          {sub.user?.name || sub.studentName}
                        </td>
                        <td className="p-3 text-emerald-400 font-mono">{sub.assignmentId}</td>
                        <td className="p-3 text-slate-400">{new Date(sub.submittedAt).toLocaleDateString()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            sub.status === 'graded' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="p-3 font-bold">{sub.marks}/{sub.maxMarks || 100}</td>
                        <td className="p-3">
                          <button
                            onClick={() => {
                              setGradingModalSubmission(sub);
                              setGradeMarks(sub.marks || 100);
                              setGradeFeedback(sub.feedback || '');
                            }}
                            className="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors"
                          >
                            Grade & Feedback
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-500">
                No submissions requiring grading right now.
              </div>
            )}
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADMIN DASHBOARD VIEW */}
      {/* ========================================================================= */}
      {role === 'admin' && data && (
        <div className="space-y-8">
          {/* Admin Stats Grid */}
          <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl border border-slate-800 glass text-center">
              <div className="text-xl font-bold font-poppins text-slate-100">{data.stats?.totalUsers || 0}</div>
              <div className="text-[11px] text-slate-400">Total Users</div>
            </div>
            <div className="p-4 rounded-2xl border border-slate-800 glass text-center">
              <div className="text-xl font-bold font-poppins text-emerald-400">{data.stats?.studentsCount || 0}</div>
              <div className="text-[11px] text-slate-400">Students</div>
            </div>
            <div className="p-4 rounded-2xl border border-slate-800 glass text-center">
              <div className="text-xl font-bold font-poppins text-sky-400">{data.stats?.instructorsCount || 0}</div>
              <div className="text-[11px] text-slate-400">Instructors</div>
            </div>
            <div className="p-4 rounded-2xl border border-slate-800 glass text-center">
              <div className="text-xl font-bold font-poppins text-purple-400">{data.stats?.coursesCount || 0}</div>
              <div className="text-[11px] text-slate-400">Courses</div>
            </div>
            <div className="p-4 rounded-2xl border border-slate-800 glass text-center">
              <div className="text-xl font-bold font-poppins text-amber-400">{data.stats?.enrollmentsCount || 0}</div>
              <div className="text-[11px] text-slate-400">Enrollments</div>
            </div>
            <div className="p-4 rounded-2xl border border-slate-800 glass text-center">
              <div className="text-xl font-bold font-poppins text-rose-400">{data.stats?.contactMessagesCount || 0}</div>
              <div className="text-[11px] text-slate-400">Contact Inquiries</div>
            </div>
          </section>

          {/* User Management Panel */}
          <section className="glass p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="font-poppins font-bold text-lg text-slate-100">
              User Role & Account Management
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">User</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Current Role</th>
                    <th className="p-3">Change Role</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {usersList.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-900/40">
                      <td className="p-3 font-semibold text-slate-200 flex items-center space-x-2">
                        <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                        <span>{u.name}</span>
                      </td>
                      <td className="p-3 text-slate-400">{u.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : u.role === 'instructor' ? 'bg-sky-500/20 text-sky-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateRole(u._id, e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                        >
                          <option value="student">Student</option>
                          <option value="instructor">Instructor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-1.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-400"
                          title="Delete User"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Contact Messages Panel */}
          <section className="glass p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="font-poppins font-bold text-lg text-slate-100">
              Student Contact & Inquiry Desk
            </h2>

            {contactMessages.length > 0 ? (
              <div className="space-y-3">
                {contactMessages.map((msg) => (
                  <div key={msg._id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-200">{msg.name}</span>
                        <span className="text-[11px] text-slate-400">({msg.email})</span>
                      </div>
                      <select
                        value={msg.status}
                        onChange={(e) => handleUpdateContactStatus(msg._id, e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-[11px] text-slate-300"
                      >
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                      </select>
                    </div>
                    <div className="text-xs font-semibold text-emerald-400">{msg.subject}</div>
                    <p className="text-xs text-slate-300">{msg.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-500">No contact inquiries.</div>
            )}
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* Instructor Grading Modal */}
      {gradingModalSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass max-w-lg w-full p-6 rounded-3xl border border-slate-800 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-poppins font-bold text-base text-slate-100">
                Grade Submission: {gradingModalSubmission.studentName}
              </h3>
              <button onClick={() => setGradingModalSubmission(null)} className="text-slate-400 hover:text-slate-200">
                <FiX size={18} />
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 max-h-40 overflow-y-auto whitespace-pre-wrap">
              {gradingModalSubmission.content}
            </div>

            <form onSubmit={handleGradeSubmission} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Awarded Marks (out of 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={gradeMarks}
                  onChange={(e) => setGradeMarks(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Instructor Evaluation Feedback</label>
                <textarea
                  rows={3}
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  placeholder="Provide guidance and remarks for the student..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingModalSubmission(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <Button type="submit" variant="primary" disabled={gradingLoading} className="py-2 px-4 text-xs font-semibold">
                  {gradingLoading ? 'Submitting Grade...' : 'Save & Publish Grade'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Instructor Create Course Modal */}
      {showCreateCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass max-w-lg w-full p-6 rounded-3xl border border-slate-800 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-poppins font-bold text-base text-slate-100">
                Create New Course
              </h3>
              <button onClick={() => setShowCreateCourseModal(false)} className="text-slate-400 hover:text-slate-200">
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Course Title</label>
                <input
                  type="text"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  placeholder="e.g. Master React & Node.js"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Category</label>
                  <select
                    value={newCourseCategory}
                    onChange={(e) => setNewCourseCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Web Dev">Web Dev</option>
                    <option value="Programming">Programming</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Academic">Academic</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Estimated Duration</label>
                  <input
                    type="text"
                    value={newCourseDuration}
                    onChange={(e) => setNewCourseDuration(e.target.value)}
                    placeholder="e.g. 15 hrs"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Description</label>
                <textarea
                  rows={3}
                  value={newCourseDesc}
                  onChange={(e) => setNewCourseDesc(e.target.value)}
                  placeholder="Course goals and curriculum overview..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateCourseModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <Button type="submit" variant="primary" disabled={creatingCourse} className="py-2 px-4 text-xs font-semibold">
                  {creatingCourse ? 'Creating...' : 'Create Course'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
