import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import { motion } from 'framer-motion';
import { Key, Lock, Link as LinkIcon, ShieldCheck, Save, Server, AlertTriangle, Fingerprint } from 'lucide-react';

const DigioCredentialManager = () => {
    const [credential, setCredential] = useState({
        client_id: '',
        client_secret: '',
        api_base_url: '',
        workflow_name: '',
        isActive: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCredential();
    }, []);

    const fetchCredential = async () => {
        try {
            const response = await api.get('/digio-credentials');
            if (response.data.success && response.data.data) {
                setCredential(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching Digio credential:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch Digio credentials');
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
            const response = await api.put('/digio-credentials', credential);
            if (response.data.success) {
                toast.success('Digio credentials updated successfully!', {
                    style: {
                        background: '#3B82F6',
                        color: 'slate-800',
                        borderRadius: '10px',
                    },
                    iconTheme: {
                        primary: '#fff',
                        secondary: '#3B82F6',
                    },
                });
                setCredential(response.data.data);
            }
        } catch (error) {
            console.error('Error updating Digio credential:', error);
            toast.error(error.response?.data?.message || 'Failed to update credentials');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const inputVariants = {
        focus: { scale: 1.01, boxShadow: "0px 0px 15px rgba(59, 130, 246, 0.2)" },
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
                    <h2 className="text-[13px] font-bold text-slate-800 uppercase tracking-widest flex items-center">
                        <Fingerprint className="w-4 h-4 mr-2" />
                        Digio KYC Integration
                    </h2>
                    <p className="text-[9px] font-semibold text-slate-400 mt-0.5 uppercase tracking-widest">Manage eKYC and Aadhar configurations</p>
                </div>
                <div className="hidden md:flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
                    <ShieldCheck className={`w-4 h-4 ${credential.isActive ? 'text-blue-500' : 'text-slate-500'}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${credential.isActive ? 'text-blue-500' : 'text-slate-500'}`}>
                        {credential.isActive ? 'Gateway: Online' : 'Gateway: Offline'}
                    </span>
                </div>
                </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Client ID */}
                            <div className="space-y-1.5">
                                <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                                    <Key className="w-3.5 h-3.5 mr-2" /> Client ID
                                </label>
                                <motion.div whileFocus="focus" variants={inputVariants} className="relative rounded-lg">
                                    <input
                                        type="text"
                                        name="client_id"
                                        value={credential.client_id}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter Digio Client ID"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors"
                                    />
                                </motion.div>
                            </div>

                            {/* Client Secret */}
                            <div className="space-y-1.5">
                                <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                                    <Lock className="w-3.5 h-3.5 mr-2" /> Client Secret
                                </label>
                                <motion.div whileFocus="focus" variants={inputVariants} className="relative rounded-lg">
                                    <input
                                        type="text"
                                        name="client_secret"
                                        value={credential.client_secret}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter Digio Client Secret"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-mono font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors"
                                    />
                                </motion.div>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* API Base URL */}
                            <div className="space-y-1.5">
                                <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                                    <Server className="w-3.5 h-3.5 mr-2" /> Digio API URL
                                </label>
                                <motion.div whileFocus="focus" variants={inputVariants} className="relative rounded-lg">
                                    <input
                                        type="text"
                                        name="api_base_url"
                                        value={credential.api_base_url}
                                        onChange={handleChange}
                                        required
                                        placeholder="https://api.digio.in"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-mono font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors"
                                    />
                                </motion.div>
                            </div>

                            {/* Workflow Name */}
                            <div className="space-y-1.5">
                                <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                                    <LinkIcon className="w-3.5 h-3.5 mr-2" /> Workflow Template
                                </label>
                                <motion.div whileFocus="focus" variants={inputVariants} className="relative rounded-lg">
                                    <input
                                        type="text"
                                        name="workflow_name"
                                        value={credential.workflow_name}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. AadharPanVerify"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors"
                                    />
                                </motion.div>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                            <div className="bg-slate-50 border border-slate-200 rounded-md p-3 flex items-start space-x-3 mb-4">
                                <AlertTriangle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Production vs Sandbox Mode</h4>
                                    <p className="text-[9px] text-slate-500 mt-0.5 font-bold tracking-widest uppercase">Make sure you switch API Base URL from `ext.digio.in` to `api.digio.in` when moving to production.</p>
                                </div>
                            </div>

                            <div className="flex items-center p-3 bg-slate-50 rounded-md border border-slate-200">
                                <label className="flex items-center gap-3 cursor-pointer select-none group w-full justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-slate-800 font-bold text-[10px] uppercase tracking-widest group-hover:text-[#011d52] transition-colors">Enable Digio Integration</span>
                                        <span className="text-[8px] font-bold text-slate-500 mt-0.5 uppercase tracking-widest">
                                            Activating this will enforce eKYC verifications for all new registrations.
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
                                        Saving Credentials...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Update Configuration
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

export default DigioCredentialManager;
