import React from "react";
import PolicyLayout from "../../components/PolicyLayout";

export default function RiskWarnings() {
  return (
    <PolicyLayout title="Risk Warnings" description="Vishtara Capital Research Policy Document">
      <div className="policy-content-wrapper">
        
        <div className="mb-8">
            <h3 className="text-3xl font-bold text-[#0939a4] dark:text-[#FBB040] mb-3">Risk Warnings &amp; Disclosures</h3>
            <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                Detailed breakdowns tracking systematic market metrics, asset liquidity risks, currency fluctuations, and sector regulations.
            </p>
        </div>

        <div className="mb-8">
            <p className="mt-3 text-[15px] font-semibold text-slate-800 dark:text-slate-200 border-l-4 border-[#0939a4] dark:border-[#FBB040] pl-4 italic">
                Investments in the securities market are subject to market risks. Read all related documents carefully before investing. Past performance metrics do not constitute valid indicators of future return pools.
            </p>
        </div>

        <div className="mb-8">
            <h3 className="text-2xl font-bold text-[#0939a4] dark:text-[#FBB040] mb-3">Market Dynamics</h3>
            <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                Aggressive intraday price fluctuations caused by macroeconomic changes, shifts in fiscal metrics, and unexpected geopolitical flags.
            </p>
        </div>

        <div className="mb-8">
            <h3 className="text-2xl font-bold text-[#0939a4] dark:text-[#FBB040] mb-3">Liquidity Bottlenecks</h3>
            <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                Lower localized trading volumes on select specific equities can trigger complications during trade execution adjustments.
            </p>
        </div>

        <div className="mb-8">
            <h3 className="text-2xl font-bold text-[#0939a4] dark:text-[#FBB040] mb-3">Sector Regulation</h3>
            <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                Sudden policy amendments or direct modifications to corporate tax rules can severely disrupt targeted industrial spaces.
            </p>
        </div>

      </div>
    </PolicyLayout>
  );
}
