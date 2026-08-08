import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Stack } from 'expo-router';
import OtherPagesInc from '@/components/includes/otherPagesInc';
import { useAppearance } from '@/context/AppearanceContext';

export default function LegalDisclaimer() {
  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';

  const theme = {
    bg: isDark ? '#020210' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#111827',
    textSecondary: isDark ? '#B5B2B1' : '#4B5563',
  };

  return (
    <OtherPagesInc title="Legal Disclaimer">
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView 
        contentContainerStyle={[styles.content, { backgroundColor: theme.bg }]} 
        style={{ backgroundColor: theme.bg }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.lastUpdated, { color: theme.textSecondary, marginTop: 4 }]}>Last Updated: 20 Sep 2025</Text>

        <View style={styles.section}>
          <Text style={[styles.heading, { color: theme.textPrimary }]}>1. General Information</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            The information provided on Vishtara Capitals Research App is for educational and informational purposes only. It should not be considered as financial advice.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.heading, { color: theme.textPrimary }]}>2. Market Risks</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            Stock trading and investments are subject to market risks. Please read all scheme-related documents carefully before investing. Past performance is not indicative of future results.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.heading, { color: theme.textPrimary }]}>3. No Guarantee</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            While we strive to provide accurate data, we do not guarantee the accuracy, completeness, or timeliness of the information. Users are advised to verify information with certified financial advisors.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.heading, { color: theme.textPrimary }]}>4. User Responsibility</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            You agree that any trading decisions you make are your own responsibility. Vishtara Capitals Research App and its owners will not be held liable for any losses incurred.
          </Text>
        </View>
      </ScrollView>
    </OtherPagesInc>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 40,
    paddingTop: 20,
  },
  lastUpdated: {
    fontSize: 12,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'justify',
  },
});