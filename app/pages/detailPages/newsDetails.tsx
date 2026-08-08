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
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
// Ensure this path matches your project structure
import blogAndNewsService from '@/services/api/methods/blogAndNewsService';
import { useAppearance } from '@/context/AppearanceContext';
import { IMAGE_BASE_URL } from '@/services/api/apiClient';

// --- Unified Interface for both News and Blogs ---
interface ArticleData {
  id: number | string;
  title: string;
  meta: string;
  imageUrl: string;
  body: string;
  type: 'news' | 'blog';
}

export default function ArticleDetailsPage() {
  const router = useRouter();
  const { id, type } = useLocalSearchParams<{ id: string; type: 'news' | 'blog' }>();

  const [article, setArticle] = useState<ArticleData | null>(null);
  const [recentUpdates, setRecentUpdates] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(true);

  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';

  const theme = {
    bg: isDark ? '#020210' : '#ffffff',
    cardBg: isDark ? '#040410' : '#ffffff',
    textPrimary: isDark ? '#FFFFFF' : '#111827',
    textSecondary: isDark ? '#B5B2B1' : '#6B7280',
    textBody: isDark ? '#D1D5DB' : '#374151',
    borderColor: isDark ? 'rgba(248, 185, 23, 0.15)' : '#E5E7EB',
    divider: isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6',
    accent: isDark ? '#f8b917' : '#0a7ea4',
    backBtnBg: isDark ? 'rgba(4, 4, 16, 0.7)' : 'rgba(255, 255, 255, 0.9)',
    backBtnIcon: isDark ? '#FFFFFF' : '#000000',
    typeBadgeBg: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB',
    typeText: isDark ? '#FFFFFF' : '#4B5563',
    imgBg: isDark ? '#1C1C24' : '#F3F4F6',
    loader: isDark ? '#f8b917' : '#000000',
    goBackBg: isDark ? 'rgba(255,255,255,0.1)' : '#000',
    goBackText: isDark ? '#FFFFFF' : '#FFFFFF',
  };

  // --- Helper Functions ---

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return '';
    }
  };

  const stripHtmlTags = (html: string) => {
    if (!html) return '';
    return html
      .replace(/<[^>]*>?/gm, '') // Remove tags
      .replace(/&nbsp;/g, ' ')   // Replace non-breaking space
      .replace(/&amp;/g, '&')    // Replace ampersand
      .replace(/&quot;/g, '"')   // Replace quotes
      .replace(/\s+/g, ' ')      // Collapse multiple spaces
      .trim();
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
    return 'https://via.placeholder.com/600';
  };

  // --- Main Fetch Logic ---

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, type]); // Re-run when ID or Type changes (e.g., clicking a recent item)

  const fetchData = async () => {
    try {
      setLoading(true);
      // Scroll to top when loading new article (optional UX improvement)

      // 1. Fetch Both Data Sources
      const [newsResponse, blogsResponse] = await Promise.all([
        blogAndNewsService.news.getAllNews(),
        blogAndNewsService.blogs.getAllBlogs(),
      ]);

      const getArray = (response: any) => {
        if (Array.isArray(response)) return response;
        if (response?.data && Array.isArray(response.data)) return response.data;
        if (response?.blogs && Array.isArray(response.blogs)) return response.blogs;
        if (response?.news && Array.isArray(response.news)) return response.news;
        return [];
      };

      const rawNews = getArray(newsResponse);
      const rawBlogs = getArray(blogsResponse);

      // 2. Find the Current Article (Based on ID and Type)
      let currentItem: any = null;

      if (type === 'blog') {
        currentItem = rawBlogs.find((item: any) => (item._id || item.id)?.toString() === id?.toString());
      } else {
        // Default to news if type is missing or 'news'
        currentItem = rawNews.find((item: any) => (item._id || item.id)?.toString() === id?.toString());
      }

      // 3. Set Current Article State
      if (currentItem) {
        // Logic to determine Meta text (Blogs get reading time, News gets simple date)
        const dateStr = formatDate(currentItem.published_at || currentItem.created_at);
        const metaText = type === 'blog' && currentItem.reading_time
          ? `${dateStr} • ${currentItem.reading_time} min read`
          : dateStr;

        setArticle({
          id: currentItem.id,
          title: currentItem.title,
          meta: metaText,
          imageUrl: getImageUrl(currentItem),
          body: stripHtmlTags(currentItem.content),
          type: type as 'news' | 'blog',
        });
      }

      // 4. Prepare "Recent Updates" List
      // We explicitly tag them before merging to avoid type errors
      const taggedNews = rawNews.map((item: any) => ({ ...item, _type: 'news' }));
      const taggedBlogs = rawBlogs.map((item: any) => ({ ...item, _type: 'blog' }));

      const combinedList = [...taggedNews, ...taggedBlogs]
        .filter((item: any) => (item._id || item.id)?.toString() !== id?.toString()) // Remove current article
        .sort((a: any, b: any) => {
          // Sort by newest
          const dateA = new Date(a.published_at || a.created_at || 0).getTime();
          const dateB = new Date(b.published_at || b.created_at || 0).getTime();
          return dateB - dateA;
        })
        .slice(0, 5); // Take top 5

      // Map to valid ArticleData interface
      const formattedRecent: ArticleData[] = combinedList.map((item: any) => ({
        id: item._id || item.id,
        title: item.title,
        meta: formatDate(item.published_at || item.created_at),
        imageUrl: getImageUrl(item),
        body: '', // Not needed for list
        type: item._type as 'news' | 'blog', // Explicit casting based on our tag
      }));

      setRecentUpdates(formattedRecent);

    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Render Helpers ---

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.loader} />
      </View>
    );
  }

  if (!article) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.bg }]}>
        <Text style={[styles.errorText, { color: theme.textSecondary }]}>Article not found.</Text>
        <TouchableOpacity style={[styles.goBackBtn, { backgroundColor: theme.goBackBg }]} onPress={() => router.back()}>
          <Text style={[styles.goBackText, { color: theme.goBackText }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.bg} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* --- Hero Image --- */}
        <View style={[styles.imageContainer, { backgroundColor: theme.imgBg }]}>
          <Image source={{ uri: article.imageUrl }} style={styles.heroImage} />

          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.backBtnBg }]}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color={theme.backBtnIcon} />
          </TouchableOpacity>
        </View>

        {/* --- Article Body --- */}
        <View style={styles.contentContainer}>
          {/* Badge for Type */}
          <View style={[styles.typeBadge, { backgroundColor: theme.typeBadgeBg }]}>
            <Text style={[styles.typeText, { color: theme.typeText }]}>{article.type === 'blog' ? 'BLOG' : 'NEWS'}</Text>
          </View>

          <Text style={[styles.headline, { color: theme.textPrimary }]}>{article.title}</Text>
          <Text style={[styles.dateLine, { color: theme.textSecondary }]}>{article.meta}</Text>

          <Text style={[styles.bodyText, { color: theme.textBody }]}>
            {article.body}
          </Text>
        </View>

        {/* --- Recent Updates Section --- */}
        {recentUpdates.length > 0 && (
          <View style={[styles.recentSection, { borderTopColor: theme.divider }]}>
            <Text style={[styles.recentHeader, { color: theme.textPrimary }]}>Recent Updates</Text>

            <View style={styles.listContainer}>
              {recentUpdates.map((item, index) => (
                <TouchableOpacity
                  key={`${item.type}-${item.id}-${index}`}
                  style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}
                  activeOpacity={0.7}
                  onPress={() => {
                    // Navigate to the same page with new params
                    router.push({
                      pathname: '/pages/detailPages/newsDetails', // Ensure this path matches your file name
                      params: { id: item.id, type: item.type }
                    });
                  }}
                >
                  <View style={styles.textContainer}>
                    <Text style={[styles.cardTitle, { color: theme.textPrimary }]} numberOfLines={3}>
                      {item.title}
                    </Text>
                    <Text style={[styles.cardMeta, { color: theme.textSecondary }]}>
                      {item.type === 'blog' ? 'Blog • ' : 'News • '}
                      {item.meta}
                    </Text>
                  </View>

                  <Image
                    source={{ uri: item.imageUrl }}
                    style={[styles.thumbnail, { backgroundColor: theme.imgBg }]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
  },
  goBackBtn: {
    padding: 10,
    borderRadius: 8,
  },
  goBackText: {
    fontWeight: '600',
  },

  // Hero Section
  imageContainer: {
    width: '100%',
    height: 260,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  // Article Body
  contentContainer: {
    padding: 20,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 12,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headline: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 30,
    textAlign: 'left',
  },
  dateLine: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 24,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 26,
    textAlign: 'justify',
  },

  // Recent Section
  recentSection: {
    marginTop: 10,
    paddingHorizontal: 20,
    borderTopWidth: 8,
    paddingTop: 24,
  },
  recentHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  listContainer: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
    justifyContent: 'space-between',
    minHeight: 80,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 8,
  },
  cardMeta: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 'auto',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
});