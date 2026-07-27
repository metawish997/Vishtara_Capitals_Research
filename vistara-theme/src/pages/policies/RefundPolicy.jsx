import React from "react";
import PolicyLayout from "../../components/PolicyLayout";

export default function RefundPolicy() {
  return (
    <PolicyLayout title="Refund Policy" description="Vishtara Capital Research Policy Document">
      <div className="policy-content-wrapper">
                
                <div className="mb-8 scroll-mt-28">
                    <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-[#0939a4]/10 dark:bg-[#FBB040]/10 flex items-center justify-center text-[#0939a4] dark:text-[#FBB040]">
                            <i className="fa-solid fa-rotate-left text-lg"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-[#0939a4] dark:text-[#FBB040]">Refund Policy</h2>
                    </div>
                    <div className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed text-justify space-y-4">
                        <p>
                            Transparent statutory refund framework detailing conditions for pro-rata processing of fees for unexpired periods under regulatory directives.
                        </p>
                    </div>
                </div>

                <div className="mb-8 scroll-mt-28">
                    <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-[#0939a4]/10 dark:bg-[#FBB040]/10 flex items-center justify-center text-[#0939a4] dark:text-[#FBB040]">
                            <i className="fa-solid fa-circle-check text-lg"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-[#0939a4] dark:text-[#FBB040]">Refund Eligibility</h2>
                    </div>
                    <ul className="space-y-4 pl-5 list-disc text-[15px] text-slate-600 dark:text-slate-400">
                        <li>Allowed exclusively for the unexpired portion of your active subscription.</li>
                        <li>Calculated on an accurate pro-rata timeframe basis.</li>
                        <li>No hidden penalty or breakage fees are applicable.</li>
                    </ul>
                </div>

                <div className="mb-8 scroll-mt-28">
                    <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-[#0939a4]/10 dark:bg-[#FBB040]/10 flex items-center justify-center text-[#0939a4] dark:text-[#FBB040]">
                            <i className="fa-solid fa-circle-xmark text-lg"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-[#0939a4] dark:text-[#FBB040]">Non-Refundable Cases</h2>
                    </div>
                    <ul className="space-y-4 pl-5 list-disc text-[15px] text-slate-600 dark:text-slate-400">
                        <li>Partial month usage fields are non-refundable.</li>
                        <li>No compensation or reversal claims on historical research reports consumed.</li>
                    </ul>
                </div>

                <div className="mb-8 scroll-mt-28">
                    <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-[#0939a4]/10 dark:bg-[#FBB040]/10 flex items-center justify-center text-[#0939a4] dark:text-[#FBB040]">
                            <i className="fa-solid fa-scale-balanced text-lg"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-[#0939a4] dark:text-[#FBB040]">Regulatory Actions &amp; Suspension</h2>
                    </div>
                    <div className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed text-justify space-y-4">
                        <p>
                            If the Research Analyst's SEBI registration is suspended for more than 60 days or permanently cancelled, all active subscriptions will be systematically calculated and outstanding unexpired balances refunded safely to clients.
                        </p>
                    </div>
                </div>

                <div className="mb-8 scroll-mt-28">
                    <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-[#0939a4]/10 dark:bg-[#FBB040]/10 flex items-center justify-center text-[#0939a4] dark:text-[#FBB040]">
                            <i className="fa-solid fa-business-time text-lg"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-[#0939a4] dark:text-[#FBB040]">Processing and Timelines</h2>
                    </div>
                    <div className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed text-justify space-y-4">
                        <p>
                            Refund processing is channeled back strictly through the original financial transaction gateway architecture.
                        </p>
                        <div className="mt-4 p-4 rounded border border-slate-200 dark:border-slate-700  flex justify-between items-center">
                            <span className="font-bold text-slate-700 dark:text-slate-300">Standard Processing Timeline</span>
                            <span className="font-black text-[#0939a4] dark:text-[#FBB040] bg-[#0939a4]/5 dark:bg-[#FBB040]/10 px-3 py-1 rounded-lg">5 - 7 Business Days</span>
                        </div>
                    </div>
                </div>

      </div>
    </PolicyLayout>
  );
}
