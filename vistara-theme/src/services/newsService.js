import api from './api';

const newsService = {
    // --- News Categories ---
    getCategories: async () => {
        const response = await api.get('/news/categories');
        return response.data;
    },
    createCategory: async (data) => {
        const response = await api.post('/news/categories', data);
        return response.data;
    },
    updateCategory: async (id, data) => {
        const response = await api.put(`/news/categories/${id}`, data);
        return response.data;
    },
    deleteCategory: async (id) => {
        const response = await api.delete(`/news/categories/${id}`);
        return response.data;
    },
    updateCategoryStatus: async (id, is_active) => {
        const response = await api.put(`/news/categories/${id}/status`, { is_active });
        return response.data;
    },

    // --- News ---
    getNews: async () => {
        const response = await api.get('/news');
        return response.data;
    },
    getSingleNews: async (slug) => {
        const response = await api.get(`/news/${slug}`);
        return response.data;
    },
    createNews: async (data) => {
        const response = await api.post('/news', data);
        return response.data;
    },
    updateNews: async (id, data) => {
        const response = await api.put(`/news/${id}`, data);
        return response.data;
    },
    deleteNews: async (id) => {
        const response = await api.delete(`/news/${id}`);
        return response.data;
    },
    updateNewsStatus: async (id, status) => {
        const response = await api.put(`/news/${id}/status`, { status });
        return response.data;
    }
};

export default newsService;
