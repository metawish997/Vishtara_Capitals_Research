import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import announcementService from '../../../services/announcementService';
import toast from 'react-hot-toast';

const AnnouncementList = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const res = await announcementService.getAnnouncements();
            if (res.success) setAnnouncements(res.data);
        } catch (error) {
            toast.error('Failed to load announcements');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAnnouncements(); }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                const res = await announcementService.deleteAnnouncement(id);
                if (res.success) {
                    toast.success('Announcement deleted');
                    setAnnouncements(announcements.filter(a => a._id !== id));
                }
            } catch (error) {
                toast.error('Failed to delete announcement');
            }
        }
    };

    const getTypeBadge = (type) => {
        const map = {
            'Features': 'bg-purple-50 text-purple-600 border-purple-200',
            'Service Update': 'bg-blue-50 text-[#011d52] border-blue-200',
        };
        return map[type] || 'bg-slate-50 text-slate-600 border-slate-200';
    };

    const filtered = announcements.filter(a => !search || a.title?.toLowerCase().includes(search.toLowerCase()) || a.content?.toLowerCase().includes(search.toLowerCase()));

    return (
        <main className="min-h-full p-4 flex flex-col gap-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">Announcements</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Manage dashboard updates and maintenance alerts</p>
                </div>
                <div className="flex items-center gap-3 mt-3 md:mt-0">
                    <div className="relative w-48">
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search announcements..."
                            className="w-full rounded-md pl-8 pr-3 py-1.5 text-[11px] outline-none border border-slate-200 focus:border-[#011d52] focus:ring-1 focus:ring-[#011d52]/20 bg-white" />
                        <svg className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <Link to="/admin/announcements/create"
                        className="px-3 py-1.5 bg-[#011d52] text-white rounded-md font-bold text-[10px] hover:bg-[#02143a] transition">
                        + New Announcement
                    </Link>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-6 h-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Loading...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 bg-slate-50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No announcements found.</p>
                    <Link to="/admin/announcements/create" className="mt-3 inline-block text-[9px] font-bold uppercase tracking-widest text-[#011d52] hover:underline">Create One</Link>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Title & Content</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Type</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Published</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((a) => (
                                    <tr key={a._id} className="border-b border-slate-50 hover:bg-[#f8fafc] transition-colors group">
                                        <td className="px-4 py-3 max-w-sm">
                                            <p className="text-[11px] font-semibold text-slate-800 leading-tight">{a.title}</p>
                                            <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{a.content}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${getTypeBadge(a.type)}`}>
                                                {a.type || 'Others'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-[10px] font-medium text-slate-600">{new Date(a.published_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                            <p className="text-[9px] text-slate-400">{new Date(a.published_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <Link to={`/admin/announcements/edit/${a._id}`}
                                                    className="px-2 py-1 text-[8px] font-bold uppercase tracking-widest rounded bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 transition-colors">
                                                    Edit
                                                </Link>
                                                <button onClick={() => handleDelete(a._id)}
                                                    className="px-2 py-1 text-[8px] font-bold uppercase tracking-widest rounded bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors">
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </main>
    );
};

export default AnnouncementList;
