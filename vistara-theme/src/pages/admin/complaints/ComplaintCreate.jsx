import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createComplaintRecord, getComplaintRecordById, updateComplaintRecord } from '../../../services/complaintService';

const ComplaintCreate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [formData, setFormData] = useState({
        received_from: '',
        customer_name: '',
        customer_mobile: '',
        complaint_number: '',
        complaint_date: '',
        status: 'pending'
    });

    useEffect(() => {
        if (id) {
            fetchComplaint();
        }
    }, [id]);

    const fetchComplaint = async () => {
        setFetching(true);
        try {
            const response = await getComplaintRecordById(id);
            const data = response.data.data;
            // Format date for input type="date"
            if (data.complaint_date) {
                data.complaint_date = new Date(data.complaint_date).toISOString().split('T')[0];
            }
            setFormData(data);
        } catch (error) {
            console.error('Error fetching complaint:', error);
            alert('Failed to load complaint details');
        } finally {
            setFetching(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await updateComplaintRecord(id, formData);
            } else {
                await createComplaintRecord(formData);
            }
            navigate('/admin/complaints');
        } catch (error) {
            console.error('Error saving complaint:', error);
            alert('Failed to save complaint record');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-20 text-center font-black text-gray-200 text-xs uppercase tracking-widest">Loading...</div>;

    return (
        <div className="font-plus-jakarta">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-xs font-semibold font-bold text-slate-800 tracking-tight leading-none">{id ? 'Edit' : 'Add'} Master Complaint</h1>
                    <p className="mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">{id ? 'Update existing' : 'Initialize a new'} master record for an investor grievance.</p>
                </div>
                <Link to="/admin/complaints" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-800 transition-colors">
                    &larr; BACK TO MASTER LIST
                </Link>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-4 space-y-6">
                    
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Received From <span className="text-red-500">*</span></label>
                                <select 
                                    name="received_from" 
                                    value={formData.received_from} 
                                    onChange={handleInputChange} 
                                    required 
                                    className="block w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[[#011d52]] transition-all appearance-none cursor-pointer shadow-sm">
                                    <option value="">Select Path Source</option>
                                    <option value="Directly from Investor">Directly from Investor</option>
                                    <option value="SEBI (SCORES)">SEBI (SCORES)</option>
                                    <option value="Other Sources">Other Integrated Sources</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Complaint Status <span className="text-red-500">*</span></label>
                                <select 
                                    name="status" 
                                    value={formData.status} 
                                    onChange={handleInputChange} 
                                    required 
                                    className="block w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[[#011d52]] transition-all appearance-none cursor-pointer shadow-sm">
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Customer Full Name <span className="text-red-500">*</span></label>
                                <input type="text" name="customer_name" value={formData.customer_name} onChange={handleInputChange} required className="block w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[[#011d52]] transition-all shadow-sm" placeholder="Enter name" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Mobile Contact No</label>
                                <input type="text" name="customer_mobile" value={formData.customer_mobile} onChange={handleInputChange} className="block w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-500 font-mono outline-none focus:border-[[#011d52]] transition-all shadow-sm" placeholder="+91 XXXX XXXX XX" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Official Complaint ID / No</label>
                                <input type="text" name="complaint_number" value={formData.complaint_number} onChange={handleInputChange} className="block w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 font-mono outline-none focus:border-[[#011d52]] transition-all shadow-sm" placeholder="e.g. BSM-2024-001" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Recorded Date <span className="text-red-500">*</span></label>
                                <input type="date" name="complaint_date" value={formData.complaint_date} onChange={handleInputChange} required className="block w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[[#011d52]] transition-all shadow-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-8 flex items-center justify-end gap-3 border-t border-slate-200">
                        <Link to="/admin/complaints" className="px-4 py-2 bg-white border border-slate-200 text-slate-500 text-xs font-bold rounded-md hover:bg-slate-50 transition shadow-sm">CANCEL</Link>
                        <button type="submit" disabled={loading} className="inline-flex items-center px-6 py-2 border border-transparent text-xs font-bold uppercase tracking-widest rounded-md shadow-sm bg-[[#011d52]] text-[#020210] hover:opacity-90 transition-all active:scale-95 disabled:opacity-50">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                            {loading ? 'Saving...' : id ? 'Update Master Record' : 'Save Master Record'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ComplaintCreate;
