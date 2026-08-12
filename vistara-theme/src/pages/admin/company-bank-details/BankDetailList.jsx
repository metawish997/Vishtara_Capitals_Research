import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBankDetails, deleteBankDetail, updateBankDetail } from '../../../services/bankService';
import { BASE_URL } from '../../../services/api';

const BankDetailList = () => {
    const [bankDetails, setBankDetails] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDetails();
    }, []);

    const fetchDetails = async () => {
        try {
            const response = await getBankDetails();
            setBankDetails(response.data.data);
        } catch (error) {
            console.error('Error fetching bank details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id) => {
        const item = bankDetails.find(b => b._id === id);
        if (!item) return;
        try {
            await updateBankDetail(id, { is_active: !item.is_active });
            setBankDetails(bankDetails.map(item => 
                item._id === id ? { ...item, is_active: !item.is_active } : item
            ));
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this bank detail?')) {
            try {
                await deleteBankDetail(id);
                setBankDetails(bankDetails.filter(item => item._id !== id));
            } catch (error) {
                console.error('Error deleting bank detail:', error);
                alert('Failed to delete bank detail');
            }
        }
    };

    return (
        <main className="min-h-full p-4 flex flex-col gap-4 font-plus-jakarta">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">Company Bank Details</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Manage bank accounts and QR payment methods for your company</p>
                </div>
                <div className="flex items-center gap-2 mt-3 md:mt-0">
                    <Link to="/admin/company-bank-details/create" 
                        className="px-3 py-1.5 bg-[#011d52] text-white rounded-md font-bold text-[10px] hover:bg-[#02143a] transition-all">
                        + Add Bank Detail
                    </Link>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-slate-500">Type</th>
                                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-slate-500">Bank / Label</th>
                                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-slate-500">Details</th>
                                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-slate-500 text-center">Status</th>
                                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[slate-200]">
                            {bankDetails.map((item) => (
                                <tr key={item._id} className="hover:bg-slate-50 transition-colors group">
                                     <td className="px-6 py-4">
                                         {item.payment_type === 'qr' ? (
                                             <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-white text-slate-800 border border-slate-200">QR</span>
                                         ) : (
                                             <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-white text-slate-800 border border-slate-200">BANK</span>
                                         )}
                                     </td>

                                     <td className="px-6 py-4">
                                         <div className="flex items-center gap-3">
                                             {item.bank_logo && item.bank_logo.url ? (
                                                 <img src={`${BASE_URL}${item.bank_logo.url}`} className="w-8 h-8 rounded-md border border-slate-200 object-contain p-1 bg-white" alt="Logo" />
                                             ) : (
                                                 <div className="w-8 h-8 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500">
                                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                                                 </div>
                                             )}
                                             <div>
                                                 <div className="text-xs font-bold text-slate-800 leading-tight mb-0.5">{item.bank_name || 'UPI Payment'}</div>
                                                 <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.account_holder_name || 'Quick Payment'}</div>
                                             </div>
                                         </div>
                                     </td>

                                     <td className="px-6 py-4">
                                         {item.payment_type === 'bank' ? (
                                             <div className="space-y-0.5">
                                                 <div className="text-xs font-bold text-slate-800"><span className="text-slate-500 mr-1">A/C:</span> <span className="font-mono">{item.account_number}</span></div>
                                                 <div className="text-[10px] font-bold text-slate-500"><span className="mr-1 uppercase">IFSC:</span> <span className="font-mono">{item.ifsc_code}</span></div>
                                             </div>
                                         ) : (
                                             <div className="space-y-1">
                                                 <div className="text-xs font-bold text-slate-800"><span className="text-slate-500 mr-1">UPI:</span> <span className="font-mono">{item.upi_id}</span></div>
                                                 {item.qr_code_image && (
                                                     <div className="w-8 h-8 rounded-md border border-slate-200 bg-white p-0.5 flex items-center justify-center cursor-pointer hover:border-[[#011d52]] transition-all">
                                                         <svg className="w-5 h-5 text-slate-500" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2z" /></svg>
                                                     </div>
                                                 )}
                                             </div>
                                         )}
                                     </td>

                                     <td className="px-6 py-4 text-center">
                                         <button onClick={() => handleToggleStatus(item._id)} 
                                                 className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border transition-all active:scale-95
                                                        ${item.is_active 
                                                            ? 'bg-[[#011d52]] text-[#020210] border-transparent' 
                                                            : 'bg-white text-slate-500 border-slate-200'}`}>
                                             {item.is_active ? 'Active' : 'Inactive'}
                                         </button>
                                     </td>

                                     <td className="px-6 py-4 text-right whitespace-nowrap">
                                         <div className="flex justify-end items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                             <Link to={`/admin/company-bank-details/edit/${item._id}`} 
                                                className="p-1.5 text-slate-500 hover:text-[[#011d52]] hover:bg-slate-50 rounded-md border border-transparent hover:border-slate-200 transition-all" title="Edit">
                                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                 </svg>
                                             </Link>
                                             <button onClick={() => handleDelete(item._id)} 
                                                     className="p-1.5 text-slate-500 hover:text-red-500 hover:bg-slate-50 rounded-md border border-transparent hover:border-slate-200 transition-all" title="Delete">
                                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                 </svg>
                                             </button>
                                         </div>
                                     </td>
                                 </tr>
                             ))}
                            {bankDetails.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-500">
                                            <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                                            </svg>
                                            <p className="text-[10px] font-bold uppercase tracking-widest">No payment methods found</p>
                                            <Link to="/admin/company-bank-details/create" className="mt-4 text-[[#011d52]] text-[10px] font-bold hover:underline uppercase tracking-widest">Add your first detail</Link>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default BankDetailList;
