import api from './api';

const footerService = {
  getFullData: () => api.get('/footer/full'),
  
  // Settings
  updateSettings: (data) => api.post('/footer/settings', data),
  
  // Brand
  updateBrand: (data) => api.post('/footer/brand', data),
  
  // Columns
  createColumn: (data) => api.post('/footer/columns', data),
  updateColumn: (id, data) => api.patch(`/footer/columns/${id}`, data),
  deleteColumn: (id) => api.delete(`/footer/columns/${id}`),
  reorderColumns: (order) => api.post('/footer/columns/reorder', { order }),
  
  // Links
  createLink: (data) => api.post('/footer/links', data),
  updateLink: (id, data) => api.patch(`/footer/links/${id}`, data),
  deleteLink: (id) => api.delete(`/footer/links/${id}`),
  reorderLinks: (order) => api.post('/footer/links/reorder', { order }),
  moveLink: (link_id, new_column_id) => api.post('/footer/links/move', { link_id, new_column_id }),
  
  // Social
  createSocial: (data) => api.post('/footer/social', data),
  updateSocial: (id, data) => api.patch(`/footer/social/${id}`, data),
  deleteSocial: (id) => api.delete(`/footer/social/${id}`),
  reorderSocials: (order) => api.post('/footer/social/reorder', { order }),
};

export default footerService;
