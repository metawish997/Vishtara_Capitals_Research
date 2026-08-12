import api from './api';

const kycService = {
  /**
   * Initiate Digio KYC
   * @param {Object} data - { phone, name }
   */
  initiateKyc: async (data) => {
    try {
      const response = await api.post('/kyc/initiate', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Check KYC status from backend (which syncs with Digio)
   */
  checkStatus: async () => {
    try {
      const response = await api.get('/kyc/status');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get full KYC and User details combined
   */
  getFullDetails: async () => {
    try {
      const response = await api.get('/kyc/full-details');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default kycService;
