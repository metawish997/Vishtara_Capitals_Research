import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';


export interface KycStartResponse {
  success: boolean;
  message?: string;
  document_id?: string;
  redirect_url?: string;
  kyc_url?: string;
}

export interface KycStatusResponse {
  success: boolean;
  kyc_status: 'none' | 'initiated' | 'pending' | 'approval_pending' | 'approved' | 'completed' | 'success' | 'failed' | 'rejected' | string;
  digio_active?: boolean;
  message?: string;
  kyc_details?: any;
  aadhaar_details?: any;
  raw_response?: any;
}

const kycService = {
 
  startKyc: async (): Promise<KycStartResponse> => {
    const response = await apiClient.post(
      API_ENDPOINTS.KYC.START
    );
    return response.data;
  },

 
  getKycStatus: async (): Promise<KycStatusResponse> => {
    const response = await apiClient.get(
      API_ENDPOINTS.KYC.STATUS
    );
    return response.data;
  },

  getKycFullDetails: async (): Promise<any> => {
    const response = await apiClient.get(
      API_ENDPOINTS.KYC.FULL_DETAILS
    );
    return response.data;
  },
};

export default kycService;
