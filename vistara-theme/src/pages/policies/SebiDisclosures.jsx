import React from "react";
import PolicyLayout from "../../components/PolicyLayout";

export default function SebiDisclosures() {
  return (
    <PolicyLayout title="Sebi Disclosures" description="Vishtara Capital Research Policy Document">
      <div className="policy-content-wrapper">
                
                <div className="mb-8 scroll-mt-28">
                    <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-[#0939a4]/10 dark:bg-[#FBB040]/10 flex items-center justify-center text-[#0939a4] dark:text-[#FBB040]">
                            <i className="fa-solid fa-certificate text-lg"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-[#0939a4] dark:text-[#FBB040]">SEBI Statutory Disclosures</h2>
                    </div>
                    <div className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed text-justify space-y-4">
                        <p>
                            Mandatory legal compliance ledger details issued in complete accordance with the SEBI (Research Analyst) Regulations, 2014.
                        </p>
                    </div>
                </div>

                <div className="mb-8 scroll-mt-28">
                    <h2 className="text-xl font-bold text-[#0939a4] dark:text-[#FBB040] mb-4">Registration &amp; Officer Particulars</h2>
                    <div className="border border-slate-100 dark:border-slate-800 rounded text-[15px] text-slate-600 dark:text-slate-400">
                        <div className="grid grid-cols-2 p-3.5 border-b border-slate-100 dark:border-slate-800">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">Entity Name</span>
                            <span className="text-right">Vishtara Capital Research</span>
                        </div>
                        <div className="grid grid-cols-2 p-3.5 border-b border-slate-100 dark:border-slate-800">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">SEBI Registration Number</span>
                            <span className="text-right">INH000027779</span>
                        </div>
                        <div className="grid grid-cols-2 p-3.5 border-b border-slate-100 dark:border-slate-800">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">Registration Horizon</span>
                            <span className="text-right">Oct 31, 2025 - Oct 30, 2030</span>
                        </div>
                        <div className="grid grid-cols-2 p-3.5 border-b border-slate-100 dark:border-slate-800">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">Principal Officer &amp; Proprietor</span>
                            <span className="text-right">Anujay Chouhan</span>
                        </div>
                        <div className="grid grid-cols-2 p-3.5 ">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">BSE Enlistment Identifier</span>
                            <span className="text-right">6838</span>
                        </div>
                    </div>
                </div>

                <div className="mb-8 scroll-mt-28">
                    <h2 className="text-xl font-bold text-[#0939a4] dark:text-[#FBB040] mb-4">Scope of Services</h2>
                    <div className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed text-justify space-y-4">
                        <p>
                            Our capabilities are restricted strictly to producing independent research analysis recommendations within the Indian Securities Market. We hold zero alignment with portfolio management, investment advisory configuration frameworks, execution channels, or asset allocation services.
                        </p>
                    </div>
                </div>

                <div className="mb-8 scroll-mt-28">
                    <h2 className="text-xl font-bold text-[#0939a4] dark:text-[#FBB040] mb-4">Disciplinary &amp; Material History</h2>
                    <div className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed text-justify space-y-4">
                        <p>
                            <strong className="text-slate-800 dark:text-slate-200">Zero Flags / Absolute Clean Record:</strong> No penalties, warnings, structural directions, or inspections litigations have ever been initiated, filed, or passed by SEBI or any legal court machinery against the Research Analyst.
                        </p>
                    </div>
                </div>

                <div className="mb-8 scroll-mt-28">
                    <h2 className="text-xl font-bold text-[#0939a4] dark:text-[#FBB040] mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Direct Regulatory Negative Affirmations</h2>
                    <ul className="space-y-4 pl-5 list-disc text-[15px] text-slate-600 dark:text-slate-400">
                        <li>The RA or staff hold zero market-making setups for target companies.</li>
                        <li>No investment banking or merchant brokerage compensation structures exist.</li>
                        <li>No corporate board positions or directorship ties are maintained with recommended assets.</li>
                    </ul>
                </div>

      </div>
    </PolicyLayout>
  );
}
