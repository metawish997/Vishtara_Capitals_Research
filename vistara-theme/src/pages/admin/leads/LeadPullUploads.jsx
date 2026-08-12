import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import leadImportService from '../../../services/leadImportService';
import leadService from '../../../services/leadService';
import toast from 'react-hot-toast';
import {
    Upload, FileText, Users, CheckCircle2, XCircle, AlertTriangle,
    Search, Eye, Edit2, UserPlus, ChevronLeft, ChevronRight, X,
    Download, ArrowLeft, Info, Loader2, Filter
} from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import { isAdminUser } from '../../../utils/rbac';

// ─── Utility ─────────────────────────────────────────────────────────────────
const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

// ─── Steps definition ─────────────────────────────────────────────────────────
const STEPS = ['Select File', 'Preview', 'Processing', 'Result'];

// ─── Main Component ───────────────────────────────────────────────────────────
const LeadPullUploads = () => {
    const { user } = useAuth();
    const isAdmin = isAdminUser(user);
    const navigate = useNavigate();

    // Tab state
    const [activeTab, setActiveTab] = useState('history'); // 'history' | 'unassigned'

    // ── History Tab ────────────────────────────────────────────────────────────
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [historyPagination, setHistoryPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
    const [summaryRecord, setSummaryRecord] = useState(null);
    const [showSummaryModal, setShowSummaryModal] = useState(false);

    // ── Upload Modal ───────────────────────────────────────────────────────────
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadStep, setUploadStep] = useState(0); // 0=select,1=preview,2=confirm,3=result
    const [dragOver, setDragOver] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewRows, setPreviewRows] = useState([]);
    const [importing, setImporting] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const [importJobId, setImportJobId] = useState(null);
    const [importProgress, setImportProgress] = useState(0);
    const fileInputRef = useRef(null);

    // ── Unassigned Tab ─────────────────────────────────────────────────────────
    const [unassigned, setUnassigned] = useState([]);
    const [unassignedLoading, setUnassignedLoading] = useState(false);
    const [unassignedPagination, setUnassignedPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
    const [uSearch, setUSearch] = useState('');
    const [uFilters, setUFilters] = useState({ leadSource: 'All', leadCategory: 'All', status: 'All', startDate: '', endDate: '' });
    const [meta, setMeta] = useState({ sources: [], categories: [], statuses: [], employees: [] });

    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const filterRef = useRef(null);

    const activeFiltersCount = [
        uFilters.leadCategory !== 'All',
        uFilters.leadSource !== 'All',
        uFilters.status !== 'All',
        uFilters.startDate !== '',
        uFilters.endDate !== ''
    ].filter(Boolean).length;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowAdvancedFilters(false);
            }
        };
        if (showAdvancedFilters) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showAdvancedFilters]);

    // ── Assign Owner Modal ─────────────────────────────────────────────────────
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [assigningLead, setAssigningLead] = useState(null);
    const [selectedOwner, setSelectedOwner] = useState('');
    const [assignLoading, setAssignLoading] = useState(false);

    // ── Bulk Actions State (Unassigned Tab) ────────────────────────────────────
    const [selectedLeads, setSelectedLeads] = useState([]);
    const [bulkOwnerId, setBulkOwnerId] = useState('');
    const [bulkAssigning, setBulkAssigning] = useState(false);

    // ─────────────────────────────────────────────────────────────────────────
    // Data fetchers
    // ─────────────────────────────────────────────────────────────────────────
    const fetchHistory = useCallback(async () => {
        setHistoryLoading(true);
        try {
            const res = await leadImportService.getHistory({ page: historyPagination.page, limit: historyPagination.limit });
            if (res.success) {
                setHistory(res.data);
                setHistoryPagination(p => ({ ...p, total: res.pagination.total, pages: res.pagination.pages }));
            }
        } catch {
            toast.error('Failed to load import history');
        } finally {
            setHistoryLoading(false);
        }
    }, [historyPagination.page, historyPagination.limit]);

    const fetchHistorySilent = useCallback(async () => {
        try {
            const res = await leadImportService.getHistory({ page: historyPagination.page, limit: historyPagination.limit });
            if (res.success) {
                setHistory(res.data);
                setHistoryPagination(p => ({ ...p, total: res.pagination.total, pages: res.pagination.pages }));
            }
        } catch { }
    }, [historyPagination.page, historyPagination.limit]);

    // Background polling for History table
    useEffect(() => {
        let interval;
        const isProcessing = history.some(rec => rec.status === 'Processing');
        if (isProcessing) {
            interval = setInterval(() => {
                fetchHistorySilent();
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [history, fetchHistorySilent]);

    const fetchUnassigned = useCallback(async () => {
        setUnassignedLoading(true);
        try {
            const params = {
                page: unassignedPagination.page,
                limit: unassignedPagination.limit,
                search: uSearch,
                ...uFilters
            };
            const res = await leadImportService.getUnassigned(params);
            if (res.success) {
                setUnassigned(res.data);
                setUnassignedPagination(p => ({ ...p, total: res.pagination.total, pages: res.pagination.pages }));
            }
        } catch {
            toast.error('Failed to load unassigned leads');
        } finally {
            setUnassignedLoading(false);
            setSelectedLeads([]); // Clear selection when data changes
        }
    }, [unassignedPagination.page, unassignedPagination.limit, uSearch, uFilters]);

    const fetchMeta = useCallback(async () => {
        try {
            const res = await leadService.getMetadata();
            if (res.success) setMeta(res.data);
        } catch { /* silently fail */ }
    }, []);

    useEffect(() => { fetchHistory(); }, [fetchHistory]);
    useEffect(() => { fetchMeta(); }, [fetchMeta]);
    useEffect(() => { if (activeTab === 'unassigned') fetchUnassigned(); }, [activeTab, fetchUnassigned]);

    // ─────────────────────────────────────────────────────────────────────────
    // File handling
    // ─────────────────────────────────────────────────────────────────────────
    const ALLOWED_EXTS = ['csv', 'xlsx', 'xls'];
    const XLSX_MIME = [
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/octet-stream'
    ];

    const validateFile = (file) => {
        const ext = file.name.toLowerCase().split('.').pop();
        if (!ALLOWED_EXTS.includes(ext)) {
            toast.error('Only CSV, XLSX, and XLS files are accepted.');
            return false;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File exceeds 10 MB limit.');
            return false;
        }
        return true;
    };

    const readFilePreview = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    // Read as text for CSV; for xlsx we still use text to get header line preview
                    const text = e.target.result;
                    const lines = text.split(/\r?\n/).filter(l => l.trim());
                    if (lines.length === 0) { resolve([]); return; }

                    // Detect separator (comma or semicolon)
                    const header = lines[0];
                    const sep = header.includes(',') ? ',' : ';';
                    const headers = header.split(sep).map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());

                    const rows = [];
                    for (let i = 1; i < Math.min(lines.length, 11); i++) {
                        const vals = lines[i].split(sep).map(v => v.trim().replace(/^"|"$/g, ''));
                        const row = {};
                        headers.forEach((h, idx) => { row[h] = vals[idx] || ''; });
                        rows.push(row);
                    }
                    resolve(rows);
                } catch {
                    resolve([]);
                }
            };
            reader.readAsText(file);
        });
    };

    const handleFileDrop = async (file) => {
        if (!validateFile(file)) return;
        setSelectedFile(file);
        const ext = file.name.toLowerCase().split('.').pop();
        let rows = [];
        if (ext === 'csv') {
            rows = await readFilePreview(file);
        } else {
            // For xlsx we can't parse in browser without importing xlsx lib
            // Show placeholder preview note
            rows = [{ note: 'Preview not available for Excel files — click Confirm to proceed with import.' }];
        }
        setPreviewRows(rows);
        setUploadStep(1);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileDrop(file);
    };

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        if (file) handleFileDrop(file);
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Import execution
    // ─────────────────────────────────────────────────────────────────────────
    const pollProgress = useCallback((jobId) => {
        const interval = setInterval(async () => {
            try {
                const res = await leadImportService.getImportProgress(jobId);
                if (res.success) {
                    setImportProgress(res.data.progress);
                    if (res.data.status === 'Completed' || res.data.status === 'Failed') {
                        clearInterval(interval);
                        setImporting(false);
                        if (res.data.status === 'Completed') {
                            setImportResult(res.data);
                            setUploadStep(3);
                            fetchHistorySilent();
                            toast.success(`Import complete!`);
                        } else {
                            toast.error('Import failed during processing.');
                            setUploadStep(1);
                        }
                    }
                }
            } catch (err) {
                console.error("Error polling progress", err);
            }
        }, 2000);
    }, [fetchHistorySilent]);

    const handleImport = async () => {
        if (!selectedFile) return;
        setImporting(true);
        setImportProgress(0);
        setUploadStep(2);
        const formData = new FormData();
        formData.append('file', selectedFile);
        try {
            const res = await leadImportService.uploadLeads(formData);
            if (res.success && res.jobId) {
                setImportJobId(res.jobId);
                toast.success('Upload started in background. You can safely close this modal.');
                pollProgress(res.jobId);
                fetchHistorySilent(); // Refresh history immediately so processing row appears
            } else if (res.success && res.data) {
                // Fallback for old synchronous behavior
                setImportResult(res.data);
                setUploadStep(3);
                fetchHistorySilent();
                toast.success(`Import complete!`);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Import failed. Please check the file format.');
            setUploadStep(1);
            setImporting(false);
        }
    };

    const resetUploadModal = () => {
        setShowUploadModal(false);
        setUploadStep(0);
        setSelectedFile(null);
        setPreviewRows([]);
        setImportResult(null);
        setImporting(false);
        setImportJobId(null);
        setImportProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Assign owner
    // ─────────────────────────────────────────────────────────────────────────
    const openAssignModal = (lead) => {
        setAssigningLead(lead);
        setSelectedOwner('');
        setShowAssignModal(true);
    };

    const handleAssignOwner = async () => {
        if (!selectedOwner) { toast.error('Please select an employee.'); return; }
        setAssignLoading(true);
        try {
            const res = await leadImportService.assignOwner(assigningLead._id, selectedOwner);
            if (res.success) {
                toast.success('Owner assigned successfully.');
                setShowAssignModal(false);
                fetchUnassigned();
            }
        } catch {
            toast.error('Failed to assign owner.');
        } finally {
            setAssignLoading(false);
        }
    };

    // ─── Bulk Assign ─────────────────────────────────────────────────────────────
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedLeads(unassigned.map(l => l._id));
        } else {
            setSelectedLeads([]);
        }
    };

    const handleSelectLead = (id) => {
        setSelectedLeads(prev => 
            prev.includes(id) ? prev.filter(lId => lId !== id) : [...prev, id]
        );
    };

    const handleBulkAssign = async () => {
        if (!bulkOwnerId) {
            toast.error('Please select an owner to assign.');
            return;
        }
        if (selectedLeads.length === 0) {
            toast.error('No leads selected.');
            return;
        }
        setBulkAssigning(true);
        try {
            const res = await leadService.bulkAssignOwner(selectedLeads, bulkOwnerId);
            if (res.success) {
                toast.success(res.message || 'Leads assigned successfully.');
                setSelectedLeads([]);
                setBulkOwnerId('');
                fetchUnassigned();
            }
        } catch (err) {
            toast.error('Failed to assign leads.');
        } finally {
            setBulkAssigning(false);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // View Summary
    // ─────────────────────────────────────────────────────────────────────────
    const handleViewSummary = async (record) => {
        try {
            const res = await leadImportService.getImportById(record._id);
            if (res.success) {
                setSummaryRecord(res.data);
                setShowSummaryModal(true);
            }
        } catch {
            toast.error('Failed to load import summary.');
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Render helpers
    // ─────────────────────────────────────────────────────────────────────────
    const Tabs = () => (
        <div className="flex justify-between items-center bg-white border border-slate-200 rounded-[4px] p-1 mb-2">
            <div className="flex gap-1">
                {[
                    { key: 'history', label: 'Import History', icon: FileText },
                    { key: 'unassigned', label: 'Unassigned Leads', icon: Users }
                ].map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-[3px] text-[9px] font-black uppercase tracking-wider transition-all ${activeTab === key
                            ? 'bg-[[#011d52]] text-[#020210]'
                            : 'text-slate-500 hover:text-slate-800'
                            }`}
                    >
                        <Icon className="w-3 h-3" /> {label}
                    </button>
                ))}
            </div>
            
            <div className="flex items-center gap-2 pr-1 z-50">
                {activeTab === 'unassigned' && (
                    <div ref={filterRef} className="relative flex items-center gap-2 shrink-0">
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={() => setUFilters({ leadSource: 'All', leadCategory: 'All', status: 'All', startDate: '', endDate: '' })}
                                className="flex items-center justify-center w-6 h-6 rounded-[4px] text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all border border-slate-200 hover:border-rose-500/30"
                                title="Clear Filters"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                        <button
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-[9px] font-bold uppercase tracking-wider transition-all border ${showAdvancedFilters ? 'bg-[[#011d52]]/10 text-[[#011d52]] border-[[#011d52]]/30' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-200/10'}`}
                        >
                            <Filter className="w-3 h-3" />
                            Filters
                            {activeFiltersCount > 0 && (
                                <span className="ml-0.5 bg-[[#011d52]] text-[#020210] px-1.5 py-0.5 rounded-full text-[8px] font-black leading-none">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>

                        {showAdvancedFilters && (
                            <div className="absolute top-[calc(100%+8px)] right-0 w-[280px] bg-white border border-slate-200 rounded-[6px] shadow-2xl p-4 z-50 flex flex-col gap-3">
                                <div>
                                    <label className="block text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                                    <select value={uFilters.leadCategory} onChange={(e) => setUFilters(p => ({ ...p, leadCategory: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-[4px] px-3 py-1.5 text-[10px] font-bold text-slate-800 outline-none cursor-pointer focus:border-[[#011d52]]">
                                        <option value="All">All Categories</option>
                                        {meta.categories.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1.5">Source</label>
                                    <select value={uFilters.leadSource} onChange={(e) => setUFilters(p => ({ ...p, leadSource: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-[4px] px-3 py-1.5 text-[10px] font-bold text-slate-800 outline-none cursor-pointer focus:border-[[#011d52]]">
                                        <option value="All">All Sources</option>
                                        {meta.sources.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                                    <select value={uFilters.status} onChange={(e) => setUFilters(p => ({ ...p, status: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-[4px] px-3 py-1.5 text-[10px] font-bold text-slate-800 outline-none cursor-pointer focus:border-[[#011d52]]">
                                        <option value="All">All Statuses</option>
                                        {meta.statuses.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="block text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1.5 ml-0.5">Start Date</label>
                                        <input
                                            type="date"
                                            value={uFilters.startDate}
                                            onChange={(e) => setUFilters(p => ({ ...p, startDate: e.target.value }))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-[4px] px-2 py-1.5 text-[9px] font-bold text-slate-800 outline-none focus:border-[[#011d52]]"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1.5 ml-0.5">End Date</label>
                                        <input
                                            type="date"
                                            value={uFilters.endDate}
                                            onChange={(e) => setUFilters(p => ({ ...p, endDate: e.target.value }))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-[4px] px-2 py-1.5 text-[9px] font-bold text-slate-800 outline-none focus:border-[[#011d52]]"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                <button
                    onClick={() => { setShowUploadModal(true); setUploadStep(0); }}
                    className="inline-flex items-center gap-1.5 bg-[[#011d52]] hover:opacity-90 text-[#020210] px-3 py-1.5 rounded-[4px] font-black text-[9px] uppercase tracking-widest transition-all active:scale-95 shadow-sm"
                >
                    <Upload className="w-3.5 h-3.5" /> Upload Leads
                </button>
            </div>
        </div>
    );

    // ─── History Table ────────────────────────────────────────────────────────
    const HistoryTab = () => (
        <div className="bg-white border border-slate-200 rounded-[4px] shadow-sm overflow-hidden">
            {/* Table Header with Limit Selector */}
            <div className="px-4 py-3 bg-slate-50/20 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Import History</h3>
                <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Rows per page:</span>
                    <select
                        value={historyPagination.limit}
                        onChange={(e) => setHistoryPagination(p => ({ ...p, limit: Number(e.target.value), page: 1 }))}
                        className="bg-slate-50 border border-slate-200 text-[9px] font-bold text-slate-800 rounded-[4px] px-2 py-1 outline-none focus:border-[[#011d52]] transition-all cursor-pointer"
                    >
                        <option value={10}>10</option>
                        <option value={30}>30</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/40 border-b border-slate-200">
                            {['File Name', 'Total Rows', 'Imported', 'Duplicates', 'Failed', 'Unassigned', 'Uploaded By', 'Status', 'Date'].map(h => (
                                <th key={h} className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[slate-200]/30">
                        {historyLoading ? (
                            <tr><td colSpan={9} className="px-6 py-12 text-center">
                                <div className="w-6 h-6 border-2 border-[[#011d52]]/20 border-t-[[#011d52]] rounded-full animate-spin mx-auto mb-2" />
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Loading import history...</span>
                            </td></tr>
                        ) : history.length === 0 ? (
                            <tr><td colSpan={9} className="px-6 py-16 text-center">
                                <Upload className="w-8 h-8 text-slate-500/30 mx-auto mb-3" />
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">No imports yet. Click "Upload Leads" to start.</p>
                            </td></tr>
                        ) : history.map(rec => (
                            <tr key={rec._id} className="hover:bg-[[#011d52]]/5 transition-colors group">
                                <td className="px-4 py-3 font-bold text-slate-800 max-w-[180px]">
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <FileText className="w-3.5 h-3.5 text-[[#011d52]]  flex-shrink-0" />
                                        <span className="truncate text-[9px]"
                                            onClick={() => handleViewSummary(rec)}>{rec.fileName}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-black text-slate-800 text-[10px]">{rec.totalRows}</td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-0.5 rounded font-black text-[7px] tracking-wider uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">{rec.importedRows}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-0.5 rounded font-black text-[7px] tracking-wider uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20">{rec.duplicateRows}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-0.5 rounded font-black text-[7px] tracking-wider uppercase bg-rose-500/10 text-rose-500 border border-rose-500/20">{rec.failedRows}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-0.5 rounded font-black text-[7px] tracking-wider uppercase bg-blue-500/10 text-blue-500 border border-blue-500/20">{rec.unassignedRows}</span>
                                </td>
                                <td className="px-4 py-3 text-[9px] font-bold text-slate-500">
                                    {rec.uploadedBy ? `${rec.uploadedBy.firstName} ${rec.uploadedBy.lastName}` : 'System'}
                                </td>
                                <td className="px-4 py-3">
                                    {rec.status === 'Processing' ? (
                                        <div className="flex flex-col gap-1 w-20">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[7px] font-black uppercase text-blue-500 tracking-wider animate-pulse">Processing</span>
                                                <span className="text-[7px] font-black text-slate-500">{rec.progress || 0}%</span>
                                            </div>
                                            <div className="w-full bg-[slate-200] rounded-full h-1 overflow-hidden">
                                                <div className="bg-blue-500 h-1 rounded-full transition-all duration-500" style={{ width: `${rec.progress || 0}%` }}></div>
                                            </div>
                                        </div>
                                    ) : rec.status === 'Failed' ? (
                                        <span className="px-2 py-0.5 rounded font-black text-[7px] tracking-wider uppercase bg-rose-500/10 text-rose-500 border border-rose-500/20">Failed</span>
                                    ) : (
                                        <span className="px-2 py-0.5 rounded font-black text-[7px] tracking-wider uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Completed</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-[9px] font-bold text-slate-500 whitespace-nowrap">{fmtDate(rec.createdAt)}</td>

                                {/* Hide the view summary */}
                                {/* <td className="px-4 py-3">
                                    <button
                                        onClick={() => handleViewSummary(rec)}
                                        className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200 hover:bg-[[#011d52]]/10 hover:text-[[#011d52]] rounded text-[8px] font-black uppercase tracking-wider transition-all"
                                    >
                                        <Eye className="w-3 h-3" /> View Summary
                                    </button>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div className="px-4 py-3 bg-slate-50/20 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">
                    {historyPagination.total} total imports
                </span>
                <div className="flex gap-1">
                    <button disabled={historyPagination.page <= 1} onClick={() => setHistoryPagination(p => ({ ...p, page: p.page - 1 }))}
                        className="px-3 py-1 bg-slate-50 border border-slate-200 hover:bg-[slate-200]/15 disabled:opacity-30 rounded-[4px] font-bold text-[9px] transition-all flex items-center gap-1">
                        <ChevronLeft className="w-3 h-3" /> Prev
                    </button>
                    <button disabled={historyPagination.page >= historyPagination.pages} onClick={() => setHistoryPagination(p => ({ ...p, page: p.page + 1 }))}
                        className="px-3 py-1 bg-slate-50 border border-slate-200 hover:bg-[slate-200]/15 disabled:opacity-30 rounded-[4px] font-bold text-[9px] transition-all flex items-center gap-1">
                        Next <ChevronRight className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </div>
    );

    // ─── Unassigned Tab ───────────────────────────────────────────────────────
    const UnassignedTab = () => (
        <div className="space-y-4">


            {/* Bulk Actions Panel */}
            {isAdmin && selectedLeads.length > 0 && (
                <div className="bg-[[#011d52]]/10 border border-[[#011d52]]/20 rounded-[4px] p-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-[[#011d52]] uppercase tracking-wider bg-[[#011d52]]/20 px-2 py-1 rounded">
                            {selectedLeads.length} leads selected
                        </span>
                        <div className="h-4 w-[1px] bg-[[#011d52]]/30"></div>
                        <select
                            value={bulkOwnerId}
                            onChange={(e) => setBulkOwnerId(e.target.value)}
                            className="bg-slate-50 border border-[[#011d52]]/30 rounded-[4px] px-3 py-1.5 text-[9px] font-bold text-slate-800 outline-none cursor-pointer focus:border-[[#011d52]]"
                        >
                            <option value="">Select New Owner</option>
                            {meta.employees.map(emp => (
                                <option key={emp._id} value={emp._id}>{emp.firstName} {emp.lastName}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleBulkAssign}
                            disabled={bulkAssigning || !bulkOwnerId}
                            className="bg-[[#011d52]] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-[#020210] px-4 py-1.5 rounded-[4px] font-black text-[9px] uppercase tracking-wider transition-all flex items-center gap-1"
                        >
                            {bulkAssigning ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-[#020210]/20 border-t-[#020210] rounded-full animate-spin"></div>
                                    Assigning...
                                </>
                            ) : (
                                <>Assign to Owner</>
                            )}
                        </button>
                    </div>
                    <button 
                        onClick={() => setSelectedLeads([])}
                        className="text-slate-500 hover:text-slate-800 text-[9px] font-bold uppercase tracking-wider transition-colors"
                    >
                        Clear Selection
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-[4px] shadow-sm overflow-hidden">
                {/* Table Header with Limit Selector */}
                <div className="px-4 py-3 bg-slate-50/20 border-b border-slate-200 flex justify-between items-center gap-4">
                    <div className="flex-1 max-w-[240px] relative flex items-center">
                        <Search className="absolute left-3 w-3.5 h-3.5 text-slate-500" />
                        <input
                            type="text"
                            value={uSearch}
                            onChange={(e) => setUSearch(e.target.value)}
                            placeholder="Search leads..."
                            className="w-full bg-white border border-slate-200 rounded-[4px] pl-9 pr-3 py-1.5 text-[9px] font-bold text-slate-800 outline-none focus:border-[[#011d52]] transition-all placeholder-[slate-500]/50 shadow-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Rows per page:</span>
                        <select
                            value={unassignedPagination.limit}
                            onChange={(e) => setUnassignedPagination(p => ({ ...p, limit: Number(e.target.value), page: 1 }))}
                            className="bg-white border border-slate-200 text-[9px] font-bold text-slate-800 rounded-[4px] px-2 py-1 outline-none focus:border-[[#011d52]] transition-all cursor-pointer shadow-sm"
                        >
                            <option value={10}>10</option>
                            <option value={30}>30</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/40 border-b border-slate-200">
                                {isAdmin && (
                                    <th className="px-4 py-3 w-10 text-center">
                                        <input 
                                            type="checkbox"
                                            checked={unassigned.length > 0 && selectedLeads.length === unassigned.length}
                                            onChange={handleSelectAll}
                                            className="w-3.5 h-3.5 accent-[[#011d52]] cursor-pointer rounded-sm"
                                        />
                                    </th>
                                )}
                                {['Lead Code', 'Full Name', 'Phone', 'Email', 'Source', 'Category', 'Status', 'Created Date', 'Actions'].map(h => (
                                    <th key={h} className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[slate-200]/30">
                            {unassignedLoading ? (
                                <tr><td colSpan={10} className="px-6 py-12 text-center">
                                    <div className="w-6 h-6 border-2 border-[[#011d52]]/20 border-t-[[#011d52]] rounded-full animate-spin mx-auto mb-2" />
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Loading unassigned leads...</span>
                                </td></tr>
                            ) : unassigned.length === 0 ? (
                                <tr><td colSpan={10} className="px-6 py-16 text-center">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-500/50 mx-auto mb-3" />
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">All leads are assigned. No unassigned leads found.</p>
                                </td></tr>
                            ) : unassigned.map(lead => (
                                <tr key={lead._id} className={`hover:bg-[[#011d52]]/5 transition-colors group ${selectedLeads.includes(lead._id) ? 'bg-[[#011d52]]/5' : ''}`}>
                                    {isAdmin && (
                                        <td className="px-4 py-3 w-10 text-center align-middle">
                                            <input 
                                                type="checkbox"
                                                checked={selectedLeads.includes(lead._id)}
                                                onChange={() => handleSelectLead(lead._id)}
                                                className="w-3.5 h-3.5 accent-[[#011d52]] cursor-pointer rounded-sm"
                                            />
                                        </td>
                                    )}
                                    <td className="px-4 py-3 font-extrabold text-[[#011d52]] text-[10px] tracking-tight uppercase cursor-pointer"
                                        onClick={() => navigate(`/admin/leads/${lead._id}`)}>
                                        {lead.leadCode}
                                    </td>
                                    <td className="px-4 py-3 font-black text-slate-800 text-[10px] uppercase">{lead.fullName}</td>
                                    <td className="px-4 py-3 text-[9px] font-bold text-slate-500">📞 {lead.mobileNumber}</td>
                                    <td className="px-4 py-3 text-[9px] font-bold text-slate-500">{lead.email || <span className="opacity-30 italic">—</span>}</td>
                                    <td className="px-4 py-3 text-[9px] font-bold text-slate-800 uppercase">{lead.leadSource?.name || <span className="opacity-30 italic">None</span>}</td>
                                    <td className="px-4 py-3">
                                        {lead.leadCategory ? (
                                            <span className="px-2 py-0.5 rounded font-black text-[7px] tracking-wider uppercase border"
                                                style={{ color: lead.leadCategory.color, borderColor: `${lead.leadCategory.color}25`, backgroundColor: `${lead.leadCategory.color}0D` }}>
                                                {lead.leadCategory.name}
                                            </span>
                                        ) : <span className="text-slate-500/30 italic text-[9px]">—</span>}
                                    </td>
                                    <td className="px-4 py-3">
                                        {lead.status ? (
                                            <span className="px-2 py-0.5 rounded font-black text-[7px] tracking-wider uppercase border"
                                                style={{ color: lead.status.color, borderColor: `${lead.status.color}25`, backgroundColor: `${lead.status.color}0D` }}>
                                                {lead.status.name}
                                            </span>
                                        ) : <span className="opacity-30 italic text-[9px]">—</span>}
                                    </td>
                                    <td className="px-4 py-3 text-[9px] font-bold text-slate-500 whitespace-nowrap">{fmtDate(lead.createdAt)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            {isAdmin && (
                                                <button onClick={() => openAssignModal(lead)} title="Assign Owner"
                                                    className="w-6 h-6 flex items-center justify-center bg-[[#011d52]]/10 hover:bg-[[#011d52]]/20 text-[[#011d52]] rounded border border-[[#011d52]]/20 transition-all">
                                                    <UserPlus className="w-3 h-3" />
                                                </button>
                                            )}
                                            {/* <button onClick={() => navigate(`/admin/leads/${lead._id}`)} title="View Lead"
                                                className="w-6 h-6 flex items-center justify-center bg-slate-50 hover:bg-[[#011d52]]/10 hover:text-[[#011d52]] rounded border border-slate-200 transition-all">
                                                <Eye className="w-3 h-3" />
                                            </button> */}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="px-4 py-3 bg-slate-50/20 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">
                        Showing {unassignedPagination.total === 0 ? 0 : (unassignedPagination.page - 1) * unassignedPagination.limit + 1} - {Math.min(unassignedPagination.page * unassignedPagination.limit, unassignedPagination.total)} of {unassignedPagination.total} unassigned
                    </span>
                    <div className="flex gap-1">
                        <button disabled={unassignedPagination.page <= 1} onClick={() => setUnassignedPagination(p => ({ ...p, page: p.page - 1 }))}
                            className="px-3 py-1 bg-slate-50 border border-slate-200 hover:bg-[slate-200]/15 disabled:opacity-30 rounded-[4px] font-bold text-[9px] transition-all flex items-center gap-1">
                            <ChevronLeft className="w-3 h-3" /> Prev
                        </button>
                        <button disabled={unassignedPagination.page >= unassignedPagination.pages} onClick={() => setUnassignedPagination(p => ({ ...p, page: p.page + 1 }))}
                            className="px-3 py-1 bg-slate-50 border border-slate-200 hover:bg-[slate-200]/15 disabled:opacity-30 rounded-[4px] font-bold text-[9px] transition-all flex items-center gap-1">
                            Next <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // ─── Upload Modal ─────────────────────────────────────────────────────────
    const UploadModal = () => {
        const isXlsx = selectedFile && ['xlsx', 'xls'].includes(selectedFile.name.toLowerCase().split('.').pop());
        const previewHeaders = previewRows.length > 0 && !previewRows[0].note
            ? Object.keys(previewRows[0])
            : [];

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50/80 backdrop-blur-[3px] animate-in fade-in duration-200">
                <div className="bg-white border border-slate-200 rounded-[4px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                    {/* Modal Header */}
                    <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/30">
                        <div>
                            <h3 className="text-xs font-black text-slate-800 tracking-tight uppercase">
                                {uploadStep === 3 ? '✅ Import Complete' : uploadStep === 2 && importing ? '⏳ Processing in Background...' : 'Upload Leads File'}
                            </h3>
                            {uploadStep < 3 && (
                                <div className="flex items-center gap-2 mt-2">
                                    {STEPS.map((s, i) => (
                                        <React.Fragment key={s}>
                                            <span className={`text-[7px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${i === uploadStep ? 'bg-[[#011d52]] text-[#020210]' :
                                                i < uploadStep ? 'bg-emerald-500/15 text-emerald-500' :
                                                    'bg-slate-50 text-slate-500 border border-slate-200'
                                                }`}>{i + 1}. {s}</span>
                                            {i < STEPS.length - 1 && <span className="text-[slate-200] text-xs">›</span>}
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button onClick={resetUploadModal}
                            className="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 rounded-[4px] text-slate-500 hover:text-slate-800 transition-all">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="p-4 max-h-[75vh] overflow-y-auto">

                        {/* ── Step 0: Drag & Drop ── */}
                        {uploadStep === 0 && (
                            <div className="space-y-4">
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-[4px] p-12 text-center cursor-pointer transition-all duration-200 ${dragOver
                                        ? 'border-[[#011d52]] bg-[[#011d52]]/5 scale-[1.01]'
                                        : 'border-slate-200 hover:border-[[#011d52]]/50 hover:bg-[[#011d52]]/3'
                                        }`}
                                >
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 transition-all ${dragOver ? 'bg-[[#011d52]]/20' : 'bg-slate-50'} border border-slate-200`}>
                                        <Upload className={`w-6 h-6 ${dragOver ? 'text-[[#011d52]]' : 'text-slate-500'}`} />
                                    </div>
                                    <p className="font-black text-slate-800 text-xs uppercase tracking-tight mb-1">
                                        {dragOver ? 'Drop your file here' : 'Drag & Drop your file here'}
                                    </p>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-4">or click to browse</p>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[[#011d52]] text-[#020210] rounded font-black text-[8px] uppercase tracking-widest">
                                        <Download className="w-3 h-3" /> Browse File
                                    </span>
                                    <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileInput} />
                                </div>

                                <div className="bg-slate-50/50 border border-slate-200 rounded-[4px] p-4 space-y-2">
                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider mb-2">📋 Expected CSV Format</p>
                                    <code className="block text-[9px] font-mono text-[[#011d52]] bg-slate-50 border border-slate-200 rounded p-2 whitespace-pre">
                                        {`name,phone,email,owner,source,category
John Doe,9876543210,john@example.com,Rahul Kumar,Website,Hot Lead
Jane Smith,9876543211,,, Referral,Warm Lead`}
                                    </code>
                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                        {[
                                            ['name', 'Full Name (optional)'],
                                            ['phone', '📌 Phone (REQUIRED)'],
                                            ['email', 'Email (optional)'],
                                            ['owner', 'Owner Full Name (optional)'],
                                            ['source', 'Lead Source (auto-created)'],
                                            ['category', 'Lead Category (auto-created)']
                                        ].map(([col, desc]) => (
                                            <div key={col} className="text-[7px] font-bold">
                                                <span className="text-[[#011d52]] font-black">{col}</span>
                                                <span className="text-slate-500 ml-1">→ {desc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Step 1: Preview ── */}
                        {uploadStep === 1 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-[4px]">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-[9px] font-black text-slate-800 uppercase tracking-wider">{selectedFile?.name}</p>
                                        <p className="text-[7px] font-bold text-slate-500">
                                            {(selectedFile?.size / 1024).toFixed(1)} KB · {isXlsx ? 'Excel file — full preview on server' : 'CSV file — showing first 10 rows'}
                                        </p>
                                    </div>
                                </div>

                                {isXlsx ? (
                                    <div className="p-4 text-center border border-slate-200 rounded-[4px] bg-slate-50/30">
                                        <Info className="w-8 h-8 text-[[#011d52]]/50 mx-auto mb-2" />
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">
                                            Excel file selected. Preview will be processed server-side.<br />
                                            Click "Confirm Import" to proceed.
                                        </p>
                                    </div>
                                ) : previewRows.length > 0 ? (
                                    <div className="overflow-x-auto border border-slate-200 rounded-[4px]">
                                        <table className="w-full text-left border-collapse text-[9px]">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-200">
                                                    <th className="px-3 py-2 font-black text-slate-500 uppercase tracking-wider">#</th>
                                                    {['name', 'phone', 'email', 'owner', 'source', 'category'].map(h => (
                                                        <th key={h} className="px-3 py-2 font-black text-slate-500 uppercase tracking-wider">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[slate-200]/30">
                                                {previewRows.map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-[[#011d52]]/5">
                                                        <td className="px-3 py-2 font-black text-slate-500">{idx + 2}</td>
                                                        {['name', 'phone', 'email', 'owner', 'source', 'category'].map(col => (
                                                            <td key={col} className={`px-3 py-2 font-bold ${col === 'phone' && !row[col] ? 'text-rose-500' : 'text-slate-800'}`}>
                                                                {row[col] || <span className="opacity-30 italic">—</span>}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-center text-[9px] text-slate-500 py-6">No rows could be previewed.</p>
                                )}

                                <div className="flex justify-between gap-3 pt-2 border-t border-slate-200">
                                    <button onClick={() => { setUploadStep(0); setSelectedFile(null); setPreviewRows([]); }}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-500 rounded-[4px] font-black text-[9px] uppercase tracking-wider">
                                        <ArrowLeft className="w-3 h-3" /> Change File
                                    </button>
                                    <button onClick={() => setUploadStep(2)}
                                        className="flex items-center gap-1.5 px-5 py-2 bg-[[#011d52]] text-[#020210] rounded-[4px] font-black text-[9px] uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all">
                                        Confirm Import →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Step 2: Confirm ── */}
                        {uploadStep === 2 && (
                            <div className="space-y-6 text-center py-8">
                                {importing ? (
                                    <>
                                        <div className="w-16 h-16 border-4 border-[[#011d52]]/20 border-t-[[#011d52]] rounded-full animate-spin mx-auto" />
                                        <div className="mt-4">
                                            <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-tight">Processing Import... {importProgress}%</h4>
                                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1 mb-3">
                                                You can safely close this modal and continue your work.
                                            </p>
                                            <div className="w-full max-w-sm mx-auto bg-slate-50 border border-slate-200 rounded-full h-2 overflow-hidden">
                                                <div className="bg-[[#011d52]] h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${importProgress}%` }}></div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-4 border border-slate-200 rounded-[4px] bg-slate-50/30 text-left space-y-3">
                                            <p className="font-black text-slate-800 uppercase tracking-tight text-xs">Ready to Import</p>
                                            <div className="space-y-2 text-[9px] font-bold text-slate-500">
                                                <div className="flex justify-between"><span>File:</span><span className="text-slate-800">{selectedFile?.name}</span></div>
                                                <div className="flex justify-between"><span>Size:</span><span className="text-slate-800">{(selectedFile?.size / 1024).toFixed(1)} KB</span></div>
                                                <div className="flex justify-between"><span>Phone column:</span><span className="text-emerald-500">Required — rows without phone will be skipped</span></div>
                                                <div className="flex justify-between"><span>Duplicates:</span><span className="text-amber-500">Detected by phone number — will be skipped</span></div>
                                                <div className="flex justify-between"><span>Sources/Categories:</span><span className="text-blue-400">Auto-created if not found</span></div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 justify-between">
                                            <button onClick={() => setUploadStep(1)}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-500 rounded-[4px] font-black text-[9px] uppercase tracking-wider">
                                                <ArrowLeft className="w-3 h-3" /> Back
                                            </button>
                                            <button onClick={handleImport}
                                                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-[[#011d52]] text-[#020210] rounded-[4px] font-black text-[9px] uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all">
                                                <Upload className="w-3.5 h-3.5" /> Start Import
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* ── Step 3: Result ── */}
                        {uploadStep === 3 && importResult && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {[
                                        { label: 'Total Rows', value: importResult.totalRows, color: 'text-slate-800', bg: 'bg-slate-50' },
                                        { label: 'Imported', value: importResult.importedRows, color: 'text-emerald-500', bg: 'bg-emerald-500/5 border-emerald-500/20' },
                                        { label: 'Duplicates', value: importResult.duplicateRows, color: 'text-amber-500', bg: 'bg-amber-500/5 border-amber-500/20' },
                                        { label: 'Failed', value: importResult.failedRows, color: 'text-rose-500', bg: 'bg-rose-500/5 border-rose-500/20' },
                                        { label: 'Unassigned', value: importResult.unassignedRows, color: 'text-blue-400', bg: 'bg-blue-400/5 border-blue-400/20' },
                                    ].map(({ label, value, color, bg }) => (
                                        <div key={label} className={`p-3 rounded-[4px] border ${bg} border-slate-200`}>
                                            <span className="block text-[7px] font-black text-slate-500 uppercase tracking-wider mb-1">{label}</span>
                                            <span className={`text-xs font-semibold font-black ${color}`}>{value}</span>
                                        </div>
                                    ))}
                                </div>

                                {importResult.warnings?.length > 0 && (
                                    <div className="border border-amber-500/20 rounded-[4px] overflow-hidden">
                                        <div className="bg-amber-500/10 px-4 py-2 flex items-center gap-2">
                                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                                            <span className="text-[8px] font-black text-amber-500 uppercase tracking-wider">{importResult.warnings.length} Warnings</span>
                                        </div>
                                        <div className="max-h-40 overflow-y-auto divide-y divide-[slate-200]/30">
                                            {importResult.warnings.map((w, i) => (
                                                <div key={i} className="px-4 py-2 text-[8px] font-bold text-slate-500">
                                                    {w}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button onClick={resetUploadModal}
                                        className="flex-1 py-2.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-[4px] font-black text-[9px] uppercase tracking-wider hover:bg-[slate-200]/10 transition-all">
                                        Close
                                    </button>
                                    {importResult.unassignedRows > 0 && (
                                        <button onClick={() => { resetUploadModal(); setActiveTab('unassigned'); }}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[[#011d52]]/10 border border-[[#011d52]]/20 text-[[#011d52]] rounded-[4px] font-black text-[9px] uppercase tracking-wider hover:bg-[[#011d52]]/15 transition-all">
                                            <Users className="w-3.5 h-3.5" /> View Unassigned Leads
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // ─── Summary Modal ────────────────────────────────────────────────────────
    const SummaryModal = () => {
        if (!summaryRecord) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50/80 backdrop-blur-[3px] animate-in fade-in duration-200">
                <div className="bg-white border border-slate-200 rounded-[4px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                        <div>
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">Import Summary</h3>
                            <p className="text-[8px] font-bold text-slate-500 mt-0.5 uppercase tracking-wider">{summaryRecord.fileName}</p>
                        </div>
                        <button onClick={() => setShowSummaryModal(false)}
                            className="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 rounded-[4px] text-slate-500 hover:text-slate-800 transition-all">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: 'Total Rows', value: summaryRecord.totalRows, cls: '' },
                                { label: 'Imported', value: summaryRecord.importedRows, cls: 'text-emerald-500' },
                                { label: 'Duplicates', value: summaryRecord.duplicateRows, cls: 'text-amber-500' },
                                { label: 'Failed', value: summaryRecord.failedRows, cls: 'text-rose-500' },
                                { label: 'Unassigned', value: summaryRecord.unassignedRows, cls: 'text-blue-400' },
                            ].map(({ label, value, cls }) => (
                                <div key={label} className="bg-slate-50 border border-slate-200 rounded-[4px] p-3">
                                    <span className="block text-[7px] font-black text-slate-500 uppercase tracking-wider mb-1">{label}</span>
                                    <span className={`text-xs font-semibold font-black ${cls || 'text-slate-800'}`}>{value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="text-[8px] font-bold text-slate-500 space-y-1 pt-2 border-t border-slate-200">
                            <div className="flex justify-between"><span>Uploaded By:</span><span className="text-slate-800">{summaryRecord.uploadedBy ? `${summaryRecord.uploadedBy.firstName} ${summaryRecord.uploadedBy.lastName}` : 'System'}</span></div>
                            <div className="flex justify-between"><span>Date:</span><span className="text-slate-800">{fmt(summaryRecord.createdAt)}</span></div>
                        </div>
                        {summaryRecord.warnings?.length > 0 && (
                            <div className="border border-amber-500/20 rounded-[4px] overflow-hidden">
                                <div className="bg-amber-500/10 px-4 py-2 flex items-center gap-2">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                                    <span className="text-[8px] font-black text-amber-500 uppercase tracking-wider">{summaryRecord.warnings.length} Warnings</span>
                                </div>
                                <div className="max-h-40 overflow-y-auto divide-y divide-[slate-200]/30">
                                    {summaryRecord.warnings.map((w, i) => (
                                        <div key={i} className="px-4 py-2 text-[8px] font-bold text-slate-500">{w}</div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // ─── Assign Owner Modal ───────────────────────────────────────────────────
    const AssignModal = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50/80 backdrop-blur-[3px] animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200 rounded-[4px] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <div>
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">Assign Lead Owner</h3>
                        <p className="text-[8px] font-bold text-slate-500 mt-0.5 uppercase">{assigningLead?.fullName} · {assigningLead?.leadCode}</p>
                    </div>
                    <button onClick={() => setShowAssignModal(false)}
                        className="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 rounded-[4px] text-slate-500 hover:text-slate-800 transition-all">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="p-4 space-y-4">
                    <div>
                        <label className="block text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1.5">Select Employee *</label>
                        <select value={selectedOwner} onChange={(e) => setSelectedOwner(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-[4px] px-4 py-2 text-[10px] font-bold text-slate-800 outline-none cursor-pointer focus:border-[[#011d52]] transition-all">
                            <option value="">— Select Employee —</option>
                            {meta.employees.map(emp => (
                                <option key={emp._id} value={emp._id}>{emp.firstName} {emp.lastName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-3 pt-2 border-t border-slate-200">
                        <button onClick={() => setShowAssignModal(false)}
                            className="flex-1 py-2 bg-slate-50 border border-slate-200 text-slate-500 rounded-[4px] font-black text-[9px] uppercase tracking-wider">
                            Cancel
                        </button>
                        <button onClick={handleAssignOwner} disabled={assignLoading || !selectedOwner}
                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-[[#011d52]] text-[#020210] rounded-[4px] font-black text-[9px] uppercase tracking-wider disabled:opacity-50 hover:opacity-90 active:scale-95 transition-all">
                            {assignLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                            Assign Owner
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // ─── Final render ─────────────────────────────────────────────────────────
    return (
        <div className="w-full space-y-4 text-[10px] font-sans pb-10">
            <Tabs />
            {activeTab === 'history' ? <HistoryTab /> : <UnassignedTab />}

            {showUploadModal && <UploadModal />}
            {showSummaryModal && summaryRecord && <SummaryModal />}
            {showAssignModal && assigningLead && <AssignModal />}
        </div>
    );
};

export default LeadPullUploads;
