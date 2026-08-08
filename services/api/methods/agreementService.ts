import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';

const agreementService = {
  storeDraftAgreement: async (data: any) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AGREEMENT.DRAFT, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  findDraft: async (planId: number | string, durationId: number | string) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AGREEMENT.FIND_DRAFT(planId, durationId));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  checkAgreementStatus: async (id: number | string) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AGREEMENT.STATUS(id));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  verifyCoupon: async (code: string, amount: number) => {
    const response = await apiClient.post('/coupons/verify', {
      code: code.toUpperCase(),
      amount: amount
    });
    return response.data;
  },

  submitManualPayment: async (formData: any) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AGREEMENT.MANUAL_PAYMENT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  incrementTryCount: async (id: number | string) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AGREEMENT.INCREMENT_TRY(id));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  createRazorpayOrder: async (planId: number | string, durationId: number | string, couponCode: string | null = null) => {
    try {
      const payload: any = {
        plan_id: String(planId),
        duration_id: String(durationId),
      };
      if (couponCode) {
        payload.coupon_code = couponCode;
      }
      const response = await apiClient.post(API_ENDPOINTS.AGREEMENT.CREATE_RAZORPAY_ORDER, payload);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  verifyRazorpayPayment: async (payload: any) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AGREEMENT.VERIFY_RAZORPAY_PAYMENT, {
        razorpay_order_id: payload.razorpay_order_id,
        razorpay_payment_id: payload.razorpay_payment_id,
        razorpay_signature: payload.razorpay_signature,
        plan_id: String(payload.plan_id),
        duration_id: String(payload.duration_id),
        coupon: payload.coupon || null,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  getAccountServices: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AGREEMENT.ACCOUNT_SERVICES);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  resumeDraftAgreement: async (id: number | string) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AGREEMENT.RESUME_DRAFT(id));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  completeUserAgreementEsign: async (id: number | string) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AGREEMENT.COMPLETE_USER_AGREEMENT_ESIGN(id));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  checkUserAgreementEsignStatus: async (id: number | string) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AGREEMENT.CHECK_USER_ESIGN_STATUS(id));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
};

export default agreementService;
