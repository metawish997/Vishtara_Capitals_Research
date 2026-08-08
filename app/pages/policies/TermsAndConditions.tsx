import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppearance } from '@/context/AppearanceContext';

const TermsAndConditions = () => {
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
        <Text style={styles.headerTitle}>Terms And Conditions</Text>
        <View style={styles.balanceView} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>

      <View style={styles.view}>
                
                <View style={styles.view}>
                    <View style={styles.view}>
                        <View style={styles.view}><Text style={styles.p}> </Text></View>
                        <Text style={styles.h2}>1. Acceptance of Terms</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.p}>
                            By accessing or using our website, services, or applications, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.
                        </Text>
                    </View>
                </View>

                
                <View style={styles.view}>
                    <View style={styles.view}>
                        <View style={styles.view}><Text style={styles.p}> </Text></View>
                        <Text style={styles.h2}>2. Eligibility</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.p}>
                            You must be at least 18 years old to use our services. By using this website, you confirm that you meet this requirement and have the legal capacity to enter into a binding agreement.
                        </Text>
                    </View>
                </View>

                
                <View style={styles.view}>
                    <View style={styles.view}>
                        <View style={styles.view}><Text style={styles.p}> </Text></View>
                        <Text style={styles.h2}>3. Use of Services</Text>
                    </View>
                    <View style={styles.view}>
                        <View style={styles.ul}>
                            <Text style={styles.li}>• You agree to use the services only for lawful purposes.</Text>
                            <Text style={styles.li}>• You must not misuse, hack, or attempt unauthorized access to the platform.</Text>
                            <Text style={styles.li}>• You are responsible for maintaining the confidentiality of your account credentials.</Text>
                        </View>
                    </View>
                </View>

                
                <View style={styles.view}>
                    <View style={styles.view}>
                        <View style={styles.view}><Text style={styles.p}> </Text></View>
                        <Text style={styles.h2}>4. Intellectual Property</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.p}>
                            All content, logos, designs, text, graphics, and software on this website are the intellectual property of the company and are protected by applicable copyright and trademark laws.
                        </Text>
                    </View>
                </View>

                
                <View style={styles.view}>
                    <View style={styles.view}>
                        <View style={styles.view}><Text style={styles.p}> </Text></View>
                        <Text style={styles.h2}>5. User Content</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.p}>
                            Any content submitted by users remains their responsibility. We reserve the right to remove content that violates these terms or applicable laws.
                        </Text>
                    </View>
                </View>

                
                <View style={styles.view}>
                    <View style={styles.view}>
                        <View style={styles.view}><Text style={styles.p}> </Text></View>
                        <Text style={styles.h2}>6. Payments & Refunds</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.p}>
                            All payments made on the platform are subject to our pricing and refund policy. Fees once paid are non-refundable unless explicitly stated otherwise.
                        </Text>
                    </View>
                </View>

                
                <View style={styles.view}>
                    <View style={styles.view}>
                        <View style={styles.view}><Text style={styles.p}> </Text></View>
                        <Text style={styles.h2}>7. Limitation of Liability</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.p}>
                            We shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use our services.
                        </Text>
                    </View>
                </View>

                
                <View style={styles.view}>
                    <View style={styles.view}>
                        <View style={styles.view}><Text style={styles.p}> </Text></View>
                        <Text style={styles.h2}>8. Termination</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.p}>
                            We reserve the right to suspend or terminate your access to the services at any time, without prior notice, if you violate these Terms and Conditions.
                        </Text>
                    </View>
                </View>

                
                <View style={styles.view}>
                    <View style={styles.view}>
                        <View style={styles.view}><Text style={styles.p}> </Text></View>
                        <Text style={styles.h2}>9. Privacy Policy</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.p}>
                            Your use of the services is also governed by our Privacy Policy. Please review it to understand how we collect and use your information.
                        </Text>
                    </View>
                </View>

                
                <View style={styles.view}>
                    <View style={styles.view}>
                        <View style={styles.view}><Text style={styles.p}> </Text></View>
                        <Text style={styles.h2}>10. Changes to Terms</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.p}>
                            We may update these Terms and Conditions from time to time. Continued use of the services after changes are made constitutes acceptance of the updated terms.
                        </Text>
                    </View>
                </View>

                
                <View style={styles.view}>
                    <View style={styles.view}>
                        <View style={styles.view}><Text style={styles.p}> </Text></View>
                        <Text style={styles.h2}>11. Governing Law</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.p}>
                            These Terms and Conditions shall be governed by and interpreted in accordance with the laws of India. Any disputes shall be subject to the jurisdiction of Indian courts.
                        </Text>
                    </View>
                </View>

                
                <View style={styles.view}>
                    <View style={styles.view}>
                        <View style={styles.view}><Text style={styles.p}> </Text></View>
                        <Text style={styles.h2}>12. Contact Information</Text>
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

export default TermsAndConditions;
