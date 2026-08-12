import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const FloatingThemeManager = () => {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef(null);

    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target) && !event.target.closest('.theme-manager-btn')) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div 
            className={`fixed top-1/2 right-0 -translate-y-1/2 z-[99999] flex items-center transition-transform duration-500 ease-out ${
                isOpen ? 'translate-x-0' : 'translate-x-[320px]'
            }`}
        >
            {/* Floating Gear Button on Edge */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`theme-manager-btn w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-l-2xl border-y border-l transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95 ${
                    isOpen 
                        ? 'bg-slate-900 border-slate-700 text-white' 
                        : theme === 'black-green'
                            ? 'bg-black border-lime-500/20 text-[#a3ff33] shadow-lime-500/5 hover:border-lime-500'
                            : 'bg-white border-slate-200 text-[#0939a4] hover:border-[#0939a4]'
                }`}
                title="Theme Manager"
            >
                <span className="relative flex items-center justify-center">
                    <svg 
                        className={`w-6 h-6 ${isOpen ? 'rotate-90' : 'animate-spin-slow'}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </span>
            </button>

            {/* Slide-out Panel */}
            <div
                ref={panelRef}
                className={`w-80 p-6 shadow-2xl border-l border-y rounded-l-[2rem] ${
                    theme === 'black-green'
                        ? 'bg-black/95 backdrop-blur-xl border-lime-500/10 text-white shadow-black/80'
                        : 'bg-white/95 backdrop-blur-xl border-slate-200 text-slate-800 shadow-slate-200'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-dashed border-slate-500/10">
                    <div>
                        <h3 className="font-black text-base uppercase tracking-wider">
                            Theme Manager
                        </h3>
                        <p className={`text-[10px] uppercase font-bold mt-0.5 tracking-widest ${theme === 'black-green' ? 'text-lime-400' : 'text-[#0939a4]'}`}>
                            Personalize Terminal
                        </p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors ${
                            theme === 'black-green'
                                ? 'bg-slate-900 hover:bg-slate-800 text-white'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        }`}
                    >
                        ✕
                    </button>
                </div>

                {/* Preset Options */}
                <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                        Presets
                    </span>

                    {/* Default Theme Option */}
                    <button
                        onClick={() => setTheme('light')}
                        className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all group ${
                            theme === 'light'
                                ? 'border-[#0939a4] bg-[#0939a4]/5 shadow-[0_0_15px_rgba(9,57,164,0.1)]'
                                : 'border-slate-500/15 hover:border-slate-400/30 hover:bg-slate-500/5'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            {/* Color Bubbles */}
                            <div className="flex -space-x-1.5">
                                <span className="w-5 h-5 rounded-full bg-white border border-slate-300 block"></span>
                                <span className="w-5 h-5 rounded-full bg-[#0939a4] block"></span>
                            </div>
                            <div>
                                <p className="font-bold text-xs uppercase tracking-tight">
                                    Classic Mode
                                </p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                    Light / Blue Accent
                                </p>
                            </div>
                        </div>
                        {theme === 'light' && (
                            <span className="w-2.5 h-2.5 rounded-full bg-[#0939a4]"></span>
                        )}
                    </button>

                    {/* Black & Green Option */}
                    <button
                        onClick={() => setTheme('black-green')}
                        className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all group ${
                            theme === 'black-green'
                                ? 'border-[#a3ff33] bg-[#a3ff33]/5 shadow-[0_0_15px_rgba(163,255,51,0.15)]'
                                : 'border-slate-500/15 hover:border-slate-400/30 hover:bg-slate-500/5'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            {/* Color Bubbles */}
                            <div className="flex -space-x-1.5">
                                <span className="w-5 h-5 rounded-full bg-black border border-slate-800 block"></span>
                                <span className="w-5 h-5 rounded-full bg-[#a3ff33] block"></span>
                            </div>
                            <div>
                                <p className="font-bold text-xs uppercase tracking-tight">
                                    Cyber Matrix
                                </p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                    Black & Neon Green
                                </p>
                            </div>
                        </div>
                        {theme === 'black-green' && (
                            <span className="w-2.5 h-2.5 rounded-full bg-[#a3ff33] animate-pulse"></span>
                        )}
                    </button>
                </div>

                {/* Info Box */}
                <div className={`mt-8 p-4 rounded-2xl border text-xs leading-relaxed ${
                    theme === 'black-green'
                        ? 'bg-lime-950/20 border-lime-500/10 text-lime-300/80'
                        : 'bg-blue-50/50 border-blue-100 text-blue-800/80'
                }`}>
                    <p className="font-bold uppercase tracking-widest text-[9px] mb-1">
                        Compliance Mode
                    </p>
                    This theme customizer applies styling strictly to public user-facing terminal scopes. High contrast layouts are designed to meet SEBI investor guidelines.
                </div>
            </div>

            <style>{`
                @keyframes spin-slow {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default FloatingThemeManager;
