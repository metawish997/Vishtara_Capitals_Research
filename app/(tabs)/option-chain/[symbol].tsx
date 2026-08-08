import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Swipeable } from 'react-native-gesture-handler';
import { useAppearance } from '@/context/AppearanceContext';

import {
  getOptionChainData,
  getOptionExpiries,
  getLiveQuotes,
  OptionChainRow,
  OptionContract,
} from '../../../services/api/methods/optionChainService';
import {
} from '../../../services/api/methods/watchlistService';
import socket from '../../../services/socket/socketClient';

export default function OptionChainScreen() {
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const router = useRouter();
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
    positive: '#10B981',
    negative: '#EF4444',
    atmBg: isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6',
    itmBg: isDark ? 'rgba(245, 158, 11, 0.2)' : '#FFF8D6',
    atmBorder: isDark ? 'rgba(248, 185, 23, 0.4)' : 'rgba(17, 24, 39, 0.4)',
  };

  const [loading, setLoading] = useState(false);
  const [exchange, setExchange] = useState('NFO');
  const [expiries, setExpiries] = useState<string[]>([]);
  const [selectedExpiry, setSelectedExpiry] = useState<string>('');
  const [showExpiryDropdown, setShowExpiryDropdown] = useState(false);

  const [chainData, setChainData] = useState<OptionChainRow[]>([]);
  const flatListRef = useRef<FlatList>(null);

  // Watchlist removed

  // Fetch Chain Data
  const loadChain = useCallback(async () => {
    if (!symbol) return;
    setLoading(true);
    const res = await getOptionChainData(symbol, selectedExpiry);

    if (res && res.data) {
      if (res.exchange) setExchange(res.exchange);
      if (res.expiry && !selectedExpiry) setSelectedExpiry(res.expiry);

      // Fetch expiries once we have exchange
      if (expiries.length === 0 && res.exchange) {
        const expData = await getOptionExpiries(symbol, res.exchange);
        setExpiries(expData);
      }

      setChainData(res.data);

      // Auto-scroll to ATM
      setTimeout(() => {
        const atmIndex = res.data?.findIndex((r) => r.is_atm);
        if (atmIndex !== undefined && atmIndex >= 0 && flatListRef.current) {
          flatListRef.current.scrollToIndex({ index: atmIndex, animated: true, viewPosition: 0.5 });
        }
      }, 500);
    }
    setLoading(false);
  }, [symbol, selectedExpiry]);

  useEffect(() => {
    loadChain();
  }, [loadChain]);

  // Live Socket.io Streaming
  useEffect(() => {
    if (chainData.length === 0) return;

    const allTokens: string[] = [];
    chainData.forEach((row) => {
      if (row.CE?.token) allTokens.push(row.CE.token);
      if (row.PE?.token) allTokens.push(row.PE.token);
    });

    if (allTokens.length === 0) return;

    const tokensByExchange = {
      [exchange]: allTokens
    };

    socket.emit('subscribe', tokensByExchange);

    const handlePriceUpdate = (quote: any) => {
      if (!quote || !quote.token) return;

      setChainData((prev) =>
        prev.map((row) => {
          let updated = false;
          const newRow = { ...row };

          if (newRow.CE && newRow.CE.token === quote.token) {
            const ltp = parseFloat(String(quote.ltp || '0'));
            const close = parseFloat(String(quote.close || newRow.CE.close || '0'));
            const pct = close > 0 ? ((ltp - close) / close) * 100 : 0;
            newRow.CE = { ...newRow.CE, ltp, close, percentChange: pct, positive: ltp >= close };
            updated = true;
          }

          if (newRow.PE && newRow.PE.token === quote.token) {
            const ltp = parseFloat(String(quote.ltp || '0'));
            const close = parseFloat(String(quote.close || newRow.PE.close || '0'));
            const pct = close > 0 ? ((ltp - close) / close) * 100 : 0;
            newRow.PE = { ...newRow.PE, ltp, close, percentChange: pct, positive: ltp >= close };
            updated = true;
          }

          return updated ? newRow : row;
        })
      );
    };

    socket.on('price', handlePriceUpdate);

    return () => {
      socket.off('price', handlePriceUpdate);
      socket.emit('unsubscribe', tokensByExchange);
    };
  }, [chainData.length, exchange]);

  // Watchlist Actions removed

  const renderContract = (c: OptionContract | null, isCE: boolean) => {
    if (!c) return <View style={s.contractCell} />;

    const ltpStr = c.ltp !== undefined && c.ltp !== '--' ? Number(c.ltp).toFixed(2) : '--';
    const pctStr = c.percentChange !== undefined && c.percentChange !== '0.00'
      ? `${Number(c.percentChange) > 0 ? '+' : ''}${Number(c.percentChange).toFixed(2)}%`
      : '0.00%';
    const color = c.positive ? theme.positive : theme.negative;

    return (
      <View style={[s.contractCell, { alignItems: isCE ? 'flex-start' : 'flex-end', paddingHorizontal: 16 }]}>
        <Text style={{ color, fontSize: 13, fontWeight: '600' }}>{ltpStr}</Text>
        <Text style={{ color: theme.sub, fontSize: 10, marginTop: 2 }}>{pctStr}</Text>
      </View>
    );
  };

  const atmIndex = chainData.findIndex((r) => r.is_atm);

  const renderRow = ({ item, index }: { item: OptionChainRow; index: number }) => {
    const isCallITM = atmIndex !== -1 && index < atmIndex;
    const isPutITM = atmIndex !== -1 && index > atmIndex;

    return (
      <>
        {item.is_atm && (
          <View style={{ backgroundColor: theme.primaryBg, paddingVertical: 4, alignItems: 'center' }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: theme.primary, textTransform: 'uppercase', letterSpacing: 1 }}>
              SPOT / ATM
            </Text>
          </View>
        )}
        <View style={[
          s.row,
          item.is_atm && {
            backgroundColor: theme.atmBg,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderTopColor: theme.atmBorder,
            borderBottomColor: theme.atmBorder,
          }
        ]}>
          {/* Calls (CE) */}
          <View style={{ flex: 1 }}>
              <View style={[s.colInner, isCallITM && { backgroundColor: theme.itmBg }]}>
                {renderContract(item.CE, true)}
              </View>
          </View>

          {/* Strike */}
          <View style={[s.strikeCol, s.strikeColEnhanced, { backgroundColor: item.is_atm ? theme.primaryBg : theme.card }]}>
            <Text style={{ color: item.is_atm ? theme.primary : theme.text, fontSize: 14, fontWeight: item.is_atm ? '700' : '600' }}>
              {item.strike}
            </Text>
          </View>

          {/* Puts (PE) */}
          <View style={{ flex: 1 }}>
              <View style={[s.colInner, isPutITM && { backgroundColor: theme.itmBg }]}>
                {renderContract(item.PE, false)}
              </View>
          </View>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={[s.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: -8 }}>
          <MaterialIcons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>

        <View style={s.headerTitleArea}>
          <Text style={[s.title, { color: theme.text }]}>{symbol}</Text>
          <Text style={[s.subtitle, { color: theme.sub }]}>Option Chain • {exchange}</Text>
        </View>

        <TouchableOpacity
          style={[s.expiryBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => setShowExpiryDropdown(true)}
        >
          <Text style={{ color: theme.text, fontSize: 12, fontWeight: '600', marginRight: 4 }}>
            {selectedExpiry || 'Select Expiry'}
          </Text>
          <MaterialIcons name="arrow-drop-down" size={16} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Expiry Dropdown Modal */}
      <Modal visible={showExpiryDropdown} transparent animationType="fade">
        <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={() => setShowExpiryDropdown(false)}>
          <View style={[s.dropdownMenu, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <ScrollView style={{ maxHeight: 300 }}>
              {expiries.map(exp => (
                <TouchableOpacity
                  key={exp}
                  style={[s.dropdownItem, { borderBottomColor: theme.border }]}
                  onPress={() => {
                    setSelectedExpiry(exp);
                    setShowExpiryDropdown(false);
                    setChainData([]);
                  }}
                >
                  <Text style={{ color: exp === selectedExpiry ? theme.primary : theme.text, fontSize: 14, fontWeight: exp === selectedExpiry ? '700' : '500' }}>
                    {exp}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* List Header */}
      <View style={[s.listHeader, { borderBottomColor: theme.border, backgroundColor: theme.card }]}>
        <Text style={[s.headerColText, { color: theme.sub, flex: 1, textAlign: 'left' }]}>CALLS</Text>
        <Text style={[s.headerColText, { color: theme.sub, width: 80, textAlign: 'center' }]}>STRIKE</Text>
        <Text style={[s.headerColText, { color: theme.sub, flex: 1, textAlign: 'right' }]}>PUTS</Text>
      </View>

      {/* Content */}
      {loading ? (
        <View style={s.loadingBox}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={chainData}
          keyExtractor={(item) => item.strike.toString()}
          renderItem={renderRow}
          onScrollToIndexFailed={(info) => {
            setTimeout(() => {
              flatListRef.current?.scrollToIndex({ index: info.index, animated: true, viewPosition: 0.5 });
            }, 500);
          }}
          contentContainerStyle={{ paddingBottom: 100 }}
          initialNumToRender={20}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
        />
      )}

      {/* Watchlist Modal removed */}


    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  headerTitleArea: { flex: 1, marginLeft: 8 },
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: { fontSize: 11, marginTop: 2 },
  expiryBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },

  listHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1 },
  headerColText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },

  row: { flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(150,150,150,0.15)' },
  colInner: { flex: 1, paddingVertical: 14 },
  strikeCol: { width: 80, alignItems: 'center', justifyContent: 'center', borderRadius: 8, marginVertical: 4, zIndex: 1 },
  strikeColEnhanced: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 3, elevation: 2 },
  contractCell: { flex: 1, justifyContent: 'center' },

  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  dropdownMenu: { borderRadius: 12, borderWidth: 1, overflow: 'hidden', marginHorizontal: 20, marginBottom: 'auto', marginTop: '30%' },
  dropdownItem: { paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1 },

  bottomSheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40, borderWidth: 1, marginTop: 'auto' },
  dragHandle: { width: 40, height: 5, borderRadius: 3, backgroundColor: '#D1D5DB', alignSelf: 'center', marginBottom: 20 },
  wlItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },

  fab: { position: 'absolute', bottom: 30, right: 30, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 8 },
});
