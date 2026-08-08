import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppearance } from '@/context/AppearanceContext';

const GrievanceRedressalPolicy = () => {
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
        <Text style={styles.headerTitle}>Grievance Redressal Policy</Text>
        <View style={styles.balanceView} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>

      <View style={styles.view}>
                
                <View style={styles.view}>
                    <View style={styles.view}>
                        <View style={styles.view}><Text style={styles.p}> </Text></View>
                        <Text style={styles.h2}>1. Collection of Information</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.p}>
                            We may collect Personal Information, Transaction Information and Non-Personal Information (defined below) from You when You register or set up an account with Us on the Platform or when You avail the Services. You can browse certain sections of the Platform without being a registered member, however, to avail certain Services on the Platform (such as investing in Stocks, P2P Lending etc.) You are required to register with Us.
                            This Privacy Policy applies to the following information:
                        </Text>
                        <View style={styles.ul}>
                            <Text style={styles.li}>• 
                                <Text style={styles.bold}>Information You provide Us:</Text> You may provide certain information to Us voluntarily while registering on Our Platform or for using Our Services. Such information include any identification/ correspondence details including Your mobile number, email address, password, date of birth, gender, Permanent Account Number (PAN), signature, marital status, nominee details, residential/ current address, any national identifiers such as identity card / passport details / Aadhaar card details / Voter ID / driving license, and/or education details. We may also ask You to provide certain additional information about You or any person acting on Your behalf on a case-to-case basis (collectively “Personal Information”). Further, You hereby acknowledge and agree that Our affiliates or group or subsidiary companies registered with financial services regulators may retrieve from Your records available with third party including from Know Your Customer (KYC) Registration Agency (KRA) such as name, KYC details, KYC status, father’s name, occupation, address details and related documents.
                            </Text>
                            <Text style={styles.li}>• 
                                <Text style={styles.bold}>Transactional Information:</Text> We may also ask You for certain financial information, including Your billing address, bank account details, income, expenses, and/or credit history, including transaction history, balances, and/or other payment related details or other payment method data, and debit instructions or other standing instructions to process payments for the Services. Further, if You choose to invest through the Platform, We will also collect information about Your transactions including transaction status/ ID and details and Your investing patterns and behaviour (collectively “Transaction Information”).
                            </Text>
                            <Text style={styles.li}>• 
                                <Text style={styles.bold}>Non-Personal Information and Cookies:</Text> We may also collect certain non-personal information, such as Your internet protocol address, web request, operating system, browser type, URL, internet service provider, IP address, aggregate user data, browser type, software and hardware attributes, pages You request, and cookie information, etc. which will not identify with You specifically (“Non – Personal Information”), while You browse, access or use the Platform. We receive and store Non – Personal Information, using data collection devices such as “cookies” on certain pages of the Platform, in order to help and analyze Our web – page flow, track user trends, measure promotional effectiveness, and promote trust and safety. We offer certain additional features on the Platform that are only available through the use of a “cookie”. We place both permanent and temporary cookies in Your computer’s hard drive. We also use cookies to allow You to enter Your password less frequently during a session on the Platform. Most cookies are “session cookies,” meaning that they are automatically deleted from Your hard drive at the end of a session. You are always free to decline Our cookies if Your browser permits, although in that case, You may not be able to use certain features or Services being provided on the Platform or You may be required to re-enter Your password each time you log – in or access the Platform during a session. No Personal Data will be collected via cookies and other tracking technology; however, if You previously provided Personal Data, cookies may be tied to such information. When and if You download and/or use the Platform through Your mobile device, We may receive information about Your location, Your IP address, and/or Your mobile device, including a unique identifier number for Your device. We may use this information to provide You with location-based Services including but not limited to search results and other personalized content. You can withdraw Your consent at any time by disabling the location-tracking functions on Your mobile. However, this may affect Your use/ enjoyment of certain features on Our Platform. You acknowledge and agree that when You browse the Platform without being a registered member or without providing Your Personal Information, We may still collect and store Your Non-Personal Information.
                            </Text>
                        </View>
                    </View>
                </View>

                
                <View style={styles.view}>
                    <View style={styles.view}>
                        <View style={styles.view}><Text style={styles.p}> </Text></View>
                        <Text style={styles.h2}>2. Use of Information</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.p}>
                            We use the Personal Information, Non-Personal Information, Transactional Information and User Communications and such other information provided by You for the following: (i) to provide and improve the Services on the Platform that You request; (ii) to resolve disputes and troubleshoot problems; (iii) to help promote a safe service on the Platform and protect the security and integrity of the Platform, the Services and the users; (iv) collect money from You in relation to the Services, (v) inform You about online and offline offers, products, services, and updates; (vi) customize Your experience on the Platform or share marketing material with You; (vii) to detect, prevent and protect Us from any errors, fraud and other criminal or prohibited activity on the Platform; (viii) enforce and inform about our terms and conditions; (ix) to process and fulfil Your request for Services or respond to Your comments, and queries on the Platform; (x) to contact You; (xi) to allow Our business partners and/or associates to present customised messages to You; (xii) to communicate important notices or changes in the Services, use of the Platform and the terms/policies which govern the relationship between You and the Company and with Our affiliates for providing Services to You; and (xiii) for any other purpose after obtaining Your consent at the time of collection.
                        </Text>
                        <Text style={styles.p}>
                            All the complaints for the investment ideas and/ or research desk will be redirected to the respective registered individuals for their evaluation and response and shall be disposed as per their respective policies.
                        </Text>
                    </View>
                </View>

                
                <View style={styles.view}>
                    <View style={styles.view}>
                        <View style={styles.view}><Text style={styles.p}> </Text></View>
                        <Text style={styles.h2}>3. Data Sharing</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.p}>
                            We may make Your Personal Information, Non-Personal Information, Transaction Information, User Communications and/or other information available to group companies, affiliates and subsidiary companies including but not limited to Uniapps Global Research Private Limited (“Uniapp”), to enable providing You Services through the Platform. Please note that all information shared with group companies, affiliates and subsidiary companies or made available to group companies, affiliates and subsidiary companies will be governed by this Privacy Policy. In addition to the Personal Information and in order to provide Services to You, Uniapp may also collect Your KYC, Aadhaar, finger – print details and signature solely for completing the account opening procedures and authenticating Your transactions on the Platform. The act of providing Your Aadhaar is voluntary in nature and the Company, hereby agrees and acknowledges that Uniapp will collect, use and store such details in compliance with applicable laws and this Privacy Policy.
                        </Text>
                    </View>
                </View>

                
                <View style={styles.view}>
                    <View style={styles.view}>
                        <View style={styles.view}><Text style={styles.p}> </Text></View>
                        <Text style={styles.h2}>4. Connecting your email account</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.p}>
                            You hereby choose to provide Your explicit consent to connect/integrate Your email account(s) with Your account on the Platform.
                        </Text>
                        <Text style={styles.p}>
                            Data obtained by this integration will be used by the Company solely for providing the Services and improving Your experience of the features of the Platform and to consolidate your investment details and history. The Company hereby agrees and acknowledges that it shall not use or transfer any data or information received from the integration of the email addresses with the account on the Platform to third parties for serving ads, including retargeting, personalized, or interest-based advertising.
                        </Text>
                        <Text style={styles.p}>
                            We encourage You to review the information prior to giving Your consent for integration of the email addresses with the account on the Platform. You may at any time opt to de-link Your email addresses connected with the account opened on the Platform, by managing these connections with the options provided on the Platform.
                        </Text>
                    </View>
                </View>

                
                <View style={styles.view}>
                    <View style={styles.view}>
                        <View style={styles.view}><Text style={styles.p}> </Text></View>
                        <Text style={styles.h2}>5. Governing Law</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.p}>
                            This policy will be governed by and construed in accordance with the laws of India and subjected to the exclusive jurisdiction of Courts of Gurugram.
                        </Text>
                    </View>
                </View>

                
                <View style={styles.view}>
                    <View style={styles.view}>
                        <View style={styles.view}><Text style={styles.p}> </Text></View>
                        <Text style={styles.h2}>6. Contact for Queries</Text>
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

                    
                    <View style={styles.view}>
                        <View style={styles.view}><Text style={styles.p}> </Text></View>
                        <View style={styles.view}>
                            <Text>Escalate Your Complaint</Text>
                            <Text style={styles.p}>If your grievance is not resolved within 30 days, you may escalate it to SEBI via the SCORES portal:</Text>
                            <Text style={styles.a}>
                                SEBI SCORES – Investor Grievance Portal
                                
                            </Text>
                            

                            <Text style={styles.a}>
                                Smart ODR – Online Dispute Resolution Portal
                                
                            </Text>
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

export default GrievanceRedressalPolicy;
