import React, { useState, useEffect, useRef } from 'react';
import Sortable from 'sortablejs';
import headerService from '../../../services/headerService';

const HeaderBuilder = () => {
    const [settings, setSettings] = useState({
        website_name: '',
        logo_svg: '',
        button_text: '',
        button_link: '',
        button_active: false
    });
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [modal, setModal] = useState({ open: false, isEdit: false, item: null });

    const sortableRef = useRef(null);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (!loading && sortableRef.current) {
            Sortable.create(sortableRef.current, {
                handle: '.drag-handle',
                animation: 150,
                ghostClass: 'bg-indigo-50',
                onEnd: async (evt) => {
                    const newMenus = [...menus];
                    const [movedItem] = newMenus.splice(evt.oldIndex, 1);
                    newMenus.splice(evt.newIndex, 0, movedItem);
                    setMenus(newMenus);

                    try {
                        const orderArray = newMenus.map(m => m._id);
                        await headerService.reorderMenus(orderArray);
                    } catch (err) {
                        console.error('Reorder failed', err);
                    }
                }
            });
        }
    }, [loading, menus]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [settRes, menuRes] = await Promise.all([
                headerService.getSettings(),
                headerService.getMenus()
            ]);
            setSettings(settRes.data.data || settings);
            setMenus(menuRes.data.data || []);
        } catch (err) {
            console.error('Failed to fetch header data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await headerService.updateSettings(settings);
            alert('Settings updated successfully!');
        } catch (err) {
            alert('Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleVisibility = async (id) => {
        try {
            await headerService.toggleMenu(id);
            setMenus(menus.map(m => m._id === id ? { ...m, show_in_header: !m.show_in_header } : m));
        } catch (err) {
            alert('Failed to toggle visibility');
        }
    };

    const handleDeleteMenu = async (id) => {
        if (!window.confirm('Delete this menu item?')) return;
        try {
            await headerService.deleteMenu(id);
            setMenus(menus.filter(m => m._id !== id));
        } catch (err) {
            alert('Failed to delete item');
        }
    };

    const openModal = (item = null) => {
        setModal({
            open: true,
            isEdit: !!item,
            item: item || { title: '', slug: '', link: '', show_in_header: true }
        });
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modal.isEdit) {
                await headerService.updateMenu(modal.item._id, modal.item);
            } else {
                // Calculate next order_no
                const nextOrder = menus.length > 0 ? Math.max(...menus.map(m => m.order_no || 0)) + 1 : 1;
                await headerService.createMenu({ ...modal.item, order_no: nextOrder });
            }
            setModal({ ...modal, open: false });
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Failed to save menu item: ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <main className="min-h-full p-4 flex flex-col gap-4 font-plus-jakarta">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">Header Architect</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Design and manage your platform's navigation and identity</p>
                </div>
            </div>

            {/* LIVE PREVIEW SECTION */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-100">
                    <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Live Preview
                    </h2>
                </div>
                <div className="p-4">
                    <header className="w-full bg-white border border-slate-200 rounded-md flex items-center justify-between px-6 py-4">
                        {/* Logo & Name */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 text-[#011d52] flex items-center justify-center"
                                dangerouslySetInnerHTML={{ __html: settings.logo_svg || '<svg viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>' }}>
                            </div>
                            <span className="font-bold text-slate-800 text-xs tracking-tight">
                                {settings.website_name || 'The Rapid Investors'}
                            </span>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            {menus.filter(m => m.show_in_header).slice(0, 5).map(m => (
                                <a key={m._id} href={m.link} className="text-[11px] font-bold text-slate-500 hover:text-slate-800 uppercase tracking-widest transition-colors relative group">
                                    {m.title}
                                    <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-[#011d52] transition-all group-hover:w-full"></span>
                                </a>
                            ))}
                            {menus.filter(m => m.show_in_header).length > 5 && (
                                <button className="text-[11px] font-bold text-slate-500 hover:text-slate-800 uppercase tracking-widest">More ▾</button>
                            )}
                        </nav>

                        {/* CTA */}
                        <div className="flex items-center gap-4">
                            <button onClick={() => openModal()} className="p-1.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-md hover:text-slate-800 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                            {settings.button_active && (
                                <a href={settings.button_link} className="bg-[#011d52] text-white text-[10px] font-bold px-4 py-1.5 rounded-md hover:bg-[#02143a] transition-colors uppercase tracking-widest">
                                    {settings.button_text || 'Sign In'}
                                </a>
                            )}
                        </div>
                    </header>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                {/* LEFT: SETTINGS */}
                <div className="xl:col-span-5">
                    <form onSubmit={handleSaveSettings} className="bg-white rounded-xl border border-slate-200 overflow-hidden h-full flex flex-col">
                        <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Brand Settings</h3>
                            <button
                                type="submit"
                                disabled={saving}
                                className="text-[9px] font-bold text-white uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-opacity bg-[#011d52] px-3 py-1.5 rounded-md"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>

                        <div className="p-4 space-y-4 flex-1">
                            <div>
                                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Website Name</label>
                                <input
                                    type="text"
                                    value={settings.website_name}
                                    onChange={e => setSettings({ ...settings, website_name: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-semibold text-slate-800 outline-none focus:border-[#011d52] transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Logo SVG Content</label>
                                <textarea
                                    rows="4"
                                    value={settings.logo_svg}
                                    onChange={e => setSettings({ ...settings, logo_svg: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-mono text-slate-500 outline-none focus:border-[#011d52] transition-colors resize-none"
                                    placeholder="<svg>...</svg>"
                                />
                            </div>

                            <div className="border-t border-slate-100 pt-4 mt-2">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">CTA Button Status</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.button_active}
                                            onChange={e => setSettings({ ...settings, button_active: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-checked:bg-[#011d52] peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
                                    </label>
                                </div>

                                <div className={`space-y-4 transition-all duration-300 ${settings.button_active ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                                    <div>
                                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Button Text</label>
                                        <input
                                            type="text"
                                            value={settings.button_text}
                                            onChange={e => setSettings({ ...settings, button_text: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-semibold text-slate-800 outline-none focus:border-[#011d52] transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Button Link</label>
                                        <input
                                            type="text"
                                            value={settings.button_link}
                                            onChange={e => setSettings({ ...settings, button_link: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-semibold text-slate-800 outline-none focus:border-[#011d52] transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* RIGHT: NAVIGATION LIST */}
                <div className="xl:col-span-7">
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden h-full flex flex-col">
                        <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Navigation Items</h3>
                            <button
                                onClick={() => openModal()}
                                className="bg-[#011d52] text-white px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest hover:bg-[#02143a] transition-colors"
                            >
                                + Add Link
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="w-10 px-4 py-2.5"></th>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Menu Details</th>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Header</th>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody ref={sortableRef} className="divide-y divide-slate-100">
                                    {menus.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="py-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">No navigation nodes found.</td>
                                        </tr>
                                    )}
                                    {menus.map((menu) => (
                                        <tr key={menu._id} data-id={menu._id} className="group hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-2">
                                                <div className="drag-handle cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-800 transition-colors">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 8h16M4 16h16" /></svg>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">
                                                <div className="space-y-0.5">
                                                    <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">{menu.title}</div>
                                                    <div className="text-[9px] font-mono text-slate-400">{menu.link}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <button
                                                    onClick={() => handleToggleVisibility(menu._id)}
                                                    className={`w-7 h-4 rounded-full relative transition-all ${menu.show_in_header ? 'bg-[#011d52]' : 'bg-slate-200'}`}
                                                >
                                                    <div className={`absolute top-[2px] w-3 h-3 rounded-full bg-white transition-all ${menu.show_in_header ? 'right-[2px]' : 'left-[2px]'}`}></div>
                                                </button>
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => openModal(menu)} className="p-1.5 text-slate-400 hover:text-slate-800 transition-colors">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                    </button>
                                                    <button onClick={() => handleDeleteMenu(menu._id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
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

            {/* MODAL SECTION */}
            {modal.open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
                        <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">{modal.isEdit ? 'Update Link' : 'New Link'}</h3>
                            <button onClick={() => setModal({ ...modal, open: false })} className="text-slate-400 hover:text-slate-800 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleModalSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Display Title</label>
                                <input
                                    type="text" required
                                    value={modal.item.title}
                                    onChange={e => setModal({ ...modal, item: { ...modal.item, title: e.target.value } })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 outline-none focus:border-[#011d52] transition-colors"
                                    placeholder="e.g. Services"
                                />
                            </div>

                            <div>
                                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Slug / Identifier</label>
                                <input
                                    type="text" required
                                    value={modal.item.slug}
                                    onChange={e => setModal({ ...modal, item: { ...modal.item, slug: e.target.value } })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-[#011d52] outline-none focus:border-[#011d52] transition-colors font-mono"
                                    placeholder="services"
                                />
                            </div>

                            <div>
                                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Link URL</label>
                                <input
                                    type="text" required
                                    value={modal.item.link}
                                    onChange={e => setModal({ ...modal, item: { ...modal.item, link: e.target.value } })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 outline-none focus:border-[#011d52] transition-colors"
                                    placeholder="/services"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Visible in Header</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={modal.item.show_in_header}
                                        onChange={e => setModal({ ...modal, item: { ...modal.item, show_in_header: e.target.checked } })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-checked:bg-[#011d52] peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
                                </label>
                            </div>

                            <div className="pt-3 flex gap-2 border-t border-slate-100 mt-4">
                                <button type="button" onClick={() => setModal({ ...modal, open: false })} className="flex-1 py-1.5 rounded-md bg-white border border-slate-200 text-[9px] font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 bg-[#011d52] text-white py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest hover:bg-[#02143a] transition-colors">
                                    {modal.isEdit ? 'Update Link' : 'Create Link'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default HeaderBuilder;
