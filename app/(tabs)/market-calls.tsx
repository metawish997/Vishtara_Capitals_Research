import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TextInput,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Search from '@/components/includes/search';
import tipService from '@/services/api/methods/tipService';
import apiClient from '@/services/api/apiClient';
import socket from '@/services/socket/socketClient';
import { useAppearance } from '@/context/AppearanceContext';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { storage } from '@/services/storage';

const { width } = Dimensions.get('window');

const getStockFormatting = (call: any) => {
  let mainTitle = call.symbol || call.stock_name || 'UNKNOWN';
  let subTitle = '';
  
  if (call.tip_type === 'future' || call.tip_type === 'option') {
      let expiryStr = '';
      if (call.expiry_date) {
          const date = new Date(call.expiry_date);
          const day = date.getDate();
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const month = months[date.getMonth()];
          expiryStr = `${day} ${month}`;
      }
      
      if (call.tip_type === 'future') {
          subTitle = `${expiryStr} Fut`;
      } else if (call.tip_type === 'option') {
          const strike = call.strike_price ? `${call.strike_price}` : '';
          const optType = call.option_type ? `${call.option_type}` : '';
          subTitle = `${expiryStr} ${strike} ${optType}`.trim();
      }
  }
  return { title: mainTitle, subTitle };
};

// --- Types ---
interface MarketCallData {
  id: number | string;
  title: string;
  subTitle?: string;
  date: string;
  time: string;
  ltp: string;
  change: string;
  changePercent: string;
  potential: string;
  sl: string;
  entry: string;
  target: string;
  target2: string;
  status: string;
  isLocked?: boolean;
  action: 'BUY' | 'SELL';
  tags: string[];
  token: string;
  exchange: string;
  rawEntry: number;
  category: string;
  createdAt: string;
  resultStatus: string;
  tradeStatus: string;
  profitLoss?: string;
  durationStr?: string;
}

const MONTHS = [
  { value: '', label: 'All Months' },
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const RESULT_STATUSES = [
  'All Results', 'Active', 'Waiting', 'T1-Achieved', 'T2-Achieved', 'Early-Exit', 'SL-Hit', 'Closed'
];

// --- Sub-Components ---
const TradeRange = ({ isBuy, isLocked, sl, entry, target, target2, textColor, subTextColor, resultStatus, ltp }: { isBuy: boolean; isLocked?: boolean; sl: string; entry: string; target: string; target2?: string; textColor: string; subTextColor: string; resultStatus?: string; ltp?: string }) => {
  if (isLocked) return null;
  const color = isBuy ? '#10b981' : '#ef4444';

  const isT1Achieved = resultStatus === 'T1-Achieved' || resultStatus === 'T2-Achieved';
  const isT2Achieved = resultStatus === 'T2-Achieved';
  const isSlHit = resultStatus === 'SL-Hit';

  const parseVal = (str?: string) => {
    if (!str) return NaN;
    return parseFloat(str.replace(/[^0-9.-]+/g, ''));
  };

  const ltpVal = parseVal(ltp);
  const slVal = parseVal(sl);
  const entryVal = parseVal(entry);
  const t1Val = parseVal(target);
  const t2Val = target2 ? parseVal(target2) : NaN;

  const calculateProgress = () => {
    if (isNaN(ltpVal) || isNaN(slVal) || isNaN(entryVal) || isNaN(t1Val)) return 30;
    const t1Pos = target2 ? 65 : 100;
    
    if (isBuy) {
      if (ltpVal <= slVal) return 0;
      if (ltpVal < entryVal) return 30 - ((entryVal - ltpVal) / (entryVal - slVal || 1)) * 30;
      if (ltpVal < t1Val) return 30 + ((ltpVal - entryVal) / (t1Val - entryVal || 1)) * (t1Pos - 30);
      if (target2 && ltpVal < t2Val) return t1Pos + ((ltpVal - t1Val) / (t2Val - t1Val || 1)) * (100 - t1Pos);
      return 100;
    } else {
      if (ltpVal >= slVal) return 0;
      if (ltpVal > entryVal) return 30 - ((ltpVal - entryVal) / (slVal - entryVal || 1)) * 30;
      if (ltpVal > t1Val) return 30 + ((entryVal - ltpVal) / (entryVal - t1Val || 1)) * (t1Pos - 30);
      if (target2 && ltpVal > t2Val) return t1Pos + ((t1Val - ltpVal) / (t1Val - t2Val || 1)) * (100 - t1Pos);
      return 100;
    }
  };

  const progress = calculateProgress();
  const activeColor = progress >= 30 ? '#10b981' : '#ef4444';
  const activeLeft = progress >= 30 ? 30 : Math.max(0, progress);
  const activeWidth = progress >= 30 ? Math.min(100 - 30, progress - 30) : 30 - activeLeft;

  return (
    <View style={styles.rangeContainer}>
      {/* Line Base & Active Line */}
      <View style={styles.rangeLineBase} />
      <View style={[styles.rangeLineActive, { backgroundColor: activeColor, width: `${activeWidth}%`, left: `${activeLeft}%` }]} />
      
      {/* SL (Below) */}
      <View style={[styles.rangeDotWrapper, { left: '0%', alignItems: 'flex-start' }]}>
        <View style={[styles.rangeDotBase, { backgroundColor: '#ef4444' }]} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          {isSlHit && <Ionicons name="close-circle" size={10} color="#ef4444" style={{ marginBottom: 2 }} />}
          <Text style={[styles.rangeLabelText, { color: subTextColor }]}>SL</Text>
        </View>
        <Text style={[styles.rangeValueText, { color: textColor }]}>{sl}</Text>
      </View>
      
      {/* Entry (Above) */}
      <View style={[styles.rangeDotWrapperAbove, { left: '30%', transform: [{ translateX: -20 }] }]}>
        <Text style={[styles.rangeValueText, { color: textColor }]}>{entry}</Text>
        <Text style={[styles.rangeLabelText, { color: subTextColor, marginBottom: 6 }]}>Entry</Text>
        <View style={[styles.rangeDotBase, { backgroundColor: '#f59e0b', marginBottom: 0 }]} />
      </View>
      
      {/* Target 1 (Below) */}
      <View style={[styles.rangeDotWrapper, target2 ? { left: '65%', transform: [{ translateX: -20 }] } : { right: '0%', alignItems: 'flex-end' }]}>
        {target2 ? (
          <View style={[styles.rangeDotBase, { backgroundColor: color }]} />
        ) : (
          <View style={[styles.rangeDotRingBase, { borderColor: color }]}>
            <View style={[styles.rangeDotInnerBase, { backgroundColor: color }]} />
          </View>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          {isT1Achieved && <Ionicons name="checkmark-circle" size={10} color={color} style={{ marginBottom: 2 }} />}
          <Text style={[styles.rangeLabelText, { color: subTextColor }]}>{target2 ? 'Target 1' : 'Target'}</Text>
        </View>
        <Text style={[styles.rangeValueText, { color: textColor }]}>{target}</Text>
      </View>
      
      {/* Target 2 (Above) */}
      {!!target2 && (
        <View style={[styles.rangeDotWrapperAbove, { right: '0%', alignItems: 'flex-end' }]}>
          <Text style={[styles.rangeValueText, { color: textColor }]}>{target2}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 }}>
            {isT2Achieved && <Ionicons name="checkmark-circle" size={10} color={color} />}
            <Text style={[styles.rangeLabelText, { color: subTextColor, marginBottom: 0 }]}>Target 2</Text>
          </View>
          <View style={[styles.rangeDotRingBase, { borderColor: color, marginBottom: 0 }]}>
            <View style={[styles.rangeDotInnerBase, { backgroundColor: color }]} />
          </View>
        </View>
      )}
    </View>
  );
};

// --- Memoized Card Component ---
interface MarketCardProps {
  data: MarketCallData;
  onPress?: () => void;
  onUpgrade?: () => void;
  style?: object;
}

const MarketCard = React.memo<MarketCardProps>(function MarketCard({ data, onPress, onUpgrade, style }) {
  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';

  const theme = {
    cardBg: isDark ? '#040410' : '#ffffff',
    textPrimary: isDark ? '#FFFFFF' : '#141723',
    textSecondary: isDark ? '#B5B2B1' : '#64748b',
    borderColor: isDark ? 'rgba(248, 185, 23, 0.15)' : 'rgba(20, 23, 35, 0.08)',
    divider: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(20, 23, 35, 0.05)',
    statsBg: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
    lockedOverlay: isDark ? 'rgba(4, 4, 16, 0.85)' : 'rgba(255,255,255,0.85)',
    lockIconBg: isDark ? 'rgba(248, 185, 23, 0.1)' : 'rgba(248, 185, 23, 0.1)',
    lockIconColor: isDark ? '#f8b917' : '#011d52',
    buyBg: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5',
    sellBg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
    btnStart: isDark ? 'rgba(248, 185, 23, 0.1)' : '#011d52',
    btnEnd: isDark ? 'rgba(248, 185, 23, 0.2)' : '#011d52',
    btnText: isDark ? '#f8b917' : '#FFFFFF',
    accent: isDark ? '#f8b917' : '#011d52',
  };

  const isLocked = data.isLocked || false;
  const isBuy = data.action === 'BUY';
  const actionColor = isBuy ? '#10b981' : '#ef4444';
  const actionBg = isBuy ? theme.buyBg : theme.sellBg;

  const getStatusColor = (status: string) => {
    if (status.includes('T1') || status.includes('T2')) return '#10b981';
    if (status.includes('SL') || status.includes('Early')) return '#ef4444';
    return theme.textSecondary;
  };
  const getStatusBg = (status: string) => {
    if (status.includes('T1') || status.includes('T2')) return isDark ? 'rgba(16, 185, 129, 0.15)' : '#dcfce7';
    if (status.includes('SL') || status.includes('Early')) return isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2';
    return isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9';
  };

  const handlePress = () => {
    if (isLocked && onUpgrade) onUpgrade();
    else if (onPress) onPress();
  };

  return (
    <TouchableOpacity activeOpacity={0.95} onPress={handlePress} style={[styles.card, style, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.titleGroup}>
            <View style={[styles.actionIconBlock, { backgroundColor: isLocked ? theme.lockIconBg : actionBg }]}>
              {isLocked ? (
                <Ionicons name="lock-closed" size={20} color={theme.lockIconColor} />
              ) : (
                <Text style={[styles.actionIconText, { color: actionColor }]}>{data.action}</Text>
              )}
            </View>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: 4 }}>
                <Text style={[styles.stockTitle, { color: theme.textPrimary, marginBottom: 0 }]} numberOfLines={1}>{data.title}</Text>
                {!!data.subTitle && (
                  <Text style={{ fontSize: 11, fontWeight: '700', color: theme.accent }}>{data.subTitle}</Text>
                )}
              </View>
              <Text style={[styles.dateText, { color: theme.textSecondary, marginTop: 2 }]}>{data.date} • {data.time}</Text>
            </View>
          </View>
          {data.tradeStatus === 'Closed' ? (
            <View style={{ alignItems: 'flex-end', gap: 4 }}>
              <View style={[styles.statusStamp, { backgroundColor: getStatusBg(data.resultStatus), borderColor: getStatusColor(data.resultStatus) }]}>
                <Text style={[styles.statusStampText, { color: getStatusColor(data.resultStatus) }]}>{data.resultStatus || 'Closed'}</Text>
              </View>
              {!!data.profitLoss && (
                <Text style={[styles.changeText, { color: data.profitLoss.startsWith('+') ? '#10b981' : '#ef4444', marginTop: 0, fontWeight: '800' }]}>
                  {data.profitLoss.startsWith('+') ? 'Profit' : 'Loss'} {data.profitLoss}
                </Text>
              )}
              {!!data.durationStr && (
                <Text style={[styles.durationText, { color: theme.textSecondary }]}>in {data.durationStr}</Text>
              )}
            </View>
          ) : (
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.valueLtp, { color: theme.textPrimary, fontSize: 18 }]}>{data.ltp}</Text>
              <Text style={[styles.changeText, { color: isBuy ? '#10b981' : '#ef4444', marginTop: 0, fontSize: 10 }]}>
                {data.change} {data.changePercent}
              </Text>
            </View>
          )}
        </View>

        <View style={[styles.divider, { backgroundColor: theme.divider }]} />

        <View style={{ position: 'relative' }}>
          {isLocked && (
            <View style={[styles.lockedOverlay, { backgroundColor: theme.lockedOverlay, borderRadius: 12 }]}>
              <Text style={[styles.lockTitle, { color: theme.textPrimary }]}>PREMIUM SIGNAL</Text>
              <Text style={[styles.lockSubtitle, { color: theme.textSecondary }]}>Unlock Entry, Target & SL</Text>
              <TouchableOpacity onPress={onUpgrade} activeOpacity={0.8}>
                <LinearGradient colors={[theme.btnStart, theme.btnEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.unlockBtn}>
                  <Text style={[styles.unlockBtnText, { color: theme.btnText }]}>Upgrade Now</Text>
                  <Ionicons name="arrow-forward" size={14} color={theme.btnText} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          <View style={[styles.midSection, isLocked ? styles.blurredContent : null]}>
            <View style={styles.rangeWrapper}>
              <TradeRange isBuy={isBuy} isLocked={false} sl={data.sl} entry={data.entry} target={data.target} target2={data.target2} textColor={theme.textPrimary} subTextColor={theme.textSecondary} resultStatus={data.resultStatus} ltp={data.ltp} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

// --- Main Screen Component ---
const MarketCalls = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [tradeStatus, setTradeStatus] = useState<'Open' | 'Closed'>('Open');
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([{ id: 'All', name: 'All' }]);
  const [filters, setFilters] = useState({ resultStatus: '', date: '', month: '' });

  const [openCalls, setOpenCalls] = useState<MarketCallData[]>([]);
  const [closedCalls, setClosedCalls] = useState<MarketCallData[]>([]);
  
  // Pagination states
  const [closedPage, setClosedPage] = useState(1);
  const [hasMoreClosed, setHasMoreClosed] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  React.useEffect(() => {
    storage.getUser().then(setCurrentUser);
  }, []);

  // --- Helper ---
  const mapTipToMarketCall = (tip: any, user: any): MarketCallData => {
    const entry = parseFloat(tip.entry_price || '0');
    const target = parseFloat(tip.target_price || '0');
    const target2Raw = parseFloat(tip.target_price_2 || '0');
    const sl = parseFloat(tip.stop_loss || '0');
    const ltp = parseFloat(tip.current_price || tip.cmp_price || '0');

    const isBuy = target >= entry;

    const { title, subTitle } = getStockFormatting(tip);

    const createdDateStr = tip.createdAt || tip.created_at || new Date().toISOString();
    const dateObj = new Date(createdDateStr);
    const date = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const time = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    let isLocked = tip.is_locked !== undefined ? tip.is_locked : (tip.allowed_plans && tip.allowed_plans.length > 0);
    
    // Safely extract the role from the user object
    let userRole = user?.role || user?.user?.role || user?.data?.role || user?.user_type;
    if (typeof userRole === 'string') {
        userRole = userRole.toLowerCase().trim();
    }

    // Check if the user is admin/super admin
    const isAdminUser = ['admin', 'super_admin', 'superadmin', 'super-admin', 'super admin'].includes(userRole);
    
    // Check if the user has an active demo
    const hasDemo = user?.is_demo === true || user?.demo_activated === true || user?.demo === true || user?.demo_user === true;

    if (isAdminUser) {
        isLocked = false;
    } else if (hasDemo) {
        isLocked = false;
    } else {
        isLocked = true;
    }

    const rawSegment = tip.tip_type || tip.call_type || 'Intraday';
    const formattedSegment = rawSegment.charAt(0).toUpperCase() + rawSegment.slice(1).toLowerCase();

    let profitLoss = '';
    let durationStr = '';
    const tipTradeStatus = tip.trade_status || 'Open';

    if (tipTradeStatus === 'Closed') {
      const exitDateRaw = tip.exit_at || tip.updatedAt || createdDateStr;
      const start = new Date(createdDateStr).getTime();
      const end = new Date(exitDateRaw).getTime();
      const diffMs = Math.abs(end - start);
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffDays > 0) durationStr = `${diffDays} Day${diffDays > 1 ? 's' : ''}`;
      else if (diffHours > 0) durationStr = `${diffHours} Hr${diffHours > 1 ? 's' : ''}`;
      else durationStr = '< 1 Hr';

      const exitPrice = parseFloat(tip.exit_price || tip.current_price || '0');
      if (entry > 0 && exitPrice > 0) {
        const plPercent = isBuy ? ((exitPrice - entry) / entry) * 100 : ((entry - exitPrice) / entry) * 100;
        profitLoss = `${plPercent >= 0 ? '+' : ''}${plPercent.toFixed(2)}%`;
      }
    }

    return {
      id: tip._id || tip.id,
      title: title,
      subTitle: subTitle,
      date: date,
      time: time,
      ltp: ltp.toFixed(2),
      change: (ltp - entry).toFixed(2),
      changePercent: `(${((ltp - entry) / entry * 100).toFixed(2)}%)`,
      potential: 'High',
      sl: isLocked ? '****' : sl.toFixed(2),
      entry: isLocked ? '****' : entry.toFixed(2),
      target: isLocked ? '****' : target.toFixed(2),
      target2: isLocked ? '****' : (target2Raw > 0 ? target2Raw.toFixed(2) : ''),
      status: tip.status || 'Live',
      isLocked: isLocked,
      action: isBuy ? 'BUY' : 'SELL',
      tags: isLocked ? ['Premium', formattedSegment] : [formattedSegment],
      token: tip.symbol_token || tip.token || '',
      exchange: tip.exchange || tip.exch_seg || 'NSE',
      rawEntry: entry,
      category: tip.category?.name || formattedSegment,
      createdAt: createdDateStr,
      resultStatus: tip.status || '',
      tradeStatus: tipTradeStatus,
      profitLoss: profitLoss,
      durationStr: durationStr
    };
  };

  // --- Live Quotes Polling ---
  const fetchLiveQuotes = async (calls: MarketCallData[]) => {
    const unlockedCalls = calls.filter(c => !c.isLocked && c.token && c.tradeStatus.toLowerCase() === 'open');
    if (unlockedCalls.length === 0) return {};

    const grouped: Record<string, string[]> = {};
    unlockedCalls.forEach(c => {
      const exch = c.exchange || 'NSE';
      if (!grouped[exch]) grouped[exch] = [];
      grouped[exch].push(c.token);
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
  };

  const applyQuotes = (calls: MarketCallData[], quotesMap: Record<string, any>) => {
    return calls.map(c => {
      if (c.isLocked || !c.token || !quotesMap[c.token]) return c;
      const q = quotesMap[c.token];
      const ltp = parseFloat(q.ltp ?? 0);
      const close = parseFloat(q.close ?? 0);
      const netChg = ltp - close;

      return {
        ...c,
        ltp: ltp.toFixed(2),
        change: (ltp - c.rawEntry).toFixed(2),
        changePercent: `(${(((ltp - c.rawEntry) / c.rawEntry) * 100).toFixed(2)}%)`,
      };
    });
  };

  // --- Fetch Logic ---
  const fetchMarketCalls = async (page = 1) => {
    try {
      if (page === 1) setLoading(true);

      const filterParams: any = {};
      if (filters.resultStatus && filters.resultStatus !== 'All Results') filterParams.status = filters.resultStatus;
      if (filters.date) filterParams.date = filters.date;
      if (filters.month) filterParams.month = filters.month;
      if (search) filterParams.search = search;
      if (activeTab !== 'All') {
        // Find category logic, or if activeTab maps to something else
        const cat = categories.find(c => c.name === activeTab);
        if (cat) filterParams.tip_type = cat.name.toLowerCase(); 
      }

      // 1. Fetch Open Calls and Categories (only on page 1)
      let openApiTips = [];
      if (page === 1) {
        const [openRes, catRes] = await Promise.all([
          tipService.getAllTips({ trade_status: 'Open', ...filterParams }).catch(() => ({ data: [] })),
          tipService.getCategories().catch(() => ({ data: [] }))
        ]);
        openApiTips = openRes?.data || openRes || [];
        
        const apiCats = catRes?.data || catRes || [];
        const activeCats = apiCats.filter((c: any) => c.status !== false).map((c: any) => ({
          id: c._id || c.id,
          name: c.name
        }));
        if (activeCats.length > 0) setCategories([{ id: 'All', name: 'All' }, ...activeCats]);
      }

      // 2. Fetch Closed Calls
      setIsFetchingMore(page > 1);
      const closedRes = await tipService.getAllTips({ trade_status: 'Closed', page, limit: 10, ...filterParams }).catch(() => ({ data: [], pagination: { hasMore: false } }));
      const closedApiTips = closedRes?.data || closedRes || [];
      const hasMore = closedRes?.pagination?.hasMore ?? false;

      const user = await storage.getUser();
      const newOpenCalls = openApiTips.map((tip: any) => mapTipToMarketCall(tip, user));
      const newClosedCalls = closedApiTips.map((tip: any) => mapTipToMarketCall(tip, user));

      if (page === 1) {
        setOpenCalls(newOpenCalls);
        setClosedCalls(newClosedCalls);
        setClosedPage(1);
      } else {
        // Filter out duplicates just in case
        setClosedCalls(prev => {
          const combined = [...prev, ...newClosedCalls];
          return Array.from(new Map(combined.map(item => [item.id, item])).values());
        });
        setClosedPage(page);
      }
      setHasMoreClosed(hasMore);

    } catch (error) {
      console.error('Fetch Market Calls Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setIsFetchingMore(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchMarketCalls(1); }, []));

  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchMarketCalls(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, search, activeTab, currentUser]);

  const onRefresh = () => { setRefreshing(true); fetchMarketCalls(1); };
  const handleUpgrade = () => router.push('/pages/settingsInnerPages/pricingPlans');

  // --- Auto-Refresh on Server Updates ---
  React.useEffect(() => {
    const handleTipRefresh = async () => {
      // Silently fetch calls without showing the loading spinner
      fetchMarketCalls(1);
      
      // Play a short notification ding and trigger haptics
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/ding.mp3')
        );
        await sound.playAsync();
      } catch (error) {
        console.log('Error playing notification sound:', error);
      }
    };

    socket.on('tip_refresh', handleTipRefresh);

    return () => {
      socket.off('tip_refresh', handleTipRefresh);
    };
  }, [fetchMarketCalls]);

  // --- Live WebSocket Effect ---
  React.useEffect(() => {
    if (openCalls.length === 0) return;

    const tokensByExchange: Record<string, string[]> = {};
    openCalls.forEach(c => {
      if (!c.isLocked && c.token && c.tradeStatus.toLowerCase() === 'open') {
        const exch = c.exchange || 'NSE';
        if (!tokensByExchange[exch]) tokensByExchange[exch] = [];
        tokensByExchange[exch].push(c.token);
      }
    });

    if (Object.keys(tokensByExchange).length > 0) {
      socket.emit('subscribe', tokensByExchange);
    }

    const handlePriceUpdate = (quote: any) => {
      if (!quote || !quote.token) return;

      setOpenCalls(prev => {
        const idx = prev.findIndex(c => c.token === quote.token);
        if (idx === -1) return prev;
        
        const newCalls = [...prev];
        const c = newCalls[idx];
        if (c.isLocked || c.tradeStatus.toLowerCase() !== 'open') return prev;

        const ltp = parseFloat(quote.ltp ?? 0);
        
        newCalls[idx] = {
          ...c,
          ltp: ltp.toFixed(2),
          change: (ltp - c.rawEntry).toFixed(2),
          changePercent: `(${(((ltp - c.rawEntry) / (c.rawEntry || 1)) * 100).toFixed(2)}%)`,
        };
        
        return newCalls;
      });
    };

    socket.on('price', handlePriceUpdate);

    return () => {
      socket.off('price', handlePriceUpdate);
      if (Object.keys(tokensByExchange).length > 0) {
        socket.emit('unsubscribe', tokensByExchange);
      }
    };
  }, [openCalls.length]);

  // --- Filtering Logic (Search + Tabs + Adv Filters) ---
  const currentCalls = tradeStatus === 'Open' ? openCalls : closedCalls;
  
  const filteredCalls = useMemo(() => {
    return currentCalls.filter(item => {
      // Search filter
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;

      // Tab filter
      const matchesTab = activeTab === 'All' || item.category === activeTab || item.tags.some(tag => tag.toLowerCase() === activeTab.toLowerCase());
      if (!matchesTab) return false;

      // Result Status Filter
      if (filters.resultStatus && filters.resultStatus !== 'All Results') {
        if (item.resultStatus.toLowerCase() !== filters.resultStatus.toLowerCase()) return false;
      }

      // Date Filter
      if (filters.date) {
        try {
          const callDate = new Date(item.createdAt).toISOString().split('T')[0];
          if (callDate !== filters.date) return false;
        } catch { return false; }
      }

      // Month Filter
      if (filters.month) {
        try {
          const callMonth = new Date(item.createdAt).getMonth() + 1;
          if (callMonth.toString() !== filters.month) return false;
        } catch { return false; }
      }

      return true;
    });
  }, [currentCalls, search, activeTab, filters]);

  const resetFilters = () => {
    setFilters({ resultStatus: '', date: '', month: '' });
  };

  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';

  const theme = {
    bg: isDark ? '#020210' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#141723',
    textSecondary: isDark ? '#B5B2B1' : '#64748b',
    borderColor: isDark ? 'rgba(248, 185, 23, 0.15)' : 'rgba(20, 23, 35, 0.08)',
    divider: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(20, 23, 35, 0.05)',
    accent: isDark ? '#f8b917' : '#011d52',
    btnBg: isDark ? 'rgba(255,255,255,0.02)' : '#ffffff',
    activeTabBg: isDark ? 'rgba(248, 185, 23, 0.1)' : '#011d52',
    activeTabText: isDark ? '#f8b917' : '#FFFFFF',
    headerBg: isDark ? '#020210' : '#FFFFFF',
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.bg} />
      <View style={styles.container}>

        {/* --- STICKY HEADER --- */}
        <View style={[styles.stickyHeader, { backgroundColor: theme.headerBg, borderBottomColor: theme.divider }]}>
          <View style={styles.searchContainer}>
            <Search value={search} onChangeText={setSearch} />
          </View>

          {/* Trade Status & Advanced Filter Toggles */}
          <View style={styles.controlsRow}>
            <View style={[styles.statusToggle, { backgroundColor: theme.btnBg, borderColor: theme.borderColor }]}>
              <TouchableOpacity
                onPress={() => setTradeStatus('Open')}
                style={[styles.statusBtn, tradeStatus === 'Open' && [styles.statusBtnActive, { backgroundColor: theme.activeTabBg }]]}
              >
                <View style={[styles.statusDot, { backgroundColor: tradeStatus === 'Open' ? theme.accent : theme.textSecondary }]} />
                <Text style={[styles.statusText, { color: theme.textSecondary }, tradeStatus === 'Open' && [styles.statusTextActive, { color: theme.activeTabText }]]}>Open</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setTradeStatus('Closed')}
                style={[styles.statusBtn, tradeStatus === 'Closed' && [styles.statusBtnActive, { backgroundColor: theme.activeTabBg }]]}
              >
                <View style={[styles.statusDot, { backgroundColor: tradeStatus === 'Closed' ? theme.textPrimary : theme.textSecondary }]} />
                <Text style={[styles.statusText, { color: theme.textSecondary }, tradeStatus === 'Closed' && [styles.statusTextActive, { color: theme.activeTabText }]]}>Closed</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setShowFilters(!showFilters)}
              style={[styles.filterBtn, { backgroundColor: theme.btnBg, borderColor: theme.borderColor }, showFilters && [styles.filterBtnActive, { backgroundColor: theme.activeTabBg, borderColor: theme.accent }]]}
            >
              <Ionicons name="options-outline" size={16} color={showFilters ? theme.accent : theme.textSecondary} />
              <Text style={[styles.filterBtnText, { color: theme.textSecondary }, showFilters && { color: theme.accent }]}>Filter</Text>
            </TouchableOpacity>
          </View>

          {/* Advanced Filter Panel */}
          {showFilters && (
            <View style={[styles.advancedFiltersContainer, { backgroundColor: theme.bg, borderTopColor: theme.divider, borderBottomColor: theme.divider }]}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                {/* Result Status Filter */}
                <View style={styles.filterGroup}>
                  <Text style={[styles.filterLabel, { color: theme.textSecondary }]}>Result Status</Text>
                  <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false}>
                    {RESULT_STATUSES.map(status => (
                      <TouchableOpacity
                        key={status}
                        onPress={() => setFilters(f => ({ ...f, resultStatus: status === 'All Results' ? '' : status }))}
                        style={[
                          styles.filterChip, { backgroundColor: theme.btnBg, borderColor: theme.borderColor },
                          (filters.resultStatus === status || (status === 'All Results' && !filters.resultStatus)) && [styles.filterChipActive, { backgroundColor: theme.activeTabBg, borderColor: theme.accent }]
                        ]}
                      >
                        <Text style={[
                          styles.filterChipText, { color: theme.textSecondary },
                          (filters.resultStatus === status || (status === 'All Results' && !filters.resultStatus)) && [styles.filterChipTextActive, { color: theme.activeTabText }]
                        ]}>{status}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Month Filter */}
                <View style={styles.filterGroup}>
                  <Text style={[styles.filterLabel, { color: theme.textSecondary }]}>Month</Text>
                  <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false}>
                    {MONTHS.map(m => (
                      <TouchableOpacity
                        key={m.label}
                        onPress={() => setFilters(f => ({ ...f, month: m.value }))}
                        style={[styles.filterChip, { backgroundColor: theme.btnBg, borderColor: theme.borderColor }, filters.month === m.value && [styles.filterChipActive, { backgroundColor: theme.activeTabBg, borderColor: theme.accent }]]}
                      >
                        <Text style={[styles.filterChipText, { color: theme.textSecondary }, filters.month === m.value && [styles.filterChipTextActive, { color: theme.activeTabText }]]}>{m.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Date Filter (Text Input as generic fallback) */}
                <View style={styles.filterGroup}>
                  <Text style={[styles.filterLabel, { color: theme.textSecondary }]}>Date (YYYY-MM-DD)</Text>
                  <TextInput
                    style={[styles.dateInput, { backgroundColor: theme.btnBg, borderColor: theme.borderColor, color: theme.textPrimary }]}
                    placeholder="e.g. 2024-05-15"
                    placeholderTextColor={theme.textSecondary}
                    value={filters.date}
                    onChangeText={(val) => setFilters(f => ({ ...f, date: val }))}
                  />
                </View>

                {/* Reset Filters */}
                <View style={styles.filterGroup}>
                  <Text style={[styles.filterLabel, { color: theme.textSecondary }]}>Actions</Text>
                  <TouchableOpacity onPress={resetFilters} style={[styles.resetBtn, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2' }]}>
                    <Text style={styles.resetBtnText}>Reset All</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          )}

          <View style={styles.tabsSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Market Feed</Text>
            </View>
            <FlatList
              horizontal
              data={categories}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabList}
              renderItem={({ item }) => {
                const isActive = activeTab === item.name;
                return (
                  <TouchableOpacity
                    onPress={() => setActiveTab(item.name)}
                    style={[styles.tabPill, { backgroundColor: theme.btnBg, borderColor: theme.borderColor }, isActive && [styles.tabPillActive, { backgroundColor: theme.activeTabBg, borderColor: theme.accent }]]}
                  >
                    <Text style={[styles.tabText, { color: theme.textSecondary }, isActive && [styles.tabTextActive, { color: theme.activeTabText }]]}>{item.name}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>

        {/* --- MAIN SCROLLABLE FEED --- */}
        <FlatList
          data={filteredCalls}
          keyExtractor={(item) => `call-${item.id}`}
          renderItem={({ item }) => (
            <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
              <MarketCard 
                data={item} 
                onUpgrade={handleUpgrade} 
                onPress={() => router.push({
                  pathname: '/pages/detailPages/marketCallDetails',
                  params: {
                    id: item.id,
                    title: item.title,
                    change: item.change,
                    changePercent: item.changePercent,
                    entry: item.rawEntry,
                    target: item.target,
                    stopLoss: item.sl,
                    ltp: item.ltp
                  }
                })} 
              />
            </View>
          )}
          onEndReached={() => {
            if (tradeStatus === 'Closed' && hasMoreClosed && !isFetchingMore) {
              fetchMarketCalls(closedPage + 1);
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingMore ? (
              <View style={{ padding: 20 }}>
                <ActivityIndicator size="small" color={theme.accent} />
              </View>
            ) : null
          }
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.accent} />}
          contentContainerStyle={{ paddingBottom: 80, paddingTop: 10 }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No calls found matching your filters</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, paddingTop: 15 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  stickyHeader: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    zIndex: 10,
  },
  searchContainer: { paddingHorizontal: 16, paddingVertical: 12 },

  /* Filter Controls Row */
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  statusToggle: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  statusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  statusBtnActive: {
    backgroundColor: '#f1f5f9',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  statusTextActive: {
    color: '#0f172a',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  filterBtnActive: {
    backgroundColor: '#f7fee7',
    borderColor: '#011d52',
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },

  /* Advanced Filters Panel */
  advancedFiltersContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
    paddingVertical: 12,
    marginBottom: 12,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 24,
  },
  filterGroup: {
    gap: 8,
  },
  filterLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  dateInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 11,
    fontWeight: '600',
    color: '#0f172a',
    minWidth: 120,
  },
  resetBtn: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ef4444',
  },

  /* Tabs */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },


  tabsSection: { marginBottom: 4 },
  tabList: { paddingHorizontal: 16 },
  tabPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tabPillActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  tabText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  tabTextActive: { color: '#fff' },

  /* --- CARD STYLES --- */
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    shadowColor: '#64748b',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },
  cardContent: { padding: 18 },
  blurredContent: { opacity: 0.1 },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  actionIconBlock: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIconText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  stockTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
    maxWidth: 160,
  },
  statusStamp: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusStampText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  durationText: {
    fontSize: 9,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  actionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 10,
    fontWeight: '800',
  },

  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },

  midSection: {
    flexDirection: 'column',
    marginBottom: 4,
  },
  actionContainer: { flex: 1, justifyContent: 'center' },
  labelLtp: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  valueLtp: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },

  rangeWrapper: {
    width: '100%',
    paddingBottom: 16,
  },
  rangeContainer: {
    height: 70,
    justifyContent: 'center',
    marginTop: 10,
  },
  rangeLineBase: {
    height: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 2,
    width: '100%',
    position: 'absolute',
    top: 33,
  },
  rangeLineActive: {
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    top: 33,
  },
  rangeDotWrapper: {
    position: 'absolute',
    top: 32,
    alignItems: 'center',
  },
  rangeDotWrapperAbove: {
    position: 'absolute',
    bottom: 32,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  rangeDotBase: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 6,
  },
  rangeDotRingBase: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 3,
  },
  rangeDotInnerBase: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  rangeLabelText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  rangeValueText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0f172a',
  },

  statsGrid: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 10,
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#e2e8f0',
  },
  statLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
  },

  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.85)',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f7fee7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  lockTitle: { fontSize: 16, fontWeight: '800', color: '#1e1b4b', marginBottom: 4 },
  lockSubtitle: { fontSize: 12, color: '#00000077', fontWeight: '400', marginBottom: 16 },
  unlockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    gap: 6,
  },
  unlockBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },

  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#94a3b8', fontSize: 14 },
});

export default MarketCalls;