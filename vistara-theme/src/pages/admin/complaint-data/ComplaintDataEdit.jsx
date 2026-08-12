import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getComplaintData, updateComplaintData, deleteComplaintData } from '../../../services/complaintService';

const ComplaintDataEdit = () => {
    const { type } = useParams(); // monthly, monthly_trend, annual
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, [type]);

    const fetchData = async () => {
        try {
            const response = await getComplaintData();
            const allData = response.data.data;
            setRecords(allData.filter(d => d.type === type));
        } catch (error) {
            console.error('Error fetching complaint data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        const newRecords = [...records];
        newRecords[index][name] = value;
        setRecords(newRecords);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            try {
                await deleteComplaintData(id);
                setRecords(records.filter(r => r._id !== id));
            } catch (error) {
                console.error('Error deleting record:', error);
                alert('Failed to delete record');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const updatePromises = records.map(record => {
                const { _id, __v, createdAt, updatedAt, ...updateData } = record;
                // Ensure numbers
                const cleanedData = {
                    ...updateData,
                    sno: Number(updateData.sno) || 0,
                    pending_last_month: Number(updateData.pending_last_month) || 0,
                    carried_forward: Number(updateData.carried_forward) || 0,
                    received: Number(updateData.received) || 0,
                    resolved: Number(updateData.resolved) || 0,
                    total_pending: Number(updateData.total_pending) || 0,
                    pending_gt_3months: Number(updateData.pending_gt_3months) || 0,
                    avg_resolution_time: Number(updateData.avg_resolution_time) || 0
                };
                return updateComplaintData(_id, cleanedData);
            });
            await Promise.all(updatePromises);
            alert('All records updated successfully');
            navigate('/admin/complaint-data');
        } catch (error) {
            console.error('Error updating records:', error);
            alert('Failed to update records: ' + (error.response?.data?.error || error.message));
        } finally {
            setSaving(false);
        }
    };

    const getTitle = () => {
        if (type === 'monthly') return 'Edit Monthly Data';
        if (type === 'monthly_trend') return 'Edit Monthly Trend';
        return 'Edit Annual Data';
    };

    if (loading) return <div className="p-20 text-center font-black text-gray-200 text-xs uppercase tracking-widest">Loading Records...</div>;

    return (
        <div className="font-plus-jakarta">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-xs font-semibold font-bold text-slate-800 tracking-tight leading-none">{getTitle()}</h1>
                    <p className="mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">Update multiple records simultaneously for {type.replace('_', ' ')} statistics.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/admin/complaint-data" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-800 transition-colors">
                        &larr; BACK TO DASHBOARD
                    </Link>
                    {type === 'monthly' && (
                        <Link to="/admin/complaint-data/create/monthly" className="inline-flex items-center px-4 py-2 bg-[[#011d52]] hover:opacity-90 text-[#020210] text-xs font-bold uppercase tracking-widest rounded-md transition-all shadow-sm active:scale-95">
                            + Add New Record
                        </Link>
                    )}
                </div>
            </div>

            {/* Spreadsheet View */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <form onSubmit={handleSubmit}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-4 font-bold text-[10px] uppercase tracking-widest text-slate-500">S.No.</th>
                                    {type === 'monthly' ? (
                                        <>
                                            <th className="px-4 py-4 font-bold text-[10px] uppercase tracking-widest text-slate-500">Received From</th>
                                            <th className="px-4 py-4 font-bold text-[10px] uppercase tracking-widest text-slate-500 w-32">Pending Last</th>
                                        </>
                                    ) : (
                                        <>
                                            <th className="px-4 py-4 font-bold text-[10px] uppercase tracking-widest text-slate-500">{type === 'monthly_trend' ? 'Month' : 'Year'}</th>
                                            <th className="px-4 py-4 font-bold text-[10px] uppercase tracking-widest text-slate-500 w-32">Carried Forward</th>
                                        </>
                                    )}
                                    <th className="px-4 py-4 font-bold text-[10px] uppercase tracking-widest text-slate-500 w-24">Received</th>
                                    <th className="px-4 py-4 font-bold text-[10px] uppercase tracking-widest text-slate-500 w-24">Resolved</th>
                                    <th className="px-4 py-4 font-bold text-[10px] uppercase tracking-widest text-slate-500 w-24">Total Pending</th>
                                    
                                    {type === 'monthly' && (
                                        <>
                                            <th className="px-4 py-4 font-bold text-[10px] uppercase tracking-widest text-slate-500 w-24">Pnd {'>'} 3M</th>
                                            <th className="px-4 py-4 font-bold text-[10px] uppercase tracking-widest text-slate-500 w-28">Avg Resolution</th>
                                        </>
                                    )}
                                    <th className="px-4 py-4 font-bold text-[10px] uppercase tracking-widest text-slate-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[slate-200]">
                                {records.map((record, index) => (
                                    <tr key={record._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <input type="number" name="sno" value={record.sno} onChange={(e) => handleInputChange(index, e)} className="w-16 px-2 py-1.5 border border-slate-200 bg-slate-50 rounded-md text-xs font-bold text-slate-800 outline-none focus:border-[[#011d52]] transition-all shadow-sm" />
                                        </td>
                                        
                                        {type === 'monthly' ? (
                                            <>
                                                <td className="px-4 py-3">
                                                    <input type="text" name="received_from" value={record.received_from} onChange={(e) => handleInputChange(index, e)} className="w-full px-2 py-1.5 border border-slate-200 bg-slate-50 rounded-md text-xs font-bold text-slate-800 outline-none focus:border-[[#011d52]] transition-all shadow-sm" />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input type="number" name="pending_last_month" value={record.pending_last_month} onChange={(e) => handleInputChange(index, e)} className="w-full px-2 py-1.5 border border-slate-200 bg-slate-50 rounded-md text-xs font-bold text-slate-500 outline-none focus:border-[[#011d52]] transition-all shadow-sm" />
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-4 py-3">
                                                    <input type="text" name="period" value={record.period} onChange={(e) => handleInputChange(index, e)} className="w-full px-2 py-1.5 border border-slate-200 bg-slate-50 rounded-md text-xs font-bold text-slate-800 outline-none focus:border-[[#011d52]] transition-all shadow-sm" />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input type="number" name="carried_forward" value={record.carried_forward} onChange={(e) => handleInputChange(index, e)} className="w-full px-2 py-1.5 border border-slate-200 bg-slate-50 rounded-md text-xs font-bold text-slate-500 outline-none focus:border-[[#011d52]] transition-all shadow-sm" />
                                                </td>
                                            </>
                                        )}
                                        
                                        <td className="px-4 py-3">
                                            <input type="number" name="received" value={record.received} onChange={(e) => handleInputChange(index, e)} className="w-full px-2 py-1.5 border border-slate-200 bg-slate-50 rounded-md text-xs font-bold text-blue-500 outline-none focus:border-[[#011d52]] transition-all shadow-sm" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input type="number" name="resolved" value={record.resolved} onChange={(e) => handleInputChange(index, e)} className="w-full px-2 py-1.5 border border-slate-200 bg-slate-50 rounded-md text-xs font-bold text-emerald-500 outline-none focus:border-[[#011d52]] transition-all shadow-sm" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input type="number" name="total_pending" value={record.total_pending} onChange={(e) => handleInputChange(index, e)} className="w-full px-2 py-1.5 border border-slate-200 bg-slate-50 rounded-md text-xs font-bold text-red-500 outline-none focus:border-[[#011d52]] transition-all shadow-sm" />
                                        </td>
                                        
                                        {type === 'monthly' && (
                                            <>
                                                <td className="px-4 py-3">
                                                    <input type="number" name="pending_gt_3months" value={record.pending_gt_3months} onChange={(e) => handleInputChange(index, e)} className="w-full px-2 py-1.5 border border-slate-200 bg-slate-50 rounded-md text-xs font-bold text-yellow-500 outline-none focus:border-[[#011d52]] transition-all shadow-sm" />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input type="number" step="0.01" name="avg_resolution_time" value={record.avg_resolution_time} onChange={(e) => handleInputChange(index, e)} className="w-full px-2 py-1.5 border border-slate-200 bg-slate-50 rounded-md text-xs font-bold text-slate-800 outline-none focus:border-[[#011d52]] transition-all shadow-sm" />
                                                </td>
                                            </>
                                        )}
                                        
                                        <td className="px-4 py-3 text-right">
                                            <button type="button" onClick={() => handleDelete(record._id)} className="p-1.5 text-slate-500 hover:text-red-500 hover:bg-slate-50 rounded-md transition-all" title="Delete">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Actions */}
                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                        <Link to="/admin/complaint-data" className="px-4 py-2 bg-white border border-slate-200 text-slate-500 text-xs font-bold rounded-md hover:bg-slate-50 transition shadow-sm">CANCEL</Link>
                        <button type="submit" className="inline-flex items-center px-6 py-2 border border-transparent text-xs font-bold uppercase tracking-widest rounded-md shadow-sm bg-[[#011d52]] text-[#020210] hover:opacity-90 transition-all active:scale-95">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            Update All Records
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ComplaintDataEdit;
