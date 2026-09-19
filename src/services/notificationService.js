import { apiRequest } from './api';

export const notificationService = {
  async getNotifications() {
    return await apiRequest('/notifications');
  },

  async markAsRead(id) {
    return await apiRequest(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  },

  async markAllAsRead() {
    return await apiRequest('/notifications/read-all', {
      method: 'PUT',
    });
  },
};

export default notificationService;
