import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppearance } from '@/context/AppearanceContext';

const InvestorCharter = () => {
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
        <Text style={styles.headerTitle}>Investor Charter</Text>
        <View style={styles.balanceView} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>

      <View style={styles.view}>
        
            <View style={styles.view}>
                <View style={styles.view}>
                    <View style={styles.view}><Text style={styles.p}> </Text></View>
                    <Text style={styles.h2}>A. Vision and Mission Statements for investors.</Text>
                </View>
                
                <View style={styles.view}>
                    <View style={styles.view}>
                        <Text style={styles.h3}>• Vision</Text>
                        <Text style={styles.p}>Invest with knowledge & safety.</Text>
                    </View>
                    
                    <View style={styles.view}>
                        <Text style={styles.h3}>• Mission</Text>
                        <Text style={styles.p}>
                            Every investor should be able to invest in right investment products based on their needs, manage and monitor them to meet their goals, access reports and enjoy financial wellness.
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.view}>
                <View style={styles.view}>
                    <View style={styles.view}><Text style={styles.p}> </Text></View>
                    <Text style={styles.h2}>B. Details of business transacted by the Research Analyst with respect to the investors.</Text>
                </View>
                <View style={styles.ul}>
                    <Text style={styles.li}>• To publish research report based on the research activities of the RA</Text>
                    <Text style={styles.li}>• To provide an independent unbiased view on securities.</Text>
                    <Text style={styles.li}>• To offer unbiased recommendation, disclosing the financial interests in recommended securities.</Text>
                    <Text style={styles.li}>• To provide research recommendation, based on analysis of publicly available information and known observations.</Text>
                    <Text style={styles.li}>• To conduct audit annually</Text>
                    <Text style={styles.li}>• To ensure that all advertisements are in adherence to the provisions of the Advertisement Code for Research Analysts.</Text>
                    <Text style={styles.li}>• To maintain records of interactions, with all clients including prospective clients (prior to onboarding), where any conversation related to the research services has taken place.</Text>
                </View>
            </View>

            <View style={styles.view}>
                <View style={styles.view}>
                    <View style={styles.view}><Text style={styles.p}> </Text></View>
                    <Text style={styles.h2}>C. Details of services provided to investors (No Indicative Timelines)</Text>
                </View>
                <View style={styles.ul}>
                    <Text style={styles.li}>• Onboarding of Clients</Text>
                    <Text style={styles.li}>• Sharing of terms and conditions of research service</Text>
                    <Text style={styles.li}>• Completing KYC of fee-paying clients</Text>
                    <Text style={styles.li}>• 
                        <Text>Disclosure to Clients:</Text>
                        <View style={styles.ul}>
                            <Text style={styles.li}>• To disclose, information that is material for the client to make an informed decision, including details of its business activity, disciplinary history, the terms and conditions of research services, details of associates, risks and conflicts of interest, if any</Text>
                            <Text style={styles.li}>• To disclose the extent of use of Artificial Intelligence tools in providing research services</Text>
                            <Text style={styles.li}>• To disclose, while distributing a third-party research report, any material conflict of interest of such third-party research provider or provide web address that directs a recipient to the relevant disclosures</Text>
                            <Text style={styles.li}>• To disclose any conflict of interest of the activities of providing research services with other activities of the research analyst.</Text>
                        </View>
                    </Text>
                    <Text style={styles.li}>• To distribute research reports and recommendations to the clients without discrimination.</Text>
                    <Text style={styles.li}>• To maintain confidentiality w.r.t publication of the research report until made available in the public domain.</Text>
                    <Text style={styles.li}>• To respect data privacy rights of clients and take measures to protect unauthorized use of their confidential information</Text>
                    <Text style={styles.li}>• To disclose the timelines for the services provided by the research analyst to clients and ensure adherence to the said timelines</Text>
                    <Text style={styles.li}>• To provide clear guidance and adequate caution notice to clients when providing recommendations for dealing in complex and high-risk financial products/services</Text>
                    <Text style={styles.li}>• To treat all clients with honesty and integrity</Text>
                    <Text style={styles.li}>• To ensure confidentiality of information shared by clients unless such information is required to be provided in furtherance of discharging legal obligations or a client has provided specific consent to share such information.</Text>
                </View>
            </View>

            <View style={styles.view}>
                <View style={styles.view}>
                    <View style={styles.view}><Text style={styles.p}> </Text></View>
                    <Text style={styles.h2}>D. Details of grievance redressal mechanism and how to access it</Text>
                </View>
                
                <View style={styles.view}>
                    <Text style={styles.p}>1. Investor can lodge complaint/grievance against Research Analyst in the following ways:</Text>
                    
                    <View style={styles.view}>
                        <Text style={styles.p}>Mode of filing the complaint with research analyst</Text>
                        <Text style={styles.p}>In case of any grievance / complaint, an investor may approach the concerned Research Analyst who shall strive to redress the grievance immediately, but not later than 21 days of the receipt of the grievance.</Text>
                    </View>

                    <View style={styles.view}>
                        <Text style={styles.p}>Mode of filing the complaint on SCORES or with Research Analyst Administration and Supervisory Body (RAASB)</Text>
                        <View style={styles.ul}>
                            <Text style={styles.li}>• 
                                <Text style={styles.bold}>i. SCORES 2.0:</Text> (a web based centralized grievance redressal system of SEBI for facilitating effective grievance redressal in time-bound manner) 
                                <Text style={styles.a}>Visit SEBI SCORES 2.0 Web Portal</Text>
                            </Text>
                            <Text style={styles.li}>• 
                                <Text style={styles.bold}>Two level review for complaint/grievance against Research Analyst:</Text>
                                <View style={styles.ul}>
                                    <Text style={styles.li}>• First review done by designated body (RAASB)</Text>
                                    <Text style={styles.li}>• Second review done by SEBI</Text>
                                </View>
                            </Text>
                            <Text style={styles.li}>• <Text style={styles.bold}>ii. Email to designated email ID of RAASB</Text></Text>
                        </View>
                    </View>

                    <Text style={styles.p}>
                        2. If the Investor is not satisfied with the resolution provided by the Market Participants, then the Investor has the option to file the complaint/ grievance on SMARTODR platform for its resolution through online conciliation or arbitration.
                    </Text>

                    <View style={styles.view}>
                        <Text style={styles.p}>With regard to physical complaints, investors may send their complaints to:</Text>
                        <View style={styles.view}><Text style={styles.p}>
                            Office of Investor Assistance and Education,

                            Securities and Exchange Board of India,

                            SEBI Bhavan, Plot No. C4-A, ‘G’ Block,

                            Bandra-Kurla Complex, Bandra (E), Mumbai - 400 051
                        </Text></View>
                    </View>
                </View>
            </View>

            <View style={styles.view}>
                <View style={styles.view}>
                    <View style={styles.view}><Text style={styles.p}> </Text></View>
                    <Text style={styles.h2}>E. Rights of investors</Text>
                </View>
                <View style={styles.ul}>
                    <Text style={styles.li}>• Right to Privacy and Confidentiality.</Text>
                    <Text style={styles.li}>• Right to Transparent Practices.</Text>
                    <Text style={styles.li}>• Right to fair and Equitable Treatment.</Text>
                    <Text style={styles.li}>• Right to Adequate Information.</Text>
                    <Text style={styles.li}>• Right to Initial and Continuing Disclosure -Right to receive information about all the statutory and regulatory disclosures.</Text>
                    <Text style={styles.li}>• Right to Fair & True Advertisement.</Text>
                    <Text style={styles.li}>• Right to Awareness about Service Parameters and Turnaround Times.</Text>
                    <Text style={styles.li}>• Right to be informed of the timelines for each service.</Text>
                    <Text style={styles.li}>• Right to be Heard and Satisfactory Grievance Redressal.</Text>
                    <Text style={styles.li}>• Right to have timely redressal.</Text>
                    <Text style={styles.li}>• Right to Exit from Financial product or service in accordance with the terms and conditions agreed with the research analyst.</Text>
                    <Text style={styles.li}>• Right to receive clear guidance and caution notice when dealing in Complex and High-Risk Financial Products and Services.</Text>
                    <Text style={styles.li}>• Additional Rights to vulnerable consumers - Right to get access to services in a suitable manner even if differently abled.</Text>
                    <Text style={styles.li}>• Right to provide feedback on the financial products and services used.</Text>
                    <Text style={styles.li}>• Right against coercive, unfair, and one-sided clauses in financial agreements</Text>
                </View>
            </View>

            <View style={styles.view}>
                <View style={styles.view}>
                    <View style={styles.view}><Text style={styles.p}> </Text></View>
                    <Text style={styles.h2}>F. Expectations from the investors (Responsibilities of investors).</Text>
                </View>
                
                <View style={styles.view}>
                    <View style={styles.view}>
                        <Text style={styles.h3}>
                             Do’s
                        </Text>
                        <View style={styles.ul}>
                            <Text style={styles.li}>• <Text style={styles.bold}>I.</Text> Always deal with SEBI registered Research Analyst.</Text>
                            <Text style={styles.li}>• <Text style={styles.bold}>II.</Text> Ensure that the Research Analyst has a valid registration certificate.</Text>
                            <Text style={styles.li}>• <Text style={styles.bold}>III.</Text> Check for SEBI registration number.</Text>
                            <Text style={styles.li}>• 
                                <Text style={styles.bold}>IV.</Text> Please refer to the list of all SEBI registered Research Analyst which is available on SEBI website in the following link: 
                                <Text style={styles.a}>View SEBI List of Registered Research Analysts</Text>
                                <Text>Always pay attention towards disclosures made in the research reports before investing.</Text>
                            </Text>
                            <Text style={styles.li}>• <Text style={styles.bold}>V.</Text> Pay your Research Analyst through banking channels only and maintain duly signed receipts mentioning the details of your payments. You may make payment of fees through Centralized Fee Collection Mechanism (CeFCoM) of RAASB if research analyst has opted for the mechanism. <Text>(Applicable for fee paying clients only)</Text></Text>
                            <Text style={styles.li}>• <Text style={styles.bold}>VI.</Text> Before buying/ selling securities or applying in public offer, check for the research recommendation provided by your Research Analyst.</Text>
                            <Text style={styles.li}>• <Text style={styles.bold}>VII.</Text> Ask all relevant questions and clear your doubts with your Research Analyst before acting on recommendation.</Text>
                            <Text style={styles.li}>• <Text style={styles.bold}>VIII.</Text> Seek clarifications and guidance on research recommendations from your Research Analyst, especially if it involves complex and high-risk financial products and services in form SEBI about Research Analyst offering assured or guaranteed returns.</Text>
                            <Text style={styles.li}>• <Text style={styles.bold}>IX.</Text> Always be aware that you have the right to stop availing the service of a Research Analyst as per the terms of service agreed between you and your Research Analyst.</Text>
                            <Text style={styles.li}>• <Text style={styles.bold}>X.</Text> Always be aware that you have the right to provide feedback to your Research Analyst in respect of the services received.</Text>
                            <Text style={styles.li}>• <Text style={styles.bold}>XI.</Text> Always be aware that you will not be bound by any clause, prescribed by the research analyst, which is contravening any regulatory provisions.</Text>
                            <Text style={styles.li}>• <Text style={styles.bold}>XII.</Text> Inform SEBI about Research Analyst offering assured or guaranteed returns.</Text>
                        </View>
                    </View>

                    <View style={styles.view}>
                        <Text style={styles.h3}>
                             Don’ts
                        </Text>
                        <View style={styles.ul}>
                            <Text style={styles.li}>• <Text style={styles.bold}>I.</Text> Do not provide funds for investment to the Research Analyst.</Text>
                            <Text style={styles.li}>• <Text style={styles.bold}>II.</Text> Don’t fall prey to luring advertisements or market rumors.</Text>
                            <Text style={styles.li}>• <Text style={styles.bold}>III.</Text> Do not get attracted to limited period discount or other incentive, gifts, etc. offered by Research Analyst.</Text>
                            <Text style={styles.li}>• <Text style={styles.bold}>IV.</Text> Do not share login credentials and password of your trading and demat accounts with the Research Analyst.</Text>
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

export default InvestorCharter;
