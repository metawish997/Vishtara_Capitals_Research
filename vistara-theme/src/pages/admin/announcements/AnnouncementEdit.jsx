import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import announcementService from '../../../services/announcementService';
import toast from 'react-hot-toast';

const AnnouncementEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: '', type: '', published_at: '', content: '', detail: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                const res = await announcementService.getSingleAnnouncement(id);
                if (res.success) {
                    const data = res.data;
                    if (data.published_at) data.published_at = new Date(data.published_at).toISOString().slice(0, 16);
                    setFormData(data);
                }
            } catch (error) {
                toast.error('Failed to load announcement details');
            } finally {
                setLoading(false);
            }
        };
        fetchAnnouncement();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await announcementService.updateAnnouncement(id, formData);
            if (res.success) {
                toast.success('Announcement updated successfully');
                navigate('/admin/announcements');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update announcement');
        }
    };

    const inputClass = "w-full px-3 py-2 border border-slate-200 rounded-md text-[11px] text-slate-800 focus:outline-none focus:border-[#011d52] focus:ring-1 focus:ring-[#011d52]/20 transition-all bg-white placeholder:text-slate-400";
    const labelClass = "block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1.5";

    if (loading) return (
        <main className="min-h-full p-4 flex flex-col items-center justify-center gap-3 py-12">
            <div className="w-6 h-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Loading...</p>
        </main>
    );

    return (
        <main className="min-h-full p-4 flex flex-col gap-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">Edit Announcement</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Updating: <span className="text-[#011d52]">{formData.title}</span></p>
                </div>
                <div className="flex items-center gap-3 mt-3 md:mt-0">
                    <Link to="/admin/announcements" className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-md font-bold text-[10px] hover:bg-slate-50 transition">← Back</Link>
                    <button form="editForm" className="px-4 py-1.5 bg-[#011d52] text-white rounded-md font-bold text-[10px] hover:bg-[#02143a] transition">
                        Update
                    </button>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                <form id="editForm" onSubmit={handleSubmit} className="p-5 space-y-5">
                    <div>
                        <label className={labelClass}>Announcement Title *</label>
                        <input type="text" name="title" value={formData.title} onChange={handleInputChange} required
                            className={inputClass} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Category Type *</label>
                            <select name="type" value={formData.type} onChange={handleInputChange} required className={`${inputClass} cursor-pointer`}>
                                <option value="Features">Features</option>
                                <option value="Service Update">Service Update</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Original Publish Date</label>
                            <input type="datetime-local" name="published_at" value={formData.published_at} readOnly
                                className={`${inputClass} opacity-60 cursor-not-allowed`} />
                            <p className="text-[9px] text-slate-400 mt-1 italic">Publish date cannot be modified.</p>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className={labelClass.replace('mb-1.5', '')}>Short Summary *</label>
                            <span className="text-[9px] font-bold text-slate-300">{formData.content?.length || 0}/255</span>
                        </div>
                        <textarea name="content" rows="2" maxLength="255" value={formData.content} onChange={handleInputChange} required
                            className={`${inputClass} resize-none`} />
                    </div>

                    <div>
                        <label className={labelClass}>Full Details *</label>
                        <textarea name="detail" rows="6" value={formData.detail} onChange={handleInputChange} required
                            className={`${inputClass} resize-y font-mono leading-relaxed`} />
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                        <button type="button" onClick={() => navigate(-1)}
                            className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">
                            Cancel
                        </button>
                        <button type="submit"
                            className="px-6 py-2 bg-[#011d52] text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-[#02143a] transition-all active:scale-95">
                            Update Announcement
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default AnnouncementEdit;
