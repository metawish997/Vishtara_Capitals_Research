import React, { useState } from "react";
import PolicyLayout from "../../components/PolicyLayout";

export default function AccountDeletion() {
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
        setSuccess(true);
    }, 500);
  };

  return (
    <PolicyLayout title="Account Deletion" description="Vishtara Capital Research Policy Document">
      <div className="policy-content-wrapper">
        
        <div className="mb-8">
            <h3 className="text-3xl font-bold text-[#0939a4] dark:text-[#FBB040] mb-3">Account Deletion Request</h3>
            <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                We are sorry to see you go. If you wish to delete your account and associated data from our systems, please read the instructions below and fill out the deletion request form.
            </p>
        </div>

        <div className="mb-8">
            <h3 className="text-2xl font-bold text-[#0939a4] dark:text-[#FBB040] mb-3">Important Information About Account Deletion</h3>
            <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                Please review the following information before submitting your account deletion request:
            </p>
            <ul className="mt-4 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 space-y-4">
                <li>Once deleted, your account details, research access, watchlist settings, and profiles will be permanently removed.</li>
                <li>According to SEBI and other compliance guidelines, we are legally required to retain transaction invoices and compliance documentation (like signed agreements and KRA verification histories) for a specified statutory period. These will not be deleted.</li>
                <li>Any active subscriptions will be cancelled immediately, and no refund will be issued for the remaining duration of your plan.</li>
            </ul>
        </div>

        <div className="mb-8 max-w-2xl">
            {success ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 rounded-2xl flex items-start gap-3">
                    <i className="fa-solid fa-circle-check text-emerald-500 text-lg mt-0.5"></i>
                    <div>
                        <p className="font-bold text-sm">Request Submitted Successfully</p>
                        <p className="text-xs text-emerald-700 dark:text-emerald-500 mt-0.5">We have received your account deletion request. Our compliance team will process your request and permanently remove your data within 48 to 72 business hours.</p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2" htmlFor="first_name">First Name *</label>
                            <input type="text" name="first_name" id="first_name" required className="w-full bg-transparent dark:bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold focus:border-[#0939a4] dark:focus:border-[#FBB040] focus:outline-none transition-all dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2" htmlFor="last_name">Last Name *</label>
                            <input type="text" name="last_name" id="last_name" required className="w-full bg-transparent dark:bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold focus:border-[#0939a4] dark:focus:border-[#FBB040] focus:outline-none transition-all dark:text-white" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2" htmlFor="email">Registered Email Address *</label>
                            <input type="email" name="email" id="email" required className="w-full bg-transparent dark:bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold focus:border-[#0939a4] dark:focus:border-[#FBB040] focus:outline-none transition-all dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2" htmlFor="phone">Registered Mobile Number *</label>
                            <input type="text" name="phone" id="phone" required className="w-full bg-transparent dark:bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold focus:border-[#0939a4] dark:focus:border-[#FBB040] focus:outline-none transition-all dark:text-white" />
                        </div>
                    </div>

                    <div className="flex items-start gap-3 mt-2">
                        <input type="checkbox" id="consent" required className="mt-1" />
                        <label className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed" htmlFor="consent">
                            I understand that this request will permanently terminate my account and my active subscriptions. I authorize Vishtara Capital Research to delete all of my non-regulatory data from its systems. *
                        </label>
                    </div>

                    <div className="pt-2">
                        <button type="submit" className="px-8 py-3 bg-[#0939a4] dark:bg-[#FBB040] hover:bg-[#082f8a] dark:hover:bg-[#f9a01b] text-white dark:text-slate-900 rounded-xl text-sm font-bold transition-all">
                            Submit Deletion Request
                        </button>
                    </div>
                </form>
            )}
        </div>

      </div>
    </PolicyLayout>
  );
}
