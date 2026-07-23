import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import policyService from '../../../services/policyService';
import RichTextEditor from '../../../components/common/RichTextEditor';

const PolicyCreate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [form, setForm] = useState({ name: '', title: '', description: '', updates_summary: '', content: '' });
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [version, setVersion] = useState(1);

    useEffect(() => {
        if (isEdit) fetchPolicy();
    }, [id]);

    const fetchPolicy = async () => {
        try {
            const res = await policyService.getPolicyById(id);
            const data = res.data.data;
            setForm({
                name: data.name || '',
                title: data.title || '',
                description: data.description || '',
                updates_summary: '',
                content: data.latest_content?.content || ''
            });
            setVersion(data.latest_content?.version_number || 1);
        } catch (err) {
            console.error(err);
            alert('Failed to load policy.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (isEdit) {
                await policyService.updatePolicy(id, form);
            } else {
                await policyService.createPolicy(form);
            }
            navigate('/admin/policies');
        } catch (err) {
            console.error(err);
            alert('Failed to save: ' + (err.response?.data?.error || err.message));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Loading policy...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-full p-4 flex flex-col gap-4 font-plus-jakarta">
            {/* Page Header */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                    <Link
                        to="/admin/policies"
                        className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div className="min-w-0">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xs font-semibold font-bold text-slate-800 tracking-tight">
                                {isEdit ? 'Edit Policy' : 'Create Policy'}
                            </h1>
                            {isEdit && (
                                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[[#011d52]] bg-[[#011d52]]/10 border border-[[#011d52]]/20 rounded shrink-0">
                                    Draft → v{version + 1}
                                </span>
                            )}
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate mt-0.5">
                            {isEdit ? 'Previous versions are preserved after publishing.' : 'Deploy a new versioned legal policy node.'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
                    <Link
                        to="/admin/policies"
                        className="px-4 py-2 text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-md hover:text-slate-800 transition-colors uppercase tracking-widest"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        form="policyForm"
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2 text-[10px] font-bold text-[slate-50] bg-[#011d52] hover:opacity-90 rounded-md shadow-sm transition-all uppercase tracking-widest disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : (isEdit ? `Publish v${version + 1}` : 'Create Policy')}
                    </button>
                </div>
            </div>

            {/* Form */}
            <form id="policyForm" onSubmit={handleSubmit} className="space-y-6">

                {/* Identity & SEO */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-6">
                    <div className="border-b border-slate-200 pb-4 mb-4">
                        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Identity & SEO</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest">
                                Policy Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text" required
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="e.g. Privacy Policy"
                                className="w-full px-4 py-2.5 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-[[#011d52]] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest">
                                Public Display Title
                            </label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                placeholder="e.g. Our Privacy Promise"
                                className="w-full px-4 py-2.5 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-[[#011d52]] transition-colors"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest">SEO Description</label>
                        <textarea
                            rows="2"
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            placeholder="A short description for search engines..."
                            className="w-full px-4 py-2.5 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-[[#011d52]] transition-colors resize-none"
                        ></textarea>
                    </div>
                </div>

                {/* Version Notes — Edit mode only */}
                {isEdit && (
                    <div className="bg-[[#011d52]]/5 border border-[[#011d52]]/20 rounded-xl p-4 space-y-4">
                        <div className="flex items-center gap-2 mb-2 border-b border-[[#011d52]]/10 pb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[[#011d52]] animate-pulse"></span>
                            <h2 className="text-[10px] font-bold text-[[#011d52]] uppercase tracking-widest">
                                Version {version + 1} — Change Notes
                            </h2>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Summarize what changed so users know what's updated.</p>
                        <textarea
                            rows="3"
                            value={form.updates_summary}
                            onChange={e => setForm({ ...form, updates_summary: e.target.value })}
                            placeholder={"• Updated Section 3 for compliance\n• Clarified refund eligibility"}
                            className="w-full px-4 py-2.5 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-md outline-none focus:border-[[#011d52]] transition-colors resize-none"
                        ></textarea>
                    </div>
                )}

                {/* Content Editor */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-slate-50">
                        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Policy Content</h2>
                        <span className="px-2 py-0.5 text-[10px] font-bold text-slate-500 border border-slate-200 bg-white rounded uppercase tracking-widest">
                            Rich Text Editor
                        </span>
                    </div>
                    <div className="p-4 bg-white">
                        <RichTextEditor
                            value={form.content}
                            onChange={val => setForm({ ...form, content: val })}
                            placeholder="Start writing your policy content..."
                        />
                    </div>
                </div>

            </form>
        </main>
    );
};

export default PolicyCreate;
