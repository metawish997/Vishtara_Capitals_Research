import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppearance } from '@/context/AppearanceContext';

const CodeOfConduct = () => {
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
        <Text style={styles.headerTitle}>Code Of Conduct</Text>
        <View style={styles.balanceView} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>

      <View style={styles.view}>
        
        <View style={styles.view}>
            <Text style={styles.h3}>CODE OF CONDUCT FOR RESEARCH ANALYST</Text>
            <Text style={styles.p}>
                Official regulatory framework establishing mandatory ethical values, transparency criteria, and compliance obligations governing all research operations.
            </Text>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>1. Honesty and Good Faith</Text>
            <Text style={styles.p}>
                Research analyst or research entity shall act honestly and in good faith.
            </Text>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>2. Diligence</Text>
            <Text style={styles.p}>
                Research analyst or research entity shall act with due skill, care and diligence and shall ensure that the research report is prepared after thorough analysis.
            </Text>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>3. Conflict of Interest</Text>
            <Text style={styles.p}>
                Research analyst or research entity shall effectively address conflict of interest which may affect the impartiality of its research analysis and research report and shall make appropriate disclosures to address the same.
            </Text>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>4. Insider Trading or front running</Text>
            <Text style={styles.p}>
                Research analyst or research entity or its employees shall not engage in insider trading or front running or front running of its own research report.
            </Text>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>5. Confidentiality</Text>
            <Text style={styles.p}>
                Research analyst or research entity or its employees shall maintain confidentiality of report till the report is made public.
            </Text>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>6. Professional Standard</Text>
            <Text style={styles.p}>
                Research analyst or research entity or its employees engaged in research analysis shall observe high professional standard while preparing research report.
            </Text>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>7. Compliance</Text>
            <Text style={styles.p}>
                Research analyst or research entity shall comply with all regulatory requirements applicable to the conduct of its business activities.
            </Text>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>8. Responsibility of senior management</Text>
            <Text style={styles.p}>
                The senior management of research analyst or research entity shall bear primary responsibility for ensuring the maintenance of appropriate standards of conduct and adherence to proper procedures.
            </Text>
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

export default CodeOfConduct;
