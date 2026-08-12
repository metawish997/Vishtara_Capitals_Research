import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const PortalStockCard = ({
    item,
    formatStockName,
    formatDate,
    hasAccess = true
}) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [cmp, setCmp] = useState(item.cmp_price || item.cmp || 0);
    const prevCmpRef = useRef(cmp);

    const isLocked = !hasAccess;

    // Derived values
    const isSellCall = useMemo(() => (item.call_type || '').toUpperCase() === 'SELL', [item.call_type]);
    const isWaiting = useMemo(() => {
        const s = (item.status || '').toLowerCase();
        return s === 'waiting' || s === 'wait for entry';
    }, [item.status]);
    const isClosed = useMemo(() => (item.trade_status || '').toLowerCase() === 'closed', [item.trade_status]);
    const statusLower = useMemo(() => (item.status || '').toLowerCase(), [item.status]);

    const entryPrice = parseFloat(item.entry_price || 0);
    const target1 = parseFloat(item.target_price || 0);
    const target2 = parseFloat(item.target_price_2 || 0);
    const stopLoss = parseFloat(item.stop_loss || 0);
    const exitPrice = parseFloat(item.exit_price || 0);

    const estimatedProfitPercent = useMemo(() => {
        if (!entryPrice) return 0;
        const target = target2 || target1;
        const diff = isSellCall ? (entryPrice - target) : (target - entryPrice);
        return ((diff / entryPrice) * 100).toFixed(1);
    }, [entryPrice, target1, target2, isSellCall]);

    const achievedProfitPercent = useMemo(() => {
        if (!entryPrice || !cmp || isWaiting) return 0;
        const diff = isSellCall ? (entryPrice - cmp) : (cmp - entryPrice);
        return ((diff / entryPrice) * 100).toFixed(1);
    }, [entryPrice, cmp, isSellCall, isWaiting]);

    const getCmpPosition = () => {
        if (!entryPrice || !cmp) return 50;
        const sl = stopLoss;
        const target = target2 || target1;
        if (isSellCall) {
            if (cmp >= sl) return 0;
            if (cmp <= target) return 100;
            return ((sl - cmp) / (sl - target)) * 100;
        } else {
            if (cmp <= sl) return 0;
            if (cmp >= target) return 100;
            return ((cmp - sl) / (target - sl)) * 100;
        }
    };

    const getEntryDotPosition = () => {
        const base = entryPrice;
        const target = target2 || target1;
        const sl = stopLoss;
        if (!target || !sl) return 50;
        return isSellCall ? ((sl - base) / (sl - target)) * 100 : ((base - sl) / (target - sl)) * 100;
    };

    const cmpPosition = getCmpPosition();
    const openEntryDotPosition = getEntryDotPosition();

    const isProfitable = exitPrice ? (isSellCall ? exitPrice < entryPrice : exitPrice > entryPrice) : false;
    const isBreakEven = exitPrice === entryPrice;
    const profitPercentage = useMemo(() => {
        if (!entryPrice || !exitPrice) return 0;
        const diff = isSellCall ? (entryPrice - exitPrice) : (exitPrice - entryPrice);
        return ((diff / entryPrice) * 100).toFixed(1);
    }, [entryPrice, exitPrice, isSellCall]);

    useEffect(() => {
        if (item.cmp_price && item.cmp_price !== cmp) {
            setCmp(item.cmp_price);
        }
    }, [item.cmp_price]);

    const changePercent = useMemo(() => {
        if (!entryPrice || !cmp) return '0.00';
        const diff = isSellCall ? (entryPrice - cmp) : (cmp - entryPrice);
        return ((diff / entryPrice) * 100).toFixed(2);
    }, [cmp, entryPrice, isSellCall]);

    useEffect(() => {
        prevCmpRef.current = cmp;
    }, [cmp]);

    const formatPriceLabel = (val) => parseFloat(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const slMarkerPosition = isSellCall ? 100 : 0;
    const entryMarkerPosition = Math.max(0, Math.min(100, getEntryDotPosition()));
    const tg1Raw = isSellCall ? ((stopLoss - target1) / (stopLoss - (target2 || target1))) * 100 : ((target1 - stopLoss) / ((target2 || target1) - stopLoss)) * 100;
    const tg1MarkerPosition = Math.max(0, Math.min(100, tg1Raw));
    const tg2MarkerPosition = 100;
    const exitRaw = isSellCall ? ((stopLoss - exitPrice) / (stopLoss - (target2 || target1))) * 100 : ((exitPrice - stopLoss) / ((target2 || target1) - stopLoss)) * 100;
    const exitMarkerPosition = Math.max(0, Math.min(100, exitRaw));

    const tg1Achieved = isSellCall ? (exitPrice <= target1) : (exitPrice >= target1);
    const tg2Achieved = target2 ? (isSellCall ? (exitPrice <= target2) : (exitPrice >= target2)) : false;

    const shouldShowExitMarker = exitPrice && exitPrice !== entryPrice && exitPrice !== target1 && exitPrice !== target2 && exitPrice !== stopLoss;
    const shouldPlaceExitBeforeEntry = isSellCall ? exitPrice > entryPrice : exitPrice < entryPrice;

    const currentStatus = useMemo(() => {
        if (isClosed) return item.status;
        if (!cmp || isWaiting) {
            const reachedEntry = isSellCall ? (cmp <= entryPrice) : (cmp >= entryPrice);
            if (reachedEntry && cmp > 0) return 'Active';
            return item.status || 'Waiting';
        }

        if (target2 && (isSellCall ? (cmp <= target2) : (cmp >= target2))) return 'T2-Achieved';
        if (target1 && (isSellCall ? (cmp <= target1) : (cmp >= target1))) return 'T1-Achieved';
        if (stopLoss && (isSellCall ? (cmp >= stopLoss) : (cmp <= stopLoss))) return 'SL-Hit';

        return 'Active';
    }, [cmp, item.status, isClosed, isWaiting, entryPrice, target1, target2, stopLoss, isSellCall]);

    const statusLowerLive = (currentStatus || '').toLowerCase();

    const closedLineColorClass = isProfitable ? 'bg-emerald-500' : (isBreakEven ? 'bg-gray-400' : 'bg-red-500');
    const closedLineStartPosition = Math.min(entryMarkerPosition, exitMarkerPosition);
    const closedLineWidth = Math.abs(exitMarkerPosition - entryMarkerPosition);

    const getDerivativeInfo = (call) => {
        if (call.tip_type === 'future' || call.tip_type === 'option') {
            let expiryStr = '';
            if (call.expiry_date) {
                const date = new Date(call.expiry_date);
                expiryStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
            }
            if (call.tip_type === 'future') return `${expiryStr} FUT`;
            else if (call.tip_type === 'option') return `${expiryStr} ${call.strike_price || ''} ${call.option_type || ''}`;
        }
        return null;
    };
    const derivativeInfo = getDerivativeInfo(item);

    return (
        <div className="relative h-full" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div style={{ background: '#ffffff', borderColor: '#e2e8f0', boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }} className="rounded-2xl w-full h-full relative border transition-all duration-300 flex flex-col hover:border-gray-300">

                {/* Header Row for Badges */}
                <div className="flex justify-between items-start px-4 pt-4 pb-1">
                    {!isClosed ? (
                        <div style={{ background: '#011D52', color: '#ffffff' }} className="text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest">
                            <span>
                                {isLocked ? 'Premium' : (
                                    Math.abs(parseFloat(achievedProfitPercent)) > 0
                                        ? `${achievedProfitPercent}% ${parseFloat(achievedProfitPercent) >= 0 ? 'Achieved' : 'Potential'}`
                                        : `${estimatedProfitPercent}% Potential`
                                )}
                            </span>
                        </div>
                    ) : <div></div>}

                    {!isLocked && (
                        statusLowerLive === 'active' ? (
                            <div className="bg-red-50 text-red-500 text-[9px] font-bold px-2 py-1 rounded-md flex items-center gap-1 uppercase">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                                Live
                            </div>
                        ) : (
                            <div className={`text-[9px] font-bold px-2 py-1 rounded-md uppercase flex items-center gap-1 ${statusLowerLive === 't1-achieved' || statusLowerLive === 't2-achieved' ? 'bg-emerald-50 text-emerald-600' :
                                    statusLowerLive === 'sl-hit' ? 'bg-red-50 text-red-600' :
                                        statusLowerLive === 'early-exit' ? 'bg-blue-50 text-blue-600' :
                                            statusLowerLive === 'wait for entry' || statusLowerLive === 'waiting' ? 'bg-amber-50 text-amber-600' :
                                                'bg-gray-100 text-gray-600'
                                }`}>
                                {(statusLowerLive === 'waiting' || statusLowerLive === 'wait for entry') && <span>Wait for Entry</span>}
                                {(statusLowerLive === 't1-achieved' || statusLowerLive === 't2-achieved') && <span>{currentStatus.replace('-', ' ')}</span>}
                                {statusLower === 'sl-hit' && <span>Stoploss Hit</span>}
                                {statusLower === 'early-exit' && <span>Early Exit</span>}
                                {(statusLower === 'closed' || statusLower === 'archived') && <span>{item.status.replace('-', ' ')}</span>}
                            </div>
                        )
                    )}
                </div>

                <div className="px-4 flex justify-between items-start mt-2">
                    <div className="flex gap-3 min-w-0 flex-1">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 px-1.5 py-0.5 border border-gray-200 rounded-md">
                                    {item.exchange || 'NSE'}
                                </span>
                            </div>
                            <h2 className="text-lg font-black tracking-tight truncate uppercase" style={{ color: '#011D52' }}>
                                {formatStockName(item)}
                            </h2>
                            {derivativeInfo && (
                                <div className="mt-0.5 mb-1.5 flex items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                        {derivativeInfo}
                                    </span>
                                </div>
                            )}
                            <p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: '#64748b' }}>Published <span>{formatDate(item.createdAt || item.created_at)}</span></p>
                        </div>
                    </div>
                    {!isClosed ? (
                        <div className="text-right shrink-0">
                            <div className={`text-lg font-black rounded-lg px-1 ${isWaiting ? 'text-gray-400' : 'text-gray-900'}`} style={{ color: '#011D52' }}>
                                ₹{formatPriceLabel(cmp)}
                            </div>
                            {!isWaiting ? (
                                <div className={`text-[11px] font-bold uppercase tracking-widest ${changePercent >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                    <span>{changePercent}</span>%
                                </div>
                            ) : (
                                <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                                    Waiting
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-right shrink-0">
                            <p className={`text-[11px] font-black uppercase tracking-widest ${isSellCall ? 'text-red-500' : 'text-emerald-600'}`}>
                                {(item.call_type || '-').toUpperCase()}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>
                                {((item.category && item.category.name) ? item.category.name : (item.tip_type || '-')).toString().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                            </p>
                        </div>
                    )}
                </div>

                <div className="px-4 pt-3 flex-1 flex flex-col justify-center">
                    {!isLocked ? (
                        <div className="flex flex-col">

                            {!isClosed && (
                                <div className="relative w-full h-[2px] bg-gray-200 rounded-full mb-12 mt-2">
                                    <div className="absolute top-0 h-full bg-emerald-400" style={{ left: 0, width: `${Math.max(0, Math.min(100, cmpPosition))}%` }}></div>
                                    <div className="absolute -top-[3px] w-2 h-2 bg-gray-400 rounded-full" style={{ left: `${openEntryDotPosition}%` }}></div>

                                    <div className="absolute -top-[5px] w-3 h-3 bg-white border-2 border-emerald-500 rounded-full flex items-center justify-center z-10"
                                        style={{ left: `calc(${cmpPosition}% - 6px)` }}>
                                    </div>

                                    <div className="absolute top-3 w-full flex justify-between text-center gap-1">
                                        {!isSellCall ? (
                                            <>
                                                <div className="flex-1">
                                                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Stop</p>
                                                    <p className="text-[10px] font-bold" style={{ color: '#011D52' }}>{formatPriceLabel(item.stop_loss)}</p>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Entry</p>
                                                    <p className="text-[10px] font-bold" style={{ color: '#011D52' }}>{formatPriceLabel(item.entry_price)}</p>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">T1</p>
                                                    <p className="text-[10px] font-bold" style={{ color: '#011D52' }}>{formatPriceLabel(item.target_price)}</p>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">T2</p>
                                                    <p className="text-[10px] font-bold" style={{ color: '#011D52' }}>{formatPriceLabel(item.target_price_2)}</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex-1">
                                                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">T2</p>
                                                    <p className="text-[10px] font-bold" style={{ color: '#011D52' }}>{formatPriceLabel(item.target_price_2)}</p>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">T1</p>
                                                    <p className="text-[10px] font-bold" style={{ color: '#011D52' }}>{formatPriceLabel(item.target_price)}</p>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Entry</p>
                                                    <p className="text-[10px] font-bold" style={{ color: '#011D52' }}>{formatPriceLabel(item.entry_price)}</p>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Stop</p>
                                                    <p className="text-[10px] font-bold" style={{ color: '#011D52' }}>{formatPriceLabel(item.stop_loss)}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {isClosed && (
                                <div className="relative w-full h-[2px] bg-gray-100 rounded-full mb-12 mt-2">
                                    <div className="absolute top-0 h-[2px] bg-gray-200" style={{ left: `${Math.min(tg2MarkerPosition, slMarkerPosition)}%`, width: `${Math.abs(slMarkerPosition - tg2MarkerPosition)}%` }}></div>
                                    <div className="absolute top-0 h-[2px] bg-gray-300" style={{ left: `${Math.min(slMarkerPosition, entryMarkerPosition)}%`, width: `${Math.abs(entryMarkerPosition - slMarkerPosition)}%` }}></div>
                                    <div className={`absolute top-0 h-[2px] ${closedLineColorClass}`} style={{ left: `${closedLineStartPosition}%`, width: `${closedLineWidth}%` }}></div>

                                    <div className="absolute -top-[3px] w-2 h-2 bg-gray-400 rounded-full z-10" style={{ left: `calc(${entryMarkerPosition}% - 4px)` }}></div>

                                    <div className={`absolute -top-[3px] w-2 h-2 rounded-full z-10 ${tg1Achieved ? 'bg-emerald-500' : 'bg-gray-300'}`} style={{ left: `calc(${tg1MarkerPosition}% - 4px)` }}></div>

                                    {item.target_price_2 && (
                                        <div className={`absolute -top-[3px] w-2 h-2 rounded-full z-10 ${tg2Achieved ? 'bg-emerald-500' : 'bg-gray-300'}`} style={{ left: `calc(${tg2MarkerPosition}% - 4px)` }}></div>
                                    )}

                                    {shouldShowExitMarker && (
                                        <div className={`absolute -top-[4px] w-[10px] h-[10px] bg-white border-2 rounded-full flex items-center justify-center z-20 ${isProfitable ? 'border-emerald-500' : (isBreakEven ? 'border-gray-400' : 'border-red-500')}`} style={{ left: `calc(${exitMarkerPosition}% - 5px)` }}>
                                            <div className={`w-1 h-1 rounded-full ${isProfitable ? 'bg-emerald-500' : (isBreakEven ? 'bg-gray-400' : 'bg-red-500')}`}></div>
                                        </div>
                                    )}

                                    <div className="absolute top-3 w-full flex justify-between text-center gap-1">
                                        {!isSellCall ? (
                                            <>
                                                <div className="flex-1">
                                                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Stop</p>
                                                    <p className="text-[10px] font-bold text-gray-700">{formatPriceLabel(item.stop_loss)}</p>
                                                </div>
                                                {shouldShowExitMarker && shouldPlaceExitBeforeEntry && (
                                                    <div className="flex-1">
                                                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Exited</p>
                                                        <p className={`text-[10px] font-bold ${isProfitable ? 'text-emerald-600' : (isBreakEven ? 'text-gray-600' : 'text-red-600')}`}>
                                                            {formatPriceLabel(item.exit_price)}
                                                        </p>
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Entry</p>
                                                    <p className="text-[10px] font-bold text-gray-700">{formatPriceLabel(item.entry_price)}</p>
                                                </div>
                                                {shouldShowExitMarker && !shouldPlaceExitBeforeEntry && (
                                                    <div className="flex-1">
                                                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Exited</p>
                                                        <p className={`text-[10px] font-bold ${isProfitable ? 'text-emerald-600' : (isBreakEven ? 'text-gray-600' : 'text-red-600')}`}>
                                                            {formatPriceLabel(item.exit_price)}
                                                        </p>
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">T1</p>
                                                    <p className="text-[10px] font-bold text-gray-700">{formatPriceLabel(item.target_price)}</p>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">T2</p>
                                                    <p className="text-[10px] font-bold text-gray-700">{formatPriceLabel(item.target_price_2)}</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex-1">
                                                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">T2</p>
                                                    <p className="text-[10px] font-bold text-gray-700">{formatPriceLabel(item.target_price_2)}</p>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">T1</p>
                                                    <p className="text-[10px] font-bold text-gray-700">{formatPriceLabel(item.target_price)}</p>
                                                </div>
                                                {shouldShowExitMarker && shouldPlaceExitBeforeEntry && (
                                                    <div className="flex-1">
                                                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Exited</p>
                                                        <p className={`text-[10px] font-bold ${isProfitable ? 'text-emerald-600' : (isBreakEven ? 'text-gray-600' : 'text-red-600')}`}>
                                                            {formatPriceLabel(item.exit_price)}
                                                        </p>
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Entry</p>
                                                    <p className="text-[10px] font-bold text-gray-700">{formatPriceLabel(item.entry_price)}</p>
                                                </div>
                                                {shouldShowExitMarker && !shouldPlaceExitBeforeEntry && (
                                                    <div className="flex-1">
                                                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Exited</p>
                                                        <p className={`text-[10px] font-bold ${isProfitable ? 'text-emerald-600' : (isBreakEven ? 'text-gray-600' : 'text-red-600')}`}>
                                                            {formatPriceLabel(item.exit_price)}
                                                        </p>
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Stop</p>
                                                    <p className="text-[10px] font-bold text-gray-700">{formatPriceLabel(item.stop_loss)}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {isClosed && (
                                <div className="mt-auto mb-4 border-t border-gray-100 pt-4 flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Result</p>
                                        <p className={`text-[16px] font-black ${isProfitable ? 'text-emerald-600' : (isBreakEven ? 'text-gray-600' : 'text-red-600')}`}>
                                            {profitPercentage}% {isProfitable ? 'Profit' : 'Loss'}
                                        </p>
                                        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">
                                            {item.exit_at ? new Date(item.exit_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '-'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ background: 'rgba(1, 29, 82, 0.1)', color: '#011D52' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            </div>
                            <h3 className="font-black text-[13px] uppercase tracking-widest mb-1" style={{ color: '#011D52' }}>Premium Signal</h3>
                            <p className="text-[10px] text-center max-w-[200px]" style={{ color: '#64748b' }}>Subscribe to unlock entry and target levels.</p>

                            <button
                                onClick={() => navigate('/portal/plans')}
                                className="mt-3 text-[11px] font-black uppercase tracking-widest transition-all hover:underline"
                                style={{ color: '#011D52' }}>
                                View Plans
                            </button>
                        </div>
                    )}
                </div>
                {(user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'super admin' || ['approved', 'completed', 'success', 'verified'].includes((user?.kyc_status || '').toLowerCase())) && (


                    <div className="px-4 py-3 border-t flex justify-between items-center mt-4" style={{ borderColor: '#e2e8f0', backgroundColor: '#f8fafc', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
                        <div className="flex gap-4">
                            <button className={`transition-colors ${item.admin_note ? 'text-blue-500 hover:text-blue-600' : 'text-gray-400 hover:text-gray-600'}`} title={item.admin_note ? 'Note: ' + item.admin_note : 'Remarks'}>
                                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16" height="16">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                            <button className="text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1" title="Comments">
                                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16" height="16">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span className="text-[10px] font-bold">{(item.followups || []).length}</span>
                            </button>
                            {Array.isArray(item.media_files) && item.media_files.length > 0 && (
                                <button className="text-gray-400 hover:text-blue-500 transition-colors" title="View Attachment">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <div>
                            <button className="text-gray-400 hover:text-gray-600 transition-colors" title="Save to Watchlist">
                                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16" height="16">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default PortalStockCard;
