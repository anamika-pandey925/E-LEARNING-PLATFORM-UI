import { apiRequest } from './api';

export const assignmentService = {
  // Get all assignments with filters
  async getAssignments({ search = '', subject = 'All', courseId = '' } = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (subject && subject !== 'All') params.append('subject', subject);
    if (courseId) params.append('courseId', courseId);

    const query = params.toString() ? `?${params.toString()}` : '';
    return await apiRequest(`/assignments${query}`);
  },

  // Get single assignment
  async getAssignmentById(id) {
    return await apiRequest(`/assignments/${id}`);
  },

  // Submit assignment solution
  async submitAssignment(id, content = '', fileUrl = '') {
    return await apiRequest(`/assignments/${id}/submit`, {
      method: 'POST',
      body: { content, fileUrl },
    });
  },

  // Instructor: Get submissions for assignment
  async getSubmissions(assignmentId) {
    return await apiRequest(`/assignments/${assignmentId}/submissions`);
  },

  // Instructor: Get all submissions across courses
  async getAllSubmissions() {
    return await apiRequest('/assignments/admin/all-submissions');
  },

  // Instructor: Grade submission
  async gradeSubmission(submissionId, { marks, feedback, status = 'graded' }) {
    return await apiRequest(`/assignments/submissions/${submissionId}/grade`, {
      method: 'PUT',
      body: { marks, feedback, status },
    });
  },

  // Instructor/Admin: Create assignment
  async createAssignment(data) {
    return await apiRequest('/assignments', {
      method: 'POST',
      body: data,
    });
  },

  // Instructor/Admin: Update assignment
  async updateAssignment(id, data) {
    return await apiRequest(`/assignments/${id}`, {
      method: 'PUT',
      body: data,
    });
  },

  // Instructor/Admin: Delete assignment
  async deleteAssignment(id) {
    return await apiRequest(`/assignments/${id}`, {
      method: 'DELETE',
    });
  },
};

export default assignmentService;
