import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOfferBanners, deleteOfferBanner, updateOfferBanner } from '../../../services/offerBannerService';
import { BASE_URL } from '../../../services/api';

const OfferBannerList = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const response = await getOfferBanners();
            setBanners(response.data.data);
        } catch (error) {
            console.error('Error fetching banners:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id) => {
        const banner = banners.find(b => b._id === id);
        if (!banner) return;
        try {
            await updateOfferBanner(id, { is_active: !banner.is_active });
            setBanners(banners.map(b => 
                b._id === id ? { ...b, is_active: !b.is_active } : b
            ));
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this banner?')) {
            try {
                await deleteOfferBanner(id);
                setBanners(banners.filter(b => b._id !== id));
            } catch (error) {
                console.error('Error deleting banner:', error);
                alert('Failed to delete banner');
            }
        }
    };

    return (
        <div className="min-h-full font-plus-jakarta flex flex-col gap-4 bg-white" style={{ padding: '16px' }}>

            {/* Table Card */}
            <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden">
                {/* Header Row */}
                <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <h3 className="text-[12px] font-bold text-slate-800">Offer Banners</h3>
                        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                            <span className="text-[9px] text-slate-400 font-medium">Manage promotional banners</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link to="/admin/offer-banners/create" 
                            className="text-[10px] font-semibold bg-[#011d52] text-white border border-[#011d52] px-2.5 py-1 rounded-md hover:bg-[#03173d] transition-colors flex items-center gap-1">
                            + Add Banner
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-slate-100">
                                <th className="px-4 py-1.5 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Banner</th>
                                <th className="px-4 py-1.5 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Heading</th>
                                <th className="px-4 py-1.5 text-[8px] text-slate-400 uppercase font-bold tracking-widest text-center">Status</th>
                                <th className="px-4 py-1.5 text-[8px] text-slate-400 uppercase font-bold tracking-widest text-center">Position</th>
                                <th className="px-4 py-1.5 text-[8px] text-slate-400 uppercase font-bold tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[slate-200]">
                            {banners.map((item) => (
                                <tr key={item._id} className="border-b border-slate-50 hover:bg-[#f8fafc] transition-colors group">
                                    {/* Image */}
                                    <td className="px-4 py-2">
                                        <div className="flex items-center gap-4">
                                            <div className="w-24 h-12 bg-slate-50 rounded-md border border-slate-200 overflow-hidden flex items-center justify-center">
                                                {item.image && item.image.url ? (
                                                    <img src={`${BASE_URL}${item.image.url}`} alt="Banner" className="w-full h-full object-cover" />
                                                ) : (
                                                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Heading */}
                                    <td className="px-4 py-2">
                                        <div className="flex flex-col">
                                            <div className="font-semibold text-[11px] text-slate-800 leading-tight">
                                                {item.heading}
                                            </div>
                                            <div className="text-[10px] text-slate-500 mt-0.5 font-medium line-clamp-1">
                                                {item.sub_heading}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-2 text-center">
                                        <button onClick={() => handleToggleStatus(item._id)} className="transition-transform hover:scale-105 active:scale-95">
                                            {item.is_active ? (
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded border border-[#a7f3d0] bg-[#ecfdf5] text-[8px] font-bold text-[#10b981] uppercase tracking-widest">
                                                    ● Streaming
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded text-[8px] font-bold bg-white text-slate-500 border border-slate-200 uppercase tracking-widest hover:bg-slate-50 transition-all">
                                                    Activate
                                                </span>
                                            )}
                                        </button>
                                    </td>

                                    {/* Position */}
                                    <td className="px-4 py-2 text-center text-slate-800 font-bold text-[11px]">
                                        #{item.position}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-2 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link to={`/admin/offer-banners/edit/${item._id}`}
                                                className="p-1 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded transition-colors">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                            </Link>
                                            <button onClick={() => handleDelete(item._id)}
                                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {banners.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500 text-xs">
                                        No offer banners found. Click the button above to add one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OfferBannerList;
