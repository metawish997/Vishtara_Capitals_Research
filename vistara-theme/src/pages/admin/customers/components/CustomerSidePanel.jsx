import React from 'react';

const CustomerSidePanel = ({ isOpen, onClose, customer }) => {
    if (!isOpen || !customer) return null;

    return (
        <div id="userSidePanel" className="fixed inset-0 overflow-hidden z-[100]" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
            <div className="absolute inset-0 overflow-hidden">
                <div onClick={onClose} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"></div>

                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                    <div className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out sm:duration-700">
                        <div className="flex h-full flex-col overflow-y-scroll shadow-2xl bg-white border-l border-slate-200">
                            <div className="px-6 py-6 border-b border-slate-100 bg-slate-50/50">
                                <div className="flex items-start justify-between">
                                    <h2 className="text-[12px] font-bold uppercase tracking-tight text-slate-800" id="panel-title">Customer Profile</h2>
                                    <button onClick={onClose} className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1 rounded-md transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                                <div className="mt-5 flex items-center gap-4">
                                    <div id="panel-avatar" className="w-14 h-14 rounded-xl flex items-center justify-center text-[14px] font-black border border-slate-200 bg-white text-slate-400 overflow-hidden shadow-sm">
                                        {customer.profile_image ? (
                                            <img src={customer.profile_image} alt={customer.name} className="w-full h-full object-cover" />
                                        ) : (
                                            customer.name?.substring(0, 2).toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <p id="panel-name" className="text-[14px] font-bold text-slate-800">{customer.name}</p>
                                        <span id="panel-status-badge" className="mt-1 inline-block">
                                            {customer.status === 'Active' ? (
                                                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest bg-[#ecfdf5] text-[#10b981] border border-[#a7f3d0]">Active</span>
                                            ) : (
                                                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest bg-slate-50 text-slate-500 border border-slate-200">Inactive</span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative flex-1 px-6 py-6">
                                <div className="space-y-6">
                                    {/* Identity Section */}
                                    <section>
                                        <h3 className="text-[9px] font-bold uppercase tracking-widest mb-3 text-slate-400">Contact Information</h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-center shadow-sm">
                                                <p className="text-[8px] font-bold uppercase tracking-widest mb-0.5 text-slate-400">Email Address</p>
                                                <p id="panel-email" className="text-[11px] font-bold text-slate-800 break-all">{customer.email}</p>
                                            </div>
                                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-center shadow-sm">
                                                <p className="text-[8px] font-bold uppercase tracking-widest mb-0.5 text-slate-400">Phone Number</p>
                                                <p id="panel-phone" className="text-[11px] font-bold text-slate-800 font-mono">{customer.phone || '—'}</p>
                                            </div>
                                        </div>
                                    </section>

                                    {/* System Info */}
                                    <section>
                                        <h3 className="text-[9px] font-bold uppercase tracking-widest mb-3 text-slate-400">Account Details</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 rounded-lg border-l-4 border-l-[#011D52] bg-blue-50 border border-slate-100 shadow-sm">
                                                <p className="text-[8px] font-bold uppercase tracking-widest mb-0.5 text-[#011D52]">Internal ID</p>
                                                <p id="panel-id" className="text-[10px] font-bold text-slate-800 break-all">{customer.bsmr_id || customer.id}</p>
                                            </div>
                                            <div className="p-3 rounded-lg border-l-4 border-l-[#10b981] bg-[#ecfdf5] border border-slate-100 shadow-sm">
                                                <p className="text-[8px] font-bold uppercase tracking-widest mb-0.5 text-[#059669]">Joined Date</p>
                                                <p id="panel-joined" className="text-[10px] font-bold text-slate-800">{customer.created_at_formatted || customer.created_at}</p>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Deleted Info (Hidden by default) */}
                                    {customer.status === 'Inactive' && (
                                        <section id="deleted-section">
                                            <h3 className="text-[9px] font-bold uppercase tracking-widest mb-3 text-rose-500">Archive Details</h3>
                                            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 shadow-sm">
                                                <p className="text-[8px] font-bold uppercase tracking-widest mb-0.5 text-rose-600">Reason for Deactivation</p>
                                                <p id="panel-reason" className="text-[10px] font-bold text-rose-800">Account has been marked as inactive.</p>
                                            </div>
                                        </section>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerSidePanel;
