import React from 'react';

const SubscriptionDetailsModal = ({ subscription, isOpen, onClose }) => {
    if (!isOpen || !subscription) return null;

    const calculateDays = (start, end) => {
        const diffTime = Math.abs(new Date(end) - new Date(start));
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const daysGranted = subscription.payment_payload?.grantedDays || calculateDays(subscription.start_date, subscription.end_date);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl p-5 shadow-2xl relative bg-white border border-slate-200">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
                    <h3 className="text-[12px] font-bold uppercase tracking-tight text-slate-800">Service Allocation Details</h3>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1 rounded-md transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="space-y-5">
                    <div>
                        <p className="text-[8px] font-bold uppercase tracking-widest mb-0.5 text-slate-400">Service Plan</p>
                        <p className="text-[11px] font-bold text-slate-800">{subscription.status?.toLowerCase() === 'demo' ? 'Free Trial / Demo' : (subscription.service_plan?.name || 'Unknown Plan')}</p>
                    </div>

                    <div>
                        <p className="text-[8px] font-bold uppercase tracking-widest mb-0.5 text-slate-400">Plan Duration Designation</p>
                        <p className="text-[11px] font-bold text-slate-800">{subscription.status?.toLowerCase() === 'demo' ? 'TRIAL' : (subscription.service_plan_duration?.duration || 'Unknown Duration')}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 shadow-sm flex flex-col items-start justify-center">
                            <p className="text-[8px] font-bold uppercase tracking-widest mb-1 text-slate-500">Plan Original Value</p>
                            <p className="text-[11px] font-bold text-slate-800">₹{subscription.service_plan_duration?.price?.toLocaleString('en-IN') || 0}</p>
                        </div>
                        <div className="p-3 rounded-lg border border-[#a7f3d0] bg-[#ecfdf5] shadow-sm flex flex-col items-start justify-center">
                            <p className="text-[8px] font-bold uppercase tracking-widest mb-1 text-[#059669]">Actual Amount Paid</p>
                            <p className="text-[11px] font-black text-slate-800">₹{subscription.amount?.toLocaleString('en-IN') || 0}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg border border-blue-200 bg-blue-50 shadow-sm flex flex-col items-start justify-center">
                            <p className="text-[8px] font-bold uppercase tracking-widest mb-1 text-[#011D52]">Days Provided</p>
                            <p className="text-[11px] font-bold text-slate-800">{daysGranted} Days</p>
                        </div>
                        <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 shadow-sm flex flex-col items-start justify-center">
                            <p className="text-[8px] font-bold uppercase tracking-widest mb-1 text-slate-500">Payment Source</p>
                            <p className="text-[11px] font-bold uppercase text-slate-800">{subscription.payment_gateway || 'Unknown'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <p className="text-[8px] font-bold uppercase tracking-widest mb-0.5 text-slate-400">Start Date</p>
                            <p className="text-[11px] font-bold text-slate-800">{new Date(subscription.start_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-[8px] font-bold uppercase tracking-widest mb-0.5 text-slate-400">Expiry Date</p>
                            <p className="text-[11px] font-bold text-slate-800">{new Date(subscription.end_date).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {subscription.payment_reference && (
                        <div>
                            <p className="text-[8px] font-bold uppercase tracking-widest mb-1 text-slate-400">Notes / Reference</p>
                            <p className="text-[10px] font-medium p-2.5 rounded-lg text-slate-700 bg-slate-50 border border-slate-200">
                                {subscription.payment_reference}
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end pt-3 border-t border-slate-100">
                    <button 
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest transition shadow-sm bg-[#011D52] text-white hover:bg-[#02143a]"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionDetailsModal;
