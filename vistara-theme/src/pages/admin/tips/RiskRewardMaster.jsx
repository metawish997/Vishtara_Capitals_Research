import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RiskRewardMaster = () => {
    const [modalOpen, setModalOpen] = useState(false);
    
    // Mock Data
    const [masters, setMasters] = useState([
        { id: 1, strategy_type: 'Intraday Equity', t1_gap: 0.5, t2_gap: 1.0, sl_gap: 0.5, type: 'Percentage', created_at: '2024-05-01' },
        { id: 2, strategy_type: 'Bank Nifty Options', t1_gap: 20, t2_gap: 40, sl_gap: 15, type: 'Fixed Price', created_at: '2024-05-02' }
    ]);

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-4 space-y-8 antialiased font-inter text-slate-800">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between border-b border-slate-200 pb-8 gap-6">
                <div className="flex flex-col gap-4">
                    <Link to="/admin/tips" className="group flex items-center gap-2 text-slate-500 hover:text-[[#011d52]] transition-colors w-fit">
                        <div className="p-2 rounded-full bg-slate-50 group-hover:bg-[[#011d52]]/10 transition-colors">
                            <i className="fa-solid fa-arrow-left text-xs"></i>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Back to Analytics</span>
                    </Link>

                    <div>
                        <h1 className="text-xs font-semibold font-black tracking-tight text-slate-800 leading-tight">
                            Risk Reward <span className="text-[[#011d52]]">Master</span>
                        </h1>
                        <p className="text-slate-500 text-[10px] font-bold mt-1 uppercase tracking-widest">
                            Configure global trading calculation parameters
                        </p>
                    </div>
                </div>

                <button 
                    onClick={() => setModalOpen(true)}
                    className="group flex items-center gap-3 bg-[[#011d52]] text-[#020210] hover:opacity-90 shadow-sm transition-all active:scale-95"
                >
                    <div className="bg-white/10 p-1 rounded-lg group-hover:bg-white/20">
                        <i className="fa-solid fa-plus"></i>
                    </div>
                    Create New Master
                </button>
            </div>

            {/* List Section */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-xs font-black text-slate-800 tracking-tight">Strategy Protocols</h2>
                        <p className="text-[9px] text-slate-500 font-black uppercase mt-1 tracking-widest">Global Configuration History</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 bg-[[#011d52]]/100 rounded-full animate-ping"></span>
                        <span className="text-[10px] font-black bg-white px-4 py-1.5 rounded-full border border-slate-200 text-slate-500 shadow-sm uppercase tracking-tighter">
                            Records: {masters.length}
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-500 uppercase tracking-widest">Strategy Type</th>
                                <th className="px-6 py-4 text-center text-[9px] font-black text-slate-500 uppercase tracking-widest">Primary T1</th>
                                <th className="px-6 py-4 text-center text-[9px] font-black text-slate-500 uppercase tracking-widest">Secondary T2</th>
                                <th className="px-6 py-4 text-center text-[9px] font-black text-slate-500 uppercase tracking-widest">Protection (SL)</th>
                                <th className="px-6 py-4 text-center text-[9px] font-black text-slate-500 uppercase tracking-widest">Unit Type</th>
                                <th className="px-6 py-4 text-right text-[9px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[slate-200]">
                            {masters.map(master => (
                                <tr key={master.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[[#011d52]]/10 flex items-center justify-center text-[[#011d52]] font-black text-xs group-hover:bg-[#011d52] group-hover:text-slate-800 transition-all">
                                                {master.strategy_type.charAt(0)}
                                            </div>
                                            <span className="text-xs font-black text-slate-800 tracking-tight">{master.strategy_type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black border border-emerald-100">
                                            {master.t1_gap} {master.type === 'Percentage' ? '%' : '₹'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-xs font-black border border-teal-100">
                                            {master.t2_gap} {master.type === 'Percentage' ? '%' : '₹'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-black border border-rose-100">
                                            {master.sl_gap} {master.type === 'Percentage' ? '%' : '₹'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{master.type}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 bg-slate-50 text-slate-500 rounded-lg hover:bg-slate-900 hover:text-slate-800 transition-all">
                                                <i className="fa-solid fa-pen text-[10px]"></i>
                                            </button>
                                            <button className="p-2 bg-rose-50 text-rose-400 rounded-lg hover:bg-rose-600 hover:text-slate-800 transition-all">
                                                <i className="fa-solid fa-trash text-[10px]"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-xl rounded-xl shadow-sm overflow-hidden border border-slate-200">
                        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="text-xs font-semibold font-black text-slate-800 tracking-tight">Configure Master Strategy</h3>
                                <p className="text-[10px] font-black text-slate-500 uppercase mt-1 tracking-widest">Define automated signal parameters</p>
                            </div>
                            <button onClick={() => setModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-slate-500 hover:text-slate-800 transition-colors border border-slate-200">
                                <i className="fa-solid fa-xmark text-xs font-semibold"></i>
                            </button>
                        </div>
                        <div className="p-4 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Strategy Alias</label>
                                    <input type="text" placeholder="e.g. Scalping, Swing, Long Term" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-5 py-4 text-xs font-black outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Calculation Unit</label>
                                    <div className="flex bg-slate-50 p-1.5 rounded-lg gap-2 border border-slate-200">
                                        <button className="flex-1 py-3 text-[10px] font-black rounded-xl bg-white text-[[#011d52]] shadow-sm border border-slate-200">Percentage (%)</button>
                                        <button className="flex-1 py-3 text-[10px] font-black rounded-xl text-slate-500 hover:bg-white transition-all">Fixed Price (₹)</button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-emerald-500 uppercase mb-2 tracking-widest">Target 01 Gap</label>
                                    <input type="number" step="any" placeholder="0.00" className="w-full bg-emerald-50/30 border border-emerald-100 rounded-lg px-5 py-4 text-xs font-black outline-none text-emerald-700 focus:ring-4 focus:ring-emerald-500/10 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-teal-600 uppercase mb-2 tracking-widest">Target 02 Gap</label>
                                    <input type="number" step="any" placeholder="0.00" className="w-full bg-teal-50/30 border border-teal-100 rounded-lg px-5 py-4 text-xs font-black outline-none text-teal-700 focus:ring-4 focus:ring-teal-500/10 transition-all" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black text-rose-500 uppercase mb-2 tracking-widest">Stop Loss Protection</label>
                                    <input type="number" step="any" placeholder="0.00" className="w-full bg-rose-50/30 border border-rose-100 rounded-lg px-5 py-4 text-xs font-black outline-none text-rose-700 focus:ring-4 focus:ring-rose-500/10 transition-all" />
                                </div>
                            </div>
                            
                            <div className="flex gap-4 pt-4">
                                <button onClick={() => setModalOpen(false)} className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-[slate-200] transition-all">Cancel Configuration</button>
                                <button className="flex-1 py-4 bg-[[#011d52]] text-[#020210] rounded-lg font-black text-[10px] uppercase tracking-widest hover:opacity-90 shadow-sm transition-all">Deploy Master</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RiskRewardMaster;
