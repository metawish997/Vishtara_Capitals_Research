import React, { useState, useEffect, useMemo } from 'react';

const NotificationCenter = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState([]);

    const tabs = [
        { id: 'all', name: 'All' },
        { id: 'unread', name: 'Unread' },
        { id: 'tip', name: 'Trading Tips' },
        { id: 'tip_followup', name: 'Follow-ups' },
        { id: 'ticket', name: 'Support' },
        { id: 'announcement', name: 'System' },
        { id: 'chat', name: 'Messages' }
    ];

    // Mock data based on the Blade structure
    useEffect(() => {
        const mockData = [
            { id: 1, title: 'Market Open Alert', message: 'The Indian stock market has opened with a positive bias today.', type: 'announcement', created_at: new Date().toISOString(), is_read: 0 },
            { id: 2, title: 'New Trading Tip', message: 'Strong bullish momentum seen in Reliance Industries. Target 1: 2850, Target 2: 2900, SL: 2780', type: 'tip', created_at: new Date(Date.now() - 3600000).toISOString(), is_read: 1 },
            { id: 3, title: 'Price Update', message: JSON.stringify({ update_title: 'NIFTY 50 Update', t1: { old: '19500', new: '19600' }, t2: { old: '19700', new: '19800' }, sl: { old: '19400', new: '19450' } }), type: 'tip_followup', created_at: new Date(Date.now() - 7200000).toISOString(), is_read: 0 },
            { id: 4, title: 'Support Ticket #1024', message: 'Your ticket regarding withdrawal has been updated.', type: 'ticket', created_at: new Date(Date.now() - 86400000).toISOString(), is_read: 0 }
        ];
        setTimeout(() => { setNotifications(mockData); setIsLoading(false); }, 800);
    }, []);

    const formatTime = (dateString) => {
        const d = new Date(dateString);
        return `${d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} • ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
    };

    const getTypeConfig = (type) => {
        const map = {
            tip: { color: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', emoji: '📈' },
            tip_followup: { color: 'bg-[#011d52]', badge: 'bg-blue-50 text-[#011d52] border-blue-200', emoji: '🔄' },
            ticket: { color: 'bg-orange-500', badge: 'bg-orange-50 text-orange-700 border-orange-200', emoji: '🎫' },
            chat: { color: 'bg-indigo-500', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200', emoji: '💬' },
            announcement: { color: 'bg-rose-500', badge: 'bg-rose-50 text-rose-700 border-rose-200', emoji: '📢' },
        };
        return map[type] || { color: 'bg-slate-400', badge: 'bg-slate-50 text-slate-600 border-slate-200', emoji: '🔔' };
    };

    const formatMessage = (n) => {
        if (n.type === 'tip_followup') {
            try {
                const data = JSON.parse(n.message);
                return (
                    <div>
                        <p className="text-[10px] font-semibold text-[#011d52] mb-1">{data.update_title || 'Price Update'}</p>
                        <div className="flex flex-wrap items-center gap-1.5 text-[9px]">
                            {[{ label: 'T1', val: data.t1 }, { label: 'T2', val: data.t2 }, { label: 'SL', val: data.sl }].map((item, idx) => item.val && (
                                <div key={idx} className="flex items-center gap-1 flex-shrink-0 bg-white border border-slate-200 rounded px-1.5 py-0.5">
                                    <span className="font-bold text-slate-500">{item.label}</span>
                                    <span className="line-through text-slate-400">{item.val.old}</span>
                                    <span className="text-slate-300">→</span>
                                    <span className={`font-bold ${item.label === 'SL' ? 'text-red-600' : 'text-emerald-600'}`}>{item.val.new}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            } catch (e) { return n.message; }
        }
        return n.message;
    };

    const unreadCount = useMemo(() => notifications.filter(n => !n.is_read).length, [notifications]);

    const filteredNotifications = useMemo(() => {
        let filtered = notifications;
        if (activeTab !== 'all') {
            filtered = activeTab === 'unread' ? filtered.filter(n => !n.is_read) : filtered.filter(n => n.type === activeTab);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(n => n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q));
        }
        return filtered;
    }, [notifications, activeTab, searchQuery]);

    const markAsRead = (id) => setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    const markAllAsRead = () => setNotifications(notifications.map(n => ({ ...n, is_read: 1 })));
    const deleteNotification = (id) => setNotifications(notifications.filter(n => n.id !== id));
    const getCountByTab = (tabId) => {
        if (tabId === 'all') return notifications.length;
        if (tabId === 'unread') return notifications.filter(n => !n.is_read).length;
        return notifications.filter(n => n.type === tabId).length;
    };

    return (
        <main className="min-h-full p-4 flex flex-col gap-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">Notification Center</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">System activity, support tickets, and trading alerts</p>
                </div>
                <div className="flex items-center gap-3 mt-3 md:mt-0">
                    {unreadCount > 0 && (
                        <span className="px-2 py-0.5 bg-[#011d52] text-white text-[9px] font-bold rounded-full">{unreadCount} unread</span>
                    )}
                    <button onClick={markAllAsRead}
                        className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-md font-bold text-[10px] hover:bg-slate-50 transition">
                        ✓ Mark All Read
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative w-full sm:w-64">
                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search alerts..."
                        className="w-full rounded-md pl-8 pr-3 py-1.5 text-[11px] outline-none border border-slate-200 focus:border-[#011d52] focus:ring-1 focus:ring-[#011d52]/20 bg-white" />
                    <svg className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 flex-1">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-[#011d52] text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                            {tab.name}
                            {getCountByTab(tab.id) > 0 && (
                                <span className={`flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[8px] font-black ${activeTab === tab.id ? 'bg-white text-[#011d52]' : 'bg-slate-200 text-slate-700'}`}>
                                    {getCountByTab(tab.id)}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notification Cards */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white rounded-xl h-24 border border-slate-200 animate-pulse bg-gradient-to-r from-slate-50 to-slate-100" />
                    ))}
                </div>
            ) : filteredNotifications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {filteredNotifications.map(n => {
                        const config = getTypeConfig(n.type);
                        return (
                            <div key={n.id} onClick={() => !n.is_read && markAsRead(n.id)}
                                className={`group relative bg-white rounded-xl border p-2.5 cursor-pointer flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${n.is_read ? 'border-slate-200 shadow-sm opacity-75' : 'border-blue-200 shadow-sm ring-1 ring-blue-100'}`}>

                                {/* Unread dot */}
                                {!n.is_read && (
                                    <div className="absolute top-2.5 right-2.5 flex items-center justify-center h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
                                    </div>
                                )}

                                <div className="flex items-start gap-2.5">
                                    <div className={`${config.color} w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-[12px] shadow-sm`}>
                                        {config.emoji}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">{formatTime(n.created_at)}</p>
                                        <h3 className="text-[10px] font-bold text-slate-800 truncate pr-4 leading-tight">{n.title}</h3>
                                        <div className="text-[9px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                                            {formatMessage(n)}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100">
                                    <span className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider border ${config.badge}`}>
                                        {n.type.replace('_', ' ')}
                                    </span>
                                    <button onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                                        className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-all opacity-0 group-hover:opacity-100">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 bg-slate-50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No notifications match your filters.</p>
                </div>
            )}

            {/* Footer */}
            {notifications.length > 0 && (
                <div className="text-center pt-4 border-t border-slate-100">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-300">
                        Showing {filteredNotifications.length} of {notifications.length} alerts
                    </p>
                </div>
            )}
        </main>
    );
};

export default NotificationCenter;
