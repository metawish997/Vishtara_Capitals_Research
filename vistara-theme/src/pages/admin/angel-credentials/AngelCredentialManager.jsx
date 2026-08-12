import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, User, Lock, Link as LinkIcon, Shield, Activity, Save, Eye, EyeOff, Server, AlertCircle } from 'lucide-react';

const AngelCredentialManager = () => {
    const [credential, setCredential] = useState({
        apiKey: '',
        clientCode: '',
        password: '',
        totpSecret: '',
        baseUrl: '',
        marketBaseUrl: '',
        isActive: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showTotpSecret, setShowTotpSecret] = useState(false);

    useEffect(() => {
        fetchCredential();
    }, []);

    const fetchCredential = async () => {
        try {
            const response = await api.get('/angel-credentials');
            if (response.data.success && response.data.data) {
                setCredential(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching Angel credential:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch Angel credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCredential(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await api.put('/angel-credentials', credential);
            if (response.data.success) {
                toast.success('Angel One credentials updated successfully!', {
                    style: {
                        background: '#10B981',
                        color: 'slate-800',
                        borderRadius: '10px',
                    },
                    iconTheme: {
                        primary: '#fff',
                        secondary: '#10B981',
                    },
                });
                setCredential(response.data.data);
            }
        } catch (error) {
            console.error('Error updating Angel credential:', error);
            toast.error(error.response?.data?.message || 'Failed to update credentials');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    const inputVariants = {
        focus: { scale: 1.01, boxShadow: "0px 0px 15px rgba(16, 185, 129, 0.2)" },
        blur: { scale: 1, boxShadow: "none" }
    };

    return (
        <main className="min-h-full p-4 flex flex-col gap-4 font-sans">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full text-slate-800 flex flex-col gap-4"
            >
                <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800 uppercase tracking-widest">
                        Angel One Integration
                    </h2>
                    <p className="text-[9px] font-semibold text-slate-400 mt-0.5 uppercase tracking-widest">Manage your SmartAPI credentials</p>
                </div>
                <div className="hidden md:flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
                    <Activity className={`w-4 h-4 ${credential.isActive ? 'text-emerald-500 animate-pulse' : 'text-slate-500'}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${credential.isActive ? 'text-emerald-500' : 'text-slate-500'}`}>
                        {credential.isActive ? 'Live Status: Active' : 'Live Status: Inactive'}
                    </span>
                </div>
                </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* API Key */}
                            <div className="space-y-1.5">
                                <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                                    <Key className="w-3.5 h-3.5 mr-2" /> API Key
                                </label>
                                <motion.div whileFocus="focus" variants={inputVariants} className="relative rounded-lg">
                                    <input
                                        type="text"
                                        name="apiKey"
                                        value={credential.apiKey}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter SmartAPI Key"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors"
                                    />
                                </motion.div>
                            </div>

                            {/* Client Code */}
                            <div className="space-y-1.5">
                                <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                                    <User className="w-3.5 h-3.5 mr-2" /> Client Code
                                </label>
                                <motion.div whileFocus="focus" variants={inputVariants} className="relative rounded-lg">
                                    <input
                                        type="text"
                                        name="clientCode"
                                        value={credential.clientCode}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. N75516"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors uppercase"
                                    />
                                </motion.div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                                    <Lock className="w-3.5 h-3.5 mr-2" /> MPIN / Password
                                </label>
                                <motion.div whileFocus="focus" variants={inputVariants} className="relative rounded-lg group">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={credential.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter PIN or Password"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-md pl-3 pr-10 py-2 text-[10px] font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-[#011d52] focus:outline-none transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </motion.div>
                            </div>

                            {/* TOTP Secret */}
                            <div className="space-y-1.5">
                                <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                                    <Shield className="w-3.5 h-3.5 mr-2" /> TOTP Secret Key
                                </label>
                                <motion.div whileFocus="focus" variants={inputVariants} className="relative rounded-lg group">
                                    <input
                                        type={showTotpSecret ? 'text' : 'password'}
                                        name="totpSecret"
                                        value={credential.totpSecret}
                                        onChange={handleChange}
                                        required
                                        placeholder="Base32 TOTP Secret"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-md pl-3 pr-10 py-2 text-[10px] font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors font-mono"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowTotpSecret(!showTotpSecret)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-[#011d52] focus:outline-none transition-colors"
                                    >
                                        {showTotpSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </motion.div>
                            </div>
                        </div>
                        <div className="pt-2 border-t border-slate-100"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* API Base URL */}
                            <div className="space-y-1.5">
                                <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                                    <Server className="w-3.5 h-3.5 mr-2" /> Base URL
                                </label>
                                <motion.div whileFocus="focus" variants={inputVariants} className="relative rounded-lg">
                                    <input
                                        type="text"
                                        name="baseUrl"
                                        value={credential.baseUrl}
                                        onChange={handleChange}
                                        required
                                        placeholder="https://apiconnect.angelbroking.com"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-mono font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors"
                                    />
                                </motion.div>
                            </div>

                            {/* Market Data URL */}
                            <div className="space-y-1.5">
                                <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                                    <LinkIcon className="w-3.5 h-3.5 mr-2" /> Market Data URL
                                </label>
                                <motion.div whileFocus="focus" variants={inputVariants} className="relative rounded-lg">
                                    <input
                                        type="text"
                                        name="marketBaseUrl"
                                        value={credential.marketBaseUrl}
                                        onChange={handleChange}
                                        required
                                        placeholder="https://apiconnect.angelone.in"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-mono font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors"
                                    />
                                </motion.div>
                            </div>

                            <div className="flex items-center p-3 bg-slate-50 rounded-md border border-slate-200 self-end h-[52px]">
                            <label className="flex items-center gap-3 cursor-pointer select-none group w-full justify-between">
                                <div className="flex flex-col">
                                    <span className="text-slate-800 font-bold text-[10px] uppercase tracking-widest group-hover:text-[#011d52] transition-colors">Enable SmartAPI Connectivity</span>
                                    <span className="text-[8px] text-slate-500 mt-0.5 flex items-center uppercase tracking-widest font-bold">
                                        <AlertCircle className="w-2.5 h-2.5 mr-1" />
                                        Disabling pauses live feeds.
                                    </span>
                                </div>
                                <input 
                                    type="checkbox" 
                                    name="isActive" 
                                    checked={credential.isActive} 
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-slate-200 text-[#011d52] focus:ring-[#011d52]"
                                />
                            </label>
                        </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex justify-end">
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={saving}
                                className="bg-[#011d52] hover:bg-[#02143a] text-white font-bold py-2 px-6 rounded-md shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-[10px] tracking-widest uppercase"
                            >
                                {saving ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Deploying Configuration...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save & Sync Credentials
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </form>
                </div>
            </div>
            </motion.div>
        </main>
    );
};

export default AngelCredentialManager;
