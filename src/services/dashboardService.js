import { apiRequest } from './api';

export const dashboardService = {
  async getStudentDashboard() {
    return await apiRequest('/dashboard/student');
  },

  async getInstructorDashboard() {
    return await apiRequest('/dashboard/instructor');
  },

  async getAdminDashboard() {
    return await apiRequest('/dashboard/admin');
  },
};

export default dashboardService;
