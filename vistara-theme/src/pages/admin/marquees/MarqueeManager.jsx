import React, { useState, useEffect } from 'react';
import marqueeService from '../../../services/marqueeService';
import toast from 'react-hot-toast';

const MarqueeManager = () => {
    const [marquees, setMarquees] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editingMarquee, setEditingMarquee] = useState(null);
    const [form, setForm] = useState({ title: '', content: '', is_active: false });

    const activeMarquees = marquees.filter(m => m.is_active);

    const fetchMarquees = async () => {
        try {
            setLoading(true);
            const res = await marqueeService.getMarquees();
            setMarquees(res.data);
        } catch (error) {
            toast.error('Failed to load marquees');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMarquees();
    }, []);

    const handleOpenModal = (m = null) => {
        if (m) {
            setEditingMarquee(m);
            setForm(m);
        } else {
            setEditingMarquee(null);
            setForm({ title: '', content: '', is_active: true });
        }
        setShowModal(true);
    };

    const handleToggleActive = async (marquee) => {
        try {
            await marqueeService.updateMarquee(marquee._id, { is_active: !marquee.is_active });
            toast.success('Marquee status updated');
            fetchMarquees();
        } catch (error) {
            toast.error('Activation failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingMarquee) {
                await marqueeService.updateMarquee(editingMarquee._id, form);
                toast.success('Marquee updated');
            } else {
                await marqueeService.createMarquee({ ...form, display_order: marquees.length + 1 });
                toast.success('New marquee deployed');
            }
            setShowModal(false);
            fetchMarquees();
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this marquee?')) {
            try {
                await marqueeService.deleteMarquee(id);
                toast.success('Marquee erased');
                fetchMarquees();
            } catch (error) {
                toast.error('Delete failed');
            }
        }
    };

    return (
        <div className="min-h-full font-plus-jakarta flex flex-col gap-4 bg-white" style={{ padding: '16px' }}>
            {/* Live Preview Banner */}
            {activeMarquees.length > 0 && (
                <div className="bg-[#011d52] text-white rounded-xl p-4 shadow-sm border border-slate-200 overflow-hidden group">
                    <div className="flex items-center px-4 gap-6">
                        <div className="flex items-center gap-3 shrink-0">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white opacity-90">Live Stream</span>
                        </div>
                        <div className="h-5 w-[1px] bg-white opacity-30 shrink-0"></div>
                        <marquee className="text-[12px] font-bold tracking-wide cursor-default text-white" scrollamount="6">
                            {activeMarquees.map(am => (
                                <span key={am._id} className="mr-20">
                                    {am.title && (
                                        <span className="font-bold mr-4 uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-md">[{am.title}]</span>
                                    )}
                                    <span>{am.content}</span>
                                </span>
                            ))}
                        </marquee>
                    </div>
                </div>
            )}
            {/* Table Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                {/* Header Row */}
                <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <h3 className="text-[12px] font-bold text-slate-800">Marquee Command</h3>
                        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                            <span className="text-[9px] text-slate-400 font-medium">Broadcast scrolling intelligence to the platform dashboard.</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleOpenModal()}
                            className="text-[10px] font-semibold bg-[#011d52] text-white border border-[#011d52] px-2.5 py-1 rounded-md hover:bg-[#03173d] transition-colors flex items-center gap-1">
                            + Deploy Marquee
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-slate-100">
                                <th className="px-4 py-1.5 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Context Heading</th>
                                <th className="px-4 py-1.5 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Content Payload</th>
                                <th className="px-4 py-1.5 text-[8px] text-slate-400 uppercase font-bold tracking-widest text-center">Status</th>
                                <th className="px-4 py-1.5 text-[8px] text-slate-400 uppercase font-bold tracking-widest text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[slate-200]">
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-10 text-[10px] font-bold text-slate-500 uppercase tracking-widest">CONNECTING TO STREAM...</td></tr>
                            ) : marquees.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-10 text-[10px] font-bold text-slate-500 uppercase tracking-widest">No marquees found.</td></tr>
                            ) : marquees.map((m) => (
                                <tr key={m._id} className="border-b border-slate-50 hover:bg-[#f8fafc] transition-colors group">
                                    <td className="px-4 py-2">
                                        <p className="text-[11px] font-semibold text-slate-800">{m.title || '—'}</p>
                                    </td>
                                    <td className="px-4 py-2 max-w-md">
                                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed line-clamp-1">"{m.content}"</p>
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        {m.is_active ? (
                                            <button
                                                onClick={() => handleToggleActive(m)}
                                                className="inline-flex items-center px-2 py-1 rounded border border-[#a7f3d0] bg-[#ecfdf5] text-[8px] font-bold text-[#10b981] uppercase tracking-widest hover:bg-[#d1fae5] transition-all cursor-pointer"
                                                title="Click to Deactivate">
                                                ● Streaming
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleToggleActive(m)}
                                                className="inline-flex items-center px-2 py-1 rounded text-[8px] font-bold bg-white text-slate-500 border border-slate-200 uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer">
                                                Activate
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleOpenModal(m)} className="p-1 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded transition-colors">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                            </button>
                                            <button onClick={() => handleDelete(m._id)} className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
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
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="text-xs font-semibold font-bold text-slate-800">{editingMarquee ? 'Update Stream' : 'New Broadcast'}</h3>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-800 p-1 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-5">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Headline (Context)</label>
                                <input
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-md outline-none focus:border-[[#011d52]] transition-colors text-xs text-slate-800"
                                    placeholder="e.g. MAINTENANCE NOTICE"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Transmission Content</label>
                                <textarea
                                    rows="4"
                                    value={form.content}
                                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-md outline-none focus:border-[[#011d52]] transition-colors text-xs text-slate-800 resize-none"
                                    placeholder="Enter the broadcast payload..."
                                    required
                                ></textarea>
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={form.is_active} onChange={() => setForm({ ...form, is_active: !form.is_active })} className="sr-only peer" />
                                    <div className="w-8 h-4.5 bg-[slate-200] rounded-full peer peer-checked:bg-[[#011d52]] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-3.5"></div>
                                    <span className="ml-3 text-[10px] font-bold text-slate-800 uppercase tracking-widest">Active Stream</span>
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 pt-5 border-t border-slate-200 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-[10px] font-bold text-slate-500 hover:text-slate-800 uppercase tracking-widest transition-colors">Discard</button>
                                <button type="submit" className="bg-[slate-800] text-[slate-50] px-6 py-2 rounded-md font-bold text-[10px] uppercase tracking-widest shadow-sm hover:opacity-90 transition-all flex items-center justify-center">Commit Stream</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarqueeManager;
