import React, { useState, useEffect } from 'react';
import tipService from '../../../services/tipService';
import toast from 'react-hot-toast';

const TipsAnalysis = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        accuracy: 0,
        growthRate: 0,
        t1Hits: 0,
        t2Hits: 0,
        slHits: 0,
        totalTrades: 0,
        closedTrades: 0
    });

    const [tipsList, setTipsList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({
        tip_type: '',
        category_id: '',
        from_date: '',
        to_date: '',
        page: 1
    });
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        pages: 1
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchAnalysis();
    }, [filters]);

    const fetchCategories = async () => {
        try {
            const res = await tipService.getCategories();
            if (res.success) setCategories(res.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchAnalysis = async () => {
        setLoading(true);
        try {
            const res = await tipService.getAccuracyDashboard(filters);
            if (res.success) {
                const { accuracy, growthRate, t1Hits, t2Hits, slHits, totalTrades, closedTrades, tipsList, pagination } = res.data;
                setStats({ accuracy, growthRate, t1Hits, t2Hits, slHits, totalTrades, closedTrades });
                setTipsList(tipsList);
                setPagination(pagination);
            }
        } catch (error) {
            toast.error('Failed to load performance data');
            console.error('Analysis error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    return (
        <div className="min-h-screen bg-transparent p-4 md:p-4 font-plus-jakarta text-slate-800">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xs font-semibold font-black text-slate-800 tracking-tighter">Performance Analytics</h1>
                    <p className="text-[10px] font-black text-[[#011d52]] uppercase tracking-[0.25em] mt-1.5 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[[#011d52]]/600 rounded-full animate-pulse"></span>
                        Institutional Accuracy Tracking Terminal
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`relative px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 border ${showFilters ? 'bg-slate-50 border-[#011d52] text-[#011d52]' : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'}`}
                        >
                            <i className="fa-solid fa-sliders"></i> Filters
                            {(filters.tip_type || filters.category_id || filters.from_date || filters.to_date) && (
                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#011d52]"></span>
                            )}
                        </button>
                        
                        {showFilters && (
                            <div className="absolute top-[calc(100%+8px)] right-0 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-4 flex flex-col gap-4 text-left">
                                <div>
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block">Market Segment</label>
                                    <select 
                                        name="tip_type" 
                                        value={filters.tip_type} 
                                        onChange={handleFilterChange}
                                        className="w-full rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-[10px] font-bold text-slate-800 focus:outline-none focus:border-[#011d52] transition-all uppercase tracking-widest appearance-none cursor-pointer"
                                    >
                                        <option value="">All Segments</option>
                                        <option value="equity">Equity Cash</option>
                                        <option value="future">Futures</option>
                                        <option value="option">Options</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block">Tip Category</label>
                                    <select 
                                        name="category_id" 
                                        value={filters.category_id} 
                                        onChange={handleFilterChange}
                                        className="w-full rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-[10px] font-bold text-slate-800 focus:outline-none focus:border-[#011d52] transition-all uppercase tracking-widest appearance-none cursor-pointer"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block">From Date</label>
                                    <input 
                                        type="date" 
                                        name="from_date"
                                        value={filters.from_date}
                                        onChange={handleFilterChange}
                                        className="w-full rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-[10px] font-bold text-slate-800 focus:outline-none focus:border-[#011d52] transition-all cursor-pointer" 
                                    />
                                </div>

                                <div>
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block">To Date</label>
                                    <input 
                                        type="date" 
                                        name="to_date"
                                        value={filters.to_date}
                                        onChange={handleFilterChange}
                                        className="w-full rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-[10px] font-bold text-slate-800 focus:outline-none focus:border-[#011d52] transition-all cursor-pointer" 
                                    />
                                </div>

                                <button 
                                    onClick={() => { setFilters({ tip_type: '', category_id: '', from_date: '', to_date: '', page: 1 }); setShowFilters(false); }}
                                    className="w-full rounded-[4px] bg-sky-500 text-white px-4 py-1.5 text-[10px] font-black hover:opacity-90 transition-all uppercase tracking-[0.2em] active:scale-95 text-center mt-1"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <button 
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-2 rounded-[4px] border border-slate-200 bg-white px-2 py-1 text-[9px] font-black text-slate-800 shadow-sm hover:bg-slate-50 uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                    >
                        <i className="fa-solid fa-file-arrow-down text-blue-500"></i>
                        Export
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Accuracy */}
                <div className="rounded-[4px] border border-slate-200 bg-white p-3 shadow-sm relative overflow-hidden group transition-all ">
                    <div className="absolute top-0 right-0 p-3">
                        <span className={`px-2 py-1 rounded-[4px] text-[9px] font-black tracking-widest uppercase ${stats.growthRate >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {stats.growthRate >= 0 ? '+' : ''}{stats.growthRate}%
                        </span>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-sky-50 border border-slate-200 text-sky-600 mb-3 group-hover:bg-sky-500 group-hover:text-white transition-all duration-500  ">
                        <i className="fa-solid fa-chart-line text-xs font-semibold"></i>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Current Accuracy</p>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{stats.accuracy}%</h2>
                </div>

                {/* Targets */}
                <div className="rounded-[4px] border border-slate-200 bg-white p-3 shadow-sm group transition-all ">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-emerald-50 text-emerald-600 mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500  ">
                        <i className="fa-solid fa-bullseye text-xs font-semibold"></i>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Targets Realized</p>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{stats.t1Hits + stats.t2Hits}</h2>
                    <div className="mt-1 flex gap-2 text-[8px] font-bold text-emerald-600/60 uppercase tracking-widest">
                        <span>T1: {stats.t1Hits}</span>
                        <span>T2: {stats.t2Hits}</span>
                    </div>
                </div>

                {/* SL */}
                <div className="rounded-[4px] border border-slate-200 bg-white p-3 shadow-sm group transition-all ">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-rose-50 text-rose-600 mb-3 group-hover:bg-rose-600 group-hover:text-white transition-all duration-500  ">
                        <i className="fa-solid fa-shield-halved text-xs font-semibold"></i>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">SL Liquidated</p>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{stats.slHits}</h2>
                </div>

                {/* Total Trades */}
                <div className="rounded-[4px] border border-slate-200 bg-white p-3 shadow-sm group transition-all ">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-purple-50 text-purple-600 mb-3 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500  ">
                        <i className="fa-solid fa-layer-group text-xs font-semibold"></i>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Total Intelligence Signals</p>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{stats.totalTrades}</h2>
                </div>
            </div>



            {/* Table */}
            <div className="rounded-[4px] border border-slate-200 bg-white shadow-sm overflow-hidden relative">
                {loading && (
                    <div className="absolute inset-0 bg-white backdrop-blur-[2px] z-10 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-8 h-8 border-4 border-slate-50 border-t-sky-500 rounded-full animate-spin"></div>
                            <span className="text-[9px] font-black text-sky-500 uppercase tracking-widest animate-pulse">Syncing Intel...</span>
                        </div>
                    </div>
                )}

                <div className="border-b border-slate-200 px-4 py-3 bg-transparent flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-800">
                            Signal Intelligence Ledger
                        </h3>
                        <p className="text-[8px] font-bold text-slate-500 mt-1 uppercase tracking-widest">Validated historical trade execution logs</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-[4px] text-[8px] font-black text-slate-600 uppercase tracking-widest shadow-sm">
                            Showing {tipsList.length} of {pagination.total} Validated Signals
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-transparent text-[9px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200">
                            <tr>
                                <th className="px-3 py-2">Timestamp</th>
                                <th className="px-3 py-2">Intelligence Symbol</th>
                                <th className="px-3 py-2 text-center">Market Protocol</th>
                                <th className="px-3 py-2 text-center">Entry Price</th>
                                <th className="px-3 py-2 text-center">Exit Realized</th>
                                <th className="px-3 py-2 text-center">Status Badge</th>
                                <th className="px-3 py-2 text-right">P/L Delta</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[slate-200] text-[11px]">
                            {tipsList.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-10 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-30">
                                            <i className="fa-solid fa-folder-open text-4xl"></i>
                                            <p className="text-[11px] font-black uppercase tracking-widest">No intelligence logs found in this window</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                tipsList.map((tip) => {
                                    const entry = parseFloat(tip.entry_price || 0);
                                    const exit = parseFloat(tip.exit_price || tip.cmp_price || 0);
                                    const isBuy = (tip.call_type || 'BUY').toUpperCase() === 'BUY';
                                    const diff = isBuy ? (exit - entry) : (entry - exit);
                                    
                                    return (
                                        <tr key={tip._id} className="hover:bg-slate-50 border border-slate-200/30 transition-all duration-300 group">
                                            <td className="px-3 py-2 text-slate-500 font-black">
                                                {new Date(tip.createdAt).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'})}
                                                <div className="text-[7px] opacity-40 mt-0.5">{new Date(tip.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                            </td>

                                            <td className="px-3 py-2">
                                                <div className="font-black text-slate-800 group-hover:text-sky-600 transition-colors uppercase tracking-tight text-[11px]">{tip.stock_name}</div>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="text-[8px] uppercase font-black text-slate-500 tracking-tighter">{tip.exchange}</span>
                                                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                                    <span className="text-[8px] uppercase font-bold text-sky-500/60">{tip.category?.name || 'Standard'}</span>
                                                </div>
                                            </td>

                                            <td className="px-3 py-2 text-center">
                                                <span className={`rounded-[4px] px-2 py-1 text-[8px] font-black uppercase tracking-widest border ${
                                                    tip.tip_type === 'equity' ? 'bg-slate-50 border border-slate-200 text-sky-600 border-sky-100' : 
                                                    tip.tip_type === 'future' ? 'bg-purple-50 text-purple-600 border-purple-100' : 
                                                    'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                }`}>
                                                    {tip.tip_type}
                                                </span>
                                            </td>

                                            <td className="px-3 py-2 text-center font-black text-slate-800 text-[10px]">₹{entry.toFixed(2)}</td>
                                            <td className="px-3 py-2 text-center font-black text-slate-800 text-[10px]">₹{exit.toFixed(2)}</td>

                                            <td className="px-3 py-2 text-center">
                                                <span className={`px-2 py-1 rounded-[4px] text-[8px] font-black uppercase tracking-widest border whitespace-nowrap
                                                    ${tip.status === 'T1-Achieved' || tip.status === 'T2-Achieved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                      tip.status === 'SL-Hit' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                      tip.status === 'Early-Exit' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                      'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                                    {tip.status === 'T1-Achieved' || tip.status === 'T2-Achieved' ? 'Target Realized' :
                                                     tip.status === 'SL-Hit' ? 'SL Liquidated' : 
                                                     tip.status === 'Active' ? 'In Market' : tip.status}
                                                </span>
                                            </td>

                                            <td className={`px-3 py-2 text-right font-black text-[11px] tracking-tighter ${diff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                <div className="flex flex-col items-end">
                                                    <span>{diff >= 0 ? '+' : ''}₹{diff.toFixed(2)}</span>
                                                    <span className="text-[7px] opacity-60">
                                                        {((diff / entry) * 100).toFixed(2)}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="border-t border-slate-200 bg-transparent px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <i className="fa-solid fa-shield-check text-emerald-500"></i>
                        Confidential Analytical Ledger - Verified Protocol 4.2
                    </p>
                    
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1 || loading}
                            className="px-3 py-1.5 bg-white border border-slate-200 rounded-[4px] text-[8px] font-black text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all uppercase tracking-widest shadow-sm"
                        >
                            Previous
                        </button>
                        
                        <div className="flex gap-1">
                            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    onClick={() => handlePageChange(p)}
                                    className={`w-6 h-6 rounded-[4px] text-[9px] font-black transition-all ${
                                        pagination.page === p 
                                        ? 'bg-sky-100 text-sky-700 border-sky-300 ' 
                                        : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>

                        <button 
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.pages || loading}
                            className="px-3 py-1.5 bg-white border border-slate-200 rounded-[4px] text-[8px] font-black text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all uppercase tracking-widest shadow-sm"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TipsAnalysis;
