import React from "react";
import PolicyLayout from "../../components/PolicyLayout";

export default function GrievanceEscalationMatrix() {
  return (
    <PolicyLayout title="Grievance Escalation Matrix" description="Vishtara Capital Research Policy Document">
      <div className="policy-content-wrapper">
                
                <div className="mb-8 scroll-mt-28">
                    <div className="flex items-start gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-[#0939a4]/10 dark:bg-[#FBB040]/10 flex items-center justify-center text-[#0939a4] dark:text-[#FBB040] text-sm font-black shrink-0">01</div>
                        <div>
                            <h2 className="font-bold text-slate-800 dark:text-slate-200 text-lg mb-2">Step 1: File Internal Complaint</h2>
                            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">Connect directly with our internal customer service deck via phone or email channels. All issues will be recorded, investigated, and addressed promptly.</p>
                        </div>
                    </div>
                </div>

                <div className="mb-8 scroll-mt-28">
                    <div className="flex items-start gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-[#0939a4]/10 dark:bg-[#FBB040]/10 flex items-center justify-center text-[#0939a4] dark:text-[#FBB040] text-sm font-black shrink-0">02</div>
                        <div>
                            <h2 className="font-bold text-slate-800 dark:text-slate-200 text-lg mb-2">Step 2: SEBI SCORES 2.0 Platform Escalation</h2>
                            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3">If our internal resolution does not completely satisfy your requirements, investors can file a formal complaint on the centralized database portal.</p>
                            <a href="https://scores.sebi.gov.in/" target="_blank" rel="noopener noreferrer" aria-label="File a complaint on SEBI SCORES 2.0 – investor grievance redressal portal (opens in new tab)" className="inline-flex items-center gap-2 text-[15px] font-bold text-[#0939a4] dark:text-[#FBB040] hover:underline">
                                SEBI SCORES 2.0 – Investor Grievance Portal
                                <i aria-hidden="true" className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mb-8 scroll-mt-28">
                    <div className="flex items-start gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-[#0939a4]/10 dark:bg-[#FBB040]/10 flex items-center justify-center text-[#0939a4] dark:text-[#FBB040] text-sm font-black shrink-0">03</div>
                        <div>
                            <h2 className="font-bold text-slate-800 dark:text-slate-200 text-lg mb-2">Step 3: Online Dispute Resolution (SmartODR)</h2>
                            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Alternatively, you can escalate unresolved disputes to formal online conciliation or legal market arbitration channels via the SmartODR portal.</p>
                            <a href="https://smartodr.in/" target="_blank" rel="noopener noreferrer" aria-label="Resolve your dispute on Smart ODR – online dispute resolution platform (opens in new tab)" className="inline-flex items-center gap-2 text-[15px] font-bold text-[#0939a4] dark:text-[#FBB040] hover:underline">
                                Smart ODR – Online Dispute Resolution Platform
                                <i aria-hidden="true" className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                            </a>
                        </div>
                    </div>
                </div>

      </div>
    </PolicyLayout>
  );
}
