import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppearance } from '@/context/AppearanceContext';

const PolicyList = () => {
  const router = useRouter();
  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';

  const theme = {
    bg: isDark ? '#020210' : '#F8F9FA',
    card: isDark ? '#040410' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#111827',
    textSecondary: isDark ? '#B5B2B1' : '#6B7280',
    border: isDark ? 'rgba(248, 185, 23, 0.15)' : '#E5E7EB',
    primary: isDark ? '#f8b917' : '#8cc63f',
  };

  const policies = [
    { text: 'Account Deletion', route: '/pages/policies/AccountDeletion' },
    { text: 'Code Of Conduct', route: '/pages/policies/CodeOfConduct' },
    { text: 'Disclaimers', route: '/pages/policies/Disclaimers' },
    { text: 'Grievance Escalation Matrix', route: '/pages/policies/GrievanceEscalationMatrix' },
    { text: 'Grievance Redressal Policy', route: '/pages/policies/GrievanceRedressalPolicy' },
    { text: 'Internal Policy', route: '/pages/policies/InternalPolicy' },
    { text: 'Investor Charter', route: '/pages/policies/InvestorCharter' },
    { text: 'MITC', route: '/pages/policies/Mitc' },
    { text: 'PMLA Policy', route: '/pages/policies/PmlaPolicy' },
    { text: 'Privacy Policy', route: '/pages/policies/PrivacyPolicy' },
    { text: 'Refund Policy', route: '/pages/policies/RefundPolicy' },
    { text: 'Risk Warnings', route: '/pages/policies/RiskWarnings' },
    { text: 'SEBI Disclosures', route: '/pages/policies/SebiDisclosures' },
    { text: 'Terms And Conditions', route: '/pages/policies/TermsAndConditions' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.bg} />
      
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Feather name="arrow-left" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Policies</Text>
        <View style={styles.balanceView} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={[styles.pageTitle, { color: theme.textPrimary }]}>Legal & Policies</Text>
          <Text style={[styles.pageSubtitle, { color: theme.textSecondary }]}>Review our policies, terms, and guidelines below.</Text>
        </View>

        <View style={[styles.menuContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {policies.map((policy, index, array) => (
            <TouchableOpacity
              key={`policy-${index}`}
              style={[styles.menuRow, index === array.length - 1 ? { borderBottomWidth: 0 } : { borderBottomColor: theme.border }]}
              activeOpacity={0.7}
              onPress={() => router.push(policy.route as any)}
            >
              <View style={styles.menuIconBox}>
                <Feather name="file-text" size={18} color={theme.textSecondary} />
              </View>
              <Text style={[styles.menuText, { color: theme.textPrimary }]}>
                {policy.text}
              </Text>
              <Feather name="chevron-right" size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  backIcon: { padding: 8 },
  headerTitle: { fontSize: 19, fontWeight: '700' },
  balanceView: { width: 40 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  headerSection: { marginBottom: 24, marginTop: 8 },
  pageTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginBottom: 8 },
  pageSubtitle: { fontSize: 15, lineHeight: 22 },
  menuContainer: { borderRadius: 16, overflow: 'hidden', borderWidth: 1 },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  menuIconBox: { width: 24, alignItems: 'center', marginRight: 16 },
  menuText: { flex: 1, fontSize: 15, fontWeight: '500' },
});

export default PolicyList;
