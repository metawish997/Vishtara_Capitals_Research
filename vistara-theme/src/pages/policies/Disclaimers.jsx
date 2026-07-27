import React from "react";
import PolicyLayout from "../../components/PolicyLayout";

export default function Disclaimers() {
  return (
    <PolicyLayout title="Disclaimers" description="Vishtara Capital Research Policy Document">
      <div className="policy-content-wrapper">
                
                <div id="general" className="mb-8 scroll-mt-28">
                    <h2 className="text-2xl font-bold text-[#0939a4] dark:text-[#FBB040] mb-3">1. Limitations of Liability &amp; Capital Realities</h2>
                    <div className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed space-y-4">
                        <p>Trading/investing in the Stock Market involves considerable systemic volatility. You can lose part or all of your underlying principal asset capital pool. All outputs distributed must be strictly consumed as independent market observations, not financial guidance counsel.</p>
                        <p>We issue zero profit commitments. We hold zero liability for loss matrices incurred by the user based on views generated across our platforms.</p>
                    </div>
                </div>

                <div id="ownership" className="mb-8 scroll-mt-28">
                    <h2 className="text-2xl font-bold text-[#0939a4] dark:text-[#FBB040] mb-3">2. Material Interests &amp; AI Architecture Confirmations</h2>
                    <ul className="space-y-4 text-[15px] text-slate-600 dark:text-slate-400 list-disc pl-5">
                        <li>The RA, relatives, or associates hold <span className="font-bold text-slate-800 dark:text-slate-200">0% actual beneficial stock ownership</span> in any entity subject to publication records.</li>
                        <li><span className="font-bold text-[#0939a4] dark:text-[#FBB040]">No AI Tool Sourcing:</span> In accordance with transparent validation protocols, Vishtara Capital Research confirms that <span className="font-bold text-slate-800 dark:text-slate-200">no automated Artificial Intelligence (AI) generation tools are deployed</span> to form or construct core research recommendations.</li>
                    </ul>
                </div>

                <div id="definitions" className="mb-8 scroll-mt-28">
                    <h2 className="text-2xl font-bold text-[#0939a4] dark:text-[#FBB040] mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">3. Technical Terms Operational Definitions</h2>
                    <div className="space-y-4 text-[15px] font-medium">
                        <div><span className="text-xs uppercase font-black text-[#0939a4] dark:text-[#FBB040] bg-[#0939a4]/5 dark:bg-[#FBB040]/10 px-2 py-0.5 rounded mr-2">Buy</span> <span className="text-slate-600 dark:text-slate-400">Triggers immediately at current market parameters or within noted bands.</span></div>
                        <div><span className="text-xs uppercase font-black text-[#0939a4] dark:text-[#FBB040] bg-[#0939a4]/5 dark:bg-[#FBB040]/10 px-2 py-0.5 rounded mr-2">Stop Loss</span> <span className="text-slate-600 dark:text-slate-400">Strict safety close boundary parameter to shield against volatile market movements. Must be monitored near trading session market close.</span></div>
                        <div><span className="text-xs uppercase font-black text-[#0939a4] dark:text-[#FBB040] bg-[#0939a4]/5 dark:bg-[#FBB040]/10 px-2 py-0.5 rounded mr-2">Add / Accumulate</span> <span className="text-slate-600 dark:text-slate-400">Gradual localized scaling of investment quantities on market price retracements.</span></div>
                        <div><span className="text-xs uppercase font-black text-[#0939a4] dark:text-[#FBB040] bg-[#0939a4]/5 dark:bg-[#FBB040]/10 px-2 py-0.5 rounded mr-2">Hold</span> <span className="text-slate-600 dark:text-slate-400">Preserve existing positioning values when targets or stop-losses have not been breached.</span></div>
                    </div>
                </div>

      </div>
    </PolicyLayout>
  );
}
