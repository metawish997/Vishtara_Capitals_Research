import api from './api';

const leadService = {
    // Get all leads with search and filter parameters
    getLeads: async (params) => {
        const response = await api.get('/leads', { params });
        return response.data;
    },

    // Get a single lead (marks as read)
    getLead: async (id) => {
        const response = await api.get(`/leads/${id}`);
        return response.data;
    },

    // Create a new lead
    createLead: async (data) => {
        const response = await api.post('/leads', data);
        return response.data;
    },

    // Update lead details
    updateLead: async (id, data) => {
        const response = await api.put(`/leads/${id}`, data);
        return response.data;
    },

    // Delete a lead
    deleteLead: async (id) => {
        const response = await api.delete(`/leads/${id}`);
        return response.data;
    },

    // Update status only
    changeLeadStatus: async (id, statusId) => {
        const response = await api.patch(`/leads/${id}/status`, { status: statusId });
        return response.data;
    },

    // Update owner only
    changeLeadOwner: async (id, ownerId) => {
        const response = await api.patch(`/leads/${id}/owner`, { ownerLead: ownerId });
        return response.data;
    },

    // Bulk assign owner
    bulkAssignOwner: async (leadIds, ownerId) => {
        const response = await api.patch('/leads/bulk/assign', { leadIds, ownerLead: ownerId });
        return response.data;
    },

    // Update read/unread status
    changeLeadReadStatus: async (id, readStatus) => {
        const response = await api.patch(`/leads/${id}/read-status`, { readStatus });
        return response.data;
    },

    // Add comment to lead comment thread
    addComment: async (id, comment) => {
        const response = await api.post(`/leads/${id}/comments`, { comment });
        return response.data;
    },

    // Fetch comment history
    getComments: async (id) => {
        const response = await api.get(`/leads/${id}/comments`);
        return response.data;
    },

    // Fetch activity logs
    getActivityLogs: async (id) => {
        const response = await api.get(`/leads/${id}/activity`);
        return response.data;
    },

    // Fetch dropdown data (sources, categories, statuses, active employees)
    getMetadata: async () => {
        const response = await api.get('/leads/meta/dropdowns');
        return response.data;
    },

    // Fetch dashboard counters
    getDashboard: async () => {
        const response = await api.get('/leads/meta/dashboard');
        return response.data;
    }
};

export default leadService;
