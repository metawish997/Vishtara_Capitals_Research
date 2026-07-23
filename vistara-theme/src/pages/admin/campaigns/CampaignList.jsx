import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { BASE_URL } from '../../../services/api';
import toast from 'react-hot-toast';

const CampaignList = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchCampaigns = async () => {
        try {
            const { data } = await api.get('/campaigns');
            setCampaigns(data.data || []);
        } catch (error) {
            toast.error('Failed to fetch campaigns');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCampaigns(); }, []);

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await api.put(`/campaigns/${id}`, { is_active: !currentStatus });
            setCampaigns(campaigns.map(c => c._id === id ? { ...c, is_active: !currentStatus } : c));
            toast.success('Status updated');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this campaign?')) return;
        try {
            await api.delete(`/campaigns/${id}`);
            setCampaigns(campaigns.filter(c => c._id !== id));
            toast.success('Campaign deleted');
        } catch (error) {
            toast.error('Failed to delete campaign');
        }
    };

    const getTypeBadge = (type) => {
        const map = {
            'success': 'bg-emerald-50 text-emerald-600 border-emerald-200',
            'warning': 'bg-amber-50 text-amber-600 border-amber-200',
            'danger': 'bg-red-50 text-red-600 border-red-200',
            'offer': 'bg-indigo-50 text-indigo-600 border-indigo-200',
        };
        return map[type] || 'bg-slate-50 text-slate-600 border-slate-200';
    };

    const filtered = campaigns.filter(c => !search ||
        c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="min-h-full p-4 flex flex-col gap-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">Campaigns</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Manage and broadcast marketing campaigns to users</p>
                </div>
                <div className="flex items-center gap-3 mt-3 md:mt-0">
                    <div className="px-3 border-r border-slate-100 text-right">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Active</p>
                        <p className="text-[14px] font-bold text-slate-800">{campaigns.filter(c => c.is_active).length}</p>
                    </div>
                    <div className="relative w-40">
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search campaigns..."
                            className="w-full rounded-md pl-8 pr-3 py-1.5 text-[11px] outline-none border border-slate-200 focus:border-[#011d52] focus:ring-1 focus:ring-[#011d52]/20 bg-white" />
                        <svg className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <Link to="/admin/campaigns/create"
                        className="px-3 py-1.5 bg-[#011d52] text-white rounded-md font-bold text-[10px] hover:bg-[#02143a] transition">
                        + New Campaign
                    </Link>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-6 h-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Loading campaigns...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 bg-slate-50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No campaigns found.</p>
                    <Link to="/admin/campaigns/create" className="mt-3 inline-block text-[9px] font-bold uppercase tracking-widest text-[#011d52] hover:underline">Create One</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((c) => (
                        <div key={c._id}
                            className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:border-blue-200 transition-all overflow-hidden group flex flex-col">

                            {/* Campaign Image */}
                            <div className="h-28 w-full bg-slate-100 flex items-center justify-center overflow-hidden border-b border-slate-100 flex-shrink-0">
                                {c.image?.url ? (
                                    <img src={`${BASE_URL}${c.image.url}`} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="flex flex-col items-center gap-1 opacity-30">
                                        <svg className="w-7 h-7 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">No Image</span>
                                    </div>
                                )}
                            </div>

                            {/* Card Body */}
                            <div className="p-4 flex-1 flex flex-col gap-2">
                                <div className="flex items-start justify-between">
                                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${getTypeBadge(c.type)}`}>
                                        {c.type || 'General'}
                                    </span>
                                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link to={`/admin/campaigns/edit/${c._id}`}
                                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </Link>
                                        <button onClick={() => handleDelete(c._id)}
                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-[12px] font-bold text-slate-800 line-clamp-1">{c.title}</h3>
                                <p className="text-[10px] text-slate-500 line-clamp-2 leading-snug flex-1">{c.description}</p>

                                <div className="mt-auto pt-3 border-t border-slate-100 space-y-1">
                                    <div className="flex justify-between text-[9px]">
                                        <span className="font-bold uppercase tracking-widest text-slate-400">Starts</span>
                                        <span className="font-medium text-slate-600">{c.starts_at ? new Date(c.starts_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Immediate'}</span>
                                    </div>
                                    <div className="flex justify-between text-[9px]">
                                        <span className="font-bold uppercase tracking-widest text-slate-400">Expires</span>
                                        <span className="font-medium text-slate-600">{c.ends_at ? new Date(c.ends_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'No Expiry'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Status</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={c.is_active} onChange={() => handleToggleStatus(c._id, c.is_active)} className="sr-only peer" />
                                    <div className="w-7 h-4 bg-slate-200 rounded-full peer peer-checked:bg-[#011d52] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-3" />
                                    <span className={`ml-2 text-[9px] font-bold uppercase tracking-widest ${c.is_active ? 'text-[#011d52]' : 'text-slate-400'}`}>
                                        {c.is_active ? 'Running' : 'Paused'}
                                    </span>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
};

export default CampaignList;
