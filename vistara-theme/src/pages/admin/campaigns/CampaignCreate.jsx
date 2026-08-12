import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { BASE_URL } from '../../../services/api';
import toast from 'react-hot-toast';

const CampaignCreate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const toLocalISO = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        return localDate.toISOString().slice(0, 16);
    };

    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const [form, setForm] = useState({
        title: '',
        description: '',
        content: '',
        type: 'info',
        starts_at: '',
        ends_at: '',
        is_active: true
    });

    useEffect(() => {
        if (isEdit) {
            fetchCampaign();
        }
    }, [id]);

    const fetchCampaign = async () => {
        try {
            const { data } = await api.get(`/campaigns/${id}`);
            const c = data.data;
            setForm({
                title: c.title || '',
                description: c.description || '',
                content: c.content || '',
                type: c.type || 'info',
                starts_at: toLocalISO(c.starts_at),
                ends_at: toLocalISO(c.ends_at),
                is_active: c.is_active
            });
            if (c.image && c.image.url) {
                setImagePreview(`${BASE_URL}${c.image.url}`);
            }
        } catch (error) {
            toast.error('Failed to fetch campaign details');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let imageId = null;
            if (imageFile) {
                const formData = new FormData();
                formData.append('files', imageFile);
                formData.append('category', 'campaigns');
                const uploadRes = await api.post('/media/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (uploadRes.data.success && uploadRes.data.data.length > 0) {
                    imageId = uploadRes.data.data[0]._id;
                }
            }

            const payload = { ...form };
            if (imageId) payload.image = imageId;

            if (isEdit) {
                await api.put(`/campaigns/${id}`, payload);
                toast.success('Campaign updated successfully');
            } else {
                await api.post('/campaigns', payload);
                toast.success('Campaign initiated successfully');
            }
            navigate('/admin/campaigns');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to save campaign');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font-plus-jakarta">
            <div className="space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                    <div>
                        <h1 className="text-xs font-semibold font-bold text-slate-800">{isEdit ? 'Edit Campaign' : 'Initiate Campaign'}</h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Configure your broadcast payload for the user ecosystem.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/admin/campaigns" className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-colors flex items-center justify-center">Cancel</Link>
                        <button 
                            form="campaignForm"
                            disabled={loading}
                            type="submit"
                            className="bg-[slate-800] hover:opacity-90 text-[slate-50] px-6 py-2 rounded-md font-bold text-[10px] uppercase tracking-widest shadow-sm transition-all disabled:opacity-50">
                            {loading ? 'Processing...' : (isEdit ? 'Update Campaign' : 'Transmit Campaign')}
                        </button>
                    </div>
                </div>

                <form id="campaignForm" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Campaign Content</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Context Title *</label>
                                    <input type="text" required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="e.g. Summer Offer 2024" className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[[#011d52]] transition-colors" />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Abstract Description *</label>
                                    <input type="text" required value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Brief summary for list view..." className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[[#011d52]] transition-colors" />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full Message Content *</label>
                                    <textarea rows="6" required value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} placeholder="Detailed transmission payload..." className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[[#011d52]] transition-colors resize-y"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Configuration</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Transmission Type</label>
                                    <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[[#011d52]] transition-colors">
                                        <option value="info">General Info</option>
                                        <option value="success">Success / Positive</option>
                                        <option value="warning">Warning / Alert</option>
                                        <option value="danger">Critical / Danger</option>
                                        <option value="offer">Promotion / Offer</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Starts At</label>
                                    <input type="datetime-local" value={form.starts_at} onChange={(e) => setForm({...form, starts_at: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[[#011d52]] transition-colors" />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Expires At</label>
                                    <input type="datetime-local" value={form.ends_at} onChange={(e) => setForm({...form, ends_at: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[[#011d52]] transition-colors" />
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Status</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({...form, is_active: e.target.checked})} className="sr-only peer" />
                                        <div className="w-7 h-4 bg-[slate-200] rounded-full peer peer-checked:bg-[[#011d52]] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-3"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Visual Asset</h3>
                            <div className="space-y-4">
                                {imagePreview ? (
                                    <div className="relative rounded-md overflow-hidden border border-slate-200 group">
                                        <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover" />
                                        <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }} className="absolute top-2 right-2 bg-[#020210]/60 text-slate-800 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-full h-32 bg-slate-50 border border-dashed border-slate-200 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-[[#011d52]] transition-all group" onClick={() => document.getElementById('imageUpload').click()}>
                                        <svg className="w-6 h-6 text-slate-500 mb-1 group-hover:text-[[#011d52]] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <p className="text-[10px] font-bold text-slate-500 group-hover:text-[[#011d52]] uppercase tracking-widest transition-colors">Upload Image</p>
                                    </div>
                                )}
                                <input id="imageUpload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CampaignCreate;
