import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import tipService from '@/services/api/methods/tipService';
import apiClient from '@/services/api/apiClient';
import socket from '@/services/socket/socketClient';
import { useAppearance } from '@/context/AppearanceContext';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { storage } from '@/services/storage';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.82;
const CARD_HEIGHT = 210;

// --- Types ---
interface HighlightItem {
  id: string | number;
  action: string;
  tags: string[];
  title: string;
  subTitle?: string;
  date: string;
  ltp: string;
  change: string;
  changePercent: string;
  sl: string;
  entry: string;
  target: string;
  target2?: string;
  isBuy: boolean;
  isLocked?: boolean;
  resultStatus?: string;
  token: string;
  exchange: string;
  rawEntry: number;
  tradeStatus?: string;
  durationStr?: string;
  profitLoss?: string;
}

// --- Dummy Data ---
const LOCKED_HIGHLIGHTS: HighlightItem[] = [
  {
    id: 'locked-1',
    action: 'BUY',
    tags: ['Premium', 'Jackpot'],
    title: 'NIFTY',
    date: 'Today • 09:15 AM',
    ltp: '22000.00',
    change: '0.00',
    changePercent: '(0.00%)',
    sl: '22000.00',
    entry: '22000.00',
    target: '22000.00',
    isBuy: true,
    isLocked: true,
    token: '',
    exchange: '',
    rawEntry: 0,
  },
  {
    id: 'locked-2',
    action: 'BUY',
    tags: ['Premium', 'Sure Shot'],
    title: 'NIFTY',
    date: 'Today • 10:30 AM',
    ltp: '22000.00',
    change: '0.00',
    changePercent: '(0.00%)',
    sl: '22000.00',
    entry: '22000.00',
    target: '22000.00',
    isBuy: true,
    isLocked: true,
    token: '',
    exchange: '',
    rawEntry: 0,
  },
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
      <View style={styles.rangeLineBase} />
      <View style={[styles.rangeLineActive, { backgroundColor: activeColor, width: `${activeWidth}%`, left: `${activeLeft}%` }]} />
      
      <View style={[styles.rangeDotWrapper, { left: '0%', alignItems: 'flex-start' }]}>
        <View style={[styles.rangeDotBase, { backgroundColor: '#ef4444' }]} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          {isSlHit && <Ionicons name="close-circle" size={10} color="#ef4444" style={{ marginBottom: 2 }} />}
          <Text style={[styles.rangeLabelText, { color: subTextColor }]}>SL</Text>
        </View>
        <Text style={[styles.rangeValueText, { color: textColor }]}>{sl}</Text>
      </View>
      
      <View style={[styles.rangeDotWrapperAbove, { left: '30%', transform: [{ translateX: -20 }] }]}>
        <Text style={[styles.rangeValueText, { color: textColor }]}>{entry}</Text>
        <Text style={[styles.rangeLabelText, { color: subTextColor, marginBottom: 6 }]}>Entry</Text>
        <View style={[styles.rangeDotBase, { backgroundColor: '#f59e0b', marginBottom: 0 }]} />
      </View>
      
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

const HighlightCard = ({ item, onUpgrade }: { item: HighlightItem; onUpgrade: () => void }) => {
  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';
  const theme = {
    cardBg: isDark ? '#040410' : '#ffffff',
    textPrimary: isDark ? '#FFFFFF' : '#141723',
    textSecondary: isDark ? '#B5B2B1' : '#4f5568',
    borderColor: isDark ? 'rgba(248, 185, 23, 0.15)' : 'rgba(20, 23, 35, 0.12)',
    divider: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
    statsBg: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
    iconBgBuy: isDark ? 'rgba(16, 185, 129, 0.15)' : '#dcfce7',
    iconBgSell: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2',
    accent: isDark ? '#f8b917' : '#011d52',
    lockIconBg: isDark ? 'rgba(248, 185, 23, 0.1)' : 'rgba(248, 185, 23, 0.1)',
    lockIconColor: isDark ? '#f8b917' : '#011d52',
    lockedOverlay: isDark ? 'rgba(4, 4, 16, 0.6)' : 'rgba(255,255,255,0.75)',
    btnStart: isDark ? 'rgba(248, 185, 23, 0.1)' : '#011d52',
    btnEnd: isDark ? 'rgba(248, 185, 23, 0.2)' : '#011d52',
    btnText: isDark ? '#f8b917' : '#FFFFFF',
  };

  const isBuy = item.isBuy;
  const isLocked = item.isLocked;
  const actionColor = isBuy ? '#10b981' : '#ef4444';
  const actionBg = isBuy ? theme.iconBgBuy : theme.iconBgSell;

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
    if (isLocked) onUpgrade();
    else router.push({
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
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={handlePress}
      style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.titleGroup}>
            <View style={[styles.actionIconBlock, { backgroundColor: isLocked ? theme.lockIconBg : actionBg }]}>
              {isLocked ? (
                <Ionicons name="lock-closed" size={20} color={theme.lockIconColor} />
              ) : (
                <Text style={[styles.actionIconText, { color: actionColor }]}>{item.action}</Text>
              )}
            </View>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: 4 }}>
                <Text style={[styles.stockTitle, { color: theme.textPrimary, marginBottom: 0 }]} numberOfLines={1}>{item.title}</Text>
                {!!item.subTitle && (
                  <Text style={{ fontSize: 11, fontWeight: '700', color: theme.accent }}>{item.subTitle}</Text>
                )}
              </View>
              <Text style={[styles.dateText, { color: theme.textSecondary, marginTop: 2 }]}>{item.date}</Text>
            </View>
          </View>
          {item.tradeStatus === 'Closed' ? (
            <View style={{ alignItems: 'flex-end', gap: 4 }}>
              <View style={[styles.statusStamp, { backgroundColor: getStatusBg(item.resultStatus || ''), borderColor: getStatusColor(item.resultStatus || '') }]}>
                <Text style={[styles.statusStampText, { color: getStatusColor(item.resultStatus || '') }]}>{item.resultStatus || 'Closed'}</Text>
              </View>
              {!!item.profitLoss && (
                <Text style={[styles.changeText, { color: item.profitLoss.startsWith('+') ? '#10b981' : '#ef4444', marginTop: 0, fontWeight: '800' }]}>
                  {item.profitLoss.startsWith('+') ? 'Profit' : 'Loss'} {item.profitLoss}
                </Text>
              )}
              {!!item.durationStr && (
                <Text style={[styles.durationText, { color: theme.textSecondary }]}>in {item.durationStr}</Text>
              )}
            </View>
          ) : (
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.valueLtp, { color: theme.textPrimary, fontSize: 18 }]}>{item.ltp}</Text>
              <Text style={[styles.changeText, { color: isBuy ? '#10b981' : '#ef4444', marginTop: 0, fontSize: 10 }]}>
                {item.change} {item.changePercent}
              </Text>
            </View>
          )}
        </View>

        <View style={[styles.divider, { backgroundColor: theme.divider }]} />

        <View style={{ position: 'relative', flex: 1 }}>
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
              <TradeRange isBuy={isBuy} isLocked={false} sl={item.sl} entry={item.entry} target={item.target} target2={item.target2} textColor={theme.textPrimary} subTextColor={theme.textSecondary} resultStatus={item.resultStatus} ltp={item.ltp} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

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

export default function TodaysMarketHighlights() {
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Live Quotes Polling ---
  const fetchLiveQuotes = async (calls: HighlightItem[]) => {
    const unlockedCalls = calls.filter(c => !c.isLocked && c.token);
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

  const applyQuotes = (calls: HighlightItem[], quotesMap: Record<string, any>) => {
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

  const fetchMarketHighlights = async () => {
    try {
      const response: any = await tipService.getAllTips();
      const apiTips = response?.data || response || [];

      if (!apiTips || apiTips.length === 0) {
        setHighlights(LOCKED_HIGHLIGHTS);
        return;
      }

      const user = await storage.getUser();

      const formattedCalls: HighlightItem[] = apiTips.map((tip: any) => {
        const entry = parseFloat(tip.entry_price || '0');
        const target = parseFloat(tip.target_price || '0');
        const target2Raw = parseFloat(tip.target_price_2 || '0');
        const sl = parseFloat(tip.stop_loss || '0');
        const ltp = parseFloat(tip.current_price || tip.cmp_price || '0');
        const isBuy = target >= entry;
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

        const { title, subTitle } = getStockFormatting(tip);

        const tradeStatus = tip.trade_status || 'Open';
        const createdDateStr = tip.createdAt || tip.created_at || new Date().toISOString();
        let profitLoss = '';
        let durationStr = '';

        if (tradeStatus === 'Closed') {
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
          action: isBuy ? 'BUY' : 'SELL',
          isBuy: isBuy,
          isLocked: isLocked,
          tags: isLocked ? ['Premium'] : ['Intraday'],
          title: isLocked ? 'NIFTY' : title,
          subTitle: subTitle,
          date: 'Today',
          ltp: isLocked ? '22000.00' : ltp.toFixed(2),
          change: (ltp - entry).toFixed(2),
          changePercent: `(${((ltp - entry) / (entry || 1) * 100).toFixed(2)}%)`,
          sl: isLocked ? '22000.00' : sl.toFixed(2),
          entry: isLocked ? '22000.00' : entry.toFixed(2),
          target: isLocked ? '22000.00' : target.toFixed(2),
          target2: isLocked ? '****' : (target2Raw > 0 ? target2Raw.toFixed(2) : ''),
          tradeStatus: tradeStatus,
          durationStr: durationStr,
          profitLoss: profitLoss,
          token: tip.symbol_token || tip.token || '',
          resultStatus: tip.status || '',
          exchange: tip.exchange || tip.exch_seg || 'NSE',
          rawEntry: entry,
        };
      });

      setHighlights(formattedCalls.reverse().slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch highlights", error);
      setHighlights(LOCKED_HIGHLIGHTS);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMarketHighlights();
    }, [])
  );

  // --- Auto-Refresh on Server Updates ---
  React.useEffect(() => {
    const handleTipRefresh = async () => {
      fetchMarketHighlights();
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
  }, []);

  // --- Live WebSocket Effect ---
  React.useEffect(() => {
    if (highlights.length === 0) return;

    const tokensByExchange: Record<string, string[]> = {};
    highlights.forEach(c => {
      if (!c.isLocked && c.token) {
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

      setHighlights(prev => {
        const idx = prev.findIndex(c => c.token === quote.token);
        if (idx === -1) return prev;
        
        const newCalls = [...prev];
        const c = newCalls[idx];
        if (c.isLocked || c.tradeStatus?.toLowerCase() !== 'open') return prev;

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
  }, [highlights.length]); // Re-attach when count changes

  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#0f172a' }]}>Todays Highlights</Text>
          <Text style={[styles.subtitle, { color: isDark ? '#B5B2B1' : '#64748b' }]}>Top performing calls</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(tabs)/market-calls')}>
          <Text style={[styles.viewAll, { color: isDark ? '#f8b917' : '#011d52' }]}>View All</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator color="#4f46e5" />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + 16}
        >
          {highlights.map((item) => (
            <HighlightCard
              key={item.id}
              item={item}
              onUpgrade={() => router.push('/pages/settingsInnerPages/pricingPlans')}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
  },
  viewAll: {
    fontSize: 14,
    color: '#0a7ea4',
    fontWeight: '600',
  },
  loader: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },

  // --- CARD STYLES ---
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 24,
    marginRight: 16,
    // Soft Shadow
    shadowColor: '#64748b',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    padding: 18,
    justifyContent: 'space-between',
  },
  blurredContent: {
    opacity: 0.1, // Fade out content when locked
  },

  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  unlockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    gap: 6,
  },
  unlockBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  lockTitle: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 4,
  },
  lockSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
  },
  upgradeBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeBtnText: {
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
  },

  // --- HEADER ---
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

  // --- MID SECTION (LTP) ---
  midSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ltpContainer: {
    flex: 1,
  },
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

  // --- RANGE VISUAL ---
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
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  rangeValueText: {
    fontSize: 11,
    fontWeight: '700',
  },

});