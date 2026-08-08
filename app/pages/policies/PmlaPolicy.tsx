import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppearance } from '@/context/AppearanceContext';

const PmlaPolicy = () => {
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
        <Text style={styles.headerTitle}>Pmla Policy</Text>
        <View style={styles.balanceView} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>

      <View style={styles.view}>
        


        
        
        <View style={styles.view}>
            <View style={styles.view}>
                
                <Text>Compliance & Legal</Text>
                <Text>/</Text>
                <Text>PMLA Policy</Text>
            </View>
            <View style={styles.view}>
                <Text>Ref: BSM-PMLA</Text>
                <Text>Version: 1.0</Text>
            </View>
        </View>

        
        <View style={styles.view}>
            <View style={styles.view}>
                <Text style={styles.h1}>POLICY AND GUIDELINES ON ANTI-MONEY LAUNDERING (AML)</Text>
                <Text style={styles.h2}>FOR RESEARCH ENTITY</Text>
                <Text style={styles.p}>Anujay Chouhan</Text>
                <Text style={styles.p}>PROPRIETOR OF Vishtara Capital Research</Text>
            </View>
            
            
            
        </View>

        
        <View style={styles.view}>
            <Text style={styles.h2}>INDEX</Text>
            <View style={styles.view}><Text style={styles.p}> </Text></View>
            
            
            
        </View>

        
        <View style={styles.view}>
            
            <Text style={styles.h2}>ABOUT Vishtara Capital Research</Text>
            <Text style={styles.p}>ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research is a SEBI registered Research Entity having registration number INH000027779.</Text>
            <Text style={styles.p}><Text style={styles.bold}>Registered office Address:</Text> C-20/1, Mahananda Nagar, Ujjain (M.P.), India.</Text>
            <Text style={styles.p}><Text style={styles.bold}>Contact No:</Text> +91 86020 27324</Text>
            <Text style={styles.p}><Text style={styles.bold}>Email Id:</Text> chouhananujay@gmail.com</Text>
            <Text style={styles.p}><Text style={styles.bold}>Compliance Officer:</Text> Anujay Chouhan</Text>
            <Text style={styles.p}><Text style={styles.bold}>Contact No:</Text> +91 86020 27324</Text>
            <Text style={styles.p}><Text style={styles.bold}>Email Id:</Text> chouhananujay@gmail.com</Text>
            <Text style={styles.p}><Text style={styles.bold}>Grievance Officer:</Text> Anujay Chouhan</Text>
            <Text style={styles.p}><Text style={styles.bold}>Contact No:</Text> +91 86020 27324</Text>
            <Text style={styles.p}><Text style={styles.bold}>Email Id:</Text> chouhananujay@gmail.com</Text>

            <Text style={styles.h2}>INTRODUCTION</Text>
            <Text style={styles.p}>The Prevention of Money Laundering Act, 2002 (PMLA) has been brought into force with effect from 1st July 2005. Necessary Notifications / Rules under the said Act have been published in the Gazette of India on 1st July 2005 by the Department of Revenue, Ministry of Finance, Government of India.</Text>
            <Text style={styles.p}>Under the recommendation made by the Financial Action Task Force on Anti Money Laundering standards, SEBI had issued the guidelines on Anti Money Laundering standards vide their notification no. SEBI/HO/MIRSD/ DOS3/CIR/P/2018/104 dated July 04, 2018, ISD/CIR/RR/AML/1/6 dated 18th January 2006, and vide letter no. ISD/CIR/RR/AML/2/6 dated 20th March 2006 had issued the obligation on Intermediaries registered under section 12 of the Securities and Exchange Board of India Act, 1992 (The Act). As per the SEBI guidelines, all Intermediaries have been advised to ensure that proper policy frameworks are put in place as per the guidelines on Anti Money Laundering standards notified by SEBI.</Text>
            <Text style={styles.p}>Vishtara Capital Research has formulated this policy of PMLA and effective AML program to prohibit and actively prevent the money laundering and any activity that facilitates money laundering or the funding of terrorist or criminal activities or flow of illegal money or hiding money to avoid paying taxes. Money Laundering can be defined as engaging in financial transactions that involve income derived from criminal activity, transactions designed to conceal the true origin of criminally derived proceeds and appears to have been received through legitimate sources/origins.</Text>
            
            
            
        </View>

        
        <View style={styles.view}>
            <Text style={styles.h2}>APPLICABILITY</Text>
            <Text style={styles.p}>APPLICABILITYThese policies and procedures apply to all employees, affiliates of the Vishtara Capital Research as per the statutory provisions and are to be read in conjunction with the existing guidelines. The following procedures have been established to ensure that all employees know the identity of their customers and take appropriate steps to combat money laundering incidents.</Text>

            <Text style={styles.h2}>OBJECTIVE</Text>
            <Text style={styles.p}>The objective of this policy framework is to</Text>
            <Text style={styles.p}>OBJECTIVEThe objective of this policy framework is to</Text>
            <View style={styles.ul}>
                <Text style={styles.li}>• Create awareness and provide clarity on KYC standards and AML measures</Text>
                <Text style={styles.li}>• To have a proper Customer Due Diligence (CDD) process before registering clients</Text>
                <Text style={styles.li}>• To monitor and maintain records of all cash transactions of the value of more than INR 10 lac</Text>
                <Text style={styles.li}>• To maintain records of all series of integrally connected cash transactions within one calendar month.</Text>
                <Text style={styles.li}>• To monitor and report suspicious transactions</Text>
                <Text style={styles.li}>• To discourage and identify money laundering or terrorist financing activities</Text>
                <Text style={styles.li}>• To take adequate and appropriate measures to follow the spirit of the PMLA</Text>
            </View>
            
            
            
        </View>

        
        <View style={styles.view}>
            <Text style={styles.h2}>PRINCIPAL OFFICER</Text>
            <Text style={styles.p}>Mr. Anujay Chouhan is the Principal Officer. She is responsible for overseeing the implementation of this Policy. Employees shall refer all matters concerning the issues covered by this Policy to the Principal Officer and shall act in accordance with her/his instructions on this behalf.</Text>
            <Text style={styles.p}>All submissions required to be made by Employees in terms of this Policy shall be addressed to the Principal Officer. The Principal Officer shall be responsible for maintaining and updating all records in accordance with this Policy or an applicable law/regulation.</Text>

            <Text style={styles.h2}>POLICY AND PROCEDURES TO COMBAT MONEY LAUNDERING AND TERRORIST FINANCING</Text>
            <Text style={styles.p}>ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research has resolved that it would, as an internal policy, take adequate measures to prevent money laundering and shall put in place a framework for identifying, monitoring, and reporting suspected money laundering or terrorist financing transactions to FIU as per the guidelines of PMLA Rules, 2002. Further, ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall regularly review the policies and procedures on PMLA and Terrorist Financing to ensure their effectiveness.</Text>

            <Text style={styles.h2}>IMPLEMENTATION OF THE POLICY</Text>
            <Text style={styles.p}>The Principal Officer to ensure overall compliance with the obligations imposed under the PML Act and the Rules. The Principal Officer will ensure the filing of necessary reports with the Financial Intelligence Unit (FIU - IND). The Principal Officer would act as a central reference point in facilitating onward reporting of suspicious transactions and playing an active role in the identification and assessment of potentially suspicious transactions.</Text>
            <Text style={styles.p}>The Principal Officer have to ensure overall compliance with the obligations imposed under the PML Act and the PML Rules</Text>

            <Text style={styles.h2}>ASPECTS OF THE POLICY</Text>
            <Text style={styles.p}>The Customer Due Diligence Process includes three specific parameters:</Text>
            <View style={styles.ul}>
                <Text style={styles.li}>• Policy for Acceptance of Clients</Text>
                <Text style={styles.li}>• Client Identification Procedure</Text>
                <Text style={styles.li}>• Suspicious Transactions identification & reporting</Text>
            </View>
            
            
            
        </View>

        
        <View style={styles.view}>
            <Text style={styles.p}>Obtaining sufficient information about the client in order to identify who is the actual beneficial owner of the securities or on whose behalf the transaction is conducted. The beneficial owner is the natural person or persons on whose behalf a transaction is being conducted. It also incorporates those persons who exercise ultimate effective control over a legal person or arrangement.</Text>
            <Text style={styles.p}>Verify the customer's identity using reliable, independent source documents, data, or information.</Text>
            <Text style={styles.p}>Conduct ongoing due diligence and scrutiny of the account/client to ensure that the transaction conducted are consistent with the client's background/financial status, its activities, and risk profile.</Text>

            <Text style={styles.h2}>CUSTOMER ACCEPTANCE POLICY</Text>
            <Text style={styles.p}>We will accept clients whom we are able verify their identity as per the government guidelines. Either the client should visit the office/branch or concerned official may visit the client at his residence /office to get the necessary documents filled in and signed. We may also use approved online modes/methods/Standard practices etc. to verify the identity and documents of the prospective clients.</Text>
            <Text style={styles.p}>In case of accounts are opened in the name of NRI. (If the ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research cannot personally verify the NRI Client), the ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research/ KYC team shall ensure the photocopies of all the KYC documents/ Proofs and PAN Card are attested by Indian Embassy or Consulate General in the country where the NRI resides or as per the prevailing guidelines for the same. The photocopies of the KYC documents and PAN Card should be sign by NRI. If the NRI comes in person to open the account, the above attestation is required may be waived.</Text>
            
            
            
        </View>

        
        <View style={styles.view}>
            <Text style={styles.p}>Detailed search to be carried out to find that the Client is not in defaulters / negative list of regulators. ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research obtain completes information from the client. It should be ensured that the initial forms taken by the clients are filled in completely. All photocopies submitted by the client are checked against original documents without any exception. Ensure that the 'Know Your Client' guidelines are followed without any exception. All supporting documents as specified by Securities and Exchange Board of India (SEBI) and Exchanges are obtained and verified.</Text>
            <Text style={styles.p}>We will not accept clients with identity matching persons known to have criminal background. We will check whether the client's identify matches with any person having known criminal background or is not banned in any other manner, whether in terms of criminal or civil proceedings by any enforcement/regulatory agency worldwide.</Text>
            <Text style={styles.p}>KYC team shall check following sites (not exhaustive) before admitting any person as client</Text>
            <View style={styles.ul}>
                <Text style={styles.li}>• https://www.fatf- gafi.org/en/home.html</Text>
                <Text style={styles.li}>• https://www.un.org/securitycouncil/content/un- sc- consolidated- list</Text>
                <Text style={styles.li}>• https://www.watchoutinvestors.com/default2a.asp</Text>
                <Text style={styles.li}>• Data available on SEBI and other relevant enforcement sites</Text>
                <Text style={styles.li}>• Any other database available at the prevailing time</Text>
            </View>

            <Text style={styles.h2}>CLIENTS OF SPECIAL CATEGORY</Text>
            <View style={styles.ul}>
                <Text style={styles.li}>• Non-Resident clients</Text>
                <Text style={styles.li}>• High net-worth clients (clients having an annual income of INR 25 Lac or more or having a Net worth of Rs.10 Crore or more)</Text>
                <Text style={styles.li}>• Trust, Charities, Non-Government Organizations (NGOs), and organizations receiving donations</Text>
                <Text style={styles.li}>• Companies having close family shareholdings or beneficial ownership</Text>
                <Text style={styles.li}>• Politically Exposed Persons (PEP). Politically exposed persons are individuals who are or have been entrusted with prominent public functions in a foreign country, e.g., Heads of States or of Governments, senior politicians, senior government/judicial/military officers, senior executives of state- owned corporations, important political party officials, applied to the accounts of the family members or close relatives of PEPs</Text>
                <Text style={styles.li}>• Companies offering foreign exchange</Text>
                <Text style={styles.li}>• Clients in high-risk countries (As per the latest data provided by the government) where the existence/effectiveness of money laundering controls is suspect, where there is unusual banking secrecy, countries active in narcotics production, Countries where corruption (as per Transparency International Corruption Perception Index) is highly prevalent, Countries against which government sanctions are applied, Countries reputed to be any of the following –Sponsors of international terrorism, Offshore financial centers, Tax havens, Countries where fraud is highly prevalent.</Text>
                <Text style={styles.li}>• Clients with dubious reputation as per public information available etc.</Text>
                <Text style={styles.li}>• Persons of foreign origin, companies having closed shareholding/ownership companies dealing in foreign currency, shell companies, overseas entities, clients in high-risk countries</Text>
            </View>
            
            
            
        </View>

        
        <View style={styles.view}>
            <Text style={styles.h2}>GUIDELINES ON IDENTIFICATION OF BENEFICIAL OWNERSHIP</Text>
            <Text style={styles.p}>For non- individual customers as part of the due diligence measures sufficient information must be obtained in order to identify persons who beneficially own or control securities account. Whenever it is apparent that the securities acquired or maintained through an account are beneficially owned by a party other than the client, that party should be identified and verified using client identification and verification procedures as early as possible. The beneficial owner is the natural person or persons who ultimately own, control, or influence a client and/or persons on whose behalf a transaction(s) is/are being conducted. It includes persons who exercise ultimate effective control over a legal person or arrangement.</Text>
            <Text style={styles.p}>Do not accept client registration forms that are suspected to be fictitious. Ensure that no account is being opened in a fictitious / Benami or on an anonymous basis.</Text>
            <Text style={styles.p}>Do not compromise on submission of mandatory information/ documents. The client's account should be opened only on receipt of mandatory information along with authentic supporting documents as per the regulatory guidelines. Do not open the accounts where the client refuses to provide information/documents and we should have sufficient reason to reject the client towards this reluctance.</Text>
            
            
            
        </View>

        
        <View style={styles.view}>
            <Text style={styles.h2}>CUSTOMER IDENTIFICATION PROCEDURE</Text>
            <Text style={styles.p}>To have a mechanism in place to establish the identity of the client along with firm proof of address to prevent the opening of any account which is fictitious / benami / anonymous in nature.</Text>

            <Text style={styles.h3}>(a) Documents that can be relied upon:</Text>
            <Text style={styles.p}><Text style={styles.bold}>PAN Card:</Text> PAN card is mandatory and is the most reliable document as only one card is issued to an individual and we can independently check its genuineness through the IT website.</Text>
            <Text style={styles.p}><Text style={styles.bold}>ADDRESS Proof:</Text> For valid address proof we can rely on a Voter's Identity Card, Passport, Bank Statement, Aadhaar Letter, Ration card, and latest Electricity/telephone bill in the name of the client.</Text>

            <Text style={styles.h3}>(b) Documents to be obtained as part of the customer identification procedure for new clients:</Text>
            <View style={styles.view}><Text style={styles.p}>*List is for illustration purpose. Actual need of documents will be dependent on the prevailing guidelines.</Text></View>
            
            
            
        </View>

        
        <View style={styles.view}>
            
            <View style={styles.table}>
                <View>
                    <View style={styles.tr}>
                        <View style={styles.th}><Text style={styles.thText}>Types of entity</Text></View>
                        <View style={styles.th}><Text style={styles.thText}>Documentary requirements</Text></View>
                    </View>
                </View>
                <View>
                    <View style={styles.tr}>
                        <View style={styles.td}><Text style={styles.tdText}>Corporate</Text></View>
                        <View style={styles.td}><Text style={styles.tdText}>
                            a. Copy of the balance sheets for the last 2 financial years (to be submitted every year).

                            b. Copy of latest share holding pattern including list of all those holding control, either directly or indirectly, in the company in terms of SEBI takeover Regulations, duly certified by the company secretary/Whole time director/MD (to be submitted every year).

                            c. Photograph, POI, POA, PAN and DIN numbers of whole time directors/two directors in charge of day-to-day operations.

                            d. Photograph, POI, POA, PAN of individual promoters holding control - either directly or indirectly.

                            e. Copies of the Memorandum and Articles of Association and certificate of incorporation.

                            f. Copy of the Board Resolution for investment in securities/commodities market.

                            Authorised signatories list with specimen signatures.
                        </Text></View>
                    </View>
                    <View style={styles.tr}>
                        <View style={styles.td}><Text style={styles.tdText}>Partnership</Text></View>
                        <View style={styles.td}><Text style={styles.tdText}>
                            a. Copy of the balance sheets for the last 2 financial years (to be submitted every year).

                            b. Certificate of registration (for registered partnership firms only)

                            c. Copy of partnership deed.

                            d. Authorised signatories list with specimen signatures.

                            Photograph, POI, POA, PAN of Partners.
                        </Text></View>
                    </View>
                    <View style={styles.tr}>
                        <View style={styles.td}><Text style={styles.tdText}>Trust</Text></View>
                        <View style={styles.td}><Text style={styles.tdText}>
                            a. Copy of the balance sheets for the last 2 financial years (to be submitted every year).

                            b. Certificate of registration (for registered trust only).

                            c. Copy of Trust deed.

                            d. List of trustees certified by managing trustees/CA.

                            g. Photograph, POI, POA, PAN of Trustees.
                        </Text></View>
                    </View>
                    <View style={styles.tr}>
                        <View style={styles.td}><Text style={styles.tdText}>HUF</Text></View>
                        <View style={styles.td}><Text style={styles.tdText}>
                            PAN of HUF.

                            Deed of declaration of HUF/ List of coparceners.

                            Bank pass-book/bank statement in the name of HUF.

                            e. Photograph, POI, POA, PAN of Karta.
                        </Text></View>
                    </View>
                    <View style={styles.tr}>
                        <View style={styles.td}><Text style={styles.tdText}>Banks/Institutional Investors</Text></View>
                        <View style={styles.td}><Text style={styles.tdText}>
                            Copy of the constitution/registration or annual report/balance sheet for the last 2 financial years.

                            Authorised signatories list with specimen signatures
                        </Text></View>
                    </View>
                    <View style={styles.tr}>
                        <View style={styles.td}><Text style={styles.tdText}>Foreign Institutional Investors</Text></View>
                        <View style={styles.td}><Text style={styles.tdText}>
                            Copy of SEBI registration certificate.

                            Authorised signatories list with specimen signatures.
                        </Text></View>
                    </View>
                    <View style={styles.tr}>
                        <View style={styles.td}><Text style={styles.tdText}>Army/Government Bodies</Text></View>
                        <View style={styles.td}><Text style={styles.tdText}>
                            Self-certification on letterhead.

                            Authorised signatories list with specimen signatures.
                        </Text></View>
                    </View>
                    <View style={styles.tr}>
                        <View style={styles.td}><Text style={styles.tdText}>Registered Society</Text></View>
                        <View style={styles.td}><Text style={styles.tdText}>
                            Copy of Registration Certificate under Societies Registration Act.

                            List of Managing Committee members.

                            Committee resolution for persons authorised to act as authorised signatories with specimen signatures.

                            True copy of Society Rules and Bye Laws certified by the Chairman/Secretary.
                        </Text></View>
                    </View>
                    <View style={styles.tr}>
                        <View style={styles.td}><Text style={styles.tdText}>NRI account - Repatriable/non-repatriable</Text></View>
                        <View style={styles.td}><Text style={styles.tdText}>
                            Copy of the PIS permission issued by the bank

                            Copy of the passport

                            Copy of PAN card

                            Proof of overseas address and Indian address

                            Copy of the bank statement

                            Copy of the demat statement

                            If the account is handled through a mandate holder, copy of the valid PoA/mandate.
                        </Text></View>
                    </View>
                </View>
            </View>
            <Text style={styles.p}>*List is for illustration purpose. Actual need of documents will be dependent on the prevailing guidelines.</Text>
            
            
            
        </View>

        
        <View style={styles.view}>
            
            <View style={styles.table}>
                <View>
                    <View style={styles.tr}>
                        <View style={styles.th}><Text style={styles.thText}>Types of entity</Text></View>
                        <View style={styles.th}><Text style={styles.thText}>Documentary requirements</Text></View>
                    </View>
                </View>
                <View>
                    <View style={styles.tr}>
                        <View style={styles.td}><Text style={styles.tdText}>Registered Society (continued)</Text></View>
                        <View style={styles.td}><Text style={styles.tdText}>
                            Proof of Existence/Constitution document.

                            Resolution of the managing body & Power of Attorney granted to transact business on its behalf.

                            Authorised signatories list with specimen signatures.
                        </Text></View>
                    </View>
                </View>
            </View>
            <Text style={styles.p}>\\*List is for illustration purpose. Actual need of documents will be dependent on the prevailing guidelines.</Text>
            
            
            
        </View>

        
        <View style={styles.view}>
            <Text style={styles.h2}>MONEY LAUNDERING RISK ASSESSMENTS</Text>
            <Text style={styles.p}>Risk assessment on money laundering is dependent on the kind of customers the RA deals with. Typically, risks are increased if the money launderer can hide behind corporate structures such as limited companies, offshore trusts, special purpose vehicles, and nominee arrangements etc. The Risk Assessment is required in order to assess and take effective measures to mitigate its money laundering and terrorist financing risk with respect to clients, countries or geographical areas, nature and volume of transactions, payment methods used by clients, etc. The risk assessment shall also take into account any country-specific information that is circulated by the government of India and SEBI from time to time, as well as, the updated list of individuals and entities who are subjected to sanction measures as required under the various United Nations Security Resolutions as well as various international organizations of repute.</Text>
            
            <Text style={styles.h3}>Risk classification</Text>
            <Text style={styles.p}>The level of Money Laundering risks that the Vishtara Capital Research is exposed to by an investor relationship depends on:</Text>
            <Text style={styles.p}>i. Type of the customer and nature of business
ii. Type of product/service availed by the customer
iii. Country where the Customer is domiciled</Text>
            <Text style={styles.p}>Based on the above criteria, the customers may be classified into three Money laundering relationships depends on:</Text>
            <View style={styles.ul}>
                <Text style={styles.li}>• High Risk</Text>
                <Text style={styles.li}>• Medium Risk</Text>
                <Text style={styles.li}>• Low risk</Text>
            </View>
            
            <Text style={styles.h3}>Risk Category</Text>
            <Text style={styles.p}>Indicative List of clients</Text>
            
            
            
        </View>

        
        <View style={styles.view}>
            <View style={styles.ul}>
                <Text style={styles.li}>• Non-Assisted Online clients</Text>
                <Text style={styles.li}>• Non-resident clients (NRI);</Text>
                <Text style={styles.li}>• High Net worth clients (HNI)</Text>
                <Text style={styles.li}>• Trust, Charities, NGOs, and organizations receiving donations.</Text>
                <Text style={styles.li}>• Companies having close family shareholdings or Beneficial Ownership.</Text>
                <Text style={styles.li}>• Politically Exposed Persons (PEP) of Foreign Origin</Text>
                <Text style={styles.li}>• Current /Former Head of State, Current or Former Senior High-profile politicians and connected persons (immediate family, close advisors, and companies in which such individuals have interest or significant influence);</Text>
                <Text style={styles.li}>• Companies offering Foreign Exchange</Text>
                <Text style={styles.li}>• Clients in high-risk countries (where the existence/effectiveness of money laundering controls is suspect, Countries reputed to be any of the following - sponsors of national terrorism, offshore financial centers, tax havens, countries where fraud is highly prevalent;</Text>
                <Text style={styles.li}>• Non-face-to-face clients;</Text>
                <Text style={styles.li}>• Clients with dubious reputation as per public information available etc.</Text>
            </View>
            
            <Text style={styles.p}>Medium Risk</Text>
            <Text style={styles.p}>Individual and non-individual clients falling under the definition of Speculators, Day Traders and all clients trading in Futures and Options segment, in case of a client where there is continuous margin shortfall, regular instances of cheque dishonored are categorized as medium risk clients</Text>
            
            
            
        </View>

        
        <View style={styles.view}>
            <Text style={styles.p}>Low Risk</Text>
            <Text style={styles.p}>Senior Citizens, Salaried Employees and a major portion of clients who indulge in delivery-based trading & clients who are not covered in the high & medium risk profile are Low- risk Profile client.</Text>
            <Text style={styles.p}>This list is indicative only, will be dependent on various other relevant factors at the time of evaluation. The risk profile also depends on the trading pattern, payment pattern, financial status, and background of the client. Vishtara Capital Research will put in place a system of periodical review of risk categorization of accounts and the need for applying enhanced due diligence measures in case of higher risk perception on a client High-Risk Clients, categorization should be carried out at least once in six months while for Medium and Low –Risk clients, categorization frequency should be once in a year.</Text>
            
            <Text style={styles.p}>The following safeguards are to be followed while accepting the clients:</Text>
            <View style={styles.ul}>
                <Text style={styles.li}>• The client account should not be opened in a fictitious / benami name or on an anonymous basis.</Text>
                <Text style={styles.li}>• Risk perception of the client needs to be defined having regard</Text>
                <Text style={styles.li}>• Client's location (registered office address, correspondence addresses and other addresses if applicable)</Text>
                <Text style={styles.li}>• Nature of business activity, tracing turnover etc.</Text>
                <Text style={styles.li}>• Manner of making payment for transactions undertaken</Text>
                <Text style={styles.li}>• Documentation like KYC, Broker-client agreement and Risk Disclosure Document, and other information from different category of clients prescribed by SEBI and any other regulatory authority to be collected depending on perceived risk and having regard to the requirement of the Prevention of Money Laundering Act, 2002, guidelines issued by RBI and SEBI from time to time.</Text>
            </View>
            
            
            
        </View>

        
        <View style={styles.view}>
            <View style={styles.ul}>
                <Text style={styles.li}>• Ensure that a client account is not opened where the organization is unable to apply appropriate client's due diligence measures / KYC policies. This may be applicable in cases where it is not possible to ascertain the identity of the client, information provided to the organization is suspected to be non- genuine, perceived, or non- co- operation of the client in providing full and complete information. Discontinue to do business with such a person and file a suspicious activity report. We can also evaluate whether there is suspicious trading in determining whether to freeze or close the account. Should be cautious to ensure that it does not return securities or money that may be from suspicious trades. However, we can consult the relevant authorities in determining what action should be taken when it suspects suspicious trading.</Text>
                <Text style={styles.li}>• ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research need to comply with adequate formalities when the client is permitted to act on behalf of another person/entity should be clearly specified the manner in which the account should be operated, transaction limits for the operation, additional authority required for transactions exceeding a specified quantity/value other appropriate detail. The rights and responsibilities of both the persons (i.e. the agent-client registered with Broker, as well as the person on whose behalf the agent is acting) should be clearly laid down.</Text>
                <Text style={styles.li}>• Adequate verification of a person's authority to act on behalf of the customer should be carried out.</Text>
                <Text style={styles.li}>• Necessary checks and balance to be put in place before opening an account so as to ensure that the identity of the client does not match with any person having a known criminal background or is not banned in any other manner, whether in terms of criminal or civil proceedings by any enforcement agency worldwide.</Text>
            </View>

            <Text style={styles.h2}>For new clients:</Text>
            <View style={styles.ul}>
                <Text style={styles.li}>• Each client may be met in person or through online verification as per regulatory guidelines, before accepting the KYC. The client may be met at the Registered Office or any of the branch offices as per mutual convenience of the client and ourselves.</Text>
                <Text style={styles.li}>• Verify the PAN details on the Income Tax website.</Text>
                <Text style={styles.li}>• All documentary proofs given by the client should be verified with original.</Text>
                <Text style={styles.li}>• Documents like the latest Income Tax returns, annual accounts, etc. should be obtained for ascertaining the financial status. If required, obtain additional information/documents from the client to ascertain his background and financial status.</Text>
                <Text style={styles.li}>• Obtain complete information about the client and ensure that the KYC documents are properly filled up, signed, and dated. Scrutinize the forms received at the branch office thoroughly before forwarding it toRO for account opening.</Text>
                <Text style={styles.li}>• Ensure that the details mentioned in the KYC match with the documentary proofs provided and with the general verification done by us.</Text>
                <Text style={styles.li}>• If the client does not provide the required information, then we should not open the account of such clients.</Text>
                <Text style={styles.li}>• As far as possible, a prospective client can be accepted only if introduced by ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research's existing client or associates or known entity etc.</Text>
            </View>
            
            
            
        </View>

        
        <View style={styles.view}>
            <Text style={styles.p}>In the case of walk-in clients, extra steps should be taken to ascertain the financial and general background of the client</Text>
            <View style={styles.ul}>
                <Text style={styles.li}>• If the account is opened by a POA/Mandate Holder, then we need to clearly ascertain the relationship of the POA/Mandate Holder with the client. Apply the KYC procedures to the POA/Mandate Holder also.</Text>
                <Text style={styles.li}>• ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research should not open any accounts in a fictitious / benami / anonymousbasis.</Text>
                <Text style={styles.li}>• ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research should not open accounts where we are unable to apply appropriate KYC procedures.</Text>
            </View>
            
            
            
        </View>

        
        <View style={styles.view}>
            <Text style={styles.h2}>For existing clients:</Text>
            <View style={styles.ul}>
                <Text style={styles.li}>• Keep updating the financial status of the client by obtaining the latest Income Tax Return, Net worth Certificate, Annual Accounts etc.</Text>
                <Text style={styles.li}>• Update the details of the client like address, contact number, Demat details, bank details, etc. In case, at any given point of time, we are notable to contact the client either at the address or on the phone number, contact the introducer, and try to find out alternative contact details.</Text>
                <Text style={styles.li}>• Check whether the client's identity matches with any person having known criminal background or is not banned in any other manner, whether in terms of criminal or civil proceedings by any local enforcement / regulatory agency. For scrutiny / back ground check of the clients/HNI, websites such as www.watchoutinvestors.com should be referred. Also, Prosecution Database / List of Vanishing Companies available on SEBI etc. and RBI Defaulters Database available onwww.cibil.com should be checked.</Text>
                <Text style={styles.li}>• Scrutinize minutely the records/documents pertaining to clients of special category (like Non-resident clients, High Net worth Clients, Trusts, Charities, NGOs, Companies having close family shareholding, Politically exposed persons, persons of foreign origin, Current/Former Head of State, Current/Former senior high profile politician, Companies offering foreign exchange offerings, etc.) or clients from high-risk countries (like Libya, Pakistan, Afghanistan, etc.) or clients belonging to countries where corruption /fraud is highly prevalent.</Text>
                <Text style={styles.li}>• Review the above details on a going basis to ensure that the transactions being conducted are consistent with our knowledge of customers, its business and risk profile, taking into account, where necessary, the customer's source of funds.</Text>
            </View>
            
            
            
        </View>

        
        <View style={styles.view}>
            <Text style={styles.h2}>Mandate Holder Policy</Text>
            <Text style={styles.p}>The primary objective of this policy is to ensure that we are aware of who is the ultimate beneficiary of the transaction and that the transactions executed, through the mandate holder are bona fide.</Text>
            <Text style={styles.p}>It is possible that some of the individual clients might appoint a mandate holder. Normally the trading account is opened in the name of various family members and one of the family members will hold the mandate. Also, in the case of some NRI clients who are based abroad, there may be a POA/Mandate in favor of a person residing in India.</Text>
            <Text style={styles.p}>Whenever any account is operated by a mandate holder, find out the relationship of the mandate holder with the client, followed by establishing the identity of the mandate holders by obtaining proof of identity and address.</Text>
            <Text style={styles.p}>Do not accept any payment from the account of the mandate holder in favor of the client. All the payments have to be received from the client's bank account only for which the POA holder may or may not have the mandate to operate the bank account. Similarly, pay- out cheques should be issued only in the name of the client and not in the name of the mandate holder.</Text>
            <Text style={styles.p}>In case there is suspicion on the relationship between the mandate holder and the actual client or in case the behavior of the mandate holder is suspicious, do take necessary advice from the Business Head.</Text>
            
            
            
        </View>

        
        <View style={styles.view}>
            <Text style={styles.h2}>Roles & Duties</Text>
            <Text style={styles.p}>The Sales Person/Relationship Manager/ Dealer/ Branch Manager/ Branch Coordinator/ Business Head/Marketing Manager etc. should meet the client in person or via legally acceptable online mode at least once before opening the account. In the process, he may reasonably verify the living standards, source of income, financial status, etc. of the client and ensure that the details mentioned in the CRF (Client Registration Form) matches with the actual status.</Text>
            <Text style={styles.p}>If the client is a 'walk- in client', then the concerned branch official should make independent verification about the background, identity and financial worthiness of the client.</Text>
            <Text style={styles.p}>All mandatory proofs of identity, address, and financial status of the client must be collected as prescribed by the regulatory authorities, from time to time. The proofs so collected should be verified with the originals. If the prospective clients refusing to provide any information do not forward his/ her account opening form to HO.</Text>
            
            
            
        </View>

        
        <View style={styles.view}>
            <Text style={styles.p}>IN PERSON VERIFICATION (IPV) can be done by the respective person or associate/affiliate/agent etc.</Text>
            <Text style={styles.p}>If the account is to be handled by a POA /mandate holder, then find out what is the relationship between the client and the POA/Mandate holder, establish the identity and background of the client and the POA/Mandate holder (by obtaining the required documents) and ensure that the POA/Mandate Holder has the proper authorization.</Text>
            <Text style={styles.p}>In case of a corporate account, the officials should ensure that the authorized person has got the required mandate by way of Board Resolution. Also, the identity and background of the authorized person has to be established by obtaining the required documents.</Text>
            <Text style={styles.p}>Foreign clients can deal in Indian market only to sell the shares allotted through ESOP or buy/sell as a 'foreign direct investment. We cannot deal for foreign clients under any other circumstances.</Text>

            <Text style={styles.h2}>MONITORING OF TRANSACTIONS</Text>
            <View style={styles.ul}>
                <Text style={styles.li}>• ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research regular monitors the transactions to identify any deviation in transactions/activity for ensuring the effectiveness of the AML procedures.</Text>
                <Text style={styles.li}>• ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall pay special attention to all unusually large transactions/patterns which appears to have no economic purpose.</Text>
                <Text style={styles.li}>• ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research may specify internal threshold limits for each class of client accounts on the basis of various plans and pay special attention to transactions which exceed these limits</Text>
                <Text style={styles.li}>• The background including all documents/office records /memorandums/clarifications sought pertaining to such transactions and purpose thereof shall also be examined carefully and findings shall be recorded in writing. Further such findings, records and related documents shall be made available to auditors and also to SEBI/stock exchanges/FIU- IND/other relevant Authorities, during audit, inspection, or as and when required. These records are required to be maintained and preserved for a period of five years from the date of transaction between the client and intermediary as is required under PMLA.</Text>
            </View>
            
            
            
        </View>

        
        <View style={styles.view}>
            <Text style={styles.h2}>CASH TRANSACTIONS</Text>
            <Text style={styles.p}>All are requested not to accept cash from the clients whether against obligations or as margin for purchase of securities or otherwise. All payments shall be received from the clients strictly by account payee crossed cheques drawn in favor of ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research. The same is also required as per SEBI circular no. SMD/ED/IR/3/23321 dated November 18, 1993 and SEBI/MRD/SE/Cir- 33/2003/27/08 dated August 27, 2003.</Text>
            <Text style={styles.p}>In case account payee cheques have been received from a bank account other than that captured in records the same can be accepted after ascertaining that the client is the first holder of the account. Only in exceptional cases, bank draft/pay- order may be accepted from the client provided identity of the remitter/purchaser written on the draft/pay- order matches with that of client else obtain a certificate from the issuing bank to verify the same.</Text>

            <Text style={styles.h2}>Reliance on a third party for carrying out Client Due Diligence(CDD)</Text>
            <Text style={styles.p}>ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research may rely on a third party for the purpose of</Text>
            <View style={styles.ul}>
                <Text style={styles.li}>• Identification and verification of the identity of a client and</Text>
                <Text style={styles.li}>• Determination of whether the client is acting on behalf of a beneficial owner, identification of the beneficial owner</Text>
                <Text style={styles.li}>• Verification of the identity of the beneficial owner.</Text>
            </View>
            
            
            
        </View>

        
        <View style={styles.view}>
            <Text style={styles.p}>Such third party shall be regulated, supervised or monitored for, and have measures in place for compliance with CDD and record- keeping requirements in line with the obligations under the PML Act. Such reliance shall be subject to the conditions that are specified in Rule 9 (2) of the PML Rules and shall be in accordance with the regulations and circulars/ guidelines issued by SEBI from time to time. Further, it is clarified that ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall be ultimately responsible for CDD and undertaking enhanced due diligence measures, as applicable.</Text>

            <Text style={styles.h2}>RECORD KEEPING</Text>
            <Text style={styles.p}>ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall ensure compliance with the record keeping requirements contained in the SEBI Act, 1992, Rules and Regulations made there- under, PMLA as well as other relevant legislation, Rules, Regulations, Exchange Bye- laws and Circulars.</Text>
            <Text style={styles.p}>More specifically, ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall put in place a system of maintaining proper record of transactions prescribed under Rule 3 of PML Rules as mentioned below:</Text>
            <View style={styles.ul}>
                <Text style={styles.li}>• all cash transactions of the value of more than ten lakh rupees or its equivalent in foreign currency;</Text>
                <Text style={styles.li}>• all series of cash transactions integrally connected to each other which have been individually valued below rupees ten lakh or its equivalent in foreign currency where such series of transactions have taken place within a month and the monthly aggregate exceeds an amount of ten lakh rupees or its equivalent in foreign currency</Text>
                <Text style={styles.li}>• all cash transactions where forged or counterfeit currency notes or banknotes have been used as genuine or where any forgery of a valuable security or a document has taken place facilitating the transactions;</Text>
                <Text style={styles.li}>• all suspicious transactions whether or not made in cash and by way of as mentined in the Rules.</Text>
            </View>
            
            
            
        </View>

        
        <View style={styles.view}>
            <Text style={styles.h2}>Retention of Records:</Text>
            <Text style={styles.p}>The following document retention terms should be observed:</Text>
            <View style={styles.ul}>
                <Text style={styles.li}>• All necessary records on transactions, both domestic and international, should be maintained at least for the minimum period of ten years (10) from the date of cessation of the transaction.</Text>
                <Text style={styles.li}>• Records on customer identification (e.g. copies or records of official identification documents like passports, identity cards, driving licenses, or similar documents), account files, books of account, and business correspondence should also be kept for ten years from the date of cessation of the transaction.</Text>
                <Text style={styles.li}>• Records shall be maintained in hard and soft copies.</Text>
                <Text style={styles.li}>• It should be ensured that there is continuity in dealing with the client as normal until told otherwise and the client should not be told of the report /suspicion. In exceptional circumstances, consent may not be given to continue to operate the account and transactions</Text>
                <Text style={styles.li}>• Records shall be maintained in hard and soft copies.</Text>
                <Text style={styles.li}>• ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall take appropriate steps to evolve an internal mechanism for proper maintenance and preservation of such records and information in a manner that allows easy and quick retrieval of data as and when requested by the competent authorities.</Text>
            </View>

            <Text style={styles.h2}>SUSPICIOUS TRANSACTIONS MONITORING AND REPORTING</Text>
            <Text style={styles.p}>ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research, on an ongoing basis, monitors the transactions executed by the client in order to ascertain whether the same is "suspicious" which should be reported to FIU, India. Followings are the Surveillance/ Alerts based on the client's transactions on NSE/BSE/DP and circumstances, which may be in the nature of suspicious transactions.</Text>
            
            
            
        </View>

        
        <View style={styles.view}>
            <Text style={styles.p}>Suspicious Transactions are those which:</Text>
            <View style={styles.ul}>
                <Text style={styles.li}>• gives rise to reasonable grounds of suspicion that it may involve proceeds of crime</Text>
                <Text style={styles.li}>• appears to be made in circumstances of unusual or unjustified complexity</Text>
                <Text style={styles.li}>• appears to have no economic rationale or bona fide purpose</Text>
            </View>

            <Text style={styles.h2}>Criteria for Ascertaining Suspicious Transactions</Text>
            <Text style={styles.p}>Whether a particular transaction is suspicious or not will depend upon the Client's details of the transactions/Identity/Receipt/ Payment pattern and other facts and circumstances.</Text>
            <View style={styles.ul}>
                <Text style={styles.li}>• Clients whose identity verification is difficult which includes non- cooperation of the client</Text>
                <Text style={styles.li}>• Clients belonging to (or) introduced by persons/entities in high- risk countries</Text>
                <Text style={styles.li}>• Increase in clients' business without justification and Turnover not commensurate with financials</Text>
                <Text style={styles.li}>• Unusual large cash deposits</Text>
                <Text style={styles.li}>• Overseas receipts/payments of funds with or without instructions to pay in cash transaction.</Text>
                <Text style={styles.li}>• Transfer of proceeds to unrelated parties</Text>
                <Text style={styles.li}>• Negotiated trades /Matched trades.</Text>
                <Text style={styles.li}>• Relation of the client with the ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research.</Text>
                <Text style={styles.li}>• Clients making huge and regular losses and are still placing trades/orders and further identifying the sources of funds in such cases.</Text>
            </View>
            
            
            
        </View>

        
        <View style={styles.view}>
            <View style={styles.ul}>
                <Text style={styles.li}>• Large volume in the proprietary account of Sub- Brokers/Affiliates/Dealer</Text>
                <Text style={styles.li}>• Asset management services for Clients where the source of the funds is not clear or not in Keeping with the Client's apparent standing/business activity;</Text>
                <Text style={styles.li}>• Clients based in high- risk jurisdictions;</Text>
                <Text style={styles.li}>• Unusual transactions are undertaken by "Client of the special category (CSCs)", i.e. offshore etc.</Text>
            </View>

            <Text style={styles.h2}>RECORDS OF THE INFORMATION REPORTED TO THE DIRECTOR, (FIU - IND)</Text>
            <Text style={styles.p}>ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall maintain and preserve the records of information related to transactions, whether attempted or executed, which are reported to the Director, FIU - IND, as required under Rules 7 and 8 of the PML Rules, for a period of five years from the date of the transaction between the client and ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research.</Text>

            <Text style={styles.h3}>i. List of Designated Individuals/ Entities</Text>
            <Text style={styles.p}>An updated list of individuals and entities which are subject to various sanction measures such as freezing of assets/accounts, denial of financial services etc., as approved by the Security Council Committee established pursuant to various United Nations' Security Council Resolutions (UNSCRs) can be accessed at its website.</Text>
            <Text style={styles.p}>ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research ensures that accounts are not opened in the name of anyone whose name appears in said list. ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall continuously scan all existing accounts to ensure that no account is being operated by a designated person. It shall also ensure that any account suspected to be of a designated person is reported to FIU-India.</Text>
            <Text style={styles.h3}>ii. Procedure for freezing of funds, financial assets or economic resources, or related services</Text>
            <Text style={styles.p}>Section 51A of the Unlawful Activities (Prevention) Act, 1967 (UAPA), relating to the purpose of prevention of money laundering, and coping with terrorist activities was brought into effect through UAPA Amendment Act, 2008. In this regard, the Central Government has issued an order dated August 27, 2009 detailing the procedure for the implementation of Section 51A of the UAPA. Also referring to notification no. SEBI/HO/MIRSD/DOP/CIR/P/2021/36 dated March 25, 2021 </Text>
            <Text style={styles.p}>Under the aforementioned section, the Central Government is empowered to freeze, seize or attach funds and other financial assets or economic resources held by, on behalf of, or at the direction of the individuals or entities listed in the Schedule to the Order, or any other person engaged in or suspected to be engaged in terrorism. The Government is also further empowered to prohibit any individual or entity from making any funds, financial assets or economic resources, or related services available for the benefit of the individuals or entities listed in the Schedule to the Order or any other person engaged in or suspected to be engaged in terrorism. </Text>
            <Text style={styles.p}>ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall ensure effective and expeditious implementation of the procedure laid down in the UAPA Order dated August 27, 2009, and order dated 2nd February ,  2021.</Text>
            
            
            
        </View>

        
        <View style={styles.view}>
            <Text style={styles.h2}>REPORTING TO FINANCIAL INTELLIGENCE UNIT-INDIA</Text>
            <View style={styles.view}>
                <Text style={styles.p}><Text style={styles.bold}>Address:</Text></Text>
                <Text style={styles.p}>Director, FIU-IND,</Text>
                <Text style={styles.p}>Financial Intelligence Unit-India, 6th Floor,</Text>
                <Text style={styles.p}>Hotel Samrat, Chanakyapuri, New Delhi-110021.</Text>
                <Text style={styles.p}>Website: https://fiuindia.gov.in/</Text>
            </View>
            <Text style={styles.p}>ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall carefully go through all the reporting requirements and formats that are available on the website of Financial Intelligence Unit–India under the Section Obligation of Reporting Entity – Furnishing Information – Reporting Format.</Text>
            <Text style={styles.p}>These documents contain detailed directives on the compilation and manner/procedure of submission of the reports to FIU-IND. The related hardware and technical requirements for preparing reports, the related data files, and data structures thereof are also detailed in these documents. While detailed instructions for filing all types of reports are given in the instructions part of the related formats.</Text>

            <Text style={styles.h2}>ADHERENCE</Text>
            <View style={styles.ul}>
                <Text style={styles.li}>• The Cash Transaction Report (CTR) (wherever applicable) for each month shall be submitted to FIU-IND by 15th of the succeeding month.</Text>
                <Text style={styles.li}>• The Suspicious Transaction Report (STR) shall be submitted within 7 days of arriving at a conclusion that any transaction, whether cash or non-cash, or a series of transactions integrally connected are of suspicious nature. The Principal Officer shall record his reasons for treating any transaction or a series of transactions as suspicious. It shall be ensured that there is no undue delay in arriving at such a conclusion.</Text>
                <Text style={styles.li}>• The Non-Profit Organization Transaction Reports (NTRs) for each month shall be submitted to FIU-IND by 15th of the succeeding month.</Text>
                <Text style={styles.li}>• The Principal Officer will be responsible for timely submission of CTR, STR and NTR to FIU-IND.</Text>
            </View>
            
            
            
        </View>

        
        <View style={styles.view}>
            <View style={styles.ul}>
                <Text style={styles.li}>• Utmost confidentiality shall be maintained in filing of CTR, STR and NTR to FIU- IND.</Text>
                <Text style={styles.li}>• No nil reporting needs to be made to FIU- IND in case there are no cash/suspicious/ non - profit organization transactions to be reported.</Text>
            </View>
            <Text style={styles.p}>ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall not put any restrictions on operations in the accounts where an STR has been made. ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research and officers and employees (permanent and temporary) shall be prohibited from disclosing ("tipping off") the fact that a STR or related information is being reported or provided to the FIU- IND. This prohibition on tipping off extends not only to the filing of the STR and/or related information but even before, during and after the submission of an STR. Thus, it shall be ensured that there is no tipping off to the client at any level. It is clarified that the ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research irrespective of the amount of transaction and/or the threshold limit envisaged for predicate offences specified in part B of Schedule of PMLA, 2002, shall file STR if ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research has reasonable grounds to believe that the transactions involve proceeds of crime.</Text>

            <Text style={styles.h2}>DESIGNATION OF OFFICERS FOR ENSURING COMPLIANCE WITH PROVISIONS OF PMLA</Text>
            <Text style={styles.h2}>Appointment of a Principal Officer:</Text>
            <Text style={styles.p}>To ensure that ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research properly discharges its legal obligations to report suspicious transactions to the authorities, the Principal Officer would act as a central reference point in facilitating onward reporting of suspicious transactions and for playing an active role in the identification and assessment of potentially suspicious transactions and shall have access to and be able to report to senior management at the next reporting level.</Text>
            
            
            
        </View>

        
        <View style={styles.view}>
            <Text style={styles.p}>Ms. Anujay Chouhan, is appointed as Principal Officer The details of his appointment have been intimated to the Financial Intelligence Unit, India (FIU - IND).</Text>
            <Text style={styles.p}>Names, designation, and addresses (including email addresses) of 'Principal Officer' including any changes therein shall also be intimated to the Office of the Director- FIU. As a matter of principle, the 'Principal Officer' will be in a sufficiently senior position and is able to discharge the functions with independence and authority.</Text>

            <Text style={styles.h2}>Employees' Hiring/Employee's Training/ Investor Education</Text>
            <Text style={styles.h3}>(a) Hiring of Employees</Text>
            <Text style={styles.p}>ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall have adequate screening procedures in place to ensure high standards when hiring employees. He shall identify the key positions within its own organizational structures having regard to the risk of money laundering and terrorist financing and the size of their business and ensure the employees taking up such key positions are suitable and competent to perform their duties.</Text>

            <Text style={styles.h3}>(b) Employees' Training</Text>
            <Text style={styles.p}>ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research has an ongoing employee training program so that the members of the staff are adequately trained in AML, Combating the Financing of Terrorism ('CFT') and other relevant procedures. Training requirements shall have specific focuses for frontline staff, back- office staff, compliance staff, risk management staff and staff dealing with new clients. It is crucial that all those concerned fully understand the rationale behind these directives, obligations, and requirements and implement them consistently and are sensitive to the risks of their systems being misused by unscrupulous elements. Regular AML/CFT training programs will be conducted for employees to ensure awareness of regulatory requirements and internal procedures. Training will include case studies and examples relevant to the securities market.</Text>
            
            
            
        </View>

        
        <View style={styles.view}>
            <Text style={styles.p}>SECURITIES MARKET.</Text>

            <Text style={styles.h2}>INVESTORS EDUCATION</Text>
            <Text style={styles.p}>Implementation of AML measures requires ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research to demand certain information from investors which may be of personal nature or has hitherto never been called for. Such information can include documents evidencing source of funds/income tax returns/bank records etc. This can sometimes lead to raising of questions by the client with regard to the motive and purpose of collecting such information. There is, therefore, a need for ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research to sensitize its clients about these requirements as the ones emanating from AML frameworks and Combating the Financing of Terrorism ('CFT'). ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall prepare specific literature/ pamphlets etc. so as to educate the client on the objectives of the AML program. The said literature/ pamphlets shall be displayed on the website.</Text>

            <Text style={styles.h2}>ADDITIONAL VALUES</Text>
            <Text style={styles.p}>ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall ensure the following:</Text>
            <View style={styles.ul}>
                <Text style={styles.li}>• ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall ensure that the content of these Directives is understood by all staff members</Text>
                <Text style={styles.li}>• ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research will regularly review the policies and procedures for the prevention of AML on an annual basis to ensure their effectiveness. Further, in order to ensure the effectiveness of policies and procedures, the person doing such a review shall be different from the one who has framed such policies and procedures.</Text>
                <Text style={styles.li}>• ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research will adopt client acceptance policies and procedures that are sensitive to the risk of AML</Text>
            </View>
            
            
            
        </View>

        
        <View style={styles.view}>
            <View style={styles.ul}>
                <Text style={styles.li}>• ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research will undertake client due diligence ("CDD") measures to an extent that is sensitive to the risk of AML depending on the type of client, business relationship, or transaction</Text>
                <Text style={styles.li}>• ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research have in system a place for identifying, monitoring, and reporting suspected ML or TF transactions to the law enforcement authorities; and</Text>
                <Text style={styles.li}>• ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research will develop staff members' awareness and vigilance to guard against ML and TF</Text>
                <Text style={styles.li}>• Risk-Based Approach-Clients will be classified into Low, Medium, and High- risk categories based on parameters such as nature of business, geographic location, type of products/services used, and transaction patterns. Enhanced Due Diligence (EDD) will be applied for high-risk clients, including Politically Exposed Persons (PEPs), non-resident clients from high-risk jurisdictions, and those engaging in complex or high-value transactions.</Text>
                <Text style={styles.li}>• Enhanced Due Diligence (EDD) - For high-risk clients, additional information will be collected and verified, including the source of funds/wealth, and transactions will be subject to enhanced monitoring. Periodic review frequency will be higher for such clients.</Text>
                <Text style={styles.li}>• Data Protection & Confidentiality- Research Analyst ensure secure storage of all KYC and transaction data, with access restricted to authorized personnel only. Data will be protected in compliance with applicable privacy laws.</Text>
            </View>
            
            
            
        </View>

        
        <View style={styles.view}>
            <Text style={styles.p}>This policy is reviewed and approved at the Board meeting held on the 01 day of November, 2025 at the registered office of the company.</Text>

            <Text style={styles.h2}>Designated Principal Officer - Anujay Chouhan</Text>
            <Text style={styles.p}>In compliance with SEBI guidelines and as per SEBI Master Circular dated June 06, 2024 Ms. Anujay Chouhan is appointed Principal Officer.</Text>
            <Text style={styles.p}>He will be responsible for implementing and enforcing the AML/CFT framework, monitoring transactions, and filing STRs with FIU- IND. In the case of any further information/clarification is required in this regard, the "Principal Officer" may be contacted.</Text>

            <View style={styles.view}>
                <Text style={styles.p}>For Vishtara Capital Research</Text>
                <Text style={styles.p}>Anujay Chouhan</Text>
                <Text style={styles.p}>Authorised Signatory</Text>
                <Text style={styles.p}>Date: 05/11/2025</Text>
            </View>
            
            
            
        </View>

        
        <View style={styles.view}>
            <View style={styles.view}>
                <View style={styles.view}>
                    <Text style={styles.p}>For any clarification regarding this policy, please contact:</Text>
                    <Text style={styles.p}><Text style={styles.bold}>Principal Officer:</Text> Anujay Chouhan</Text>
                    <Text style={styles.p}><Text style={styles.bold}>Email:</Text> chouhananujay@gmail.com</Text>
                    <Text style={styles.p}><Text style={styles.bold}>Phone:</Text> +91 86020 27324</Text>
                </View>
                <View style={styles.view}>
                    <Text style={styles.p}>Last Updated: November 05, 2025</Text>
                    <Text style={styles.p}>Version: 1.0 | Approved by Board</Text>
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

export default PmlaPolicy;
