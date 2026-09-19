import { apiRequest } from './api';

export const wishlistService = {
  async getWishlist() {
    return await apiRequest('/wishlist');
  },

  async addToWishlist(courseId) {
    return await apiRequest(`/wishlist/${courseId}`, {
      method: 'POST',
    });
  },

  async removeFromWishlist(courseId) {
    return await apiRequest(`/wishlist/${courseId}`, {
      method: 'DELETE',
    });
  },
};

export default wishlistService;
