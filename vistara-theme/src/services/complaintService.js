import api from './api';

// Complaint Data (Stats)
export const getComplaintData = () => api.get('/complaints/data');
export const getComplaintDataById = (id) => api.get(`/complaints/data/${id}`);
export const createComplaintData = (data) => api.post('/complaints/data', data);
export const updateComplaintData = (id, data) => api.put(`/complaints/data/${id}`, data);
export const deleteComplaintData = (id) => api.delete(`/complaints/data/${id}`);

// Complaint Records (Master List)
export const getComplaintRecords = () => api.get('/complaints/records');
export const getComplaintRecordById = (id) => api.get(`/complaints/records/${id}`);
export const createComplaintRecord = (data) => api.post('/complaints/records', data);
export const updateComplaintRecord = (id, data) => api.put(`/complaints/records/${id}`, data);
export const deleteComplaintRecord = (id) => api.delete(`/complaints/records/${id}`);
