import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import tipService from '../../../services/tipService';
import angelService from '../../../services/angelService';
import socket from '../../../services/socketService';

const TipDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tip, setTip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [noteInput, setNoteInput] = useState('');

    // Modals state
    const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
    const [showFollowUpModal, setShowFollowUpModal] = useState(false);
    const [showEarlyExitModal, setShowEarlyExitModal] = useState(false);
    const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);

    // Form states
    const [newStatus, setNewStatus] = useState('');
    const [manualExitPrice, setManualExitPrice] = useState(0);
    const [manualExitNote, setManualExitNote] = useState('');
    const [followUpData, setFollowUpData] = useState({
        target_price: 0,
        target_price_2: 0,
        stop_loss: 0,
        message: ''
    });

    useEffect(() => {
        fetchTip();
    }, [id]);

    useEffect(() => {
        if (!tip || tip.trade_status === 'Closed' || !tip.symbol_token) return;

        const exchangeTokens = {
            [tip.exchange || 'NSE']: [tip.symbol_token]
        };

        // Fetch initial price once
        const fetchInitialPrice = async () => {
            try {
                const res = await angelService.getLivePrices(exchangeTokens);
                if (res.status && res.data) {
                    const fetchedData = res.data.fetched || (Array.isArray(res.data) ? res.data : [res.data]);
                    const item = Array.isArray(fetchedData) ? fetchedData.find(i => String(i.symbolToken) === String(tip.symbol_token)) : fetchedData;

                    if (item && item.ltp) {
                        let direction = null;
                        if (tip.cmp_price) {
                            if (parseFloat(item.ltp) > parseFloat(tip.cmp_price)) direction = 'up';
                            else if (parseFloat(item.ltp) < parseFloat(tip.cmp_price)) direction = 'down';
                        }

                        setTip(prev => {
                            if (!prev) return prev;
                            return { ...prev, cmp_price: item.ltp, priceDirection: direction };
                        });
                    }
                }
            } catch (err) {
                console.warn('[LiveUpdate] Initial fetch failed:', err.message);
            }
        };
        fetchInitialPrice();

        socket.emit('subscribe', exchangeTokens);

        const handlePriceUpdate = (quote) => {
            if (!quote || String(quote.token) !== String(tip.symbol_token)) return;

            setTip(prev => {
                if (!prev) return prev;

                let direction = null;
                if (prev.cmp_price) {
                    if (parseFloat(quote.ltp) > parseFloat(prev.cmp_price)) direction = 'up';
                    else if (parseFloat(quote.ltp) < parseFloat(prev.cmp_price)) direction = 'down';
                }

                return { ...prev, cmp_price: quote.ltp, priceDirection: direction };
            });
        };

        socket.on('price', handlePriceUpdate);

        return () => {
            socket.off('price', handlePriceUpdate);
            socket.emit('unsubscribe', exchangeTokens);
        };
    }, [tip?.trade_status, tip?.symbol_token, tip?.exchange]);

    const fetchTip = async () => {
        setLoading(true);
        try {
            const res = await tipService.getTipById(id);
            if (res.success && res.data) {
                setTip(res.data);
            }
        } catch (error) {
            console.error('Error fetching tip:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!noteInput.trim()) return;
        try {
            await tipService.addAdminNote(id, noteInput);
            setNoteInput('');
            fetchTip();
        } catch (error) {
            alert('Failed to add note');
        }
    };

    const submitUpdateStatus = async (e) => {
        e.preventDefault();
        setIsSubmittingStatus(true);
        try {
            const res = await tipService.updateLiveStatus(id, {
                status: newStatus,
                cmp_price: tip.cmp_price
            });
            if (res.success) {
                setShowUpdateStatusModal(false);
                fetchTip();
            }
        } catch (error) {
            alert('Failed to update status');
        } finally {
            setIsSubmittingStatus(false);
        }
    };

    const submitManualExit = async (e) => {
        e.preventDefault();
        if (!manualExitPrice || manualExitPrice <= 0) return alert('Invalid exit price');
        if (!window.confirm('Are you sure you want to close this trade?')) return;

        try {
            await tipService.manualClose(id, {
                exit_price: manualExitPrice,
                admin_note: manualExitNote
            });
            setShowEarlyExitModal(false);
            fetchTip();
            alert('Trade closed successfully');
        } catch (error) {
            alert('Error closing trade');
        }
    };

    const submitFollowUp = async (e) => {
        e.preventDefault();
        try {
            await tipService.storeFollowUp(id, followUpData);
            setShowFollowUpModal(false);
            fetchTip();
            alert('Follow-up added successfully');
        } catch (error) {
            alert('Error adding follow-up');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this tip?')) {
            try {
                await tipService.deleteTip(id);
                navigate('/admin/tips');
            } catch (error) {
                alert('Delete error');
            }
        }
    };

    if (loading) return <div className="p-10 text-center font-black text-slate-500 uppercase tracking-[0.2em]">Loading Intelligence Details...</div>;
    if (!tip) return <div className="p-10 text-center font-black text-rose-500 uppercase tracking-[0.2em]">Tip Not Found</div>;

    const getShortStatus = (status) => {
        if (!status) return 'WAIT';
        const s = status.toLowerCase();
        const map = {
            'active': 'ACT',
            't1-achieved': 'TG1',
            't2-achieved': 'TG2',
            'sl-hit': 'SL',
            'wait for entry': 'WAIT',
            'early-exit': 'EXIT'
        };
        return map[s] || status.toUpperCase();
    };

    return (
        <div className="min-h-screen font-inter text-slate-800 p-4 md:p-6 bg-slate-50/50">
            {/* Header / Breadcrumb */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Link to="/admin/tips" className="hover:text-[#011D52] transition-colors"><i className="fa-solid fa-arrow-left"></i></Link>
                        <span className="text-[11px] font-semibold uppercase tracking-widest">{tip.tip_type || 'Equity'} Tip / View</span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-black text-[#011D52] tracking-tight">{tip.stock_name}</h1>
                </div>

                <div className="flex gap-2">
                    {tip.trade_status !== 'Closed' && (
                        <>
                            <button onClick={() => { setNewStatus(tip.status); setShowUpdateStatusModal(true); }} className="px-4 py-2 rounded-lg text-xs font-bold transition border border-[#011D52]/20 text-[#011D52] hover:bg-[#011D52]/5 bg-white shadow-sm">
                                <i className="fa-solid fa-bolt mr-1"></i> Update Status
                            </button>
                            <button onClick={() => {
                                setFollowUpData({ target_price: tip.target_price, target_price_2: tip.target_price_2 || 0, stop_loss: tip.stop_loss, message: '' });
                                setShowFollowUpModal(true);
                            }} className="px-4 py-2 rounded-lg text-xs font-bold transition border border-[#D2AF4D]/30 text-[#b49031] hover:bg-[#D2AF4D]/5 bg-white shadow-sm">
                                <i className="fa-solid fa-bullhorn mr-1"></i> Follow Up
                            </button>
                            <button onClick={() => { setManualExitPrice(tip.cmp_price || tip.entry_price); setShowEarlyExitModal(true); }} className="px-4 py-2 rounded-lg text-xs font-bold transition border border-rose-200 text-rose-600 hover:bg-rose-50 bg-white shadow-sm">
                                <i className="fa-solid fa-power-off mr-1"></i> Early Exit
                            </button>
                        </>
                    )}
                    <Link to={`/admin/tips/${tip._id}/edit`} className="px-4 py-2 rounded-lg text-xs font-bold transition border border-slate-200 hover:bg-slate-50 text-indigo-600 bg-white shadow-sm">
                        <i className="fa-solid fa-pen-to-square"></i> Edit
                    </Link>
                    <button onClick={handleDelete} className="px-4 py-2 rounded-lg text-xs font-bold transition border border-rose-200 hover:bg-rose-50 text-rose-600 bg-white shadow-sm">
                        <i className="fa-solid fa-trash-can"></i> Delete
                    </button>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Side: Details Sections */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    
                    {/* Basic Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center gap-2">
                            <i className="fa-solid fa-circle-info text-[#011D52]"></i>
                            <h2 className="text-xs font-black uppercase tracking-widest text-[#011D52]">Basic Info</h2>
                        </div>
                        <div className="p-5 grid grid-cols-2 md:grid-cols-5 gap-y-6 gap-x-4">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Segment</p>
                                <p className="text-sm font-black text-slate-800">{tip.segment || tip.exchange}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tip Type</p>
                                <p className="text-sm font-black text-slate-800 uppercase">{tip.tip_type || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Strike Price</p>
                                <p className="text-sm font-black text-slate-800">{tip.strike_price || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Option Type</p>
                                <p className="text-sm font-black text-slate-800">{tip.option_type || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Expiry Date</p>
                                <p className="text-sm font-black text-slate-800">{tip.expiry_date ? new Date(tip.expiry_date).toLocaleDateString('en-GB') : 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Open Price</p>
                                <p className="text-sm font-black text-slate-800">₹{parseFloat(tip.entry_price || 0).toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target 1</p>
                                <p className="text-sm font-black text-emerald-600">₹{parseFloat(tip.target_price || 0).toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target 2</p>
                                <p className="text-sm font-black text-emerald-600">{tip.target_price_2 ? `₹${parseFloat(tip.target_price_2).toFixed(2)}` : '-'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Stop Loss</p>
                                <p className="text-sm font-black text-rose-500">₹{parseFloat(tip.stop_loss || 0).toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Call Type</p>
                                <p className={`text-sm font-black ${tip.call_type === 'BUY' ? 'text-emerald-600' : 'text-rose-600'}`}>{tip.call_type}</p>
                            </div>
                        </div>
                    </div>

                    {/* Entry & Exit */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center gap-2">
                            <i className="fa-solid fa-clock-rotate-left text-[#011D52]"></i>
                            <h2 className="text-xs font-black uppercase tracking-widest text-[#011D52]">Entry & Exit</h2>
                        </div>
                        <div className="p-5 grid grid-cols-2 md:grid-cols-6 gap-y-6 gap-x-4">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Entry Date</p>
                                <p className="text-sm font-black text-slate-800">{new Date(tip.createdAt).toLocaleDateString('en-GB')}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Entry Time</p>
                                <p className="text-sm font-black text-slate-800">{new Date(tip.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">CMP</p>
                                <p className="text-sm font-black flex items-center gap-1">
                                    <span className={tip.priceDirection === 'up' ? 'text-emerald-600' : tip.priceDirection === 'down' ? 'text-rose-600' : 'text-slate-800'}>
                                        ₹{parseFloat(tip.cmp_price || 0).toFixed(2)}
                                    </span>
                                    {tip.priceDirection === 'up' && <span className="text-[10px] text-emerald-600">▲</span>}
                                    {tip.priceDirection === 'down' && <span className="text-[10px] text-rose-600">▼</span>}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Exit Price</p>
                                <p className="text-sm font-black text-slate-800">{tip.exit_price ? `₹${parseFloat(tip.exit_price).toFixed(2)}` : '-'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Exit Date</p>
                                <p className="text-sm font-black text-slate-800">{tip.exit_at ? new Date(tip.exit_at).toLocaleDateString('en-GB') : '-'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Exit Time</p>
                                <p className="text-sm font-black text-slate-800">{tip.exit_at ? new Date(tip.exit_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Status & Risk */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center gap-2">
                            <i className="fa-solid fa-shield-halved text-[#011D52]"></i>
                            <h2 className="text-xs font-black uppercase tracking-widest text-[#011D52]">Status & Risk</h2>
                        </div>
                        <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    tip.status === 'Active' ? 'bg-blue-100 text-blue-700' : 
                                    tip.status.includes('Achieved') ? 'bg-emerald-100 text-emerald-700' : 
                                    tip.status === 'SL-Hit' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                                }`}>
                                    {tip.status}
                                </span>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Trade Status</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    tip.trade_status === 'Open' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                                }`}>
                                    {tip.trade_status}
                                </span>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Allowed Plans</p>
                                <div className="flex flex-wrap gap-1">
                                    {!tip.allowed_plans || tip.allowed_plans.length === 0 ? (
                                        <span className="text-xs font-black text-slate-800">Public</span>
                                    ) : (
                                        tip.allowed_plans.map((p, i) => (
                                            <span key={i} className="text-xs font-black text-slate-800">
                                                {p.name}{i < tip.allowed_plans.length - 1 ? ',' : ''}
                                            </span>
                                        ))
                                    )}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category</p>
                                <p className="text-xs font-black text-slate-800">{tip.category?.name || '-'}</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Side: Admin Notes */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px] sticky top-[100px]">
                    <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-clipboard-list text-[#011D52]"></i>
                            <h2 className="text-xs font-black uppercase tracking-widest text-[#011D52]">Admin Notes</h2>
                        </div>
                        <span className="px-2 py-0.5 bg-[#D2AF4D]/20 text-[#b49031] text-[10px] font-black rounded-full border border-[#D2AF4D]/30">{tip.admin_notes?.length || 0}</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
                        {(!tip.admin_notes || tip.admin_notes.length === 0) && (
                            <div className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest py-10 opacity-70">
                                No internal notes added yet
                            </div>
                        )}
                        {[...(tip.admin_notes || [])].reverse().map((noteObj, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <i className="fa-regular fa-calendar"></i>
                                    {new Date(noteObj.date).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                                </div>
                                <p className="text-xs font-semibold text-slate-700 leading-relaxed whitespace-pre-wrap">{noteObj.note}</p>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-slate-200 bg-white">
                        <form onSubmit={handleAddNote} className="flex flex-col gap-3">
                            <textarea
                                value={noteInput}
                                onChange={(e) => setNoteInput(e.target.value)}
                                placeholder="Type an internal note here..."
                                rows="3"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-[#011D52] focus:ring-2 focus:ring-[#011D52]/10 transition-all resize-none"
                                required
                            ></textarea>
                            <button type="submit" className="w-full bg-[#011D52] text-white py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#020210] transition-colors shadow-md">
                                Add Note
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modals - Same logic as Dashboard */}
            {/* Early Exit Modal */}
            {showEarlyExitModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden border border-slate-200 relative animate-scale-in">
                        <button onClick={() => setShowEarlyExitModal(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors">
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                        <div className="p-6">
                            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4 border border-rose-100">
                                <i className="fa-solid fa-power-off text-lg"></i>
                            </div>
                            <h3 className="text-lg font-black text-slate-800 tracking-tight">Early Exit</h3>
                            <p className="text-xs font-semibold text-slate-500 mb-6">Close trade manually and notify users</p>
                            <form onSubmit={submitManualExit} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Exit Price *</label>
                                    <input type="number" step="0.01" required value={manualExitPrice} onChange={(e) => setManualExitPrice(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-black focus:border-[#011D52] outline-none" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Admin Remark (Optional)</label>
                                    <textarea value={manualExitNote} onChange={(e) => setManualExitNote(e.target.value)} rows="2" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold focus:border-[#011D52] outline-none resize-none"></textarea>
                                </div>
                                <button type="submit" className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-colors mt-2">Close Trade Now</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Status Modal */}
            {showUpdateStatusModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden border border-slate-200 relative animate-scale-in">
                        <button onClick={() => setShowUpdateStatusModal(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors">
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                        <div className="p-6">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100">
                                <i className="fa-solid fa-bolt text-lg"></i>
                            </div>
                            <h3 className="text-lg font-black text-slate-800 tracking-tight">Update Status</h3>
                            <p className="text-xs font-semibold text-slate-500 mb-6">Manually override tip status</p>
                            <form onSubmit={submitUpdateStatus} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">New Status *</label>
                                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-black focus:border-[#011D52] outline-none" required>
                                        <option value="">Select Status</option>
                                        <option value="Active">Active</option>
                                        <option value="T1-Achieved">T1-Achieved</option>
                                        <option value="T2-Achieved">T2-Achieved</option>
                                        <option value="SL-Hit">SL-Hit</option>
                                        <option value="Early-Exit">Early-Exit</option>
                                    </select>
                                </div>
                                <button type="submit" disabled={isSubmittingStatus} className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest bg-[#011D52] hover:bg-[#020210] text-white shadow-md transition-colors mt-2 disabled:opacity-70">
                                    {isSubmittingStatus ? 'Updating...' : 'Save Status'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Follow Up Modal */}
            {showFollowUpModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden border border-slate-200 relative animate-scale-in">
                        <button onClick={() => setShowFollowUpModal(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors">
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                        <div className="p-6">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4 border border-amber-100">
                                <i className="fa-solid fa-bullhorn text-lg"></i>
                            </div>
                            <h3 className="text-lg font-black text-slate-800 tracking-tight">Add Follow Up</h3>
                            <p className="text-xs font-semibold text-slate-500 mb-6">Send an update notification to users</p>
                            <form onSubmit={submitFollowUp} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">New T1</label>
                                        <input type="number" step="0.01" value={followUpData.target_price} onChange={(e) => setFollowUpData({ ...followUpData, target_price: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-black focus:border-[#011D52] outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">New T2</label>
                                        <input type="number" step="0.01" value={followUpData.target_price_2} onChange={(e) => setFollowUpData({ ...followUpData, target_price_2: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-black focus:border-[#011D52] outline-none" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">New SL</label>
                                        <input type="number" step="0.01" value={followUpData.stop_loss} onChange={(e) => setFollowUpData({ ...followUpData, stop_loss: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-black focus:border-[#011D52] outline-none" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Message to Users *</label>
                                        <textarea required value={followUpData.message} onChange={(e) => setFollowUpData({ ...followUpData, message: e.target.value })} placeholder="e.g., Trail your SL to cost..." rows="3" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:border-[#011D52] outline-none resize-none"></textarea>
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-colors mt-2">Send Follow Up</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TipDetails;
