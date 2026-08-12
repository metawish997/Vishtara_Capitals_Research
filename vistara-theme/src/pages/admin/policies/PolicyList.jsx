import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import policyService from '../../../services/policyService';

// ── Preview Modal CSS ────────────────────────────────────────────────────────
const previewCSS = `
    .pc-preview { font-family:'Inter',sans-serif;color:#475569;line-height:1.8; }
    .pc-preview h1 { font-size:1.75rem;font-weight:800;color:#0f172a;margin:1.75rem 0 1rem; }
    .pc-preview h2 { font-size:1.375rem;font-weight:800;color:#1e293b;margin:1.5rem 0 0.75rem;padding-bottom:0.5rem;border-bottom:1px solid #f1f5f9; }
    .pc-preview h3 { font-size:1.125rem;font-weight:700;color:#334155;margin:1.25rem 0 0.625rem; }
    .pc-preview h4 { font-size:1rem;font-weight:700;color:#475569;margin:1rem 0 0.5rem; }
    .pc-preview p  { margin-bottom:1.125rem;font-size:0.9375rem; }
    .pc-preview ul { list-style:disc;padding-left:1.5rem;margin-bottom:1.125rem; }
    .pc-preview ol { list-style:decimal;padding-left:1.5rem;margin-bottom:1.125rem; }
    .pc-preview li { margin-bottom:0.4rem; }
    .pc-preview strong,.pc-preview b { font-weight:700;color:#1e293b; }
    .pc-preview em,.pc-preview i { font-style:italic; }
    .pc-preview table { width:100%;border-collapse:collapse;margin:1.5rem 0;font-size:0.875rem; }
    .pc-preview th { background:#f8fafc;padding:0.625rem 1rem;font-weight:700;color:#475569;border:1px solid #e2e8f0;text-align:left; }
    .pc-preview td { padding:0.625rem 1rem;border:1px solid #e2e8f0;color:#64748b; }
    .pc-preview img { max-width:100%;height:auto;border-radius:0.75rem;margin:1.25rem 0; }
    .pc-preview blockquote { border-left:3px solid #6366f1;padding-left:1.25rem;color:#64748b;font-style:italic;margin:1.25rem 0; }
    .pc-preview a { color:#6366f1;text-decoration:underline; }
`;

// ── Preview Modal (via Portal → document.body) ───────────────────────────────
const PreviewModal = ({ policy, onClose }) => {
    if (!policy) return null;
    return createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <style>{previewCSS}</style>
            {/* Backdrop */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
            {/* Card */}
            <div style={{ position: 'relative', zIndex: 10, background: '#fff', borderRadius: '1rem', boxShadow: '0 25px 60px rgba(0,0,0,0.2)', width: '100%', maxWidth: '52rem', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
                    <div style={{ minWidth: 0 }}>
                        <h2 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{policy.title || policy.name}</h2>
                        <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.125rem' }}>
                            Version v{policy.latest_content?.version_number || '1'}
                            {policy.latest_content?.createdAt && (
                                <> &middot; {new Date(policy.latest_content.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</>
                            )}
                        </p>
                    </div>
                    <button onClick={onClose} style={{ width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem', border: 'none', background: '#f1f5f9', cursor: 'pointer', color: '#64748b', flexShrink: 0, marginLeft: '1rem' }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                    {policy.description && (
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9', fontStyle: 'italic' }}>
                            {policy.description}
                        </p>
                    )}
                    {policy.latest_content?.content ? (
                        <div className="pc-preview" dangerouslySetInnerHTML={{ __html: policy.latest_content.content }} />
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8', fontSize: '0.875rem' }}>
                            No content available for this policy.
                        </div>
                    )}
                </div>
                {/* Footer */}
                <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', padding: '0.875rem 1.5rem', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                    <Link
                        to={`/admin/policies/edit/${policy._id}`}
                        onClick={onClose}
                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.7rem', fontWeight: 700, color: '#4f46e5', background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '0.625rem', textDecoration: 'none' }}
                    >
                        Edit Policy
                    </Link>
                    <button onClick={onClose} style={{ padding: '0.5rem 1.25rem', fontSize: '0.7rem', fontWeight: 700, color: '#475569', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.625rem', cursor: 'pointer' }}>
                        Close
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

// ── Main List Component ──────────────────────────────────────────────────────
const PolicyList = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [preview, setPreview] = useState(null);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => { fetchPolicies(); }, []);

    const fetchPolicies = async () => {
        try {
            setLoading(true);
            const res = await policyService.getPolicies();
            setPolicies(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch policies:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this policy and all its versions permanently?')) return;
        setDeleting(id);
        try {
            await policyService.deletePolicy(id);
            setPolicies(prev => prev.filter(p => p._id !== id));
            if (preview?._id === id) setPreview(null);
        } catch (err) {
            alert('Failed to delete policy.');
        } finally {
            setDeleting(null);
        }
    };

    return (
        <main className="min-h-full p-4 flex flex-col gap-4 font-plus-jakarta">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">Policy Master</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Manage versioned legal policies and agreements.</p>
                </div>
                <Link
                    to="/admin/policies/create"
                    className="bg-[#011d52] text-[slate-50] px-4 py-2 rounded-md font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-colors shadow-sm whitespace-nowrap self-start sm:self-auto flex items-center justify-center gap-1.5"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                    New Policy
                </Link>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Loading policies...</p>
                    </div>
                ) : policies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                        <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mb-2">
                            <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-slate-800 font-bold text-xs">No policies yet</p>
                            <p className="text-slate-500 text-xs mt-1">Create your first policy to get started.</p>
                        </div>
                        <Link to="/admin/policies/create" className="text-[10px] font-bold text-[[#011d52]] hover:opacity-80 transition-opacity mt-2 uppercase tracking-widest">
                            + Create Policy
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">#</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Policy Name</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden md:table-cell">Display Title</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Version</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden lg:table-cell">Updated</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[slate-200]">
                                {policies.map((policy, idx) => (
                                    <tr key={policy._id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 text-xs text-slate-500 font-bold">{idx + 1}</td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-bold text-slate-800">{policy.name}</p>
                                            {policy.description && (
                                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 hidden sm:block italic font-medium">"{policy.description}"</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <p className="text-xs text-slate-500 font-medium">{policy.title || '—'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-[[#011d52]] bg-[[#011d52]]/10 text-[10px] font-bold text-[[#011d52]] uppercase tracking-widest">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[[#011d52]]"></span>
                                                v{policy.latest_content?.version_number || '1'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500 font-medium hidden lg:table-cell">
                                            {policy.latest_content?.createdAt
                                                ? new Date(policy.latest_content.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                                                : '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {/* Preview */}
                                                <button
                                                    onClick={() => setPreview(policy)}
                                                    className="px-2.5 py-1 text-[10px] font-bold text-slate-500 border border-slate-200 bg-slate-50 hover:text-slate-800 hover:border-[slate-800] rounded-md transition-all uppercase tracking-widest"
                                                    title="Preview"
                                                >
                                                    Preview
                                                </button>
                                                {/* Edit */}
                                                <Link
                                                    to={`/admin/policies/edit/${policy._id}`}
                                                    className="p-1.5 text-slate-500 hover:text-slate-800 transition-colors"
                                                    title="Edit"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </Link>
                                                {/* Delete */}
                                                <button
                                                    onClick={() => handleDelete(policy._id)}
                                                    disabled={deleting === policy._id}
                                                    className="p-1.5 text-slate-500 hover:text-red-500 transition-colors disabled:opacity-50"
                                                    title="Delete"
                                                >
                                                    {deleting === policy._id ? (
                                                        <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Portal Preview Modal */}
            <PreviewModal policy={preview} onClose={() => setPreview(null)} />
        </main>
    );
};

export default PolicyList;
