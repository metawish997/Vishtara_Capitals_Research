import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppearance } from '@/context/AppearanceContext';

const Disclaimers = () => {
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
        <Text style={styles.headerTitle}>Disclaimers</Text>
        <View style={styles.balanceView} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>

      <View style={styles.view}>
                
                <View style={styles.view}>
                    <Text style={styles.h2}>1. Limitations of Liability & Capital Realities</Text>
                    <View style={styles.view}>
                        <Text style={styles.p}>Trading/investing in the Stock Market involves considerable systemic volatility. You can lose part or all of your underlying principal asset capital pool. All outputs distributed must be strictly consumed as independent market observations, not financial guidance counsel.</Text>
                        <Text style={styles.p}>We issue zero profit commitments. We hold zero liability for loss matrices incurred by the user based on views generated across our platforms.</Text>
                    </View>
                </View>

                <View style={styles.view}>
                    <Text style={styles.h2}>2. Material Interests & AI Architecture Confirmations</Text>
                    <View style={styles.ul}>
                        <Text style={styles.li}>• The RA, relatives, or associates hold <Text>0% actual beneficial stock ownership</Text> in any entity subject to publication records.</Text>
                        <Text style={styles.li}>• <Text>No AI Tool Sourcing:</Text> In accordance with transparent validation protocols, Vishtara Capital Research confirms that <Text>no automated Artificial Intelligence (AI) generation tools are deployed</Text> to form or construct core research recommendations.</Text>
                    </View>
                </View>

                <View style={styles.view}>
                    <Text style={styles.h2}>3. Technical Terms Operational Definitions</Text>
                    <View style={styles.view}>
                        <View style={styles.view}><Text>Buy</Text> <Text>Triggers immediately at current market parameters or within noted bands.</Text></View>
                        <View style={styles.view}><Text>Stop Loss</Text> <Text>Strict safety close boundary parameter to shield against volatile market movements. Must be monitored near trading session market close.</Text></View>
                        <View style={styles.view}><Text>Add / Accumulate</Text> <Text>Gradual localized scaling of investment quantities on market price retracements.</Text></View>
                        <View style={styles.view}><Text>Hold</Text> <Text>Preserve existing positioning values when targets or stop-losses have not been breached.</Text></View>
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

export default Disclaimers;
