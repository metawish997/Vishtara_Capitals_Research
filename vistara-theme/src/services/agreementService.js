import API from './api';

const agreementService = {
    // Store draft agreement and get e-sign URL
    storeDraftAgreement: async (data) => {
        try {
            const response = await API.post('/user/agreements/draft', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Check agreement status
    checkAgreementStatus: async (id) => {
        try {
            const response = await API.get(`/user/agreements/status/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Find existing draft
    findDraft: async (planId, durationId) => {
        try {
            const response = await API.get(`/user/agreements/draft/${planId}/${durationId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Submit manual payment
    submitManualPayment: async (formData) => {
        try {
            const response = await API.post('/user/agreements/manual-payment', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Increment try count
    incrementTryCount: async (id) => {
        try {
            const response = await API.post(`/user/agreements/increment-try/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Create Razorpay order
    createRazorpayOrder: async (planId, durationId) => {
        try {
            const response = await API.post('/user/agreements/create-razorpay-order', {
                plan_id: planId,
                duration_id: durationId
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Verify Razorpay payment
    verifyRazorpayPayment: async (paymentData) => {
        try {
            const response = await API.post('/user/agreements/verify-razorpay-payment', paymentData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get active account services
    getAccountServices: async () => {
        try {
            const response = await API.get('/user/agreements/account-services');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // ── Condition 2 Catch-Up: Complete E-Sign for existing UserAgreement ──────

    // Generate PDF + upload to Digio for a pending UserAgreement
    completeUserAgreementEsign: async (agreementId) => {
        try {
            const response = await API.post(`/user/agreements/complete-esign/${agreementId}`, {
                current_url: window.location.href
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Poll Digio and download signed PDF into the existing UserAgreement
    checkUserAgreementEsignStatus: async (agreementId) => {
        try {
            const response = await API.get(`/user/agreements/user-agreement-status/${agreementId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Strictly check Digio server (bypassing local DB cache)
    checkUserAgreementEsignStatusStrict: async (agreementId) => {
        try {
            const response = await API.get(`/user/agreements/verify-strict/${agreementId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default agreementService;
