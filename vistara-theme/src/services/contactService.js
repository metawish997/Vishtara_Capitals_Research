import api from './api';

const contactService = {
    getContactDetails: () => api.get('/contacts'),
    createContactDetail: (data) => api.post('/contacts', data),
    updateContactDetail: (id, data) => api.put(`/contacts/${id}`, data),
    deleteContactDetail: (id) => api.delete(`/contacts/${id}`)
};

export default contactService;
