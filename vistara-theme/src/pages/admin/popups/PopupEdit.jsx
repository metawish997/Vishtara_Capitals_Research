import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { BASE_URL } from '../../../services/api';
import toast from 'react-hot-toast';

const PopupEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);
    
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const [form, setForm] = useState({
        title: '',
        description: '',
        content: '',
        button_text: '',
        button_url: '',
        type: 'notification',
        priority: 0,
        is_dismissible: true,
        status: 'active'
    });

    useEffect(() => {
        if (isEdit) {
            fetchPopup();
        }
    }, [id]);

    const fetchPopup = async () => {
        try {
            const { data } = await api.get(`/popups/${id}`);
            const popup = data.data;
            setForm({
                title: popup.title || '',
                description: popup.description || '',
                content: popup.content || '',
                button_text: popup.button_text || '',
                button_url: popup.button_url || '',
                type: popup.type || 'notification',
                priority: popup.priority || 0,
                is_dismissible: popup.is_dismissible !== false,
                status: popup.status || 'active'
            });
            if (popup.image && popup.image.url) {
                // Use BASE_URL from api.js
                setImagePreview(`${BASE_URL}${popup.image.url}`); 
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to fetch popup details');
            navigate('/admin/popups');
        } finally {
            setLoading(false);
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
        setSubmitting(true);
        try {
            let imageId = undefined;

            if (imageFile) {
                const formData = new FormData();
                formData.append('files', imageFile);
                formData.append('category', 'popups');
                const uploadRes = await api.post('/media/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (uploadRes.data.success && uploadRes.data.data.length > 0) {
                    imageId = uploadRes.data.data[0]._id;
                }
            }

            const payload = { ...form };
            if (imageId) {
                payload.image = imageId;
            }

            if (isEdit) {
                await api.put(`/popups/${id}`, payload);
                toast.success('Popup updated successfully');
            } else {
                await api.post('/popups', payload);
                toast.success('Popup created successfully');
            }
            navigate('/admin/popups');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to save popup');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="min-h-full font-plus-jakarta flex flex-col gap-4 bg-white" style={{ padding: '16px' }}>
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                        <Link to="/admin/popups" className="p-1.5 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 transition-colors">
                            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                        </Link>
                        <div>
                            <h1 className="text-[13px] font-bold text-slate-800">{isEdit ? 'Edit Popup' : 'Create Popup'}</h1>
                            <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Configure popup display parameters and content.</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => navigate('/admin/popups')} className="px-3 py-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-colors flex items-center justify-center">Cancel</button>
                        <button 
                            form="popupForm"
                            type="submit"
                            disabled={submitting}
                            className="bg-[#011d52] text-white px-4 py-1.5 rounded font-bold text-[9px] uppercase tracking-widest shadow-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2">
                            {submitting && <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                            {isEdit ? 'Save Changes' : 'Create Popup'}
                        </button>
                    </div>
                </div>

                <form id="popupForm" onSubmit={handleSubmit} className="pb-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    
                        {/* Main Content (Left) */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm space-y-3">
                                <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">General Information</h3>
                                
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Popup Title *</label>
                                        <input type="text" required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="e.g., Summer Sale" className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:border-[#011d52] transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Internal Description</label>
                                        <input type="text" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Brief notes for administration..." className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:border-[#011d52] transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Popup Content</label>
                                        <textarea rows="3" value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} placeholder="Main text content..." className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:border-[#011d52] transition-colors resize-y"></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Unit */}
                            <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm space-y-3">
                                <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">Call to Action</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Button Text</label>
                                        <input type="text" value={form.button_text} onChange={(e) => setForm({...form, button_text: e.target.value})} placeholder="e.g., Learn More" className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:border-[#011d52] transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Redirect URL</label>
                                        <input type="text" value={form.button_url} onChange={(e) => setForm({...form, button_url: e.target.value})} placeholder="https://..." className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:border-[#011d52] transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar (Right) */}
                        <div className="lg:col-span-1 space-y-4">
                        
                            {/* Asset Unit */}
                            <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm space-y-3">
                                <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">Media Asset</h3>
                                <div className="relative group cursor-pointer" onClick={() => document.getElementById('assetUpload').click()}>
                                    {imagePreview ? (
                                        <div className="relative rounded overflow-hidden border border-slate-200 aspect-video">
                                            <img src={imagePreview} alt="Asset" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-[9px] font-bold uppercase tracking-widest text-white">Change Image</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full aspect-video bg-slate-50 border border-dashed border-slate-200 rounded flex flex-col items-center justify-center p-3 text-center hover:border-[#011d52] group transition-colors">
                                            <svg className="w-5 h-5 text-slate-400 mb-1 group-hover:text-[#011d52] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-[#011d52] transition-colors">Upload Image</span>
                                        </div>
                                    )}
                                    <input id="assetUpload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </div>
                            </div>

                            {/* Settings */}
                            <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm space-y-3">
                                <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">Settings</h3>
                                
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Type</label>
                                        <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:border-[#011d52] transition-colors cursor-pointer">
                                            <option value="notification">Notification</option>
                                            <option value="offer">Offer</option>
                                            <option value="policy">Policy</option>
                                            <option value="image">Image</option>
                                            <option value="video">Video</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status</label>
                                        <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:border-[#011d52] transition-colors cursor-pointer">
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Display Priority</label>
                                        <input type="number" value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:border-[#011d52] transition-colors" />
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">User Dismissible</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={form.is_dismissible} onChange={() => setForm({...form, is_dismissible: !form.is_dismissible})} className="sr-only peer" />
                                            <div className="w-6 h-3 bg-slate-200 rounded-full peer peer-checked:bg-[#011d52] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-2 after:w-2 after:transition-all peer-checked:after:translate-x-3"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </form>
        </div>
    );
};

export default PopupEdit;
