import axios from 'axios';

export const BASE_URL = 'https://vishtaracapitalsresearch.com';
export const API_BASE_URL = `${BASE_URL}/api/v1`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Types ---

export type AngelQuoteRaw = {
  exchange: string;
  tradingSymbol: string;
  symbolToken: string;
  ltp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  netChange: number;
  percentChange: number;
  exchFeedTime?: string;
  depth?: {
    buy: any[];
    sell: any[];
  };
};

export type AngelQuoteResponse = {
  status: boolean;
  message: string;
  data: {
    fetched: AngelQuoteRaw[];
    unfetched?: any[];
  };
};

export type AngelGainerLoserRaw = {
  tradingSymbol: string;
  symbolToken: number | string;
  ltp: number;
  netChange: number;
  percentChange: number;
};

type AngelMoverAPIResponse = {
  status: boolean;
  message: string;
  data: AngelGainerLoserRaw[];
};

export type MarketMoversResult = {
  gainers: AngelGainerLoserRaw[];
  losers: AngelGainerLoserRaw[];
};

export type AngelCandle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

export type AngelHistoryResponse = {
  status: boolean;
  message: string;
  data: any[];
};

// NEW: Types for Equity Search
export type EquitySearchResponse = {
  status: boolean;
  data: string[]; // Array of stock names
};

export type EquityTokenData = {
  token: string;
  symbol: string;
  name: string;
  exch_seg: string;
};

export type EquityTokenResponse = {
  status: boolean;
  message?: string;
  data: EquityTokenData | null;
};

// --- API Config ---
const ENDPOINTS = {
  QUOTE: '/angel/quote',
  INDICES: '/angel/indices',
  MOVERS: '/angel/gainers-losers',
  HISTORY: '/angel/history',
  MARQUEE: '/angel/marquee',
  WEEK_52: '/angel/52-week-data',
  SEARCH_EQUITY: '/angel/equity/search',
  FIND_EQUITY_TOKEN: '/angel/find-token',
};

const DEFAULT_TIMEOUT = 15000; // Increased to 15s to handle backend delays
const JSON_HEADERS = { Accept: 'application/json' };

// --- Methods ---

/**
 * Fetch Market Indices (Nifty 50, Bank Nifty, etc.)
 */
export async function fetchAngelIndices(): Promise<AngelQuoteRaw[]> {
  try {
    const res = await api.get<AngelQuoteResponse>(ENDPOINTS.INDICES);

    if (!res.data?.status) {
      // console.warn('fetchAngelIndices: Backend returned false status');
      return [];
    }
    return res.data?.data?.fetched ?? [];
  } catch (err: any) {
    // 500 Error Handler: Prevent Red Screen in React Native
    if (err.response?.status === 500) {
      // console.warn('fetchAngelIndices: Server Error (500). Check Backend Logs (Angel Login Failed).');
    } else {
      // console.error('fetchAngelIndices Error:', err.message);
    }
    return [];
  }
}

/**
 * Fetch Nifty 50 Marquee Stocks (Top 20)
 */
export async function fetchNifty50Marquee(): Promise<any[]> {
  try {
    const res = await api.get(ENDPOINTS.MARQUEE);
    return res.data?.status ? res.data.data : [];
  } catch (err) {
    // console.warn('fetchNifty50Marquee Failed:', err);
    return [];
  }
}

/**
 * Fetch Top Gainers and Losers
 */
export async function fetchGainersLosers(): Promise<MarketMoversResult> {
  try {
    const config = { headers: JSON_HEADERS, timeout: DEFAULT_TIMEOUT };
    const params = { exchange: 'NSE', expirytype: 'NEAR' };

    // Parallel requests for speed
    const [gainersRes, losersRes] = await Promise.all([
      api.get<AngelMoverAPIResponse>(ENDPOINTS.MOVERS, {
        params: { ...params, datatype: 'PercPriceGainers' }
      }).catch(() => null), // Return null instead of throwing

      api.get<AngelMoverAPIResponse>(ENDPOINTS.MOVERS, {
        params: { ...params, datatype: 'PercPriceLosers' }
      }).catch(() => null),
    ]);

    const gainers = gainersRes?.data?.data || [];
    const losers = losersRes?.data?.data || [];

    return { gainers, losers };

  } catch (err) {
    // console.error('fetchGainersLosers Critical Error:', err);
    return { gainers: [], losers: [] };
  }
}

/**
 * Fetch Live Quotes for specific tokens
 */
export async function fetchAngelQuotes(symbolTokens?: string[]): Promise<AngelQuoteRaw[]> {
  try {
    if (!symbolTokens || symbolTokens.length === 0) return [];

    // Backend expects array in 'symbols' payload for POST request
    const payload = {
      symbols: symbolTokens,
      exchange: 'NSE',
      mode: 'FULL'
    };

    const res = await api.post<AngelQuoteResponse>(ENDPOINTS.QUOTE, payload);

    const fetched = res.data?.data?.fetched ?? [];

    // Ensure we return data in the order requested if possible, or just raw list
    return fetched;
  } catch (err) {
    // console.warn('fetchAngelQuotes Error:', err);
    return [];
  }
}

/**
 * Fetch Historical Candle Data
 */
export async function fetchAngelHistory(params: {
  symbolToken: string;
  exchange: 'NSE' | 'BSE' | 'NSE_INDEX';
  interval: string;
  from: string;
  to: string;
}): Promise<AngelCandle[]> {
  try {
    const res = await api.get<AngelHistoryResponse>(ENDPOINTS.HISTORY, { params });

    const data = res.data?.data;
    if (Array.isArray(data)) {
      return data.map((d: any) => {
        // Angel History returns array [time, open, high, low, close, volume]
        if (Array.isArray(d)) {
          return {
            time: d[0],
            open: d[1],
            high: d[2],
            low: d[3],
            close: d[4],
            volume: d[5],
          };
        }
        return d;
      });
    }
    return [];
  } catch (err) {
    return [];
  }
}
export async function searchEquityNames(query: string): Promise<string[]> {
  if (query.length < 2) return [];

  try {
    const res = await api.get<EquitySearchResponse>(ENDPOINTS.SEARCH_EQUITY, {
      params: { query, exchange: 'NSE' }
    });

    return res.data?.status ? res.data.data : [];
  } catch (err) {
    // console.warn('searchEquityNames Error:', err);
    return [];
  }
}


export async function findEquityToken(name: string): Promise<EquityTokenData | null> {
  try {
    const res = await api.get<EquityTokenResponse>(ENDPOINTS.FIND_EQUITY_TOKEN, {
      params: { name, exchange: 'NSE' }
    });

    if (res.data?.status && res.data?.data) {
      return res.data.data;
    }
    return null;
  } catch (err) {
    // console.warn('findEquityToken Error:', err);
    return null;
  }
}