import api from './api';

const authService = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('bsmr_token', response.data.token);
            localStorage.setItem('bsmr_user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('bsmr_token', response.data.token);
            localStorage.setItem('bsmr_user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('bsmr_token');
        localStorage.removeItem('bsmr_user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('bsmr_user');
        return user ? JSON.parse(user) : null;
    },

    getToken: () => {
        return localStorage.getItem('bsmr_token');
    },
    
    getMe: async () => {
        const response = await api.get('/profile');
        return response.data;
    },

    updateProfile: async (userData) => {
        // If userData is FormData, axios handles Content-Type automatically but we can ensure it
        const isFormData = userData instanceof FormData;
        const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
        
        const response = await api.post('/profile/update', userData, config);
        if (response.data.data) {
            localStorage.setItem('bsmr_user', JSON.stringify(response.data.data));
        }
        return response.data;
    },

    sendUpdateOtp: async (data) => {
        const response = await api.post('/auth/send-update-otp', data);
        return response.data;
    },

    verifyUpdateContact: async (data) => {
        const response = await api.post('/auth/verify-update-contact', data);
        if (response.data.user) {
            localStorage.setItem('bsmr_user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    forgotPassword: async (data) => {
        const response = await api.post('/auth/forgot-password', data);
        return response.data;
    },

    resetPassword: async (data) => {
        const response = await api.post('/auth/reset-password', data);
        return response.data;
    }
};

export default authService;
