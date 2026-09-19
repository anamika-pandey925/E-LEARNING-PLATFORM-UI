import { apiRequest } from './api';

export const progressService = {
  async getCourseProgress(courseId) {
    return await apiRequest(`/progress/${courseId}`);
  },

  async updateProgress(courseId, data) {
    return await apiRequest(`/progress/${courseId}`, {
      method: 'PUT',
      body: data,
    });
  },
};

export default progressService;
