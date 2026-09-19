import { apiRequest } from './api';

export const discussionService = {
  async getDiscussions(courseId) {
    return await apiRequest(`/discussions/${courseId}`);
  },

  async createThread(courseId, question) {
    return await apiRequest(`/discussions/${courseId}`, {
      method: 'POST',
      body: { question },
    });
  },

  async replyToThread(threadId, answer) {
    return await apiRequest(`/discussions/${threadId}/reply`, {
      method: 'POST',
      body: { answer },
    });
  },
};

export default discussionService;
