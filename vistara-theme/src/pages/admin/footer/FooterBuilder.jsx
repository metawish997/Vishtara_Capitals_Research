import React, { useState, useEffect, useRef } from 'react';
import Sortable from 'sortablejs';
import footerService from '../../../services/footerService';
import { toast } from 'react-hot-toast';

const FooterBuilder = () => {
    const [data, setData] = useState({
        settings: {},
        brand: {},
        socials: [],
        columns: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [modal, setModal] = useState({ open: false, type: '', item: {}, action: 'add' });

    // Refs for Sortables
    const managerColsRef = useRef(null);
    const managerSocialsRef = useRef(null);
    const previewColsRef = useRef(null);
    const previewSocialsRef = useRef(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await footerService.getFullData();
            setData(res.data.data);
        } catch (err) {
            toast.error('Failed to load footer configuration');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (loading) return;

        // Sortable initializations
        if (managerColsRef.current) Sortable.create(managerColsRef.current, { animation: 150, handle: '.drag-handle', onEnd: (evt) => handleReorder('columns', evt) });
        if (managerSocialsRef.current) Sortable.create(managerSocialsRef.current, { animation: 150, handle: '.drag-handle', onEnd: (evt) => handleReorder('socials', evt) });
        if (previewColsRef.current) Sortable.create(previewColsRef.current, { animation: 150, handle: '.drag-handle', onEnd: (evt) => handleReorder('columns', evt) });
        if (previewSocialsRef.current) Sortable.create(previewSocialsRef.current, { animation: 150, handle: '.drag-handle', onEnd: (evt) => handleReorder('socials', evt) });

        data.columns.forEach(col => {
            const el = document.getElementById(`links-preview-${col._id}`);
            if (el) {
                Sortable.create(el, {
                    animation: 150,
                    handle: '.drag-handle',
                    group: 'footer-links',
                    onEnd: (evt) => { if (evt.from === evt.to) handleReorderLinks(col._id, evt); },
                    onAdd: (evt) => handleMoveLink(evt)
                });
            }
        });
    }, [loading, data.columns, data.socials]);

    const handleReorder = async (type, evt) => {
        const list = type === 'columns' ? [...data.columns] : [...data.socials];
        const [movedItem] = list.splice(evt.oldIndex, 1);
        list.splice(evt.newIndex, 0, movedItem);
        setData(prev => ({ ...prev, [type]: list }));
        try {
            const order = list.map(item => item._id);
            if (type === 'columns') await footerService.reorderColumns(order);
            else await footerService.reorderSocials(order);
        } catch (err) { toast.error('Reorder failed'); }
    };

    const handleReorderLinks = async (columnId, evt) => {
        const col = data.columns.find(c => c._id === columnId);
        if (!col) return;
        const newLinks = [...col.links];
        const [movedLink] = newLinks.splice(evt.oldIndex, 1);
        newLinks.splice(evt.newIndex, 0, movedLink);
        setData(prev => ({ ...prev, columns: prev.columns.map(c => c._id === columnId ? { ...c, links: newLinks } : c) }));
        try { await footerService.reorderLinks(newLinks.map(l => l._id)); } catch (err) { toast.error('Link reorder failed'); }
    };

    const handleMoveLink = async (evt) => {
        const linkId = evt.item.getAttribute('data-id');
        const newColumnId = evt.to.getAttribute('data-column-id');
        try { await footerService.moveLink(linkId, newColumnId); fetchData(); } catch (err) { toast.error('Move link failed'); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { type, action, item } = modal;
            if (type === 'settings') {
                // Update both footer settings and brand settings
                await footerService.updateSettings({
                    email: item.email,
                    phone: item.phone,
                    address: item.address,
                    copyright_text: item.copyright_text
                });
                await footerService.updateBrand({
                    title: item.brand_title,
                    subtitle: item.brand_subtitle,
                    description: item.brand_description,
                    icon_svg: item.brand_icon_svg
                });
            }
            else if (type === 'column') {
                if (action === 'edit') await footerService.updateColumn(item._id, item);
                else await footerService.createColumn(item);
            } else if (type === 'link') {
                if (action === 'edit') await footerService.updateLink(item._id, item);
                else await footerService.createLink(item);
            } else if (type === 'social') {
                if (action === 'edit') await footerService.updateSocial(item._id, item);
                else await footerService.createSocial(item);
            }
            toast.success('Updated successfully');
            setModal({ open: false, type: '', item: {} });
            fetchData();
        } catch (err) { toast.error('Update failed'); } finally { setSaving(false); }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            if (type === 'column') await footerService.deleteColumn(id);
            else if (type === 'link') await footerService.deleteLink(id);
            else if (type === 'social') await footerService.deleteSocial(id);
            toast.success('Deleted');
            fetchData();
        } catch (err) { toast.error('Delete failed'); }
    };

    if (loading) return <div className="p-4 text-center text-gray-500 font-semibold animate-pulse">Loading Footer Builder...</div>;

    return (
        <main className="min-h-full p-4 flex flex-col gap-4 font-plus-jakarta">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">Footer Builder</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Design and manage your platform's footer sections</p>
                </div>
            </div>

            {/* 3 COLUMN LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1) FOOTER & BRAND SETTINGS */}
                <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-4">
                    <h3 className="text-[10px] font-bold mb-4 border-b border-slate-200 pb-2 text-slate-500 uppercase tracking-widest">Footer & Brand Settings</h3>
                    <div className="space-y-5">
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Brand Identity</label>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <div className="font-bold text-xs text-slate-800">{data.brand.title || 'No Title'}</div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{data.brand.subtitle || 'No Subtitle'}</div>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Contact Info</label>
                            <div className="text-slate-800 space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200 font-medium">
                                <div className="truncate"><span className="font-bold">Email:</span> {data.settings.email}</div>
                                <div className="truncate"><span className="font-bold">Phone:</span> {data.settings.phone}</div>
                            </div>
                        </div>

                        <button 
                            onClick={() => setModal({ 
                                open: true, 
                                type: 'settings', 
                                item: { 
                                    ...data.settings,
                                    brand_title: data.brand.title,
                                    brand_subtitle: data.brand.subtitle,
                                    brand_description: data.brand.description,
                                    brand_icon_svg: data.brand.icon_svg
                                }, 
                                action: 'edit' 
                            })}
                            className="bg-[#011d52] text-[slate-50] rounded-lg px-4 py-2 w-full text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                        >
                            Update All Settings
                        </button>
                    </div>
                </div>

                {/* 2) FOOTER COLUMNS MANAGER */}
                <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-4">
                    <h3 className="text-[10px] font-bold mb-4 border-b border-slate-200 pb-2 text-slate-500 uppercase tracking-widest">Footer Columns</h3>
                    <button 
                        onClick={() => setModal({ open: true, type: 'column', item: { title: '' }, action: 'add' })}
                        className="bg-[#011d52] text-[slate-50] px-4 py-2 rounded-lg mb-4 text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity w-full"
                    >
                        + Add Column
                    </button>
                    <div ref={managerColsRef} className="space-y-3 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                        {data.columns.map(column => (
                            <div key={column._id} data-id={column._id} className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex items-start justify-between group hover:border-[[#011d52]] transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="drag-handle cursor-move text-slate-500 opacity-50 hover:opacity-100 transition-opacity">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path></svg>
                                    </span>
                                    <div>
                                        <div className="font-bold text-xs cursor-pointer hover:text-[[#011d52]] transition-colors" onClick={() => setModal({ open: true, type: 'column', item: column, action: 'edit' })}>
                                            {column.title}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Nodes: {column.links.length}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => setModal({ open: true, type: 'link', item: { label: '', url: '', footer_column: column._id }, action: 'add' })}
                                        className="text-[[#011d52]] p-1 hover:bg-[[#011d52]]/10 rounded"
                                        title="Add Link"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                                    </button>
                                    <button onClick={() => handleDelete('column', column._id)} className="text-red-500 p-1 hover:bg-red-50 rounded" title="Delete Column">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3) SOCIAL ICONS MANAGER */}
                <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-4">
                    <h3 className="text-[10px] font-bold mb-4 border-b border-slate-200 pb-2 text-slate-500 uppercase tracking-widest">Social Icons</h3>
                    <button 
                        onClick={() => setModal({ open: true, type: 'social', item: { label: '', icon: '', url: '' }, action: 'add' })}
                        className="bg-[#011d52] text-[slate-50] px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity w-full mb-4"
                    >
                        + Add Social Icon
                    </button>
                    <div ref={managerSocialsRef} className="space-y-2 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                        {data.socials.map(s => (
                            <div key={s._id} data-id={s._id} className="border border-slate-200 rounded-lg p-3 flex justify-between items-center bg-slate-50 group hover:border-[[#011d52]] transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="drag-handle cursor-move text-slate-500 opacity-50 hover:opacity-100 transition-opacity">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                                    </span>
                                    <div className="flex items-center gap-3 cursor-pointer hover:text-[[#011d52]] transition-colors" onClick={() => setModal({ open: true, type: 'social', item: s, action: 'edit' })}>
                                        <i className={`${s.icon} text-xs font-semibold w-5 text-center text-slate-500 group-hover:text-[[#011d52]] transition-colors`}></i>
                                        <div className="font-bold text-xs">{s.label}</div>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete('social', s._id)} className="text-red-500 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FOOTER PREVIEW */}
            <div className="mt-8 bg-white shadow-sm rounded-xl p-4 border border-slate-200">
                <h3 className="text-[10px] font-bold mb-6 border-b border-slate-200 pb-2 text-slate-500 uppercase tracking-widest">Footer Preview (Drag & Edit)</h3>

                <div className="border border-slate-200 rounded-xl p-4 mb-8 bg-slate-50">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-[#011d52] rounded-lg flex items-center justify-center text-[slate-50] text-xs font-semibold" dangerouslySetInnerHTML={{ __html: data.brand.icon_svg || '<i class="fas fa-chart-line"></i>' }}></div>
                        <div>
                            <div className="text-xs font-semibold font-bold text-slate-800">{data.brand.title || 'Brand Name'}</div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{data.brand.subtitle || 'Subtitle'}</div>
                        </div>
                    </div>
                    <p className="text-slate-500 text-xs mt-4 font-medium max-w-2xl">{data.brand.description || 'Description goes here...'}</p>
                </div>

                <div ref={previewColsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {data.columns.map(col => (
                        <div key={col._id} data-id={col._id} className="group/col relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="drag-handle cursor-move text-slate-500 opacity-0 group-hover/col:opacity-100 transition-opacity">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path></svg>
                                    </span>
                                    <div className="font-bold text-[10px] uppercase tracking-widest text-slate-800">{col.title}</div>
                                </div>
                                <button onClick={() => setModal({ open: true, type: 'link', item: { label: '', url: '', footer_column: col._id }, action: 'add' })} className="text-[[#011d52]] hover:opacity-80 p-1 opacity-0 group-hover/col:opacity-100 transition-opacity">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                                </button>
                            </div>
                            <ul id={`links-preview-${col._id}`} data-column-id={col._id} className="space-y-3 min-h-[30px]">
                                {col.links.map(link => (
                                    <li key={link._id} data-id={link._id} className="flex items-center justify-between group/link text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="drag-handle cursor-move text-slate-500 opacity-0 group-hover/link:opacity-100 transition-opacity">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                                            </span>
                                            <div className="text-slate-500 font-medium cursor-pointer hover:text-[[#011d52]] transition-colors" onClick={() => setModal({ open: true, type: 'link', item: link, action: 'edit' })}>{link.label}</div>
                                        </div>
                                        <button onClick={() => handleDelete('link', link._id)} className="text-red-500 opacity-0 group-hover/link:opacity-100 p-1 hover:bg-red-50 rounded transition-all">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <div className="space-y-5">
                        <div className="font-bold text-[10px] uppercase tracking-widest text-slate-800 mb-4">Follow Us</div>
                        <div ref={previewSocialsRef} className="flex flex-wrap gap-4">
                            {data.socials.map(s => (
                                <div key={s._id} data-id={s._id} className="relative group/s">
                                    <i className={`${s.icon} text-xs font-semibold cursor-pointer text-slate-500 hover:text-[[#011d52]] transition-colors`} onClick={() => setModal({ open: true, type: 'social', item: s, action: 'edit' })}></i>
                                    <span className="drag-handle cursor-move text-slate-800 absolute -top-3 -right-2 opacity-0 group-hover/s:opacity-100 p-1 bg-slate-50 rounded-full shadow-sm">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path></svg>
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2 text-slate-500 font-medium pt-4 border-t border-slate-200 text-xs">
                            <div className="flex items-center gap-2"><i className="far fa-envelope"></i>{data.settings.email}</div>
                            <div className="flex items-center gap-2"><i className="fas fa-phone-alt"></i>{data.settings.phone}</div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-200 mt-12 pt-6 text-center text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                    <p>{data.settings.copyright_text}</p>
                </div>
            </div>

            {/* MODALS */}
            {modal.open && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4 font-plus-jakarta">
                    <div className="bg-white w-full max-w-lg rounded-xl shadow-xl overflow-hidden border border-slate-200">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                            <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">{modal.action === 'edit' ? 'Update' : 'Add'} {modal.type}</h3>
                            <button onClick={() => setModal({ open: false, type: '', item: {} })} className="text-slate-500 hover:text-slate-800 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-5">
                            {modal.type === 'settings' && (
                                <>
                                    <div className="border-b border-slate-200 pb-2 mb-4 font-bold text-[[#011d52]] uppercase text-[10px] tracking-widest">Brand Identity</div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Brand Name</label>
                                            <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold focus:border-[[#011d52]] outline-none transition-colors" value={modal.item.brand_title || ''} onChange={e => setModal({ ...modal, item: { ...modal.item, brand_title: e.target.value } })} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Subtitle</label>
                                            <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold focus:border-[[#011d52]] outline-none transition-colors" value={modal.item.brand_subtitle || ''} onChange={e => setModal({ ...modal, item: { ...modal.item, brand_subtitle: e.target.value } })} />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 mt-4">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Brand Description</label>
                                        <textarea className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-medium focus:border-[[#011d52]] outline-none transition-colors resize-none" value={modal.item.brand_description || ''} onChange={e => setModal({ ...modal, item: { ...modal.item, brand_description: e.target.value } })} rows={3}></textarea>
                                    </div>
                                    <div className="space-y-1.5 mt-4">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Logo SVG</label>
                                        <textarea className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-[10px] font-mono focus:border-[[#011d52]] outline-none transition-colors resize-none" value={modal.item.brand_icon_svg || ''} onChange={e => setModal({ ...modal, item: { ...modal.item, brand_icon_svg: e.target.value } })} rows={2}></textarea>
                                    </div>

                                    <div className="border-b border-slate-200 pb-2 mb-4 mt-6 font-bold text-[[#011d52]] uppercase text-[10px] tracking-widest">Footer Contact Info</div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email</label>
                                            <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold focus:border-[[#011d52]] outline-none transition-colors" value={modal.item.email || ''} onChange={e => setModal({ ...modal, item: { ...modal.item, email: e.target.value } })} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Phone</label>
                                            <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold focus:border-[[#011d52]] outline-none transition-colors" value={modal.item.phone || ''} onChange={e => setModal({ ...modal, item: { ...modal.item, phone: e.target.value } })} />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 mt-4">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Copyright Text</label>
                                        <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold focus:border-[[#011d52]] outline-none transition-colors" value={modal.item.copyright_text || ''} onChange={e => setModal({ ...modal, item: { ...modal.item, copyright_text: e.target.value } })} />
                                    </div>
                                </>
                            )}

                            {modal.type === 'column' && (
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Column Title</label>
                                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold focus:border-[[#011d52]] outline-none transition-colors" value={modal.item.title || ''} onChange={e => setModal({ ...modal, item: { ...modal.item, title: e.target.value } })} />
                                </div>
                            )}

                            {modal.type === 'link' && (
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Display Label</label>
                                        <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold focus:border-[[#011d52]] outline-none transition-colors" value={modal.item.label || ''} onChange={e => setModal({ ...modal, item: { ...modal.item, label: e.target.value } })} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">URL / Route</label>
                                        <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold focus:border-[[#011d52]] outline-none transition-colors" value={modal.item.url || ''} onChange={e => setModal({ ...modal, item: { ...modal.item, url: e.target.value } })} />
                                    </div>
                                </div>
                            )}

                            {modal.type === 'social' && (
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Label</label>
                                        <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold focus:border-[[#011d52]] outline-none transition-colors" value={modal.item.label || ''} onChange={e => setModal({ ...modal, item: { ...modal.item, label: e.target.value } })} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Icon Class</label>
                                        <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold focus:border-[[#011d52]] outline-none transition-colors" value={modal.item.icon || ''} onChange={e => setModal({ ...modal, item: { ...modal.item, icon: e.target.value } })} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">URL</label>
                                        <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold focus:border-[[#011d52]] outline-none transition-colors" value={modal.item.url || ''} onChange={e => setModal({ ...modal, item: { ...modal.item, url: e.target.value } })} />
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 flex gap-3">
                                <button type="button" onClick={() => setModal({ open: false, type: '', item: {} })} className="flex-1 py-2.5 rounded-lg font-bold text-slate-500 bg-slate-50 border border-slate-200 hover:text-slate-800 transition-colors uppercase tracking-widest text-[10px]">Cancel</button>
                                <button type="submit" disabled={saving} className="flex-[2] bg-[#011d52] text-[slate-50] py-2.5 rounded-lg font-bold uppercase tracking-widest hover:opacity-90 disabled:opacity-50 text-[10px]">
                                    {saving ? 'Saving...' : 'Apply Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default FooterBuilder;
