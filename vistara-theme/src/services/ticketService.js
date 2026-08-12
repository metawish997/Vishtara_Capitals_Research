import api from './api';

const ticketService = {
    // Get all tickets for the logged-in user
    getMyTickets: async () => {
        try {
            const response = await api.get('/tickets/my-tickets');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create a new ticket
    createTicket: async (ticketData) => {
        try {
            // Check if ticketData is FormData (for attachments in the future)
            const isFormData = ticketData instanceof FormData;
            const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : {};
            
            const response = await api.post('/tickets', ticketData, { headers });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Admin: Get all tickets
    getAllTickets: async () => {
        try {
            const response = await api.get('/tickets');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Admin: Update a ticket (status, admin_note)
    updateTicket: async (ticketId, data) => {
        try {
            const response = await api.put(`/tickets/${ticketId}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default ticketService;
