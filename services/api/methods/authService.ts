import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { LoginRequest, RegisterRequest, AuthResponse } from '../../../types/auth.types';

export const authService = {

  // 1. Login
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },

  // 2. Register (Finalize)
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  // 3. Send OTP
  sendOtp: async (email: string, phone: string) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.SEND_OTP, {
      email: email,
      phone: phone
    });
    return response.data;
  },

  // 5. Get Acceptance Policy (GET)
  getAcceptancePolicy: async (token: string) => {
    const response = await apiClient.get('/acceptance', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });
    return response.data;
  },

  // 6. Accept Policy (POST)
  acceptPolicy: async (token: string) => {
    const response = await apiClient.post(
      API_ENDPOINTS.ACCEPTANCE.ACCEPT, // <-- Using the endpoint from your constants
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      }
    );
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },

  // --- Mocked Forgot Password Methods ---
  requestPasswordReset: async (contact: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulated success response
    return { success: true, message: `OTP sent to ${contact}` };
  },

  verifyResetOtp: async (otp: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (otp !== '123456') { // Simple mock validation for testing
      // You can use 123456 to pass or anything else to fail
      throw new Error('Invalid OTP');
    }
    return { success: true, token: 'mock-reset-token' };
  },

  resetPassword: async (password: string, token: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Password reset successfully.' };
  },

  // --- FCM Methods ---
  updateFcmToken: async (token: string) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.UPDATE_FCM_TOKEN, { fcm_token: token });
    return response.data;
  },

  removeFcmToken: async () => {
    const response = await apiClient.delete(API_ENDPOINTS.AUTH.UPDATE_FCM_TOKEN);
    return response.data;
  }
};