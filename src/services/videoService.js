import { apiRequest } from './api';

export const videoService = {
  // Get all video lectures or by course
  async getVideos(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.courseId) searchParams.append('courseId', params.courseId);
    if (params.category && params.category !== 'All') searchParams.append('category', params.category);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return await apiRequest(`/videos${query}`);
  },

  // Get single video lecture (requires enrollment)
  async getVideoById(id) {
    return await apiRequest(`/videos/${id}`);
  },

  // Toggle watched / complete state
  async toggleWatched(id) {
    return await apiRequest(`/videos/${id}/toggle-watch`, {
      method: 'POST',
    });
  },

  // Instructor/Admin: Add lesson
  async createVideoLesson(data) {
    return await apiRequest('/videos', {
      method: 'POST',
      body: data,
    });
  },

  // Instructor/Admin: Update lesson
  async updateVideoLesson(id, data) {
    return await apiRequest(`/videos/${id}`, {
      method: 'PUT',
      body: data,
    });
  },

  // Instructor/Admin: Delete lesson
  async deleteVideoLesson(id) {
    return await apiRequest(`/videos/${id}`, {
      method: 'DELETE',
    });
  },
};

export default videoService;
