import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ticketService from '../../../services/ticketService';
import toast from 'react-hot-toast';

const TicketDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [adminNote, setAdminNote] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setIsLoading(true);
        try {
            const response = await ticketService.getAllTickets();
            const data = response?.data || response || [];
            setTickets(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load tickets.');
        } finally {
            setIsLoading(false);
        }
    };

    const counts = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'Open').length,
        in_progress: tickets.filter(t => t.status === 'In Progress' || t.status === 'Pending').length,
        resolved: tickets.filter(t => t.status === 'Resolved').length
    };

    const handleOpenDrawer = async (ticket) => {
        setSelectedTicket(ticket);
        setAdminNote(ticket.admin_note || '');
        setDrawerOpen(true);

        // If the ticket is not 'Open' and not 'Resolved', mark it as 'Open' when an admin views it
        if (ticket.status !== 'Open' && ticket.status !== 'Resolved') {
            try {
                await ticketService.updateTicket(ticket._id, { status: 'Open' });
                // Update local state to reflect the change
                setTickets(prev => prev.map(t => t._id === ticket._id ? { ...t, status: 'Open' } : t));
                setSelectedTicket(prev => ({ ...prev, status: 'Open' }));
                toast.success('Ticket marked as Open. User notified.');
            } catch (error) {
                console.error('Failed to update status on open:', error);
            }
        }
    };

    const handleResolve = async () => {
        if (!adminNote.trim()) {
            toast.error('Please provide a resolution note.');
            return;
        }

        setIsUpdating(true);
        try {
            await ticketService.updateTicket(selectedTicket._id, {
                status: 'Resolved',
                admin_note: adminNote
            });

            toast.success('Ticket resolved successfully. User notified.');
            setTickets(tickets.map(t => t._id === selectedTicket._id ? { ...t, status: 'Resolved', admin_note: adminNote } : t));
            setDrawerOpen(false);
        } catch (error) {
            console.error('Failed to resolve ticket:', error);
            toast.error('Failed to resolve ticket.');
        } finally {
            setIsUpdating(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="min-h-full font-plus-jakarta flex flex-col gap-4 bg-white" style={{ padding: '16px' }}>
            
            {/* Stats Cards (Ultra-Compact & Fully Colored) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                <div className="rounded-xl p-2.5 flex flex-col justify-center hover:-translate-y-0.5 transition-transform duration-200"
                    style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', boxShadow: '0 2px 10px -4px #2563eb40' }}>
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[14px] drop-shadow-sm">🎫</span>
                            <h4 className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#2563eb' }}>Total Tickets</h4>
                        </div>
                    </div>
                    <p className="text-[18px] font-black tracking-tight leading-none text-slate-800 ml-1">{counts.total}</p>
                </div>
                
                <div className="rounded-xl p-2.5 flex flex-col justify-center hover:-translate-y-0.5 transition-transform duration-200"
                    style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', boxShadow: '0 2px 10px -4px #d9770640' }}>
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[14px] drop-shadow-sm">⏳</span>
                            <h4 className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#d97706' }}>Open Tickets</h4>
                        </div>
                    </div>
                    <p className="text-[18px] font-black tracking-tight leading-none text-slate-800 ml-1">{counts.open}</p>
                </div>

                <div className="rounded-xl p-2.5 flex flex-col justify-center hover:-translate-y-0.5 transition-transform duration-200"
                    style={{ backgroundColor: '#faf5ff', border: '1px solid #e9d5ff', boxShadow: '0 2px 10px -4px #9333ea40' }}>
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[14px] drop-shadow-sm">🚀</span>
                            <h4 className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#9333ea' }}>In Progress</h4>
                        </div>
                    </div>
                    <p className="text-[18px] font-black tracking-tight leading-none text-slate-800 ml-1">{counts.in_progress}</p>
                </div>

                <div className="rounded-xl p-2.5 flex flex-col justify-center hover:-translate-y-0.5 transition-transform duration-200"
                    style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', boxShadow: '0 2px 10px -4px #05966940' }}>
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[14px] drop-shadow-sm">✅</span>
                            <h4 className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#059669' }}>Resolved</h4>
                        </div>
                    </div>
                    <p className="text-[18px] font-black tracking-tight leading-none text-slate-800 ml-1">{counts.resolved}</p>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex-1 flex flex-col">
                {/* Header Row */}
                <div className="px-4 py-2 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center bg-slate-50/50 gap-4 relative">
                    <div className="flex items-center gap-3">
                        <h3 className="text-[12px] font-bold text-slate-800">Support Tickets</h3>
                        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                            <span className="text-[9px] text-slate-400 font-medium">Monitor and resolve user support requests</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 items-center relative">
                        <div className="relative">
                            <input type="text" placeholder="Search ID, Name or Subject..." className="w-56 border border-slate-200 rounded-md text-[10px] px-2.5 py-1.5 outline-none focus:border-[#011d52] font-semibold text-slate-600 bg-white" />
                        </div>
                        <select className="border border-slate-200 rounded-md text-[10px] px-2.5 py-1.5 outline-none focus:border-[#011d52] font-semibold text-slate-600 bg-white">
                            <option>All Status</option>
                            <option>Open</option>
                            <option>In Progress</option>
                            <option>Resolved</option>
                        </select>
                        <select className="border border-slate-200 rounded-md text-[10px] px-2.5 py-1.5 outline-none focus:border-[#011d52] font-semibold text-slate-600 bg-white">
                            <option>All Priority</option>
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                        <button className="text-[10px] font-semibold bg-white border border-slate-200 px-2.5 py-1.5 rounded-md text-slate-600 hover:bg-slate-50 transition-colors">
                            Reset Filters
                        </button>
                    </div>
                </div>

                {/* Table Area */}
                <div className="p-0 bg-white flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-10 text-center text-xs font-black text-[slate-500] uppercase tracking-widest">
                            Loading Tickets...
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="p-10 text-center text-xs font-black text-[slate-500] uppercase tracking-widest">
                            No tickets found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[slate-50] border-b border-[slate-200]">
                                        <th className="px-8 py-5 text-[9px] font-black text-[slate-500] uppercase tracking-[0.2em]">Ticket ID</th>
                                        <th className="px-8 py-5 text-[9px] font-black text-[slate-500] uppercase tracking-[0.2em]">User</th>
                                        <th className="px-8 py-5 text-[9px] font-black text-[slate-500] uppercase tracking-[0.2em]">Issue / Subject</th>
                                        <th className="px-8 py-5 text-[9px] font-black text-[slate-500] uppercase tracking-[0.2em]">Priority</th>
                                        <th className="px-8 py-5 text-[9px] font-black text-[slate-500] uppercase tracking-[0.2em]">Status</th>
                                        <th className="px-8 py-5 text-[9px] font-black text-[slate-500] uppercase tracking-[0.2em] text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[slate-200]">
                                    {tickets.map((t) => {
                                        const userName = t.user?.name || t.user_name || 'Unknown User';
                                        return (
                                            <tr key={t._id} className={`transition-colors group ${t.status === 'Resolved' ? 'bg-[slate-50] opacity-60' : 'hover:bg-[slate-50]'}`}>
                                                <td className="px-8 py-6 font-black text-[slate-500] tracking-widest text-[10px]">#{t._id?.substring(0, 8) || t.id}</td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 bg-[[#011d52]]/10 border border-indigo-100 rounded-full flex items-center justify-center text-[10px] font-black text-[[#011d52]] uppercase">{userName.charAt(0)}</div>
                                                        <div>
                                                            <p className="font-black text-[slate-800] tracking-tight text-xs">{userName}</p>
                                                            <p className="text-[9px] text-[slate-500] font-bold uppercase tracking-tighter mt-0.5">{formatDate(t.createdAt || t.date)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <p className="font-black text-slate-700 tracking-tight text-[11px] italic uppercase max-w-xs truncate">"{t.subject}"</p>
                                                    <p className="text-[10px] text-[slate-500] font-medium truncate max-w-xs mt-1">{t.issue}</p>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${t.priority === 'High' ? 'bg-rose-50 text-rose-500 border-rose-100' :
                                                            t.priority === 'Medium' ? 'bg-amber-50 text-amber-500 border-amber-100' :
                                                                'bg-[slate-50] text-[slate-500] border-[slate-200]'
                                                        }`}>
                                                        {t.priority || 'Low'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${t.status === 'Open' ? 'bg-[[#011d52]]/10 text-[[#011d52]] border-indigo-100' :
                                                            (t.status === 'In Progress' || t.status === 'Pending') ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                                'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                        }`}>
                                                        {t.status || 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button onClick={() => handleOpenDrawer(t)} className="text-[10px] font-black uppercase tracking-widest text-[[#011d52]] hover:text-indigo-800 underline transition-all">
                                                        Open Ticket
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Side Drawer */}
            {drawerOpen && selectedTicket && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setDrawerOpen(false)}></div>
                    <div className="relative w-full max-w-md bg-[white] h-full shadow-sm flex flex-col animate-in slide-in-from-right duration-500">

                        {/* Drawer Header */}
                        <div className="p-4 bg-[slate-50] border-b border-[slate-200] flex items-center justify-between">
                            <div>
                                <h2 className="text-xs font-semibold font-black text-[slate-800] tracking-tighter uppercase italic">Ticket #{selectedTicket._id?.substring(0, 8) || selectedTicket.id}</h2>
                                <p className="text-[10px] text-[slate-500] font-bold uppercase tracking-widest mt-1">Created: {formatDate(selectedTicket.createdAt || selectedTicket.date)}</p>
                            </div>
                            <button onClick={() => setDrawerOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[white] text-[slate-500] hover:text-rose-500 shadow-sm transition-all">&times;</button>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-hide">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-[[#011d52]]/10 text-[[#011d52]] border border-indigo-100 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">{selectedTicket.status}</span>
                                <span className="px-3 py-1 bg-[slate-50] text-[slate-500] border border-[slate-200] rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">{selectedTicket.priority} PRIORITY</span>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xs font-black text-[slate-800] tracking-tight uppercase italic">"{selectedTicket.subject}"</h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[[#011d52]]/100 animate-pulse"></div>
                                    <p className="text-[10px] font-black text-[[#011d52]] uppercase tracking-widest">Reported by: {selectedTicket.user?.name || selectedTicket.user_name}</p>
                                </div>
                            </div>

                            {(selectedTicket.attachment || selectedTicket.image) && (
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-[slate-500] uppercase tracking-widest">Attachment</label>
                                    <img
                                        src={selectedTicket.attachment || selectedTicket.image}
                                        className="w-full rounded-lg border-4 border-[slate-200] shadow-lg object-cover max-h-48 cursor-pointer hover:scale-[1.02] transition-transform"
                                        onClick={() => window.open(selectedTicket.attachment || selectedTicket.image, '_blank')}
                                    />
                                </div>
                            )}

                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-[slate-500] uppercase tracking-widest">Issue Description</label>
                                <div className="bg-[slate-50] p-4 rounded-lg border border-[slate-200]">
                                    <p className="text-[11px] text-[slate-500] font-medium leading-relaxed italic">"{selectedTicket.description}"</p>
                                </div>
                            </div>
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-4 bg-[slate-50] border-t border-[slate-200] space-y-6">
                            {selectedTicket.status !== 'Resolved' ? (
                                <>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-[slate-500] uppercase tracking-widest">Resolution Note</label>
                                        <textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} rows="4" className="w-full p-4 bg-[white] border-none rounded-lg text-[11px] font-medium text-slate-700 outline-none focus:ring-4 transition-all shadow-sm resize-none" placeholder="Enter resolution details for the user..."></textarea>
                                    </div>
                                    <button onClick={handleResolve} disabled={isUpdating} className="w-full bg-emerald-600 text-[slate-800] font-black py-4 rounded-lg text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95 italic disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                        {isUpdating ? 'Resolving...' : 'Resolve Ticket'}
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-2">Admin Resolution Note</p>
                                        <p className="text-[11px] text-emerald-700 font-bold italic leading-relaxed">"{selectedTicket.admin_note || 'Resolved successfully.'}"</p>
                                    </div>
                                    <div className="w-full bg-[slate-50] text-[slate-500] font-black py-4 rounded-lg text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 cursor-not-allowed italic">
                                        Ticket Resolved
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketDashboard;

