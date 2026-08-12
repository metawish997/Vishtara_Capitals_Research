import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import tipService from '../../../services/tipService';
import serviceService from '../../../services/serviceService';
import angelService from '../../../services/angelService';
import api, { BASE_URL } from '../../../services/api';
import toast from 'react-hot-toast';

const CreateFOTip = ({ onClose }) => {
    const navigate = useNavigate();
    const [trades, setTrades] = useState([{
        id: Date.now(),
        exchange: 'NFO',
        segment: 'OPT',
        stock_name: '',
        symbol_token: '',
        expiry_date: '',
        strike_price: '',
        option_type: 'CE',
        entry_price: '',
        cmp_price: '',
        target_price: '',
        target_price_2: '',
        stop_loss: '',
        call_type: 'BUY',
        calc_mode: 'percentage',
        manual_t1: '',
        manual_t2: '',
        manual_sl: '',
        mapped_symbol: '',
        chart_image: ''
    }]);
    const [expiries, setExpiries] = useState({}); // { tradeId: [] }
    const [strikes, setStrikes] = useState({}); // { tradeId: [] }
    const [categories, setCategories] = useState([]);
    const [plans, setPlans] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedPlans, setSelectedPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState({});
    const [showStrikeDropdown, setShowStrikeDropdown] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [catRes, planRes] = await Promise.all([
                tipService.getCategories(),
                serviceService.getServicePlans()
            ]);
            setCategories(catRes.data);
            setPlans(planRes.data);
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    };

    const addTrade = () => {
        if (trades.length < 3) {
            setTrades([...trades, {
                id: Date.now(),
                exchange: 'NFO',
                segment: 'OPT',
                stock_name: '',
                symbol_token: '',
                expiry_date: '',
                strike_price: '',
                option_type: 'CE',
                entry_price: '',
                cmp_price: '',
                target_price: '',
                target_price_2: '',
                stop_loss: '',
                call_type: 'BUY',
                calc_mode: 'percentage',
                manual_t1: '',
                manual_t2: '',
                manual_sl: '',
                mapped_symbol: '',
                chart_image: ''
            }]);
        }
    };

    const handleSearch = async (tradeId, query) => {
        const trade = trades.find(t => t.id === tradeId);
        updateTradeField(tradeId, 'stock_name', query);
        if (query.length > 2) {
            try {
                const res = await angelService.searchSymbols(query, trade.exchange);
                if (res.data?.[0]?.symbol === "SYSTEM_SYNCING") {
                    setSearchResults(prev => ({ ...prev, [tradeId]: [{ name: "⚠️ System is syncing stocks. Please wait 1 min..." }] }));
                } else {
                    setSearchResults(prev => ({ ...prev, [tradeId]: res.data }));
                }
            } catch (error) {
                console.error('Search error:', error);
            }
        } else {
            setSearchResults(prev => ({ ...prev, [tradeId]: [] }));
        }
    };

    const fetchLTP = async (tradeId) => {
        const trade = trades.find(t => t.id === tradeId);
        if (!trade.symbol_token) return;

        try {
            const quoteRes = await angelService.getQuote([trade.symbol_token], 'FULL', trade.exchange);
            const fetchedData = quoteRes.data?.fetched || (Array.isArray(quoteRes.data) ? quoteRes.data : [quoteRes.data]);
            const ltp = fetchedData?.[0]?.ltp || 0;

            updateTradeField(tradeId, 'cmp_price', ltp);
            if (!trade.entry_price) {
                updateTradeField(tradeId, 'entry_price', ltp);
            }
        } catch (error) {
            console.error('Fetch LTP error:', error);
        }
    };

    const calculateManual = (tradeId, updatedTrade = null) => {
        setTrades(prev => prev.map(t => {
            if (t.id !== tradeId) return t;

            const trade = updatedTrade || t;
            let entry = parseFloat(trade.entry_price);
            if (!entry || isNaN(entry)) return trade;

            let isBuy = trade.call_type === 'BUY';
            let mode = trade.calc_mode;
            let newTrade = { ...trade };

            if (mode === 'fixed_price') {
                let gap = parseFloat(trade.manual_t1);
                if (!isNaN(gap)) {
                    newTrade.target_price = (isBuy ? entry + gap : entry - gap).toFixed(2);
                    newTrade.target_price_2 = (isBuy ? entry + gap * 2 : entry - gap * 2).toFixed(2);
                    newTrade.stop_loss = (isBuy ? entry - gap : entry + gap).toFixed(2);
                    // Clear other manual inputs for consistency
                    newTrade.manual_t2 = (gap * 2).toString();
                    newTrade.manual_sl = gap.toString();
                }
                return newTrade;
            }

            if (mode === 'fixed_percentage') {
                let gapPercent = parseFloat(trade.manual_t1);
                if (!isNaN(gapPercent)) {
                    let t1Diff = (entry * gapPercent) / 100;
                    let t2Diff = (entry * (gapPercent * 2)) / 100;
                    newTrade.target_price = (isBuy ? entry + t1Diff : entry - t1Diff).toFixed(2);
                    newTrade.target_price_2 = (isBuy ? entry + t2Diff : entry - t2Diff).toFixed(2);
                    newTrade.stop_loss = (isBuy ? entry - t1Diff : entry + t1Diff).toFixed(2);
                    // Update visual gap values
                    newTrade.manual_t2 = (gapPercent * 2).toString();
                    newTrade.manual_sl = gapPercent.toString();
                }
                return newTrade;
            }

            const calcGap = (gapVal, isTarget) => {
                let val = parseFloat(gapVal);
                if (isNaN(val)) return '';
                let diff = mode === 'percentage' ? (entry * val) / 100 : val;
                return isTarget
                    ? (isBuy ? entry + diff : entry - diff).toFixed(2)
                    : (isBuy ? entry - diff : entry + diff).toFixed(2);
            };

            if (trade.manual_t1) newTrade.target_price = calcGap(trade.manual_t1, true);
            if (trade.manual_t2) newTrade.target_price_2 = calcGap(trade.manual_t2, true);
            if (trade.manual_sl) newTrade.stop_loss = calcGap(trade.manual_sl, false);

            return newTrade;
        }));
    };

    const updateTradeField = async (id, field, value) => {
        setTrades(prev => {
            const newTrades = prev.map(t => {
                if (t.id === id) {
                    const updated = { ...t, [field]: value };
                    if (field === 'stock_name') {
                        updated.cmp_price = '';
                    }
                    return updated;
                }
                return t;
            });
            return newTrades;
        });

        if (['entry_price', 'call_type', 'calc_mode', 'manual_t1', 'manual_t2', 'manual_sl'].includes(field)) {
            setTimeout(() => calculateManual(id), 0);
        }

        if (field === 'segment') {
            const trade = trades.find(t => t.id === id);
            if (trade.stock_name) {
                fetchExpiries(id, trade.stock_name, value);
            }
        }
        if (field === 'exchange') {
            const trade = trades.find(t => t.id === id);
            if (trade.stock_name) {
                handleSearch(id, trade.stock_name);
            }
        }
        if (field === 'expiry_date') {
            const trade = trades.find(t => t.id === id);
            if (trade.segment === 'OPT' || value.includes('OPT')) {
                fetchStrikes(id, trade.stock_name, value);
            } else {
                selectContract(id, trade.stock_name, value, trade.segment);
            }
        }
        if (field === 'strike_price' || field === 'option_type') {
            const trade = trades.find(t => t.id === id);
            if (trade) {
                const strike = field === 'strike_price' ? value : trade.strike_price;
                const optType = field === 'option_type' ? value : trade.option_type;
                setTimeout(() => selectContract(id, trade.stock_name, trade.expiry_date, trade.segment, strike, optType), 0);
            }
        }
    };

    const parseAngelExpiry = (expiry) => {

        if (!expiry) return null;

        /*
        HANDLE ISO FORMAT
        */

        if (expiry.includes('-')) {

            const dt = new Date(expiry);

            return isNaN(dt) ? null : dt;

        }

        /*
        HANDLE ANGEL FORMAT
        27JUN2026
        */

        try {

            const day = parseInt(expiry.slice(0, 2));

            const monthStr = expiry.slice(2, 5);

            const year = parseInt(expiry.slice(5, 9));

            const monthMap = {
                JAN: 0,
                FEB: 1,
                MAR: 2,
                APR: 3,
                MAY: 4,
                JUN: 5,
                JUL: 6,
                AUG: 7,
                SEP: 8,
                OCT: 9,
                NOV: 10,
                DEC: 11
            };

            const month =
                monthMap[monthStr.toUpperCase()];

            if (month === undefined) {
                return null;
            }

            return new Date(year, month, day);

        } catch (error) {

            return null;

        }

    };

    const fetchExpiries = async (
        tradeId,
        name,
        segment = null
    ) => {

        const trade =
            trades.find(t => t.id === tradeId);

        const actualSegment = segment || trade.segment;

        const type =
            actualSegment === 'FUT'
                ? 'future'
                : 'option';

        try {

            const res =
                await angelService.getExpiries(
                    name,
                    trade.exchange,
                    type
                );

            let rawExpiries =
                res?.data || [];

            /*
            REMOVE INVALID
            */

            rawExpiries =
                rawExpiries.filter(Boolean);

            /*
            FILTER PAST EXPIRIES
            */

            const today = new Date();

            today.setHours(0, 0, 0, 0);

            let filteredExpiries =
                rawExpiries.filter(exp => {

                    const dt =
                        parseAngelExpiry(exp);

                    return dt && dt >= today;

                });

            /*
            REMOVE DUPLICATES
            */

            filteredExpiries =
                [...new Set(filteredExpiries)];

            /*
            SORT ASC
            */

            filteredExpiries.sort((a, b) => {

                return (
                    parseAngelExpiry(a) -
                    parseAngelExpiry(b)
                );

            });

            /*
            INDEX LIMIT
            */

            const indices = [

                'NIFTY',
                'BANKNIFTY',
                'FINNIFTY',
                'MIDCPNIFTY',
                'SENSEX',
                'BANKEX'

            ];

            const isIndex =
                indices.some(idx =>
                    name.toUpperCase().includes(idx)
                );

            if (isIndex) {

                filteredExpiries =
                    filteredExpiries.slice(0, 12);

            }

            /*
            MCX MONTHLY FILTER
            */

            if (
                trade.exchange === 'MCX'
                &&
                type === 'future'
            ) {

                const monthMap = {};

                filteredExpiries.forEach(exp => {

                    const dt =
                        parseAngelExpiry(exp);

                    const key =
                        `${dt.getFullYear()}-${dt.getMonth()}`;

                    if (
                        !monthMap[key]
                        ||
                        dt >
                        parseAngelExpiry(monthMap[key])
                    ) {

                        monthMap[key] = exp;

                    }

                });

                filteredExpiries =
                    Object.values(monthMap);

            }

            setExpiries(prev => ({
                ...prev,
                [tradeId]: filteredExpiries
            }));


        } catch (error) {

            console.error(
                'Expiries fetch error:',
                error
            );

        }

    };

    const fetchStrikes = async (
        tradeId,
        name,
        expiry
    ) => {

        const trade =
            trades.find(t => t.id === tradeId);

        try {

            const res =
                await angelService.getStrikes(
                    name,
                    expiry,
                    trade.exchange
                );

            let strikesData =
                res?.data || [];

            /*
            REMOVE INVALID
            */

            strikesData =
                strikesData
                    .map(x => parseFloat(x))
                    .filter(x => !isNaN(x));

            /*
            REMOVE DUPLICATES
            */

            strikesData =
                [...new Set(strikesData)];

            /*
            SORT
            */

            strikesData.sort((a, b) => a - b);

            setStrikes(prev => ({
                ...prev,
                [tradeId]: strikesData
            }));


        } catch (error) {

            console.error(
                'Strikes fetch error:',
                error
            );

        }

    };

    const selectContract = async (
        tradeId,
        name,
        expiry,
        segment,
        strike,
        option_type
    ) => {

        const trade =
            trades.find(t => t.id === tradeId);

        try {

            const type =
                segment === 'FUT'
                    ||
                    segment === 'future'
                    ? 'future'
                    : 'option';

            const res =
                await angelService.findToken({

                    name:
                        name || trade.stock_name,

                    exchange:
                        trade.exchange,

                    expiry:
                        expiry || trade.expiry_date,

                    type,

                    strike:
                        strike || trade.strike_price,

                    right:
                        option_type || trade.option_type

                });

            if (!res?.status || !res?.data) {

                console.log(
                    'Contract not found'
                );

                return;

            }

            const token =
                res.data.token;

            /*
            FETCH LTP
            */

            const quoteRes =
                await angelService.getQuote(
                    [token],
                    'FULL',
                    trade.exchange
                );

            const fetched =
                quoteRes?.data?.fetched || (Array.isArray(quoteRes?.data) ? quoteRes.data : [quoteRes?.data]);

            const ltp =
                parseFloat(
                    fetched?.[0]?.ltp || 0
                );

            setTrades(prev =>
                prev.map(t => {

                    if (t.id !== tradeId) {
                        return t;
                    }

                    return {

                        ...t,

                        symbol_token: token,

                        mapped_symbol:
                            res.data.symbol
                            ||
                            res.data.name,

                        cmp_price: ltp,

                        entry_price:
                            t.entry_price || ltp

                    };

                })
            );

            setTimeout(() => {

                calculateManual(tradeId);

            }, 100);

        } catch (error) {

            console.error(
                'Select contract error:',
                error
            );

        }

    };

    const handlePublish = async () => {
        if (!selectedCategory || selectedPlans.length === 0) {
            alert('Please select category and plans');
            return;
        }

        setLoading(true);
        try {
            for (const trade of trades) {
                const { id, ...tipData } = trade;
                await tipService.createTip({
                    ...tipData,
                    tip_type: trade.segment === 'FUT' ? 'future' : 'option',
                    category: selectedCategory,
                    service_plans: selectedPlans
                });
            }
            alert('F&O Tips published successfully!');
            if (onClose) onClose();
            else navigate('/admin/tips');
        } catch (error) {
            console.error('Publish error:', error);
            alert('Failed to publish');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (tradeId, e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            updateTradeField(tradeId, 'isUploading', true);
            const formData = new FormData();
            formData.append('files', file); 
            
            const response = await api.post('/media/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const data = response.data;
            
            if (data.success && data.data && data.data.length > 0) {
                updateTradeField(tradeId, 'chart_image', data.data[0].url);
                toast.success('Chart attached successfully!');
            } else {
                toast.error('Failed to upload image.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Error uploading file');
        } finally {
            updateTradeField(tradeId, 'isUploading', false);
        }
    };

    const removeTrade = (id) => {
        if (trades.length > 1) {
            setTrades(trades.filter(t => t.id !== id));
        }
    };

        return (
        <div className="p-2 md:p-3 font-inter text-slate-800">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
                <div className="flex gap-2">
                    {onClose ? (
                        <button onClick={onClose} className="px-3 py-1.5 bg-white text-slate-800 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:border-[#011d52] transition ">
                            <i className="fa-solid fa-list mr-2"></i> Show All Tips
                        </button>
                    ) : (
                        <Link to="/admin/tips" className="px-3 py-1.5 bg-white text-slate-800 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:border-[#011d52] transition ">
                            <i className="fa-solid fa-list mr-2"></i> Show All Tips
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-3">
                {/* Sidebar */}
                <div className="space-y-2">
                    <div className="bg-white rounded-lg p-3 border border-slate-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-[9px] font-black text-slate-500 uppercase tracking-[2px] flex items-center">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></span> Category
                            </h2>
                            <div className="flex gap-1">
                                <button className="w-7 h-7 flex items-center justify-center bg-slate-50 text-[#011d52] border border-slate-200 rounded-lg hover:bg-[#011d52] hover:text-[#020210] transition-all">
                                    <i className="fa-solid fa-plus text-[10px]"></i>
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat._id}
                                    onClick={() => setSelectedCategory(cat._id)}
                                    className={`py-1 px-1.5 rounded-[4px] text-[8px] font-black text-center border transition-all duration-300 ${selectedCategory === cat._id ? 'bg-sky-100 text-sky-700 border-sky-300 shadow-sm scale-[1.02]' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-3 border border-slate-200">
                        <h2 className="text-[9px] font-black text-slate-500 uppercase tracking-[2px] mb-4 flex items-center">
                            <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span> Visibility
                        </h2>
                        <div className="space-y-1.5">
                            {plans.map(plan => (
                                <button
                                    key={plan._id}
                                    onClick={() => setSelectedPlans(prev => prev.includes(plan._id) ? prev.filter(id => id !== plan._id) : [...prev, plan._id])}
                                    className={`w-full py-1 px-2 rounded-[4px] text-[8px] font-black text-left border transition-all duration-300 ${selectedPlans.includes(plan._id) ? 'bg-sky-100 text-sky-700 border-sky-300 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                                >
                                    {plan.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-4">
                    {trades.map((trade, index) => (
                        <div key={trade.id} className="bg-white rounded-lg  border border-slate-200 overflow-hidden relative group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="p-4">
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-[3px] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center">
                                            <span className="w-5 h-5 bg-slate-900 text-slate-50 rounded-lg flex items-center justify-center text-[8px] mr-3">#{index + 1}</span>
                                            F&O Tip
                                        </h3>
                                        <div className="flex bg-slate-50 p-1 rounded-lg gap-1 border border-slate-200">
                                            <button
                                                onClick={() => updateTradeField(trade.id, 'segment', 'FUT')}
                                                className={`px-3 py-1 text-[9px] font-black rounded-[4px] transition-all ${trade.segment === 'FUT' ? 'bg-white shadow text-sky-600 border border-slate-200' : 'text-slate-500 hover:text-slate-600'}`}
                                            >FUTURE</button>
                                            <button
                                                onClick={() => updateTradeField(trade.id, 'segment', 'OPT')}
                                                className={`px-3 py-1 text-[9px] font-black rounded-[4px] transition-all ${trade.segment === 'OPT' ? 'bg-sky-100 text-sky-700 border border-sky-300 shadow-sm' : 'text-slate-500 hover:text-slate-600'}`}
                                            >OPTION</button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id={`chart-upload-${trade.id}`}
                                                className="hidden"
                                                onChange={(e) => handleFileUpload(trade.id, e)}
                                            />
                                            {!trade.chart_image && (
                                                <button 
                                                    onClick={() => document.getElementById(`chart-upload-${trade.id}`).click()}
                                                    disabled={trade.isUploading}
                                                    className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-[8px] font-black uppercase tracking-wider transition-all bg-slate-50 border-slate-200 text-slate-500 hover:bg-white`}
                                                >
                                                    {trade.isUploading ? (
                                                        <><i className="fa-solid fa-spinner fa-spin"></i></>
                                                    ) : (
                                                        <><i className="fa-solid fa-paperclip"></i> ATTACH</>
                                                    )}
                                                </button>
                                            )}
                                            {trade.chart_image && (
                                                <div className="relative group/chart">
                                                    <img 
                                                        src={trade.chart_image.startsWith('http') || trade.chart_image.startsWith('data:') ? trade.chart_image : `${api.defaults.baseURL || 'http://localhost:5001'}${trade.chart_image}`} 
                                                        alt="preview" 
                                                        className="w-8 h-8 object-cover rounded border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
                                                        onClick={() => setPreviewImage(trade.chart_image)}
                                                    />
                                                    <button 
                                                        onClick={() => updateTradeField(trade.id, 'chart_image', '')}
                                                        className="absolute -top-2 -right-2 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[8px] opacity-0 group-hover/chart:opacity-100 transition-opacity z-10"
                                                    >
                                                        <i className="fa-solid fa-times"></i>
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex bg-slate-50 p-1 rounded-lg gap-1 border border-slate-200">
                                            <button
                                                onClick={() => updateTradeField(trade.id, 'call_type', 'BUY')}
                                                className={`px-4 py-1 text-[9px] font-black rounded-[4px] transition-all ${trade.call_type === 'BUY' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'}`}
                                            >BUY</button>
                                            <button
                                                onClick={() => updateTradeField(trade.id, 'call_type', 'SELL')}
                                                className={`px-4 py-1 text-[9px] font-black rounded-[4px] transition-all ${trade.call_type === 'SELL' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'}`}
                                            >SELL</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-[2px] block px-1">Exchange</label>
                                        <div className="flex bg-slate-50 p-[3px] rounded-lg gap-1 h-[32px] items-center">
                                            <button
                                                onClick={() => updateTradeField(trade.id, 'exchange', 'NFO')}
                                                className={`flex-1 h-full text-[9px] font-black rounded-[4px] transition-all ${trade.exchange === 'NFO' ? 'bg-white shadow-sm text-sky-600 border border-slate-200' : 'text-slate-500'}`}
                                            >NFO</button>
                                            <button
                                                onClick={() => updateTradeField(trade.id, 'exchange', 'BFO')}
                                                className={`flex-1 h-full text-[9px] font-black rounded-[4px] transition-all ${trade.exchange === 'BFO' ? 'bg-white shadow-sm text-sky-600 border border-slate-200' : 'text-slate-500'}`}
                                            >BFO</button>
                                            <button
                                                onClick={() => updateTradeField(trade.id, 'exchange', 'MCX')}
                                                className={`flex-1 h-full text-[9px] font-black rounded-[4px] transition-all ${trade.exchange === 'MCX' ? 'bg-white shadow-sm text-sky-600 border border-slate-200' : 'text-slate-500'}`}
                                            >MCX</button>
                                        </div>
                                    </div>

                                    <div className="space-y-2 relative">
                                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-[2px] block px-1">Script Name</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={trade.stock_name}
                                                onChange={(e) => handleSearch(trade.id, e.target.value)}
                                                placeholder="SEARCH SYMBOL..."
                                                className="w-full bg-white border border-slate-200 rounded-[4px] px-2 h-[32px] text-[10px] font-black text-slate-800 focus:border-sky-500 transition-all outline-none"
                                            />
                                            {searchResults[trade.id] && searchResults[trade.id].length > 0 && (
                                                <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-lg shadow-2xl mt-2 max-h-64 overflow-y-auto py-2">
                                                    {searchResults[trade.id].map((res, i) => (
                                                        <div
                                                            key={i}
                                                            onClick={() => {
                                                                if (res.name?.includes('syncing')) return;
                                                                updateTradeField(trade.id, 'stock_name', res.name);
                                                                setSearchResults(prev => ({ ...prev, [trade.id]: [] }));
                                                                fetchExpiries(trade.id, res.name);
                                                            }}
                                                            className="px-6 py-3.5 hover:bg-slate-50 cursor-pointer flex justify-between items-center group/item transition-colors"
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="text-[11px] font-black text-slate-800 group-hover/item:text-[#011d52] transition-colors uppercase">{res.name}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-[2px] block px-1">Expiry Date</label>
                                        <select
                                            value={trade.expiry_date}
                                            onChange={(e) => updateTradeField(trade.id, 'expiry_date', e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-[4px] px-2 h-[32px] text-[10px] font-black text-slate-800 focus:border-sky-500 transition-all outline-none"
                                        >
                                            <option value="">SELECT EXPIRY</option>
                                            {(expiries[trade.id] || []).map((exp, i) => (
                                                <option key={i} value={exp}>{exp}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Row 2: Option Type, Strike */}
                                {trade.segment === 'OPT' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-slate-500 uppercase tracking-[2px] block px-1">Option Type</label>
                                            <div className="flex bg-slate-50 p-[3px] rounded-lg gap-1 border border-slate-200 h-[32px] items-center">
                                                <button
                                                    onClick={() => updateTradeField(trade.id, 'option_type', 'CE')}
                                                    className={`flex-1 h-full text-[9px] font-black rounded-[4px] transition-all ${trade.option_type === 'CE' ? 'bg-[#c1ff00] text-slate-900 border border-[#b2e600]' : 'text-slate-500 hover:text-slate-700'}`}
                                                >CALL (CE)</button>
                                                <button
                                                    onClick={() => updateTradeField(trade.id, 'option_type', 'PE')}
                                                    className={`flex-1 h-full text-[9px] font-black rounded-[4px] transition-all ${trade.option_type === 'PE' ? 'bg-[#c1ff00] text-slate-900 border border-[#b2e600]' : 'text-slate-500 hover:text-slate-700'}`}
                                                >PUT (PE)</button>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-slate-500 uppercase tracking-[2px] block px-1">Strike Price</label>
                                            <select
                                                value={trade.strike_price}
                                                onChange={(e) => updateTradeField(trade.id, 'strike_price', e.target.value)}
                                                className="w-full bg-white border border-slate-200 rounded-[4px] px-2 h-[32px] text-[10px] font-black text-slate-800 focus:border-sky-500 transition-all outline-none"
                                            >
                                                <option value="">Search Strike</option>
                                                {(strikes[trade.id] || []).map((strike, i) => (
                                                    <option key={i} value={strike}>{strike}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-1.5 hidden md:block"></div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3 mb-3">
                                    <select
                                        value={trade.calc_mode}
                                        onChange={(e) => updateTradeField(trade.id, 'calc_mode', e.target.value)}
                                        className="bg-white border border-slate-200 rounded-[4px] px-2 py-1 text-[9px] font-black text-slate-800 focus:border-sky-500 outline-none cursor-pointer transition-all "
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="price">Fixed Price (₹)</option>
                                        <option value="fixed_percentage">Fixed % (Auto T2 & SL)</option>
                                        <option value="fixed_price">Fixed ₹ (Auto T2 & SL)</option>
                                    </select>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="relative group">
                                            <input
                                                type="number" step="any" placeholder="T1 GAP"
                                                value={trade.manual_t1}
                                                onChange={(e) => updateTradeField(trade.id, 'manual_t1', e.target.value)}
                                                className="w-full bg-white border border-slate-200 rounded-[4px] px-2 py-1 text-[10px] font-black text-slate-800 focus:border-sky-500 focus:bg-slate-50 transition-all outline-none placeholder:text-slate-500"
                                            />
                                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[8px] font-black text-slate-500 group-focus-within:text-slate-500">T1</span>
                                        </div>
                                        <div className="relative group">
                                            <input
                                                type="number" step="any" placeholder="T2 GAP"
                                                value={trade.manual_t2}
                                                disabled={['fixed_percentage', 'fixed_price'].includes(trade.calc_mode)}
                                                onChange={(e) => updateTradeField(trade.id, 'manual_t2', e.target.value)}
                                                className="w-full bg-white border border-slate-200 rounded-[4px] px-2 py-1 text-[10px] font-black text-slate-800 focus:border-sky-500 focus:bg-slate-50 transition-all outline-none placeholder:text-slate-500 disabled:opacity-20"
                                            />
                                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[8px] font-black text-slate-500 group-focus-within:text-slate-500">T2</span>
                                        </div>
                                        <div className="relative group">
                                            <input
                                                type="number" step="any" placeholder="SL GAP"
                                                value={trade.manual_sl}
                                                disabled={['fixed_percentage', 'fixed_price'].includes(trade.calc_mode)}
                                                onChange={(e) => updateTradeField(trade.id, 'manual_sl', e.target.value)}
                                                className="w-full bg-white border border-slate-200 rounded-[4px] px-2 py-1 text-[10px] font-black text-slate-800 focus:border-sky-500 focus:bg-slate-50 transition-all outline-none placeholder:text-slate-500 disabled:opacity-20"
                                            />
                                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[8px] font-black text-slate-500 group-focus-within:text-slate-500">SL</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border border-slate-200 rounded-lg overflow-hidden ">
                                    <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-slate-200 bg-slate-200">
                                        <div className="bg-white p-2 md:p-2.5">
                                            <label className="block text-[7px] font-black text-blue-500 uppercase mb-1 tracking-[2px]">Entry Price</label>
                                            <input
                                                type="number" step="any" placeholder="0.00"
                                                value={trade.entry_price}
                                                onChange={(e) => updateTradeField(trade.id, 'entry_price', e.target.value)}
                                                className="w-full text-[11px] font-black text-slate-800 outline-none bg-transparent"
                                            />
                                        </div>
                                        <div className="bg-white p-2 md:p-2.5 relative">
                                            <label className="block text-[7px] font-black text-amber-500 uppercase mb-1 tracking-[2px] flex justify-between">
                                                Market Price
                                                <button onClick={() => fetchLTP(trade.id)} className="text-amber-500 hover:rotate-180 transition-all duration-700">
                                                    <i className="fa-solid fa-arrows-rotate"></i>
                                                </button>
                                            </label>
                                            <input
                                                type="number" step="any" placeholder="0.00"
                                                value={trade.cmp_price}
                                                onChange={(e) => updateTradeField(trade.id, 'cmp_price', e.target.value)}
                                                className="w-full text-[11px] font-black text-amber-600 outline-none bg-transparent"
                                            />
                                        </div>
                                        <div className="bg-white p-2 md:p-2.5">
                                            <label className="block text-[7px] font-black text-emerald-500 uppercase mb-1 tracking-[2px]">Target 01</label>
                                            <input
                                                type="number" step="any" placeholder="0.00"
                                                value={trade.target_price}
                                                onChange={(e) => updateTradeField(trade.id, 'target_price', e.target.value)}
                                                className="w-full text-[11px] font-black text-emerald-600 outline-none bg-transparent"
                                            />
                                        </div>
                                        <div className="bg-white p-2 md:p-2.5">
                                            <label className="block text-[7px] font-black text-indigo-500 uppercase mb-1 tracking-[2px]">Target 02</label>
                                            <input
                                                type="number" step="any" placeholder="0.00"
                                                value={trade.target_price_2}
                                                onChange={(e) => updateTradeField(trade.id, 'target_price_2', e.target.value)}
                                                className="w-full text-[11px] font-black text-indigo-600 outline-none bg-transparent"
                                            />
                                        </div>
                                        <div className="bg-white p-2 md:p-2.5">
                                            <label className="block text-[7px] font-black text-rose-500 uppercase mb-1 tracking-[2px]">Stop Loss</label>
                                            <input
                                                type="number" step="any" placeholder="0.00"
                                                value={trade.stop_loss}
                                                onChange={(e) => updateTradeField(trade.id, 'stop_loss', e.target.value)}
                                                className="w-full text-[11px] font-black text-rose-600 outline-none bg-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {trades.length > 1 && (
                                <button
                                    onClick={() => removeTrade(trade.id)}
                                    className="absolute top-4 right-6 w-8 h-8 flex items-center justify-center bg-rose-50 text-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white shadow-sm"
                                >
                                    <i className="fa-solid fa-xmark text-xs"></i>
                                </button>
                            )}
                        </div>
                    ))}

                    <div className="flex flex-col md:flex-row items-center gap-3 pt-6 pb-20">
                        <button
                            onClick={addTrade}
                            disabled={trades.length >= 3}
                            className="bg-white border border-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:border-[#011d52] font-black text-[11px] uppercase tracking-[3px] transition-all disabled:opacity-30 shadow-sm"
                        >
                            <i className="fa-solid fa-plus mr-3"></i> Add Another Block
                        </button>

                        <button
                            onClick={handlePublish}
                            disabled={loading}
                            className="flex-1 bg-sky-500 text-white px-4 py-1.5 rounded-[4px] border border-sky-600 font-black text-[10px] hover:opacity-90 active:scale-95 transition-all uppercase tracking-[4px] shadow-sm disabled:opacity-50"
                        >
                            {loading ? 'PUBLISHING...' : 'PUBLISH F&O TIPS'}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Image Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10000] p-4" onClick={() => setPreviewImage(null)}>
                    <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setPreviewImage(null)} className="absolute -top-10 right-0 text-white hover:text-slate-300">
                            <i className="fa-solid fa-xmark text-2xl"></i>
                        </button>
                        <img src={previewImage.startsWith('http') || previewImage.startsWith('data:') ? previewImage : `${api.defaults.baseURL}${previewImage}`} alt="Preview" className="w-full h-auto rounded-lg shadow-2xl" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateFOTip;
