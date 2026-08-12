import api from './api';

const leadImportService = {
    // Upload CSV/Excel file — must use FormData (multipart)
    uploadLeads: async (formData) => {
        const response = await api.post('/lead-imports/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Get paginated import history
    getHistory: async (params) => {
        const response = await api.get('/lead-imports/history', { params });
        return response.data;
    },

    // Get single import record (for View Summary modal)
    getImportById: async (id) => {
        const response = await api.get(`/lead-imports/history/${id}`);
        return response.data;
    },

    // Get background import progress
    getImportProgress: async (jobId) => {
        const response = await api.get(`/lead-imports/progress/${jobId}`);
        return response.data;
    },

    // Get unassigned leads (ownerLead = null) with search/filter/pagination
    getUnassigned: async (params) => {
        const response = await api.get('/lead-imports/unassigned-leads', { params });
        return response.data;
    },

    // Assign an owner to a lead
    assignOwner: async (leadId, ownerLeadId) => {
        const response = await api.patch(`/leads/${leadId}/assign-owner`, { ownerLead: ownerLeadId });
        return response.data;
    }
};

export default leadImportService;
