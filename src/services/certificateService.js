import { apiRequest } from './api';

export const certificateService = {
  async getMyCertificates() {
    return await apiRequest('/certificates/my');
  },

  async getCertificateById(id) {
    return await apiRequest(`/certificates/${id}`);
  },

  async generateCertificate(courseId) {
    return await apiRequest(`/certificates/generate/${courseId}`, {
      method: 'POST',
    });
  },
};

export default certificateService;
