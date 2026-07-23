import api from './api';

const angelService = {
  login: async () => {
    const response = await api.post('/angel/login');
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/angel/logout');
    return response.data;
  },

  searchSymbols: async (query, exchange = '') => {
    const response = await api.get('/angel/search', {
      params: { query, exchange }
    });
    return response.data;
  },

  findToken: async (params) => {
    const response = await api.get('/angel/find-token', { params });
    return response.data;
  },

  getQuote: async (symbols, mode = 'FULL', exchange = 'NSE') => {
    const response = await api.post('/angel/quote', { symbols, mode, exchange });
    return response.data;
  },

  getIndices: async () => {
    const response = await api.get('/angel/indices');
    return response.data;
  },

  getWsToken: async () => {
    const response = await api.get('/angel/ws-token');
    return response.data;
  },

  getSyncStatus: async () => {
    const response = await api.get('/angel/sync-status');
    return response.data;
  },

  syncScrips: async () => {
    const response = await api.post('/angel/sync-scrips');
    return response.data;
  },

  getExpiries: async (name, exchange, type = null) => {
    const response = await api.get('/angel/expiries', { params: { name, exchange, type } });
    return response.data;
  },

  getStrikes: async (name, expiry, exchange) => {
    const response = await api.get('/angel/get-strikes', { params: { name, expiry, exchange } });
    return response.data;
  },

  get52WeekData: async (symbols, exchange) => {
    const response = await api.get('/angel/52-week-data', { params: { symbols, exchange } });
    return response.data;
  },

  searchEquitySymbols: async (query, exchange = 'NSE') => {
    const response = await api.get('/angel/equity/search', {
      params: { query, exchange }
    });
    return response.data;
  },

  getEquityLTP: async (token, exchange = 'NSE') => {
    const response = await api.get('/angel/equity/ltp', {
      params: { token, exchange }
    });
    return response.data;
  },

  getLivePrices: async (exchangeTokens) => {
    const response = await api.post('/angel/live-prices', { exchangeTokens });
    return response.data;
  }
};

export default angelService;
