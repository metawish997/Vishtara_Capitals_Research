import axios from 'axios';

// BASE_URL is driven by .env.local (dev) or .env.production (prod) — never hardcode this.

// export const BASE_URL = 'http://localhost:5001';

// Backend url to search api's
export const BASE_URL = 'https://www.vishtaracapitalresearch.in';


export const API_BASE_URL = `${BASE_URL}/api/v1`;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach JWT Token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('bsmr_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle global errors (like 401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const isAccountDeleted = error.response.data?.message === 'ACCOUNT_DELETED' || error.response.data?.message === 'This account has been deleted.';
            // Unauthorized: Clear local storage and redirect to login
            localStorage.removeItem('bsmr_token');
            localStorage.removeItem('bsmr_user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
