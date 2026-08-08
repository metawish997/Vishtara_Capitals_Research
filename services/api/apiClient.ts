import axios from 'axios';
import { storage } from '../storage';
import { DeviceEventEmitter } from 'react-native';

const BASE_URL = 'https://www.vishtaracapitalresearch.in/api/v1';
export const IMAGE_BASE_URL = 'https://www.vishtaracapitalresearch.in';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await storage.getToken();
    // console.log('TOKEN:', token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // console.log('REQUEST URL:', config.url);
    // console.log('REQUEST METHOD:', config.method);
    // console.log('REQUEST DATA:', config.data);
    // console.log('REQUEST HEADERS:', config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    // console.log('RESPONSE DATA:', response.data);
    return response;
  },
  (error) => {
    // console.log('AXIOS ERROR:', error?.response?.data);
    // console.log('ERROR STATUS:', error?.response?.status);
    // console.log('FULL ERROR:', JSON.stringify(error, null, 2));

    if (error?.response?.status === 401) {
      const msg = error?.response?.data?.message;
      if (msg === 'ACCOUNT_DELETED' || msg === 'This account has been deleted.') {
        DeviceEventEmitter.emit('account_deleted');
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;