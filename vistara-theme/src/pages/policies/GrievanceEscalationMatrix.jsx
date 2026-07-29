import React from "react";
import PolicyLayout from "../../components/PolicyLayout";

export default function GrievanceEscalationMatrix() {
  return (
    <PolicyLayout title="Grievance Escalation Matrix" description="Vishtara Capital Research Policy Document">
      <div className="policy-content-wrapper p-0 md:p-2">
         <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <table className="w-full text-left border-collapse min-w-[800px]">
               <thead>
                  <tr className="bg-slate-800 dark:bg-slate-900 text-white">
                     <th scope="col" className="p-4 font-semibold uppercase text-sm tracking-wider w-[80px] text-center border-b border-slate-700">Level</th>
                     <th scope="col" className="p-4 font-semibold uppercase text-sm tracking-wider w-[300px] border-b border-slate-700">Escalation Step</th>
                     <th scope="col" className="p-4 font-semibold uppercase text-sm tracking-wider border-b border-slate-700">Description</th>
                     <th scope="col" className="p-4 font-semibold uppercase text-sm tracking-wider w-[220px] border-b border-slate-700">Action Link</th>
                  </tr>
               </thead>
               <tbody className="text-[15px] bg-white dark:bg-slate-900/50">
                  <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                     <th scope="row" className="p-4 text-center border-r border-slate-100 dark:border-slate-800">
                         <div className="inline-flex w-10 h-10 rounded-xl bg-[#0939a4]/10 dark:bg-[#FBB040]/10 items-center justify-center text-[#0939a4] dark:text-[#FBB040] text-sm font-black">01</div>
                     </th>
                     <td className="p-4 font-bold text-slate-800 dark:text-slate-200">Step 1: File Internal Complaint</td>
                     <td className="p-4 text-slate-700 dark:text-slate-300 leading-relaxed">Connect directly with our internal customer service deck via phone or email channels. All issues will be recorded, investigated, and addressed promptly.</td>
                     <td className="p-4 text-slate-700 dark:text-slate-400 font-medium italic">N/A</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                     <th scope="row" className="p-4 text-center border-r border-slate-100 dark:border-slate-800">
                         <div className="inline-flex w-10 h-10 rounded-xl bg-[#0939a4]/10 dark:bg-[#FBB040]/10 items-center justify-center text-[#0939a4] dark:text-[#FBB040] text-sm font-black">02</div>
                     </th>
                     <td className="p-4 font-bold text-slate-800 dark:text-slate-200">Step 2: SEBI SCORES 2.0 Platform Escalation</td>
                     <td className="p-4 text-slate-700 dark:text-slate-300 leading-relaxed">If our internal resolution does not completely satisfy your requirements, investors can file a formal complaint on the centralized database portal.</td>
                     <td className="p-4">
                        <a href="https://scores.sebi.gov.in/" target="_blank" rel="noopener noreferrer" aria-label="File a complaint on SEBI SCORES 2.0 – investor grievance redressal portal (opens in new tab)" className="inline-flex items-center gap-2 font-bold text-[#0939a4] dark:text-[#FBB040] hover:underline">
                            SEBI SCORES 2.0
                            <i aria-hidden="true" className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                        </a>
                     </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                     <th scope="row" className="p-4 text-center border-r border-slate-100 dark:border-slate-800">
                         <div className="inline-flex w-10 h-10 rounded-xl bg-[#0939a4]/10 dark:bg-[#FBB040]/10 items-center justify-center text-[#0939a4] dark:text-[#FBB040] text-sm font-black">03</div>
                     </th>
                     <td className="p-4 font-bold text-slate-800 dark:text-slate-200">Step 3: Online Dispute Resolution (SmartODR)</td>
                     <td className="p-4 text-slate-700 dark:text-slate-300 leading-relaxed">Alternatively, you can escalate unresolved disputes to formal online conciliation or legal market arbitration channels via the SmartODR portal.</td>
                     <td className="p-4">
                        <a href="https://smartodr.in/" target="_blank" rel="noopener noreferrer" aria-label="Resolve your dispute on Smart ODR – online dispute resolution platform (opens in new tab)" className="inline-flex items-center gap-2 font-bold text-[#0939a4] dark:text-[#FBB040] hover:underline">
                            Smart ODR
                            <i aria-hidden="true" className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                        </a>
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
    </PolicyLayout>
  );
}
