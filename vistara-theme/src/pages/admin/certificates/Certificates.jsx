import React, { useState, useEffect } from 'react';
import certificateService from '../../../services/certificateService';
import userService from '../../../services/userService';
import toast from 'react-hot-toast';

const Certificates = () => {
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [certificates, setCertificates] = useState([]);
    const [users, setUsers] = useState([]);

    const [currentCert, setCurrentCert] = useState({
        user_id: '',
        certificate_name: '',
        certificate_number: '',
        issue_date: '',
        expiry_date: '',
        status: 'active'
    });

    const [selectedFile, setSelectedFile] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [certRes, userRes] = await Promise.all([
                certificateService.getCertificates(),
                userService.getUsers()
            ]);
            setCertificates(certRes.data);
            setUsers(userRes.data);
        } catch (error) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this certificate?')) {
            try {
                await certificateService.deleteCertificate(id);
                toast.success('Certificate deleted successfully');
                fetchData();
            } catch (error) {
                toast.error('Delete failed');
            }
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setCurrentCert(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(currentCert).forEach(key => {
                formData.append(key, currentCert[key]);
            });
            if (selectedFile) {
                formData.append('file', selectedFile);
            } else {
                toast.error('Please upload a certificate file');
                return;
            }

            await certificateService.createCertificate(formData);
            toast.success('Certificate created successfully');
            setOpenAddModal(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Creation failed');
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await certificateService.updateCertificate(currentCert._id, currentCert);
            toast.success('Certificate updated successfully');
            setOpenEditModal(false);
            fetchData();
        } catch (error) {
            toast.error('Update failed');
        }
    };

    return (
        <div className="min-h-full font-plus-jakarta flex flex-col gap-4 bg-white" style={{ padding: '16px' }}>

            {/* Table Area */}
            <div className="bg-white overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-200 rounded-xl">
                {/* Header Row */}
                <div className="px-4 py-2 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center bg-slate-50/50 gap-4">
                    <div className="flex items-center gap-3">
                        <h3 className="text-[12px] font-bold text-slate-800">Certificates Library</h3>
                        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                            <span className="text-[9px] text-slate-400 font-medium">Manage and generate certificates</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                        <div className="relative">
                            <input type="text" placeholder="Search ID or Name..."
                                className="text-[10px] px-2.5 py-1 pl-7 border border-slate-200 rounded-md focus:outline-none focus:border-[#011d52] focus:ring-1 focus:ring-[#011d52]/20 bg-white w-48" />
                            <svg className="w-3.5 h-3.5 absolute left-2 top-[6px] text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <button className="text-[10px] font-semibold bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-600 hover:bg-slate-50 transition-colors">
                            Filter
                        </button>
                        <button onClick={() => setOpenAddModal(true)}
                            className="text-[10px] font-semibold bg-[#011d52] text-white border border-[#011d52] px-2.5 py-1 rounded-md hover:bg-[#03173d] transition-colors flex items-center gap-1">
                            + Add Certificate
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-slate-100">
                                <th className="px-4 py-1.5 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Owner</th>
                                <th className="px-4 py-1.5 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Details</th>
                                <th className="px-4 py-1.5 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Validity</th>
                                <th className="px-4 py-1.5 text-[8px] text-slate-400 uppercase font-bold tracking-widest text-center">Status</th>
                                <th className="px-4 py-1.5 text-[8px] text-slate-400 uppercase font-bold tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[slate-200]">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-10 text-[10px] font-bold text-slate-500">LOADING...</td></tr>
                            ) : certificates.map((cert) => (
                                <tr key={cert._id} className="border-b border-slate-50 hover:bg-[#f8fafc] transition-colors group">
                                    <td className="px-4 py-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-800">
                                                {cert.user?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-[11px] font-semibold text-slate-800 leading-tight">{cert.user?.name || 'N/A'}</p>
                                                <p className="text-[9px] text-slate-400 mt-0.5 uppercase">ID: {cert.user?.bsmr_id || cert.user?._id?.substring(0,8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex flex-col">
                                            <p className="text-[11px] font-semibold text-slate-800 leading-tight">{cert.certificate_name}</p>
                                            <p className="text-[9px] text-slate-400 mt-0.5 font-bold uppercase tracking-widest">{cert.certificate_number}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex flex-col">
                                            <div className="text-[9px] text-slate-500">Issued: {cert.issue_date ? new Date(cert.issue_date).toLocaleDateString() : 'N/A'}</div>
                                            <div className="text-[9px] font-semibold text-slate-800 mt-0.5">Expiry: {cert.expiry_date ? new Date(cert.expiry_date).toLocaleDateString() : 'Lifetime'}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <span 
                                            className="text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                                            style={{
                                                backgroundColor: cert.status === 'active' ? '#ecfdf5' : '#fffbeb',
                                                color: cert.status === 'active' ? '#10b981' : '#f59e0b',
                                                border: `1px solid ${cert.status === 'active' ? '#a7f3d0' : '#fde68a'}`
                                            }}>
                                            {cert.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setCurrentCert({ ...cert, user_id: cert.user?._id }); setOpenEditModal(true); }}
                                                className="p-1 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded transition-colors">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button onClick={() => handleDelete(cert._id)}
                                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && certificates.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-4 py-12 text-center">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">No certificates found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Modal */}
            {openAddModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
                        <div className="px-5 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#011d52]"></span>
                                New Certificate
                            </h3>
                            <button onClick={() => setOpenAddModal(false)} className="text-slate-400 hover:text-slate-800 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <form className="p-5 space-y-4" onSubmit={handleAddSubmit}>
                            
                            {/* Row 1: 2 Columns */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Assign User *</label>
                                    <select 
                                        name="user_id"
                                        value={currentCert.user_id}
                                        onChange={handleFormChange}
                                        className="w-full text-[10px] font-bold border border-slate-200 bg-white text-slate-800 rounded-md px-3 py-2 outline-none focus:border-[#011d52] transition-colors appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="">Select User</option>
                                        {users.map(u => (
                                            <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Certificate Title *</label>
                                    <input type="text" name="certificate_name" value={currentCert.certificate_name} onChange={handleFormChange} 
                                        className="w-full text-[10px] border border-slate-200 bg-white text-slate-800 rounded-md px-3 py-2 outline-none focus:border-[#011d52] transition-colors" placeholder="e.g. Master Gold Cert" required />
                                </div>
                            </div>

                            {/* Row 2: 3 Columns */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Certificate Number</label>
                                    <input type="text" name="certificate_number" value={currentCert.certificate_number} onChange={handleFormChange} 
                                        className="w-full text-[10px] border border-slate-200 bg-white text-slate-800 rounded-md px-3 py-2 outline-none focus:border-[#011d52] transition-colors uppercase font-bold" placeholder="e.g. CERT-2026-X" />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Issue Date *</label>
                                    <input type="date" name="issue_date" value={currentCert.issue_date} onChange={handleFormChange} 
                                        className="w-full text-[10px] border border-slate-200 bg-white text-slate-800 rounded-md px-3 py-2 outline-none focus:border-[#011d52] transition-colors" required />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Expiry Date</label>
                                    <input type="date" name="expiry_date" value={currentCert.expiry_date} onChange={handleFormChange} 
                                        className="w-full text-[10px] border border-slate-200 bg-white text-slate-800 rounded-md px-3 py-2 outline-none focus:border-[#011d52] transition-colors" />
                                </div>
                            </div>

                            {/* Row 3: Full Width Upload */}
                            <div>
                                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Certificate Document</label>
                                <div className="border border-dashed border-slate-200 rounded-md p-3 bg-slate-50 flex flex-col items-center justify-center hover:border-[#011d52] hover:bg-[#011d52]/5 transition-all group cursor-pointer relative">
                                    <svg className="w-5 h-5 text-slate-400 mb-1 group-hover:text-[#011d52] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeWidth="2" /></svg>
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-[#011d52] transition-colors">{selectedFile ? selectedFile.name : 'Upload PDF / JPG Image'}</span>
                                    <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                            </div>
                            
                            <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 mt-5">
                                <button type="button" onClick={() => setOpenAddModal(false)} 
                                    className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded-md hover:bg-slate-50 transition-colors">Discard</button>
                                <button type="submit" 
                                    className="px-4 py-1.5 bg-[#011d52] text-white text-[10px] font-bold border border-[#011d52] rounded-md hover:bg-[#021133] transition-colors">Save Certificate</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {openEditModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
                        <div className="px-5 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#011d52]"></span>
                                Update Certificate
                            </h3>
                            <button onClick={() => setOpenEditModal(false)} className="text-slate-400 hover:text-slate-800 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <form className="p-5 space-y-4" onSubmit={handleEditSubmit}>
                            
                            {/* Row 1: 2 Columns */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Certificate Title *</label>
                                    <input type="text" name="certificate_name" value={currentCert.certificate_name} onChange={handleFormChange} 
                                        className="w-full text-[10px] border border-slate-200 bg-white text-slate-800 rounded-md px-3 py-2 outline-none focus:border-[#011d52] transition-colors" required />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Certificate Number</label>
                                    <input type="text" name="certificate_number" value={currentCert.certificate_number} onChange={handleFormChange} 
                                        className="w-full text-[10px] border border-slate-200 bg-white text-slate-800 rounded-md px-3 py-2 outline-none focus:border-[#011d52] transition-colors font-bold uppercase" />
                                </div>
                            </div>
                            
                            {/* Row 2: 3 Columns */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Issue Date *</label>
                                    <input type="date" name="issue_date" value={currentCert.issue_date ? currentCert.issue_date.split('T')[0] : ''} onChange={handleFormChange} 
                                        className="w-full text-[10px] border border-slate-200 bg-white text-slate-800 rounded-md px-3 py-2 outline-none focus:border-[#011d52] transition-colors" required />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Expiry Date</label>
                                    <input type="date" name="expiry_date" value={currentCert.expiry_date ? currentCert.expiry_date.split('T')[0] : ''} onChange={handleFormChange} 
                                        className="w-full text-[10px] border border-slate-200 bg-white text-slate-800 rounded-md px-3 py-2 outline-none focus:border-[#011d52] transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</label>
                                    <select name="status" value={currentCert.status} onChange={handleFormChange} 
                                        className="w-full text-[10px] font-bold border border-slate-200 bg-white text-slate-800 rounded-md px-3 py-2 outline-none focus:border-[#011d52] transition-colors appearance-none cursor-pointer">
                                        <option value="active">Active</option>
                                        <option value="expired">Expired</option>
                                        <option value="revoked">Revoked</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 mt-5">
                                <button type="button" onClick={() => setOpenEditModal(false)} 
                                    className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded-md hover:bg-slate-50 transition-colors">Cancel</button>
                                <button type="submit" 
                                    className="px-4 py-1.5 bg-[#011d52] text-white text-[10px] font-bold border border-[#011d52] rounded-md hover:bg-[#021133] transition-colors">Update Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Certificates;
