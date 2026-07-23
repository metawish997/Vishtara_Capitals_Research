import api from './api';

const API_URL = '/user/watchlists';

const getWatchlists = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

const createWatchlist = async (watchlistData) => {
  const response = await api.post(API_URL, watchlistData);
  return response.data;
};

const updateWatchlist = async (id, watchlistData) => {
  const response = await api.put(`${API_URL}/${id}`, watchlistData);
  return response.data;
};

const deleteWatchlist = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response.data;
};

const getWatchlistScripts = async (id) => {
  const response = await api.get(`${API_URL}/${id}/scripts`);
  return response.data;
};

const addScriptToWatchlist = async (scriptData) => {
  const response = await api.post(`${API_URL}/scripts`, scriptData);
  return response.data;
};

const removeScriptFromWatchlist = async (id) => {
  const response = await api.delete(`${API_URL}/scripts/${id}`);
  return response.data;
};

const searchScrips = async (query, filter = 'All') => {
  const response = await api.get(`${API_URL}/search?query=${query}&filter=${filter}`);
  return response.data;
};

const getQuotes = async (symbols) => {
  const response = await api.post('/angel/quote', { symbols });
  return response.data;
};

const watchlistService = {
  getWatchlists,
  createWatchlist,
  updateWatchlist,
  deleteWatchlist,
  getWatchlistScripts,
  addScriptToWatchlist,
  removeScriptFromWatchlist,
  searchScrips,
  getQuotes
};

export default watchlistService;
