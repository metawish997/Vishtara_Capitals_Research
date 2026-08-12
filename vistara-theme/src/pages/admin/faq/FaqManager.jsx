import React, { useState, useEffect } from 'react';
import faqService from '../../../services/faqService';
import toast from 'react-hot-toast';

const FaqManager = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedPage, setSelectedPage] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [useCustomPage, setUseCustomPage] = useState(false);
    const [repeaterFaqs, setRepeaterFaqs] = useState([{ question: '', answer: '' }]);
    const [form, setForm] = useState({
        page_type: 'home',
        sort_order: 0,
        status: 1
    });

    const pages = ['home', 'about', 'service', 'contact', 'blog'];

    const fetchFaqs = async () => {
        try {
            setLoading(true);
            const res = await faqService.getFaqs();
            setFaqs(res.data);
        } catch (error) {
            toast.error('Failed to load FAQs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const handleOpenModal = (faq = null) => {
        if (faq) {
            setEditingFaq(faq);
            setForm({ page_type: faq.page_type, sort_order: faq.sort_order, status: faq.status });
            setRepeaterFaqs([{ question: faq.question, answer: faq.answer }]);
            setUseCustomPage(!pages.includes(faq.page_type));
        } else {
            setEditingFaq(null);
            setForm({ page_type: 'home', sort_order: 0, status: 1 });
            setRepeaterFaqs([{ question: '', answer: '' }]);
            setUseCustomPage(false);
        }
        setShowModal(true);
    };

    const addRepeaterField = () => setRepeaterFaqs([...repeaterFaqs, { question: '', answer: '' }]);
    const removeRepeaterField = (index) => setRepeaterFaqs(repeaterFaqs.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingFaq) {
                await faqService.updateFaq(editingFaq._id, {
                    ...form,
                    question: repeaterFaqs[0].question,
                    answer: repeaterFaqs[0].answer
                });
                toast.success('FAQ updated');
            } else {
                // If repeater has multiple, the backend current model handles one by one or needs bulk.
                // Based on controller, it's one by one. I'll loop for creation.
                await Promise.all(repeaterFaqs.map(rf => 
                    faqService.createFaq({ ...form, ...rf })
                ));
                toast.success('FAQs deployed successfully');
            }
            setShowModal(false);
            fetchFaqs();
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const confirmDelete = (id) => {
        setDeletingId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            await faqService.deleteFaq(deletingId);
            toast.success('FAQ erased');
            setShowDeleteModal(false);
            fetchFaqs();
        } catch (error) {
            toast.error('Erase failed');
        }
    };

    const filteredFaqs = selectedPage === 'all' ? faqs : faqs.filter(f => f.page_type === selectedPage);

    return (
        <main className="min-h-full p-4 flex flex-col gap-4 font-plus-jakarta">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">FAQ Intelligence</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Dynamic knowledge base management system.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                
                {/* LEFT SIDEBAR: Page Categories */}
                <div className="xl:col-span-3">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 h-fit">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Page Context</h3>
                        <div className="space-y-1">
                            <button 
                                onClick={() => setSelectedPage('all')}
                                className={`w-full text-left px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${selectedPage === 'all' ? 'bg-[#011D52] text-slate-50 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
                                All Registry
                            </button>
                            {pages.map(page => (
                                <button 
                                    key={page}
                                    onClick={() => setSelectedPage(page)}
                                    className={`w-full text-left px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${selectedPage === page ? 'bg-[#011D52] text-slate-50 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
                                    {page}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="xl:col-span-9 space-y-4">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-2">
                        <div>
                        </div>
                        <button 
                            onClick={() => handleOpenModal()}
                            className="bg-[#011d52] text-slate-50 px-4 py-2 rounded-md font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-colors shadow-sm whitespace-nowrap self-start sm:self-auto flex items-center justify-center">
                            + Deploy FAQ
                        </button>
                    </div>

                    {/* Table Card */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Context & Question</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Priority</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                     {loading ? (
                                         <tr><td colSpan="4" className="text-center py-10 text-[10px] font-bold text-slate-500 uppercase tracking-widest">SYNCING BRAIN...</td></tr>
                                     ) : filteredFaqs.length === 0 ? (
                                         <tr><td colSpan="4" className="text-center py-10 text-[10px] font-bold text-slate-500 uppercase tracking-widest">No FAQs found.</td></tr>
                                     ) : filteredFaqs.map((faq) => (
                                         <tr key={faq._id} className="hover:bg-slate-50 transition-colors group">
                                             <td className="px-6 py-4 max-w-md">
                                                 <span className="text-[9px] font-bold text-[#011D52] uppercase tracking-widest bg-[#011D52]/10 px-2 py-0.5 rounded border border-[#011D52]/20 mb-1.5 inline-block">{faq.page_type}</span>
                                                 <p className="text-xs font-bold text-slate-800">{faq.question}</p>
                                                 <p className="text-xs text-slate-500 mt-1 font-medium line-clamp-1 italic">"{faq.answer}"</p>
                                             </td>
                                             <td className="px-6 py-4">
                                                 <span className={`px-2 py-0.5 rounded border text-[10px] font-bold tracking-widest uppercase ${faq.status ? 'bg-[#011D52]/10 text-[#011D52] border-[#011D52]/20' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                                     {faq.status ? 'Active' : 'Archived'}
                                                 </span>
                                             </td>
                                             <td className="px-6 py-4">
                                                 <span className="text-xs font-bold text-slate-800 font-mono">#{faq.sort_order}</span>
                                             </td>
                                             <td className="px-6 py-4 text-right">
                                                 <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                     <button onClick={() => handleOpenModal(faq)} className="p-1.5 text-slate-500 hover:text-slate-800 transition-colors">
                                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                     </button>
                                                     <button onClick={() => confirmDelete(faq._id)} className="p-1.5 text-slate-500 hover:text-red-500 transition-colors">
                                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                     </button>
                                                 </div>
                                             </td>
                                         </tr>
                                     ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        
                        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="text-xs font-semibold font-bold text-slate-800">{editingFaq ? 'Modify FAQ Entry' : 'New Context Registry'}</h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Website Knowledge Base</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-800 transition-colors p-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                
                                {/* Page Selection */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Target Page Context</label>
                                    <div className="flex gap-4 mb-3">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input type="radio" checked={!useCustomPage} onChange={() => setUseCustomPage(false)} className="accent-[#011D52]" />
                                            <span className="text-xs font-bold text-slate-500 group-hover:text-slate-800 transition-colors">Predefined Page</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input type="radio" checked={useCustomPage} onChange={() => setUseCustomPage(true)} className="accent-[#011D52]" />
                                            <span className="text-xs font-bold text-slate-500 group-hover:text-slate-800 transition-colors">Custom Type</span>
                                        </label>
                                    </div>

                                    {!useCustomPage ? (
                                        <select 
                                            value={form.page_type} 
                                            onChange={(e) => setForm({...form, page_type: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-md outline-none focus:border-[#011D52] transition-colors text-xs text-slate-800">
                                            {pages.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                                        </select>
                                    ) : (
                                        <input 
                                            value={form.page_type} 
                                            onChange={(e) => setForm({...form, page_type: e.target.value})}
                                            placeholder="Enter custom context name..."
                                            className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-md outline-none focus:border-[#011D52] transition-colors text-xs text-slate-800"
                                        />
                                    )}
                                </div>

                                {/* Repeater Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                                        <label className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Knowledge Units</label>
                                        {!editingFaq && (
                                            <button type="button" onClick={addRepeaterField} className="text-[10px] font-bold text-slate-800 uppercase tracking-widest hover:opacity-80 transition-opacity flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                                                <span>+</span> Add Another
                                            </button>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {repeaterFaqs.map((rf, index) => (
                                            <div key={index} className="bg-slate-50 rounded-md p-4 border border-slate-200 space-y-4 relative group">
                                                {repeaterFaqs.length > 1 && (
                                                    <button type="button" onClick={() => removeRepeaterField(index)} className="absolute top-2 right-2 text-slate-500 hover:text-red-500 transition-colors p-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                )}
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Question</label>
                                                    <input 
                                                        value={rf.question} 
                                                        onChange={(e) => {
                                                            const newR = [...repeaterFaqs];
                                                            newR[index].question = e.target.value;
                                                            setRepeaterFaqs(newR);
                                                        }}
                                                        className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-md text-xs text-slate-800 outline-none focus:border-[#011D52] transition-colors" 
                                                        required 
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Answer Detail</label>
                                                    <textarea 
                                                        rows="3"
                                                        value={rf.answer} 
                                                        onChange={(e) => {
                                                            const newR = [...repeaterFaqs];
                                                            newR[index].answer = e.target.value;
                                                            setRepeaterFaqs(newR);
                                                        }}
                                                        className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-md text-xs text-slate-800 outline-none focus:border-[#011D52] transition-colors resize-none" 
                                                        required 
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order & Status */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Sort Priority</label>
                                        <input type="number" value={form.sort_order} onChange={(e) => setForm({...form, sort_order: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-md outline-none focus:border-[#011D52] transition-colors font-mono font-bold text-xs text-slate-800" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Publication Status</label>
                                        <select value={form.status} onChange={(e) => setForm({...form, status: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-md outline-none focus:border-[#011D52] transition-colors text-xs text-slate-800">
                                            <option value={1}>ACTIVE / PUBLISHED</option>
                                            <option value={0}>DRAFT / ARCHIVED</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3 justify-end border-t border-slate-200 mt-6">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-[10px] font-bold text-slate-500 hover:text-slate-800 uppercase tracking-widest transition-colors">Discard</button>
                                    <button type="submit" className="bg-[#011d52] text-slate-50 px-6 py-2 rounded-md font-bold text-[10px] uppercase tracking-widest shadow-sm hover:opacity-90 transition-all flex items-center justify-center">
                                        {editingFaq ? 'Commit Updates' : 'Deploy Knowledge'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl p-4 max-w-sm w-full text-center shadow-xl border border-slate-200 animate-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </div>
                        <h3 className="text-xs font-semibold font-bold text-slate-800 mb-1">Erase FAQ?</h3>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-6">This action is permanent and will remove the context from the public website.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-500 rounded-md font-bold text-[10px] uppercase tracking-widest hover:text-slate-800 transition-colors">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 text-slate-800 rounded-md font-bold text-[10px] uppercase tracking-widest shadow-sm hover:bg-red-700 transition-colors">Erase Now</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default FaqManager;
