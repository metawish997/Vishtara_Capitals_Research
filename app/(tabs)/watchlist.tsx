import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Swipeable } from 'react-native-gesture-handler';
import { useRouter, useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import apiClient from '../../services/api/apiClient';
import { useAppearance } from '@/context/AppearanceContext';
import socket from '../../services/socket/socketClient';

import {
  getWatchlists,
  createWatchlist,
  updateWatchlist,
  deleteWatchlist,
  getWatchlistScripts,
  addScriptToWatchlist,
  removeScriptFromWatchlist,
  searchScrips,
  WatchlistItem,
  WatchlistScript,
  AngelScrip,
} from '../../services/api/methods/watchlistService';

// ─── Theme ────────────────────────────────────────────────────────────────────
const T = {
  bg: '#FFFFFF',
  card: '#FFFFFF',
  text: '#111827',
  sub: '#6B7280',
  border: '#E5E7EB',
  primary: '#111827',
  positive: '#10B981',
  negative: '#EF4444',
  searchBg: '#F9FAFB',
};

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ScriptWithLive extends WatchlistScript {
  livePrice?: number;
  liveClose?: number;
  liveChange?: number;
  livePercent?: number;
  livePositive?: boolean;
  liveHigh?: number;
  liveLow?: number;
  tickDirection?: number;
  tickTimestamp?: number;
}

// ─── Live quote fetch (mirrors working frontend: POST /angel/quote FULL mode) ─
async function fetchLiveQuotes(scripts: WatchlistScript[]): Promise<Record<string, any>> {
  if (scripts.length === 0) return {};

  // Group tokens by exchange (same as frontend)
  const grouped: Record<string, string[]> = {};
  scripts.forEach((s) => {
    const exch = s.exchange || 'NSE';
    if (!grouped[exch]) grouped[exch] = [];
    if (s.token) grouped[exch].push(s.token);
  });

  const quotesMap: Record<string, any> = {};
  try {
    for (const [exch, tokens] of Object.entries(grouped)) {
      if (tokens.length === 0) continue;
      const res = await apiClient.post('/angel/quote', {
        symbols: tokens,
        mode: 'FULL',
        exchange: exch,
      });
      const fetched: any[] = res.data?.data?.fetched ??
        (Array.isArray(res.data?.data) ? res.data.data : []);
      fetched.forEach((q: any) => {
        quotesMap[q.symbolToken] = q;
      });
    }
  } catch (err) {
    console.warn('fetchLiveQuotes error:', err);
  }
  return quotesMap;
}

function applyQuotes(scripts: WatchlistScript[], quotesMap: Record<string, any>): ScriptWithLive[] {
  return scripts.map((s) => {
    const q = quotesMap[s.token ?? ''];
    if (q) {
      const ltp = parseFloat(q.ltp ?? 0);
      const close = parseFloat(q.close ?? 0);
      const high = parseFloat(q.high ?? 0);
      const low = parseFloat(q.low ?? 0);
      const netChg = ltp - close;
      const pctChg = close > 0 ? (netChg / close) * 100 : 0;
      return { ...s, livePrice: ltp, liveClose: close, liveChange: netChg, livePercent: pctChg, livePositive: netChg >= 0, liveHigh: high, liveLow: low };
    }
    return { ...s, livePrice: s.ltp, liveChange: s.net_change, livePercent: s.percent_change, livePositive: s.is_positive };
  });
}




const parseSymbol = (sym: string) => {
  if (!sym) return { main: '', badge: '' };
  let s = sym.toUpperCase().trim();

  // Match BASE + DD + MMM + (optional Digits/Dots) + FUT/CE/PE
  const regex = /^([A-Z]+)[\s]*(\d{1,2})[\s]*([A-Z]{3})[\s]*([\d\.]*)[\s]*(FUT|CE|PE)$/;
  const match = s.match(regex);
  if (match) {
    let [_, base, date, month, digits, type] = match;
    
    if (base === 'CRUDEOILM') base = 'CRUDEOIL';
    else if (base === 'GOLDM') base = 'GOLD';
    else if (base === 'SILVERM' || base === 'SILVERMIC') base = 'SILVER';
    else if (base === 'NATURALGASM') base = 'NATURALGAS';
    
    if (type === 'CE' || type === 'PE') {
      let strike = digits;
      // Heuristic to remove 2-digit year (e.g. 24, 25, 26) from the start of the strike
      const yearMatch = digits.match(/^(2[4-9])(.*)/);
      if (yearMatch) {
        const possibleYear = yearMatch[1];
        const possibleStrike = yearMatch[2];
        
        // Ensure the remaining string is a plausible strike price (at least 2 digits)
        if (possibleStrike.length >= 2) {
          const isCommodity = ['CRUDEOIL', 'GOLD', 'SILVER', 'NATURALGAS', 'LEAD', 'ZINC', 'ALUMINIUM', 'COPPER'].includes(base);
          if (isCommodity) {
            // Commodities almost always include the year, and their strikes are shorter
            strike = possibleStrike;
          } else if (digits.length >= 6) {
            // Equities/Indices usually only have length >= 6 if a year is included (e.g. 2652000 -> year 26, strike 52000)
            strike = possibleStrike;
          }
        }
      }
      return { main: `${base} ${date} ${month}`, badge: strike ? `${strike} ${type}` : type };
    } else {
      return { main: `${base} ${date} ${month} ${type}`, badge: '' };
    }
  }

  return { main: sym, badge: '' };
};

const formatSymbolName = (sym: string) => {
  const p = parseSymbol(sym);
  return p.badge ? `${p.main} ${p.badge}` : p.main;
};

// ─── Stock Row (Zerodha Style) ────────────────────────────────────────────────
const StockRow = ({
  item,
  onRemove,
}: {
  item: ScriptWithLive;
  onRemove: () => void;
}) => {
  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';
  const theme = {
    card: isDark ? '#020210' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#444444',
    sub: isDark ? '#888888' : '#9b9b9b',
    border: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f0f0f0',
    primary: isDark ? '#f8b917' : '#111827',
    primaryBg: isDark ? 'rgba(248, 185, 23, 0.15)' : 'rgba(17, 24, 39, 0.1)',
  };

  const isPos = item.livePositive ?? item.is_positive ?? true;
  const pColor = isPos ? '#4caf50' : '#e53935'; // Kite-like colors
  const price = item.livePrice ?? item.ltp ?? 0;
  const change = item.liveChange ?? item.net_change ?? 0;
  const pct = item.livePercent ?? item.percent_change ?? 0;

  const pctStr = `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`;
  const chgStr = `${change >= 0 ? '+' : ''}${change.toFixed(2)}`;

  const high = item.liveHigh ?? 0;
  const low = item.liveLow ?? 0;
  const range = high - low;
  const progress = range > 0 ? ((price - low) / range) * 100 : 0;

  const router = useRouter();

  const renderRightActions = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onRemove();
        }}
        style={{ backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center', width: 70, borderBottomWidth: 1, borderBottomColor: theme.border }}
      >
        <MaterialIcons name="delete-outline" size={24} color="#FFF" />
      </TouchableOpacity>
    );
  };

  const renderLeftActions = () => {
    if (item.exchange !== 'NSE' && item.exchange !== 'NFO') return null;
    return (
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push(`/option-chain/${item.symbol}`);
        }}
        style={{ backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center', width: 70, borderBottomWidth: 1, borderBottomColor: theme.border }}
      >
        <MaterialIcons name="link" size={24} color={isDark ? '#000' : '#FFF'} />
        <Text style={{ color: isDark ? '#000' : '#FFF', fontSize: 10, marginTop: 2 }}>Chain</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions} renderLeftActions={renderLeftActions}>
      <View style={[s.stockRow, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={s.rowLeft}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[s.rowTicker, { color: theme.text }]} numberOfLines={1}>
              {parseSymbol(item.trading_symbol ?? item.symbol).main}
            </Text>
            {!!parseSymbol(item.trading_symbol ?? item.symbol).badge && (
              <View style={{ marginLeft: 6, backgroundColor: theme.primaryBg, paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 }}>
                <Text style={{ fontSize: 10, color: theme.primary, fontWeight: '600' }}>
                  {parseSymbol(item.trading_symbol ?? item.symbol).badge}
                </Text>
              </View>
            )}
          </View>
          <View style={s.rowSubLeft}>
            <Text style={[s.rowExch, { color: theme.sub }]}>{item.exchange ?? 'NSE'}</Text>
            <Text style={[s.rowName, { color: theme.sub }]} numberOfLines={1}>{formatSymbolName(item.symbol)}</Text>
          </View>
        </View>

        <View style={s.rowRight}>
          <Text style={[s.rowPrice, { color: pColor }]}>{price.toFixed(2)}</Text>
          {range > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <Text style={{ fontSize: 8, color: theme.sub, marginRight: 4 }}>{low.toFixed(1)}</Text>
              <View style={{ height: 2, width: 40, backgroundColor: theme.border, borderRadius: 1, overflow: 'hidden' }}>
                <View style={{ position: 'absolute', left: 0, width: `${Math.max(0, Math.min(100, progress))}%`, height: '100%', backgroundColor: pColor }} />
              </View>
              <Text style={{ fontSize: 8, color: theme.sub, marginLeft: 4 }}>{high.toFixed(1)}</Text>
            </View>
          )}
          <Text style={[s.rowChange, { color: theme.sub, marginTop: 2 }]}>
            {chgStr} ({pctStr})
          </Text>
        </View>
      </View>
    </Swipeable>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function WatchlistsScreen() {
  const router = useRouter();
  const [watchlists, setWatchlists] = useState<WatchlistItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [scripts, setScripts] = useState<ScriptWithLive[]>([]);
  const [newName, setNewName] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [renameValue, setRenameValue] = useState('');

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AngelScrip[]>([]);
  const [searchFilter, setSearchFilter] = useState('All');
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [sortOption, setSortOption] = useState<'Default' | 'Alpha' | 'Gainers' | 'Losers'>('Default');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Loading states
  const [listLoading, setListLoading] = useState(true);
  const [scriptsLoading, setScriptsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const liveTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const selectedIdRef = useRef(selectedId);
  selectedIdRef.current = selectedId;

  // keep a ref to current scripts so polling can read tokens without re-fetching
  const scriptsRef = useRef<WatchlistScript[]>([]);

  // ── Load watchlists ─────────────────────────────────────────────────────────
  const loadWatchlists = useCallback(async () => {
    setListLoading(true);
    const data = await getWatchlists();
    setWatchlists(data);
    if (data.length > 0) {
      setSelectedId((prev) => (prev && data.find((w) => w._id === prev) ? prev : data[0]._id));
    }
    setListLoading(false);
  }, []);

  useEffect(() => {
    loadWatchlists();
  }, []);

  // ── Load scripts + live prices ───────────────────────────────────────────────
  const loadScripts = useCallback(async (watchlistId: string, silent = false) => {
    if (!watchlistId) return;
    if (!silent) setScriptsLoading(true);
    const raw = await getWatchlistScripts(watchlistId);
    scriptsRef.current = raw;
    // Initial live price fetch
    const quotesMap = await fetchLiveQuotes(raw);
    setScripts(applyQuotes(raw, quotesMap));
    if (!silent) setScriptsLoading(false);
  }, []);

  useEffect(() => {
    if (selectedId) loadScripts(selectedId);
  }, [selectedId]);

  useFocusEffect(
    useCallback(() => {
      if (selectedIdRef.current) {
        loadScripts(selectedIdRef.current, true);
      }
    }, [loadScripts])
  );

  // ── Live price Socket.io Streaming ───────────────────────────────────────────
  useEffect(() => {
    if (scriptsRef.current.length === 0) return;

    const cached = scriptsRef.current;

    // Group by exchange
    const tokensByExchange: Record<string, string[]> = {};
    cached.forEach(s => {
      const exch = s.exchange || (s as any).exch_seg || 'NSE';
      if (s.token) {
        if (!tokensByExchange[exch]) tokensByExchange[exch] = [];
        tokensByExchange[exch].push(s.token);
      }
    });

    if (Object.keys(tokensByExchange).length > 0) {
      socket.emit('subscribe', tokensByExchange);
    }

    const handlePriceUpdate = (quote: any) => {
      if (!quote || !quote.token) return;

      setScripts((prev) => {
        const newScripts = [...prev];
        const idx = newScripts.findIndex(s => s.token === quote.token);
        if (idx === -1) return prev;

        const s = newScripts[idx];
        const ltp = parseFloat(String(quote.ltp || '0'));
        const close = parseFloat(String(quote.close || s.liveClose || s.close || '0'));
        const netChange = ltp - close;
        const pChange = close > 0 ? (netChange / close) * 100 : 0;

        const prevLtp = parseFloat(String(s.livePrice || s.ltp || '0'));
        const tickDirection = ltp > prevLtp ? 1 : ltp < prevLtp ? -1 : (s.tickDirection || 0);
        const tickTimestamp = ltp !== prevLtp ? Date.now() : s.tickTimestamp;

        const high = parseFloat(String(quote.high || s.liveHigh || '0'));
        const low = parseFloat(String(quote.low || s.liveLow || '0'));

        newScripts[idx] = {
          ...s,
          livePrice: ltp,
          liveClose: close,
          liveChange: netChange,
          livePercent: pChange,
          livePositive: netChange >= 0,
          liveHigh: high,
          liveLow: low,
          tickDirection,
          tickTimestamp
        };

        // update ref to sync
        scriptsRef.current = newScripts;
        return newScripts;
      });
    };

    socket.on('price', handlePriceUpdate);

    return () => {
      socket.off('price', handlePriceUpdate);
      if (Object.keys(tokensByExchange).length > 0) {
        socket.emit('unsubscribe', tokensByExchange);
      }
    };
  }, [scripts.length]); // re-attach when script count changes

  // ── Debounced search ─────────────────────────────────────────────────────────
  const handleSearchChange = (text: string, filter: string = searchFilter) => {
    setSearchQuery(text);
    if (filter !== searchFilter) setSearchFilter(filter);

    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!text.trim() || text.trim().length < 3) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    searchTimer.current = setTimeout(async () => {
      setSearchLoading(true);
      const results = await searchScrips(text, filter);

      const processedResults: any[] = [];
      const optionChainBases = new Set();

      results.forEach(item => {
        const type = (item.instrumenttype || '').toUpperCase();
        if (type.includes('OPT')) {
          let baseName = item.name;
          if (!baseName) {
            const nameMatch = item.symbol.match(/^([A-Z]+)/i);
            baseName = nameMatch ? nameMatch[1] : 'Unknown';
          }
          const chainKey = `${baseName}-${item.exch_seg}`;
          if (!optionChainBases.has(chainKey)) {
            optionChainBases.add(chainKey);
            processedResults.push({
              _id: `opt-chain-${chainKey}`,
              isOptionChainLink: true,
              symbol: baseName,
              name: baseName,
              instrumenttype: item.instrumenttype,
              exch_seg: item.exch_seg,
              exchange: item.exchange || item.exch_seg
            });
          }
        } else {
          processedResults.push(item);
        }
      });

      setSearchResults(processedResults);
      setShowDropdown(true);
      setSearchLoading(false);
    }, 400);
  };

  // ── Add script ───────────────────────────────────────────────────────────────
  const handleAddScript = async (scrip: AngelScrip) => {
    setShowDropdown(false);
    setSearchQuery('');
    setSearchResults([]);
    if (!selectedId) return;
    await addScriptToWatchlist(selectedId, scrip);
    await loadScripts(selectedId);
  };

  // ── Remove script ─────────────────────────────────────────────────────────────
  const handleRemoveScript = async (scriptId: string) => {
    const ok = await removeScriptFromWatchlist(scriptId);
    if (ok) setScripts((p) => p.filter((s) => s._id !== scriptId));
  };

  // ── Create watchlist ──────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!newName.trim()) { setShowCreate(false); return; }
    const wl = await createWatchlist(newName.trim());
    if (wl) {
      setWatchlists((p) => [...p, wl]);
      setSelectedId(wl._id);
      setNewName('');
      setShowCreate(false);
    }
  };

  // ── Rename watchlist ──────────────────────────────────────────────────────────
  const handleRename = async () => {
    const trimmed = renameValue.trim();
    if (!trimmed) {
      setIsRenaming(false);
      return;
    }
    const currentName = watchlists.find(w => w._id === selectedId)?.name;
    if (trimmed === currentName) {
      setIsRenaming(false);
      return;
    }
    const updated = await updateWatchlist(selectedId, trimmed);
    if (updated) {
      setWatchlists((p) => p.map((w) => (w._id === selectedId ? updated : w)));
    }
    setIsRenaming(false);
  };

  // ── Delete watchlist ──────────────────────────────────────────────────────────
  const handleDelete = () => {
    if (watchlists.length <= 1) return;
    const wl = watchlists.find((w) => w._id === selectedId);
    Alert.alert('Delete Watchlist', `Delete "${wl?.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          const ok = await deleteWatchlist(selectedId);
          if (ok) {
            const rest = watchlists.filter((w) => w._id !== selectedId);
            setWatchlists(rest);
            setSelectedId(rest[0]?._id ?? '');
            setScripts([]);
          }
        },
      },
    ]);
  };

  // ── Pull-to-refresh ───────────────────────────────────────────────────────────
  const onRefresh = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRefreshing(true);
    await loadWatchlists();
    if (selectedId) await loadScripts(selectedId);
    setRefreshing(false);
  };

  const selected = watchlists.find((w) => w._id === selectedId);

  const sortedScripts = React.useMemo(() => {
    let list = [...scripts];
    if (sortOption === 'Alpha') {
      list.sort((a, b) => (a.symbol || '').localeCompare(b.symbol || ''));
    } else if (sortOption === 'Gainers') {
      list.sort((a, b) => (b.livePercent ?? b.percent_change ?? 0) - (a.livePercent ?? a.percent_change ?? 0));
    } else if (sortOption === 'Losers') {
      list.sort((a, b) => (a.livePercent ?? a.percent_change ?? 0) - (b.livePercent ?? b.percent_change ?? 0));
    }
    return list;
  }, [scripts, sortOption]);

  // ─────────────────────────────────────────────────────────────────────────────
  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';
  const theme = {
    bg: isDark ? '#020210' : '#FFFFFF',
    card: isDark ? '#040410' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#111827',
    sub: isDark ? '#B5B2B1' : '#6B7280',
    border: isDark ? 'rgba(248, 185, 23, 0.15)' : '#E5E7EB',
    primary: isDark ? '#f8b917' : '#111827',
    primaryBg: isDark ? 'rgba(248, 185, 23, 0.15)' : 'rgba(17, 24, 39, 0.1)',
    searchBg: isDark ? '#1C1C24' : '#F9FAFB',
    negative: '#EF4444',
    positive: '#10B981',
    emptyIcon: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB',
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.bg} />

      {/* ── Top Header Row (Tabs + New) ── */}
      <View style={s.headerRow}>
        {listLoading ? (
          <ActivityIndicator size="small" color={theme.primary} style={{ marginVertical: 8, marginHorizontal: 20 }} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={s.tabRow}
            contentContainerStyle={s.tabsScroll}
          >
            {watchlists.map((item) => {
              const active = item._id === selectedId;
              return (
                <TouchableOpacity
                  key={item._id}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setSelectedId(item._id); setIsRenaming(false); }}
                  style={[s.tab, active && [s.tabActive, { borderBottomColor: theme.primary }]]}
                >
                  <Text style={[s.tabText, { color: theme.text }, active && [s.tabTextActive, { color: theme.primary }]]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  {active && (
                    <MaterialIcons name="keyboard-arrow-down" size={16} color={theme.primary} style={{ marginLeft: 4 }} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
        <TouchableOpacity style={s.newBtn} onPress={() => setShowCreate(!showCreate)}>
          <MaterialIcons name="add" size={18} color={theme.primary} />
          <Text style={[s.newBtnText, { color: theme.primary }]}>New</Text>
        </TouchableOpacity>
      </View>

      {/* ── Create Watchlist Input ── */}
      {showCreate && (
        <View style={s.createRow}>
          <TextInput
            placeholder="New watchlist name..."
            placeholderTextColor={theme.sub + '80'}
            value={newName}
            onChangeText={setNewName}
            onSubmitEditing={handleCreate}
            returnKeyType="done"
            style={[s.createInput, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
            autoFocus
          />
          <TouchableOpacity onPress={handleCreate} style={[s.createBtn, { backgroundColor: theme.primary }]}>
            <MaterialIcons name="check" size={20} color={isDark ? '#000' : '#fff'} />
          </TouchableOpacity>
        </View>
      )}

      {/* ── Action Bar ── */}
      <View style={[s.actionBar, { borderBottomColor: theme.border, zIndex: 101 }]}>
        {isRenaming ? (
          <View style={s.renameRow}>
            <TextInput
              value={renameValue}
              onChangeText={setRenameValue}
              onSubmitEditing={handleRename}
              onBlur={handleRename}
              style={[s.renameInput, { color: theme.text, borderBottomColor: theme.primary }]}
              autoFocus
            />
          </View>
        ) : (
          <View style={[s.renameRow, { justifyContent: 'space-between' }]}>
            <Text style={[s.selectedName, { color: theme.text }]} numberOfLines={1}>{selected?.name ?? ''}</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ position: 'relative', marginRight: 4 }}>
                <TouchableOpacity
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowSortMenu(!showSortMenu); setShowMenu(false); }}
                  style={{ padding: 4 }}
                >
                  <MaterialIcons name="sort" size={20} color={theme.sub} />
                </TouchableOpacity>
                {showSortMenu && (
                  <View style={[s.menuPopup, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    {['Default', 'Alpha', 'Gainers', 'Losers'].map(opt => (
                      <TouchableOpacity
                        key={opt}
                        style={[s.menuItem, { borderBottomWidth: 1, borderBottomColor: theme.border }]}
                        onPress={() => {
                          setSortOption(opt as any);
                          setShowSortMenu(false);
                        }}
                      >
                        <Text style={{ color: sortOption === opt ? theme.primary : theme.text, fontSize: 13, fontWeight: sortOption === opt ? '600' : '400' }}>
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={{ position: 'relative' }}>
                <TouchableOpacity
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowMenu(!showMenu); setShowSortMenu(false); }}
                  style={{ padding: 4 }}
                >
                  <MaterialIcons name="more-vert" size={20} color={theme.sub} />
                </TouchableOpacity>

                {showMenu && (
                  <View style={[s.menuPopup, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <TouchableOpacity
                      style={s.menuItem}
                      onPress={() => {
                        setShowMenu(false);
                        setRenameValue(selected?.name ?? '');
                        setIsRenaming(true);
                      }}
                    >
                      <MaterialIcons name="edit" size={16} color={theme.sub} style={{ marginRight: 8 }} />
                      <Text style={{ color: theme.text, fontSize: 14 }}>Rename</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[s.menuItem, { borderTopWidth: 1, borderTopColor: theme.border }]}
                      onPress={() => {
                        setShowMenu(false);
                        handleDelete();
                      }}
                      disabled={watchlists.length <= 1}
                    >
                      <MaterialIcons name="delete-outline" size={16} color={watchlists.length <= 1 ? theme.sub : theme.negative} style={{ marginRight: 8 }} />
                      <Text style={{ color: watchlists.length <= 1 ? theme.sub : theme.negative, fontSize: 14 }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
      </View>

      {/* ── Tap Outside Overlay ── */}
      {(showDropdown || showMenu || showSortMenu) && (
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => {
            setShowDropdown(false);
            setShowMenu(false);
            setShowSortMenu(false);
          }}
        />
      )}

      {/* ── Search Bar ── */}
      <View style={s.searchWrapper}>
        <View style={[s.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <MaterialIcons name="search" size={20} color={theme.sub} style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search eg: infy bse, nifty fut"
            placeholderTextColor={theme.sub + '80'}
            value={searchQuery}
            onChangeText={(t) => handleSearchChange(t, searchFilter)}
            style={[s.searchInput, { color: theme.text }]}
            returnKeyType="search"
          />
          {searchLoading && <ActivityIndicator size="small" color={theme.primary} style={{ marginLeft: 4 }} />}
          {searchQuery.length > 0 && !searchLoading && (
            <TouchableOpacity onPress={() => { setSearchQuery(''); setSearchResults([]); setShowDropdown(false); }}>
              <MaterialIcons name="close" size={15} color={theme.sub} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Search Dropdown ── */}
        {showDropdown && (
          <View style={[s.dropdown, { backgroundColor: theme.card, borderColor: theme.border }]}>

            {/* Filter Tabs */}
            <ScrollView keyboardShouldPersistTaps="handled" horizontal showsHorizontalScrollIndicator={false} style={{ borderBottomWidth: 1, borderBottomColor: theme.border }} contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 8 }}>
              {['All', 'Cash', 'Futures', 'Options', 'MCX', 'NSE'].map(tab => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => handleSearchChange(searchQuery, tab)}
                  style={[s.filterTab, searchFilter === tab ? { backgroundColor: theme.primary } : { backgroundColor: theme.searchBg }]}
                >
                  <Text style={[s.filterTabText, searchFilter === tab ? { color: theme.bg } : { color: theme.sub }]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 220 }}>
              {(() => {
                const filteredResults = searchResults.filter(item => {
                  if (searchFilter === 'All') return true;
                  if (searchFilter === 'MCX') return (item.exch_seg || item.exchange) === 'MCX';
                  if (searchFilter === 'NSE') return ['NSE', 'NFO'].includes((item.exch_seg || item.exchange) ?? '');

                  const type = (item.instrumenttype || '').toUpperCase();
                  if (searchFilter === 'Cash') return !type.includes('FUT') && !type.includes('OPT') && !item.isOptionChainLink;
                  if (searchFilter === 'Futures') return type.includes('FUT');
                  if (searchFilter === 'Options') return type.includes('OPT') || item.isOptionChainLink;
                  return true;
                });

                return (
                  <>
                    {filteredResults.length === 0 && !searchLoading && searchQuery.length > 0 && (
                      <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={{ color: theme.sub, fontSize: 13 }}>No matches found for "{searchQuery}" in {searchFilter}</Text>
                      </View>
                    )}
                    {filteredResults.map((scrip) => {
                      if (scrip.isOptionChainLink) {
                        return (
                          <TouchableOpacity
                            key={scrip._id}
                            style={[s.dropdownItem, { borderBottomColor: theme.border, backgroundColor: theme.searchBg }]}
                            onPress={() => {
                              setShowDropdown(false);
                              setSearchQuery('');
                              setSearchResults([]);
                              router.push(`/option-chain/${scrip.name || scrip.symbol}`);
                            }}
                          >
                            <View style={{ flex: 1, paddingRight: 10 }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={[s.dropdownSymbol, { color: theme.text }]} numberOfLines={1}>
                                  {formatSymbolName(scrip.name || scrip.symbol)}
                                </Text>
                              </View>
                              <Text style={[s.dropdownName, { color: theme.sub }]} numberOfLines={1}>
                                Option Chain
                              </Text>
                            </View>
                            <View style={[s.dropdownBadge, { backgroundColor: theme.primary + '20', flexDirection: 'row', alignItems: 'center' }]}>
                              <Text style={[s.dropdownExch, { color: theme.primary, marginRight: 2 }]}>View Chain</Text>
                              <MaterialIcons name="arrow-forward" size={10} color={theme.primary} />
                            </View>
                          </TouchableOpacity>
                        );
                      }

                      return (
                        <TouchableOpacity
                          key={scrip._id}
                          style={[s.dropdownItem, { borderBottomColor: theme.border }]}
                          onPress={() => handleAddScript(scrip)}
                        >
                          <View style={{ flex: 1, paddingRight: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Text style={[s.dropdownSymbol, { color: theme.text }]} numberOfLines={1}>
                                {parseSymbol(scrip.symbol).main}
                              </Text>
                              {!!parseSymbol(scrip.symbol).badge && (
                                <View style={{ marginLeft: 6, backgroundColor: theme.primaryBg, paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 }}>
                                  <Text style={{ fontSize: 9, color: theme.primary, fontWeight: '600' }}>
                                    {parseSymbol(scrip.symbol).badge}
                                  </Text>
                                </View>
                              )}
                              {scrip.expiry && <Text style={{ fontSize: 10, color: theme.sub, marginLeft: 6 }}>{scrip.expiry}</Text>}
                            </View>
                            <Text style={[s.dropdownName, { color: theme.sub }]} numberOfLines={1}>
                              {formatSymbolName(scrip.name || '')} | {scrip.instrumenttype || 'CASH'}
                            </Text>
                          </View>
                          <View style={[s.dropdownBadge, { backgroundColor: theme.primaryBg }]}>
                            <Text style={[s.dropdownExch, { color: theme.primary }]}>{scrip.exch_seg}</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </>
                );
              })()}
            </ScrollView>
          </View>
        )}
      </View>

      {/* ── List View ── */}
      {scriptsLoading ? (
        <View style={s.loadingBox}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[s.loadingText, { color: theme.sub }]}>Loading stocks...</Text>
        </View>
      ) : (
        <FlashList
          key={`list-${selectedId}`}
          data={sortedScripts}
          keyExtractor={(i) => i._id}
          numColumns={1}
          renderItem={({ item }) => (
            <StockRow item={item} onRemove={() => handleRemoveScript(item._id)} />
          )}
          contentContainerStyle={s.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} tintColor={theme.primary} />}
          ListEmptyComponent={
            <View style={s.empty}>
              <MaterialIcons name="playlist-add" size={44} color={theme.emptyIcon} />
              <Text style={[s.emptyTitle, { color: theme.sub }]}>Watchlist is empty</Text>
              <Text style={[s.emptySub, { color: theme.border }]}>Search for a stock above to add it</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },

  // header row
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 16, paddingRight: 20 },
  tabRow: { flex: 1 },
  tabsScroll: { paddingHorizontal: 20, alignItems: 'center' },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginRight: 24,
  },
  tabActive: { borderBottomWidth: 2 },
  tabText: { fontSize: 16, fontWeight: '500' },
  tabTextActive: { fontWeight: '600' },

  // new btn
  newBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingLeft: 10 },
  newBtnText: { fontSize: 16, fontWeight: '500', marginLeft: 4 },

  // create
  createRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 16 },
  createInput: { flex: 1, height: 42, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, borderRadius: 8, paddingHorizontal: 12, fontSize: 14, color: T.text, marginRight: 8 },
  createBtn: { width: 42, height: 42, borderRadius: 8, backgroundColor: T.primary, justifyContent: 'center', alignItems: 'center' },

  // action bar
  actionBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginBottom: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: T.border },
  renameRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  selectedName: { fontSize: 14, fontWeight: '600', color: T.text, flexShrink: 1 },
  renameInput: { flex: 1, fontSize: 14, fontWeight: '600', color: T.text, borderBottomWidth: 1.5, borderBottomColor: T.primary, paddingVertical: 2, marginRight: 6 },

  // search
  searchWrapper: { marginHorizontal: 20, marginBottom: 12, zIndex: 100 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: T.card, borderWidth: 1, borderColor: T.border, borderRadius: 6, paddingHorizontal: 14, paddingVertical: 12 },
  searchInput: { flex: 1, fontSize: 15, color: T.text, padding: 0 },
  dropdown: { position: 'absolute', top: 46, left: 0, right: 0, backgroundColor: T.card, borderRadius: 8, borderWidth: 1, borderColor: T.border, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, zIndex: 999 },
  dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: T.border + '80' },
  dropdownSymbol: { fontSize: 14, fontWeight: '600', color: T.text },
  dropdownName: { fontSize: 11, color: T.sub, marginTop: 2 },
  dropdownBadge: { backgroundColor: T.primary + '15', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  dropdownExch: { fontSize: 9, fontWeight: '700', color: T.primary },
  filterTab: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8 },
  filterTabText: { fontSize: 11, fontWeight: '600' },

  // list
  listContainer: { paddingBottom: 110 },

  // stock row (Zerodha style)
  stockRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1 },
  rowLeft: { flex: 1 },
  rowTicker: { fontSize: 15, fontWeight: '500', marginBottom: 4 },
  rowSubLeft: { flexDirection: 'row', alignItems: 'center' },
  rowExch: { fontSize: 10, fontWeight: '600', marginRight: 6 },
  rowName: { fontSize: 11 },
  rowRight: { alignItems: 'flex-end', marginRight: 12 },
  rowPrice: { fontSize: 15, fontWeight: '500', marginBottom: 4 },
  rowChange: { fontSize: 11 },
  deleteBtn: { paddingLeft: 8 },



  // loading / empty
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  loadingText: { fontSize: 13, color: T.sub, marginTop: 10 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: T.sub, marginTop: 10 },
  emptySub: { fontSize: 12, color: T.border, marginTop: 4 },

  // menu popup
  menuPopup: {
    position: 'absolute',
    top: 30,
    right: 0,
    width: 120,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
});
