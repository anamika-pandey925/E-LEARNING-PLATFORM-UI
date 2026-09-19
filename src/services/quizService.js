import { apiRequest } from './api';

export const quizService = {
  // Get all quizzes or by course
  async getQuizzes(courseId = '') {
    const query = courseId ? `?courseId=${courseId}` : '';
    return await apiRequest(`/quizzes${query}`);
  },

  // Get single quiz
  async getQuizById(id) {
    return await apiRequest(`/quizzes/${id}`);
  },

  // Submit quiz answers to server for evaluation
  async submitQuiz(id, answers = []) {
    return await apiRequest(`/quizzes/${id}/submit`, {
      method: 'POST',
      body: { answers },
    });
  },

  // Get user's past attempts for a quiz
  async getQuizAttempts(id) {
    return await apiRequest(`/quizzes/${id}/attempts`);
  },

  // Instructor/Admin: Create quiz
  async createQuiz(data) {
    return await apiRequest('/quizzes', {
      method: 'POST',
      body: data,
    });
  },

  // Instructor/Admin: Update quiz
  async updateQuiz(id, data) {
    return await apiRequest(`/quizzes/${id}`, {
      method: 'PUT',
      body: data,
    });
  },

  // Instructor/Admin: Delete quiz
  async deleteQuiz(id) {
    return await apiRequest(`/quizzes/${id}`, {
      method: 'DELETE',
    });
  },
};

export default quizService;
