import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiDownload, FiCheckCircle } from 'react-icons/fi';
import AssignmentCard from '../components/AssignmentCard';
import SearchBar from '../components/SearchBar';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';

const Assignments = () => {
  const { completedAssignments, submitAssignment } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubject, setActiveSubject] = useState('All');
  
  // Custom mock PDF viewer state
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const assignmentsList = [
    {
      id: 'html-basics',
      title: 'HTML Structure & Forms',
      subject: 'HTML',
      deadline: 'Aug 18, 2026',
      fileUrl: '/assignment pdf/Assignments.pdf',
      description: 'Build a standard landing page layout and a functional registration form incorporating proper tags, metadata, semantic blocks, and field validations.',
      pages: [
        {
          pageNum: 1,
          title: 'HTML Structural Layout Task',
          content: `Task 1: Creating a Landing Page Structure
Create an index.html file containing:
- A responsive <header> block with logo and basic unordered list links.
- A main content area using <section>, <article>, and <aside> tags.
- A <footer> element with a simulated copyright claim.

Ensure all tags are closed properly, indentation is standard, and UTF-8 encoding is declared.`
        },
        {
          pageNum: 2,
          title: 'HTML Form Validation Task',
          content: `Task 2: Registration Form validation
Create a register.html form with the following inputs:
- Full Name (required, text, min 3 chars).
- Email Address (type="email", required).
- Password (type="password", min 8 chars).
- Student ID (type="number", range 1000-9999).

Test proper validation constraints in the browser before submitting.`
        }
      ]
    },
    {
      id: 'css-layouts',
      title: 'Flexbox, Grid & Responsive UI',
      subject: 'CSS',
      deadline: 'Aug 22, 2026',
      fileUrl: '/assignment pdf/Assignments1.pdf',
      description: 'Design a beautiful multi-column dashboard grid and a responsive card library that resizes fluidly on tablet, laptop, and mobile screens without breaking text boundaries.',
      pages: [
        {
          pageNum: 1,
          title: 'Asymmetrical Layouts using Grid',
          content: `Task 1: The Multi-Grid Dashboard
Create a style.css stylesheet configuring a dashboard wrapper:
- Define grid-template-rows and grid-template-columns.
- Align sidebar item to fill column 1, spans rows 1-3.
- Build header spanning columns 2-4.
- Create 3 data cards below the header that adapt size dynamically.`
        },
        {
          pageNum: 2,
          title: 'Responsive Card Grids using Flexbox',
          content: `Task 2: Fluid Flex Items
Design 4 learning cards. Apply display: flex; flex-wrap: wrap; justify-content: space-around;.
Add media queries modifying the layout structure:
- Laptop: 4 cards in a row.
- Tablet: 2 cards in a row.
- Mobile: cards stack vertically, text centers.`
        }
      ]
    },
    {
      id: 'js-dom',
      title: 'Dynamic Web App & Event Handlers',
      subject: 'JavaScript',
      deadline: 'Aug 28, 2026',
      fileUrl: '/assignment pdf/Assignments2.pdf',
      description: 'Write JavaScript code to create a dynamic Todo List containing local storage hooks, input filters, edit modal, delete animations, and completion indicators.',
      pages: [
        {
          pageNum: 1,
          title: 'Event Handlers & State Management',
          content: `Task 1: Dynamically Appending Items
Write DOM code:
- Query input field and submit button elements.
- Create event listener on button click.
- Prevent default form reload, extract input value.
- Instantiate new <li>, set text, and append to <ul> container.`
        },
        {
          pageNum: 2,
          title: 'Browser Local Storage Hookup',
          content: `Task 2: Persistence Setup
Implement persistent state:
- When a task is added, write array to localStorage as JSON string.
- Create onload hook loading the string, parsing it, and rendering cards.
- Add toggle action on item double-click marking items finished.`
        }
      ]
    },
    {
      id: 'python-basics',
      title: 'Python File Processing & Pandas',
      subject: 'Python',
      deadline: 'Sep 05, 2026',
      fileUrl: '/assignment pdf/Assignments3.pdf',
      description: 'Create a Python script to import and process CSV files, calculate data frames, handle missing values, and export aggregate data tables using Pandas.',
      pages: [
        {
          pageNum: 1,
          title: 'Python File Parsing Basics',
          content: `Task 1: Text file cleaner
Write main.py script:
- Open a text file raw.txt using "with open()" pattern.
- Parse text lines, strip spaces, discard lines starting with #.
- Write cleaned records into standard output.txt file.`
        },
        {
          pageNum: 2,
          title: 'Data Frame Analysis using Pandas',
          content: `Task 2: Aggregate Student Scores
Create data.py script:
- Load scores.csv into a pandas DataFrame.
- Compute average scores grouped by course subjects.
- Filter out records showing less than 50% score.
- Export results to final_report.csv.`
        }
      ]
    }
  ];

  const subjects = ['All', 'HTML', 'CSS', 'JavaScript', 'Python'];

  const filteredAssignments = assignmentsList.filter((ass) => {
    const matchesSearch = ass.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ass.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = activeSubject === 'All' || ass.subject === activeSubject;
    return matchesSearch && matchesSubject;
  });

  const handleOpenViewer = (ass) => {
    setSelectedAssignment(ass);
    setCurrentPage(1);
  };

  const handleCloseViewer = () => {
    setSelectedAssignment(null);
  };

  const handleSubmit = (id) => {
    submitAssignment(id);
    setSubmittedMessage(true);
    setTimeout(() => setSubmittedMessage(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Toast Alert */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
        <AnimatePresence>
          {submittedMessage && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="flex items-center space-x-3 p-4 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-400 max-w-sm shadow-2xl glass pointer-events-auto"
            >
              <FiCheckCircle size={22} className="shrink-0" />
              <div>
                <p className="text-sm font-semibold">Assignment Submitted!</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your work has been successfully logged for grading.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Header */}
      <section className="text-center space-y-4 py-8 max-w-3xl mx-auto">
        <h1 className="font-poppins font-extrabold text-4xl text-slate-100 leading-tight">
          Enhance Skills with <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">Assignments</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Put theory into action with subject challenges. Read curriculum sheets in our modern viewer, submit code models, and secure course points.
        </p>
      </section>

      {/* Filters & Search */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        
        {/* Subject Filter Tabs */}
        <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubject(sub)}
              className={`px-4.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 ${
                activeSubject === sub
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10'
                  : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-slate-700/30 hover:bg-slate-850'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search assignments..."
          className="w-full md:max-w-xs lg:max-w-md"
        />
      </section>

      {/* Grid */}
      <section className="min-h-[40vh]">
        {filteredAssignments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAssignments.map((ass) => (
              <AssignmentCard
                key={ass.id}
                assignment={ass}
                isCompleted={completedAssignments.includes(ass.id)}
                onView={handleOpenViewer}
                onDownload={submitAssignment}
                onSubmit={handleSubmit}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
            <p className="text-lg font-medium">No assignments found.</p>
            <p className="text-sm">Try choosing another subject category.</p>
          </div>
        )}
      </section>

      {/* Modern PDF Viewer Modal */}
      <AnimatePresence>
        {selectedAssignment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10">
            {/* Dark overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseViewer}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl h-[85vh] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col z-10 glass"
            >
              
              {/* Header */}
              <div className="px-6 py-4.5 border-b border-slate-850 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-slate-200">
                  <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 rounded">
                    {selectedAssignment.subject}
                  </span>
                  <h2 className="font-poppins font-bold text-lg leading-none">
                    {selectedAssignment.title}
                  </h2>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Download button inside viewer */}
                  <a
                    href={selectedAssignment.fileUrl}
                    download
                    onClick={() => submitAssignment(selectedAssignment.id)}
                    className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 transition-colors"
                  >
                    <FiDownload size={14} />
                    <span className="hidden sm:inline">Download Document</span>
                  </a>
                  {/* Close button */}
                  <button
                    onClick={handleCloseViewer}
                    className="p-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80 transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>

              {/* PDF Preview Content Body */}
              <div className="flex-grow overflow-y-auto p-6 sm:p-8 bg-slate-950/40">
                <div className="max-w-2xl mx-auto bg-slate-950 border border-slate-850 rounded-2xl p-6 sm:p-10 shadow-2xl relative min-h-[50vh] flex flex-col justify-between">
                  {/* Header page bar */}
                  <div className="flex items-center justify-between border-b border-slate-900 pb-4.5 mb-6 text-xs font-semibold text-slate-500">
                    <span>Study Point Curriculum</span>
                    <span>Page {currentPage} of {selectedAssignment.pages.length}</span>
                  </div>

                  {/* Document Text Content */}
                  <div className="text-left space-y-6 flex-grow">
                    <h3 className="font-poppins font-bold text-xl text-slate-100">
                      {selectedAssignment.pages[currentPage - 1].title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-loose whitespace-pre-wrap font-mono bg-slate-900/60 p-4.5 rounded-xl border border-slate-850">
                      {selectedAssignment.pages[currentPage - 1].content}
                    </p>
                  </div>

                  {/* Document Footer */}
                  <div className="border-t border-slate-900 pt-5 mt-8 text-center text-[10px] text-slate-650 tracking-wider uppercase font-medium">
                    Strictly for Study Point Registered Students © 2026
                  </div>
                </div>
              </div>

              {/* Navigation Page Controls */}
              <div className="px-6 py-4.5 border-t border-slate-850 flex items-center justify-between bg-slate-900/80 text-sm text-slate-400">
                <span>
                  Completed: {completedAssignments.includes(selectedAssignment.id) ? 'Yes' : 'No'}
                </span>

                <div className="flex items-center space-x-4">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="p-1.5 rounded-lg bg-slate-850 border border-slate-850 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <FiChevronLeft size={20} />
                  </button>
                  <span className="font-semibold text-slate-300">
                    {currentPage} / {selectedAssignment.pages.length}
                  </span>
                  <button
                    disabled={currentPage === selectedAssignment.pages.length}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, selectedAssignment.pages.length))}
                    className="p-1.5 rounded-lg bg-slate-850 border border-slate-850 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>

                <div>
                  {!completedAssignments.includes(selectedAssignment.id) ? (
                    <Button
                      variant="primary"
                      onClick={() => {
                        handleSubmit(selectedAssignment.id);
                        handleCloseViewer();
                      }}
                      className="py-1 px-4 text-xs md:text-sm"
                    >
                      Submit
                    </Button>
                  ) : (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center">
                      <FiCheckCircle size={15} className="mr-1" /> Verified
                    </span>
                  )}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default Assignments;
