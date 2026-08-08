import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { fetchAngelIndices, AngelQuoteRaw } from '../../services/api/methods/marketService';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const CARD_WIDTH = width * 0.45;
const CARD_HEIGHT = 120;
const CHART_HEIGHT = 45;

type IndexModel = {
  id: string;
  token: string;
  title: string;
  exchange: string;
  price: string;
  currency: string;
  change: string;
  percent: string;
  up: boolean;
  chart: number[];
  rawPrice: number;
  rawChange: number;
  rawPercent: number;
};

const SYMBOLS = [
  { id: 'nifty', token: '99926000', title: 'NIFTY 50', exchange: 'NSE' },
  { id: 'sensex', token: '99919000', title: 'SENSEX', exchange: 'BSE' },
  { id: 'banknifty', token: '99926009', title: 'BANK NIFTY', exchange: 'NSE' },
  { id: 'finnifty', token: '99926037', title: 'FIN NIFTY', exchange: 'NSE' },
  { id: 'midcap', token: '99926004', title: 'MIDCAP 50', exchange: 'NSE' },
  { id: 'infra', token: '99926021', title: 'INFRA', exchange: 'NSE' },
  { id: 'energy', token: '99926022', title: 'ENERGY', exchange: 'NSE' },
  { id: 'commodities', token: '99926025', title: 'COMMODITIES', exchange: 'NSE' },
  { id: 'consumption', token: '99926019', title: 'CONSUMPTION', exchange: 'NSE' },
  { id: 'cpse', token: '99926020', title: 'CPSE', exchange: 'NSE' },
];

const SparklineComponent = ({ data, up, theme }: { data: number[]; up: boolean; theme: any }) => {
  const chartWidth = CARD_WIDTH;
  const chartHeight = CHART_HEIGHT;

  if (!data || data.length === 0) {
    return <View style={{ height: chartHeight, width: chartWidth }} />;
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const diff = max - min;

  // Convert values to X/Y coordinates
  const pointsObj = data.map((value, index) => {
    const denom = diff === 0 ? 1 : diff;
    const x = (index / (data.length - 1)) * chartWidth;
    const y = chartHeight - ((value - min) / denom) * (chartHeight - 15) - 5; 
    return { x, y };
  });

  // Generate smooth Cubic Bezier curve
  let lineCommand = `M ${pointsObj[0].x},${pointsObj[0].y}`;
  for (let i = 0; i < pointsObj.length - 1; i++) {
    const p1 = pointsObj[i];
    const p2 = pointsObj[i + 1];
    const cp1x = p1.x + (p2.x - p1.x) * 0.4;
    const cp1y = p1.y;
    const cp2x = p1.x + (p2.x - p1.x) * 0.6;
    const cp2y = p2.y;
    lineCommand += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }

  const fillCommand = `${lineCommand} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`;

  const color = up ? theme.upColor : theme.downColor;
  const gradientId = `grad-${up ? 'up' : 'down'}`;
  const lastPoint = pointsObj[pointsObj.length - 1];

  return (
    <View style={styles.chartContainer}>
      <Svg width={chartWidth} height={chartHeight}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.4" />
            <Stop offset="1" stopColor={color} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Path d={fillCommand} fill={`url(#${gradientId})`} />
        <Path
          d={lineCommand}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Live Tracking Dot */}
        <Circle cx={lastPoint.x} cy={lastPoint.y} r={3} fill="#fff" stroke={color} strokeWidth={2} />
      </Svg>
    </View>
  );
};

const Sparkline = React.memo(SparklineComponent);
Sparkline.displayName = 'Sparkline';

function generateInitialGraph(quote: AngelQuoteRaw): number[] {
  const open = Number(quote.open || 100);
  const close = Number(quote.ltp || quote.close || open);
  
  if (open === 0) return [0, 0, 0, 0];
  const steps = 15; 
  const path: number[] = new Array(steps).fill(0);
  path[0] = open;

  // Realistic random walk generator
  for (let i = 1; i < steps - 1; i++) {
    const progress = i / (steps - 1);
    const linearPoint = open + (close - open) * progress;
    const volatility = open * 0.003; 
    const noise = (Math.random() - 0.5) * volatility;
    path[i] = linearPoint + noise;
  }
  
  path[steps - 1] = close;
  return path;
}

function fmt(n: number) {
  if (!isFinite(n)) return '-';
  return Number(n).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const findMarketData = (fetchedData: AngelQuoteRaw[], symbol: typeof SYMBOLS[0]) => {
  if (!fetchedData || !Array.isArray(fetchedData)) return undefined;
  const byToken = fetchedData.find((f) => String(f.symbolToken) === String(symbol.token));
  if (byToken) return byToken;
  const byExactName = fetchedData.find((f) => f.tradingSymbol?.toLowerCase() === symbol.title.toLowerCase());
  if (byExactName) return byExactName;
  return fetchedData.find((f) => (f.tradingSymbol?.toLowerCase() || '').includes(symbol.title.toLowerCase()));
};

const Indices: React.FC = () => {
  const [indices, setIndices] = useState<IndexModel[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  const chartCache = useRef<Map<string, number[]>>(new Map());
  const isMounted = useRef(true);
  const isFetching = useRef(false);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const theme = {
    bg: isDark ? '#020210' : '#f7f9fc',
    cardBg: isDark ? '#040410' : '#ffffff',
    textPrimary: isDark ? '#FFFFFF' : '#141723',
    textSecondary: isDark ? '#B5B2B1' : '#4f5568',
    borderColor: isDark ? 'rgba(248, 185, 23, 0.15)' : 'rgba(20, 23, 35, 0.12)',
    upColor: '#10B981', 
    downColor: '#EF4444', 
    upBg: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5',
    downBg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
    exchangeBg: isDark ? 'rgba(255,255,255,0.1)' : '#eef1f6',
  };

  useEffect(() => {
    isMounted.current = true;
    
    // Load from cache initially
    const loadCache = async () => {
      try {
        const cached = await AsyncStorage.getItem('MAIN_INDICES_CACHE');
        if (cached && isMounted.current) {
          setIndices(JSON.parse(cached));
        }
      } catch (e) {
        // ignore
      }
    };
    loadCache();

    return () => { isMounted.current = false; };
  }, []);

  const fetchData = useCallback(async (isManualRefresh = false) => {
    if (isFetching.current && !isManualRefresh) return;

    try {
      isFetching.current = true;
      const hasData = chartCache.current.size > 0;
      if (!isManualRefresh && !hasData && isMounted.current) setLoading(true);

      const fetched = await fetchAngelIndices();
      if (!isMounted.current) return;

      if (isMounted.current) {
        setIndices((prevIndices) => {
          const mapped = SYMBOLS.map((s) => {
            const q = findMarketData(fetched, s);
            if (!q) {
              const cachedChart = chartCache.current.get(s.token) || [];
              const oldIndex = prevIndices?.find(i => i.id === s.id);
              if (oldIndex) return oldIndex;
              return { 
                ...s, 
                price: '-', 
                currency: 'INR', 
                change: '-', 
                percent: '0.00', 
                up: false, 
                chart: cachedChart,
                rawPrice: 0,
                rawChange: 0,
                rawPercent: 0,
              };
            }

            const currentLTP = Number(q.ltp ?? q.close ?? 0);
            const netChange = Number(q.netChange);
            const percentChange = Number(q.percentChange);
            const up = netChange >= 0;
            const price = fmt(currentLTP);
            const change = `${netChange.toFixed(2)}`;
            const percent = `${percentChange.toFixed(2)}%`;

            let chartData = chartCache.current.get(s.token);
            if (!chartData || chartData.length === 0) {
              chartData = generateInitialGraph(q);
            } else {
              chartData = [...chartData];
              chartData[chartData.length - 1] = currentLTP;
            }
            chartCache.current.set(s.token, chartData);

            return {
              ...s,
              exchange: q.exchange || s.exchange,
              price,
              currency: 'INR',
              change,
              percent,
              up,
              chart: chartData,
              rawPrice: currentLTP,
              rawChange: netChange,
              rawPercent: percentChange,
            };
          });
          
          // Save to cache
          AsyncStorage.setItem('MAIN_INDICES_CACHE', JSON.stringify(mapped)).catch(() => {});
          
          return mapped;
        });
      }
    } catch (err: any) {
      console.warn('Indices polling failed:', err.message || 'Unknown error');
    } finally {
      isFetching.current = false;
      if (isMounted.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => fetchData(), 3000);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData(true);
  }, [fetchData]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Market Indices</Text>
        </View>
        <View style={[styles.liveBadge, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}>
           <View style={styles.pulseDot} />
           <Text style={[styles.liveText, { color: theme.textPrimary }]}>LIVE</Text>
        </View>
      </View>

      {loading && !indices ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + 16} 
        >
          {(indices ?? []).map((idx) => (
            <View 
              key={idx.id} 
              style={[
                styles.card, 
                { backgroundColor: theme.cardBg, borderColor: theme.borderColor }
              ]}
            >
              <View style={styles.topSection}>
                <View style={styles.leftCol}>
                  <Text style={[styles.indexTitle, { color: theme.textPrimary }]} numberOfLines={1}>{idx.title}</Text>
                  <Text style={[styles.exchangeTag, { color: theme.textSecondary, backgroundColor: theme.exchangeBg }]}>{idx.exchange}</Text>
                </View>
                <View style={styles.rightCol}>
                  <Text style={[styles.priceText, { color: theme.textPrimary }]}>{idx.price}</Text>
                  <View style={styles.changeRow}>
                    <Text style={[styles.changeText, { color: idx.up ? theme.upColor : theme.downColor }]}>
                      {idx.up ? '+' : ''}{idx.change}
                    </Text>
                    <View style={[styles.percentBadge, { backgroundColor: idx.up ? theme.upBg : theme.downBg }]}>
                       <Text style={[styles.percentText, { color: idx.up ? theme.upColor : theme.downColor }]}>
                         {idx.up ? '↑' : '↓'} {idx.percent}
                       </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.chartWrapper}>
                <Sparkline data={idx.chart} up={idx.up} theme={theme} />
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Manrope_800ExtraBold',
    letterSpacing: -0.5,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
    marginRight: 6,
  },
  liveText: {
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
  },
  loadingContainer: {
    height: CARD_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden', 
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
    justifyContent: 'space-between',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    paddingBottom: 4,
  },
  leftCol: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  rightCol: {
    alignItems: 'flex-end',
    flexShrink: 1,
  },
  indexTitle: {
    fontSize: 13,
    fontFamily: 'Manrope_700Bold',
    marginBottom: 4,
  },
  exchangeTag: {
    fontSize: 9,
    fontFamily: 'Manrope_600SemiBold',
    alignSelf: 'flex-start',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  priceText: {
    fontSize: 15,
    fontFamily: 'Manrope_800ExtraBold',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
  },
  percentBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  percentText: {
    fontSize: 9,
    fontFamily: 'Manrope_800ExtraBold',
  },
  chartWrapper: {
    height: CHART_HEIGHT,
    width: '100%',
    justifyContent: 'flex-end',
    marginBottom: -1,
  },
  chartContainer: {
    width: '100%',
    height: '100%',
  },
});

export default Indices;