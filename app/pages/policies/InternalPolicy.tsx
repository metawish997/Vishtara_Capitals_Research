import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppearance } from '@/context/AppearanceContext';

const InternalPolicy = () => {
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
        <Text style={styles.headerTitle}>Internal Policy</Text>
        <View style={styles.balanceView} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>

      <View style={styles.view}>
        <View style={styles.view}>
            <Text style={styles.h3}>INTERNAL POLICY & CONTROL PROCEDURE</Text>
            <Text style={styles.p}>
                Formulated in terms of SEBI (Research Analysts) Regulations, 2014 governing the dealing and trading frameworks by any active research analyst or associated entity.
            </Text>
            <View style={styles.view}>
                <View style={styles.view}>
                    <Text style={styles.bold}>Proprietor</Text>
                    <Text>Anujay Chouhan</Text>
                </View>
                <View style={styles.view}>
                    <Text style={styles.bold}>SEBI Reg No.</Text>
                    <Text>INH000027779</Text>
                </View>
                <View style={styles.view}>
                    <Text style={styles.bold}>Registered Address</Text>
                    <Text>H.no. C-20/1, Mahananda Nagar, Ujjain (M.P.), India</Text>
                </View>
            </View>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>1. INTRODUCTION</Text>
            <Text style={styles.p}>
                SEBI vide its Notification No. LAD-NRO/GN/2014-15/07/1414 dated 1st September, 2014 has notified SEBI (Research Analysts) Regulations, 2014. The Securities & Exchange Board of India (SEBI) had formulated the SEBI (Research Analyst) Regulations, 2014 under the powers conferred on it under the SEBI Act, 1992. These regulations came into force with effect from 1st December 2014. Research analyst is required to follow the code formulated by us both in letter and spirit.
            </Text>
            <Text style={styles.p}>
                These regulations have been introduced by SEBI with the objective of fostering transparency in security research and provide the investors with more reliable and useful information to make investment decisions.
            </Text>
            <Text style={styles.p}>
                According to the Regulation, Chapter III of the Regulation 15 of SEBI (Research Analysts) Regulations, 2014 the entity shall have written internal policies and control procedures governing the dealing and trading by any research analyst.
            </Text>
            <Text style={styles.p}>
                In compliance with the said Regulation ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research vide SEBI Research Analyst Registration No. INH000027779 (herein referred to as "RA" or "ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research" or "Vishtara Capital Research") has formulated this policy and control procedure.
            </Text>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>2. OBJECTIVE</Text>
            <View style={styles.ul}>
                <Text style={styles.li}>• To establish proper internal control and procedures and to govern the dealing and trading by any research analyst.</Text>
                <Text style={styles.li}>• To address actual or potential conflict of interest arising from such dealings or trading of securities of Subject RA and promoting objective and reliable research that reflects the unbiased view of research analyst.</Text>
                <Text style={styles.li}>• Preventing the use of research report or research analysis to manipulate the securities market.</Text>
                <Text style={styles.li}>• To implement appropriate mechanisms to ensure independence of its research activities from its other business activities.</Text>
                <Text style={styles.li}>• To ensure compliance with SEBI rules and regulations, we being the Research Analyst registered under SEBI, is required to adopt and adhere such Research Analyst Regulation, subject to the following policies and procedures.</Text>
                <Text style={styles.li}>• It is mandatory in terms of the Regulations for every Research Analyst to formulate a Code of Conduct. In order to comply with the mandatory requirements of the Regulations, it was necessary to formulate a specific Code of Conduct.</Text>
                <Text style={styles.li}>• Our policy is only to publish research report which is impartial, independent, clear, fair and not misleading. Such research may be produced and published only by the analysts working with the ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research and as per the regulations.</Text>
            </View>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>3. APPLICABILITY</Text>
            <Text style={styles.p}>
                This policy is applicable to all research analysts and associates, if any of the Vishtara Capital Research Research Analyst, primarily responsible for preparation or publication of the content of the research report; or providing a research report or Making 'buy/sell/hold' recommendation or giving price target or offering an opinion concerning public offer with respect to securities that are listed or to be listed in a Stock Exchange whether or not such person has the job title of 'Research Analyst'.
            </Text>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>4. DEFINITIONS</Text>
            <View style={styles.view}>
                <Text style={styles.p}><Text style={styles.bold}>"Act"</Text> means the Securities and Exchange Board of India Act, 1992 (15 of 1992);</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Asset management company"</Text> means a company as defined under clause(d) of Regulation 2 of Securities and Exchange Board of India (Mutual Funds) Regulations, 1996;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"associate"</Text> means an associate as defined in Securities and Exchange Board of India (Intermediaries) Regulations, 2008;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Board"</Text> means the Securities and Exchange Board of India established under section 3 of the Act;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"certificate"</Text> means a certificate of registration granted under these regulations;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Change in control"</Text> -

                    (i) in case of a body corporate -

                    (A) if its shares are listed on any recognised stock exchange, shall be construed with reference to the definition of control in terms of regulations framed under clause (h) of sub-section (2) of section 11 of the Act;

                    (B) if its shares are not listed on any recognised stock exchange, shall be construed with reference to the definition of control as provided in sub-section (27) of Section 2 of the Companies Act, 2013 (18 of 2013);

                    (ii) in a case other than that of a body corporate, shall be construed as any change in its legal formation or ownership or change in controlling interest.

                    <Text style={[styles.p, {fontStyle: "italic"}]}>Explanation: For the purpose of sub-clause (ii), the expression "controlling interest" means an interest, direct or indirect, to the extent of not less than fifty percent of voting rights or interest;</Text>
                </Text>
                <Text style={styles.p}><Text style={styles.bold}>"consideration"</Text> means any form of economic benefit including non-cash benefit, received or receivable, directly or indirectly, in any form whether from client or otherwise for providing research services;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Family of an individual research analyst"</Text> shall include individual research analyst, spouse, children and parents;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Family of client"</Text> shall include individual client, dependent spouse, dependent children and dependent parents;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Fund manager"</Text> includes fund managers of a mutual fund or alternative investment fund or venture capital fund or portfolio manager;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Independent research analyst"</Text> means a person whose only business activity is research analysis or preparation and/or publication of research report;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Inspecting authority"</Text> means any one or more persons appointed by the Board to exercise powers conferred under regulation 27;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Research Analyst"</Text> means any person registered under Securities and Exchange Board of India (Research Analyst) Regulations, 2014;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Merchant banking or investment banking or brokerage services"</Text> includes, -

                    i. acting as an underwriter; ii. participating in a selling or an offering for the issuer or otherwise acting in furtherance of a public offer of the issuer; iii. acting as an adviser in a merger or acquisition; iv. providing or arranging venture capital or equity or debt; v. serving as placement agent for the issuer or otherwise acting in furtherance of a private offering of the issuer; vi. offering brokerage or market making services;
                </Text>
                <Text style={styles.p}><Text style={styles.bold}>"NBFC"</Text> means a Non-Banking Financial Company registered by Reserve Bank of India;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"NISM"</Text> means the National Institute of Securities Market established by the Board;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Non-individual"</Text> means a body corporate including a limited liability partnership and a partnership firm;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Other business activity or employment"</Text> means such business activity or employment which is not related to securities and: a. it does not involve handling or managing of money or funds of client or person; or b. it is not related to providing advice or recommendation to any client or person in respect of any products or assets for investment purposes;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Part-time research analyst"</Text> means an individual or a partnership firm who for consideration, is engaged in the business of providing research services and is also engaged in any other business activity or employment;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Persons associated with research services"</Text> shall mean any member, partner, officer, director or employee or any other staff of such research analyst or research entity including any person occupying a similar status or performing a similar function irrespective of the nature of association with the research analyst or research entity who is engaged in providing research services to the clients or other persons or group of persons or general public.

                    <Text style={[styles.p, {fontStyle: "italic"}]}>Explanation: All client and public facing persons such as analysts, sales staff, service relationship managers, client relationship managers, etc., by whatever name called, shall be deemed to be persons associated with research services, but shall not include persons who discharge clerical or office administrative functions where there is no connection with research services and they have no client contact;</Text>
                </Text>
                <Text style={styles.p}><Text style={styles.bold}>"Price target"</Text> means expectations of research analyst on the future performance of specific securities;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Principal officer"</Text> in case of non-individual research analyst engaged -

                    (i) Solely in providing research services, shall mean the managing director or designated director or managing partner or executive chairman of the board or equivalent management body who is responsible for the overall function of the business and operations of non-individual research analyst;

                    (ii) In activities other than research services through separate departments/divisions, may be the person at the management level who is a business head or unit head, responsible for the overall function of the business and operations related to research services:

                    Provided that in case of non-individual research analyst being a partnership firm one of the partners shall be designated as its principal officer:

                    Provided further that where no partner of firm registered as a research analyst has minimum qualification and certification requirements provided in these regulations, it shall apply for registration as a research analyst in the form of a limited liability partnership or a body corporate within such time as may be specified by the Board.

                    <Text style={[styles.p, {fontStyle: "italic"}]}>Explanation: The provisions of sub clause (i) shall also be applicable to the principal officer of a non-individual entity registered both as a research analyst and an investment adviser but engaged in no other business activity.</Text>
                </Text>
                <Text style={styles.p}><Text style={styles.bold}>"Proxy adviser"</Text> means any person who provide advice, through any means, to institutional investor or shareholder of a company, in relation to exercise of their rights in the company including recommendations on public offer or voting recommendation on agenda items;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Public appearance"</Text> means any participation in a conference call, seminar, forum (including interactive and non-interactive electronic forum), radio or television or internet or web or print media broadcast, authoring a print media article or other public speaking activity in public media in which a research analyst makes a recommendation or offers an opinion, concerning securities or public offer:

                    Provided that it does not include a password protected webcast, conference call or such other events with the clients, if all of the event participants previously received the research report or other documentation that contains the required applicable disclosures and that the research analyst appearing at the event corrects and updates during the public appearance any disclosures in the research report that are inaccurate, misleading or no longer applicable;
                </Text>
                <Text style={styles.p}><Text style={styles.bold}>"Public media"</Text> means any media source available to the general public and includes a radio, television, internet, web or print media;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Public offer"</Text> includes initial public offer, further public offer, offer for sale, disinvestment, takeover, buy-back or delisting of securities;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Relative"</Text> means a person as defined in sub section (77) of section 2 of the Companies Act, 2013 and who is financially dependent on independent research analyst or part-time research analyst or individual research analyst employed by research entity;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Research analyst"</Text> means a person who, for consideration, is engaged in the business of providing research services and includes a part-time research analyst;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Research entity"</Text> means an intermediary registered with Board who is also engaged in merchant banking or investment banking or brokerage services or underwriting services and issue research report or research analysis in its own name through the individuals employed by it as research analyst and includes any other intermediary engaged in issuance of research report or research analysis;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Research report"</Text> means any written or electronic communication that includes research analysis or research recommendation or an opinion concerning securities or public offer, providing a basis for investment decision and does not include the following communications: (i) comments on general trends in the securities market; (ii) discussions on the broad-based indices; (iii) commentaries on economic, political or market conditions; (iv) periodic reports or other communications prepared for unit holders of mutual fund or alternative investment fund or clients of portfolio managers and investment advisers; (v) internal communications that are not given to current or prospective clients; (vi) communications that constitute offer documents or prospectus that are circulated as per regulations made by the Board; (vii) statistical summaries of financial data of the companies; (viii) technical analysis relating to the demand and supply in a sector or the index; (ix) any other communication which the Board may specify from time to time;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Research services"</Text> means the following services provided by research analyst: (i) preparation or publication of the research report or content of the research report; or (ii) providing or issuing research report or research analysis; or (iii) making 'buy/sell/hold' recommendation; or (iv) giving price target or stop loss target; or (v) offering an opinion concerning public offer, or (vi) recommending model portfolio; or (vii) providing trading calls; or (viii) any other service of similar nature or character, with respect to securities that are listed or proposed to be listed in a stock exchange, whether or not any such person has the job title of 'research analyst' to the clients or their persons or group of persons or general public;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Securities"</Text> means securities as defined in clause (h) of section 2 of the Securities Contracts (Regulation) Act, 1956;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Significant news or event"</Text> means any news or event which is expected to have a material impact on, or that reflects a material change to, the subject company's earnings, operations or financial condition, other than unpublished price sensitive information, as specified in the internal policies and procedures of the research analyst or research entity;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Subject company"</Text> means the company whose securities are the subject of a research report or a public appearance;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Stock exchange"</Text> means a stock exchange recognised under section 4 of the Securities Contracts (Regulation) Act, 1956 (42 of 1956);</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Third party research report"</Text> means a research report produced by a person or entity other than the research analyst or research entity;</Text>
                <Text style={styles.p}><Text style={styles.bold}>"Trading calls"</Text> means intraday, ultra short duration, non-delivery based (other than hedging) recommendation or any recommendation related to securities that are not personalized or investor specific.</Text>
            </View>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>5. MANAGEMENT OF CONFLICT OF INTERESTS</Text>
            <Text style={styles.p}>
                The Research Analyst shall maintain arms-length relationship between its research activity and other activities.
            </Text>
            <View style={styles.view}>
                <Text style={styles.h3}>Chinese Wall Policy Compliance</Text>
                <Text style={styles.p}>
                    To prevent the misuse of information from Research Analysts the ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research has adopted a 'Chinese Wall' policy which separates the research activities from its other business activities. The Employees working as Research Analysts shall not communicate any information to anyone in other department. The employees in Research Analysts are physically segregated from employees of other departments. Demarcations of the Research Analysts departments are implemented by the Company.
                </Text>
            </View>
            <Text style={styles.p}>
                The Research Analyst are responsible for addressing actual or potential conflicts of interest arising from such dealings or trading of securities of the subject company, promoting objective and reliable research that reflects the unbiased view of the research analyst, and preventing the use of research reports or research analysis to manipulate the securities market.
            </Text>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>6. LIMITATIONS ON TRADING BY RESEARCH ANALYSTS</Text>
            <View style={styles.ul}>
                <Text style={styles.li}>• (a) Personal trading activities of the individuals employed as research analysts shall be monitored, recorded and wherever necessary, shall be subject to a formal approval process.</Text>
                <Text style={styles.li}>• (b) Research analyst shall not deal or trade any securities that the research analyst recommends or follows within 30 days before and 5 days after the publication of a research report on the subject company.</Text>
                <Text style={styles.li}>• (c) Research analyst shall not deal or trade directly or indirectly any securities that he reviews in a manner contrary to his outstanding recommendation, etc.</Text>
                <Text style={styles.li}>• (d) Purchase or receive securities of the issuer before the issuer's initial public offering, if the issuer is principally engaged in the same types of business as companies that the research analyst follows or recommends. However, the above restrictions to trade/ deal in securities shall not be applicable in case of significant news or event concerning the subject company or based upon an unanticipated significant change in the personal financial circumstances of the research analyst, subject to prior written approval from Compliance Officer.</Text>
            </View>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>7. LIMITATION ON PUBLICATION OF RESEARCH REPORT</Text>
            <Text style={styles.p}>
                (a) Research analyst shall not publish or distribute research report or research analysis or make public appearance regarding a subject RA at any time falling within a period of:
            </Text>
            <View style={styles.ul}>
                <Text style={styles.li}>• (i) Forty days immediately following the day on which the securities are priced if the offering is an initial public offering; or</Text>
                <Text style={styles.li}>• (ii) Ten days immediately following the day on which the securities are priced if the offering is a further public offering.</Text>
            </View>
            <Text style={styles.p}>
                Provided that research analyst may publish or distribute research report or research analysis or make public appearance within such forty day and ten-day periods, subject to prior written approval of legal or compliance personnel as specified in the internal policies and procedures.
            </Text>
            <View style={styles.view}>
                <Text style={styles.p}>(b) Research analyst or research entity who has acted as a manager or co-manager of public offering of securities of a company shall not publish or distribute a research report or make a public appearance concerning that company within fifteen days prior to date of entering into and fifteen days after the expiration/waiver/termination of a lock-up agreement or any other agreement that the research analyst or research entity has entered into with a subject company that restricts or prohibits the sale of securities held by the subject company after the completion of public offering of securities.</Text>
                <Text style={styles.p}>(c) Research analyst or individuals employed as research analyst by research entity shall not participate in business activities designed to solicit investment banking or merchant banking or brokerage services business, such as sales pitches and deal road shows.</Text>
                <Text style={styles.p}>(d) Research analyst or individuals employed as research analyst by research entity shall not engage in any communication with a current or prospective client in the presence of personnel from investment banking or merchant banking or brokerage services divisions or company management about an investment banking services transaction.</Text>
                <Text style={styles.p}>(e) Investment banking or merchant banking or brokerage services division's personnel of research entity shall not direct the individuals employed as research analyst to engage in sales or marketing related to an investment banking or merchant banking or brokerage services and shall not direct the research analyst to engage in any communication with a current or prospective client about such division's transaction.</Text>
                <Text style={styles.p}>(f) Research analyst or research entity shall have adequate documentary basis, supported by research, for preparing a research report.</Text>
                <Text style={styles.p}>(g) Research analyst or research entity shall not provide any promise or assurance of favourable review in its research report to a company or industry or sector or group of companies or business group as consideration to commence or influence a business relationship or for the receipt of compensation or other benefits.</Text>
                <Text style={styles.p}>(h) Research analyst or research entity shall not issue a research report that is not consistent with the views of the individuals employed as research analyst regarding a subject company.</Text>
                <Text style={styles.p}>(i) Research entity shall ensure that the individuals employed as research analyst are separate from other employees who are performing sales trading, dealing, corporate finance advisory or any other activity that may affect the independence of its research report.</Text>
            </View>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>8. DISCLOSURES IN RESEARCH REPORTS</Text>
            <Text style={styles.p}>
                A research analyst shall disclose all material information about itself including its business activity, disciplinary history, the terms and conditions on which it offers research report, details of associates and such other information as is necessary to take an investment decision, including the following:
            </Text>
            <View style={styles.view}>
                <Text style={styles.h3}>(i) Ownership and Material Conflicts of Interest:</Text>
                <Text style={styles.p}>(a) Whether the research analyst or his associate or his relative has any financial interest in the subject company and the nature of such financial interest.</Text>
                <Text style={styles.p}>(b) Whether the research analyst or its associates or relatives, have actual/beneficial ownership of one per cent or more securities of the subject company.</Text>
                <Text style={styles.p}>(c) Whether the research analyst or his associate or his relative, has any other material conflict of interest at the time of publication.</Text>

                <Text style={styles.h3}>(ii) With Regard to Receipt of Compensation:</Text>
                <Text style={styles.p}>(a) Whether it or its associates have received any compensation from the subject company in the past twelve months.</Text>
                <Text style={styles.p}>(b) Whether it or its associates have managed or co-managed public offering of securities for the subject company in the past twelve months.</Text>
                <Text style={styles.p}>(c) Whether it or its associates have received any compensation for investment banking or merchant banking or brokerage services from the subject company in the past twelve months.</Text>
                <Text style={styles.p}>(d) Whether it or its associates have received any compensation for products or services other than investment banking or merchant banking or brokerage services from the subject company in the past twelve months.</Text>
                <Text style={styles.p}>(e) Whether it or its associates have received any compensation or other benefits from the subject company or third party in connection with the research report.</Text>

                <Text style={styles.h3}>(iii) With Regard to Receipt of Compensation (Public Appearance Context):</Text>
                <Text style={styles.p}>(a) whether it or its associates have received any compensation from the subject company in the past twelve months;</Text>
                <Text style={styles.p}>(b) whether the subject company is or was a client during twelve months preceding the date of distribution of the research report and the types of services provided:</Text>
                <Text style={styles.p}>Provided that research analyst shall not be required to make a disclosure as per sub-clauses (c), (d) and (e) of clause (ii) or sub-clauses (a) and (b) of clause (iii) to the extent such disclosure would reveal material non-public information regarding specific potential future investment banking or merchant banking or brokerage services transactions of the subject company.</Text>

                <Text style={styles.p}><Text style={styles.bold}>(iv)</Text> whether the research analyst has served as an officer, director or employee of the subject company;</Text>
                <Text style={styles.p}><Text style={styles.bold}>(v)</Text> whether the research analyst has been engaged in market making activity for the subject company;</Text>
                <Text style={styles.p}><Text style={styles.bold}>(vi)</Text> Research analyst shall provide all other disclosures in research report and public appearance as specified by the Board under any other regulations.</Text>
            </View>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>9. CONTENTS OF RESEARCH REPORT</Text>
            <Text style={styles.p}>
                Research analyst shall take steps to ensure that facts in its research reports are based on reliable information and shall define the terms used in making recommendations, and these terms shall be consistently used.
            </Text>
            <Text style={styles.p}>
                Research analyst that employs a rating system must clearly define the meaning of each such rating including the time horizon and benchmarks on which a rating is based.
            </Text>
            <Text style={styles.p}>
                If a research report contains either a rating or price target for subject company's securities and the research analyst or research entity has assigned a rating or price target to the securities for at least one year, such research report shall also provide the graph of daily closing price of such securities for the period assigned or for a three-year period, whichever is shorter.
            </Text>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>10. RECOMMENDATIONS IN PUBLIC MEDIA</Text>
            <Text style={styles.p}>
                Research analyst including its employee shall disclose the registration status and details of financial interest in the subject RA, if he makes public appearance.
            </Text>
            <Text style={styles.p}>
                If any person including its employee, makes public appearance or makes a recommendation or offers an opinion concerning securities or public offers through public media, all the provisions of regulations 16 and 17 shall apply mutatis mutandis to him and he shall disclose his name, registration status and details of financial interest in the subject RA at the time of,-
            </Text>
            <View style={styles.ul}>
                <Text style={styles.li}>• (i) making such recommendation or offering such opinion in personal capacity;</Text>
                <Text style={styles.li}>• (ii) responding to queries from audiences or journalists in personal capacity;</Text>
                <Text style={styles.li}>• (iii) communicating the research report or substance of the research report through the public media.</Text>
            </View>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>11. DISTRIBUTION OF RESEARCH REPORTS</Text>
            <Text style={styles.p}>
                A research report shall not be made available selectively to internal trading personnel or a particular client or class of clients in advance of other clients who are entitled to receive the research report.
            </Text>
            <Text style={styles.p}>
                Research analyst who distributes any third party research report shall review the third party research report for any untrue statement of material fact or any false or misleading information.
            </Text>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>12. MAINTENANCE OF RECORDS</Text>
            <Text style={styles.p}>
                Research analyst or research entity shall maintain the following records:
            </Text>
            <View style={styles.ul}>
                <Text style={styles.li}>• Research report duly signed and dated;</Text>
                <Text style={styles.li}>• Research recommendation provided and Rationale for arriving at research recommendation;</Text>
                <Text style={styles.li}>• Record of public appearance;</Text>
                <Text style={styles.li}>• Know Your Client records of the fee-paying client;</Text>
                <Text style={styles.li}>• Register or record containing list of the clients along with client's PAN, the date and nature of the research service, details of the products/securities;</Text>
                <Text style={styles.li}>• Records of communication including emails, call recordings etc. with all clients.</Text>
            </View>
            <Text style={styles.p}>
                All records shall be maintained either in physical or electronic form and preserved for a minimum period of five years.
            </Text>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>13. AUDIT</Text>
            <Text style={styles.p}>
                Research analyst shall conduct annual audit in respect of compliance with these regulations from a member of Institute of Chartered Accountants of India or Institute of Company Secretaries of India.
            </Text>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>14. APPOINTMENT OF COMPLIANCE OFFICER</Text>
            <Text style={styles.p}>
                Research analyst shall appoint a compliance officer who shall be responsible for monitoring the compliance of the provisions of the Act, these regulations and circulars issued by the Board.
            </Text>
            <Text style={styles.p}>
                The Compliance Officer shall maintain a record for the purpose of adherence to the Code of Conduct and assist all the analysts in addressing any clarifications regarding the Regulations.
            </Text>
            <Text style={styles.p}>
                In order to discharge his functions effectively, the Compliance Officer shall be adequately empowered and provided with adequate infrastructure to effectively discharge his function.
            </Text>
            <Text style={styles.p}>
                The Compliance Officer shall act as the focal point for dealings with SEBI in connection with all matters relating to the compliance and effective implementation of the Regulations and this Policy.
            </Text>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>15. REDRESSAL OF INVESTOR GRIEVANCES</Text>
            <Text style={styles.p}>
                The Research Analyst shall redress investor grievances promptly but not later than twenty-one calendar days from the date of receipt of the grievance and in such manner as may be specified by the Board.
            </Text>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>16. GENERAL RESPONSIBILITY</Text>
            <View style={styles.ul}>
                <Text style={styles.li}>• Research analyst shall maintain an arms-length relationship between its research activity and other activities.</Text>
                <Text style={styles.li}>• Research analyst shall abide by Code of Conduct as specified in Third Schedule.</Text>
                <Text style={styles.li}>• In case of change in control of the research analyst or research entity, prior approval from the Board shall be taken.</Text>
            </View>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>17. OBLIGATIONS FOR ANALYSTS IN GLANCE</Text>
            <View style={styles.ul}>
                <Text style={styles.li}>• Analysts are required to observe high standards of integrity and ethical behaviour.</Text>
                <Text style={styles.li}>• All research reports must be based on strict standards of truthfulness and fair dealing, and must be presented in a manner such that they are fair, clear and not misleading.</Text>
                <Text style={styles.li}>• Analysts shall not deal or trade directly or indirectly in securities that he reviews in a manner contrary to his given recommendation.</Text>
                <Text style={styles.li}>• Analysts are required to obtain NISM certification and keep relevant NISM active all the times.</Text>
            </View>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>18. CODE OF CONDUCT</Text>
            <View style={styles.view}>
                <Text style={styles.p}><Text style={styles.bold}>a) Honesty and Good Faith:</Text> Research analyst or research entity shall act honestly and in good faith.</Text>
                <Text style={styles.p}><Text style={styles.bold}>b) Diligence:</Text> Research analyst or research entity shall act with due skill, care and diligence and shall ensure that the research report is prepared after thorough analysis.</Text>
                <Text style={styles.p}><Text style={styles.bold}>c) Conflict of Interest:</Text> Research analyst or research entity shall effectively address conflict of interest which may affect the impartiality of its research analysis.</Text>
                <Text style={styles.p}><Text style={styles.bold}>d) Insider Trading:</Text> Research analyst or research entity or its employees shall not engage in insider trading or front running.</Text>
                <Text style={styles.p}><Text style={styles.bold}>e) Confidentiality:</Text> Research analyst or research entity or its employees shall maintain confidentiality of report till the report is made public.</Text>
                <Text style={styles.p}><Text style={styles.bold}>f) Compliance:</Text> Research analyst or research entity shall comply with all regulatory requirements applicable to the conduct of its business activities.</Text>
            </View>
        </View>

        <View style={styles.view}>
            <Text style={styles.h3}>19. INAPPROPRIATE INFLUENCES</Text>
            <Text style={styles.p}>
                Analysts are not permitted to accept any remuneration or other benefit from the issuer or any other party in respect of the publication of research.
            </Text>
            <Text style={styles.p}>
                Analysts are not permitted to offer or accept any inducement for the production of favourable research, including selective disclosure by an issuer of material information not generally available;
            </Text>
            <Text style={styles.p}>
                Analysts are not permitted to directly or indirectly offer favourable research, specific ratings or specific price targets as consideration or inducement for the receipt of business or compensation;
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

export default InternalPolicy;
