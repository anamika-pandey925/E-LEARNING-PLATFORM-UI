import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiCheckCircle,
  FiLoader,
  FiSend,
  FiEye,
  FiFileText,
  FiAward,
} from 'react-icons/fi';
import AssignmentCard from '../components/AssignmentCard';
import SearchBar from '../components/SearchBar';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import assignmentService from '../services/assignmentService';
import { initialAssignments } from '../utils/initialData';

const Assignments = () => {
  const {
    isAuthenticated,
    isEnrolled,
    completedAssignments,
    submitAssignment,
    enrollInCourse,
    getCourseIdForSubject,
  } = useApp();
  const navigate = useNavigate();
  const { id, assignmentId } = useParams();
  const targetParamId = id || assignmentId;

  const [assignmentsList, setAssignmentsList] = useState(initialAssignments);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubject, setActiveSubject] = useState('All');
  const [enrollingId, setEnrollingId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // PDF Viewer & Submission Modal state
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await assignmentService.getAssignments();
      if (response?.success && Array.isArray(response.data) && response.data.length > 0) {
        setAssignmentsList(response.data);
      } else {
        setAssignmentsList(initialAssignments);
      }
    } catch {
      setAssignmentsList(initialAssignments);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // Handle direct dynamic route parameter navigation
  useEffect(() => {
    if (targetParamId && assignmentsList.length > 0) {
      const matched = assignmentsList.find(
        (a) =>
          String(a.id) === String(targetParamId) ||
          String(a.assignmentId) === String(targetParamId) ||
          String(a._id) === String(targetParamId)
      );
      if (matched) {
        setSelectedAssignment(matched);
      }
    }
  }, [targetParamId, assignmentsList]);

  const handleLoginRequired = () => {
    navigate(`/login?redirect=${encodeURIComponent('/assignments')}`);
  };

  const handleEnrollAssignment = async (assignment) => {
    if (!isAuthenticated) {
      handleLoginRequired();
      return;
    }

    const courseId = assignment.courseId || getCourseIdForSubject(assignment.subject);
    setEnrollingId(assignment.id || assignment.assignmentId);
    try {
      const res = await enrollInCourse(courseId);
      setToastMessage(res?.message || `Successfully enrolled in ${assignment.subject} course!`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } finally {
      setEnrollingId(null);
    }
  };

  const subjects = ['All', 'HTML', 'CSS', 'JavaScript', 'Python'];

  const filteredAssignments = assignmentsList.filter((ass) => {
    const titleMatch = (ass.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = (ass.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = titleMatch || descMatch;
    const matchesSubject = activeSubject === 'All' || ass.subject === activeSubject;
    return matchesSearch && matchesSubject;
  });

  const handleOpenViewer = (ass) => {
    if (!isAuthenticated) {
      handleLoginRequired();
      return;
    }
    const courseId = ass.courseId || getCourseIdForSubject(ass.subject);
    if (!isEnrolled(courseId)) {
      handleEnrollAssignment(ass);
      return;
    }
    setSelectedAssignment(ass);
    setCurrentPage(1);
    setSubmissionText('');
    setSubmissionUrl('');
  };

  const handleCloseViewer = () => {
    setSelectedAssignment(null);
  };

  const handleSubmitSolution = async (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    setSubmitting(true);
    try {
      const targetId = selectedAssignment.assignmentId || selectedAssignment.id;
      const res = await submitAssignment(targetId, submissionText, submissionUrl);
      setToastMessage(res?.message || 'Assignment submitted successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      handleCloseViewer();
    } catch (err) {
      alert(err.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12 text-left">
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

      {/* Header */}
      <section className="text-center space-y-3 sm:space-y-4 py-4 sm:py-8 max-w-3xl mx-auto">
        <h1 className="font-poppins font-extrabold text-2xl sm:text-3xl md:text-4xl text-slate-100 leading-tight">
          Practical <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">Coding Assignments</span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed">
          Put theory into action with real-world task sheets. Read specifications, write your solution code, and submit for grading.
        </p>
      </section>

      {/* Filters & Search */}
      <section className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 sm:gap-6 pb-6 border-b border-slate-800/80">
        <div className="flex flex-wrap gap-2 sm:gap-2.5 w-full md:w-auto">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubject(sub)}
              className={`px-3.5 sm:px-4.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                activeSubject === sub
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10 font-bold'
                  : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-slate-700/30 hover:bg-slate-850'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search assignments..."
          className="w-full md:max-w-xs lg:max-w-md"
        />
      </section>

      {/* Grid */}
      <section className="min-h-[40vh]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
            <FiLoader size={36} className="animate-spin text-emerald-400" />
            <p className="text-sm font-medium">Loading practical assignments...</p>
          </div>
        ) : filteredAssignments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredAssignments.map((ass) => {
              const assId = ass.assignmentId || ass.id;
              const isComp = completedAssignments.includes(assId);
              const courseId = ass.courseId || getCourseIdForSubject(ass.subject);

              return (
                <AssignmentCard
                  key={assId}
                  assignment={ass}
                  isCompleted={isComp}
                  isEnrolled={isEnrolled(courseId)}
                  isAuthenticated={isAuthenticated}
                  onView={handleOpenViewer}
                  onDownload={(id) => submitAssignment(id)}
                  onSubmit={(id) => handleOpenViewer(ass)}
                  onLoginRequired={handleLoginRequired}
                  onEnroll={() => handleEnrollAssignment(ass)}
                  isEnrolling={enrollingId === assId}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-slate-500 space-y-3 text-center px-4">
            <p className="text-base sm:text-lg font-medium">No assignments found.</p>
            <p className="text-xs sm:text-sm">Try choosing another subject category.</p>
          </div>
        )}
      </section>

      {/* Interactive PDF & Submission Modal */}
      <AnimatePresence>
        {selectedAssignment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseViewer}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col z-10 glass"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/80">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 rounded shrink-0">
                    {selectedAssignment.subject}
                  </span>
                  <h2 className="font-poppins font-bold text-sm sm:text-base text-slate-100 truncate">
                    {selectedAssignment.title}
                  </h2>
                </div>

                <button
                  onClick={handleCloseViewer}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50 transition-colors"
                  aria-label="Close modal"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Modal Body: Task Content + Solution Input */}
              <div className="flex-grow overflow-y-auto p-5 sm:p-8 space-y-6">
                {/* PDF Page Simulator */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-inner relative space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3 text-xs font-semibold text-slate-500">
                    <span>Study Point Curriculum Task Sheet</span>
                    <span>
                      Page {currentPage} of {selectedAssignment.pages?.length || 1}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-poppins font-bold text-base text-emerald-400">
                      {selectedAssignment.pages?.[currentPage - 1]?.title || selectedAssignment.title}
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm font-mono leading-relaxed whitespace-pre-wrap bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                      {selectedAssignment.pages?.[currentPage - 1]?.content || selectedAssignment.description}
                    </p>
                  </div>

                  {selectedAssignment.pages && selectedAssignment.pages.length > 1 && (
                    <div className="flex items-center justify-center space-x-3 pt-2">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-30"
                      >
                        <FiChevronLeft size={16} />
                      </button>
                      <span className="text-xs text-slate-400 font-semibold">
                        {currentPage} / {selectedAssignment.pages.length}
                      </span>
                      <button
                        disabled={currentPage === selectedAssignment.pages.length}
                        onClick={() => setCurrentPage((p) => Math.min(selectedAssignment.pages.length, p + 1))}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-30"
                      >
                        <FiChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Submission Form */}
                <form onSubmit={handleSubmitSolution} className="space-y-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <h4 className="font-poppins font-bold text-sm text-slate-100 flex items-center space-x-2">
                    <FiSend className="text-emerald-400" />
                    <span>Submit Your Solution Code / Report</span>
                  </h4>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">
                      Solution Code / Notes
                    </label>
                    <textarea
                      rows={4}
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      placeholder="Paste your source code, explanation, or GitHub repository link here..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">
                      External File / Demo Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={submissionUrl}
                      onChange={(e) => setSubmissionUrl(e.target.value)}
                      placeholder="https://github.com/your-username/assignment-repo"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleCloseViewer}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <Button
                      type="submit"
                      variant="primary"
                      className="py-2 px-5 text-xs font-semibold"
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : 'Confirm Submission'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Assignments;
