import { apiRequest } from './api';

export const authService = {
  // Register user
  async register({ name, email, password, role = 'student' }) {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: { name, email, password, role },
    });
  },

  // Login user
  async login({ email, password }) {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  },

  // Get current user profile
  async getMe() {
    return await apiRequest('/auth/me');
  },

  // Update profile
  async updateProfile(profileData) {
    return await apiRequest('/auth/profile', {
      method: 'PUT',
      body: profileData,
    });
  },

  // Change password
  async changePassword({ currentPassword, newPassword }) {
    return await apiRequest('/auth/change-password', {
      method: 'PUT',
      body: { currentPassword, newPassword },
    });
  },

  // Admin: Get all users
  async getAllUsers() {
    return await apiRequest('/auth/users');
  },

  // Admin: Update user role
  async updateUserRole(id, role) {
    return await apiRequest(`/auth/users/${id}/role`, {
      method: 'PUT',
      body: { role },
    });
  },

  // Admin: Delete user
  async deleteUser(id) {
    return await apiRequest(`/auth/users/${id}`, {
      method: 'DELETE',
    });
  },
};

export default authService;
