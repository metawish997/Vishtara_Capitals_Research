import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import { motion } from 'framer-motion';
import { Key, Lock, Link as LinkIcon, ShieldCheck, Save, Server, AlertTriangle, Fingerprint, User, Shield, Activity, Eye, EyeOff, AlertCircle, Mail, Phone, CreditCard } from 'lucide-react';

// --- Digio Component ---
const DigioForm = () => {
    const [credential, setCredential] = useState({
        client_id: '',
        client_secret: '',
        api_base_url: '',
        workflow_name: '',
        isActive: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showClientSecret, setShowClientSecret] = useState(false);

    useEffect(() => {
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
        fetchCredential();
    }, []);

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
                    style: { background: '#3B82F6', color: 'slate-800', borderRadius: '10px' },
                    iconTheme: { primary: '#fff', secondary: '#3B82F6' },
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

    if (loading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div></div>;

    const inputVariants = { focus: { scale: 1.01, boxShadow: "0px 0px 15px rgba(59, 130, 246, 0.2)" }, blur: { scale: 1, boxShadow: "none" } };

    return (
        <div className="w-full text-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl shadow-sm p-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800 uppercase tracking-widest flex items-center">
                        <Fingerprint className="w-4 h-4 mr-2" /> Digio KYC Integration
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
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3">
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1"><Key className="w-3.5 h-3.5 mr-2" /> Client ID</label>
                            <motion.div whileFocus="focus" variants={inputVariants} className="relative rounded-lg">
                                <input type="text" name="client_id" value={credential.client_id} onChange={handleChange} required placeholder="Enter Digio Client ID" className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors" />
                            </motion.div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1"><Lock className="w-3.5 h-3.5 mr-2" /> Client Secret</label>
                            <motion.div whileFocus="focus" variants={inputVariants} className="relative rounded-lg group">
                                <input type={showClientSecret ? 'text' : 'password'} name="client_secret" value={credential.client_secret} onChange={handleChange} required placeholder="Enter Digio Client Secret" className="w-full bg-slate-50 border border-slate-200 rounded-md pl-3 pr-10 py-2 text-[10px] font-mono font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors" />
                                <button type="button" onClick={() => setShowClientSecret(!showClientSecret)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-[#011d52]">
                                    {showClientSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </motion.div>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1"><Server className="w-3.5 h-3.5 mr-2" /> Digio API URL</label>
                            <motion.div whileFocus="focus" variants={inputVariants} className="relative rounded-lg">
                                <input type="text" name="api_base_url" value={credential.api_base_url} onChange={handleChange} required placeholder="https://api.digio.in" className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-mono font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors" />
                            </motion.div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1"><LinkIcon className="w-3.5 h-3.5 mr-2" /> Workflow Template</label>
                            <motion.div whileFocus="focus" variants={inputVariants} className="relative rounded-lg">
                                <input type="text" name="workflow_name" value={credential.workflow_name} onChange={handleChange} required placeholder="e.g. AadharPanVerify" className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors" />
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
                                    <span className="text-[8px] font-bold text-slate-500 mt-0.5 uppercase tracking-widest">Activating this will enforce eKYC verifications for all new registrations.</span>
                                </div>
                                <input type="checkbox" name="isActive" checked={credential.isActive} onChange={handleChange} className="w-4 h-4 rounded border-slate-200 text-[#011d52] focus:ring-[#011d52]" />
                            </label>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex justify-end">
                        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={saving} className="bg-[#011d52] hover:bg-[#02143a] text-white font-bold py-2 px-6 rounded-md shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-[10px] tracking-widest uppercase">
                            {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Update Configuration</>}
                        </motion.button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Angel Component ---
const AngelForm = () => {
    const [credential, setCredential] = useState({
        apiKey: '', clientCode: '', password: '', totpSecret: '', baseUrl: '', marketBaseUrl: '', isActive: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showTotpSecret, setShowTotpSecret] = useState(false);

    useEffect(() => {
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
        fetchCredential();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCredential(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await api.put('/angel-credentials', credential);
            if (response.data.success) {
                toast.success('Angel One credentials updated successfully!', {
                    style: { background: '#10B981', color: 'slate-800', borderRadius: '10px' },
                    iconTheme: { primary: '#fff', secondary: '#10B981' },
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

    if (loading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div></div>;

    const inputVariants = { focus: { scale: 1.01, boxShadow: "0px 0px 15px rgba(16, 185, 129, 0.2)" }, blur: { scale: 1, boxShadow: "none" } };

    return (
        <div className="w-full text-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl shadow-sm p-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800 uppercase tracking-widest flex items-center">
                        <Activity className="w-4 h-4 mr-2" /> Angel One Integration
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
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3">
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="space-y-1.5">
                            <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1"><Key className="w-3.5 h-3.5 mr-2" /> API Key</label>
                            <motion.div whileFocus="focus" variants={inputVariants} className="relative rounded-lg">
                                <input type="text" name="apiKey" value={credential.apiKey} onChange={handleChange} required placeholder="Enter SmartAPI Key" className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors" />
                            </motion.div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1"><User className="w-3.5 h-3.5 mr-2" /> Client Code</label>
                            <motion.div whileFocus="focus" variants={inputVariants} className="relative rounded-lg">
                                <input type="text" name="clientCode" value={credential.clientCode} onChange={handleChange} required placeholder="e.g. N75516" className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors uppercase" />
                            </motion.div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1"><Lock className="w-3.5 h-3.5 mr-2" /> MPIN / Password</label>
                            <motion.div whileFocus="focus" variants={inputVariants} className="relative rounded-lg group">
                                <input type={showPassword ? 'text' : 'password'} name="password" value={credential.password} onChange={handleChange} required placeholder="Enter PIN or Password" className="w-full bg-slate-50 border border-slate-200 rounded-md pl-3 pr-10 py-2 text-[10px] font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-[#011d52]">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </motion.div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1"><Shield className="w-3.5 h-3.5 mr-2" /> TOTP Secret Key</label>
                            <motion.div whileFocus="focus" variants={inputVariants} className="relative rounded-lg group">
                                <input type={showTotpSecret ? 'text' : 'password'} name="totpSecret" value={credential.totpSecret} onChange={handleChange} required placeholder="Base32 TOTP Secret" className="w-full bg-slate-50 border border-slate-200 rounded-md pl-3 pr-10 py-2 text-[10px] font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors font-mono" />
                                <button type="button" onClick={() => setShowTotpSecret(!showTotpSecret)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-[#011d52]">
                                    {showTotpSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </motion.div>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                            <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1"><Server className="w-3.5 h-3.5 mr-2" /> Base URL</label>
                            <motion.div whileFocus="focus" variants={inputVariants} className="relative rounded-lg">
                                <input type="text" name="baseUrl" value={credential.baseUrl} onChange={handleChange} required placeholder="https://apiconnect.angelbroking.com" className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-mono font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors" />
                            </motion.div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1"><LinkIcon className="w-3.5 h-3.5 mr-2" /> Market Data URL</label>
                            <motion.div whileFocus="focus" variants={inputVariants} className="relative rounded-lg">
                                <input type="text" name="marketBaseUrl" value={credential.marketBaseUrl} onChange={handleChange} required placeholder="https://apiconnect.angelone.in" className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-mono font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors" />
                            </motion.div>
                        </div>
                        <div className="flex items-center p-3 bg-slate-50 rounded-md border border-slate-200 self-end h-[52px]">
                            <label className="flex items-center gap-3 cursor-pointer select-none group w-full justify-between">
                                <div className="flex flex-col">
                                    <span className="text-slate-800 font-bold text-[10px] uppercase tracking-widest group-hover:text-[#011d52] transition-colors">Enable SmartAPI</span>
                                    <span className="text-[8px] text-slate-500 mt-0.5 flex items-center uppercase tracking-widest font-bold"><AlertCircle className="w-2.5 h-2.5 mr-1" /> Disabling pauses live feeds.</span>
                                </div>
                                <input type="checkbox" name="isActive" checked={credential.isActive} onChange={handleChange} className="w-4 h-4 rounded border-slate-200 text-[#011d52] focus:ring-[#011d52]" />
                            </label>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex justify-end">
                        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={saving} className="bg-[#011d52] hover:bg-[#02143a] text-white font-bold py-2 px-6 rounded-md shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-[10px] tracking-widest uppercase">
                            {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save & Sync Credentials</>}
                        </motion.button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- SMTP Component ---
const SmtpForm = () => {
    const [credential, setCredential] = useState({
        host: '', port: '', user: '', pass: '', encryption: '', fromEmail: '', fromName: '', isActive: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPass, setShowPass] = useState(false);

    useEffect(() => {
        const fetchCredential = async () => {
            try {
                const response = await api.get('/smtp-credentials');
                if (response.data.success && response.data.data) {
                    setCredential(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching SMTP credential:', error);
                toast.error(error.response?.data?.message || 'Failed to fetch SMTP credentials');
            } finally {
                setLoading(false);
            }
        };
        fetchCredential();
    }, []);

    const handleChange = (e) => setCredential(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await api.put('/smtp-credentials', credential);
            if (response.data.success) {
                toast.success('SMTP configuration updated successfully!');
                setCredential(response.data.data);
            }
        } catch (error) {
            console.error('Error updating SMTP credential:', error);
            toast.error(error.response?.data?.message || 'Failed to update SMTP credentials');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div></div>;

    return (
        <div className="w-full text-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl shadow-sm p-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800 uppercase tracking-widest flex items-center">
                        <Mail className="w-4 h-4 mr-2" /> SMTP Email Server
                    </h2>
                    <p className="text-[9px] font-semibold text-slate-400 mt-0.5 uppercase tracking-widest">Configure outgoing email delivery</p>
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3">
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                            <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">SMTP Host</label>
                            <input type="text" name="host" value={credential.host} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">SMTP Port</label>
                            <input type="text" name="port" value={credential.port} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Encryption</label>
                            <input type="text" name="encryption" value={credential.encryption} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors" />
                        </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">SMTP Username</label>
                            <input type="text" name="user" value={credential.user} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">SMTP Password</label>
                            <div className="relative group">
                                <input type={showPass ? "text" : "password"} name="pass" value={credential.pass} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-md pl-3 pr-10 py-2 text-[10px] font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors" />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-[#011d52]">
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">From Email Address</label>
                            <input type="text" name="fromEmail" value={credential.fromEmail} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">From Name</label>
                            <input type="text" name="fromName" value={credential.fromName} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors" />
                        </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex justify-end">
                        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={saving} className="bg-[#011d52] hover:bg-[#02143a] text-white font-bold py-2 px-6 rounded-md shadow-sm transition-colors disabled:opacity-70 flex items-center justify-center text-[10px] tracking-widest uppercase">
                            {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Configuration</>}
                        </motion.button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- SMS Component ---
const SmsForm = () => {
    const [credential, setCredential] = useState({
        baseUrl: '', user: '', key: '', sender: '', entityId: '', templateId: '', countryCode: '', isActive: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showKey, setShowKey] = useState(false);

    useEffect(() => {
        const fetchCredential = async () => {
            try {
                const response = await api.get('/sms-credentials');
                if (response.data.success && response.data.data) {
                    setCredential(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching SMS credential:', error);
                toast.error(error.response?.data?.message || 'Failed to fetch SMS credentials');
            } finally {
                setLoading(false);
            }
        };
        fetchCredential();
    }, []);

    const handleChange = (e) => setCredential(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await api.put('/sms-credentials', credential);
            if (response.data.success) {
                toast.success('SMS configuration updated successfully!');
                setCredential(response.data.data);
            }
        } catch (error) {
            console.error('Error updating SMS credential:', error);
            toast.error(error.response?.data?.message || 'Failed to update SMS credentials');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div></div>;

    return (
        <div className="w-full text-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl shadow-sm p-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800 uppercase tracking-widest flex items-center">
                        <Phone className="w-4 h-4 mr-2" /> SMS Gateway
                    </h2>
                    <p className="text-[9px] font-semibold text-slate-400 mt-0.5 uppercase tracking-widest">Configure OTP and alert delivery</p>
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3">
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1.5">
                        <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">SMS Base URL</label>
                        <input type="text" name="baseUrl" value={credential.baseUrl} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-mono font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors" />
                    </div>
                    <div className="pt-2 border-t border-slate-100"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="space-y-1.5">
                            <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">API User</label>
                            <input type="text" name="user" value={credential.user} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">API Key</label>
                            <div className="relative group">
                                <input type={showKey ? "text" : "password"} name="key" value={credential.key} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-md pl-3 pr-10 py-2 text-[10px] font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors" />
                                <button type="button" onClick={() => setShowKey(!showKey)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-[#011d52]">
                                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Sender ID</label>
                            <input type="text" name="sender" value={credential.sender} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Country Code</label>
                            <input type="text" name="countryCode" value={credential.countryCode} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors" />
                        </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Entity ID</label>
                            <input type="text" name="entityId" value={credential.entityId} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Template ID</label>
                            <input type="text" name="templateId" value={credential.templateId} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors" />
                        </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex justify-end">
                        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={saving} className="bg-[#011d52] hover:bg-[#02143a] text-white font-bold py-2 px-6 rounded-md shadow-sm transition-colors disabled:opacity-70 flex items-center justify-center text-[10px] tracking-widest uppercase">
                            {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Configuration</>}
                        </motion.button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Razorpay Component ---
const RazorpayForm = () => {
    const [credential, setCredential] = useState({
        keyId: '', keySecret: '', isActive: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showKeySecret, setShowKeySecret] = useState(false);

    useEffect(() => {
        const fetchCredential = async () => {
            try {
                const response = await api.get('/razorpay-credentials');
                if (response.data.success && response.data.data) {
                    setCredential(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching Razorpay credential:', error);
                toast.error(error.response?.data?.message || 'Failed to fetch Razorpay credentials');
            } finally {
                setLoading(false);
            }
        };
        fetchCredential();
    }, []);

    const handleChange = (e) => setCredential(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await api.put('/razorpay-credentials', credential);
            if (response.data.success) {
                toast.success('Razorpay configuration updated successfully!');
                setCredential(response.data.data);
            }
        } catch (error) {
            console.error('Error updating Razorpay credential:', error);
            toast.error(error.response?.data?.message || 'Failed to update Razorpay credentials');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div></div>;

    return (
        <div className="w-full text-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl shadow-sm p-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800 uppercase tracking-widest flex items-center">
                        <CreditCard className="w-4 h-4 mr-2" /> Razorpay Payments
                    </h2>
                    <p className="text-[9px] font-semibold text-slate-400 mt-0.5 uppercase tracking-widest">Configure payment gateway</p>
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3">
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Key ID</label>
                            <input type="text" name="keyId" value={credential.keyId} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-mono font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Key Secret</label>
                            <div className="relative group">
                                <input type={showKeySecret ? "text" : "password"} name="keySecret" value={credential.keySecret} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-md pl-3 pr-10 py-2 text-[10px] font-mono font-bold text-slate-800 focus:border-[#011d52] outline-none transition-colors" />
                                <button type="button" onClick={() => setShowKeySecret(!showKeySecret)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-[#011d52]">
                                    {showKeySecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex justify-end">
                        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={saving} className="bg-[#011d52] hover:bg-[#02143a] text-white font-bold py-2 px-6 rounded-md shadow-sm transition-colors disabled:opacity-70 flex items-center justify-center text-[10px] tracking-widest uppercase">
                            {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Configuration</>}
                        </motion.button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CredentialManager = () => {
    const [activeTab, setActiveTab] = useState('digio');

    const tabs = [
        { id: 'digio', label: 'Digio eKYC', icon: <Fingerprint className="w-3.5 h-3.5 mr-2" /> },
        { id: 'angel', label: 'Angel One', icon: <Activity className="w-3.5 h-3.5 mr-2" /> },
        { id: 'smtp', label: 'SMTP Mail', icon: <Mail className="w-3.5 h-3.5 mr-2" /> },
        { id: 'sms', label: 'SMS Gateway', icon: <Phone className="w-3.5 h-3.5 mr-2" /> },
        { id: 'razorpay', label: 'Razorpay', icon: <CreditCard className="w-3.5 h-3.5 mr-2" /> }
    ];

    return (
        <main className="min-h-full font-plus-jakarta flex flex-col gap-3 bg-white" style={{ padding: '16px' }}>
            {/* Header */}
            <div className="flex flex-col gap-3 border-b border-slate-100 pb-3">
                <div>
                    <h1 className="text-[13px] font-bold text-slate-800">API Credentials & Integrations</h1>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Manage all external platform keys and gateways.</p>
                </div>
                
                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1 mt-2 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-slate-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${
                                activeTab === tab.id 
                                ? 'bg-[#011d52] text-white shadow-sm' 
                                : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content area */}
            <div className="mt-2">
                <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'digio' && <DigioForm />}
                    {activeTab === 'angel' && <AngelForm />}
                    {activeTab === 'smtp' && <SmtpForm />}
                    {activeTab === 'sms' && <SmsForm />}
                    {activeTab === 'razorpay' && <RazorpayForm />}
                </motion.div>
            </div>
        </main>
    );
};

export default CredentialManager;
