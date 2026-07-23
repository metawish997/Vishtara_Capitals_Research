import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getComplaintData } from '../../../services/complaintService';

const ComplaintDataDashboard = () => {
    const [monthlyData, setMonthlyData] = useState([]);
    const [monthlyTrend, setMonthlyTrend] = useState([]);
    const [annualData, setAnnualData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await getComplaintData();
            const allData = response.data.data;
            setMonthlyData(allData.filter(d => d.type === 'monthly'));
            setMonthlyTrend(allData.filter(d => d.type === 'monthly_trend'));
            setAnnualData(allData.filter(d => d.type === 'annual'));
        } catch (error) {
            console.error('Error fetching complaint data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-full p-4 flex flex-col gap-4 font-plus-jakarta">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">Complaint Data Management</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Manage and review investor complaint statistics</p>
                </div>
                <div className="flex items-center gap-2 mt-3 md:mt-0">
                    <Link to="/admin/complaint-data/create/monthly" 
                        className="px-3 py-1.5 bg-[#011d52] text-white rounded-md font-bold text-[10px] hover:bg-[#02143a] transition-all">
                        + Add Record
                    </Link>
                </div>
            </div>

            {/* Monthly Data Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] mb-2">
                <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h2 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Data for the month ending - May 2024</h2>
                    <Link to="/admin/complaint-data/edit/monthly" className="text-[8px] font-bold text-slate-400 hover:text-[#011d52] hover:bg-blue-50 px-2 py-1 rounded transition-colors uppercase tracking-widest">Edit Section</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">S.No</th>
                                <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Received From</th>
                                <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Pending Prev</th>
                                <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Received</th>
                                <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Resolved</th>
                                <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Pending</th>
                                <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Pnd {'>'} 3M</th>
                                <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Avg Res (Days)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthlyData.map((data) => (
                                <tr key={data._id} className="border-b border-slate-50 hover:bg-[#f8fafc] transition-colors group">
                                    <td className="px-4 py-3 text-[10px] font-mono font-medium text-slate-500">{data.sno}</td>
                                    <td className="px-4 py-3 text-[11px] font-semibold text-slate-800">{data.received_from}</td>
                                    <td className="px-4 py-3 text-[10px] font-medium text-slate-500">{data.pending_last_month}</td>
                                    <td className="px-4 py-3 text-[10px] font-medium text-blue-500">{data.received}</td>
                                    <td className="px-4 py-3 text-[10px] font-medium text-emerald-500">{data.resolved}</td>
                                    <td className="px-4 py-3 text-[10px] font-medium text-red-500">{data.total_pending}</td>
                                    <td className="px-4 py-3 text-[10px] font-medium text-amber-500">{data.pending_gt_3months}</td>
                                    <td className="px-4 py-3 text-[10px] font-semibold text-slate-700">{data.avg_resolution_time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Monthly Trend Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] mb-2">
                <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h2 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Trend of monthly disposal of complaints</h2>
                    <Link to="/admin/complaint-data/edit/monthly_trend" className="text-[8px] font-bold text-slate-400 hover:text-[#011d52] hover:bg-blue-50 px-2 py-1 rounded transition-colors uppercase tracking-widest">Edit Section</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">S.No</th>
                                <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Month</th>
                                <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Carried Forward</th>
                                <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Received</th>
                                <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Resolved</th>
                                <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Pending</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthlyTrend.map((data) => (
                                <tr key={data._id} className="border-b border-slate-50 hover:bg-[#f8fafc] transition-colors group">
                                    <td className="px-4 py-3 text-[10px] font-mono font-medium text-slate-500">{data.sno}</td>
                                    <td className="px-4 py-3 text-[11px] font-semibold text-slate-800">{data.period}</td>
                                    <td className="px-4 py-3 text-[10px] font-medium text-slate-500">{data.carried_forward}</td>
                                    <td className="px-4 py-3 text-[10px] font-medium text-blue-500">{data.received}</td>
                                    <td className="px-4 py-3 text-[10px] font-medium text-emerald-500">{data.resolved}</td>
                                    <td className="px-4 py-3 text-[10px] font-medium text-red-500">{data.total_pending}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Annual Trend Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h2 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Trend of annual disposal of complaints</h2>
                    <Link to="/admin/complaint-data/edit/annual" className="text-[8px] font-bold text-slate-400 hover:text-[#011d52] hover:bg-blue-50 px-2 py-1 rounded transition-colors uppercase tracking-widest">Edit Section</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Year</th>
                                <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Carried Forward</th>
                                <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Received</th>
                                <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Resolved</th>
                                <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Pending</th>
                            </tr>
                        </thead>
                        <tbody>
                            {annualData.map((data) => (
                                <tr key={data._id} className="border-b border-slate-50 hover:bg-[#f8fafc] transition-colors group">
                                    <td className="px-4 py-3 text-[11px] font-semibold text-slate-800">{data.period}</td>
                                    <td className="px-4 py-3 text-[10px] font-medium text-slate-500">{data.carried_forward}</td>
                                    <td className="px-4 py-3 text-[10px] font-medium text-blue-500">{data.received}</td>
                                    <td className="px-4 py-3 text-[10px] font-medium text-emerald-500">{data.resolved}</td>
                                    <td className="px-4 py-3 text-[10px] font-medium text-red-500">{data.total_pending}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default ComplaintDataDashboard;
