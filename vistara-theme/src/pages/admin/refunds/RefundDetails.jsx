import React from 'react';
import { Link, useParams } from 'react-router-dom';

const RefundDetails = () => {
    const { id } = useParams();

    // Mock Data for Audit
    const refund = {
        id: 1,
        user: { name: 'Rahul Sharma', id: 1024, email: 'rahul@example.com' },
        subscription: { id: 882, plan: 'Gold Research Master', period: '15 Apr – 15 May 2024' },
        invoice: { number: 'INV-2024-0091' },
        refunded_by: { name: 'Admin Amit' },
        transaction: { id: 'TXN_9928312', gateway: 'RAZORPAY', amount: 4999.00, date: '2024-04-20 14:30' },
        reason: 'Duplicate payment made by mistake. Customer contacted support within 2 hours of transaction.',
        admin_note: 'Verified with gateway logs. Refund processed manually via Razorpay dashboard.',
        proof: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=600&auto=format&fit=crop'
    };

    return (
        <div className="font-plus-jakarta text-xs">
            <div className="space-y-8">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link to="/admin/refunds" className="group p-3 bg-white rounded-md border border-slate-200 shadow-sm hover:bg-slate-50 transition-all">
                            <svg className="w-5 h-5 text-slate-500 group-hover:text-slate-800 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                        </Link>
                        <div>
                            <h1 className="text-xs font-semibold font-bold text-slate-800 tracking-tight">Audit Protocol</h1>
                            <p className="text-slate-500 mt-1 font-bold uppercase tracking-widest text-[10px]">Case ID: #{id} • Verified Authentication Record</p>
                        </div>
                    </div>
                    <button className="bg-[slate-800] text-[slate-50] px-8 py-3 rounded-md font-bold text-[10px] uppercase tracking-widest shadow-sm hover:opacity-90 transition-all active:scale-95">Print Audit Log</button>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-12 space-y-12">
                    
                    {/* User & Subscription Block */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol Beneficiary</p>
                            <p className="text-xs font-bold text-slate-800">{refund.user.name}</p>
                            <p className="text-[10px] font-bold text-[[#011d52]] uppercase">{refund.user.email}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Service Node ID</p>
                            <p className="text-xs font-bold text-slate-800">#{refund.subscription.id}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{refund.subscription.plan}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Linked Invoice</p>
                            <p className="text-xs font-bold text-slate-800">{refund.invoice.number}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Fiscal Document</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Authorization Agent</p>
                            <p className="text-xs font-bold text-slate-800">{refund.refunded_by.name}</p>
                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">System Verified</p>
                        </div>
                    </div>

                    <div className="h-[1px] w-full bg-[slate-200]"></div>

                    {/* Transaction Block */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Transaction Ref</p>
                            <p className="text-xs font-mono font-bold text-slate-800">{refund.transaction.id}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gateway Node</p>
                            <p className="text-xs font-bold text-[[#011d52]] uppercase tracking-widest">{refund.transaction.gateway}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Restitution Amount</p>
                            <p className="text-xs font-semibold font-bold text-slate-800 tracking-tight">₹{refund.transaction.amount.toLocaleString()}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Finalization Date</p>
                            <p className="text-xs font-bold text-slate-800">{refund.transaction.date}</p>
                        </div>
                    </div>

                    <div className="h-[1px] w-full bg-[slate-200]"></div>

                    {/* Reasoning Block */}
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol Restitution Reasoning</p>
                            <div className="p-4 bg-slate-50 rounded-md border border-slate-200">
                                <p className="text-xs font-medium text-slate-500 leading-relaxed italic">"{refund.reason}"</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Institutional Notes (Internal)</p>
                            <div className="p-4 bg-slate-50 rounded-md border border-slate-200">
                                <p className="text-xs font-bold text-slate-800 leading-relaxed italic">"{refund.admin_note}"</p>
                            </div>
                        </div>
                    </div>

                    {/* Authentication Proof Block */}
                    {refund.proof && (
                        <div className="space-y-4">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Transaction Authentication Asset</p>
                            <div className="relative group max-w-lg">
                                <img src={refund.proof} className="w-full rounded-md border-4 border-[slate-50] shadow-2xl transition-transform hover:scale-[1.02] duration-500" alt="Audit Proof" />
                                <div className="absolute top-6 right-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-md border border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-800 shadow-xl">Verified Document</div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default RefundDetails;
