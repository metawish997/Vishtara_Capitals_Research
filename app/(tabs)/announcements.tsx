import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  ListRenderItem,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';

import announcementServices from '@/services/api/methods/announcementService';
import { useAppearance } from '@/context/AppearanceContext';

// --- Constants ---
const { width } = Dimensions.get('window');

// --- Types ---
interface AnnouncementItem {
  id: string;
  title: string;
  subtitle: string;
  when: string;
  tags: string[];
}

interface FilterItem {
  key: string;
  count: number;
}

export default function Announcements() {
  const router = useRouter();
  
  // --- State ---
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';

  const theme = {
    bg: isDark ? '#020210' : '#FFFFFF',
    cardBg: isDark ? '#040410' : '#ffffff',
    textPrimary: isDark ? '#FFFFFF' : '#141723',
    textSecondary: isDark ? '#B5B2B1' : '#4f5568',
    borderColor: isDark ? 'rgba(248, 185, 23, 0.15)' : 'rgba(20, 23, 35, 0.12)',
    accent: isDark ? '#f8b917' : '#011d52',
    searchBg: isDark ? 'rgba(255,255,255,0.02)' : '#ffffff',
    chipBg: isDark ? 'rgba(255,255,255,0.02)' : '#ffffff',
    chipActiveBg: isDark ? '#f8b917' : '#011d52',
    chipActiveText: isDark ? '#020210' : '#000000',
    chipCountBg: isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6',
    chipCountActiveBg: isDark ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
    tagNewBg: isDark ? 'rgba(248, 185, 23, 0.1)' : '#ecfccb',
    tagNewBorder: isDark ? 'rgba(248, 185, 23, 0.3)' : '#d9f99d',
    tagNewText: isDark ? '#f8b917' : '#4d7c0f',
    tagStandardBg: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
    tagStandardBorder: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
    tagStandardText: isDark ? '#e2e8f0' : '#475569',
  };

  // --- API Integration ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // You can swap to getActiveAnnouncements() if you only want active ones
      const response = await announcementServices.getAllAnnouncements();
      
      // Safety check in case response is null/undefined
      if (response) {
        // Map API data to our local AnnouncementItem interface
        // Adjust these mappings based on your actual API response structure
        const mappedData: AnnouncementItem[] = response.map((item: any) => ({
          id: item._id?.toString() || item.id?.toString() || Math.random().toString(),
          title: item.title || 'No Title',
          subtitle: item.subtitle || item.description || item.content || '',
          when: item.when || item.createdAt 
            ? new Date(item.createdAt).toLocaleDateString() 
            : 'Recently',
          tags: Array.isArray(item.tags) ? item.tags : (item.category ? [item.category] : ['Others']),
        }));
        setAnnouncements(mappedData);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // --- Filter Logic ---
  const filteredData = useMemo(() => {
    return announcements.filter((d) => {
      if (selectedFilter === 'All') return true;
      // Case insensitive tag matching just in case
      return d.tags.some(tag => tag.toLowerCase() === selectedFilter.toLowerCase());
    }).filter((d) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.subtitle.toLowerCase().includes(q) ||
        d.tags.join(' ').toLowerCase().includes(q)
      );
    });
  }, [search, selectedFilter, announcements]);

  // --- Counts ---
  const getCount = (key: string) => {
    if (key === 'All') return announcements.length;
    return announcements.filter((d) => 
      d.tags.some(tag => tag.toLowerCase() === key.toLowerCase())
    ).length;
  };

  const FILTERS: FilterItem[] = [
    { key: 'All', count: getCount('All') },
    { key: 'Features', count: getCount('Features') },
    { key: 'Service Update', count: getCount('Service Update') },
    { key: 'Others', count: getCount('Others') },
  ];

  // --- Renderers ---
  const renderChip = (item: FilterItem) => {
    const active = selectedFilter === item.key;
    return (
      <TouchableOpacity
        key={item.key}
        onPress={() => setSelectedFilter(item.key)}
        activeOpacity={0.8}
        style={[styles.chip, { backgroundColor: active ? theme.chipActiveBg : theme.chipBg, borderColor: active ? theme.chipActiveBg : theme.borderColor }]}
      >
        <Text style={[styles.chipText, { color: active ? theme.chipActiveText : theme.textSecondary }]}>
          {item.key}
        </Text>
        <View style={[styles.chipCountBadge, { backgroundColor: active ? theme.chipCountActiveBg : theme.chipCountBg }]}>
             <Text style={[styles.chipCountText, { color: active ? theme.chipActiveText : theme.textSecondary }]}>{item.count}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCard: ListRenderItem<AnnouncementItem> = ({ item }) => {
    return (
      <TouchableOpacity 
        activeOpacity={0.9} 
        style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}
        onPress={() => {
          router.push({
            pathname: '/pages/detailPages/announcementDetails',
            params: {
              id: item.id,
              title: item.title,
              date: item.when,
              tag: item.tags[0] || 'Update' 
            }
          });
        }}
      >
        <View style={styles.cardHeader}>
            <View style={styles.tagRow}>
                {item.tags.map((t, index) => {
                    const isNew = t.toLowerCase() === 'new';
                    return (
                        <View key={index} style={[styles.tagBadge, { 
                          backgroundColor: isNew ? theme.tagNewBg : theme.tagStandardBg,
                          borderColor: isNew ? theme.tagNewBorder : theme.tagStandardBorder
                        }]}>
                            <Text style={[styles.tagText, { color: isNew ? theme.tagNewText : theme.tagStandardText }]}>{t}</Text>
                        </View>
                    );
                })}
            </View>
            <Text style={[styles.dateText, { color: theme.textSecondary }]}>{item.when}</Text>
        </View>

        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.title}</Text>
        <Text numberOfLines={2} style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
          {item.subtitle}
        </Text>

        <View style={styles.cardFooter}>
            <Text style={[styles.readMoreText, { color: theme.accent }]}>Read Details</Text>
            <Feather name="arrow-right" size={16} color={theme.accent} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Tabs.Screen
        options={{
          title: 'Announcements',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="campaign" size={size ?? 26} color={color} />
          ),
          headerShown: false,
        }}
      />

      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.bg} />
        
        <View style={styles.container}>
            
            {/* Header / Search */}
            <View style={[styles.headerContainer, { backgroundColor: theme.bg }]}>
                <Text style={[styles.pageTitle, { color: theme.textPrimary }]}>Updates Feed</Text>
                
                <View style={styles.searchRow}>
                    <View style={[styles.searchBar, { backgroundColor: theme.searchBg, borderColor: theme.borderColor }]}>
                        <Feather name="search" size={20} color={theme.textSecondary} style={{ marginRight: 10 }} />
                        <TextInput
                            placeholder="Search updates..."
                            placeholderTextColor={theme.textSecondary}
                            value={search}
                            onChangeText={setSearch}
                            style={[styles.searchInput, { color: theme.textPrimary }]}
                            returnKeyType="search"
                        />
                    </View>
                    {/* Timeframe Button (Mock) */}
                    <TouchableOpacity style={[styles.filterBtn, { backgroundColor: theme.searchBg, borderColor: theme.borderColor }]}>
                         <Ionicons name="filter" size={20} color={theme.textPrimary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Filter Chips */}
            <View style={styles.chipsWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipsScroll}
                >
                    {FILTERS.map((filter) => renderChip(filter))}
                </ScrollView>
            </View>

            {/* Main Content Area */}
            {isLoading ? (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.accent} />
              </View>
            ) : (
              <FlatList
                  data={filteredData}
                  keyExtractor={(i) => i.id}
                  renderItem={renderCard}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={false}
                  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.accent} colors={[theme.accent]} />
                  }
                  ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Feather name="inbox" size={40} color={theme.textSecondary} />
                        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                          {search ? "No matching announcements." : "No announcements found."}
                        </Text>
                    </View>
                  }
              />
            )}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 15,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Header
  headerContainer: {
      paddingHorizontal: 10,
      paddingTop: 10,
      paddingBottom: 10,
  },
  pageTitle: {
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 16,
  },
  searchRow: {
      flexDirection: 'row',
      gap: 12,
  },
  searchBar: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 14,
      height: 46,
  },
  searchInput: {
      flex: 1,
      fontSize: 14,
  },
  filterBtn: {
      width: 46,
      height: 46,
      borderWidth: 1,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
  },

  // Chips
  chipsWrapper: {
      marginBottom: 10,
  },
  chipsScroll: {
      paddingHorizontal: 10,
      paddingVertical: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    marginRight: 6,
  },
  chipCountBadge: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 10,
  },
  chipCountText: {
      fontSize: 11,
      fontWeight: '700',
  },

  // List
  listContent: {
      paddingHorizontal: 10,
      paddingBottom: 100,
  },
  
  // Card
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
  },
  tagRow: {
      flexDirection: 'row',
      gap: 6,
  },
  tagBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      borderWidth: 1,
  },
  tagText: {
      fontSize: 11,
      fontWeight: '600',
  },
  dateText: {
      fontSize: 12,
      fontWeight: '500',
  },
  
  cardTitle: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 6,
  },
  cardSubtitle: {
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 16,
  },
  
  cardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  readMoreText: {
      fontSize: 13,
      fontWeight: '600',
      marginRight: 4,
  },

  // Empty
  emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 60,
  },
  emptyText: {
      marginTop: 12,
      fontSize: 14,
  },
});