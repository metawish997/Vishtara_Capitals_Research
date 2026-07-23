import React, { useState } from 'react';

const HowItWorks = () => {
    const [section, setSection] = useState({
        id: 1,
        badge: 'OUR PROCESS',
        heading: 'How It Works',
        description: 'Follow these simple steps to start your investment journey with us and achieve your financial goals.'
    });

    const [steps, setSteps] = useState([
        { id: 1, uid: '1', title: 'Register Account', description: 'Sign up for a free account with your basic details and complete the verification process.', preview: null, is_active: true },
        { id: 2, uid: '2', title: 'Choose a Plan', description: 'Select from our range of expert-curated investment plans that suit your risk profile and budget.', preview: null, is_active: true },
        { id: 3, uid: '3', title: 'Start Trading', description: 'Access our advanced trading platform and start executing trades with real-time market data.', preview: null, is_active: true }
    ]);

    const [activeStep, setActiveStep] = useState(0);

    const handleSectionChange = (e) => {
        setSection({ ...section, [e.target.name]: e.target.value });
    };

    const addStep = () => {
        const newStep = {
            id: null,
            uid: Date.now().toString(),
            title: '',
            description: '',
            preview: null,
            is_active: true
        };
        setSteps([...steps, newStep]);
        setActiveStep(steps.length);
    };

    const removeStep = (index) => {
        if (window.confirm('Delete this step?')) {
            const newSteps = [...steps];
            newSteps.splice(index, 1);
            setSteps(newSteps);
            setActiveStep(Math.max(0, activeStep - 1));
        }
    };

    const handleStepChange = (field, value) => {
        const newSteps = [...steps];
        newSteps[activeStep][field] = value;
        setSteps(newSteps);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleStepChange('preview', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const moveStep = (from, to) => {
        const newSteps = [...steps];
        const moved = newSteps.splice(from, 1)[0];
        newSteps.splice(to, 0, moved);
        setSteps(newSteps);
        setActiveStep(to);
    };

    const handlePublish = (e) => {
        e.preventDefault();
        alert('Workflow published successfully!');
        console.log({ section, steps });
    };


    return (
        <main className="min-h-full p-4 flex flex-col gap-4 font-plus-jakarta">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">How It Works Section</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Manage the 'Our Process' workflow steps</p>
                </div>
            </div>

            <form onSubmit={handlePublish}>
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">

                    {/* Sidebar: Section Info */}
                    <aside className="xl:col-span-4 space-y-4 lg:sticky lg:top-4">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-[#011d52] rounded-lg flex items-center justify-center text-[slate-50] shadow-sm">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                                    </svg>
                                </div>
                                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Section Info</h2>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Badge Text</label>
                                    <input
                                        name="badge"
                                        value={section.badge}
                                        onChange={handleSectionChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-[[#011d52]] outline-none transition-colors"
                                        placeholder="e.g. OUR PROCESS"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Main Heading</label>
                                    <input
                                        name="heading"
                                        value={section.heading}
                                        onChange={handleSectionChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-[[#011d52]] outline-none transition-colors"
                                        placeholder="e.g. How It Works"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={section.description}
                                        onChange={handleSectionChange}
                                        rows="4"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-medium text-slate-800 focus:border-[[#011d52]] outline-none transition-colors resize-none"
                                        placeholder="Write a short intro..."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-200">
                                <button type="submit" className="w-full bg-[#011d52] hover:opacity-90 text-[slate-50] font-bold px-6 py-3 rounded-lg shadow-sm transition-opacity text-[10px] uppercase tracking-widest">
                                    Publish Changes
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content: Steps */}
                    <main className="xl:col-span-8">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest">Process Workflow</h3>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Add, remove, and reorder steps.</p>
                                </div>
                                <button type="button" onClick={addStep} className="bg-[#011d52] hover:opacity-90 text-[slate-50] px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-opacity">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeWidth="2.5" d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                    Add Step
                                </button>
                            </div>

                            <div className="bg-white p-4 border-b border-slate-200">
                                <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
                                    {steps.map((step, i) => (
                                        <div
                                            key={step.uid}
                                            onClick={() => setActiveStep(i)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors whitespace-nowrap group relative ${activeStep === i ? 'bg-slate-50 border-[[#011d52]] text-slate-800' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-[[#011d52]]'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center">
                                                <button
                                                    type="button"
                                                    disabled={i === 0}
                                                    onClick={(e) => { e.stopPropagation(); moveStep(i, i - 1); }}
                                                    className="text-[8px] hover:text-[[#011d52]] disabled:opacity-30 p-0.5"
                                                >▲</button>
                                                <button
                                                    type="button"
                                                    disabled={i === steps.length - 1}
                                                    onClick={(e) => { e.stopPropagation(); moveStep(i, i + 1); }}
                                                    className="text-[8px] hover:text-[[#011d52]] disabled:opacity-30 p-0.5"
                                                >▼</button>
                                            </div>

                                            <span className={`font-bold text-[10px] uppercase tracking-widest ${activeStep === i ? 'text-[[#011d52]]' : ''}`}>
                                                Step {i + 1}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); removeStep(i); }}
                                                className="ml-2 p-1 rounded hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 lg:p-4 min-h-[400px]">
                                {steps.length > 0 ? (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Step Title</label>
                                                    <input
                                                        value={steps[activeStep].title}
                                                        onChange={(e) => handleStepChange('title', e.target.value)}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-[[#011d52]] outline-none transition-colors"
                                                        placeholder="e.g. Register Account"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Description</label>
                                                    <textarea
                                                        value={steps[activeStep].description}
                                                        onChange={(e) => handleStepChange('description', e.target.value)}
                                                        rows="5"
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-medium text-slate-800 focus:border-[[#011d52]] outline-none transition-colors resize-none"
                                                        placeholder="Explain what happens in this step..."
                                                    ></textarea>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Step Image</label>
                                                <div className="relative group aspect-square rounded-xl border border-dashed border-slate-200 bg-slate-50 overflow-hidden flex flex-col items-center justify-center transition-colors hover:border-[[#011d52]]">
                                                    {steps[activeStep].preview && (
                                                        <img
                                                            src={steps[activeStep].preview}
                                                            className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                                            alt="Step Preview"
                                                        />
                                                    )}

                                                    <div className="relative z-10 flex flex-col items-center text-center p-4">
                                                        <div className="p-3 rounded-lg bg-white shadow-sm border border-slate-200 mb-3 text-slate-800 group-hover:bg-[#011d52] group-hover:text-[slate-50] transition-colors">
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                            </svg>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImageUpload}
                                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                                        />
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-800 transition-colors">Upload Media</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                        <div className="w-16 h-16 bg-white rounded-lg shadow-sm border border-slate-200 flex items-center justify-center mb-4 text-slate-500">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">No steps created yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </form>
        </main>
    );
};

export default HowItWorks;
