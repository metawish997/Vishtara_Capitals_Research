import React, { useRef, useEffect, useState } from 'react';
import mediaService from '../../services/mediaService';
import { BASE_URL } from '../../services/api';

const RichTextEditor = ({ value, onChange, placeholder }) => {
    const editorRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const execCommand = (command, val = null) => {
        document.execCommand(command, false, val);
        editorRef.current.focus();
    };

    const handleInput = () => {
        if (onChange) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const res = await mediaService.upload(file, 'other');
            const imageUrl = res.data[0].url;
            const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`;
            execCommand('insertImage', fullUrl);
        } catch (error) {
            console.error('Image upload failed:', error);
            alert('Image upload failed');
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    const insertTable = () => {
        const rows = 3;
        const cols = 3;
        let tableHtml = '<table style="width:100%; border-collapse: collapse; margin: 1rem 0; border: 1px solid #e2e8f0;">';
        for (let i = 0; i < rows; i++) {
            tableHtml += '<tr>';
            for (let j = 0; j < cols; j++) {
                tableHtml += '<td style="border: 1px solid #e2e8f0; padding: 12px; min-width: 50px;">&nbsp;</td>';
            }
            tableHtml += '</tr>';
        }
        tableHtml += '</table><p>&nbsp;</p>';
        execCommand('insertHTML', tableHtml);
    };

    return (
        <div className="border border-gray-200 rounded-[2rem] overflow-hidden bg-white shadow-xl shadow-slate-100/50 ring-1 ring-slate-100 transition-all">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-3 bg-slate-50/80 border-b border-gray-100 backdrop-blur-sm sticky top-0 z-20">
                
                {/* HEADINGS */}
                <select 
                    onChange={(e) => execCommand('formatBlock', e.target.value)}
                    className="h-8 bg-white border border-gray-200 rounded-lg text-[10px] font-black uppercase px-2 outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                    <option value="p">Paragraph</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="h4">Heading 4</option>
                </select>

                <div className="w-px h-4 bg-gray-200 mx-1"></div>

                {/* BASIC STYLE */}
                <button type="button" onClick={() => execCommand('bold')} className="p-2 hover:bg-white rounded-lg transition-all text-slate-600 hover:text-indigo-600 hover:shadow-sm" title="Bold">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" /></svg>
                </button>
                <button type="button" onClick={() => execCommand('italic')} className="p-2 hover:bg-white rounded-lg transition-all text-slate-600 hover:text-indigo-600 hover:shadow-sm" title="Italic">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 20l4-16m4 0h-4m-6 16h-4" /></svg>
                </button>
                <button type="button" onClick={() => execCommand('underline')} className="p-2 hover:bg-white rounded-lg transition-all text-slate-600 hover:text-indigo-600 hover:shadow-sm" title="Underline">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 19H8M12 5v14" /></svg>
                </button>

                <div className="w-px h-4 bg-gray-200 mx-1"></div>

                {/* LISTS */}
                <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-white rounded-lg transition-all text-slate-600 hover:text-indigo-600 hover:shadow-sm" title="Bullet List">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                <button type="button" onClick={() => execCommand('insertOrderedList')} className="p-2 hover:bg-white rounded-lg transition-all text-slate-600 hover:text-indigo-600 hover:shadow-sm" title="Numbered List">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 8h10M7 12h10M7 16h10" /></svg>
                </button>

                <div className="w-px h-4 bg-gray-200 mx-1"></div>

                {/* ALIGNMENT */}
                <button type="button" onClick={() => execCommand('justifyLeft')} className="p-2 hover:bg-white rounded-lg transition-all text-slate-600 hover:text-indigo-600 hover:shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h10M4 18h16" /></svg>
                </button>
                <button type="button" onClick={() => execCommand('justifyCenter')} className="p-2 hover:bg-white rounded-lg transition-all text-slate-600 hover:text-indigo-600 hover:shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M7 12h10M4 18h16" /></svg>
                </button>

                <div className="w-px h-4 bg-gray-200 mx-1"></div>

                {/* MEDIA & TABLES */}
                <button type="button" onClick={() => fileInputRef.current.click()} disabled={isUploading} className="p-2 hover:bg-white rounded-lg transition-all text-slate-600 hover:text-emerald-600 hover:shadow-sm" title="Upload Image">
                    {isUploading ? <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />

                <button type="button" onClick={insertTable} className="p-2 hover:bg-white rounded-lg transition-all text-slate-600 hover:text-blue-600 hover:shadow-sm" title="Insert Table">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </button>

                <div className="w-px h-4 bg-gray-200 mx-1"></div>

                {/* UTILS */}
                <button type="button" onClick={() => execCommand('removeFormat')} className="p-2 hover:bg-white rounded-lg transition-all text-rose-400 hover:text-rose-600 hover:shadow-sm" title="Clear Formatting">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            {/* Editable Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="p-10 min-h-[500px] max-h-[800px] overflow-y-auto outline-none prose prose-slate max-w-none text-slate-700 font-medium leading-relaxed editor-content"
                data-placeholder={placeholder}
            ></div>

            <style>{`
                .editor-content:empty:before {
                    content: attr(data-placeholder);
                    color: #cbd5e1;
                    font-weight: 500;
                    font-style: italic;
                }
                .editor-content h1 { font-size: 2.25rem; font-weight: 900; color: #0f172a; margin: 2rem 0 1rem; letter-spacing: -0.025em; }
                .editor-content h2 { font-size: 1.875rem; font-weight: 800; color: #1e293b; margin: 1.5rem 0 1rem; border-bottom: 2px solid #f8fafc; padding-bottom: 0.5rem; }
                .editor-content h3 { font-size: 1.5rem; font-weight: 800; color: #334155; margin: 1.25rem 0 0.75rem; }
                .editor-content h4 { font-size: 1.25rem; font-weight: 700; color: #475569; margin: 1rem 0 0.5rem; }
                .editor-content p { margin-bottom: 1.25rem; }
                .editor-content ul, .editor-content ol { margin-left: 2rem; margin-bottom: 1.25rem; }
                .editor-content ul { list-style-type: disc; }
                .editor-content ol { list-style-type: decimal; }
                .editor-content table td { min-width: 100px; }
                .editor-content img { max-width: 100%; border-radius: 1rem; margin: 1.5rem 0; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); }
            `}</style>
        </div>
    );
};

export default RichTextEditor;

