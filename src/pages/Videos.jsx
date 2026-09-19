import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  FiPlay,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiLock,
  FiBookOpen,
  FiMessageSquare,
  FiHelpCircle,
  FiFileText,
  FiSend,
  FiAward,
  FiLoader,
  FiRefreshCw,
} from 'react-icons/fi';
import videoService from '../services/videoService';
import courseService from '../services/courseService';
import discussionService from '../services/discussionService';
import quizService from '../services/quizService';
import { initialVideos } from '../utils/initialData';
import Button from '../components/Button';

const Videos = () => {
  const {
    isAuthenticated,
    isEnrolled,
    watchedVideos,
    toggleVideoWatched,
    enrollInCourse,
    getCourseIdForSubject,
    user,
  } = useApp();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: paramId, videoId: paramVideoId, courseId: paramCourseId } = useParams();

  const [videosList, setVideosList] = useState(initialVideos);
  const [activeVideo, setActiveVideo] = useState(initialVideos[0]);
  const [activeTab, setActiveTab] = useState('overview'); // overview, discussions, quiz
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Discussions state
  const [discussions, setDiscussions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [replyText, setReplyText] = useState({});
  const [loadingDiscussions, setLoadingDiscussions] = useState(false);

  // Course Quizzes state
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  // Fetch all videos
  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await videoService.getVideos({ courseId: paramCourseId });
      if (response?.success && Array.isArray(response.data) && response.data.length > 0) {
        setVideosList(response.data);

        // Resume by route param, query param, or first unwatched
        const targetVid = paramVideoId || paramId || searchParams.get('vid');
        if (targetVid) {
          const match = response.data.find((v) => (v.videoId || v.id) === targetVid);
          if (match) setActiveVideo(match);
          else setActiveVideo(response.data[0]);
        } else if (paramCourseId) {
          const matchCourse = response.data.find((v) => v.courseId === paramCourseId);
          if (matchCourse) setActiveVideo(matchCourse);
          else setActiveVideo(response.data[0]);
        } else {
          // Continue from first unwatched video
          const firstUnwatched = response.data.find((v) => !watchedVideos.includes(v.videoId || v.id));
          setActiveVideo(firstUnwatched || response.data[0]);
        }
      } else {
        setVideosList(initialVideos);
        setActiveVideo(initialVideos[0]);
      }
    } catch {
      setVideosList(initialVideos);
      setActiveVideo(initialVideos[0]);
    } finally {
      setLoading(false);
    }
  }, [searchParams, paramId, paramVideoId, paramCourseId, watchedVideos]);

  useEffect(() => {
    fetchVideos();
  }, []);

  // Fetch discussions when video changes
  const activeCourseId = activeVideo ? (activeVideo.courseId || getCourseIdForSubject(activeVideo.category)) : 'web-dev-basics';

  const loadDiscussions = useCallback(async () => {
    if (!activeCourseId) return;
    setLoadingDiscussions(true);
    try {
      const res = await discussionService.getDiscussions(activeCourseId);
      if (res?.success && Array.isArray(res.data)) {
        setDiscussions(res.data);
      }
    } catch {
      // ignore
    } finally {
      setLoadingDiscussions(false);
    }
  }, [activeCourseId]);

  const loadQuizzes = useCallback(async () => {
    try {
      const res = await quizService.getQuizzes(activeCourseId);
      if (res?.success && Array.isArray(res.data)) {
        setQuizzes(res.data);
        if (res.data.length > 0) {
          setActiveQuiz(res.data[0]);
        }
      }
    } catch {
      // ignore
    }
  }, [activeCourseId]);

  useEffect(() => {
    if (activeTab === 'discussions') {
      loadDiscussions();
    }
    if (activeTab === 'quiz') {
      loadQuizzes();
    }
  }, [activeTab, activeCourseId, loadDiscussions, loadQuizzes]);

  const currentVideoId = activeVideo ? (activeVideo.videoId || activeVideo.id) : '';
  const isCurrentWatched = watchedVideos.includes(currentVideoId);
  const enrolledInCurrent = isEnrolled(activeCourseId);

  // Navigation handlers
  const currentIndex = videosList.findIndex((v) => (v.videoId || v.id) === currentVideoId);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < videosList.length - 1;

  const handleSelectVideo = (video) => {
    setActiveVideo(video);
    setSearchParams({ vid: video.videoId || video.id });
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (hasPrev) handleSelectVideo(videosList[currentIndex - 1]);
  };

  const handleNext = () => {
    if (hasNext) handleSelectVideo(videosList[currentIndex + 1]);
  };

  const handleToggleWatched = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent('/videos')}`);
      return;
    }
    await toggleVideoWatched(currentVideoId);
  };

  const handleEnrollCurrent = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent('/videos')}`);
      return;
    }
    setEnrolling(true);
    try {
      const res = await enrollInCourse(activeCourseId);
      setToastMessage(res?.message || 'Successfully enrolled in course!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } finally {
      setEnrolling(false);
    }
  };

  const handlePostQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    try {
      await discussionService.createThread(activeCourseId, newQuestion);
      setNewQuestion('');
      loadDiscussions();
    } catch (err) {
      alert(err.message || 'Failed to post question');
    }
  };

  const handlePostReply = async (threadId) => {
    const text = replyText[threadId];
    if (!text || !text.trim()) return;
    try {
      await discussionService.replyToThread(threadId, text);
      setReplyText((prev) => ({ ...prev, [threadId]: '' }));
      loadDiscussions();
    } catch (err) {
      alert(err.message || 'Failed to post reply');
    }
  };

  const handleQuizAnswerSelect = (qIndex, oIndex) => {
    setQuizAnswers((prev) => ({ ...prev, [qIndex]: oIndex }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    setSubmittingQuiz(true);
    try {
      const answersArray = activeQuiz.questions.map((_, idx) => quizAnswers[idx] ?? null);
      const res = await quizService.submitQuiz(activeQuiz.quizId || activeQuiz._id, answersArray);
      if (res?.success) {
        setQuizResult(res.data);
      }
    } catch (err) {
      alert(err.message || 'Quiz submission failed.');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  // Progress metrics
  const completedCount = videosList.filter((vid) => watchedVideos.includes(vid.videoId || vid.id)).length;
  const progressPercent = videosList.length > 0 ? Math.round((completedCount / videosList.length) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 text-left">
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

      {/* Course Header & Progress Bar */}
      <section className="glass p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 uppercase">
              {activeVideo?.category || 'Learning Track'}
            </span>
            <h1 className="font-poppins font-bold text-base sm:text-xl text-slate-100 truncate">
              {activeVideo?.title || 'Interactive Video Learning'}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Lecture {currentIndex + 1} of {videosList.length} • Duration: {activeVideo?.duration || '45 mins'}
          </p>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full md:w-72 space-y-1.5 shrink-0">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-400">{completedCount} of {videosList.length} Completed</span>
            <span className="text-emerald-400">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2.5 border border-slate-800 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* Main Player & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Video Player Column */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-6">
          {/* Responsive Video Container */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center">
            {!isAuthenticated ? (
              <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center space-y-3 z-10">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-amber-400 flex items-center justify-center shadow-lg">
                  <FiLock size={22} />
                </div>
                <div className="space-y-1 max-w-xs">
                  <h4 className="font-poppins font-bold text-sm text-slate-200">Lecture Protected</h4>
                  <p className="text-xs text-slate-400">Please sign in to access this lecture curriculum.</p>
                </div>
                <Button
                  variant="primary"
                  to={`/login?redirect=${encodeURIComponent('/videos')}`}
                  className="py-2 px-5 text-xs font-semibold"
                >
                  Sign In to Watch
                </Button>
              </div>
            ) : !enrolledInCurrent ? (
              <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center space-y-3 z-10">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg">
                  <FiBookOpen size={22} />
                </div>
                <div className="space-y-1 max-w-xs">
                  <h4 className="font-poppins font-bold text-sm text-slate-200">Enrollment Required</h4>
                  <p className="text-xs text-slate-400">Please enroll in this course to access the video.</p>
                </div>
                <Button
                  variant="primary"
                  onClick={handleEnrollCurrent}
                  disabled={enrolling}
                  className="py-2 px-5 text-xs font-semibold"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now (Free)'}
                </Button>
              </div>
            ) : (
              <iframe
                src={activeVideo?.embedUrl}
                title={activeVideo?.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-none"
              />
            )}
          </div>

          {/* Player Controls Bar */}
          <div className="glass p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            {/* Prev / Next buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrev}
                disabled={!hasPrev}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-emerald-400 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <FiChevronLeft size={16} />
                <span className="hidden sm:inline">Previous Lesson</span>
              </button>

              <button
                onClick={handleNext}
                disabled={!hasNext}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-emerald-400 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <span className="hidden sm:inline">Next Lesson</span>
                <FiChevronRight size={16} />
              </button>
            </div>

            {/* Mark as Complete trigger */}
            {isAuthenticated && enrolledInCurrent && (
              <button
                onClick={handleToggleWatched}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm ${
                  isCurrentWatched
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 border-emerald-400'
                }`}
              >
                <FiCheckCircle size={16} />
                <span>{isCurrentWatched ? 'Completed' : 'Mark as Complete'}</span>
              </button>
            )}
          </div>

          {/* Tabbed Interactive Information */}
          <div className="glass rounded-2xl border border-slate-800 overflow-hidden">
            {/* Tab Header */}
            <div className="flex border-b border-slate-800 bg-slate-900/50">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center space-x-2 ${
                  activeTab === 'overview'
                    ? 'border-emerald-500 text-emerald-400 bg-slate-800/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FiBookOpen size={16} />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('discussions')}
                className={`px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center space-x-2 ${
                  activeTab === 'discussions'
                    ? 'border-emerald-500 text-emerald-400 bg-slate-800/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FiMessageSquare size={16} />
                <span>Q&A Discussion</span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center space-x-2 ${
                  activeTab === 'quiz'
                    ? 'border-emerald-500 text-emerald-400 bg-slate-800/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FiHelpCircle size={16} />
                <span>Course Quiz</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-5 sm:p-6">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <h3 className="font-poppins font-bold text-base text-slate-100">
                    {activeVideo?.title}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                    {activeVideo?.description || 'Learn core concepts and practical real-world exercises in this guided video tutorial.'}
                  </p>

                  {/* Resource downloads */}
                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Curriculum Resources
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to="/assignments"
                        className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400 hover:bg-slate-800 transition-colors"
                      >
                        <FiFileText size={14} />
                        <span>View Practice Assignments</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'discussions' && (
                <div className="space-y-6">
                  {/* Post Question */}
                  {isAuthenticated ? (
                    <form onSubmit={handlePostQuestion} className="space-y-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                        Ask a Question
                      </h4>
                      <textarea
                        rows={2}
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Have a doubt about this lesson? Ask instructor and peers..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                        required
                      />
                      <Button type="submit" variant="primary" className="py-1.5 px-4 text-xs font-semibold">
                        <FiSend size={13} className="mr-1.5" /> Post Question
                      </Button>
                    </form>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
                      Please log in to participate in course discussions.
                    </div>
                  )}

                  {/* Questions List */}
                  <div className="space-y-4">
                    {loadingDiscussions ? (
                      <div className="text-center py-6 text-xs text-slate-500">Loading discussions...</div>
                    ) : discussions.length > 0 ? (
                      discussions.map((d) => (
                        <div key={d._id} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
                          <div className="flex items-center space-x-2.5">
                            <img
                              src={d.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'}
                              alt={d.userName}
                              className="w-7 h-7 rounded-full object-cover border border-emerald-500/40"
                            />
                            <div>
                              <div className="text-xs font-bold text-slate-200">{d.userName}</div>
                              <div className="text-[10px] text-slate-500">{new Date(d.createdAt).toLocaleDateString()}</div>
                            </div>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-300 pl-9 font-medium">{d.question}</p>

                          {/* Replies */}
                          {d.replies && d.replies.length > 0 && (
                            <div className="pl-9 space-y-2 pt-2 border-t border-slate-800/80">
                              {d.replies.map((rep, rIdx) => (
                                <div key={rIdx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs font-semibold text-emerald-400">{rep.userName}</span>
                                    {rep.userRole === 'instructor' && (
                                      <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                                        Instructor
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-300">{rep.answer}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Reply input */}
                          {isAuthenticated && (
                            <div className="pl-9 flex items-center gap-2 pt-1">
                              <input
                                type="text"
                                value={replyText[d._id] || ''}
                                onChange={(e) => setReplyText({ ...replyText, [d._id]: e.target.value })}
                                placeholder="Reply to this thread..."
                                className="flex-grow bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                              />
                              <button
                                onClick={() => handlePostReply(d._id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-semibold"
                              >
                                Reply
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-xs text-slate-500">
                        No questions posted yet for this course. Be the first to ask!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'quiz' && (
                <div className="space-y-6">
                  {activeQuiz ? (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <h3 className="font-poppins font-bold text-base text-slate-100">
                            {activeQuiz.title}
                          </h3>
                          <p className="text-xs text-slate-400">{activeQuiz.description}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-slate-800 text-emerald-400 text-xs font-semibold border border-slate-700">
                          {activeQuiz.questions.length} Questions
                        </span>
                      </div>

                      {/* Quiz Result Display */}
                      {quizResult ? (
                        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
                          <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center text-2xl font-bold ${
                            quizResult.passed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          }`}>
                            {quizResult.percentage}%
                          </div>
                          <div>
                            <h4 className="font-poppins font-bold text-base text-slate-100">
                              {quizResult.passed ? '🎉 You Passed the Quiz!' : 'Keep Practicing!'}
                            </h4>
                            <p className="text-xs text-slate-400 mt-1">
                              You scored {quizResult.score} points ({quizResult.correctAnswersCount}/{quizResult.totalQuestions} correct).
                            </p>
                          </div>

                          <div className="space-y-3 text-left pt-3">
                            {quizResult.answersFeedback?.map((fb, idx) => (
                              <div
                                key={idx}
                                className={`p-3 rounded-xl border text-xs space-y-1 ${
                                  fb.isCorrect ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-200' : 'bg-rose-500/5 border-rose-500/20 text-slate-200'
                                }`}
                              >
                                <div className="font-semibold flex items-center justify-between">
                                  <span>Question {idx + 1}</span>
                                  <span className={fb.isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                                    {fb.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                  </span>
                                </div>
                                {fb.explanation && <p className="text-[11px] text-slate-400">{fb.explanation}</p>}
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() => {
                              setQuizResult(null);
                              setQuizAnswers({});
                            }}
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                          >
                            Retake Quiz
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-5">
                          {activeQuiz.questions.map((q, qIndex) => (
                            <div key={qIndex} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                              <h4 className="font-semibold text-xs sm:text-sm text-slate-200">
                                {qIndex + 1}. {q.questionText}
                              </h4>
                              <div className="space-y-2">
                                {q.options.map((opt, oIndex) => (
                                  <label
                                    key={oIndex}
                                    className={`flex items-center space-x-3 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                                      quizAnswers[qIndex] === oIndex
                                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-medium'
                                        : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name={`quiz-q-${qIndex}`}
                                      checked={quizAnswers[qIndex] === oIndex}
                                      onChange={() => handleQuizAnswerSelect(qIndex, oIndex)}
                                      className="accent-emerald-500"
                                    />
                                    <span>{opt}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}

                          <Button
                            variant="primary"
                            onClick={handleSubmitQuiz}
                            disabled={submittingQuiz || Object.keys(quizAnswers).length === 0}
                            className="w-full justify-center py-3 text-xs font-semibold"
                          >
                            {submittingQuiz ? 'Evaluating on Server...' : 'Submit Answers & Calculate Score'}
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-500">
                      No quiz configured for this module.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lesson Playlist Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-poppins font-bold text-sm sm:text-base text-slate-100">
                Course Playlist
              </h3>
              <span className="text-xs text-slate-500">
                {videosList.length} Lectures
              </span>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {videosList.map((video, idx) => {
                const vidId = video.videoId || video.id;
                const isSelected = vidId === currentVideoId;
                const isWatched = watchedVideos.includes(vidId);

                return (
                  <div
                    key={vidId}
                    onClick={() => handleSelectVideo(video)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md'
                        : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <h4 className={`text-xs font-semibold truncate ${isSelected ? 'text-emerald-400' : 'text-slate-200'}`}>
                          {video.title}
                        </h4>
                        <span className="text-[10px] text-slate-500">{video.duration}</span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isWatched ? (
                        <FiCheckCircle size={16} className="text-emerald-400" />
                      ) : (
                        <FiPlay size={14} className={isSelected ? 'text-emerald-400' : 'text-slate-600'} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Videos;
