import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppearance } from '@/context/AppearanceContext';

const PrivacyPolicy = () => {
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.balanceView} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>

      <View style={styles.view}>
                
                <View style={styles.view}>
                    <View style={styles.view}>
                        <View style={styles.view}><Text style={styles.p}> </Text></View>
                        <Text style={styles.h2}>1. Information We Collect</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.p}>We may collect personal and transactional data to fulfill our onboarding requirements, regulatory responsibilities, and provide reliable research services:</Text>
                        <View style={styles.ul}>
                            <Text style={styles.li}>• <Text style={styles.bold}>Identifiable Data:</Text> Full name, email address, phone number</Text>
                            <Text style={styles.li}>• <Text style={styles.bold}>KYC Documents:</Text> Permanent Account Number (PAN), address proofs, and identity verification proofs</Text>
                            <Text style={styles.li}>• <Text style={styles.bold}>Financial Data:</Text> Payment transaction details and history</Text>
                            <Text style={styles.li}>• <Text style={styles.bold}>Usage Data:</Text> Non-personal website usage data, diagnostics, and analytics</Text>
                        </View>
                    </View>
                </View>

                
                <View style={styles.view}>
                    <View style={styles.view}>
                        <View style={styles.view}><Text style={styles.p}> </Text></View>
                        <Text style={styles.h2}>2. Use of Information</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.p}>Your collected information is strictly utilized to ensure seamless delivery and compliance requirements:</Text>
                        <View style={styles.ul}>
                            <Text style={styles.li}>• KYC compliance checks and customer verification procedures</Text>
                            <Text style={styles.li}>• Regulatory reporting to relevant agencies under SEBI and other governing bodies</Text>
                            <Text style={styles.li}>• Effective service delivery and distribution of research calls</Text>
                            <Text style={styles.li}>• Proactive customer communication and updates regarding subscriptions</Text>
                            <Text style={styles.li}>• Fulfillment of legal obligations, compliance tasks, and auditing</Text>
                        </View>
                    </View>
                </View>

                
                <View style={styles.view}>
                    <View style={styles.view}>
                        <View style={styles.view}><Text style={styles.p}> </Text></View>
                        <Text style={styles.h2}>3. Data Sharing</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.p}>We do not sell, trade, or rent your personal information to third parties.</Text>
                        <Text style={styles.p}>Your data is kept private and shared only under the following necessary scenarios:</Text>
                        <View style={styles.ul}>
                            <Text style={styles.li}>• With SEBI, RAASB (Research Analyst Administration and Supervision Body), or KRA (KYC Registration Agencies)</Text>
                            <Text style={styles.li}>• With law enforcement, legal advisors, or regulatory authorities, if mandatory under Indian law</Text>
                        </View>
                    </View>
                </View>

                
                <View style={styles.view}>
                    <View style={styles.view}>
                        <View style={styles.view}><Text style={styles.p}> </Text></View>
                        <Text style={styles.h2}>4. Data Security</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.p}>We deploy robust, standard technical and organizational security measures to shield your data from unauthorized access or alteration. However, please note:</Text>
                        <View style={styles.ul}>
                            <Text style={styles.li}>• Data transmission over the internet or cloud storage can never be guaranteed 100% secure</Text>
                            <Text style={styles.li}>• You accept and acknowledge this inherent security risk when subscribing to our services</Text>
                        </View>
                    </View>
                </View>

                
                <View style={styles.view}>
                    <View style={styles.view}>
                        <View style={styles.view}><Text style={styles.p}> </Text></View>
                        <Text style={styles.h2}>5. Data Retention</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.p}>We preserve client profiles and records in compliance with the SEBI Regulations and relevant Indian statutory guidelines. Information is stored for the duration required by these laws to facilitate auditing, legal reviews, and historical verification.</Text>
                    </View>
                </View>

                
                <View style={styles.view}>
                    <View style={styles.view}>
                        <View style={styles.view}><Text style={styles.p}> </Text></View>
                        <Text style={styles.h2}>6. Your Rights</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.p}>To ensure transparent control over your database files, you retain the following rights:</Text>
                        <View style={styles.ul}>
                            <Text style={styles.li}>• Correction or revision of inaccurate or outdated personal data</Text>
                            <Text style={styles.li}>• Immediate update of active contact details (email or telephone number)</Text>
                            <Text style={styles.li}>• Seeking official clarification regarding database processing operations</Text>
                        </View>
                    </View>
                </View>

                
                <View style={styles.view}>
                    <View style={styles.view}>
                        <View style={styles.view}><Text style={styles.p}> </Text></View>
                        <Text style={styles.h2}>7. Contact for Privacy Queries</Text>
                    </View>
                    
                    <View style={styles.view}>
                        <View style={styles.view}>
                            <View style={styles.view}><Text style={styles.p}> </Text></View>
                            <View style={styles.view}>
                                <Text>Email Support</Text>
                                <Text style={styles.a}>
                                    chouhananujay@gmail.com
                                </Text>
                            </View>
                        </View>

                        <View style={styles.view}>
                            <View style={styles.view}><Text style={styles.p}> </Text></View>
                            <View style={styles.view}>
                                <Text>Contact Phone</Text>
                                <Text style={styles.a}>
                                    +91 86020 27324
                                </Text>
                            </View>
                        </View>
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

export default PrivacyPolicy;
