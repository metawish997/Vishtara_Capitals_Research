import api from './api';

const headerService = {
    // Menus
    getMenus: () => api.get('/header/menus'),
    createMenu: (data) => api.post('/header/menus', data),
    updateMenu: (id, data) => api.patch(`/header/menus/${id}`, data),
    deleteMenu: (id) => api.delete(`/header/menus/${id}`),
    toggleMenu: (id) => api.patch(`/header/menus/${id}/toggle`),
    reorderMenus: (order) => api.post('/header/menus/reorder', { order }),

    // Settings
    getSettings: () => api.get('/header/settings'),
    updateSettings: (data) => api.post('/header/settings', data), 
};

export default headerService;
