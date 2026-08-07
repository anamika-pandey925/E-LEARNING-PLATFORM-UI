import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('study_point_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    const saved = localStorage.getItem('study_point_enrollments');
    return saved ? JSON.parse(saved) : [];
  });

  const [watchedVideos, setWatchedVideos] = useState(() => {
    const saved = localStorage.getItem('study_point_watched_videos');
    return saved ? JSON.parse(saved) : [];
  });

  const [completedAssignments, setCompletedAssignments] = useState(() => {
    const saved = localStorage.getItem('study_point_completed_assignments');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist state to local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem('study_point_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('study_point_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('study_point_enrollments', JSON.stringify(enrolledCourses));
  }, [enrolledCourses]);

  useEffect(() => {
    localStorage.setItem('study_point_watched_videos', JSON.stringify(watchedVideos));
  }, [watchedVideos]);

  useEffect(() => {
    localStorage.setItem('study_point_completed_assignments', JSON.stringify(completedAssignments));
  }, [completedAssignments]);

  const login = (email, password) => {
    // Simulate API call
    const mockUser = {
      name: email.split('@')[0],
      email: email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
      role: 'Student'
    };
    setUser(mockUser);
    return { success: true };
  };

  const signup = (name, email, password) => {
    const mockUser = {
      name: name,
      email: email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
      role: 'Student'
    };
    setUser(mockUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const enrollInCourse = (courseId) => {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses([...enrolledCourses, courseId]);
    }
  };

  const toggleVideoWatched = (videoId) => {
    setWatchedVideos(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const submitAssignment = (assignmentId) => {
    if (!completedAssignments.includes(assignmentId)) {
      setCompletedAssignments([...completedAssignments, assignmentId]);
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      enrolledCourses,
      watchedVideos,
      completedAssignments,
      login,
      signup,
      logout,
      enrollInCourse,
      toggleVideoWatched,
      submitAssignment
    }}>
      {children}
    </AppContext.Provider>
  );
};
