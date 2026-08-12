import React, { useState } from 'react';

const KeyFeatures = () => {
    const [heading, setHeading] = useState('Advanced Trading Tools');
    const [description, setDescription] = useState('Power your trading with professional tools and real-time market insights designed for modern investors.');
    
    const [items, setItems] = useState([
        { id: 1, image: 'https://images.unsplash.com/photo-1611974714024-462cd9dc160b?auto=format&fit=crop&q=80&w=1000' },
        { id: 2, image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1000' },
        { id: 3, image: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&q=80&w=1000' }
    ]);

    const handleUploadImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setItems([...items, { id: Date.now(), image: event.target.result }]);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const moveImage = (index, direction) => {
        const newItems = [...items];
        const newIndex = direction === 'left' ? index - 1 : index + 1;
        if (newIndex >= 0 && newIndex < newItems.length) {
            [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
            setItems(newItems);
        }
    };

    const handleSave = () => {
        alert('Section content saved! (mock)');
        console.log({ heading, description, items });
    };

    return (
        <main className="min-h-full p-4 flex flex-col gap-4 font-plus-jakarta">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">Key Features</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Manage the key features content and images</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

                {/* Left Side: Controls */}
                <div className="xl:col-span-4 space-y-4">
                    
                    {/* Content Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
                        <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[[#011d52]]"></span>
                            Key Features – Content
                        </h3>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Section Heading</label>
                            <input 
                                value={heading} 
                                onChange={(e) => setHeading(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-[[#011d52]] outline-none transition-colors" 
                                placeholder="e.g. Advanced Features" 
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Description</label>
                            <textarea 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)}
                                rows="3" 
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-medium text-slate-800 focus:border-[[#011d52]] outline-none transition-colors resize-none"
                                placeholder="Section Description"
                            ></textarea>
                        </div>

                        <button onClick={handleSave} className="w-full bg-[#011d52] hover:opacity-90 text-[slate-50] font-bold py-3 rounded-lg shadow-sm transition-opacity text-[10px] uppercase tracking-widest">
                            Save Changes
                        </button>
                    </div>

                    {/* Image Manager */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[[#011d52]]"></span>
                            Image Manager (Order)
                        </h3>

                        <div className="flex flex-wrap gap-3 mb-6">
                            {items.map((item, index) => (
                                <div key={item.id} className="relative w-24 h-20 rounded-xl overflow-hidden border border-slate-200 group shadow-sm transition-colors hover:border-[[#011d52]]">
                                    <img src={item.image} className="w-full h-full object-cover" alt="Feature" />
                                    
                                    {/* Overlay Controls */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button onClick={() => moveImage(index, 'left')} disabled={index === 0} className="text-slate-800 hover:text-[[#011d52]] disabled:opacity-30">◀</button>
                                        <button onClick={() => removeImage(item.id)} className="text-slate-800 hover:text-red-400">✕</button>
                                        <button onClick={() => moveImage(index, 'right')} disabled={index === items.length - 1} className="text-slate-800 hover:text-[[#011d52]] disabled:opacity-30">▶</button>
                                    </div>
                                    
                                    <div className="absolute bottom-1 left-1 bg-slate-50/90 rounded px-1.5 py-0.5 text-[8px] font-bold text-slate-800 uppercase tracking-widest">#{index + 1}</div>
                                </div>
                            ))}
                            {items.length < 3 && (
                                <label className="w-24 h-20 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:border-[[#011d52]] transition-colors">
                                    <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                    <span className="text-[8px] font-bold uppercase tracking-widest">Add Photo</span>
                                    <input type="file" onChange={handleUploadImage} className="hidden" accept="image/*" />
                                </label>
                            )}
                        </div>
                        <p className="text-[9px] text-slate-500 italic text-center uppercase tracking-widest">First image will be displayed as the main feature.</p>
                    </div>

                </div>

                {/* Right Side: Preview */}
                <div className="xl:col-span-8">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm overflow-hidden min-h-[500px]">
                        <div className="max-w-2xl mx-auto">
                            <span className="inline-block bg-[#011d52] text-[slate-50] px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm">
                                {heading}
                            </span>

                            <h2 className="text-xs font-semibold font-bold text-slate-800 mt-4 leading-tight">{description}</h2>

                            <div className="grid grid-cols-[70%_30%] gap-4 mt-8">
                                {/* Large Featured Image */}
                                <div className="h-[300px] rounded-xl overflow-hidden border border-slate-200 shadow-sm transition-transform hover:scale-[1.02]">
                                    {items[0] ? (
                                        <img src={items[0].image} className="w-full h-full object-cover" alt="Main" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-500 uppercase font-bold text-[10px] tracking-widest">No Featured Media</div>
                                    )}
                                </div>

                                {/* Smaller Side Images */}
                                <div className="flex flex-col gap-4">
                                    {items.slice(1, 3).map((item) => (
                                        <div key={item.id} className="h-[142px] rounded-xl overflow-hidden border border-slate-200 shadow-sm transition-transform hover:scale-105">
                                            <img src={item.image} className="w-full h-full object-cover" alt="Side" />
                                        </div>
                                    ))}
                                    {items.length < 2 && <div className="h-[142px] rounded-xl bg-slate-50 border border-dashed border-slate-200"></div>}
                                    {items.length < 3 && <div className="h-[142px] rounded-xl bg-slate-50 border border-dashed border-slate-200"></div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default KeyFeatures;
