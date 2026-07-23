import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  RefreshCw, 
  Database, 
  Key, 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ShieldCheck,
  AlertCircle,
  Cpu,
  Unplug
} from 'lucide-react';
import angelService from '../../../services/angelService';
import { toast } from 'react-hot-toast';

const SystemHealth = () => {
    // State
    const [connectionStatus, setConnectionStatus] = useState('unknown');
    const [tokens, setTokens] = useState({ jwt: null, feed: null });
    const [syncStatus, setSyncStatus] = useState({ total: 0, lastSync: null, isUpdating: false });
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState({ conn: false, token: false, sync: false });
    const [healthStats, setHealthStats] = useState({
        successRate: '0%',
        failureCount: '0 / 5',
        circuitBreaker: 'Inactive',
        lastCheck: 'Never',
        jwtExpiry: null
    });
    const [jwtCountdown, setJwtCountdown] = useState('--:--');

    const logEndRef = useRef(null);

    // Initial Load
    useEffect(() => {
        fetchStatus();
        const timer = setInterval(() => {
            updateJwtCountdown();
        }, 1000);
        return () => clearInterval(timer);
    }, [healthStats.jwtExpiry]);

    const updateJwtCountdown = () => {
        if (!healthStats.jwtExpiry) {
            setJwtCountdown('--:--');
            return;
        }
        const now = new Date();
        const expiry = new Date(healthStats.jwtExpiry);
        const diff = expiry - now;
        
        if (diff <= 0) {
            setJwtCountdown('Expired');
            return;
        }

        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setJwtCountdown(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
    };

    const fetchStatus = async () => {
        setIsLoading(prev => ({ ...prev, sync: true, token: true }));
        try {
            const syncRes = await angelService.getSyncStatus();
            if (syncRes.status) {
                setSyncStatus({
                    total: syncRes.data.count,
                    lastSync: syncRes.data.lastUpdate,
                    isUpdating: syncRes.data.isUpdating
                });
            }

            const tokenRes = await angelService.getWsToken();
            if (tokenRes.status) {
                setTokens({
                    jwt: tokenRes.data.jwt,
                    feed: tokenRes.data.feed,
                });
                setHealthStats(tokenRes.data.health || {});
                setConnectionStatus('Connected');
                addLog('Status check completed successfully', 'success');
            } else {
                setConnectionStatus('Disconnected');
                addLog('Status check failed: API unreachable', 'error');
            }
        } catch (error) {
            setConnectionStatus('Disconnected');
            addLog(`System Error: ${error.message}`, 'error');
        } finally {
            setIsLoading(prev => ({ ...prev, sync: false, token: false }));
        }
    };

    const handleReconnect = async () => {
        setIsLoading(prev => ({ ...prev, conn: true }));
        addLog('Checking API connection status...', 'info');
        try {
            const res = await angelService.login();
            if (res.status) {
                setConnectionStatus('Connected');
                addLog('Status check completed successfully', 'success');
                toast.success('API Reconnected');
                fetchStatus();
            } else {
                addLog(`Handshake Failed: ${res.message}`, 'error');
                toast.error('Connection Failed');
            }
        } catch (error) {
            addLog(`Fatal Network Error: ${error.message}`, 'error');
        } finally {
            setIsLoading(prev => ({ ...prev, conn: false }));
        }
    };

    const runSync = async () => {
        if (syncStatus.isUpdating) return;
        setSyncStatus(prev => ({ ...prev, isUpdating: true }));
        addLog('Initiating full scrip master synchronization...', 'info');
        try {
            const res = await angelService.syncScrips();
            if (res.success || res.status) {
                addLog(`Sync Complete: ${res.count?.toLocaleString() || '0'} scrips processed.`, 'success');
                toast.success('Scrips Synced');
                fetchStatus();
            }
        } catch (error) {
            addLog(`Sync Error: ${error.message}`, 'error');
        } finally {
            setSyncStatus(prev => ({ ...prev, isUpdating: false }));
        }
    };

    const addLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
        setLogs(prev => [{ timestamp, message, type }, ...prev].slice(0, 50));
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 font-sans text-slate-800">
            <div className="max-w-[1400px] mx-auto space-y-8">
                
                {/* Top Header Section */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-xs font-black text-slate-800 uppercase tracking-tight">API Connection Status</h1>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">Monitor and manage Angel One API connectivity</p>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={fetchStatus}
                            className="bg-[#2563eb] hover:bg-[#03173d] text-slate-800 px-3 py-1.5 rounded-md text-[10px] font-bold flex items-center gap-2 transition-colors"
                        >
                            <RefreshCw className={`w-3 h-3 ${isLoading.token ? 'animate-spin' : ''}`} />
                            Refresh Status
                        </button>
                        <button 
                            onClick={handleReconnect}
                            className="bg-[#16a34a] hover:bg-green-700 text-slate-800 px-3 py-1.5 rounded-md text-[10px] font-bold flex items-center gap-2 transition-colors"
                        >
                            <Activity className="w-3 h-3" />
                            Reconnect
                        </button>
                        <button 
                            onClick={runSync}
                            disabled={syncStatus.isUpdating}
                            className="bg-[#9333ea] hover:bg-purple-700 text-slate-800 px-3 py-1.5 rounded-md text-[10px] font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            <Database className="w-3 h-3" />
                            Sync Scrips
                        </button>
                    </div>
                </div>

                {/* Main Cards Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Angel One API Card */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-wider">Angel One API</h2>
                            <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span className="text-[9px] font-black text-emerald-700 uppercase">Connected</span>
                            </div>
                        </div>
                        
                        <div className="space-y-2.5">
                            {[
                                { label: 'Connection Status', value: connectionStatus, color: connectionStatus === 'Connected' ? 'text-emerald-600' : 'text-rose-600' },
                                { label: 'JWT Token', value: tokens.jwt ? `Valid (${jwtCountdown})` : 'Invalid', color: tokens.jwt ? 'text-emerald-600' : 'text-rose-600' },
                                { label: 'Feed Token', value: tokens.feed ? 'Valid' : 'Invalid', color: tokens.feed ? 'text-emerald-600' : 'text-rose-600' },
                                { label: 'Last Check', value: healthStats.lastCheck || 'Never' },
                                { label: 'Success Rate', value: healthStats.successRate || '0%', color: 'text-emerald-600' },
                                { label: 'Failure Count', value: healthStats.failureCount || '0 / 5' },
                                { label: 'Circuit Breaker', value: healthStats.circuitBreaker || 'Inactive', color: healthStats.circuitBreaker === 'Inactive' ? 'text-emerald-600' : 'text-amber-600' },
                            ].map((row, i) => (
                                <div key={i} className="flex justify-between items-center py-1 border-b border-slate-200 last:border-0">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{row.label}</span>
                                    <span className={`text-[10px] font-black ${row.color || 'text-slate-800'}`}>{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Database Card */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-wider">Database</h2>
                            <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span className="text-[9px] font-black text-emerald-700 uppercase">Connected</span>
                            </div>
                        </div>
                        
                        <div className="space-y-2.5">
                            {[
                                { label: 'Connection Status', value: 'Connected', color: 'text-emerald-600' },
                                { label: 'Angel Scrips Count', value: syncStatus.total?.toLocaleString() || '0', color: 'text-[#011d52]' },
                            ].map((row, i) => (
                                <div key={i} className="flex justify-between items-center py-1 border-b border-slate-200 last:border-0">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{row.label}</span>
                                    <span className={`text-[10px] font-black ${row.color || 'text-slate-800'}`}>{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Activity Log Section */}
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
                    <div className="px-5 py-3 border-b border-slate-200">
                        <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-wider">Activity Log</h2>
                    </div>
                    <div className="p-4 min-h-[300px] max-h-[500px] overflow-y-auto space-y-2 font-mono text-[10px] custom-scrollbar bg-slate-50">
                        {logs.length === 0 && (
                            <p className="text-slate-500 italic">No recent activity detected...</p>
                        )}
                        {logs.map((log, i) => (
                            <div key={i} className="flex gap-4 items-start border-l-2 pl-4 border-slate-200 hover:border-[[#011d52]] transition-colors py-0.5">
                                <span className="text-slate-500 shrink-0 select-none min-w-[80px] font-bold">{log.timestamp}</span>
                                <span className={`flex-1 font-medium ${
                                    log.type === 'error' ? 'text-rose-600' : 
                                    log.type === 'success' ? 'text-emerald-600' : 
                                    'text-[#011d52]'
                                }`}>
                                    {log.message}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f8fafc;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}} />
        </div>
    );
};

export default SystemHealth;
