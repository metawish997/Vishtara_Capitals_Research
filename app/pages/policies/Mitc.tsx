import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppearance } from '@/context/AppearanceContext';

const Mitc = () => {
  const router = useRouter();
  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';

  const THEME_COLOR = isDark ? '#f8b917' : '#8cc63f';
  const BG_COLOR = isDark ? '#020210' : '#F8F9FA';
  const CARD_BG = isDark ? '#040410' : '#FFFFFF';
  const TEXT_PRIMARY = isDark ? '#FFFFFF' : '#111827';
  const TEXT_SECONDARY = isDark ? '#B5B2B1' : '#6B7280';
  const BORDER_COLOR = isDark ? 'rgba(248, 185, 23, 0.15)' : '#E5E7EB';
  const ICON_BG = isDark ? '#0a0a1a' : '#F9FAFB';
  const BACK_ICON_COLOR = isDark ? '#FFFFFF' : '#1F2937';

  const styles = getStyles({ THEME_COLOR, BG_COLOR, CARD_BG, TEXT_PRIMARY, TEXT_SECONDARY, BORDER_COLOR, ICON_BG, isDark });

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Feather name="arrow-left" size={24} color={BACK_ICON_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mitc</Text>
        <View style={styles.balanceView} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>

      <View style={styles.view}>
        
        <View style={styles.view}>
            <Text style={styles.h3}>1. Availing Services & Obligations</Text>
            <Text style={styles.p}>
                By accepting delivery of the research service, the client confirms that he/she has elected to subscribe to the research service of the RA at his/her sole discretion. The RA confirms that research services shall be rendered in accordance with the provisions of SEBI Research Analyst Regulations.
            </Text>
            <Text style={styles.p}>
                Both RA and the client shall be bound by the SEBI Act, 1992, along with all rules, notifications, and regulations updated from time to time.
            </Text>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>2. Client Information & KYC</Text>
            <Text style={styles.p}>
                The client shall furnish all details in full as required by the RA in its standard onboarding documentation. The RA shall collect, store, upload, and check verification records with an authorized SEBI-registered KYC Registration Agency (KRA) prior to charging any service fees.
            </Text>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>3. Risk Disclosures & Fee Disclosures</Text>
            <View style={styles.ul}>
                <Text style={styles.li}>• Any investment made based on recommendations are subject to market risks.</Text>
                <Text style={styles.li}>• Recommendations do not provide any explicit or implicit assurance or guarantee of returns.</Text>
                <Text style={styles.li}>• There is no recourse to claim any financial losses incurred on investments made based on published research reports.</Text>
                <Text style={styles.li}>• <Text style={styles.bold}>Fee Limitation:</Text> The maximum statutory fee that may be charged by the RA is ₹1.51 Lakhs per annum per family of the client.</Text>
            </View>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>4. Termination, Refunds & Grievances</Text>
            <Text style={styles.p}>
                In case of suspension of the Certificate of Registration of the RA for more than 60 days or direct cancellation of registration, the RA shall proactively refund the subscription fees on a strict pro-rata basis for the remaining unexpired timeline.
            </Text>
            <Text style={styles.p}>
                Deficiencies or download interruptions must be escalated to the Proprietor (<Text style={styles.bold}>Anujay Chouhan</Text>) at <Text style={styles.bold}>chouhananujay@gmail.com</Text>. Grievances will be addressed within 7 business working days.
            </Text>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>Part C: Core MITC Guidelines</Text>
            <View style={styles.ul}>
                <Text style={styles.li}>• <Text style={styles.bold}>No Execution Privileges:</Text> The RA cannot execute or carry out any buy/sell trades on behalf of the client. Never permit trade execution authorization.</Text>
                <Text style={styles.li}>• <Text style={styles.bold}>Non-Cash Mode:</Text> Fees must be routed entirely via banking infrastructure (Cheque, Online Bank Transfer, UPI). <Text style={styles.bold}>Cash payments are strictly prohibited.</Text></Text>
                <Text style={styles.li}>• <Text style={styles.bold}>Credential Protection:</Text> The RA shall never request your trading passwords, demat credentials, or banking OTPs. Never disclose passwords to anyone.</Text>
            </View>
        </View>

      </View>
    
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = ({ THEME_COLOR, BG_COLOR, CARD_BG, TEXT_PRIMARY, TEXT_SECONDARY, BORDER_COLOR, ICON_BG, isDark }: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_COLOR },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: CARD_BG, borderBottomWidth: 1, borderBottomColor: BORDER_COLOR },
  backIcon: { padding: 8 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: TEXT_PRIMARY },
  balanceView: { width: 40 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 12, paddingBottom: 24 },
  card: { backgroundColor: CARD_BG, borderRadius: 12, elevation: 2, padding: 16 },
  
  view: { marginBottom: 12 },
  h1: { fontSize: 22, fontWeight: '800', color: TEXT_PRIMARY, marginBottom: 12 },
  h2: { fontSize: 18, fontWeight: '700', color: TEXT_PRIMARY, marginTop: 16, marginBottom: 8 },
  h3: { fontSize: 16, fontWeight: '600', color: TEXT_PRIMARY, marginTop: 12, marginBottom: 6 },
  p: { fontSize: 14, lineHeight: 20, color: TEXT_SECONDARY, marginBottom: 10 },
  ul: { paddingLeft: 8, marginBottom: 10 },
  li: { fontSize: 14, lineHeight: 20, color: TEXT_SECONDARY, marginBottom: 6 },
  bold: { fontWeight: '700', color: TEXT_PRIMARY },
  a: { color: THEME_COLOR, textDecorationLine: 'underline' },
  table: { borderWidth: 1, borderColor: BORDER_COLOR, borderRadius: 8, overflow: 'hidden', marginBottom: 12 },
  tr: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: BORDER_COLOR },
  th: { flex: 1, padding: 8, backgroundColor: ICON_BG },
  thText: { fontWeight: 'bold', color: TEXT_PRIMARY, fontSize: 13 },
  td: { flex: 1, padding: 8 },
  tdText: { color: TEXT_SECONDARY, fontSize: 13 },
});

export default Mitc;
