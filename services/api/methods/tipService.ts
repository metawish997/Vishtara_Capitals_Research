import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';

const tipService = {
  getAllTips: async (params?: any) => {
    const response = await apiClient.get(API_ENDPOINTS.TIPS.LIST, { params });
    return response.data;
  },
  getTipById: async (id: string | number) => {
    const response = await apiClient.get(API_ENDPOINTS.TIPS.DETAILS(id));
    return response.data;
  },
  getCategories: async () => {
    const response = await apiClient.get(API_ENDPOINTS.TIPS.CATEGORIES);
    return response.data;
  }
};

export default tipService;
