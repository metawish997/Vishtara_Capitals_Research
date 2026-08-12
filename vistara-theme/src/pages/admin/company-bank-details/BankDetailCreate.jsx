import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createBankDetail } from '../../../services/bankService';
import mediaService from '../../../services/mediaService';

const BankDetailCreate = () => {
    const navigate = useNavigate();
    const [paymentType, setPaymentType] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        bank_name: '',
        account_holder_name: '',
        account_number: '',
        account_type: '',
        ifsc_code: '',
        branch_address: '',
        upi_id: '',
        phone_number: '',
        is_active: true
    });
    const [previews, setPreviews] = useState({
        bank_logo: null,
        qr_code: null
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e, key) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreviews(prev => ({ ...prev, [key]: event.target.result }));
                // In a real app, you might want to store the file object to upload
                setFormData(prev => ({ ...prev, [key]: file }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const submissionData = { ...formData, payment_type: paymentType };

            // Handle Media Uploads
            if (formData.bank_logo instanceof File) {
                const logoRes = await mediaService.upload(formData.bank_logo, 'company_bank_details');
                submissionData.bank_logo = logoRes.data[0]._id;
            }
            if (formData.qr_code instanceof File) {
                const qrRes = await mediaService.upload(formData.qr_code, 'company_bank_details');
                submissionData.qr_code_image = qrRes.data[0]._id;
            }

            // Cleanup any remaining File objects
            Object.keys(submissionData).forEach(key => {
                if (submissionData[key] instanceof File) {
                    delete submissionData[key];
                }
            });

            await createBankDetail(submissionData);
            navigate('/admin/company-bank-details');
        } catch (error) {
            console.error('Error creating bank detail:', error);
            alert('Failed to save bank detail: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-full p-4 flex flex-col font-plus-jakarta">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] max-w-4xl mx-auto w-full">
                <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h2 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#011d52]"></span>
                        Add Bank Detail
                    </h2>
                    <Link to="/admin/company-bank-details" className="text-[10px] font-bold text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-widest">
                        Cancel &times;
                    </Link>
                </div>

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-6">

                    {/* Payment Type Selection */}
                    <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-2">Payment Method Type</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <button
                                type="button"
                                onClick={() => setPaymentType('bank')}
                                className={`flex items-center gap-3 p-3 rounded-md border transition-all text-left group ${paymentType === 'bank' ? 'border-[#011d52] bg-blue-50/30' : 'border-slate-200 bg-white hover:border-[#011d52]'}`}>
                                <div className={`w-8 h-8 rounded flex items-center justify-center transition-all ${paymentType === 'bank' ? 'bg-[#011d52] text-white' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                </div>
                                <div>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest leading-none ${paymentType === 'bank' ? 'text-[#011d52]' : 'text-slate-600'}`}>Bank Account</p>
                                    <p className="text-[9px] text-slate-400 mt-1 font-semibold">Standard IMPS/NEFT/RTGS</p>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setPaymentType('qr')}
                                className={`flex items-center gap-3 p-3 rounded-md border transition-all text-left group ${paymentType === 'qr' ? 'border-[#011d52] bg-blue-50/30' : 'border-slate-200 bg-white hover:border-[#011d52]'}`}>
                                <div className={`w-8 h-8 rounded flex items-center justify-center transition-all ${paymentType === 'qr' ? 'bg-[#011d52] text-white' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                                </div>
                                <div>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest leading-none ${paymentType === 'qr' ? 'text-[#011d52]' : 'text-slate-600'}`}>QR Code / UPI</p>
                                    <p className="text-[9px] text-slate-400 mt-1 font-semibold">Fast payments via UPI apps</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {paymentType === 'bank' && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-2">Bank Account Information</label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Bank Name *</label>
                                    <input type="text" name="bank_name" value={formData.bank_name} onChange={handleInputChange} required className="block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-800 outline-none focus:border-[#011d52] transition-colors" placeholder="e.g. State Bank of India" />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Account Holder Name *</label>
                                    <input type="text" name="account_holder_name" value={formData.account_holder_name} onChange={handleInputChange} required className="block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-800 outline-none focus:border-[#011d52] transition-colors" placeholder="e.g. The Rapid Investors" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Account Number *</label>
                                    <input type="text" name="account_number" value={formData.account_number} onChange={handleInputChange} required className="block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-[10px] font-mono font-bold text-slate-800 outline-none focus:border-[#011d52] transition-colors" placeholder="Enter account number" />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Account Type *</label>
                                    <select name="account_type" value={formData.account_type} onChange={handleInputChange} required className="block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-800 outline-none focus:border-[#011d52] transition-colors appearance-none cursor-pointer">
                                        <option value="">Select...</option>
                                        <option value="saving">Saving Account</option>
                                        <option value="current">Current Account</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">IFSC Code *</label>
                                    <input type="text" name="ifsc_code" value={formData.ifsc_code.toUpperCase()} onChange={handleInputChange} required className="block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-[10px] font-mono font-bold text-slate-800 uppercase outline-none focus:border-[#011d52] transition-colors" placeholder="e.g. SBIN0001234" />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Bank Logo (Optional)</label>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 border border-dashed border-slate-200 rounded-md p-2 bg-slate-50 relative hover:border-[#011d52] hover:bg-[#011d52]/5 transition-all cursor-pointer group">
                                            <input type="file" onChange={(e) => handleFileChange(e, 'bank_logo')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            <div className="text-center">
                                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-[#011d52]">Upload Logo</span>
                                            </div>
                                        </div>
                                        {previews.bank_logo && <img src={previews.bank_logo} className="w-8 h-8 rounded border border-slate-200 object-contain p-0.5 bg-white" alt="Preview" />}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Branch Address</label>
                                <textarea name="branch_address" rows="2" value={formData.branch_address} onChange={handleInputChange} className="block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-800 outline-none focus:border-[#011d52] transition-colors resize-none" placeholder="Enter branch full address" />
                            </div>
                        </div>
                    )}

                    {paymentType === 'qr' && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-2">UPI / QR Information</label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">UPI ID *</label>
                                    <input type="text" name="upi_id" value={formData.upi_id} onChange={handleInputChange} required className="block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-[10px] font-mono font-bold text-slate-800 outline-none focus:border-[#011d52] transition-colors" placeholder="e.g. rapidInvestors@upi" />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Phone Number (Linked to UPI) *</label>
                                    <input type="text" name="phone_number" value={formData.phone_number} onChange={handleInputChange} required className="block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-800 outline-none focus:border-[#011d52] transition-colors" placeholder="e.g. 9876543210" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">QR Code Image *</label>
                                <div className="flex gap-4 items-start">
                                    <div className="flex-1 border border-dashed border-slate-200 rounded-md p-4 bg-slate-50 text-center hover:border-[#011d52] hover:bg-[#011d52]/5 transition-all group relative cursor-pointer">
                                        <input type="file" onChange={(e) => handleFileChange(e, 'qr_code')} required className="absolute inset-0 opacity-0 cursor-pointer" />
                                        <svg className="w-6 h-6 text-slate-400 mx-auto mb-1 group-hover:text-[#011d52] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" strokeWidth="2" /></svg>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-[#011d52]">Upload QR Image</p>
                                    </div>
                                    {previews.qr_code && (
                                        <img src={previews.qr_code} className="w-24 h-24 rounded-md border border-slate-200 object-cover bg-white" alt="QR Preview" />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {paymentType && (
                        <div className="animate-in fade-in duration-300">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-2">Visibility</label>
                            <div className="flex items-center gap-3 mt-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleInputChange} className="sr-only peer" />
                                    <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#011d52]"></div>
                                </label>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-800 leading-none">Active Status</p>
                                    <p className="text-[9px] text-slate-400 mt-0.5">Visible to public for payments</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                        <Link to="/admin/company-bank-details" className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded-md hover:bg-slate-50 transition-colors">Discard</Link>
                        <button
                            type="submit"
                            disabled={!paymentType || loading}
                            className={`inline-flex items-center px-4 py-1.5 border border-transparent text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${paymentType && !loading ? 'bg-[#011d52] text-white hover:bg-[#02143a]' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                            {loading ? 'Saving...' : 'Save Bank Detail'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};


export default BankDetailCreate;
