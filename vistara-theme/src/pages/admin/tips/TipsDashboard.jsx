import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import tipService from '../../../services/tipService';
import angelService from '../../../services/angelService';
import socket from '../../../services/socketService';
import { Download, Settings as SettingsIcon, Plus, SlidersHorizontal, RotateCcw, Search as SearchIcon, X, PieChart, Calculator, Layers, Zap, Megaphone, Power, Eye, Edit2, Trash2, Loader2, History, Paperclip, Info, FileText } from 'lucide-react';
import CreateEquityTip from './CreateEquityTip';
import CreateFOTip from './CreateFOTip';

import { useAuth } from '../../../context/AuthContext';
import { canAccess, hasPermission } from '../../../utils/rbac';

const TipsDashboard = () => {
    const { user } = useAuth();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerType, setDrawerType] = useState(null); // 'equity' or 'fo'
    const [filterType, setFilterType] = useState('all');
    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');
    const [tradeStatus, setTradeStatus] = useState('Open');
    const [tips, setTips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [date, setDate] = useState('');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const tipsRef = useRef(tips);

    // Modals state
    const [showModal, setShowModal] = useState(false);
    const [showFollowUpModal, setShowFollowUpModal] = useState(false);
    const [showEarlyExitModal, setShowEarlyExitModal] = useState(false);
    const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [activeTip, setActiveTip] = useState(null);

    // Manual Exit state
    const [manualExitPrice, setManualExitPrice] = useState(0);
    const [manualExitNote, setManualExitNote] = useState('');

    // Follow Up state
    const [followUpData, setFollowUpData] = useState({
        target_price: 0,
        target_price_2: 0,
        stop_loss: 0,
        message: ''
    });

    useEffect(() => {
        tipsRef.current = tips;
    }, [tips]);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const { default: serviceService } = await import('../../../services/serviceService');
                const [planRes, catRes] = await Promise.all([
                    serviceService.getServicePlans(),
                    tipService.getCategories()
                ]);
                if (planRes.data) setPlans(planRes.data);
                if (catRes.data) setCategories(catRes.data);
            } catch (error) {
                console.error('Error fetching dropdown data:', error);
            }
        };
        fetchDropdownData();
    }, []);

    useEffect(() => {
        fetchTips();
    }, [filterType, status, search, tradeStatus, month, year, date]);

    // Live WebSocket Subscription
    useEffect(() => {
        const openTips = tips.filter(t => t.trade_status === 'Open' && t.symbol_token);
        if (openTips.length === 0) return;

        const exchangeTokens = openTips.reduce((acc, tip) => {
            const exch = tip.exchange || 'NSE';
            if (!acc[exch]) acc[exch] = [];
            if (!acc[exch].includes(tip.symbol_token)) acc[exch].push(tip.symbol_token);
            return acc;
        }, {});

        // Fetch initial prices once
        updateLivePrices();

        socket.emit('subscribe', exchangeTokens);

        const handlePriceUpdate = (quote) => {
            if (!quote || !quote.token) return;

            setTips(prev => {
                const index = prev.findIndex(t => String(t.symbol_token) === String(quote.token));
                if (index === -1) return prev;

                const newTips = [...prev];
                const oldTip = newTips[index];

                let direction = null;
                if (oldTip.cmp_price) {
                    if (parseFloat(quote.ltp) > parseFloat(oldTip.cmp_price)) direction = 'up';
                    else if (parseFloat(quote.ltp) < parseFloat(oldTip.cmp_price)) direction = 'down';
                }

                const updatedTip = { ...oldTip, cmp_price: quote.ltp, priceDirection: direction };
                newTips[index] = updatedTip;

                // Asynchronously run target checks so we don't block the state update
                setTimeout(() => checkStatus(updatedTip), 0);

                return newTips;
            });
        };

        socket.on('price', handlePriceUpdate);

        return () => {
            socket.off('price', handlePriceUpdate);
            socket.emit('unsubscribe', exchangeTokens);
        };
    }, [tips.length, tradeStatus]);

    const fetchTips = async () => {
        setLoading(true);
        try {
            const params = {
                tip_type: filterType,
                status,
                search,
                trade_status: tradeStatus,
                month,
                year,
                date
            };
            const res = await tipService.getTips(params);
            setTips(res.data);
        } catch (error) {
            console.error('Error fetching tips:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateLivePrices = async () => {
        const openTips = tipsRef.current.filter(t => t.trade_status === 'Open' && t.symbol_token);
        if (openTips.length === 0) return;

        const exchangeTokens = openTips.reduce((acc, tip) => {
            const exch = tip.exchange || 'NSE';
            if (!acc[exch]) acc[exch] = [];
            if (!acc[exch].includes(tip.symbol_token)) {
                acc[exch].push(tip.symbol_token);
            }
            return acc;
        }, {});

        try {
            const res = await angelService.getLivePrices(exchangeTokens);
            if (res.status && res.data) {
                const fetchedData = res.data.fetched || (Array.isArray(res.data) ? res.data : [res.data]);
                if (Array.isArray(fetchedData)) {
                    const updates = {};
                    fetchedData.forEach(item => {
                        if (!item || !item.symbolToken) return;
                        const oldTip = tipsRef.current.find(t => String(t.symbol_token) === String(item.symbolToken));
                        let direction = null;
                        if (oldTip && oldTip.cmp_price) {
                            if (parseFloat(item.ltp) > parseFloat(oldTip.cmp_price)) direction = 'up';
                            else if (parseFloat(item.ltp) < parseFloat(oldTip.cmp_price)) direction = 'down';
                        }
                        updates[item.symbolToken] = { ltp: item.ltp, direction };
                    });

                    if (Object.keys(updates).length > 0) {
                        setTips(prev => prev.map(tip => {
                            const update = updates[tip.symbol_token];
                            if (update) {
                                const updatedTip = { ...tip, cmp_price: update.ltp, priceDirection: update.direction };
                                checkStatus(updatedTip);
                                return updatedTip;
                            }
                            return tip;
                        }));
                    }
                }
            }
        } catch (error) {
            console.warn('[LiveUpdate] Fetch failed:', error.message);
        }
    };

    const checkStatus = (tip) => {
        if (tip.trade_status === 'Closed' || tip.is_updating) return;

        const cmp = parseFloat(tip.cmp_price);
        const t1 = parseFloat(tip.target_price);
        const t2 = tip.target_price_2 ? parseFloat(tip.target_price_2) : null;
        const sl = parseFloat(tip.stop_loss);
        const entry = parseFloat(tip.entry_price);
        const callType = (tip.call_type || 'BUY').toLowerCase();

        let newStatus = tip.status;

        // 1. Check for Entry price touch to become "Active"
        if (newStatus === 'Wait for Entry' || !newStatus || newStatus === 'active') {
            if (callType === 'buy') {
                if (cmp >= entry) newStatus = 'Active';
                else newStatus = 'Wait for Entry';
            } else {
                if (cmp <= entry) newStatus = 'Active';
                else newStatus = 'Wait for Entry';
            }
            // If still not active, return
            if (newStatus === 'Wait for Entry') {
                if (tip.status !== 'Wait for Entry') updateTipStatus(tip, 'Wait for Entry');
                return;
            }
        }

        // 2. Check for Targets/SL
        if (callType === 'buy') {
            if (t2 && cmp >= t2) {
                newStatus = 'T2-Achieved';
            } else if (cmp >= t1) {
                if (newStatus !== 'T2-Achieved') newStatus = 'T1-Achieved';
            } else if (cmp <= sl) {
                newStatus = 'SL-Hit';
            }
        } else {
            if (t2 && cmp <= t2) {
                newStatus = 'T2-Achieved';
            } else if (cmp <= t1) {
                if (newStatus !== 'T2-Achieved') newStatus = 'T1-Achieved';
            } else if (cmp >= sl) {
                newStatus = 'SL-Hit';
            }
        }

        if (newStatus !== tip.status) {
            updateTipStatus(tip, newStatus);
        }
    };

    const updateTipStatus = async (tip, newStatus) => {
        tip.is_updating = true; // Temporary flag to prevent double trigger
        try {
            const res = await tipService.updateLiveStatus(tip._id, {
                status: newStatus,
                cmp_price: tip.cmp_price
            });
            if (res.success) {
                setTips(prev => prev.map(t =>
                    t._id === tip._id ? { ...t, status: res.new_status, trade_status: res.trade_status } : t
                ));
            }
        } catch (error) {
            console.error('Failed to update tip status:', error);
        } finally {
            tip.is_updating = false;
        }
    };

    const openFollowUp = (tip) => {
        setActiveTip(tip);
        setFollowUpData({
            target_price: tip.target_price,
            target_price_2: tip.target_price_2 || 0,
            stop_loss: tip.stop_loss,
            message: ''
        });
        setShowFollowUpModal(true);
    };

    const submitFollowUp = async (e) => {
        e.preventDefault();
        try {
            await tipService.storeFollowUp(activeTip._id, followUpData);
            setShowFollowUpModal(false);
            fetchTips(); // Refresh
            alert('Follow-up added successfully');
        } catch (error) {
            alert('Error adding follow-up');
        }
    };

    const openUpdateStatus = (tip) => {
        setActiveTip({ ...tip, new_status: tip.status });
        setShowUpdateStatusModal(true);
    };

    const submitUpdateStatus = async (e) => {
        if (e) e.preventDefault();
        setIsSubmittingStatus(true);
        try {
            const res = await tipService.updateLiveStatus(activeTip._id, {
                status: activeTip.new_status,
                cmp_price: activeTip.cmp_price
            });
            if (res.success) {
                setTips(tips.map(t => t._id === activeTip._id ? {
                    ...t,
                    status: res.new_status,
                    trade_status: res.trade_status || t.trade_status,
                    cmp_price: activeTip.cmp_price,
                } : t));
                setShowUpdateStatusModal(false);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        } finally {
            setIsSubmittingStatus(false);
        }
    };

    const submitCategory = async (e) => {
        e.preventDefault();
        try {
            await tipService.createCategory({ name: categoryName });
            setShowCategoryModal(false);
            setCategoryName('');
            alert('Category created successfully');
        } catch (error) {
            console.error('Error creating category:', error);
            alert('Failed to create category');
        }
    };

    const openEarlyExit = (tip) => {
        setActiveTip(tip);
        setManualExitPrice(tip.cmp_price || tip.entry_price);
        setManualExitNote('');
        setShowEarlyExitModal(true);
    };

    const submitManualExit = async () => {
        if (!manualExitPrice || manualExitPrice <= 0) return alert('Invalid exit price');
        if (!window.confirm('Are you sure you want to close this trade?')) return;

        try {
            await tipService.manualClose(activeTip._id, {
                exit_price: manualExitPrice,
                admin_note: manualExitNote
            });
            setShowEarlyExitModal(false);
            fetchTips();
            alert('Trade closed successfully');
        } catch (error) {
            alert('Error closing trade');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this tip?')) {
            try {
                await tipService.deleteTip(id);
                fetchTips();
            } catch (error) {
                console.error('Delete error:', error);
            }
        }
    };

    const getShortStatus = (status) => {
        if (!status) return 'WAIT';
        const s = status.toLowerCase();
        const map = {
            'active': 'ACT',
            't1-achieved': 'TG1',
            't2-achieved': 'TG2',
            'sl-hit': 'SL',
            'wait for entry': 'WAIT',
            'early-exit': 'EXIT'
        };
        return map[s] || status.toUpperCase();
    };

    const formatStockName = (tip) => {
        const baseName = tip.stock_name.toUpperCase();
        if (!tip || tip.tip_type.toLowerCase() === 'equity' || !tip.expiry_date) return baseName;

        try {
            const dateObj = new Date(tip.expiry_date);
            const day = String(dateObj.getDate()).padStart(2, '0');
            const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
            const monthStr = months[dateObj.getMonth()];
            const yearStr = String(dateObj.getFullYear()).slice(-2);
            const expiry = `${day}${monthStr}${yearStr}`;

            if (baseName.includes(expiry)) return baseName;

            const type = tip.tip_type.toLowerCase();
            if (type === 'future') {
                return `${baseName}${expiry}FUT`.toUpperCase();
            } else if (type === 'option') {
                const strike = Math.floor(parseFloat(tip.strike_price || 0));
                const optType = (tip.option_type || '').toUpperCase();
                return `${baseName}${expiry}${strike}${optType}`.toUpperCase();
            }
        } catch (e) {
            return baseName;
        }
        return baseName;
    };

    const resetFilters = () => {
        setSearch('');
        setStatus('');
        setMonth('');
        setYear('');
        setDate('');
        setTradeStatus('Open');
        setFilterType('all');
        setSelectedPlan('');
        setSelectedCategory('');
    };

    const filteredTips = tips.filter(tip => {
        const matchesSearch = tip.stock_name.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === 'all' || tip.tip_type.toLowerCase() === filterType.toLowerCase();
        const matchesStatus = !status || tip.status === status;
        const matchesTradeStatus = !tradeStatus || tip.trade_status === tradeStatus;

        let matchesPlan = true;
        if (selectedPlan === 'public') {
            matchesPlan = !tip.allowed_plans || tip.allowed_plans.length === 0;
        } else if (selectedPlan) {
            matchesPlan = tip.allowed_plans && tip.allowed_plans.some(p => String(p) === String(selectedPlan));
        }

        let matchesCategory = true;
        if (selectedCategory) {
            matchesCategory = tip.category && String(tip.category._id || tip.category) === String(selectedCategory);
        }

        return matchesSearch && matchesType && matchesStatus && matchesTradeStatus && matchesPlan && matchesCategory;
    });

    return (
        <div className="min-h-screen font-inter text-[11px] text-slate-800">
            {/* ROW 1: Tabs & Filters Bar */}
            <div className="bg-white border-b border-slate-200 shadow-sm flex items-center mb-1 rounded-[4px] relative z-20">

                {/* Left: Scrollable Tabs */}
                <div className="flex-1 flex items-center gap-2 px-3 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                    {/* Trade Status Tabs */}
                    <div className="flex items-center gap-1 shrink-0 py-2">
                        {['', 'Open', 'Closed'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setTradeStatus(s)}
                                className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all border-b-2 -mb-[9px] ${tradeStatus === s ? 'text-[#011d52] border-[#011d52]' : 'text-slate-500 border-transparent hover:text-slate-800 hover:border-slate-200'}`}
                            >
                                {s || 'All'} {s === 'Open' ? `(${tips.filter(t => t.trade_status === 'Open').length})` : ''}
                            </button>
                        ))}
                    </div>

                    <div className="h-6 w-px bg-slate-200 shrink-0 mx-1"></div>

                    {/* Market Segment Tabs */}
                    <div className="flex items-center gap-1 shrink-0 py-2">
                        {['all', 'equity', 'future', 'option'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all border-b-2 -mb-[9px] ${filterType === type ? 'text-[#011d52] border-[#011d52]' : 'text-slate-500 border-transparent hover:text-slate-800 hover:border-slate-200'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                </div>

                {/* Right: Fixed Action Buttons (Filters, Export, Settings) */}
                <div className="pl-3 pr-3 py-2 shrink-0 border-l border-slate-200 bg-slate-50 flex items-center gap-2 self-stretch shadow-[-4px_0_10px_-4px_rgba(0,0,0,0.1)] z-10">

                    {/* Reset Button */}
                    {(status !== '' || date !== '' || month !== '' || year !== '' || search !== '' || filterType !== 'all' || tradeStatus !== 'Open' || selectedPlan !== '' || selectedCategory !== '') && (
                        <button
                            onClick={resetFilters}
                            className="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] text-red-500 hover:bg-red-50 hover:text-red-600 transition-all border border-slate-200 hover:border-red-200"
                            title="Reset All Filters"
                        >
                            <RotateCcw className="w-3 h-3" />
                        </button>
                    )}

                    {/* Advanced Filters Toggle */}
                    <div className="relative">
                        <button
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className={`px-3 h-[28px] rounded-[4px] text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 border shadow-sm ${showAdvancedFilters ? 'bg-[#011d52]/10 border-[#011d52]/30 text-[#011d52]' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-200/10'}`}
                            title="Toggle Advanced Filters"
                        >
                            <SlidersHorizontal className="w-3 h-3" /> Filters
                            {(status !== '' || date !== '' || month !== '' || year !== '') && (
                                <span className="ml-0.5 bg-[#011d52] text-[#020210] px-1.5 py-0.5 rounded-full text-[8px] font-black leading-none">
                                    {(status !== '' ? 1 : 0) + (date !== '' ? 1 : 0) + (month !== '' ? 1 : 0) + (year !== '' ? 1 : 0)}
                                </span>
                            )}
                        </button>



                        {/* Popover Modal for Filters */}
                        {showAdvancedFilters && (
                            <div className="absolute top-[calc(100%+8px)] right-0 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-[99] p-3 flex flex-col gap-3 text-left">
                                <div>
                                    <label className="text-[9px] font-black text-slate-500 uppercase mb-1 block tracking-widest">Result Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[9px] font-bold outline-none focus:border-[#011d52] transition-all"
                                        style={{ height: '30px', borderRadius: '4px' }}
                                    >
                                        <option value="">All Results</option>
                                        <option value="Active">Active</option>
                                        <option value="T1-Achieved">T1 Achieved</option>
                                        <option value="T2-Achieved">T2 Achieved</option>
                                        <option value="SL-Hit">SL Hit</option>
                                        <option value="Wait for Entry">Wait for Entry</option>
                                        <option value="Early-Exit">Early Exit</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-500 uppercase mb-1 block tracking-widest">Date</label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[9px] font-bold outline-none focus:border-[#011d52] transition-all"
                                        style={{ height: '30px', borderRadius: '4px' }}
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-500 uppercase mb-1 block tracking-widest">Month</label>
                                    <select
                                        value={month}
                                        onChange={(e) => setMonth(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[9px] font-bold outline-none focus:border-[#011d52] transition-all"
                                        style={{ height: '30px', borderRadius: '4px' }}
                                    >
                                        <option value="">All Months</option>
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('en-US', { month: 'short' })}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-500 uppercase mb-1 block tracking-widest">Year</label>
                                    <select
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[9px] font-bold outline-none focus:border-[#011d52] transition-all"
                                        style={{ height: '30px', borderRadius: '4px' }}
                                    >
                                        <option value="">All Years</option>
                                        {Array.from({ length: 5 }, (_, i) => {
                                            const y = new Date().getFullYear() - i;
                                            return <option key={y} value={y}>{y}</option>;
                                        })}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        className="w-[28px] h-[28px] flex items-center justify-center bg-white border border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 rounded-[4px] text-[10px] transition-all shadow-sm"
                        title="Export Data to CSV"
                    >
                        <Download className="w-3.5 h-3.5" />
                    </button>

                    <div className="relative group z-[99]">
                        <div
                            className="w-[28px] h-[28px] rounded-[4px] bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm hover:bg-slate-50 hover:text-[#011d52] transition cursor-pointer"
                            title="Settings & Tools"
                        >
                            <SettingsIcon className="w-3.5 h-3.5" />
                        </div>
                        {/* Hover Bridge */}
                        <div className="absolute right-0 top-full w-full h-2"></div>
                        {/* Dropdown Menu */}
                        <div className="absolute right-0 top-[calc(100%+8px)] w-40 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 overflow-visible">
                            <div className="p-1.5 flex flex-col gap-0.5">
                                <Link to="/admin/tips/analysis" className="px-3 py-2.5 rounded-[4px] flex items-center gap-2.5 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-rose-500 hover:bg-slate-50 transition">
                                    <PieChart className="w-3.5 h-3.5" /> Performance
                                </Link>
                                <Link to="/admin/tips/risk-reward" className="px-3 py-2.5 rounded-[4px] flex items-center gap-2.5 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-amber-500 hover:bg-slate-50 transition">
                                    <Calculator className="w-3.5 h-3.5" /> Price Master
                                </Link>
                                <Link to="/admin/tips/categories" className="px-3 py-2.5 rounded-[4px] flex items-center gap-2.5 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-500 hover:bg-slate-50 transition">
                                    <Layers className="w-3.5 h-3.5" /> Categories
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ROW 2: Selectors & Add Buttons */}
            <div className="bg-white border-b border-slate-200 shadow-sm flex items-center mb-4 rounded-[4px] relative z-10">
                {/* Left: Additional Selectors */}
                <div className="flex-1 flex items-center gap-2 px-3 py-2 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {/* Visibility / Service Dropdown */}
                    <select
                        value={selectedPlan}
                        onChange={(e) => setSelectedPlan(e.target.value)}
                        className="px-3 h-[28px] rounded-[4px] text-[9px] font-black uppercase tracking-widest transition-all bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 outline-none focus:border-[#011d52] cursor-pointer shadow-sm shrink-0"
                        style={{ height: '28px', borderRadius: '4px' }}
                        title="Filter by Service Plan"
                    >
                        <option value="">Service: All</option>
                        <option value="public">Public (Free)</option>
                        {plans.map(p => (
                            <option key={p._id} value={p._id}>{p.name}</option>
                        ))}
                    </select>

                    {/* Category Dropdown */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 h-[28px] rounded-[4px] text-[9px] font-black uppercase tracking-widest transition-all bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 outline-none focus:border-[#011d52] cursor-pointer shadow-sm shrink-0"
                        style={{ height: '28px', borderRadius: '4px' }}
                        title="Filter by Tip Category"
                    >
                        <option value="">Category: All</option>
                        {categories.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {/* Right: Add Action Buttons */}
                <div className="pl-3 pr-3 py-2 shrink-0 border-l border-slate-200 bg-slate-50 flex items-center gap-2 self-stretch shadow-[-4px_0_10px_-4px_rgba(0,0,0,0.1)] z-10">
                    {(canAccess(user, 'admin') || hasPermission(user, 'create_tips')) && (
                        <>
                            <button
                                onClick={() => { setDrawerType('equity'); setDrawerOpen(true); }}
                                className="px-4 h-[28px] rounded-[4px] text-[9px] font-black transition shadow-sm tracking-widest hover:opacity-90 flex items-center justify-center bg-[#011d52] text-white uppercase"
                                title="Create New Equity Tip"
                            >
                                <Plus className="w-3 h-3 mr-1.5" /> EQUITY
                            </button>
                            <button
                                onClick={() => { setDrawerType('fo'); setDrawerOpen(true); }}
                                className="px-4 h-[28px] rounded-[4px] text-[9px] font-black transition shadow-sm tracking-widest border hover:bg-white flex items-center justify-center border-[#011d52] text-[#011d52] uppercase"
                                title="Create New F&O Tip"
                            >
                                <Plus className="w-3 h-3 mr-1.5" /> F&O
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[4px] shadow-sm overflow-hidden">
                {/* Table Search Header */}
                <div className="border-b border-slate-200 px-4 py-3 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Signal Ledger</h2>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Manage and track trading calls</p>
                    </div>
                    <div className="relative w-full md:w-64">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-3 h-3 z-10" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search stock..."
                            style={{ height: '32px', borderRadius: '4px', paddingLeft: '32px' }}
                            className="w-full bg-white border border-slate-200 pr-6 py-1 text-[9px] font-bold outline-none focus:border-[#011d52] transition-all shadow-sm relative z-0"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-red-500 z-10" title="Clear Search">
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-[10px] border-collapse">
                        <thead className="bg-slate-50 text-slate-500 sticky top-0 z-10 shadow-sm border-b border-slate-200">
                            <tr>
                                <th className="px-2 py-2 text-left font-black uppercase tracking-wider whitespace-nowrap">Date</th>
                                <th className="px-2 py-2 text-left font-black uppercase tracking-wider whitespace-nowrap">Stock / Exc.</th>
                                <th className="px-2 py-2 text-center font-black uppercase tracking-wider whitespace-nowrap">Call</th>
                                <th className="px-2 py-2 text-center font-black uppercase tracking-wider whitespace-nowrap">Type</th>
                                <th className="px-2 py-2 text-center font-black uppercase tracking-wider whitespace-nowrap">Category</th>
                                <th className="px-2 py-2 text-center font-black uppercase tracking-wider whitespace-nowrap">Entry</th>
                                <th className="px-2 py-2 text-center font-black uppercase tracking-wider whitespace-nowrap">T-1</th>
                                <th className="px-2 py-2 text-center font-black uppercase tracking-wider whitespace-nowrap">T-2</th>
                                <th className="px-2 py-2 text-center font-black uppercase tracking-wider whitespace-nowrap">SL</th>
                                <th className="px-2 py-2 text-center font-black uppercase tracking-wider whitespace-nowrap">CMP</th>
                                <th className="px-2 py-2 text-center font-black uppercase tracking-wider whitespace-nowrap">Exit</th>
                                <th className="px-2 py-2 text-center font-black uppercase tracking-wider whitespace-nowrap">Status</th>
                                <th className="px-2 py-2 text-right font-black uppercase tracking-wider whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[slate-200]">
                            {loading ? (
                                <tr>
                                    <td colSpan="12" className="p-10 text-center font-black text-slate-500 uppercase tracking-[0.2em]">Synchronizing Market Intelligence...</td>
                                </tr>
                            ) : filteredTips.length === 0 ? (
                                <tr>
                                    <td colSpan="12" className="p-10 text-center font-black text-slate-500 uppercase tracking-[0.2em]">No intelligence reports found for this segment</td>
                                </tr>
                            ) : filteredTips.map((tip) => (
                                <tr key={tip._id} className="hover:bg-[#011d52]/5 transition-colors">
                                    <td className="px-2 py-1.5 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="font-black text-slate-800 uppercase tracking-tight">
                                                {new Date(tip.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                                            </span>
                                            <span className="text-[9px] font-bold text-slate-500">
                                                {new Date(tip.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-2 py-1.5">
                                        <div className="font-black text-slate-800 leading-tight whitespace-nowrap">{formatStockName(tip)}</div>
                                        <div className="text-[9px] text-slate-500 font-bold uppercase">{tip.exchange}</div>
                                    </td>
                                    <td className="px-2 py-1.5 text-center">
                                        <span className={`px-1.5 py-0.5 rounded text-slate-800 text-[9px] font-black uppercase ${tip.call_type === 'BUY' ? 'bg-emerald-600/20 text-emerald-700' : 'bg-rose-600/20 text-rose-700'}`}>
                                            {tip.call_type}
                                        </span>
                                    </td>
                                    <td className="px-2 py-1.5 text-center">
                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase whitespace-nowrap" style={{
                                            background: tip.tip_type === 'equity' ? 'rgba(245, 158, 11, 0.1)' :
                                                tip.tip_type === 'future' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                            color: tip.tip_type === 'equity' ? '#f59e0b' :
                                                tip.tip_type === 'future' ? '#818cf8' : '#10b981'
                                        }}>
                                            {tip.tip_type}
                                        </span>
                                    </td>
                                    <td className="px-2 py-1.5 text-center text-slate-500 font-bold whitespace-nowrap">{tip.category?.name || '-'}</td>
                                    <td className="px-2 py-1.5 text-center font-black text-slate-800 whitespace-nowrap">₹{parseFloat(tip.entry_price || 0).toFixed(2)}</td>
                                    <td className="px-2 py-1.5 text-center font-black text-emerald-600 whitespace-nowrap">₹{parseFloat(tip.target_price || 0).toFixed(2)}</td>
                                    <td className="px-2 py-1.5 text-center font-black text-emerald-700 whitespace-nowrap">₹{parseFloat(tip.target_price_2 || 0).toFixed(2)}</td>
                                    <td className="px-2 py-1.5 text-center font-black text-rose-500 whitespace-nowrap">₹{parseFloat(tip.stop_loss || 0).toFixed(2)}</td>
                                    <td className="px-2 py-1.5 text-center font-black whitespace-nowrap">
                                        <span
                                            className={
                                                tip.priceDirection === 'up' ? 'text-emerald-600' :
                                                    tip.priceDirection === 'down' ? 'text-rose-600' :
                                                        'text-slate-800'
                                            }>
                                            ₹{parseFloat(tip.cmp_price || 0).toFixed(2)}
                                            {tip.priceDirection === 'up' && <span className="ml-0.5 text-[8px]">▲</span>}
                                            {tip.priceDirection === 'down' && <span className="ml-0.5 text-[8px]">▼</span>}
                                        </span>
                                    </td>
                                    <td className="px-2 py-1.5 text-center font-black text-slate-800 whitespace-nowrap">
                                        {tip.trade_status === 'Closed' ? `₹${parseFloat(tip.exit_price || 0).toFixed(2)}` : '-'}
                                    </td>
                                    <td className="px-2 py-1.5 text-center">
                                        <span className="px-1.5 py-0.5 rounded-[4px] text-[9px] font-black border whitespace-nowrap inline-flex items-center" style={{
                                            background: (tip.status === 'Active' || tip.status === 'active') ? 'rgba(59, 130, 246, 0.1)' :
                                                tip.status === 'T1-Achieved' ? 'rgba(16, 185, 129, 0.1)' :
                                                    tip.status === 'T2-Achieved' ? 'rgba(5, 150, 105, 0.15)' :
                                                        tip.status === 'SL-Hit' ? 'rgba(244, 63, 94, 0.1)' :
                                                            tip.status === 'Early-Exit' ? 'rgba(245, 158, 11, 0.1)' :
                                                                tip.status === 'Wait for Entry' ? 'transparent' :
                                                                    tip.trade_status === 'Closed' ? 'transparent' :
                                                                        'transparent',
                                            color: (tip.status === 'Active' || tip.status === 'active') ? '#3b82f6' :
                                                tip.status === 'T1-Achieved' ? '#10b981' :
                                                    tip.status === 'T2-Achieved' ? '#059669' :
                                                        tip.status === 'SL-Hit' ? '#f43f5e' :
                                                            tip.status === 'Early-Exit' ? '#f59e0b' :
                                                                tip.status === 'Wait for Entry' ? '#64748b' :
                                                                    tip.trade_status === 'Closed' ? '#1e293b' :
                                                                        '#64748b',
                                            borderColor: (tip.status === 'Active' || tip.status === 'active') ? 'rgba(59, 130, 246, 0.2)' :
                                                tip.status === 'T1-Achieved' ? 'rgba(16, 185, 129, 0.2)' :
                                                    tip.status === 'T2-Achieved' ? 'rgba(5, 150, 105, 0.3)' :
                                                        tip.status === 'SL-Hit' ? 'rgba(244, 63, 94, 0.2)' :
                                                            tip.status === 'Early-Exit' ? 'rgba(245, 158, 11, 0.2)' :
                                                                '#e2e8f0'
                                        }}>
                                            {tip.is_updating && <Loader2 className="w-2.5 h-2.5 animate-spin mr-1" />}
                                            {tip.trade_status === 'Closed' ? `CLSD (${getShortStatus(tip.status)})` : getShortStatus(tip.status)}
                                        </span>
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            {tip.trade_status !== 'Closed' && (canAccess(user, 'admin') || hasPermission(user, 'update_tips')) && (
                                                <>
                                                    <button onClick={() => openUpdateStatus(tip)}
                                                        className="group relative text-purple-500 hover:text-purple-700 hover:bg-purple-50 rounded-[4px] transition-all p-1">
                                                        <Zap className="w-3.5 h-3.5" />
                                                        <span className="absolute -top-7 right-0 px-2 py-1 bg-[#020210] text-white text-[9px] rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[60] shadow-md font-black tracking-widest">Update Status</span>
                                                    </button>
                                                    <button onClick={() => openFollowUp(tip)}
                                                        className="group relative text-orange-500 hover:text-orange-700 hover:bg-orange-50 rounded-[4px] transition-all p-1">
                                                        <Megaphone className="w-3.5 h-3.5" />
                                                        <span className="absolute -top-7 right-0 px-2 py-1 bg-[#020210] text-white text-[9px] rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[60] shadow-md font-black tracking-widest">Add Follow Up</span>
                                                    </button>
                                                    <button onClick={() => openEarlyExit(tip)}
                                                        className="group relative text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-[4px] transition-all p-1">
                                                        <Power className="w-3.5 h-3.5" />
                                                        <span className="absolute -top-7 right-0 px-2 py-1 bg-[#020210] text-white text-[9px] rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[60] shadow-md font-black tracking-widest">Early Exit</span>
                                                    </button>
                                                </>
                                            )}
                                            <Link to={`/admin/tips/show/${tip._id}`}
                                                className="group relative text-[#011d52] hover:bg-slate-100 rounded-[4px] transition-all p-1">
                                                <Eye className="w-3.5 h-3.5" />
                                                <span className="absolute -top-7 right-0 px-2 py-1 bg-[#020210] text-white text-[9px] rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[60] shadow-md font-black tracking-widest">View Details</span>
                                            </Link>
                                            {(canAccess(user, 'admin') || hasPermission(user, 'update_tips')) && (
                                                <Link to={`/admin/tips/${tip._id}/edit`}
                                                    className="group relative text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-[4px] transition-all p-1">
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                    <span className="absolute -top-7 right-0 px-2 py-1 bg-[#020210] text-white text-[9px] rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[60] shadow-md font-black tracking-widest">Edit Tip</span>
                                                </Link>
                                            )}
                                            {(canAccess(user, 'admin') || hasPermission(user, 'delete_tips')) && (
                                                <button onClick={() => handleDelete(tip._id)}
                                                    className="group relative text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-[4px] transition-all p-1">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    <span className="absolute -top-7 right-0 px-2 py-1 bg-[#020210] text-white text-[9px] rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[60] shadow-md font-black tracking-widest">Delete Tip</span>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-slate-50/30">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Showing {filteredTips.length} Active Intelligence Reports</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-500 hover:bg-slate-50 disabled:opacity-50" disabled>PREVIOUS</button>
                        <button className="px-3 py-1 bg-[[#011d52]] text-[#020210] border border-[[#011d52]] rounded-lg text-[10px] font-black">1</button>
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-500 hover:bg-slate-50 disabled:opacity-50" disabled>NEXT</button>
                    </div>
                </div>
            </div>
            {/* Tip Details Modal */}
            {showModal && activeTip && (
                <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative border border-slate-200 my-8">
                        <button onClick={() => setShowModal(false)}
                            className="absolute top-6 right-6 text-slate-500 hover:text-slate-800 transition-colors p-2 bg-slate-50 hover:bg-slate-100 rounded-lg z-10">
                            <X className="w-4 h-4" />
                        </button>
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-slate-800 font-black text-xs font-semibold shadow-xl shadow-blue-200">
                                        {activeTip.stock_name.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-xs font-semibold font-black text-slate-800 tracking-tight leading-none mb-1">
                                            {activeTip.stock_name}
                                        </h2>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-[[#011d52]] uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded">
                                                {activeTip.tip_type}
                                            </span>
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                {activeTip.exchange}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest ${activeTip.call_type === 'Buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {activeTip.call_type}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Entry Price</p>
                                    <p className="text-xs font-semibold font-black text-slate-800">₹{activeTip.entry_price}</p>
                                </div>
                                <div className="relative overflow-hidden p-4 rounded-xl border transition-all" style={{ background: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
                                    <p className="text-[9px] font-black text-[[#011d52]] uppercase tracking-widest mb-1">Current Price</p>
                                    <div className="flex items-end gap-2">
                                        <span className="text-xs font-semibold font-black text-[[#011d52]]">₹{activeTip.cmp_price}</span>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl border transition-all" style={{ background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                                    <p className="text-[9px] font-black text-red-400 uppercase mb-1">Stop Loss</p>
                                    <p className="text-xs font-semibold font-black text-red-500">₹{activeTip.stop_loss}</p>
                                </div>
                                <div className="p-4 rounded-xl border transition-all" style={{ background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                                    <p className="text-[9px] font-black text-green-500 uppercase mb-1">Target 1</p>
                                    <p className="text-xs font-semibold font-black text-green-500">₹{activeTip.target_price}</p>
                                </div>
                                <div className="p-4 rounded-xl border transition-all" style={{ background: 'rgba(16, 185, 129, 0.02)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                                    <p className="text-[9px] font-black text-green-500 uppercase mb-1">Target 2</p>
                                    <p className="text-xs font-semibold font-black text-green-500">₹{activeTip.target_price_2 || '-'}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Category</p>
                                    <p className="text-xs font-black text-slate-800">{activeTip.category?.name || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Follow Up History */}
                            {activeTip.followups && activeTip.followups.length > 0 && (
                                <div className="mb-8">
                                    <div className="flex items-center gap-2 mb-3">
                                        <History className="w-3.5 h-3.5 text-orange-500" />
                                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Follow Up History</p>
                                    </div>
                                    <div className="space-y-3">
                                        {activeTip.followups.map((followup, idx) => (
                                            <div key={idx} className="border p-3 rounded-xl text-xs" style={{ background: 'rgba(249, 115, 22, 0.05)', borderColor: 'rgba(249, 115, 22, 0.2)' }}>
                                                <div className="flex justify-between items-start mb-1 text-[10px] text-slate-500">
                                                    <span>{new Date(followup.date).toLocaleString()}</span>
                                                </div>
                                                <p className="font-bold text-slate-800 mb-2">{followup.message}</p>
                                                <div className="grid grid-cols-3 gap-2 text-[9px] text-slate-500 border-t pt-2" style={{ borderColor: 'rgba(249, 115, 22, 0.2)' }}>
                                                    <div>T1: <span className="line-through">{followup.old_values.target_price}</span> ➝ <span className="font-bold text-green-500">{followup.new_values.target_price}</span></div>
                                                    <div>T2: <span className="line-through">{followup.old_values.target_price_2}</span> ➝ <span className="font-bold text-green-500">{followup.new_values.target_price_2}</span></div>
                                                    <div>SL: <span className="line-through">{followup.old_values.stop_loss}</span> ➝ <span className="font-bold text-red-500">{followup.new_values.stop_loss}</span></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Media Attachments Section */}
                            {activeTip.media_files && activeTip.media_files.length > 0 && (
                                <div className="mb-8">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Paperclip className="w-3.5 h-3.5 text-indigo-500" />
                                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Intelligence Attachments</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {activeTip.media_files.map((file, idx) => (
                                            <div key={idx} className="border rounded-xl p-2 bg-slate-50 group relative overflow-hidden" style={{ borderColor: 'slate-200' }}>
                                                {file.mime_type.startsWith('image') ? (
                                                    <img src={file.url} alt={file.file_name} className="w-full h-32 object-cover rounded-lg mb-2" />
                                                ) : (
                                                    <div className="w-full h-32 flex flex-col items-center justify-center rounded-lg mb-2" style={{ background: 'rgba(244, 63, 94, 0.05)' }}>
                                                        <FileText className="w-6 h-6 text-rose-500 mb-1" />
                                                        <span className="text-[9px] font-bold text-rose-500 uppercase">PDF Document</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-center px-1">
                                                    <span className="text-[8px] font-bold text-slate-500 truncate max-w-[100px]">{file.file_name}</span>
                                                    <a href={file.url} target="_blank" rel="noreferrer" className="text-[[#011d52]] font-black hover:underline text-[9px]">VIEW</a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="p-4 rounded-xl border mb-8" style={{ background: 'rgba(245, 158, 11, 0.05)', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <Info className="w-3.5 h-3.5 text-amber-500" />
                                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Admin Note</p>
                                </div>
                                <p className="text-xs font-medium leading-relaxed italic" style={{ color: 'slate-800' }}>
                                    {activeTip.admin_note || 'No additional notes provided for this trade.'}
                                </p>
                            </div>
                            <button onClick={() => setShowModal(false)}
                                className="w-full py-4 text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl font-black text-xs uppercase tracking-widest transition-all">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Follow Up Modal */}
            {showFollowUpModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
                    <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-slate-200 animate-fade-in">
                        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Add Follow Up</h3>
                            <button onClick={() => setShowFollowUpModal(false)} className="text-slate-500 hover:text-slate-800 transition-colors p-1">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={submitFollowUp} className="p-4 space-y-5">
                            <div className="p-4 rounded-xl border mb-4" style={{ background: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
                                <h4 className="text-[10px] font-black text-[[#011d52]] uppercase tracking-widest mb-1">{activeTip.stock_name}</h4>
                                <div className="text-xs text-[[#011d52]] font-medium">Update targets and SL for this active trade.</div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Target 1</label>
                                    <input type="number" step="0.01" value={followUpData.target_price}
                                        onChange={e => setFollowUpData({ ...followUpData, target_price: e.target.value })} required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-4 focus:ring-[[#011d52]] transition-all text-green-500" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Target 2</label>
                                    <input type="number" step="0.01" value={followUpData.target_price_2}
                                        onChange={e => setFollowUpData({ ...followUpData, target_price_2: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-4 focus:ring-[[#011d52]] transition-all text-emerald-500" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Stop Loss</label>
                                    <input type="number" step="0.01" value={followUpData.stop_loss}
                                        onChange={e => setFollowUpData({ ...followUpData, stop_loss: e.target.value })} required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-4 focus:ring-[[#011d52]] transition-all text-red-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Follow Up Message</label>
                                <textarea rows="3" required placeholder="e.g. Trailing SL modified due to market movement..."
                                    value={followUpData.message} onChange={e => setFollowUpData({ ...followUpData, message: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium outline-none transition-all text-slate-800" style={{ background: 'slate-50' }}></textarea>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowFollowUpModal(false)}
                                    className="flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all bg-slate-100 hover:bg-slate-200 text-slate-800">
                                    Cancel
                                </button>
                                <button type="submit"
                                    className="flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all bg-[#011d52] hover:bg-[#011d52]/90 text-white">
                                    Update & Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Early Exit Modal */}
            {showEarlyExitModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
                    <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-slate-200 animate-fade-in">
                        <div className="p-4 border-b border-slate-200 flex justify-between items-center" style={{ background: 'rgba(239, 68, 68, 0.05)' }}>
                            <h3 className="text-xs font-black text-red-500 uppercase tracking-[0.2em]">Manual Early Exit</h3>
                            <button onClick={() => setShowEarlyExitModal(false)} className="text-slate-500 hover:text-slate-800 transition-colors p-1">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-4 space-y-5">
                            <div className="p-4 rounded-xl border mb-4" style={{ background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                                <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">{activeTip.stock_name}</h4>
                                <div className="text-xs text-red-500 font-medium">This will close the trade immediately at your specified price.</div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Final Exit Price</label>
                                <input type="number" step="0.01" value={manualExitPrice} onChange={e => setManualExitPrice(e.target.value)} required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-4 focus:ring-red-500/10 transition-all text-red-700" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Internal Note (Optional)</label>
                                <textarea rows="2" placeholder="Reason for early exit..." value={manualExitNote} onChange={e => setManualExitNote(e.target.value)}
                                    className="w-full bg-transparent border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium outline-none transition-all text-slate-800" style={{ background: 'slate-50' }}></textarea>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowEarlyExitModal(false)}
                                    className="flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all bg-slate-100 hover:bg-slate-200 text-slate-800">
                                    Keep Open
                                </button>
                                <button onClick={submitManualExit}
                                    className="flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all bg-[#011d52] hover:bg-[#011d52]/90 text-white">
                                    Confirm Exit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Manual Status Update Modal */}
            {showUpdateStatusModal && activeTip && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
                    <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl overflow-hidden border border-slate-200 animate-fade-in">
                        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Manual Status Update</h3>
                            <button onClick={() => setShowUpdateStatusModal(false)} className="text-slate-500 hover:text-slate-800 transition-colors p-1">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-4 space-y-4">
                            <div className="p-3 rounded-xl border mb-3" style={{ background: 'rgba(168, 85, 247, 0.05)', borderColor: 'rgba(168, 85, 247, 0.2)' }}>
                                <h4 className="text-[11px] font-black text-purple-500 uppercase tracking-widest mb-1">{formatStockName(activeTip)}</h4>
                                <div className="text-[10px] text-purple-500 font-bold">Update the live status of this trade manually.</div>
                            </div>

                            <div>
                                <label className="block text-[9px] font-black text-slate-500 uppercase mb-1.5 tracking-widest">New Status</label>
                                <select
                                    value={activeTip.new_status}
                                    onChange={e => setActiveTip({ ...activeTip, new_status: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold outline-none focus:ring-4 focus:ring-purple-500/10 transition-all text-slate-800"
                                >
                                    <option value="Wait for Entry">Wait for Entry</option>
                                    <option value="Active">Active</option>
                                    <option value="T1-Achieved">T1-Achieved</option>
                                    <option value="T2-Achieved">T2-Achieved</option>
                                    <option value="SL-Hit">SL-Hit</option>
                                    <option value="Early-Exit">Early Exit</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[9px] font-black text-slate-500 uppercase mb-1.5 tracking-widest">Trigger Price (CMP)</label>
                                <input type="number" step="any" value={activeTip.cmp_price}
                                    onChange={e => setActiveTip({ ...activeTip, cmp_price: e.target.value })} required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold outline-none focus:ring-4 focus:ring-purple-500/10 transition-all text-slate-800" />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowUpdateStatusModal(false)}
                                    className="flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all bg-slate-100 hover:bg-slate-200 text-slate-800">
                                    Cancel
                                </button>
                                <button onClick={submitUpdateStatus} disabled={isSubmittingStatus}
                                    className="flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-[#011d52] hover:bg-[#011d52]/90 text-white">
                                    {isSubmittingStatus && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    <span>Update Status</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Category Modal */}
            {showCategoryModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
                    <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-slate-200 animate-fade-in">
                        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Create New Category</h3>
                            <button onClick={() => setShowCategoryModal(false)} className="text-slate-500 hover:text-slate-800 transition-colors p-1">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={submitCategory} className="p-4 space-y-5">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Category Name</label>
                                <input type="text" value={categoryName} onChange={e => setCategoryName(e.target.value)} required autoFocus placeholder="e.g. Intraday, Jackpot"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowCategoryModal(false)}
                                    className="flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all bg-slate-100 hover:bg-slate-200 text-slate-800">
                                    Cancel
                                </button>
                                <button type="submit"
                                    className="flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all bg-[#011d52] hover:bg-[#011d52]/90 text-white">
                                    Publish Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Drawer Overlay */}
            {drawerOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] transition-opacity"
                    onClick={() => setDrawerOpen(false)}
                ></div>
            )}

            {/* Right Drawer */}
            <div
                className={`fixed top-0 right-0 h-screen w-full md:w-[1000px] lg:w-[1200px] bg-slate-50 border-l border-slate-200 z-[9999] shadow-2xl transition-transform duration-300 transform ${drawerOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}
            >
                {drawerOpen && (
                    <div className="relative h-full flex flex-col">
                        {/* Drawer Header */}
                        <div className="sticky top-0 z-10 flex justify-between items-center p-4 border-b border-slate-200 bg-white">
                            <h2 className="text-xs font-semibold font-black text-slate-800">
                                {drawerType === 'equity' ? 'Create Equity Tip' : 'Create F&O Tip'}
                            </h2>
                            <button
                                onClick={() => setDrawerOpen(false)}
                                className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-rose-500 hover:border-rose-500/30 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                            {/* We wrap it in a div that blocks pointer events if needed or just renders the component */}
                            <div className="min-h-full">
                                {drawerType === 'equity' ? (
                                    <CreateEquityTip onClose={() => { setDrawerOpen(false); fetchTips(); }} />
                                ) : (
                                    <CreateFOTip onClose={() => { setDrawerOpen(false); fetchTips(); }} />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default TipsDashboard;
