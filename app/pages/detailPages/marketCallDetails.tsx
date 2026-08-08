import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import OtherPagesInc from '@/components/includes/otherPagesInc';
import { useAppearance } from '@/context/AppearanceContext';
import tipService from '@/services/api/methods/tipService';
import socket from '@/services/socket/socketClient';

const MarketCallDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';
  
  const theme = {
    bg: isDark ? '#020210' : '#FFFFFF',
    textPrimary: isDark ? '#F9FAFB' : '#0F172A',
    textSecondary: isDark ? '#9CA3AF' : '#64748B',
    borderColor: isDark ? '#1F2937' : '#E2E8F0',
    divider: isDark ? '#1F2937' : '#F1F5F9',
    accent: isDark ? '#f8b917' : '#4338CA',
  };

  const [tip, setTip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liveLtp, setLiveLtp] = useState((params.ltp as string) || '');
  
  useEffect(() => {
    const fetchTipDetails = async () => {
      try {
        const response = await tipService.getTipById(params.id as string);
        if (response?.data) {
          setTip(response.data);
          if (!liveLtp) {
            setLiveLtp(response.data.current_price || response.data.cmp_price || '');
          }
        }
      } catch (error) {
        console.error('Fetch Tip Error:', error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchTipDetails();
    } else {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (!tip || tip.trade_status === 'Closed' || !tip.symbol_token) return;

    const tokensByExchange = {
      [tip.exchange || tip.exch_seg || 'NSE']: [tip.symbol_token]
    };

    socket.emit('subscribe', tokensByExchange);

    const handlePriceUpdate = (quote: any) => {
      if (!quote || String(quote.token) !== String(tip.symbol_token)) return;
      setLiveLtp(quote.ltp);
    };

    socket.on('price', handlePriceUpdate);
    socket.on('tick', handlePriceUpdate);

    return () => {
      socket.off('price', handlePriceUpdate);
      socket.off('tick', handlePriceUpdate);
      socket.emit('unsubscribe', tokensByExchange);
    };
  }, [tip?.trade_status, tip?.symbol_token, tip?.exchange]);

  if (loading) {
    return (
      <OtherPagesInc>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.bg }}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      </OtherPagesInc>
    );
  }

  if (!tip) {
    return (
      <OtherPagesInc>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.bg }}>
          <Text style={{ color: '#EF4444', fontWeight: '800', fontSize: 16 }}>TIP NOT FOUND</Text>
        </View>
      </OtherPagesInc>
    );
  }

  const isSellCall = (tip.call_type || '').toUpperCase() === 'SELL';
  const entryPrice = parseFloat(tip.entry_price || '0');
  const cmp = parseFloat(liveLtp || tip.cmp_price || tip.entry_price || '0');
  
  const isWaiting = (tip.status || '').toLowerCase() === 'wait for entry' || (tip.status || '').toLowerCase() === 'waiting';
  
  let changePercent = 0;
  if (entryPrice > 0 && cmp > 0 && !isWaiting) {
      const diff = isSellCall ? (entryPrice - cmp) : (cmp - entryPrice);
      changePercent = (diff / entryPrice) * 100;
  }
  const changePercentStr = changePercent.toFixed(2);
  const isPositive = changePercent >= 0;
  
  const getShortStatus = (status: string) => {
    if (!status) return 'WAIT';
    const s = status.toLowerCase();
    const map: any = {
      'active': 'ACT',
      't1-achieved': 'TG1',
      't2-achieved': 'TG2',
      'sl-hit': 'SL',
      'wait for entry': 'WAIT',
      'early-exit': 'EXIT'
    };
    return map[s] || status.toUpperCase();
  };

  const isT1Achieved = ['T1-Achieved', 'T2-Achieved', 'T3-Achieved', 'All Target Achieved'].includes(tip.status);
  const isT2Achieved = ['T2-Achieved', 'T3-Achieved', 'All Target Achieved'].includes(tip.status);

  const formatStockName = (call: any) => {
    let name = call.stock_name || 'N/A';
    if (call.tip_type === 'future' || call.tip_type === 'option') {
      let expiryStr = '';
      if (call.expiry_date) {
        const date = new Date(call.expiry_date);
        const day = date.getDate();
        const month = date.toLocaleDateString('en-GB', { month: 'short' });
        expiryStr = ` ${day} ${month}`;
      }
      if (call.tip_type === 'future') {
        name += `${expiryStr} Fut`;
      } else if (call.tip_type === 'option') {
        const strike = call.strike_price ? ` ${call.strike_price}` : '';
        const optType = call.option_type ? ` ${call.option_type}` : '';
        name += `${expiryStr}${strike}${optType}`;
      }
    }
    return name;
  };

  const rawFollowups = tip.followups || [];
  const rawNotes = tip.admin_notes || [];
  
  let timelineItems = [
    ...rawFollowups.map((f: any) => ({ ...f, type: 'followup' })),
    ...rawNotes.map((a: any) => ({ ...a, type: 'note', message: a.note || a }))
  ].sort((a, b) => {
      const d1 = new Date(a.date || a.createdAt || new Date()).getTime();
      const d2 = new Date(b.date || b.createdAt || new Date()).getTime();
      return d2 - d1;
  });

  const handleOpenAttachment = () => {
    if (tip.chart_image) {
      // Use the API URL from your app config if it's a relative path, otherwise use it directly.
      // Assuming it's an absolute URL or hosted path.
      Linking.openURL(tip.chart_image).catch((err) => console.error("Couldn't open URL", err));
    }
  };

  const hasAttachment = !!tip.chart_image;
  const isImage = hasAttachment && tip.chart_image.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null;

  return (
    <OtherPagesInc>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} style={{ backgroundColor: theme.bg }}>
        
        {/* Header Section (Flat Layout) */}
        <View style={[styles.section, { borderBottomColor: theme.divider }]}>
          <View style={styles.titleWrapper}>
            <Text style={[styles.stockName, { color: theme.textPrimary }]} numberOfLines={1}>{formatStockName(tip)}</Text>
            <View style={[styles.callTypeBadge, isSellCall ? styles.bgRose : styles.bgEmerald]}>
              <Text style={[styles.callTypeText, isSellCall ? styles.textRose : styles.textEmerald]}>{tip.call_type}</Text>
            </View>
          </View>
          
          <Text style={styles.subtitleText}>
            {tip.exchange} • {tip.tip_type} {tip.category?.name ? `• ${tip.category.name}` : ''}
          </Text>

          <View style={styles.headerPriceRow}>
            <View style={styles.priceCol}>
              <Text style={styles.priceLabel}>Live CMP</Text>
              <Text style={[styles.priceValue, isPositive ? styles.textEmerald : changePercent < 0 ? styles.textRose : { color: theme.textPrimary }]}>
                ₹{cmp.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.priceCol, { alignItems: 'flex-end' }]}>
              <Text style={styles.priceLabel}>P&L (%)</Text>
              <Text style={[styles.priceValue, isPositive ? styles.textEmerald : changePercent < 0 ? styles.textRose : { color: theme.textSecondary }]}>
                {isPositive ? '+' : ''}{changePercentStr}%
              </Text>
            </View>
          </View>
        </View>

        {/* Attachment Section */}
        {hasAttachment && (
          <View style={[styles.section, { borderBottomColor: theme.divider }]}>
            <Text style={styles.sectionTitle}>Attachment</Text>
            {isImage ? (
              <TouchableOpacity onPress={handleOpenAttachment} activeOpacity={0.8} style={styles.imageContainer}>
                <Image 
                  source={{ uri: tip.chart_image }} 
                  style={styles.attachmentImage} 
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay}>
                  <Text style={styles.imageOverlayText}>Tap to View Full Image</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.attachmentButton, { borderColor: theme.borderColor, backgroundColor: theme.bg }]} 
                onPress={handleOpenAttachment}
              >
                <Text style={[styles.attachmentButtonText, { color: theme.accent }]}>📄 View Attached Document</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Trade Details Grid (Flat Layout) */}
        <View style={[styles.section, { borderBottomColor: theme.divider }]}>
           <View style={styles.flatRow}>
              <View style={styles.flatCol}>
                <Text style={styles.flatLabel}>Status</Text>
                <Text style={[styles.flatValue, tip.status === 'Active' ? { color: '#3b82f6' } : tip.status?.includes('Achieved') ? styles.textEmerald : tip.status === 'SL-Hit' ? styles.textRose : { color: theme.textPrimary }]}>
                  {getShortStatus(tip.status)}
                </Text>
              </View>
              <View style={styles.flatCol}>
                <Text style={styles.flatLabel}>Trade State</Text>
                <Text style={[styles.flatValue, tip.trade_status === 'Open' ? styles.textEmerald : { color: theme.textSecondary }]}>
                  {tip.trade_status}
                </Text>
              </View>
           </View>

           <View style={styles.flatRow}>
              <View style={styles.flatCol}>
                <Text style={styles.flatLabel}>Entry Range</Text>
                <Text style={[styles.flatValue, { color: theme.textPrimary }]}>₹{entryPrice.toFixed(2)}</Text>
              </View>
              <View style={styles.flatCol}>
                <Text style={styles.flatLabel}>Stop Loss</Text>
                <Text style={[styles.flatValue, styles.textRose]}>₹{parseFloat(tip.stop_loss || '0').toFixed(2)}</Text>
              </View>
           </View>
        </View>

        {/* Targets Analysis (Flat Layout) */}
        <View style={[styles.section, { borderBottomColor: theme.divider }]}>
          <Text style={styles.sectionTitle}>Targets</Text>
          <View style={styles.targetsRow}>
            <View style={styles.targetCol}>
              <View style={styles.targetHeader}>
                <View style={[styles.dot, isT1Achieved ? styles.bgEmerald : styles.bgEmeraldLite]} />
                <Text style={styles.targetLabelText}>Target 1</Text>
              </View>
              <Text style={styles.targetPriceText}>₹{parseFloat(tip.target_price || '0').toFixed(2)}</Text>
            </View>
            {tip.target_price_2 ? (
              <View style={styles.targetCol}>
                <View style={styles.targetHeader}>
                  <View style={[styles.dot, isT2Achieved ? styles.bgEmerald : styles.bgEmeraldLite]} />
                  <Text style={styles.targetLabelText}>Target 2</Text>
                </View>
                <Text style={styles.targetPriceText}>₹{parseFloat(tip.target_price_2).toFixed(2)}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Specs & Timestamps (Flat Layout) */}
        <View style={[styles.section, { borderBottomColor: theme.divider }]}>
          <View style={styles.listRow}>
            <Text style={styles.listLabel}>Expiry Date</Text>
            <Text style={[styles.listValue, { color: theme.textPrimary }]}>
              {tip.expiry_date ? new Date(tip.expiry_date).toLocaleDateString('en-GB') : '-'}
            </Text>
          </View>
          <View style={styles.listRow}>
            <Text style={styles.listLabel}>Strike Price</Text>
            <Text style={[styles.listValue, { color: theme.textPrimary }]}>{tip.strike_price || '-'}</Text>
          </View>
          <View style={styles.listRow}>
            <Text style={styles.listLabel}>Option Type</Text>
            <Text style={[styles.listValue, { color: theme.textPrimary }]}>{tip.option_type || '-'}</Text>
          </View>
          <View style={styles.listRow}>
            <Text style={styles.listLabel}>Published</Text>
            <Text style={[styles.listValue, { color: theme.textPrimary }]}>
              {new Date(tip.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
            </Text>
          </View>
          <View style={[styles.listRow, { marginBottom: 0 }]}>
            <Text style={styles.listLabel}>Exit Executed</Text>
            <Text style={[styles.listValue, tip.exit_at ? styles.textRose : { color: theme.textPrimary }]}>
              {tip.exit_at ? new Date(tip.exit_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}
            </Text>
          </View>
        </View>

        {/* Expert Feed Timeline */}
        <View style={styles.section}>
          <View style={styles.feedHeaderRow}>
            <Text style={styles.sectionTitle}>Expert Feed</Text>
            <View style={[styles.feedCountBadge, { backgroundColor: theme.divider }]}>
              <Text style={[styles.feedCountText, { color: theme.textPrimary }]}>{timelineItems.length}</Text>
            </View>
          </View>

          {timelineItems.length === 0 ? (
            <Text style={styles.emptyFeedText}>NO ENTRIES YET</Text>
          ) : (
            <View style={styles.timelineContainer}>
              <View style={[styles.timelineLine, { backgroundColor: theme.divider }]} />
              {timelineItems.map((msgObj, idx) => (
                <View key={idx} style={styles.timelineItem}>
                  <View style={[
                    styles.timelineDot, 
                    msgObj.type === 'note' ? styles.bgAmber : styles.bgAccent,
                    { borderColor: theme.bg }
                  ]} />
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineMeta}>
                      <Text style={[styles.timelineType, msgObj.type === 'note' ? styles.textAmber : styles.textAccent]}>
                        {msgObj.type === 'note' ? 'REMARK' : 'UPDATE'}
                      </Text>
                      <Text style={styles.timelineDate}>
                        {msgObj.date || msgObj.createdAt ? new Date(msgObj.date || msgObj.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
                      </Text>
                    </View>
                    <Text style={[styles.timelineMessage, { color: theme.textPrimary }]}>{msgObj.message || JSON.stringify(msgObj)}</Text>
                    
                    {msgObj.type === 'followup' && (msgObj.target_price || msgObj.target_price_2 || msgObj.stop_loss) && (
                      <View style={[styles.timelineUpdatesGrid, { borderTopColor: theme.divider }]}>
                        {msgObj.target_price ? (
                          <View style={styles.updateBox}>
                            <Text style={styles.updateLabel}>T1</Text>
                            <Text style={[styles.updateValue, styles.textEmerald]}>₹{msgObj.target_price}</Text>
                          </View>
                        ) : null}
                        {msgObj.target_price_2 ? (
                          <View style={styles.updateBox}>
                            <Text style={styles.updateLabel}>T2</Text>
                            <Text style={[styles.updateValue, styles.textEmerald]}>₹{msgObj.target_price_2}</Text>
                          </View>
                        ) : null}
                        {msgObj.stop_loss ? (
                          <View style={styles.updateBox}>
                            <Text style={styles.updateLabel}>SL</Text>
                            <Text style={[styles.updateValue, styles.textRose]}>₹{msgObj.stop_loss}</Text>
                          </View>
                        ) : null}
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

      </ScrollView>
    </OtherPagesInc>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  stockName: {
    fontSize: 22,
    fontWeight: '800',
    marginRight: 10,
  },
  callTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  callTypeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  subtitleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  headerPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  priceCol: {
    justifyContent: 'center',
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  
  /* Attachment Section */
  imageContainer: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 10,
  },
  attachmentImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    alignItems: 'center',
  },
  imageOverlayText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  attachmentButton: {
    width: '100%',
    paddingVertical: 14,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderStyle: 'dashed',
  },
  attachmentButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },

  flatRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  flatCol: {
    flex: 1,
  },
  flatLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  flatValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  targetsRow: {
    flexDirection: 'row',
  },
  targetCol: {
    marginRight: 40,
  },
  targetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  targetLabelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  targetPriceText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10B981',
    marginLeft: 16,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  listLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  listValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  feedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  feedCountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  feedCountText: {
    fontSize: 11,
    fontWeight: '800',
  },
  emptyFeedText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    padding: 32,
    letterSpacing: 1,
  },
  timelineContainer: {
    position: 'relative',
    paddingLeft: 12,
  },
  timelineLine: {
    position: 'absolute',
    left: 17,
    top: 6,
    bottom: 0,
    width: 2,
  },
  timelineItem: {
    position: 'relative',
    marginBottom: 28,
  },
  timelineDot: {
    position: 'absolute',
    left: 0,
    top: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    zIndex: 10,
  },
  timelineContent: {
    marginLeft: 32,
  },
  timelineMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  timelineType: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginRight: 8,
  },
  timelineDate: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  timelineMessage: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 22,
  },
  timelineUpdatesGrid: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  updateBox: {
    marginRight: 24,
  },
  updateLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 2,
  },
  updateValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  
  bgRose: { backgroundColor: 'rgba(244, 63, 94, 0.15)' },
  textRose: { color: '#F43F5E' },
  bgEmerald: { backgroundColor: '#10B981' },
  bgEmeraldLite: { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
  textEmerald: { color: '#10B981' },
  bgAmber: { backgroundColor: '#F59E0B' },
  textAmber: { color: '#F59E0B' },
  bgAccent: { backgroundColor: '#4338CA' },
  textAccent: { color: '#4338CA' },
});

export default MarketCallDetails;