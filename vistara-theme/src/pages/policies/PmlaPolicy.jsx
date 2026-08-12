import React from "react";
import PolicyLayout from "../../components/PolicyLayout";

export default function PmlaPolicy() {
  return (
    <PolicyLayout title="Pmla Policy" description="Vishtara Capital Research Policy Document">
      <div className="policy-content-wrapper">
        


        
        
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#0939a4] dark:text-[#FBB040] uppercase tracking-wider">
                <i className="fa-solid fa-building-columns text-base"></i>
                <span>Compliance &amp; Legal</span>
                <span className="text-slate-600 dark:text-slate-400">/</span>
                <span className="text-slate-600 dark:text-slate-400">PMLA Policy</span>
            </div>
            <div className="flex gap-2">
                <span className="inline-flex items-center rounded-md bg-[#0939a4]/10 dark:bg-[#FBB040]/20 px-3 py-1 text-sm font-semibold text-[#0939a4] dark:text-[#FBB040] ring-1 ring-[#0939a4]/20 dark:ring-[#FBB040]/30">Ref: BSM-PMLA</span>
                <span className="inline-flex items-center rounded-md bg-[#0939a4]/10 dark:bg-[#FBB040]/20 px-3 py-1 text-sm font-semibold text-[#0939a4] dark:text-[#FBB040] ring-1 ring-[#0939a4]/20 dark:ring-[#FBB040]/30">Version: 1.0</span>
            </div>
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-200 mb-6 leading-tight">POLICY AND GUIDELINES ON ANTI-MONEY LAUNDERING (AML)</h1>
                <h2 className="text-xl md:text-2xl font-bold text-slate-700 dark:text-slate-300 mb-8">FOR RESEARCH ENTITY</h2>
                <p className="text-lg md:text-xl font-semibold text-[#0939a4] dark:text-[#FBB040] mb-2">Anujay Chouhan</p>
                <p className="text-lg md:text-xl font-semibold text-[#0939a4] dark:text-[#FBB040]">PROPRIETOR OF Vishtara Capital Research</p>
            </div>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b-2 border-[#0939a4]">INDEX</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-base">
                {(() => {
                    const indexItems = [
                        {sn: '1', title: 'ABOUT ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research', page: '3'},
                        {sn: '2', title: 'INTRODUCTION', page: '3'},
                        {sn: '3', title: 'APPLICABILITY', page: '4'},
                        {sn: '4', title: 'OBJECTIVE', page: '4'},
                        {sn: '5', title: 'PRINCIPAL OFFICER', page: '5'},
                        {sn: '6', title: 'POLICY AND PROCEDURES TO COMBAT MONEY LAUNDERING AND TERRORIST FINANCING', page: '5'},
                        {sn: '7', title: 'IMPLEMENTATION OF THIS POLICY', page: '5'},
                        {sn: '8', title: 'ASPECTS OF THE POLICY', page: '5'},
                        {sn: '9', title: 'CUSTOMER ACCEPTANCE POLICY', page: '6'},
                        {sn: '10', title: 'CLIENTS OF SPECIAL CATEGORY', page: '7'},
                        {sn: '11', title: 'GUIDELINES ON IDENTIFICATION OF BENEFICIAL OWNERSHIP', page: '8'},
                        {sn: '12', title: 'CUSTOMER IDENTIFICATION PROCEDURE', page: '9'},
                        {sn: '13', title: 'MONEY LAUNDERING RISK ASSESSMENTS', page: '11'},
                        {sn: '14', title: 'MONITORING OF TRANSACTIONS', page: '18'},
                        {sn: '15', title: 'CASH TRANSACTIONS', page: '19'},
                        {sn: '16', title: 'RECORD KEEPING', page: '20'},
                        {sn: '17', title: 'SUSPICIOUS TRANSACTIONS MONITORING AND REPORTING', page: '21'},
                        {sn: '18', title: 'RECORDS OF THE INFORMATION REPORTED TO THE DIRECTOR, (FIU – IND)', page: '23'},
                        {sn: '19', title: 'REPORTING TO FINANCIAL INTELLIGENCE UNIT-INDIA', page: '24'},
                        {sn: '20', title: 'ADHERENCE', page: '26'},
                        {sn: '21', title: 'DESIGNATION OF OFFICERS FOR ENSURING COMPLIANCE WITH PROVISIONS OF PMLA', page: '27'},
                        {sn: '22', title: 'INVESTORS EDUCATION', page: '28'},
                        {sn: '23', title: 'ADDITIONAL VALUES', page: '29'},
                    ];
                    return indexItems.map((item, i) => (
                        <div key={i} className="flex justify-between items-center py-1.5 border-b border-slate-100">
                            <span className="text-slate-700 dark:text-slate-300 font-medium">{item.sn}.{item.title}</span>
                            <span className="text-[#0939a4] dark:text-[#FBB040] font-bold ml-4">{item.page}</span>
                        </div>
                    ));
                })()}
            </div>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">ABOUT Vishtara Capital Research</h2>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research is a SEBI registered Research Entity having registration number INH000027779.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-2"><strong className="font-bold">Registered office Address:</strong> C-20/1, Mahananda Nagar, Ujjain (M.P.), India.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-2"><strong className="font-bold">Contact No:</strong> +91 86020 27324</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-2"><strong className="font-bold">Email Id:</strong> chouhananujay@gmail.com</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-2"><strong className="font-bold">Compliance Officer:</strong> Anujay Chouhan</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-2"><strong className="font-bold">Contact No:</strong> +91 86020 27324</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-2"><strong className="font-bold">Email Id:</strong> chouhananujay@gmail.com</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-2"><strong className="font-bold">Grievance Officer:</strong> Anujay Chouhan</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-2"><strong className="font-bold">Contact No:</strong> +91 86020 27324</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-2"><strong className="font-bold">Email Id:</strong> chouhananujay@gmail.com</p>

            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-3 mt-6">INTRODUCTION</h2>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">The Prevention of Money Laundering Act, 2002 (PMLA) has been brought into force with effect from 1st July 2005. Necessary Notifications / Rules under the said Act have been published in the Gazette of India on 1st July 2005 by the Department of Revenue, Ministry of Finance, Government of India.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">Under the recommendation made by the Financial Action Task Force on Anti Money Laundering standards, SEBI had issued the guidelines on Anti Money Laundering standards vide their notification no. SEBI/HO/MIRSD/ DOS3/CIR/P/2018/104 dated July 04, 2018, ISD/CIR/RR/AML/1/6 dated 18th January 2006, and vide letter no. ISD/CIR/RR/AML/2/6 dated 20th March 2006 had issued the obligation on Intermediaries registered under section 12 of the Securities and Exchange Board of India Act, 1992 (The Act). As per the SEBI guidelines, all Intermediaries have been advised to ensure that proper policy frameworks are put in place as per the guidelines on Anti Money Laundering standards notified by SEBI.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300">Vishtara Capital Research has formulated this policy of PMLA and effective AML program to prohibit and actively prevent the money laundering and any activity that facilitates money laundering or the funding of terrorist or criminal activities or flow of illegal money or hiding money to avoid paying taxes. Money Laundering can be defined as engaging in financial transactions that involve income derived from criminal activity, transactions designed to conceal the true origin of criminally derived proceeds and appears to have been received through legitimate sources/origins.</p>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">APPLICABILITY</h2>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4">APPLICABILITYThese policies and procedures apply to all employees, affiliates of the Vishtara Capital Research as per the statutory provisions and are to be read in conjunction with the existing guidelines. The following procedures have been established to ensure that all employees know the identity of their customers and take appropriate steps to combat money laundering incidents.</p>

            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4 mt-6">OBJECTIVE</h2>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-2">The objective of this policy framework is to</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-2">OBJECTIVEThe objective of this policy framework is to</p>
            <ul className="list-decimal pl-6 space-y-2 text-[15px] text-slate-700 dark:text-slate-300">
                <li>Create awareness and provide clarity on KYC standards and AML measures</li>
                <li>To have a proper Customer Due Diligence (CDD) process before registering clients</li>
                <li>To monitor and maintain records of all cash transactions of the value of more than INR 10 lac</li>
                <li>To maintain records of all series of integrally connected cash transactions within one calendar month.</li>
                <li>To monitor and report suspicious transactions</li>
                <li>To discourage and identify money laundering or terrorist financing activities</li>
                <li>To take adequate and appropriate measures to follow the spirit of the PMLA</li>
            </ul>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">PRINCIPAL OFFICER</h2>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">Mr. Anujay Chouhan is the Principal Officer. She is responsible for overseeing the implementation of this Policy. Employees shall refer all matters concerning the issues covered by this Policy to the Principal Officer and shall act in accordance with her/his instructions on this behalf.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4">All submissions required to be made by Employees in terms of this Policy shall be addressed to the Principal Officer. The Principal Officer shall be responsible for maintaining and updating all records in accordance with this Policy or an applicable law/regulation.</p>

            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">POLICY AND PROCEDURES TO COMBAT MONEY LAUNDERING AND TERRORIST FINANCING</h2>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4">ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research has resolved that it would, as an internal policy, take adequate measures to prevent money laundering and shall put in place a framework for identifying, monitoring, and reporting suspected money laundering or terrorist financing transactions to FIU as per the guidelines of PMLA Rules, 2002. Further, ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall regularly review the policies and procedures on PMLA and Terrorist Financing to ensure their effectiveness.</p>

            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">IMPLEMENTATION OF THE POLICY</h2>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">The Principal Officer to ensure overall compliance with the obligations imposed under the PML Act and the Rules. The Principal Officer will ensure the filing of necessary reports with the Financial Intelligence Unit (FIU - IND). The Principal Officer would act as a central reference point in facilitating onward reporting of suspicious transactions and playing an active role in the identification and assessment of potentially suspicious transactions.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4">The Principal Officer have to ensure overall compliance with the obligations imposed under the PML Act and the PML Rules</p>

            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">ASPECTS OF THE POLICY</h2>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-2">The Customer Due Diligence Process includes three specific parameters:</p>
            <ul className="list-disc pl-6 text-[15px] text-slate-700 dark:text-slate-300">
                <li>Policy for Acceptance of Clients</li>
                <li>Client Identification Procedure</li>
                <li>Suspicious Transactions identification &amp; reporting</li>
            </ul>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">Obtaining sufficient information about the client in order to identify who is the actual beneficial owner of the securities or on whose behalf the transaction is conducted. The beneficial owner is the natural person or persons on whose behalf a transaction is being conducted. It also incorporates those persons who exercise ultimate effective control over a legal person or arrangement.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">Verify the customer's identity using reliable, independent source documents, data, or information.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4">Conduct ongoing due diligence and scrutiny of the account/client to ensure that the transaction conducted are consistent with the client's background/financial status, its activities, and risk profile.</p>

            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">CUSTOMER ACCEPTANCE POLICY</h2>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">We will accept clients whom we are able verify their identity as per the government guidelines. Either the client should visit the office/branch or concerned official may visit the client at his residence /office to get the necessary documents filled in and signed. We may also use approved online modes/methods/Standard practices etc. to verify the identity and documents of the prospective clients.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300">In case of accounts are opened in the name of NRI. (If the ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research cannot personally verify the NRI Client), the ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research/ KYC team shall ensure the photocopies of all the KYC documents/ Proofs and PAN Card are attested by Indian Embassy or Consulate General in the country where the NRI resides or as per the prevailing guidelines for the same. The photocopies of the KYC documents and PAN Card should be sign by NRI. If the NRI comes in person to open the account, the above attestation is required may be waived.</p>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4">Detailed search to be carried out to find that the Client is not in defaulters / negative list of regulators. ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research obtain completes information from the client. It should be ensured that the initial forms taken by the clients are filled in completely. All photocopies submitted by the client are checked against original documents without any exception. Ensure that the 'Know Your Client' guidelines are followed without any exception. All supporting documents as specified by Securities and Exchange Board of India (SEBI) and Exchanges are obtained and verified.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4">We will not accept clients with identity matching persons known to have criminal background. We will check whether the client's identify matches with any person having known criminal background or is not banned in any other manner, whether in terms of criminal or civil proceedings by any enforcement/regulatory agency worldwide.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">KYC team shall check following sites (not exhaustive) before admitting any person as client</p>
            <ul className="list-disc pl-6 text-[15px] text-slate-700 dark:text-slate-300 mb-6">
                <li>https://www.fatf- gafi.org/en/home.html</li>
                <li>https://www.un.org/securitycouncil/content/un- sc- consolidated- list</li>
                <li>https://www.watchoutinvestors.com/default2a.asp</li>
                <li>Data available on SEBI and other relevant enforcement sites</li>
                <li>Any other database available at the prevailing time</li>
            </ul>

            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">CLIENTS OF SPECIAL CATEGORY</h2>
            <ul className="list-disc pl-6 text-[15px] text-slate-700 dark:text-slate-300 space-y-2">
                <li>Non-Resident clients</li>
                <li>High net-worth clients (clients having an annual income of INR 25 Lac or more or having a Net worth of Rs.10 Crore or more)</li>
                <li>Trust, Charities, Non-Government Organizations (NGOs), and organizations receiving donations</li>
                <li>Companies having close family shareholdings or beneficial ownership</li>
                <li>Politically Exposed Persons (PEP). Politically exposed persons are individuals who are or have been entrusted with prominent public functions in a foreign country, e.g., Heads of States or of Governments, senior politicians, senior government/judicial/military officers, senior executives of state- owned corporations, important political party officials, applied to the accounts of the family members or close relatives of PEPs</li>
                <li>Companies offering foreign exchange</li>
                <li>Clients in high-risk countries (As per the latest data provided by the government) where the existence/effectiveness of money laundering controls is suspect, where there is unusual banking secrecy, countries active in narcotics production, Countries where corruption (as per Transparency International Corruption Perception Index) is highly prevalent, Countries against which government sanctions are applied, Countries reputed to be any of the following –Sponsors of international terrorism, Offshore financial centers, Tax havens, Countries where fraud is highly prevalent.</li>
                <li>Clients with dubious reputation as per public information available etc.</li>
                <li>Persons of foreign origin, companies having closed shareholding/ownership companies dealing in foreign currency, shell companies, overseas entities, clients in high-risk countries</li>
            </ul>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">GUIDELINES ON IDENTIFICATION OF BENEFICIAL OWNERSHIP</h2>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">For non- individual customers as part of the due diligence measures sufficient information must be obtained in order to identify persons who beneficially own or control securities account. Whenever it is apparent that the securities acquired or maintained through an account are beneficially owned by a party other than the client, that party should be identified and verified using client identification and verification procedures as early as possible. The beneficial owner is the natural person or persons who ultimately own, control, or influence a client and/or persons on whose behalf a transaction(s) is/are being conducted. It includes persons who exercise ultimate effective control over a legal person or arrangement.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">Do not accept client registration forms that are suspected to be fictitious. Ensure that no account is being opened in a fictitious / Benami or on an anonymous basis.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300">Do not compromise on submission of mandatory information/ documents. The client's account should be opened only on receipt of mandatory information along with authentic supporting documents as per the regulatory guidelines. Do not open the accounts where the client refuses to provide information/documents and we should have sufficient reason to reject the client towards this reluctance.</p>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">CUSTOMER IDENTIFICATION PROCEDURE</h2>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4">To have a mechanism in place to establish the identity of the client along with firm proof of address to prevent the opening of any account which is fictitious / benami / anonymous in nature.</p>

            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3">(a) Documents that can be relied upon:</h3>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-2"><strong className="font-bold">PAN Card:</strong> PAN card is mandatory and is the most reliable document as only one card is issued to an individual and we can independently check its genuineness through the IT website.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4"><strong className="font-bold">ADDRESS Proof:</strong> For valid address proof we can rely on a Voter's Identity Card, Passport, Bank Statement, Aadhaar Letter, Ration card, and latest Electricity/telephone bill in the name of the client.</p>

            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3">(b) Documents to be obtained as part of the customer identification procedure for new clients:</h3>
            <div className="text-base text-slate-600 dark:text-slate-400 italic">*List is for illustration purpose. Actual need of documents will be dependent on the prevailing guidelines.</div>
            
            
            
        </div>

        
        <div className="mb-6 relative overflow-x-auto">
            
            <table className="min-w-full border border-slate-200 dark:border-slate-700 text-base">
                <thead className="bg-[#0939a4]/10 dark:bg-[#FBB040]/20">
                    <tr>
                        <th className="border border-slate-200 dark:border-slate-700 px-4 py-3 text-left font-bold text-slate-800 dark:text-slate-200">Types of entity</th>
                        <th className="border border-slate-200 dark:border-slate-700 px-4 py-3 text-left font-bold text-slate-800 dark:text-slate-200">Documentary requirements</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-slate-200 dark:border-slate-700 px-4 py-3 align-top font-semibold text-slate-800 dark:text-slate-200">Corporate</td>
                        <td className="border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300">
                            a. Copy of the balance sheets for the last 2 financial years (to be submitted every year).<br/>
                            b. Copy of latest share holding pattern including list of all those holding control, either directly or indirectly, in the company in terms of SEBI takeover Regulations, duly certified by the company secretary/Whole time director/MD (to be submitted every year).<br/>
                            c. Photograph, POI, POA, PAN and DIN numbers of whole time directors/two directors in charge of day-to-day operations.<br/>
                            d. Photograph, POI, POA, PAN of individual promoters holding control - either directly or indirectly.<br/>
                            e. Copies of the Memorandum and Articles of Association and certificate of incorporation.<br/>
                            f. Copy of the Board Resolution for investment in securities/commodities market.<br/>
                            Authorised signatories list with specimen signatures.
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-slate-200 dark:border-slate-700 px-4 py-3 align-top font-semibold text-slate-800 dark:text-slate-200">Partnership</td>
                        <td className="border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300">
                            a. Copy of the balance sheets for the last 2 financial years (to be submitted every year).<br/>
                            b. Certificate of registration (for registered partnership firms only)<br/>
                            c. Copy of partnership deed.<br/>
                            d. Authorised signatories list with specimen signatures.<br/>
                            Photograph, POI, POA, PAN of Partners.
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-slate-200 dark:border-slate-700 px-4 py-3 align-top font-semibold text-slate-800 dark:text-slate-200">Trust</td>
                        <td className="border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300">
                            a. Copy of the balance sheets for the last 2 financial years (to be submitted every year).<br/>
                            b. Certificate of registration (for registered trust only).<br/>
                            c. Copy of Trust deed.<br/>
                            d. List of trustees certified by managing trustees/CA.<br/>
                            g. Photograph, POI, POA, PAN of Trustees.
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-slate-200 dark:border-slate-700 px-4 py-3 align-top font-semibold text-slate-800 dark:text-slate-200">HUF</td>
                        <td className="border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300">
                            PAN of HUF.<br/>
                            Deed of declaration of HUF/ List of coparceners.<br/>
                            Bank pass-book/bank statement in the name of HUF.<br/>
                            e. Photograph, POI, POA, PAN of Karta.
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-slate-200 dark:border-slate-700 px-4 py-3 align-top font-semibold text-slate-800 dark:text-slate-200">Banks/Institutional Investors</td>
                        <td className="border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300">
                            Copy of the constitution/registration or annual report/balance sheet for the last 2 financial years.<br/>
                            Authorised signatories list with specimen signatures
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-slate-200 dark:border-slate-700 px-4 py-3 align-top font-semibold text-slate-800 dark:text-slate-200">Foreign Institutional Investors</td>
                        <td className="border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300">
                            Copy of SEBI registration certificate.<br/>
                            Authorised signatories list with specimen signatures.
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-slate-200 dark:border-slate-700 px-4 py-3 align-top font-semibold text-slate-800 dark:text-slate-200">Army/Government Bodies</td>
                        <td className="border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300">
                            Self-certification on letterhead.<br/>
                            Authorised signatories list with specimen signatures.
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-slate-200 dark:border-slate-700 px-4 py-3 align-top font-semibold text-slate-800 dark:text-slate-200">Registered Society</td>
                        <td className="border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300">
                            Copy of Registration Certificate under Societies Registration Act.<br/>
                            List of Managing Committee members.<br/>
                            Committee resolution for persons authorised to act as authorised signatories with specimen signatures.<br/>
                            True copy of Society Rules and Bye Laws certified by the Chairman/Secretary.
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-slate-200 dark:border-slate-700 px-4 py-3 align-top font-semibold text-slate-800 dark:text-slate-200">NRI account - Repatriable/non-repatriable</td>
                        <td className="border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300">
                            Copy of the PIS permission issued by the bank<br/>
                            Copy of the passport<br/>
                            Copy of PAN card<br/>
                            Proof of overseas address and Indian address<br/>
                            Copy of the bank statement<br/>
                            Copy of the demat statement<br/>
                            If the account is handled through a mandate holder, copy of the valid PoA/mandate.
                        </td>
                    </tr>
                </tbody>
            </table>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 italic font-medium">*List is for illustration purpose. Actual need of documents will be dependent on the prevailing guidelines.</p>
            
            
            
        </div>

        
        <div className="mb-6 relative overflow-x-auto">
            
            <table className="min-w-full border border-slate-200 dark:border-slate-700 text-base">
                <thead className="bg-[#0939a4]/10 dark:bg-[#FBB040]/20">
                    <tr>
                        <th className="border border-slate-200 dark:border-slate-700 px-4 py-3 text-left font-bold text-slate-800 dark:text-slate-200">Types of entity</th>
                        <th className="border border-slate-200 dark:border-slate-700 px-4 py-3 text-left font-bold text-slate-800 dark:text-slate-200">Documentary requirements</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-slate-200 dark:border-slate-700 px-4 py-3 align-top font-semibold text-slate-800 dark:text-slate-200">Registered Society (continued)</td>
                        <td className="border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300">
                            Proof of Existence/Constitution document.<br/>
                            Resolution of the managing body &amp; Power of Attorney granted to transact business on its behalf.<br/>
                            Authorised signatories list with specimen signatures.
                        </td>
                    </tr>
                </tbody>
            </table>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 italic font-medium">\\*List is for illustration purpose. Actual need of documents will be dependent on the prevailing guidelines.</p>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">MONEY LAUNDERING RISK ASSESSMENTS</h2>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">Risk assessment on money laundering is dependent on the kind of customers the RA deals with. Typically, risks are increased if the money launderer can hide behind corporate structures such as limited companies, offshore trusts, special purpose vehicles, and nominee arrangements etc. The Risk Assessment is required in order to assess and take effective measures to mitigate its money laundering and terrorist financing risk with respect to clients, countries or geographical areas, nature and volume of transactions, payment methods used by clients, etc. The risk assessment shall also take into account any country-specific information that is circulated by the government of India and SEBI from time to time, as well as, the updated list of individuals and entities who are subjected to sanction measures as required under the various United Nations Security Resolutions as well as various international organizations of repute.</p>
            
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3">Risk classification</h3>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">The level of Money Laundering risks that the Vishtara Capital Research is exposed to by an investor relationship depends on:</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-2">i. Type of the customer and nature of business<br/>ii. Type of product/service availed by the customer<br/>iii. Country where the Customer is domiciled</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-2">Based on the above criteria, the customers may be classified into three Money laundering relationships depends on:</p>
            <ul className="list-disc pl-6 text-[15px] text-slate-700 dark:text-slate-300 mb-4">
                <li>High Risk</li>
                <li>Medium Risk</li>
                <li>Low risk</li>
            </ul>
            
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3">Risk Category</h3>
            <p className="text-[15px] font-bold text-slate-700 dark:text-slate-300 mb-2">Indicative List of clients</p>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <ul className="list-disc pl-6 text-[15px] text-slate-700 dark:text-slate-300 space-y-2">
                <li>Non-Assisted Online clients</li>
                <li>Non-resident clients (NRI);</li>
                <li>High Net worth clients (HNI)</li>
                <li>Trust, Charities, NGOs, and organizations receiving donations.</li>
                <li>Companies having close family shareholdings or Beneficial Ownership.</li>
                <li>Politically Exposed Persons (PEP) of Foreign Origin</li>
                <li>Current /Former Head of State, Current or Former Senior High-profile politicians and connected persons (immediate family, close advisors, and companies in which such individuals have interest or significant influence);</li>
                <li>Companies offering Foreign Exchange</li>
                <li>Clients in high-risk countries (where the existence/effectiveness of money laundering controls is suspect, Countries reputed to be any of the following - sponsors of national terrorism, offshore financial centers, tax havens, countries where fraud is highly prevalent;</li>
                <li>Non-face-to-face clients;</li>
                <li>Clients with dubious reputation as per public information available etc.</li>
            </ul>
            
            <p className="text-[15px] font-bold text-slate-700 dark:text-slate-300 mt-4 mb-2">Medium Risk</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-2">Individual and non-individual clients falling under the definition of Speculators, Day Traders and all clients trading in Futures and Options segment, in case of a client where there is continuous margin shortfall, regular instances of cheque dishonored are categorized as medium risk clients</p>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <p className="text-[15px] font-bold text-slate-700 dark:text-slate-300 mb-2">Low Risk</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4">Senior Citizens, Salaried Employees and a major portion of clients who indulge in delivery-based trading &amp; clients who are not covered in the high &amp; medium risk profile are Low- risk Profile client.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4">This list is indicative only, will be dependent on various other relevant factors at the time of evaluation. The risk profile also depends on the trading pattern, payment pattern, financial status, and background of the client. Vishtara Capital Research will put in place a system of periodical review of risk categorization of accounts and the need for applying enhanced due diligence measures in case of higher risk perception on a client High-Risk Clients, categorization should be carried out at least once in six months while for Medium and Low –Risk clients, categorization frequency should be once in a year.</p>
            
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-2">The following safeguards are to be followed while accepting the clients:</p>
            <ul className="list-decimal pl-6 text-[15px] text-slate-700 dark:text-slate-300 space-y-2">
                <li>The client account should not be opened in a fictitious / benami name or on an anonymous basis.</li>
                <li>Risk perception of the client needs to be defined having regard</li>
                <li>Client's location (registered office address, correspondence addresses and other addresses if applicable)</li>
                <li>Nature of business activity, tracing turnover etc.</li>
                <li>Manner of making payment for transactions undertaken</li>
                <li>Documentation like KYC, Broker-client agreement and Risk Disclosure Document, and other information from different category of clients prescribed by SEBI and any other regulatory authority to be collected depending on perceived risk and having regard to the requirement of the Prevention of Money Laundering Act, 2002, guidelines issued by RBI and SEBI from time to time.</li>
            </ul>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <ul className="list-decimal pl-6 text-[15px] text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                <li>Ensure that a client account is not opened where the organization is unable to apply appropriate client's due diligence measures / KYC policies. This may be applicable in cases where it is not possible to ascertain the identity of the client, information provided to the organization is suspected to be non- genuine, perceived, or non- co- operation of the client in providing full and complete information. Discontinue to do business with such a person and file a suspicious activity report. We can also evaluate whether there is suspicious trading in determining whether to freeze or close the account. Should be cautious to ensure that it does not return securities or money that may be from suspicious trades. However, we can consult the relevant authorities in determining what action should be taken when it suspects suspicious trading.</li>
                <li>ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research need to comply with adequate formalities when the client is permitted to act on behalf of another person/entity should be clearly specified the manner in which the account should be operated, transaction limits for the operation, additional authority required for transactions exceeding a specified quantity/value other appropriate detail. The rights and responsibilities of both the persons (i.e. the agent-client registered with Broker, as well as the person on whose behalf the agent is acting) should be clearly laid down.</li>
                <li>Adequate verification of a person's authority to act on behalf of the customer should be carried out.</li>
                <li>Necessary checks and balance to be put in place before opening an account so as to ensure that the identity of the client does not match with any person having a known criminal background or is not banned in any other manner, whether in terms of criminal or civil proceedings by any enforcement agency worldwide.</li>
            </ul>

            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">For new clients:</h2>
            <ul className="list-decimal pl-6 text-[15px] text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                <li>Each client may be met in person or through online verification as per regulatory guidelines, before accepting the KYC. The client may be met at the Registered Office or any of the branch offices as per mutual convenience of the client and ourselves.</li>
                <li>Verify the PAN details on the Income Tax website.</li>
                <li>All documentary proofs given by the client should be verified with original.</li>
                <li>Documents like the latest Income Tax returns, annual accounts, etc. should be obtained for ascertaining the financial status. If required, obtain additional information/documents from the client to ascertain his background and financial status.</li>
                <li>Obtain complete information about the client and ensure that the KYC documents are properly filled up, signed, and dated. Scrutinize the forms received at the branch office thoroughly before forwarding it toRO for account opening.</li>
                <li>Ensure that the details mentioned in the KYC match with the documentary proofs provided and with the general verification done by us.</li>
                <li>If the client does not provide the required information, then we should not open the account of such clients.</li>
                <li>As far as possible, a prospective client can be accepted only if introduced by ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research's existing client or associates or known entity etc.</li>
            </ul>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <p className="text-[15px] font-bold text-slate-700 dark:text-slate-300 mb-3">In the case of walk-in clients, extra steps should be taken to ascertain the financial and general background of the client</p>
            <ul className="list-decimal pl-6 text-[15px] text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                <li>If the account is opened by a POA/Mandate Holder, then we need to clearly ascertain the relationship of the POA/Mandate Holder with the client. Apply the KYC procedures to the POA/Mandate Holder also.</li>
                <li>ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research should not open any accounts in a fictitious / benami / anonymousbasis.</li>
                <li>ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research should not open accounts where we are unable to apply appropriate KYC procedures.</li>
            </ul>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">For existing clients:</h2>
            <ul className="list-decimal pl-6 text-[15px] text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                <li>Keep updating the financial status of the client by obtaining the latest Income Tax Return, Net worth Certificate, Annual Accounts etc.</li>
                <li>Update the details of the client like address, contact number, Demat details, bank details, etc. In case, at any given point of time, we are notable to contact the client either at the address or on the phone number, contact the introducer, and try to find out alternative contact details.</li>
                <li>Check whether the client's identity matches with any person having known criminal background or is not banned in any other manner, whether in terms of criminal or civil proceedings by any local enforcement / regulatory agency. For scrutiny / back ground check of the clients/HNI, websites such as www.watchoutinvestors.com should be referred. Also, Prosecution Database / List of Vanishing Companies available on SEBI etc. and RBI Defaulters Database available onwww.cibil.com should be checked.</li>
                <li>Scrutinize minutely the records/documents pertaining to clients of special category (like Non-resident clients, High Net worth Clients, Trusts, Charities, NGOs, Companies having close family shareholding, Politically exposed persons, persons of foreign origin, Current/Former Head of State, Current/Former senior high profile politician, Companies offering foreign exchange offerings, etc.) or clients from high-risk countries (like Libya, Pakistan, Afghanistan, etc.) or clients belonging to countries where corruption /fraud is highly prevalent.</li>
                <li>Review the above details on a going basis to ensure that the transactions being conducted are consistent with our knowledge of customers, its business and risk profile, taking into account, where necessary, the customer's source of funds.</li>
            </ul>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">Mandate Holder Policy</h2>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">The primary objective of this policy is to ensure that we are aware of who is the ultimate beneficiary of the transaction and that the transactions executed, through the mandate holder are bona fide.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">It is possible that some of the individual clients might appoint a mandate holder. Normally the trading account is opened in the name of various family members and one of the family members will hold the mandate. Also, in the case of some NRI clients who are based abroad, there may be a POA/Mandate in favor of a person residing in India.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">Whenever any account is operated by a mandate holder, find out the relationship of the mandate holder with the client, followed by establishing the identity of the mandate holders by obtaining proof of identity and address.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">Do not accept any payment from the account of the mandate holder in favor of the client. All the payments have to be received from the client's bank account only for which the POA holder may or may not have the mandate to operate the bank account. Similarly, pay- out cheques should be issued only in the name of the client and not in the name of the mandate holder.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4">In case there is suspicion on the relationship between the mandate holder and the actual client or in case the behavior of the mandate holder is suspicious, do take necessary advice from the Business Head.</p>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">Roles &amp; Duties</h2>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">The Sales Person/Relationship Manager/ Dealer/ Branch Manager/ Branch Coordinator/ Business Head/Marketing Manager etc. should meet the client in person or via legally acceptable online mode at least once before opening the account. In the process, he may reasonably verify the living standards, source of income, financial status, etc. of the client and ensure that the details mentioned in the CRF (Client Registration Form) matches with the actual status.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">If the client is a 'walk- in client', then the concerned branch official should make independent verification about the background, identity and financial worthiness of the client.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">All mandatory proofs of identity, address, and financial status of the client must be collected as prescribed by the regulatory authorities, from time to time. The proofs so collected should be verified with the originals. If the prospective clients refusing to provide any information do not forward his/ her account opening form to HO.</p>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">IN PERSON VERIFICATION (IPV) can be done by the respective person or associate/affiliate/agent etc.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">If the account is to be handled by a POA /mandate holder, then find out what is the relationship between the client and the POA/Mandate holder, establish the identity and background of the client and the POA/Mandate holder (by obtaining the required documents) and ensure that the POA/Mandate Holder has the proper authorization.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">In case of a corporate account, the officials should ensure that the authorized person has got the required mandate by way of Board Resolution. Also, the identity and background of the authorized person has to be established by obtaining the required documents.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4">Foreign clients can deal in Indian market only to sell the shares allotted through ESOP or buy/sell as a 'foreign direct investment. We cannot deal for foreign clients under any other circumstances.</p>

            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">MONITORING OF TRANSACTIONS</h2>
            <ul className="list-decimal pl-6 text-[15px] text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                <li>ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research regular monitors the transactions to identify any deviation in transactions/activity for ensuring the effectiveness of the AML procedures.</li>
                <li>ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall pay special attention to all unusually large transactions/patterns which appears to have no economic purpose.</li>
                <li>ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research may specify internal threshold limits for each class of client accounts on the basis of various plans and pay special attention to transactions which exceed these limits</li>
                <li>The background including all documents/office records /memorandums/clarifications sought pertaining to such transactions and purpose thereof shall also be examined carefully and findings shall be recorded in writing. Further such findings, records and related documents shall be made available to auditors and also to SEBI/stock exchanges/FIU- IND/other relevant Authorities, during audit, inspection, or as and when required. These records are required to be maintained and preserved for a period of five years from the date of transaction between the client and intermediary as is required under PMLA.</li>
            </ul>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">CASH TRANSACTIONS</h2>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">All are requested not to accept cash from the clients whether against obligations or as margin for purchase of securities or otherwise. All payments shall be received from the clients strictly by account payee crossed cheques drawn in favor of ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research. The same is also required as per SEBI circular no. SMD/ED/IR/3/23321 dated November 18, 1993 and SEBI/MRD/SE/Cir- 33/2003/27/08 dated August 27, 2003.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4">In case account payee cheques have been received from a bank account other than that captured in records the same can be accepted after ascertaining that the client is the first holder of the account. Only in exceptional cases, bank draft/pay- order may be accepted from the client provided identity of the remitter/purchaser written on the draft/pay- order matches with that of client else obtain a certificate from the issuing bank to verify the same.</p>

            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">Reliance on a third party for carrying out Client Due Diligence(CDD)</h2>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research may rely on a third party for the purpose of</p>
            <ul className="list-disc pl-6 text-[15px] text-slate-700 dark:text-slate-300 mb-4">
                <li>Identification and verification of the identity of a client and</li>
                <li>Determination of whether the client is acting on behalf of a beneficial owner, identification of the beneficial owner</li>
                <li>Verification of the identity of the beneficial owner.</li>
            </ul>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4">Such third party shall be regulated, supervised or monitored for, and have measures in place for compliance with CDD and record- keeping requirements in line with the obligations under the PML Act. Such reliance shall be subject to the conditions that are specified in Rule 9 (2) of the PML Rules and shall be in accordance with the regulations and circulars/ guidelines issued by SEBI from time to time. Further, it is clarified that ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall be ultimately responsible for CDD and undertaking enhanced due diligence measures, as applicable.</p>

            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">RECORD KEEPING</h2>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall ensure compliance with the record keeping requirements contained in the SEBI Act, 1992, Rules and Regulations made there- under, PMLA as well as other relevant legislation, Rules, Regulations, Exchange Bye- laws and Circulars.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">More specifically, ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall put in place a system of maintaining proper record of transactions prescribed under Rule 3 of PML Rules as mentioned below:</p>
            <ul className="list-decimal pl-6 text-[15px] text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li>all cash transactions of the value of more than ten lakh rupees or its equivalent in foreign currency;</li>
                <li>all series of cash transactions integrally connected to each other which have been individually valued below rupees ten lakh or its equivalent in foreign currency where such series of transactions have taken place within a month and the monthly aggregate exceeds an amount of ten lakh rupees or its equivalent in foreign currency</li>
                <li>all cash transactions where forged or counterfeit currency notes or banknotes have been used as genuine or where any forgery of a valuable security or a document has taken place facilitating the transactions;</li>
                <li>all suspicious transactions whether or not made in cash and by way of as mentined in the Rules.</li>
            </ul>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">Retention of Records:</h2>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">The following document retention terms should be observed:</p>
            <ul className="list-decimal pl-6 text-[15px] text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li>All necessary records on transactions, both domestic and international, should be maintained at least for the minimum period of ten years (10) from the date of cessation of the transaction.</li>
                <li>Records on customer identification (e.g. copies or records of official identification documents like passports, identity cards, driving licenses, or similar documents), account files, books of account, and business correspondence should also be kept for ten years from the date of cessation of the transaction.</li>
                <li>Records shall be maintained in hard and soft copies.</li>
                <li>It should be ensured that there is continuity in dealing with the client as normal until told otherwise and the client should not be told of the report /suspicion. In exceptional circumstances, consent may not be given to continue to operate the account and transactions</li>
                <li>Records shall be maintained in hard and soft copies.</li>
                <li>ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall take appropriate steps to evolve an internal mechanism for proper maintenance and preservation of such records and information in a manner that allows easy and quick retrieval of data as and when requested by the competent authorities.</li>
            </ul>

            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">SUSPICIOUS TRANSACTIONS MONITORING AND REPORTING</h2>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research, on an ongoing basis, monitors the transactions executed by the client in order to ascertain whether the same is "suspicious" which should be reported to FIU, India. Followings are the Surveillance/ Alerts based on the client's transactions on NSE/BSE/DP and circumstances, which may be in the nature of suspicious transactions.</p>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-2">Suspicious Transactions are those which:</p>
            <ul className="list-disc pl-6 text-[15px] text-slate-700 dark:text-slate-300 mb-4">
                <li>gives rise to reasonable grounds of suspicion that it may involve proceeds of crime</li>
                <li>appears to be made in circumstances of unusual or unjustified complexity</li>
                <li>appears to have no economic rationale or bona fide purpose</li>
            </ul>

            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">Criteria for Ascertaining Suspicious Transactions</h2>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-2">Whether a particular transaction is suspicious or not will depend upon the Client's details of the transactions/Identity/Receipt/ Payment pattern and other facts and circumstances.</p>
            <ul className="list-disc pl-6 text-[15px] text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li>Clients whose identity verification is difficult which includes non- cooperation of the client</li>
                <li>Clients belonging to (or) introduced by persons/entities in high- risk countries</li>
                <li>Increase in clients' business without justification and Turnover not commensurate with financials</li>
                <li>Unusual large cash deposits</li>
                <li>Overseas receipts/payments of funds with or without instructions to pay in cash transaction.</li>
                <li>Transfer of proceeds to unrelated parties</li>
                <li>Negotiated trades /Matched trades.</li>
                <li>Relation of the client with the ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research.</li>
                <li>Clients making huge and regular losses and are still placing trades/orders and further identifying the sources of funds in such cases.</li>
            </ul>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <ul className="list-disc pl-6 text-[15px] text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li>Large volume in the proprietary account of Sub- Brokers/Affiliates/Dealer</li>
                <li>Asset management services for Clients where the source of the funds is not clear or not in Keeping with the Client's apparent standing/business activity;</li>
                <li>Clients based in high- risk jurisdictions;</li>
                <li>Unusual transactions are undertaken by "Client of the special category (CSCs)", i.e. offshore etc.</li>
            </ul>

            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">RECORDS OF THE INFORMATION REPORTED TO THE DIRECTOR, (FIU - IND)</h2>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4">ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall maintain and preserve the records of information related to transactions, whether attempted or executed, which are reported to the Director, FIU - IND, as required under Rules 7 and 8 of the PML Rules, for a period of five years from the date of the transaction between the client and ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research.</p>

            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3">i. List of Designated Individuals/ Entities</h3>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">An updated list of individuals and entities which are subject to various sanction measures such as freezing of assets/accounts, denial of financial services etc., as approved by the Security Council Committee established pursuant to various United Nations' Security Council Resolutions (UNSCRs) can be accessed at its website.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4">ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research ensures that accounts are not opened in the name of anyone whose name appears in said list. ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall continuously scan all existing accounts to ensure that no account is being operated by a designated person. It shall also ensure that any account suspected to be of a designated person is reported to FIU-India.</p>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3">ii. Procedure for freezing of funds, financial assets or economic resources, or related services</h3>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">Section 51A of the Unlawful Activities (Prevention) Act, 1967 (UAPA), relating to the purpose of prevention of money laundering, and coping with terrorist activities was brought into effect through UAPA Amendment Act, 2008. In this regard, the Central Government has issued an order dated August 27, 2009 detailing the procedure for the implementation of Section 51A of the UAPA. Also referring to notification no. SEBI/HO/MIRSD/DOP/CIR/P/2021/36 dated March 25, 2021 </p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4">Under the aforementioned section, the Central Government is empowered to freeze, seize or attach funds and other financial assets or economic resources held by, on behalf of, or at the direction of the individuals or entities listed in the Schedule to the Order, or any other person engaged in or suspected to be engaged in terrorism. The Government is also further empowered to prohibit any individual or entity from making any funds, financial assets or economic resources, or related services available for the benefit of the individuals or entities listed in the Schedule to the Order or any other person engaged in or suspected to be engaged in terrorism. </p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4">ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall ensure effective and expeditious implementation of the procedure laid down in the UAPA Order dated August 27, 2009, and order dated 2nd February ,  2021.</p>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">REPORTING TO FINANCIAL INTELLIGENCE UNIT-INDIA</h2>
            <div className="bg-[#0939a4]/5 dark:bg-[#FBB040]/10 border border-[#0939a4]/20 p-4 rounded-lg mb-4 text-[15px]">
                <p><strong className="font-bold text-slate-800 dark:text-slate-200">Address:</strong></p>
                <p className="text-slate-700 dark:text-slate-300">Director, FIU-IND,</p>
                <p className="text-slate-700 dark:text-slate-300">Financial Intelligence Unit-India, 6th Floor,</p>
                <p className="text-slate-700 dark:text-slate-300">Hotel Samrat, Chanakyapuri, New Delhi-110021.</p>
                <p className="text-slate-700 dark:text-slate-300">Website: https://fiuindia.gov.in/</p>
            </div>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall carefully go through all the reporting requirements and formats that are available on the website of Financial Intelligence Unit–India under the Section Obligation of Reporting Entity – Furnishing Information – Reporting Format.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">These documents contain detailed directives on the compilation and manner/procedure of submission of the reports to FIU-IND. The related hardware and technical requirements for preparing reports, the related data files, and data structures thereof are also detailed in these documents. While detailed instructions for filing all types of reports are given in the instructions part of the related formats.</p>

            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">ADHERENCE</h2>
            <ul className="list-decimal pl-6 text-[15px] text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li>The Cash Transaction Report (CTR) (wherever applicable) for each month shall be submitted to FIU-IND by 15th of the succeeding month.</li>
                <li>The Suspicious Transaction Report (STR) shall be submitted within 7 days of arriving at a conclusion that any transaction, whether cash or non-cash, or a series of transactions integrally connected are of suspicious nature. The Principal Officer shall record his reasons for treating any transaction or a series of transactions as suspicious. It shall be ensured that there is no undue delay in arriving at such a conclusion.</li>
                <li>The Non-Profit Organization Transaction Reports (NTRs) for each month shall be submitted to FIU-IND by 15th of the succeeding month.</li>
                <li>The Principal Officer will be responsible for timely submission of CTR, STR and NTR to FIU-IND.</li>
            </ul>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <ul className="list-decimal pl-6 text-[15px] text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li>Utmost confidentiality shall be maintained in filing of CTR, STR and NTR to FIU- IND.</li>
                <li>No nil reporting needs to be made to FIU- IND in case there are no cash/suspicious/ non - profit organization transactions to be reported.</li>
            </ul>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall not put any restrictions on operations in the accounts where an STR has been made. ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research and officers and employees (permanent and temporary) shall be prohibited from disclosing ("tipping off") the fact that a STR or related information is being reported or provided to the FIU- IND. This prohibition on tipping off extends not only to the filing of the STR and/or related information but even before, during and after the submission of an STR. Thus, it shall be ensured that there is no tipping off to the client at any level. It is clarified that the ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research irrespective of the amount of transaction and/or the threshold limit envisaged for predicate offences specified in part B of Schedule of PMLA, 2002, shall file STR if ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research has reasonable grounds to believe that the transactions involve proceeds of crime.</p>

            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">DESIGNATION OF OFFICERS FOR ENSURING COMPLIANCE WITH PROVISIONS OF PMLA</h2>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">Appointment of a Principal Officer:</h2>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">To ensure that ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research properly discharges its legal obligations to report suspicious transactions to the authorities, the Principal Officer would act as a central reference point in facilitating onward reporting of suspicious transactions and for playing an active role in the identification and assessment of potentially suspicious transactions and shall have access to and be able to report to senior management at the next reporting level.</p>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">Ms. Anujay Chouhan, is appointed as Principal Officer The details of his appointment have been intimated to the Financial Intelligence Unit, India (FIU - IND).</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4">Names, designation, and addresses (including email addresses) of 'Principal Officer' including any changes therein shall also be intimated to the Office of the Director- FIU. As a matter of principle, the 'Principal Officer' will be in a sufficiently senior position and is able to discharge the functions with independence and authority.</p>

            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">Employees' Hiring/Employee's Training/ Investor Education</h2>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3">(a) Hiring of Employees</h3>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall have adequate screening procedures in place to ensure high standards when hiring employees. He shall identify the key positions within its own organizational structures having regard to the risk of money laundering and terrorist financing and the size of their business and ensure the employees taking up such key positions are suitable and competent to perform their duties.</p>

            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3">(b) Employees' Training</h3>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4">ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research has an ongoing employee training program so that the members of the staff are adequately trained in AML, Combating the Financing of Terrorism ('CFT') and other relevant procedures. Training requirements shall have specific focuses for frontline staff, back- office staff, compliance staff, risk management staff and staff dealing with new clients. It is crucial that all those concerned fully understand the rationale behind these directives, obligations, and requirements and implement them consistently and are sensitive to the risks of their systems being misused by unscrupulous elements. Regular AML/CFT training programs will be conducted for employees to ensure awareness of regulatory requirements and internal procedures. Training will include case studies and examples relevant to the securities market.</p>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4">SECURITIES MARKET.</p>

            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">INVESTORS EDUCATION</h2>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">Implementation of AML measures requires ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research to demand certain information from investors which may be of personal nature or has hitherto never been called for. Such information can include documents evidencing source of funds/income tax returns/bank records etc. This can sometimes lead to raising of questions by the client with regard to the motive and purpose of collecting such information. There is, therefore, a need for ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research to sensitize its clients about these requirements as the ones emanating from AML frameworks and Combating the Financing of Terrorism ('CFT'). ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall prepare specific literature/ pamphlets etc. so as to educate the client on the objectives of the AML program. The said literature/ pamphlets shall be displayed on the website.</p>

            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">ADDITIONAL VALUES</h2>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-2">ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall ensure the following:</p>
            <ul className="list-decimal pl-6 text-[15px] text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li>ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research shall ensure that the content of these Directives is understood by all staff members</li>
                <li>ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research will regularly review the policies and procedures for the prevention of AML on an annual basis to ensure their effectiveness. Further, in order to ensure the effectiveness of policies and procedures, the person doing such a review shall be different from the one who has framed such policies and procedures.</li>
                <li>ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research will adopt client acceptance policies and procedures that are sensitive to the risk of AML</li>
            </ul>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <ul className="list-decimal pl-6 text-[15px] text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li>ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research will undertake client due diligence ("CDD") measures to an extent that is sensitive to the risk of AML depending on the type of client, business relationship, or transaction</li>
                <li>ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research have in system a place for identifying, monitoring, and reporting suspected ML or TF transactions to the law enforcement authorities; and</li>
                <li>ANUJAY CHOUHAN PROPRIETOR OF Vishtara Capital Research will develop staff members' awareness and vigilance to guard against ML and TF</li>
                <li>Risk-Based Approach-Clients will be classified into Low, Medium, and High- risk categories based on parameters such as nature of business, geographic location, type of products/services used, and transaction patterns. Enhanced Due Diligence (EDD) will be applied for high-risk clients, including Politically Exposed Persons (PEPs), non-resident clients from high-risk jurisdictions, and those engaging in complex or high-value transactions.</li>
                <li>Enhanced Due Diligence (EDD) - For high-risk clients, additional information will be collected and verified, including the source of funds/wealth, and transactions will be subject to enhanced monitoring. Periodic review frequency will be higher for such clients.</li>
                <li>Data Protection &amp; Confidentiality- Research Analyst ensure secure storage of all KYC and transaction data, with access restricted to authorized personnel only. Data will be protected in compliance with applicable privacy laws.</li>
            </ul>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4">This policy is reviewed and approved at the Board meeting held on the 01 day of November, 2025 at the registered office of the company.</p>

            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">Designated Principal Officer - Anujay Chouhan</h2>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4">In compliance with SEBI guidelines and as per SEBI Master Circular dated June 06, 2024 Ms. Anujay Chouhan is appointed Principal Officer.</p>
            <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4">He will be responsible for implementing and enforcing the AML/CFT framework, monitoring transactions, and filing STRs with FIU- IND. In the case of any further information/clarification is required in this regard, the "Principal Officer" may be contacted.</p>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[15px] text-slate-800 dark:text-slate-200 font-bold">For Vishtara Capital Research</p>
                <p className="text-[15px] text-slate-800 dark:text-slate-200 mt-2">Anujay Chouhan</p>
                <p className="text-[15px] text-slate-600 dark:text-slate-400">Authorised Signatory</p>
                <p className="text-[15px] text-slate-600 dark:text-slate-400">Date: 05/11/2025</p>
            </div>
            
            
            
        </div>

        
        <div className="mb-8 scroll-mt-28">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <p className="text-base text-slate-600 dark:text-slate-400">For any clarification regarding this policy, please contact:</p>
                    <p className="text-[15px] text-slate-700 dark:text-slate-300 mt-1"><strong className="font-bold">Principal Officer:</strong> Anujay Chouhan</p>
                    <p className="text-[15px] text-slate-700 dark:text-slate-300"><strong className="font-bold">Email:</strong> chouhananujay@gmail.com</p>
                    <p className="text-[15px] text-slate-700 dark:text-slate-300"><strong className="font-bold">Phone:</strong> +91 86020 27324</p>
                </div>
                <div className="text-right">
                    <p className="text-base text-slate-600 dark:text-slate-400">Last Updated: November 05, 2025</p>
                    <p className="text-base text-slate-600 dark:text-slate-400 mt-1">Version: 1.0 | Approved by Board</p>
                </div>
            </div>
            
        </div>
    </div>
    </PolicyLayout>
  );
}
