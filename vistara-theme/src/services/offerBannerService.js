import api from './api';

export const getOfferBanners = () => api.get('/offer-banners');
export const getOfferBannerById = (id) => api.get(`/offer-banners/${id}`);
export const createOfferBanner = (data) => api.post('/offer-banners', data);
export const updateOfferBanner = (id, data) => api.put(`/offer-banners/${id}`, data);
export const deleteOfferBanner = (id) => api.delete(`/offer-banners/${id}`);
export const trackBannerClick = (id) => api.post(`/offer-banners/${id}/click`);
