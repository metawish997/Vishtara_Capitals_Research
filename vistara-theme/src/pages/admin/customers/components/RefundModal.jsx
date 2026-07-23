import React from 'react';

const RefundModal = ({ isOpen, onClose, userId, subscriptionId }) => {
    if (!isOpen) return null;

    return (
        <div id="refundModal" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="px-4 py-2.5 flex justify-between items-center border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-tight">Create Refund</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1 rounded-md transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Form */}
                <form className="p-4 flex flex-col gap-4">
                    {/* Hidden IDs */}
                    <input type="hidden" name="user_id" value={userId} />
                    <input type="hidden" name="user_subscription_id" value={subscriptionId} />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Transaction ID */}
                        <div className="space-y-1">
                            <label className="block text-[8px] font-bold uppercase tracking-widest text-slate-400">
                                Transaction ID
                            </label>
                            <input type="text" name="transaction_id" required
                                   className="w-full rounded-md !h-7 !py-0 !px-2 text-[10px] bg-white border border-slate-200 focus:border-[#011D52] focus:ring-1 focus:ring-[#011D52] outline-none transition-all text-slate-800 m-0" />
                        </div>

                        {/* Refund Amount */}
                        <div className="space-y-1">
                            <label className="block text-[8px] font-bold uppercase tracking-widest text-slate-400">
                                Refund Amount
                            </label>
                            <input type="number" step="0.01" name="refund_amount" required
                                   className="w-full rounded-md !h-7 !py-0 !px-2 text-[10px] bg-white border border-slate-200 focus:border-[#011D52] focus:ring-1 focus:ring-[#011D52] outline-none transition-all text-slate-800 m-0" />
                        </div>

                        {/* Proof Image */}
                        <div className="space-y-1">
                            <label className="block text-[8px] font-bold uppercase tracking-widest text-slate-400">
                                Refund Proof
                            </label>
                            <input type="file" name="refund_proof_image" accept="image/*"
                                   className="w-full rounded-md !h-7 !py-0 text-[9px] bg-white border border-slate-200 focus:border-[#011D52] focus:ring-1 focus:ring-[#011D52] outline-none transition-all text-slate-600 m-0 file:mr-2 file:h-full file:px-2 file:border-0 file:text-[8px] file:font-bold file:uppercase file:tracking-widest file:bg-slate-50 file:text-[#011D52] hover:file:bg-slate-100" />
                        </div>

                        {/* Refund Reason */}
                        <div className="space-y-1 md:col-span-3">
                            <label className="block text-[8px] font-bold uppercase tracking-widest text-slate-400">
                                Refund Reason (Customer)
                            </label>
                            <textarea name="refund_reason" rows="2" required
                                      className="w-full rounded-md px-2 py-1 text-[10px] bg-white border border-slate-200 focus:border-[#011D52] focus:ring-1 focus:ring-[#011D52] outline-none transition-all text-slate-800 resize-none m-0"></textarea>
                        </div>

                        {/* Admin Note */}
                        <div className="space-y-1 md:col-span-3">
                            <label className="block text-[8px] font-bold uppercase tracking-widest text-slate-400">
                                Admin Note (Internal)
                            </label>
                            <textarea name="admin_note" rows="2"
                                      className="w-full rounded-md px-2 py-1 text-[10px] bg-white border border-slate-200 focus:border-[#011D52] focus:ring-1 focus:ring-[#011D52] outline-none transition-all text-slate-800 resize-none m-0"></textarea>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                        <button type="button"
                                onClick={onClose}
                                className="px-3 !h-7 rounded-md text-[8px] font-bold uppercase tracking-widest bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors m-0">
                            Cancel
                        </button>
                        <button type="submit"
                                className="px-3 !h-7 rounded-md text-[8px] font-bold uppercase tracking-widest bg-[#011D52] text-white hover:bg-[#02143a] transition-colors shadow-sm m-0">
                            Record Refund
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RefundModal;
