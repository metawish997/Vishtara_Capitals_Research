import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import OtherPagesInc from '@/components/includes/otherPagesInc';
import announcementServices from '@/services/api/methods/announcementService';
import RenderHtml from 'react-native-render-html';
import { useAppearance } from '@/context/AppearanceContext';

interface AnnouncementData {
  title: string;
  date: string;
  tag: string;
  bodyTitle: string;
  bodyText: string;
  bullets: string[];
  footer: string;
}

const THEME_COLOR = '#0a7ea4';

function firstValue(value: string | string[] | undefined, fallback = ''): string {
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}

function toText(value: unknown, fallback = ''): string {
  if (value === null || value === undefined) return fallback;
  if (Array.isArray(value)) return value.length ? String(value[0]) : fallback;
  return String(value);
}

export default function AnnouncementDetails() {
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{
    id?: string | string[];
    title?: string | string[];
    date?: string | string[];
    tag?: string | string[];
  }>();

  const id = firstValue(params.id);
  const titleParam = firstValue(params.title);
  const dateParam = firstValue(params.date);
  const tagParam = firstValue(params.tag);

  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';

  const theme = {
    bg: isDark ? '#020210' : '#F8F9FA',
    cardBg: isDark ? '#040410' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#111827',
    textSecondary: isDark ? '#9CA3AF' : '#6B7280',
    textBody: isDark ? '#D1D5DB' : '#374151',
    borderColor: isDark ? 'rgba(248, 185, 23, 0.15)' : '#E5E7EB',
    loader: isDark ? '#f8b917' : '#0a7ea4',
  };

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<AnnouncementData>({
    title: titleParam || 'Loading...',
    date: dateParam || '',
    tag: tagParam || '',
    bodyTitle: '',
    bodyText: '',
    bullets: [],
    footer: '',
  });

  useEffect(() => {
    const fetchAnnouncementDetails = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const allAnnouncements = await announcementServices.getAllAnnouncements();
        const response = Array.isArray(allAnnouncements) 
          ? allAnnouncements.find((item: any) => item._id === id || item.id === id)
          : null;

        if (response) {
          const createdAtValue = response?.createdAt
            ? new Date(response.createdAt).toLocaleDateString()
            : '';

          const responseDate =
            toText(response?.when, '') ||
            createdAtValue ||
            dateParam ||
            'Recent';

          const responseTag = Array.isArray(response?.tags)
            ? toText(response.tags[0], 'Update')
            : toText(response?.tag, tagParam || 'Update');

          setData({
            title: toText(response?.title, titleParam || 'Announcement'),
            date: responseDate,
            tag: responseTag,
            bodyTitle: toText(response?.bodyTitle, toText(response?.subtitle, 'Details')),
            bodyText: toText(
              response?.detail,
              toText(response?.bodyText, toText(response?.description, toText(response?.content, '')))
            ),
            bullets: Array.isArray(response?.bullets)
              ? response.bullets.map((item: unknown) => toText(item)).filter(Boolean)
              : [],
            footer: toText(
              response?.footer,
              'If this update impacts you and you have a question, you can raise a ticket from the Support & Complaints page.'
            ),
          });
        }
      } catch (error) {
        console.error('Failed to fetch announcement details:', error);
        setData({
          title: titleParam || 'Planned maintenance window',
          date: dateParam || '30 Nov 2025',
          tag: tagParam || 'Info update',
          bodyTitle: 'Maintenance window',
          bodyText: 'Scheduled between 11.30 PM and 12.30 PM on Sunday night. During the time:',
          bullets: [
            'Existing logged-in users may experience brief disconnects.',
            'New logins and KYC document uploads may be temporarily unavailable.',
          ],
          footer:
            'If this update impacts you and you have a question, you can raise a ticket from the Support & Complaints page.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncementDetails();
  }, [id, titleParam, dateParam, tagParam]);

  return (
    <OtherPagesInc>
      <Stack.Screen options={{ headerShown: false }} />

      {isLoading ? (
        <View style={[styles.loaderContainer, { backgroundColor: theme.bg }]}>
          <ActivityIndicator size="large" color={theme.loader} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>{toText(data.title, '')}</Text>

            {(data.date || data.tag) ? (
              <Text style={[styles.meta, { color: theme.textSecondary }]}>
                {toText(data.date, '')}
                {data.date && data.tag ? ' • ' : ''}
                <Text style={styles.metaTag}>{toText(data.tag, '')}</Text>
              </Text>
            ) : null}

            {data.bodyTitle ? (
              <Text style={[styles.sectionHeader, { color: theme.textPrimary }]}>{toText(data.bodyTitle, '')}</Text>
            ) : null}

            {data.bodyText ? (
              <RenderHtml
                contentWidth={width - 48} // 24 padding on each side
                source={{ html: toText(data.bodyText, '') }}
                baseStyle={{ ...styles.bodyText, color: theme.textBody }}
                tagsStyles={{
                  p: { color: theme.textBody, fontSize: 15, lineHeight: 24, marginBottom: 16, marginTop: 0 },
                  strong: { color: theme.textPrimary, fontWeight: '700' },
                  li: { color: theme.textBody, fontSize: 15, lineHeight: 24 },
                  ul: { paddingLeft: 20 },
                  ol: { paddingLeft: 20 },
                  h1: { color: theme.textPrimary, fontSize: 20, fontWeight: '700', marginBottom: 12 },
                  h2: { color: theme.textPrimary, fontSize: 18, fontWeight: '700', marginBottom: 10 },
                  h3: { color: theme.textPrimary, fontSize: 16, fontWeight: '700', marginBottom: 8 },
                }}
              />
            ) : null}

            {data.bullets.length > 0 ? (
              <View style={styles.bulletContainer}>
                {data.bullets.map((point, index) => (
                  <View key={`${index}-${point}`} style={styles.bulletRow}>
                    <Text style={[styles.bulletDot, { color: theme.textBody }]}>•</Text>
                    <Text style={[styles.bulletText, { color: theme.textBody }]}>{toText(point, '')}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            {data.footer ? (
              <Text style={[styles.footerNote, { color: theme.textSecondary }]}>{toText(data.footer, '')}</Text>
            ) : null}
          </View>
        </ScrollView>
      )}
    </OtherPagesInc>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 10,
    paddingBottom: 20,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 500,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  meta: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 24,
  },
  metaTag: {
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
  bulletContainer: {
    marginBottom: 24,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletDot: {
    fontSize: 18,
    lineHeight: 24,
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
  },
  footerNote: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
  },
});