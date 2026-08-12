import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOfferBanner } from '../../../services/offerBannerService';
import mediaService from '../../../services/mediaService';

const OfferBannerCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        highlight_text: '',
        heading: '',
        sub_heading: '',
        content: '',
        button1_text: '',
        button1_link: '',
        button2_text: '',
        button2_link: '',
        is_active: '1',
        start_date: '',
        end_date: '',
        position: 0
    });

    const [desktopFile, setDesktopFile] = useState(null);
    const [mobileFile, setMobileFile] = useState(null);
    const [desktopPreview, setDesktopPreview] = useState(null);
    const [mobilePreview, setMobilePreview] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (type === 'desktop') setDesktopFile(file);
            if (type === 'mobile') setMobileFile(file);
            
            const reader = new FileReader();
            reader.onload = (event) => {
                if (type === 'desktop') setDesktopPreview(event.target.result);
                if (type === 'mobile') setMobilePreview(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const submissionData = { 
                ...formData, 
                is_active: formData.is_active === '1'
            };

            // Upload Images
            if (desktopFile) {
                const res = await mediaService.upload(desktopFile, 'offer_banners');
                submissionData.image = res.data[0]._id;
            }
            if (mobileFile) {
                const res = await mediaService.upload(mobileFile, 'offer_banners');
                submissionData.mobile_image = res.data[0]._id;
            }

            await createOfferBanner(submissionData);
            navigate('/admin/offer-banners');
        } catch (error) {
            console.error('Error creating banner:', error);
            alert('Failed to create banner: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font-plus-jakarta">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-xs font-semibold font-bold text-slate-800 tracking-tight">Create Offer Banner</h1>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">
                        Promotional Banner Management
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button type="button" onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-500 text-xs font-bold rounded-md hover:bg-slate-50 transition shadow-sm">
                        DISCARD
                    </button>
                    <button type="submit" form="bannerForm" disabled={loading}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#020210] rounded-md shadow-sm transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[[#011d52]] hover:opacity-90'}`}>
                        {loading ? 'Processing...' : 'Save Banner'}
                    </button>
                </div>
            </div>

            <form id="bannerForm" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT COLUMN */}
                <div className="lg:col-span-8 space-y-6">

                    {/* CONTENT */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-widest text-slate-500 flex justify-between items-center">
                            <span>Banner Content</span>
                        </div>

                        <div className="p-4 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Highlight Text</label>
                                    <input type="text" name="highlight_text" value={formData.highlight_text} onChange={handleInputChange}
                                        className="w-full rounded-md border border-slate-200 bg-slate-50 text-slate-800 px-4 py-2.5 text-xs outline-none focus:border-[[#011d52]] transition-all shadow-sm"
                                        placeholder="e.g. 50% OFF" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Main Heading *</label>
                                    <input type="text" name="heading" required value={formData.heading} onChange={handleInputChange}
                                        className="w-full rounded-md border border-slate-200 bg-slate-50 text-slate-800 px-4 py-2.5 text-xs outline-none focus:border-[[#011d52]] transition-all shadow-sm"
                                        placeholder="The main title of your banner" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Sub Heading</label>
                                    <input type="text" name="sub_heading" value={formData.sub_heading} onChange={handleInputChange}
                                        className="w-full rounded-md border border-slate-200 bg-slate-50 text-slate-800 px-4 py-2.5 text-xs outline-none focus:border-[[#011d52]] transition-all shadow-sm"
                                        placeholder="Supporting text for the heading" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Description *</label>
                                <textarea name="content" rows="4" required value={formData.content} onChange={handleInputChange}
                                    className="w-full rounded-md border border-slate-200 bg-slate-50 text-slate-800 px-4 py-2.5 text-xs outline-none focus:border-[[#011d52]] transition-all shadow-sm resize-none"
                                    placeholder="Enter detailed offer description here..."></textarea>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-widest text-slate-500">
                            Call To Action Buttons
                        </div>

                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* PRIMARY */}
                            <div className="p-4 rounded-md border border-slate-200 bg-slate-50 space-y-4">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-800 block mb-2 border-b border-slate-200 pb-2">
                                    Primary Button
                                </span>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Label</label>
                                    <input type="text" name="button1_text" placeholder="e.g. Join Now" required value={formData.button1_text} onChange={handleInputChange}
                                        className="w-full rounded-md border border-slate-200 bg-white text-slate-800 px-3 py-2 text-xs outline-none focus:border-[[#011d52]] transition-all shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Link</label>
                                    <input type="url" name="button1_link" placeholder="https://..." required value={formData.button1_link} onChange={handleInputChange}
                                        className="w-full rounded-md border border-slate-200 bg-white text-slate-800 px-3 py-2 text-xs outline-none focus:border-[[#011d52]] transition-all shadow-sm" />
                                </div>
                            </div>

                            {/* SECONDARY */}
                            <div className="p-4 rounded-md border border-slate-200 bg-slate-50 space-y-4">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2 border-b border-slate-200 pb-2">
                                    Secondary Button
                                </span>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Label</label>
                                    <input type="text" name="button2_text" placeholder="e.g. Learn More" value={formData.button2_text} onChange={handleInputChange}
                                        className="w-full rounded-md border border-slate-200 bg-white text-slate-800 px-3 py-2 text-xs outline-none focus:border-[[#011d52]] transition-all shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Link</label>
                                    <input type="url" name="button2_link" placeholder="https://..." value={formData.button2_link} onChange={handleInputChange}
                                        className="w-full rounded-md border border-slate-200 bg-white text-slate-800 px-3 py-2 text-xs outline-none focus:border-[[#011d52]] transition-all shadow-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="lg:col-span-4 space-y-6">

                    {/* SETTINGS */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-widest text-slate-500">
                            Banner Settings
                        </div>

                        <div className="p-4 space-y-5">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Status</label>
                                <select name="is_active" value={formData.is_active} onChange={handleInputChange}
                                    className="w-full rounded-md border border-slate-200 bg-slate-50 text-slate-800 px-4 py-2.5 text-xs outline-none focus:border-[[#011d52]] transition-all shadow-sm appearance-none cursor-pointer">
                                    <option value="1">Published</option>
                                    <option value="0">Draft</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Start Date</label>
                                <input type="datetime-local" name="start_date" value={formData.start_date} onChange={handleInputChange}
                                    className="w-full rounded-md border border-slate-200 bg-slate-50 text-slate-800 px-4 py-2.5 text-xs outline-none focus:border-[[#011d52]] transition-all shadow-sm" />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">End Date</label>
                                <input type="datetime-local" name="end_date" value={formData.end_date} onChange={handleInputChange}
                                    className="w-full rounded-md border border-slate-200 bg-slate-50 text-slate-800 px-4 py-2.5 text-xs outline-none focus:border-[[#011d52]] transition-all shadow-sm" />
                            </div>
                        </div>
                    </div>

                    {/* MEDIA */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-widest text-slate-500">
                            Media Assets
                        </div>

                        <div className="p-4 space-y-6">
                            {/* DESKTOP */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Desktop Banner</label>
                                    <span className="text-[8px] font-bold text-slate-800 uppercase">1920x600 px</span>
                                </div>
                                <div className="relative h-32 w-full rounded-md border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden group hover:border-[[#011d52]] transition-all">
                                    {desktopPreview ? (
                                        <img src={desktopPreview} className="w-full h-full object-cover" alt="Desktop Preview" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-1 text-slate-500">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Upload Image</span>
                                        </div>
                                    )}
                                    <input type="file" name="desktop_image" required onChange={(e) => handleFileChange(e, 'desktop')}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                </div>
                            </div>

                            {/* MOBILE */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mobile Banner</label>
                                    <span className="text-[8px] font-bold text-slate-800 uppercase">600x800 px</span>
                                </div>
                                <div className="relative h-32 w-full rounded-md border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden group hover:border-[[#011d52]] transition-all">
                                    {mobilePreview ? (
                                        <img src={mobilePreview} className="w-full h-full object-cover" alt="Mobile Preview" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-1 text-slate-500">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Upload Image</span>
                                        </div>
                                    )}
                                    <input type="file" name="mobile_image" required onChange={(e) => handleFileChange(e, 'mobile')}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </form>
        </div>
    );
};

export default OfferBannerCreate;
