import api from './api';

const certificateService = {
    getCertificates: async () => {
        const response = await api.get('/certificates');
        return response.data;
    },
    createCertificate: async (formData) => {
        const response = await api.post('/certificates', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    updateCertificate: async (id, data) => {
        const response = await api.put(`/certificates/${id}`, data);
        return response.data;
    },
    deleteCertificate: async (id) => {
        const response = await api.delete(`/certificates/${id}`);
        return response.data;
    }
};

export default certificateService;
