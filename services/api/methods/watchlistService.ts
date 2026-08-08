import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WatchlistItem {
  _id: string;
  name: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface WatchlistScript {
  _id: string;
  watchlist: string;
  symbol: string;
  trading_symbol?: string;
  token?: string;
  exchange: string;
  ltp?: number;
  close?: number;
  net_change?: number;
  percent_change?: number;
  is_positive?: boolean;
  createdAt: string;
}

export interface AngelScrip {
  _id: string;
  symbol: string;
  name: string;
  token: string;
  exch_seg: string;
  trading_symbol?: string;
  expiry?: string;
  instrumenttype?: string;
  exchange?: string;
  isOptionChainLink?: boolean;
}

// ─── Watchlist CRUD ───────────────────────────────────────────────────────────

export async function getWatchlists(): Promise<WatchlistItem[]> {
  try {
    const res = await apiClient.get(API_ENDPOINTS.WATCHLIST.LIST);
    return res.data?.data ?? [];
  } catch (err: any) {
    console.warn('getWatchlists Error:', err?.response?.data || err.message);
    return [];
  }
}

export async function createWatchlist(name: string): Promise<WatchlistItem | null> {
  try {
    const res = await apiClient.post(API_ENDPOINTS.WATCHLIST.CREATE, { name });
    return res.data?.data ?? null;
  } catch (err: any) {
    console.warn('createWatchlist Error:', err?.response?.data || err.message);
    return null;
  }
}

export async function updateWatchlist(id: string, name: string): Promise<WatchlistItem | null> {
  try {
    const res = await apiClient.put(API_ENDPOINTS.WATCHLIST.UPDATE(id), { name });
    return res.data?.data ?? null;
  } catch (err: any) {
    console.warn('updateWatchlist Error:', err?.response?.data || err.message);
    return null;
  }
}

export async function deleteWatchlist(id: string): Promise<boolean> {
  try {
    await apiClient.delete(API_ENDPOINTS.WATCHLIST.DELETE(id));
    return true;
  } catch (err: any) {
    console.warn('deleteWatchlist Error:', err?.response?.data || err.message);
    return false;
  }
}

// ─── Scripts ──────────────────────────────────────────────────────────────────

export async function getWatchlistScripts(watchlistId: string): Promise<WatchlistScript[]> {
  try {
    const res = await apiClient.get(API_ENDPOINTS.WATCHLIST.SCRIPTS(watchlistId));
    return res.data?.data ?? [];
  } catch (err: any) {
    console.warn('getWatchlistScripts Error:', err?.response?.data || err.message);
    return [];
  }
}

export async function addScriptToWatchlist(
  watchlistId: string,
  scrip: Pick<AngelScrip, 'symbol' | 'name' | 'token' | 'exch_seg' | 'trading_symbol'>
): Promise<WatchlistScript | null> {
  try {
    const res = await apiClient.post(API_ENDPOINTS.WATCHLIST.ADD_SCRIPT, {
      watchlist: watchlistId,
      symbol: scrip.symbol,
      trading_symbol: scrip.trading_symbol ?? scrip.symbol,
      token: scrip.token,
      exchange: scrip.exch_seg ?? 'NSE',
    });
    return res.data?.data ?? null;
  } catch (err: any) {
    const msg = err?.response?.data?.message;
    if (msg?.toLowerCase().includes('already')) return null; // already added silently
    console.warn('addScriptToWatchlist Error:', msg || err.message);
    return null;
  }
}

export async function removeScriptFromWatchlist(scriptId: string): Promise<boolean> {
  try {
    await apiClient.delete(API_ENDPOINTS.WATCHLIST.REMOVE_SCRIPT(scriptId));
    return true;
  } catch (err: any) {
    console.warn('removeScriptFromWatchlist Error:', err?.response?.data || err.message);
    return false;
  }
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function searchScrips(query: string, filter: string = 'All'): Promise<AngelScrip[]> {
  if (!query || query.trim().length < 1) return [];
  try {
    const res = await apiClient.get(API_ENDPOINTS.WATCHLIST.SEARCH, {
      params: { query: query.trim(), filter },
    });
    return res.data?.data ?? [];
  } catch (err: any) {
    console.warn('searchScrips Error:', err?.response?.data || err.message);
    return [];
  }
}
