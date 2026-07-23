import api from './api';

const faqService = {
    getFaqs: async () => {
        const response = await api.get('/faqs');
        return response.data;
    },
    createFaq: async (data) => {
        const response = await api.post('/faqs', data);
        return response.data;
    },
    updateFaq: async (id, data) => {
        const response = await api.put(`/faqs/${id}`, data);
        return response.data;
    },
    deleteFaq: async (id) => {
        const response = await api.delete(`/faqs/${id}`);
        return response.data;
    }
};

export default faqService;
