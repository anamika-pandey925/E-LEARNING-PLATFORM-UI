import { apiRequest } from './api';

export const reviewService = {
  async getCourseReviews(courseId) {
    return await apiRequest(`/reviews/course/${courseId}`);
  },

  async addReview(courseId, { rating, comment }) {
    return await apiRequest(`/reviews/course/${courseId}`, {
      method: 'POST',
      body: { rating, comment },
    });
  },

  async deleteReview(id) {
    return await apiRequest(`/reviews/${id}`, {
      method: 'DELETE',
    });
  },
};

export default reviewService;
