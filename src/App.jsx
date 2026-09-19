import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Common Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';
import BackToTop from './components/BackToTop';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy Loaded Pages
const Home = lazy(() => import('./pages/Home'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetails = lazy(() => import('./pages/CourseDetails'));
const Assignments = lazy(() => import('./pages/Assignments'));
const Videos = lazy(() => import('./pages/Videos'));
const CertificateView = lazy(() => import('./pages/CertificateView'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Scroll to Top on Route Change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen w-full bg-slate-900 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 overflow-x-hidden">
          {/* Global Navbar */}
          <Navbar />

          {/* Main App Content Area */}
          <main className="flex-grow w-full">
            <Suspense fallback={<Loader />}>
              <Routes>
                {/* Core Public Navigation Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetails />} />
                <Route path="/courses/:courseId" element={<CourseDetails />} />
                
                {/* Interactive Video Lecture Routes */}
                <Route path="/videos" element={<Videos />} />
                <Route path="/videos/:id" element={<Videos />} />
                <Route path="/videos/:videoId" element={<Videos />} />
                <Route path="/learn/:courseId" element={<Videos />} />
                
                {/* Practical Assignments Routes */}
                <Route path="/assignments" element={<Assignments />} />
                <Route path="/assignments/:id" element={<Assignments />} />
                <Route path="/assignments/:assignmentId" element={<Assignments />} />
                
                {/* Verification & Certificate Routes */}
                <Route path="/certificates/:id" element={<CertificateView />} />
                <Route path="/certificates/:certificateId" element={<CertificateView />} />
                
                {/* Static & Information Pages */}
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Authentication Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/register" element={<Signup />} />
                
                {/* Protected Student Portal Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                
                {/* 404 Catch-All Fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>

          {/* Global Footer */}
          <Footer />

          {/* Utility Buttons */}
          <BackToTop />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
