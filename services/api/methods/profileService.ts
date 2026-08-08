import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { storage } from '../../storage';

const customerProfileServices = {
  getAllProfiles: async () => {
    const response = await apiClient.get(
      API_ENDPOINTS.CUSTOMER_PROFILE.GET_PROFILE
    );
    return response.data?.data ?? response.data;
  },

  // --- Profile Management ---
  getProfile: async () => {
    const response = await apiClient.get(
      API_ENDPOINTS.PROFILE.GET
    );
    return response.data?.data ?? response.data;
  },

  getUserPhoneNumber: async () => {
    const response = await apiClient.get(
      API_ENDPOINTS.PROFILE.GET
    );
    return response.data?.data?.user?.phone || response.data?.data?.user?.mobile || response.data?.user?.phone || response.data?.user?.mobile;
  },

  updateGeneralProfile: async (data: any) => {
    // We use native fetch here specifically to bypass known Axios 'Network Error' 
    // issues with FormData uploads on React Native Android.
    const token = await storage.getToken();
    const BASE_URL = 'https://www.vishtaracapitalresearch.in/api/v1';
    
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.PROFILE.UPDATE}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        // CRITICAL: Do NOT set Content-Type manually! Fetch handles the multipart boundary automatically.
      },
      body: data,
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      // Simulate Axios error structure so the frontend catch block works perfectly
      throw { response: { data: responseData, status: response.status } };
    }
    
    return responseData?.data ?? responseData;
  },

  sendUpdateOtp: async (data: any) => {
    const response = await apiClient.post(
      API_ENDPOINTS.PROFILE.OTP_SEND,
      data
    );
    return response.data?.data ?? response.data;
  },

  verifyAndUpdate: async (data: any) => {
    const response = await apiClient.post(
      API_ENDPOINTS.PROFILE.OTP_VERIFY,
      data
    );
    return response.data?.data ?? response.data;
  },

  // --- Password Reset Flow ---
  sendPasswordOtp: async (data: any) => {
    const response = await apiClient.post(
      API_ENDPOINTS.PROFILE.PASSWORD.SEND_OTP,
      data
    );
    return response.data?.data ?? response.data;
  },

  verifyPasswordOtp: async (data: any) => {
    const response = await apiClient.post(
      API_ENDPOINTS.PROFILE.PASSWORD.VERIFY_OTP,
      data
    );
    return response.data?.data ?? response.data;
  },

  updatePasswordFinal: async (data: any) => {
    const response = await apiClient.post(
      API_ENDPOINTS.PROFILE.PASSWORD.UPDATE,
      data
    );
    return response.data?.data ?? response.data;
  },
};

export default customerProfileServices;