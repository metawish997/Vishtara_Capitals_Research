import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import blogAndNewsService from '@/services/api/methods/blogAndNewsService';
import { useAppearance } from '@/context/AppearanceContext';
import { IMAGE_BASE_URL } from '@/services/api/apiClient';

// --- Constants ---
const { width } = Dimensions.get('window');

interface NewsItem {
  id: number | string;
  title: string;
  meta: string;
  imageUrl: string;
  type: 'news' | 'blog';
  content?: string;
  shortDescription?: string;
  originalDate?: string;
}

const NewsPage = () => {
  const router = useRouter();
  const [feedData, setFeedData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';

  const theme = {
    bg: isDark ? '#020210' : '#FFFFFF',
    cardBg: isDark ? '#040410' : '#ffffff',
    textPrimary: isDark ? '#FFFFFF' : '#141723',
    textSecondary: isDark ? '#B5B2B1' : '#4f5568',
    borderColor: isDark ? 'rgba(248, 185, 23, 0.15)' : 'rgba(20, 23, 35, 0.12)',
    accent: isDark ? '#f8b917' : '#011d52',
    btnBg: isDark ? 'rgba(255,255,255,0.02)' : '#ffffff',
    imgBg: isDark ? 'rgba(255,255,255,0.02)' : '#F3F4F6',
    blogBadge: isDark ? '#0284c7' : '#0e46a0',
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getImageUrl = (item: any) => {
    const img = item.image || item.image_url || item.thumbnail;
    let url = '';
    if (typeof img === 'string') url = img;
    else if (img && typeof img === 'object' && img.url) url = img.url;
    else if (img && typeof img === 'object' && img.uri) url = img.uri;

    if (url) {
      if (url.startsWith('/uploads')) return `${IMAGE_BASE_URL}${url}`;
      return url;
    }
    return 'https://via.placeholder.com/300';
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [newsResponse, blogsResponse] = await Promise.all([
        blogAndNewsService.news.getAllNews(),
        blogAndNewsService.blogs.getAllBlogs(),
      ]);

      const getArray = (response: any) => {
        if (Array.isArray(response)) return response;
        if (response?.data && Array.isArray(response.data)) return response.data;
        return [];
      };

      const rawNews = getArray(newsResponse);
      const rawBlogs = getArray(blogsResponse);

      const formattedNews: NewsItem[] = rawNews.map((item: any) => ({
        id: item._id || item.id,
        title: item.title,
        meta: formatDate(item.published_at || item.created_at) || 'Latest',
        imageUrl: getImageUrl(item),
        type: 'news',
        originalDate: item.published_at || item.created_at,
      }));

      const formattedBlogs: NewsItem[] = rawBlogs.map((item: any) => ({
        id: item._id || item.id,
        title: item.title,
        meta: `${formatDate(item.published_at || item.created_at)} • ${item.reading_time || 5} min read`,
        imageUrl: getImageUrl(item),
        type: 'blog',
        originalDate: item.published_at || item.created_at,
      }));

      const combined = [...formattedNews, ...formattedBlogs].sort((a, b) => {
        return new Date(b.originalDate || 0).getTime() - new Date(a.originalDate || 0).getTime();
      });

      setFeedData(combined);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCard = (item: NewsItem, isHero = false) => (
    <TouchableOpacity
      key={`${item.type}-${item.id}`}
      style={[isHero ? styles.heroCard : styles.listCard, !isHero && { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}
      activeOpacity={0.9}
      onPress={() => router.push({ pathname: '/pages/detailPages/newsDetails', params: { id: item.id, type: item.type } })}
    >
      <Image source={{ uri: item.imageUrl }} style={[isHero ? styles.heroImage : styles.listThumbnail, !isHero && { backgroundColor: theme.imgBg }]} />

      <View style={isHero ? styles.heroOverlay : styles.listTextContent}>
        <View style={styles.badgeRow}>
          <View style={[styles.typeBadge, { backgroundColor: item.type === 'blog' ? theme.blogBadge : theme.accent }]}>
            <Text style={styles.typeBadgeText}>{item.type.toUpperCase()}</Text>
          </View>
          {isHero && <Text style={styles.heroMeta}>{item.meta}</Text>}
        </View>

        <Text style={[isHero ? styles.heroTitle : styles.listTitle, !isHero && { color: theme.textPrimary }]} numberOfLines={isHero ? 2 : 3}>
          {item.title}
        </Text>

        {!isHero && (
          <View style={styles.listFooter}>
            <Text style={[styles.listMeta, { color: theme.textSecondary }]}>{item.meta}</Text>
            <Feather name="arrow-right" size={14} color={theme.accent} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.bg} />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.accent} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Fetching latest insights...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.welcomeText, { color: theme.textPrimary }]}>Insights & Updates</Text>
              <Text style={[styles.subHeaderText, { color: theme.textSecondary }]}>Smart moves for smart investors</Text>
            </View>
            <TouchableOpacity onPress={fetchData} style={[styles.refreshBtn, { backgroundColor: theme.btnBg, borderColor: theme.borderColor }]}>
              <Feather name="refresh-cw" size={20} color={theme.accent} />
            </TouchableOpacity>
          </View>

          {feedData.length > 0 && (
            <View style={styles.section}>
              {renderCard(feedData[0], true)}
            </View>
          )}

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Recent Stories</Text>
            {feedData.slice(1).map((item) => renderCard(item))}
          </View>

          {feedData.length === 0 && (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="newspaper-variant-outline" size={60} color={theme.textSecondary} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No updates found at the moment.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 15,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '800',
  },
  subHeaderText: {
    fontSize: 13,
    marginTop: 2,
  },
  refreshBtn: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  section: {
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  // Hero Card Styles
  heroCard: {
    width: '100%',
    height: 260,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
    elevation: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    justifyContent: 'flex-end',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 28,
  },
  heroMeta: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 10,
  },
  // List Card Styles
  listCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  listThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  listTextContent: {
    flex: 1,
    marginLeft: 15,
    height: 100,
    justifyContent: 'space-between',
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
  },
  listMeta: {
    fontSize: 11,
    fontWeight: '600',
  },
  listFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // Badges
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '500',
  },
});

export default NewsPage;