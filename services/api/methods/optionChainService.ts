import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';

export interface OptionContract {
  _id?: string;
  symbol: string;
  name?: string;
  token?: string;
  exch_seg?: string;
  expiry?: string;
  strike?: number;
  optiontype?: 'CE' | 'PE';
  ltp?: number | string;
  close?: number | string;
  percentChange?: number | string;
  positive?: boolean;
}

export interface OptionChainRow {
  strike: number;
  is_atm: boolean;
  CE: OptionContract | null;
  PE: OptionContract | null;
}

export interface OptionChainResponse {
  success: boolean;
  data?: OptionChainRow[];
  exchange?: string;
  expiry?: string;
}

export async function getOptionChainData(symbol: string, expiry?: string): Promise<OptionChainResponse | null> {
  try {
    const res = await apiClient.get(API_ENDPOINTS.OPTION_CHAIN.DATA, {
      params: { symbol, expiry },
    });
    return res.data;
  } catch (err: any) {
    console.warn('getOptionChainData Error:', err?.response?.data || err.message);
    return null;
  }
}

export async function getOptionExpiries(symbol: string, exchange: string): Promise<string[]> {
  try {
    const res = await apiClient.get(API_ENDPOINTS.OPTION_CHAIN.EXPIRIES, {
      params: { symbol, exchange, type: 'option' },
    });
    return res.data?.data ?? [];
  } catch (err: any) {
    console.warn('getOptionExpiries Error:', err?.response?.data || err.message);
    return [];
  }
}

export async function getLiveQuotes(tokens: string[], exchange: string): Promise<Record<string, any>> {
  if (!tokens || tokens.length === 0) return {};
  try {
    const batches: string[][] = [];
    for (let i = 0; i < tokens.length; i += 40) {
      batches.push(tokens.slice(i, i + 40));
    }

    const quotesMap: Record<string, any> = {};

    for (const batch of batches) {
      const res = await apiClient.post(API_ENDPOINTS.OPTION_CHAIN.QUOTE, {
        symbols: batch,
        mode: 'FULL',
        exchange,
      });
      const fetched: any[] = res.data?.data?.fetched ?? (Array.isArray(res.data?.data) ? res.data.data : []);
      
      fetched.forEach((q: any) => {
        quotesMap[q.symbolToken] = q;
      });
    }

    return quotesMap;
  } catch (err: any) {
    console.warn('getLiveQuotes Error:', err?.response?.data || err.message);
    return {};
  }
}
