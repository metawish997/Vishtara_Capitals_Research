import React, { useState, useEffect } from 'react';
import contactService from '../../../services/contactService';
import toast from 'react-hot-toast';

const ContactDetails = () => {
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        address: ''
    });
    const [id, setId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchContactInfo = async () => {
        try {
            setLoading(true);
            const res = await contactService.getContactDetails();
            const contactData = res.data.data;
            if (contactData) {
                setFormData({
                    email: contactData.email || '',
                    phone: contactData.phone || '',
                    address: contactData.address || ''
                });
                setId(contactData._id);
            } else {
                setFormData({ email: '', phone: '', address: '' });
                setId(null);
            }
        } catch (error) {
            toast.error('Failed to load contact parameters');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContactInfo();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            if (id) {
                await contactService.updateContactDetail(id, formData);
                toast.success('Contact protocol updated');
            } else {
                const res = await contactService.createContactDetail(formData);
                setId(res.data.data._id);
                toast.success('New contact node deployed');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Synchronization failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to erase all contact data? This will reset the platform identity.')) return;
        try {
            setLoading(true);
            await contactService.deleteContactDetail(id);
            setId(null);
            setFormData({ email: '', phone: '', address: '' });
            toast.success('Contact node erased');
        } catch (error) {
            toast.error('Deletion failed');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
            <div className="text-center font-black text-slate-300 text-[10px] uppercase tracking-[0.4em] animate-pulse">Decrypting Communication Nodes...</div>
        </div>
    );

    return (
        <main className="min-h-full p-4 flex flex-col gap-4 font-plus-jakarta">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">Contact Details</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Manage your platform's official public footprint</p>
                </div>
                {id && (
                    <button
                        onClick={handleDelete}
                        className="inline-flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-md transition-colors text-[9px] uppercase tracking-widest mt-3 md:mt-0"
                    >
                        <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Erase Protocol
                    </button>
                )}
            </div>

            {/* Main Form Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Official Communication Parameters</h2>
                    {id && <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">UID: {id.slice(-8).toUpperCase()}</span>}
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                Official Email Address *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="e.g. support@therapidinvestors.com"
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-800 outline-none focus:border-[[#011d52]] transition-colors"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                Direct Phone Line
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="+91 XXXX XXXX XX"
                                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-800 outline-none focus:border-[[#011d52]] transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            Corporate HQ Address
                        </label>
                        <textarea
                            name="address"
                            rows="4"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Enter full physical location details..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-800 outline-none focus:border-[[#011d52]] transition-colors resize-y"
                        ></textarea>
                    </div>

                    <div className="pt-6 flex items-center justify-between border-t border-slate-200">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            {id ? 'Live Node Active' : 'Deployment Mode'}
                        </p>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`bg-[#011d52] text-[slate-50] hover:opacity-90 text-[10px] font-bold uppercase tracking-widest px-6 py-2 rounded-md shadow-sm transition-all flex items-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting && <div className="w-3 h-3 border-2 border-[slate-50] border-t-transparent rounded-full animate-spin"></div>}
                            {id ? 'Update Protocol' : 'Deploy Node'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Footer Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <p className="text-[10px] text-amber-700 font-bold uppercase tracking-widest leading-relaxed">
                    Security Notice: These communication endpoints are public-facing. Updates made here will synchronize across the entire platform's headers, footers, and contact systems in real-time.
                </p>
            </div>
            {/* </div> */}
        </main>
    );
};

export default ContactDetails;
