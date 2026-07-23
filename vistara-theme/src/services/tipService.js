import api from './api';

const tipService = {
  getTips: async (params) => {
    const response = await api.get('/tips', { params });
    return response.data;
  },

  getTipById: async (id) => {
    const response = await api.get(`/tips/${id}`);
    return response.data;
  },

  createTip: async (tipData) => {
    const response = await api.post('/tips', tipData);
    return response.data;
  },

  updateTip: async (id, tipData) => {
    const response = await api.put(`/tips/${id}`, tipData);
    return response.data;
  },

  deleteTip: async (id) => {
    const response = await api.delete(`/tips/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/tips/categories');
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await api.post('/tips/categories', categoryData);
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/tips/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/tips/categories/${id}`);
    return response.data;
  },

  updateLiveStatus: async (id, statusData) => {
    const response = await api.post(`/tips/${id}/update-live-status`, statusData);
    return response.data;
  },

  manualClose: async (id, exitData) => {
    const response = await api.post(`/tips/${id}/manual-close`, exitData);
    return response.data;
  },

  storeFollowUp: async (id, followUpData) => {
    const response = await api.post(`/tips/${id}/follow-up`, followUpData);
    return response.data;
  },

  getAccuracyDashboard: async (params) => {
    const response = await api.get('/tips/accuracy-dashboard', { params });
    return response.data;
  },

  addAdminNote: async (id, note) => {
    const response = await api.post(`/tips/${id}/notes`, { note });
    return response.data;
  }
};

export default tipService;
