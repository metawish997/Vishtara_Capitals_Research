import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';

export interface Coupon {
  id: number | string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  min_amount: number;
}

const couponService = {
  getCoupons: async (): Promise<{ success: boolean; data: Coupon[] }> => {
    const response = await apiClient.get(API_ENDPOINTS.COUPONS.ACTIVE);
    return response.data;
  },
};

export default couponService;
