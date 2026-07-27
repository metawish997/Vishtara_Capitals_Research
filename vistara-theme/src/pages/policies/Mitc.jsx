import React from "react";
import PolicyLayout from "../../components/PolicyLayout";

export default function Mitc() {
  return (
    <PolicyLayout title="Mitc" description="Vishtara Capital Research Policy Document">
      <div className="policy-content-wrapper">
        
        <div className="mb-8" id="services">
            <h3 className="text-2xl font-bold text-[#0939a4] dark:text-[#FBB040] mb-3">1. Availing Services &amp; Obligations</h3>
            <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                By accepting delivery of the research service, the client confirms that he/she has elected to subscribe to the research service of the RA at his/her sole discretion. The RA confirms that research services shall be rendered in accordance with the provisions of SEBI Research Analyst Regulations.
            </p>
            <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                Both RA and the client shall be bound by the SEBI Act, 1992, along with all rules, notifications, and regulations updated from time to time.
            </p>
        </div>

        <div className="mb-8" id="kyc">
            <h3 className="text-2xl font-bold text-[#0939a4] dark:text-[#FBB040] mb-3">2. Client Information &amp; KYC</h3>
            <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                The client shall furnish all details in full as required by the RA in its standard onboarding documentation. The RA shall collect, store, upload, and check verification records with an authorized SEBI-registered KYC Registration Agency (KRA) prior to charging any service fees.
            </p>
        </div>

        <div className="mb-8" id="market-risk">
            <h3 className="text-2xl font-bold text-[#0939a4] dark:text-[#FBB040] mb-3">3. Risk Disclosures &amp; Fee Disclosures</h3>
            <ul className="mt-4 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 space-y-4">
                <li>Any investment made based on recommendations are subject to market risks.</li>
                <li>Recommendations do not provide any explicit or implicit assurance or guarantee of returns.</li>
                <li>There is no recourse to claim any financial losses incurred on investments made based on published research reports.</li>
                <li><strong className="text-slate-800 dark:text-slate-200">Fee Limitation:</strong> The maximum statutory fee that may be charged by the RA is ₹1.51 Lakhs per annum per family of the client.</li>
            </ul>
        </div>

        <div className="mb-8" id="termination">
            <h3 className="text-2xl font-bold text-[#0939a4] dark:text-[#FBB040] mb-3">4. Termination, Refunds &amp; Grievances</h3>
            <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                In case of suspension of the Certificate of Registration of the RA for more than 60 days or direct cancellation of registration, the RA shall proactively refund the subscription fees on a strict pro-rata basis for the remaining unexpired timeline.
            </p>
            <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                Deficiencies or download interruptions must be escalated to the Proprietor (<strong className="text-slate-800 dark:text-slate-200">Anujay Chouhan</strong>) at <strong className="text-slate-800 dark:text-slate-200">chouhananujay@gmail.com</strong>. Grievances will be addressed within 7 business working days.
            </p>
        </div>

        <div className="mb-8" id="part-c">
            <h3 className="text-2xl font-bold text-[#0939a4] dark:text-[#FBB040] mb-3">Part C: Core MITC Guidelines</h3>
            <ul className="mt-4 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 space-y-4">
                <li><strong className="text-slate-800 dark:text-slate-200">No Execution Privileges:</strong> The RA cannot execute or carry out any buy/sell trades on behalf of the client. Never permit trade execution authorization.</li>
                <li><strong className="text-slate-800 dark:text-slate-200">Non-Cash Mode:</strong> Fees must be routed entirely via banking infrastructure (Cheque, Online Bank Transfer, UPI). <strong className="text-slate-800 dark:text-slate-200">Cash payments are strictly prohibited.</strong></li>
                <li><strong className="text-slate-800 dark:text-slate-200">Credential Protection:</strong> The RA shall never request your trading passwords, demat credentials, or banking OTPs. Never disclose passwords to anyone.</li>
            </ul>
        </div>

      </div>
    </PolicyLayout>
  );
}
