import { apiRequest } from './api';

export const categoryService = {
  async getCategories() {
    return await apiRequest('/categories');
  },

  async createCategory(data) {
    return await apiRequest('/categories', {
      method: 'POST',
      body: data,
    });
  },

  async updateCategory(id, data) {
    return await apiRequest(`/categories/${id}`, {
      method: 'PUT',
      body: data,
    });
  },

  async deleteCategory(id) {
    return await apiRequest(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

export default categoryService;
