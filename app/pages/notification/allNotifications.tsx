import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { useAppearance } from '@/context/AppearanceContext';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import socket from '@/services/socket/socketClient';

import notificationServices from '@/services/api/methods/notificationService';

// --- Constants ---
const THEME_COLOR = '#011d52';
const BG_COLOR = '#FFFFFF';
const CARD_BG = '#FFFFFF';
const { width } = Dimensions.get('window');

// --- Types ---
interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';

  const theme = {
    bg: isDark ? '#020210' : '#FFFFFF',
    card: isDark ? '#040410' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#111827',
    sub: isDark ? '#B5B2B1' : '#6B7280',
    border: isDark ? '#1a1f26' : '#F3F4F6',
    primary: isDark ? '#f8b917' : '#011d52',
    unreadBg: isDark ? '#0b110a' : '#F7FCEB',
    unreadBorder: isDark ? '#213316' : '#D7F5A1',
    iconBg: isDark ? '#111827' : '#F9FAFB',
  };

  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']); // ← Dynamic categories
  
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Helper to normalize type → nice tab label (keeps your original grouping logic)
  const getCategoryLabel = (type: string): string => {
    const t = (type || '').toLowerCase().trim();
    if (t.includes('trading') || t.includes('buy') || t.includes('sell')) return 'Trading';
    if (t.includes('system') || t.includes('payment') || t.includes('alert') || t.includes('transaction')) return 'System';
    if (t.includes('offer') || t.includes('promo') || t.includes('discount')) return 'Offers';
    return type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Other';
  };

  useEffect(() => {
    fetchNotifications();

    const handleNotificationRefresh = () => {
      fetchNotifications();
    };

    socket.on('notification_refresh', handleNotificationRefresh);
    return () => {
      socket.off('notification_refresh', handleNotificationRefresh);
    };
  }, []);

  // Auto-reset activeTab when categories change (e.g. after refresh with different data)
  useEffect(() => {
    if (categories.length > 0 && !categories.includes(activeTab)) {
      setActiveTab('All');
    }
  }, [categories]);

  const fetchNotifications = async () => {
    try {
      const response = await notificationServices.getAllNotifications();
      
      let dataList = [];
      if (Array.isArray(response)) {
        dataList = response;
      } else if (response?.data && Array.isArray(response.data)) {
        dataList = response.data;
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        dataList = response.data.data;
      } else if (response?.notifications && Array.isArray(response.notifications)) {
        dataList = response.notifications;
      }

      const mappedNotifications: NotificationItem[] = dataList.map((item: any) => ({
        id: item._id?.toString() || item.id?.toString() || Math.random().toString(),
        type: item.type?.toLowerCase() || item.category?.toLowerCase() || 'system',
        title: item.title || item.subject || 'New Notification',
        message: item.message || item.body || item.description || '',
        time: item.created_at || item.createdAt 
            ? new Date(item.created_at || item.createdAt).toLocaleDateString() 
            : 'Recently',
        read: item.isRead ?? item.is_read ?? item.read ?? (item.status === 'read'),
      }));

      setNotifications(mappedNotifications);

      // === DYNAMIC CATEGORIES (this is what you asked for) ===
      const catSet = new Set(mappedNotifications.map(item => getCategoryLabel(item.type)));
      let catList = Array.from(catSet);

      // Preferred order like your original tabs
      const preferredOrder = ['Trading', 'System', 'Offers', 'Other'];
      catList.sort((a, b) => {
        const ia = preferredOrder.indexOf(a);
        const ib = preferredOrder.indexOf(b);
        if (ia === -1 && ib === -1) return a.localeCompare(b);
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
      });

      setCategories(['All', ...catList]);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  // Updated filtering – now uses the same getCategoryLabel (much cleaner)
  const getFilteredData = () => {
    if (activeTab === 'All') return notifications;
    return notifications.filter(n => getCategoryLabel(n.type) === activeTab);
  };

  const markAllRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      await notificationServices.markAllRead();
    } catch (error) {
      console.error('Error marking all as read:', error);
      Alert.alert('Error', 'Could not mark notifications as read.');
      fetchNotifications(); 
    }
  };

  const markAsRead = async (id: string) => {
    const target = notifications.find(n => n.id === id);
    if (!target || target.read) return;

    try {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      await notificationServices.userMarkRead([id]);
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
      fetchNotifications(); 
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      setNotifications(prev => prev.filter(n => n.id !== id));
      await notificationServices.deleteNotifications([id]);
    } catch (error) {
      console.error(`Error deleting notification ${id}:`, error);
      Alert.alert('Error', 'Could not delete notification.');
      fetchNotifications(); 
    }
  };

  // --- Render Helpers ---
  const getIcon = (type: string) => {
    if (type.includes('trading_buy') || type.includes('buy')) return <Feather name="trending-up" size={20} color="#10B981" />;
    if (type.includes('trading_sell') || type.includes('sell')) return <Feather name="trending-down" size={20} color="#EF4444" />;
    if (type.includes('payment') || type.includes('transaction')) return <MaterialIcons name="payment" size={20} color={theme.primary} />;
    if (type.includes('system') || type.includes('alert')) return <Feather name="shield" size={20} color={isDark ? '#a78bfa' : '#7C3AED'} />;
    if (type.includes('offer') || type.includes('promo')) return <MaterialCommunityIcons name="tag-outline" size={20} color="#F59E0B" />;
    return <Feather name="bell" size={20} color={theme.sub} />;
  };

  const getIconBg = (type: string) => {
    if (isDark) {
      if (type.includes('trading_buy') || type.includes('buy')) return 'rgba(16, 185, 129, 0.15)';
      if (type.includes('trading_sell') || type.includes('sell')) return 'rgba(239, 68, 68, 0.15)';
      if (type.includes('payment') || type.includes('transaction')) return 'rgba(248, 185, 23, 0.1)';
      if (type.includes('system') || type.includes('alert')) return 'rgba(167, 139, 250, 0.15)';
      if (type.includes('offer') || type.includes('promo')) return 'rgba(245, 158, 11, 0.15)';
      return 'rgba(255, 255, 255, 0.05)';
    } else {
      if (type.includes('trading_buy') || type.includes('buy')) return '#ECFDF5';
      if (type.includes('trading_sell') || type.includes('sell')) return '#FEF2F2';
      if (type.includes('payment') || type.includes('transaction')) return '#f7fee7';
      if (type.includes('system') || type.includes('alert')) return '#F3E8FF';
      if (type.includes('offer') || type.includes('promo')) return '#FFFBEB';
      return '#F3F4F6';
    }
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity 
      style={styles.deleteAction}
      onPress={() => deleteNotification(id)}
      activeOpacity={0.8}
    >
      <Feather name="trash-2" size={24} color="#FFF" />
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <TouchableOpacity 
        style={[
          styles.card, 
          { backgroundColor: theme.card, borderColor: theme.border },
          !item.read && { backgroundColor: theme.unreadBg, borderColor: theme.unreadBorder }
        ]} 
        activeOpacity={0.7}
        onPress={() => markAsRead(item.id)}
      >
        <View style={styles.cardRow}>
          <View style={[styles.iconBox, { backgroundColor: getIconBg(item.type) }]}>
            {getIcon(item.type)}
          </View>

          <View style={styles.contentBox}>
            <View style={styles.headerRow}>
              <Text style={[styles.cardTitle, { color: theme.text }, !item.read && styles.unreadText]}>
                  {item.title}
              </Text>
              <Text style={[styles.timeText, { color: theme.sub }]}>{item.time}</Text>
            </View>
            
            <Text style={[styles.messageText, { color: theme.sub }]} numberOfLines={2}>
              {item.message}
            </Text>
          </View>

          {!item.read && <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.bg} />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { backgroundColor: theme.bg }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Feather name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Notifications</Text>
        <TouchableOpacity onPress={markAllRead} style={styles.markReadBtn}>
            <Feather name="check-circle" size={16} color={isDark ? theme.primary : '#000000'} />
            <Text style={[styles.markReadText, { color: isDark ? theme.primary : '#000000' }]}>Read All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        {categories.map((tab) => (
            <TouchableOpacity
                key={tab}
                style={[
                  styles.tab, 
                  { backgroundColor: theme.card, borderColor: theme.border },
                  activeTab === tab && { backgroundColor: isDark ? 'rgba(248, 185, 23, 0.15)' : theme.primary, borderColor: theme.primary }
                ]}
                onPress={() => setActiveTab(tab)}
            >
                <Text style={[
                  styles.tabText, 
                  { color: theme.sub },
                  activeTab === tab && { color: isDark ? theme.primary : '#000000', fontWeight: '700' }
                ]}>
                    {tab}
                </Text>
            </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={getFilteredData()}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} tintColor={theme.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={[styles.emptyIconBg, { backgroundColor: theme.iconBg }]}>
                <Feather name="bell-off" size={32} color={theme.sub} />
              </View>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No Notifications</Text>
              <Text style={[styles.emptySub, { color: theme.sub }]}>You are all caught up! Check back later.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 35,
    paddingBottom: 15,
    backgroundColor: BG_COLOR,
  },
  backBtn: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  markReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  markReadText: {
    fontSize: 13,
    color: THEME_COLOR,
    fontWeight: '600',
    marginLeft: 4,
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 10,
    gap: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeTab: {
    backgroundColor: THEME_COLOR,
    borderColor: THEME_COLOR,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },

  // List
  listContent: {
    padding: 10,
    paddingTop: 10,
    flexGrow: 1,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  unreadCard: {
    backgroundColor: '#F0F9FF', 
    borderColor: '#BAE6FD',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  contentBox: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
    paddingRight: 8,
  },
  unreadText: {
    fontWeight: '700',
  },
  timeText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  messageText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME_COLOR,
    marginLeft: 8,
    marginTop: 6,
  },
  deleteAction: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginBottom: 12,
    borderRadius: 16,
    marginLeft: 10,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyIconBg: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 14,
    color: '#6B7280',
  },
});