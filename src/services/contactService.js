import { apiRequest } from './api';

export const contactService = {
  async sendMessage(data) {
    return await apiRequest('/contact', {
      method: 'POST',
      body: data,
    });
  },

  async getMessages() {
    return await apiRequest('/contact');
  },

  async updateMessageStatus(id, status) {
    return await apiRequest(`/contact/${id}/status`, {
      method: 'PUT',
      body: { status },
    });
  },

  async deleteMessage(id) {
    return await apiRequest(`/contact/${id}`, {
      method: 'DELETE',
    });
  },
};

export default contactService;
