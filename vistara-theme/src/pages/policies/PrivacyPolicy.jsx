import React from "react";
import PolicyLayout from "../../components/PolicyLayout";

export default function PrivacyPolicy() {
  return (
    <PolicyLayout title="Privacy Policy" description="Vishtara Capital Research Policy Document">
      <div className="policy-content-wrapper">
                
                <div id="info-collect" className="mb-8 scroll-mt-28">
                    <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-[#0939a4]/10 dark:bg-[#FBB040]/10 flex items-center justify-center text-[#0939a4] dark:text-[#FBB040]">
                            <i className="fa-solid fa-database text-lg"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-[#0939a4] dark:text-[#FBB040]">1. Information We Collect</h2>
                    </div>
                    <div className="mt-3 text-[15px] text-slate-700 dark:text-slate-400 leading-relaxed text-justify space-y-4">
                        <p>We may collect personal and transactional data to fulfill our onboarding requirements, regulatory responsibilities, and provide reliable research services:</p>
                        <ul className="space-y-4 pl-5 list-disc text-[15px] text-slate-700 dark:text-slate-400">
                            <li><strong className="text-slate-800 dark:text-slate-200">Identifiable Data:</strong> Full name, email address, phone number</li>
                            <li><strong className="text-slate-800 dark:text-slate-200">KYC Documents:</strong> Permanent Account Number (PAN), address proofs, and identity verification proofs</li>
                            <li><strong className="text-slate-800 dark:text-slate-200">Financial Data:</strong> Payment transaction details and history</li>
                            <li><strong className="text-slate-800 dark:text-slate-200">Usage Data:</strong> Non-personal website usage data, diagnostics, and analytics</li>
                        </ul>
                    </div>
                </div>

                
                <div id="info-use" className="mb-8 scroll-mt-28">
                    <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-[#0939a4]/10 dark:bg-[#FBB040]/10 flex items-center justify-center text-[#0939a4] dark:text-[#FBB040]">
                            <i className="fa-solid fa-chart-line text-lg"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-[#0939a4] dark:text-[#FBB040]">2. Use of Information</h2>
                    </div>
                    <div className="mt-3 text-[15px] text-slate-700 dark:text-slate-400 leading-relaxed text-justify space-y-4">
                        <p>Your collected information is strictly utilized to ensure seamless delivery and compliance requirements:</p>
                        <ul className="space-y-4 pl-5 list-disc text-[15px] text-slate-700 dark:text-slate-400">
                            <li>KYC compliance checks and customer verification procedures</li>
                            <li>Regulatory reporting to relevant agencies under SEBI and other governing bodies</li>
                            <li>Effective service delivery and distribution of research calls</li>
                            <li>Proactive customer communication and updates regarding subscriptions</li>
                            <li>Fulfillment of legal obligations, compliance tasks, and auditing</li>
                        </ul>
                    </div>
                </div>

                
                <div id="info-share" className="mb-8 scroll-mt-28">
                    <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-[#0939a4]/10 dark:bg-[#FBB040]/10 flex items-center justify-center text-[#0939a4] dark:text-[#FBB040]">
                            <i className="fa-solid fa-share-nodes text-lg"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-[#0939a4] dark:text-[#FBB040]">3. Data Sharing</h2>
                    </div>
                    <div className="mt-3 text-[15px] text-slate-700 dark:text-slate-400 leading-relaxed text-justify space-y-4">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 border-l-4 border-[#0939a4] dark:border-[#FBB040] pl-4 italic">We do not sell, trade, or rent your personal information to third parties.</p>
                        <p>Your data is kept private and shared only under the following necessary scenarios:</p>
                        <ul className="space-y-4 pl-5 list-disc text-[15px] text-slate-700 dark:text-slate-400">
                            <li>With SEBI, RAASB (Research Analyst Administration and Supervision Body), or KRA (KYC Registration Agencies)</li>
                            <li>With law enforcement, legal advisors, or regulatory authorities, if mandatory under Indian law</li>
                        </ul>
                    </div>
                </div>

                
                <div id="info-security" className="mb-8 scroll-mt-28">
                    <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-[#0939a4]/10 dark:bg-[#FBB040]/10 flex items-center justify-center text-[#0939a4] dark:text-[#FBB040]">
                            <i className="fa-solid fa-lock text-lg"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-[#0939a4] dark:text-[#FBB040]">4. Data Security</h2>
                    </div>
                    <div className="mt-3 text-[15px] text-slate-700 dark:text-slate-400 leading-relaxed text-justify space-y-4">
                        <p>We deploy robust, standard technical and organizational security measures to shield your data from unauthorized access or alteration. However, please note:</p>
                        <ul className="space-y-4 pl-5 list-disc text-[15px] text-slate-700 dark:text-slate-400">
                            <li>Data transmission over the internet or cloud storage can never be guaranteed 100% secure</li>
                            <li>You accept and acknowledge this inherent security risk when subscribing to our services</li>
                        </ul>
                    </div>
                </div>

                
                <div id="info-retention" className="mb-8 scroll-mt-28">
                    <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-[#0939a4]/10 dark:bg-[#FBB040]/10 flex items-center justify-center text-[#0939a4] dark:text-[#FBB040]">
                            <i className="fa-solid fa-clock-rotate-left text-lg"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-[#0939a4] dark:text-[#FBB040]">5. Data Retention</h2>
                    </div>
                    <div className="mt-3 text-[15px] text-slate-700 dark:text-slate-400 leading-relaxed text-justify space-y-4">
                        <p>We preserve client profiles and records in compliance with the SEBI Regulations and relevant Indian statutory guidelines. Information is stored for the duration required by these laws to facilitate auditing, legal reviews, and historical verification.</p>
                    </div>
                </div>

                
                <div id="info-rights" className="mb-8 scroll-mt-28">
                    <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-[#0939a4]/10 dark:bg-[#FBB040]/10 flex items-center justify-center text-[#0939a4] dark:text-[#FBB040]">
                            <i className="fa-solid fa-user-gear text-lg"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-[#0939a4] dark:text-[#FBB040]">6. Your Rights</h2>
                    </div>
                    <div className="mt-3 text-[15px] text-slate-700 dark:text-slate-400 leading-relaxed text-justify space-y-4">
                        <p>To ensure transparent control over your database files, you retain the following rights:</p>
                        <ul className="space-y-4 pl-5 list-disc text-[15px] text-slate-700 dark:text-slate-400">
                            <li>Correction or revision of inaccurate or outdated personal data</li>
                            <li>Immediate update of active contact details (email or telephone number)</li>
                            <li>Seeking official clarification regarding database processing operations</li>
                        </ul>
                    </div>
                </div>

                
                <div id="info-queries" className="mb-8 scroll-mt-28">
                    <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-[#0939a4]/10 dark:bg-[#FBB040]/10 flex items-center justify-center text-[#0939a4] dark:text-[#FBB040]">
                            <i className="fa-solid fa-envelope-open-text text-lg"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-[#0939a4] dark:text-[#FBB040]">7. Contact for Privacy Queries</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded border border-slate-200 dark:border-slate-700  p-5 flex items-center gap-4 hover:border-[#0939a4]/20 transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-[#0939a4]/5 flex items-center justify-center text-[#0939a4]">
                                <i className="fa-solid fa-envelope text-xl"></i>
                            </div>
                            <div>
                                <span className="block text-[10px] font-black text-slate-700 dark:text-slate-400 uppercase tracking-widest">Email Support</span>
                                <a href="mailto:chouhananujay@gmail.com" className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-[#0939a4] transition-colors break-all">
                                    chouhananujay@gmail.com
                                </a>
                            </div>
                        </div>

                        <div className="rounded border border-slate-200 dark:border-slate-700  p-5 flex items-center gap-4 hover:border-[#0939a4]/20 transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-[#0939a4]/5 flex items-center justify-center text-[#0939a4]">
                                <i className="fa-solid fa-phone text-xl"></i>
                            </div>
                            <div>
                                <span className="block text-[10px] font-black text-slate-700 dark:text-slate-400 uppercase tracking-widest">Contact Phone</span>
                                <a href="tel:+91 86020 27324" className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-[#0939a4] transition-colors">
                                    +91 86020 27324
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

      </div>
    </PolicyLayout>
  );
}
