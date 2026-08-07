import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import CourseCard from '../components/CourseCard';
import SearchBar from '../components/SearchBar';
import { FiCheckCircle } from 'react-icons/fi';

const Courses = () => {
  const { enrolledCourses, enrollInCourse } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showToast, setShowToast] = useState(false);
  const [enrolledCourseName, setEnrolledCourseName] = useState('');

  const courses = [
    {
      id: 'web-dev-basics',
      title: 'Web Development Basics',
      description: 'Master the core building blocks of the web. Learn HTML5 structure, semantic elements, CSS3 styles, responsive grid/flexbox layouts, and basic page deployment.',
      duration: '12 hrs',
      rating: 4.8,
      students: '3.4k',
      category: 'Web Dev',
      image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'javascript-beginners',
      title: 'JavaScript for Beginners',
      description: 'Unlock the power of programming in the browser. Learn variables, conditional structures, loops, array methods, DOM manipulation, and asynchronous API actions.',
      duration: '18 hrs',
      rating: 4.7,
      students: '4.1k',
      category: 'Programming',
      image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'python-data-science',
      title: 'Python for Data Science',
      description: 'Step into data engineering and analysis. Understand Python coding structures, Jupyter Notebook operations, Pandas datasets, and data visualization using Matplotlib.',
      duration: '22 hrs',
      rating: 4.9,
      students: '2.8k',
      category: 'Data Science',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'math-competitive',
      title: 'Mathematics for Competitive Exams',
      description: 'Crack core quantitative sections of competitive entry tests. Cover shortcuts for probability, complex arithmetic, statistics, algebraic theories, and reasoning puzzles.',
      duration: '35 hrs',
      rating: 4.6,
      students: '1.9k',
      category: 'Academic',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'english-grammar',
      title: 'Comprehensive English Grammar',
      description: 'Refine syntax and build outstanding communications. Perfect your understanding of tenses, active/passive voice, direct speech, essay formats, and advanced vocabulary.',
      duration: '15 hrs',
      rating: 4.5,
      students: '1.2k',
      category: 'Academic',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'chemistry-physics-basics',
      title: 'Fundamentals of Science (Physics/Chemistry)',
      description: 'Delve into the core mechanisms governing the universe. Learn atomic structures, chemical bonds, thermodynamics, kinematics, laws of motion, and electromagnetic forces.',
      duration: '28 hrs',
      rating: 4.7,
      students: '1.5k',
      category: 'Academic',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const categories = ['All', 'Web Dev', 'Programming', 'Data Science', 'Academic'];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEnroll = (id) => {
    const course = courses.find(c => c.id === id);
    enrollInCourse(id);
    setEnrolledCourseName(course.title);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Toast Alert */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="flex items-center space-x-3 p-4 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-400 max-w-sm shadow-2xl glass pointer-events-auto"
            >
              <FiCheckCircle size={22} className="shrink-0" />
              <div>
                <p className="text-sm font-semibold">Enrolled Successfully!</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  You are now enrolled in <span className="text-emerald-300">{enrolledCourseName}</span>.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hero title */}
      <section className="text-center space-y-4 py-8 max-w-3xl mx-auto">
        <h1 className="font-poppins font-extrabold text-4xl text-slate-100 leading-tight">
          Explore Our <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">Available Courses</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Upgrade your expertise with lessons structured by industry pioneers. Dive into interactive topics, submit coding checkups, and collect official certifications.
        </p>
      </section>

      {/* Controls: Category Filter + Search Bar */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10'
                  : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-slate-700/30 hover:bg-slate-850'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for subjects, courses, key topics..."
          className="w-full md:max-w-xs lg:max-w-md"
        />
      </section>

      {/* Courses Grid */}
      <section className="min-h-[40vh]">
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={enrolledCourses.includes(course.id)}
                onEnroll={handleEnroll}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
            <p className="text-lg font-medium">No courses found matching your query.</p>
            <p className="text-sm">Try modifying your filter categories.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Courses;
