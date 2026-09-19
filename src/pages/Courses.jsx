import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import CourseCard from '../components/CourseCard';
import SearchBar from '../components/SearchBar';
import courseService from '../services/courseService';
import categoryService from '../services/categoryService';
import { initialCourses } from '../utils/initialData';
import {
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
} from 'react-icons/fi';

const Courses = () => {
  const { isAuthenticated, enrollInCourse, isEnrolled } = useApp();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState(['All', 'Web Dev', 'Programming', 'Data Science', 'Academic']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLevel, setActiveLevel] = useState('All');
  const [activeSort, setActiveSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);

  // UI toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [enrollingId, setEnrollingId] = useState(null);

  // Fetch category list
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryService.getCategories();
        if (res?.success && Array.isArray(res.data)) {
          const names = ['All', ...res.data.map((c) => c.name)];
          setCategories(names);
        }
      } catch {
        // use fallback categories
      }
    };
    loadCategories();
  }, []);

  // Fetch courses from REST API
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await courseService.getCourses({
        search: searchQuery,
        category: activeCategory,
        level: activeLevel,
        sort: activeSort,
        page,
        limit: 9,
      });

      if (res?.success && Array.isArray(res?.data)) {
        const mapped = res.data.map((c) => ({
          id: c.courseId || c._id,
          courseId: c.courseId || c._id,
          title: c.title,
          description: c.description,
          duration: c.duration,
          rating: c.rating,
          students: c.students,
          category: c.category,
          image: c.image,
          instructor: c.instructor,
          level: c.level,
        }));
        setCourses(mapped);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages || 1);
          setTotalCourses(res.pagination.total || mapped.length);
        }
      } else {
        // Fallback
        const filtered = filterFallback(searchQuery, activeCategory, activeLevel);
        setCourses(filtered);
        setTotalPages(1);
        setTotalCourses(filtered.length);
      }
    } catch (err) {
      console.warn('[Courses Page] API unavailable, using offline dataset:', err.message);
      const filtered = filterFallback(searchQuery, activeCategory, activeLevel);
      setCourses(filtered);
      setTotalPages(1);
      setTotalCourses(filtered.length);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeCategory, activeLevel, activeSort, page]);

  const filterFallback = (search, cat, lvl) => {
    return initialCourses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = cat === 'All' || course.category === cat;
      const matchesLevel = lvl === 'All' || course.level === lvl;
      return matchesSearch && matchesCategory && matchesLevel;
    });
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCourses();
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [fetchCourses]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, activeCategory, activeLevel, activeSort]);

  const handleEnroll = async (id) => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent('/courses')}`);
      return;
    }

    const course = courses.find((c) => c.id === id || c.courseId === id);
    if (course) {
      setEnrollingId(id);
      try {
        const res = await enrollInCourse(course.courseId || id);
        setToastMessage(res?.message || 'Successfully enrolled in the course!');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      } finally {
        setEnrollingId(null);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
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
                <p className="text-sm font-semibold">Enrollment Update</p>
                <p className="text-xs text-slate-400 mt-0.5">{toastMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hero Header */}
      <section className="text-center space-y-3 sm:space-y-4 py-4 sm:py-8 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          Curated Catalog • {totalCourses} Courses Available
        </span>
        <h1 className="font-poppins font-extrabold text-2xl sm:text-3xl md:text-4xl text-slate-100 leading-tight">
          Explore Industry-Leading <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">Courses</span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed">
          Upgrade your expertise with real hands-on projects, instructor-guided lessons, and verified graduation certificates.
        </p>
      </section>

      {/* Controls & Search */}
      <section className="space-y-4 pb-6 border-b border-slate-800/80">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-2.5 items-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10 font-bold'
                  : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-slate-700/30 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter Bar: Search + Level + Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center">
          <div className="sm:col-span-6 lg:col-span-7">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, instructor..."
              className="w-full"
            />
          </div>

          <div className="sm:col-span-3 lg:col-span-2.5">
            <select
              value={activeLevel}
              onChange={(e) => setActiveLevel(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Skill Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="sm:col-span-3 lg:col-span-2.5">
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="newest">Sort: Newest</option>
              <option value="rating">Sort: Top Rated</option>
              <option value="popular">Sort: Most Enrolled</option>
              <option value="title">Sort: Alphabetical</option>
            </select>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="min-h-[45vh]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
            <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-sm font-medium">Fetching verified courses from database...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-rose-400 space-y-3 text-center px-4">
            <FiAlertCircle size={36} />
            <p className="text-base font-semibold">{error}</p>
            <button
              onClick={fetchCourses}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
            >
              <FiRefreshCw size={14} />
              <span>Retry</span>
            </button>
          </div>
        ) : courses.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {courses.map((course) => (
                <CourseCard
                  key={course.id || course.courseId}
                  course={course}
                  isEnrolled={isEnrolled(course.id || course.courseId)}
                  isEnrolling={enrollingId === (course.id || course.courseId)}
                  onEnroll={handleEnroll}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-3 pt-6 border-t border-slate-800">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-emerald-400 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  aria-label="Previous Page"
                >
                  <FiChevronLeft size={18} />
                </button>

                <div className="flex items-center space-x-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                        page === num
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-emerald-400 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  aria-label="Next Page"
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-slate-500 space-y-3 text-center px-4">
            <p className="text-base sm:text-lg font-medium">No courses found matching your query.</p>
            <p className="text-xs sm:text-sm">Try modifying your filter categories or search keywords.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
                setActiveLevel('All');
              }}
              className="text-xs text-emerald-400 hover:underline pt-2 font-semibold"
            >
              Reset all filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Courses;
