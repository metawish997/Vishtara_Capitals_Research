import api from './api';

const aboutService = {
  // Core Values
  getCoreValues: () => api.get('/about/core-values'),
  updateCoreValueSection: (data) => api.post('/about/core-values/section', data),
  createCoreValueCard: (data) => api.post('/about/core-values/card', data),
  updateCoreValueCard: (id, data) => api.put(`/about/core-values/card/${id}`, data),
  deleteCoreValueCard: (id) => api.delete(`/about/core-values/card/${id}`),

  // Mission
  getMission: () => api.get('/about/mission'),
  updateMission: (data) => api.post('/about/mission', data),

  // Why Platform
  getWhyPlatform: () => api.get('/about/why-platform'),
  upsertWhyPlatformSection: (data) => api.post('/about/why-platform', data),
  deleteWhyPlatformSection: (id) => api.delete(`/about/why-platform/${id}`),
};

export default aboutService;
