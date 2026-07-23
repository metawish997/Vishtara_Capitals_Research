import api from './api';

export const getBankDetails = () => api.get('/banks');
export const getBankDetailById = (id) => api.get(`/banks/${id}`);
export const createBankDetail = (data) => api.post('/banks', data);
export const updateBankDetail = (id, data) => api.put(`/banks/${id}`, data);
export const deleteBankDetail = (id) => api.delete(`/banks/${id}`);
