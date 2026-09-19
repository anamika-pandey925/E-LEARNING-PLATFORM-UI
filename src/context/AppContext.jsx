import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import courseService from '../services/courseService';
import videoService from '../services/videoService';
import assignmentService from '../services/assignmentService';
import dashboardService from '../services/dashboardService';
import wishlistService from '../services/wishlistService';
import notificationService from '../services/notificationService';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('study_point_token') || null);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('study_point_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    const saved = localStorage.getItem('study_point_enrollments');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('study_point_wishlist');
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

  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [loadingUser, setLoadingUser] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('study_point_token', token);
    } else {
      localStorage.removeItem('study_point_token');
    }
  }, [token]);

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
    localStorage.setItem('study_point_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('study_point_watched_videos', JSON.stringify(watchedVideos));
  }, [watchedVideos]);

  useEffect(() => {
    localStorage.setItem('study_point_completed_assignments', JSON.stringify(completedAssignments));
  }, [completedAssignments]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const res = await notificationService.getNotifications();
      if (res?.success && Array.isArray(res.data)) {
        setNotifications(res.data);
        setUnreadNotificationsCount(res.unreadCount || 0);
      }
    } catch {
      // ignore offline errors
    }
  }, [token]);

  // Fetch current user and dashboard progress from backend on startup if token exists
  const refreshUserData = useCallback(async () => {
    if (!token) return;

    try {
      setLoadingUser(true);
      const userRes = await authService.getMe();
      if (userRes?.success && userRes?.data?.user) {
        setUser(userRes.data.user);
      }

      // Load live dashboard
      if (userRes?.data?.user?.role === 'student' || !userRes?.data?.user?.role) {
        const dashRes = await dashboardService.getStudentDashboard();
        if (dashRes?.success && dashRes?.data) {
          const { enrolledCourses: ecList, watchedVideos: wvList, completedAssignments: caList } = dashRes.data;
          if (ecList) {
            setEnrolledCourses(ecList.map((c) => (typeof c === 'string' ? c : c.courseId)));
          }
          if (wvList) setWatchedVideos(wvList);
          if (caList) setCompletedAssignments(caList);
        }
      }

      // Load wishlist
      try {
        const wishRes = await wishlistService.getWishlist();
        if (wishRes?.success && Array.isArray(wishRes.courseIds)) {
          setWishlist(wishRes.courseIds);
        }
      } catch {
        // ignore
      }

      fetchNotifications();
    } catch (err) {
      console.warn('[AppContext] Could not fetch fresh profile from API:', err.message);
      if (err.status === 401) {
        logout();
      }
    } finally {
      setLoadingUser(false);
    }
  }, [token, fetchNotifications]);

  useEffect(() => {
    if (token) {
      refreshUserData();
    }
  }, [token, refreshUserData]);

  // Login action
  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      if (response?.success && response?.data) {
        const { user: authUser, token: authToken } = response.data;
        setToken(authToken);
        setUser(authUser);

        if (authUser.role === 'student') {
          try {
            const dashRes = await dashboardService.getStudentDashboard();
            if (dashRes?.success && dashRes?.data) {
              const { enrolledCourses: ec, watchedVideos: wv, completedAssignments: ca } = dashRes.data;
              if (ec) setEnrolledCourses(ec.map((c) => (typeof c === 'string' ? c : c.courseId)));
              if (wv) setWatchedVideos(wv);
              if (ca) setCompletedAssignments(ca);
            }
          } catch {
            // fallback
          }
        }

        return { success: true, message: response.message || 'Login successful!' };
      }
      return { success: false, message: response?.message || 'Login failed.' };
    } catch (error) {
      return { success: false, message: error.message || 'Login failed. Please check credentials.' };
    }
  };

  // Signup action
  const signup = async (name, email, password, role = 'student') => {
    try {
      const response = await authService.register({ name, email, password, role });
      if (response?.success && response?.data) {
        const { user: authUser, token: authToken } = response.data;
        setToken(authToken);
        setUser(authUser);
        setEnrolledCourses([]);
        setWatchedVideos([]);
        setCompletedAssignments([]);
        return { success: true, message: response.message || 'Account created successfully!' };
      }
      return { success: false, message: response?.message || 'Registration failed.' };
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed.' };
    }
  };

  // Logout action
  const logout = () => {
    setToken(null);
    setUser(null);
    setEnrolledCourses([]);
    setWishlist([]);
    setWatchedVideos([]);
    setCompletedAssignments([]);
    setNotifications([]);
    setUnreadNotificationsCount(0);
    localStorage.removeItem('study_point_token');
    localStorage.removeItem('study_point_user');
    localStorage.removeItem('study_point_enrollments');
    localStorage.removeItem('study_point_wishlist');
    localStorage.removeItem('study_point_watched_videos');
    localStorage.removeItem('study_point_completed_assignments');
  };

  // Helper to map subject/category to courseId
  const getCourseIdForSubject = (subjectOrCategory) => {
    if (!subjectOrCategory) return 'web-dev-basics';
    const s = subjectOrCategory.toLowerCase();
    if (s.includes('html') || s.includes('css') || s.includes('web')) return 'web-dev-basics';
    if (s.includes('js') || s.includes('javascript') || s.includes('react') || s.includes('program')) return 'javascript-beginners';
    if (s.includes('python') || s.includes('data')) return 'python-data-science';
    if (s.includes('math') || s.includes('arithmetic')) return 'math-competitive';
    if (s.includes('english') || s.includes('grammar')) return 'english-grammar';
    if (s.includes('science') || s.includes('physics') || s.includes('chemistry') || s.includes('academic')) return 'chemistry-physics-basics';
    return subjectOrCategory;
  };

  // Helper to check enrollment
  const isEnrolled = (courseIdOrSubject) => {
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'instructor') return true;
    if (!courseIdOrSubject) return false;
    if (enrolledCourses.includes(courseIdOrSubject)) return true;
    const mappedCourseId = getCourseIdForSubject(courseIdOrSubject);
    return enrolledCourses.includes(mappedCourseId);
  };

  // Course enrollment action
  const enrollInCourse = async (courseId) => {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses((prev) => [...prev, courseId]);
    }

    if (token) {
      try {
        const res = await courseService.enrollCourse(courseId);
        await refreshUserData();
        return { success: true, message: res?.message || 'Successfully enrolled in the course!' };
      } catch (err) {
        return { success: false, message: err.message || 'Enrollment failed.' };
      }
    }
    return { success: true, message: 'Enrolled successfully' };
  };

  // Wishlist toggle
  const toggleWishlist = async (courseId) => {
    if (!user) return { success: false, message: 'Please login to save to wishlist' };
    const isPresent = wishlist.includes(courseId);

    if (isPresent) {
      setWishlist((prev) => prev.filter((id) => id !== courseId));
      try {
        await wishlistService.removeFromWishlist(courseId);
        return { success: true, message: 'Removed from wishlist' };
      } catch {
        return { success: true, message: 'Removed from wishlist' };
      }
    } else {
      setWishlist((prev) => [...prev, courseId]);
      try {
        await wishlistService.addToWishlist(courseId);
        return { success: true, message: 'Added to wishlist!' };
      } catch {
        return { success: true, message: 'Added to wishlist!' };
      }
    }
  };

  const isWishlisted = (courseId) => wishlist.includes(courseId);

  // Toggle video lecture watch action
  const toggleVideoWatched = async (videoId) => {
    const willBeWatched = !watchedVideos.includes(videoId);
    setWatchedVideos((prev) =>
      willBeWatched ? [...prev, videoId] : prev.filter((id) => id !== videoId)
    );

    if (token) {
      try {
        const res = await videoService.toggleWatched(videoId);
        await refreshUserData();
        return res;
      } catch (err) {
        console.warn('[AppContext] API video toggle failed:', err.message);
      }
    }
  };

  // Submit assignment action
  const submitAssignment = async (assignmentId, content = '', fileUrl = '') => {
    if (!completedAssignments.includes(assignmentId)) {
      setCompletedAssignments((prev) => [...prev, assignmentId]);
    }

    if (token) {
      try {
        const res = await assignmentService.submitAssignment(assignmentId, content, fileUrl);
        await refreshUserData();
        return { success: true, message: res?.message || 'Assignment submitted successfully!' };
      } catch (err) {
        return { success: false, message: err.message || 'Submission failed.' };
      }
    }
  };

  // Update profile action
  const updateUserProfile = async (profileData) => {
    setUser((prev) => (prev ? { ...prev, ...profileData } : null));

    if (token) {
      const response = await authService.updateProfile(profileData);
      if (response?.success && response?.data?.user) {
        setUser(response.data.user);
      }
      return response;
    }
  };

  // Change password action
  const changePassword = async (currentPassword, newPassword) => {
    return await authService.changePassword({ currentPassword, newPassword });
  };

  // Notifications
  const markNotificationRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
    setUnreadNotificationsCount((prev) => Math.max(0, prev - 1));
    if (token) {
      try {
        await notificationService.markAsRead(id);
      } catch {
        // ignore
      }
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadNotificationsCount(0);
    if (token) {
      try {
        await notificationService.markAllAsRead();
      } catch {
        // ignore
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        token,
        user,
        role: user?.role || 'guest',
        isAuthenticated: !!user,
        loadingUser,
        enrolledCourses,
        wishlist,
        watchedVideos,
        completedAssignments,
        notifications,
        unreadNotificationsCount,
        isEnrolled,
        isWishlisted,
        getCourseIdForSubject,
        login,
        signup,
        logout,
        enrollInCourse,
        toggleWishlist,
        toggleVideoWatched,
        submitAssignment,
        updateUserProfile,
        changePassword,
        fetchNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        refreshUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
