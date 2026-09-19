import { apiRequest } from './api';

export const courseService = {
  // Get all courses with query parameters
  async getCourses({ search = '', category = 'All', level = 'All', minRating = '', sort = '', page = 1, limit = 12 } = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && category !== 'All') params.append('category', category);
    if (level && level !== 'All' && level !== 'All Levels') params.append('level', level);
    if (minRating) params.append('minRating', minRating);
    if (sort) params.append('sort', sort);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await apiRequest(`/courses${queryString}`);
  },

  // Get single course details with curriculum
  async getCourseById(id) {
    return await apiRequest(`/courses/${id}`);
  },

  // Check enrollment status
  async getEnrollmentStatus(id) {
    return await apiRequest(`/courses/${id}/enrollment-status`);
  },

  // Enroll in course
  async enrollCourse(courseId) {
    return await apiRequest(`/courses/${courseId}/enroll`, {
      method: 'POST',
    });
  },

  // Get my enrollments
  async getMyEnrollments() {
    return await apiRequest('/courses/my/enrollments');
  },

  // Get course protected content
  async getCourseContent(id) {
    return await apiRequest(`/courses/${id}/content`);
  },

  // Instructor/Admin: Create course
  async createCourse(courseData) {
    return await apiRequest('/courses', {
      method: 'POST',
      body: courseData,
    });
  },

  // Instructor/Admin: Update course
  async updateCourse(id, courseData) {
    return await apiRequest(`/courses/${id}`, {
      method: 'PUT',
      body: courseData,
    });
  },

  // Instructor/Admin: Delete course
  async deleteCourse(id) {
    return await apiRequest(`/courses/${id}`, {
      method: 'DELETE',
    });
  },
};

export default courseService;
