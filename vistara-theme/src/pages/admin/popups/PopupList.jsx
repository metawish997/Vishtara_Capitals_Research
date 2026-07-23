import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { BASE_URL } from '../../../services/api';
import toast from 'react-hot-toast';

const PopupList = () => {
    const [popups, setPopups] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPopups = async () => {
        try {
            const { data } = await api.get('/popups');
            setPopups(data.data || []);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to fetch popups');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPopups();
    }, []);

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        try {
            await api.put(`/popups/${id}`, { status: newStatus });
            setPopups(popups.map(p => p._id === id ? { ...p, status: newStatus } : p));
            toast.success(`Popup ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this popup?')) return;
        try {
            await api.delete(`/popups/${id}`);
            setPopups(popups.filter(p => p._id !== id));
            toast.success('Popup deleted successfully');
        } catch (error) {
            toast.error('Failed to delete popup');
        }
    };

    const getTypeBg = (type) => {
        switch (type) {
            case 'offer': return 'bg-gradient-to-br from-amber-400 to-orange-500';
            case 'notification': return 'bg-gradient-to-br from-blue-400 to-indigo-500';
            case 'policy': return 'bg-gradient-to-br from-emerald-400 to-teal-500';
            case 'image': return 'bg-gradient-to-br from-fuchsia-400 to-purple-500';
            case 'video': return 'bg-gradient-to-br from-rose-400 to-red-500';
            default: return 'bg-gradient-to-br from-gray-400 to-gray-500';
        }
    };

    return (
        <div className="min-h-full font-plus-jakarta flex flex-col gap-4 bg-white" style={{ padding: '16px' }}>
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                        <h1 className="text-[13px] font-bold text-slate-800">Popups</h1>
                        <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Manage your platform popups and promotional messages.</p>
                    </div>
                    <Link 
                        to="/admin/popups/create"
                        className="inline-flex items-center px-3 py-1.5 bg-[#011d52] hover:opacity-90 text-white font-bold rounded shadow-sm transition-colors text-[9px] uppercase tracking-widest">
                        <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                        Create Popup
                    </Link>
                </div>

                {/* Grid */}
                <div>
                    {loading ? (
                        <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-[#011d52] border-t-transparent rounded-full animate-spin"></div></div>
                    ) : popups.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-[10px] font-bold uppercase tracking-widest">No popups found. Create one to get started.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
                            {popups.map((popup) => (
                                <div key={popup._id} className="flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                                    
                                    {/* Image Area */}
                                    <div className={`h-24 w-full flex items-center justify-center overflow-hidden shrink-0 ${(!popup.image || !popup.image.url) ? getTypeBg(popup.type) : 'bg-slate-50 border-b border-slate-100'}`}>
                                        {popup.image && popup.image.url ? (
                                            <img src={`${BASE_URL}${popup.image.url}`} alt={popup.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <svg className="w-8 h-8 text-white/40 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        )}
                                    </div>

                                    <div className="p-3 flex-grow flex flex-col">
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[8px] font-bold uppercase tracking-wider rounded">
                                                {popup.type || 'notification'}
                                            </span>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link to={`/admin/popups/edit/${popup._id}`} className="p-1 text-slate-400 hover:text-[#011d52] bg-slate-50 rounded transition-colors">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                </Link>
                                                <button onClick={() => handleDelete(popup._id)} className="p-1 text-slate-400 hover:text-red-500 bg-slate-50 rounded transition-colors">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                        </div>
                                        <h3 className="text-[11px] font-bold text-slate-800 mb-1 line-clamp-1">{popup.title}</h3>
                                        <p className="text-[9px] font-medium text-slate-500 line-clamp-2 leading-relaxed mb-2">{popup.content || popup.description || 'No content provided.'}</p>
                                        
                                        {popup.button_text && (
                                            <div className="mt-auto inline-flex items-center px-2 py-1 bg-blue-50/50 border border-blue-100/50 rounded text-[8px] font-bold text-blue-600 uppercase tracking-widest truncate max-w-max">
                                                {popup.button_text}
                                            </div>
                                        )}
                                    </div>

                                    <div className="px-3 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={popup.status === 'active'} onChange={() => handleToggleStatus(popup._id, popup.status)} className="sr-only peer" />
                                            <div className="w-6 h-3 bg-slate-200 rounded-full peer peer-checked:bg-[#011d52] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-2 after:w-2 after:transition-all peer-checked:after:translate-x-3"></div>
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
        </div>
    );
};

export default PopupList;
