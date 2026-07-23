import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import employeeService from '../../../services/employeeService';
import designationService from '../../../services/designationService';
import toast from 'react-hot-toast';

const CreateEmployee = () => {
    const navigate = useNavigate();
    const [designations, setDesignations] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);
    const [loadingMasters, setLoadingMasters] = useState(true);

    // Form Wizard State
    const [formStep, setFormStep] = useState(1);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        profilePhoto: null,
        profilePhotoPreview: null,
        password: '',
        confirmPassword: '',
        designationId: '',
        reportingTo: '',
        joiningDate: new Date().toISOString().split('T')[0],
        status: 'Active'
    });

    // Fetch master data independently to prevent one error from blocking everything
    const fetchMasters = async () => {
        setLoadingMasters(true);
        try {
            const desRes = await designationService.getDesignations();
            if (desRes && desRes.success) {
                setDesignations(desRes.data);
            }
        } catch (error) {
            console.error('Failed to load designations', error);
        }

        try {
            const empRes = await employeeService.getEmployees({ limit: 1000 });
            if (empRes && empRes.success) {
                setAllEmployees(empRes.data);
            }
        } catch (error) {
            console.error('Failed to load reporting managers', error);
        }
        setLoadingMasters(false);
    };

    useEffect(() => {
        fetchMasters();
    }, []);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({
                ...form,
                profilePhoto: file,
                profilePhotoPreview: URL.createObjectURL(file)
            });
        }
    };

    const handleNextStep = () => {
        if (formStep === 1) {
            if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.phone.trim()) {
                toast.error('Please fill in all required basic information fields.');
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.email)) {
                toast.error('Please enter a valid email address.');
                return;
            }
            setFormStep(2);
        } else if (formStep === 2) {
            if (!form.password) {
                toast.error('Password is required.');
                return;
            }
            if (form.password.length < 6) {
                toast.error('Password must be at least 6 characters.');
                return;
            }
            if (form.password !== form.confirmPassword) {
                toast.error('Passwords do not match.');
                return;
            }
            setFormStep(3);
        }
    };

    const handlePrevStep = () => {
        setFormStep(formStep - 1);
    };

    const validateHierarchy = (empDesignationId, managerId) => {
        if (!managerId) return true;
        
        const empDesignation = designations.find(d => d._id === empDesignationId);
        const managerEmp = allEmployees.find(e => e._id === managerId);

        if (!empDesignation || !managerEmp || !managerEmp.designationId) return true;

        let managerDesignation = managerEmp.designationId;
        if (typeof managerDesignation === 'string') {
            managerDesignation = designations.find(d => d._id === managerDesignation);
        }
        if (!managerDesignation) return true;

        const isSalesHead = empDesignation.name?.trim().toLowerCase() === 'sales head';
        const isManagerAdmin = managerDesignation.name?.trim().toLowerCase() === 'admin';

        if (isSalesHead) {
            // Sales Head reports ONLY to Admin
            if (!isManagerAdmin) {
                toast.error('Hierarchy Warning: A Sales Head must report only to an Admin.');
                return false;
            }
            return true;
        }

        // Other designations cannot report directly to Admin
        if (isManagerAdmin) {
            toast.error('Hierarchy Warning: Only Sales Head can report directly to an Admin.');
            return false;
        }

        const managerLevel = managerDesignation.level;
        const employeeLevel = empDesignation.level;

        // Remember: level 1 is highest
        if (managerLevel >= employeeLevel) {
            toast.error(`Hierarchy Warning: A ${empDesignation.name} cannot report to a ${managerDesignation.name || 'subordinate'}. Manager must be higher in hierarchy.`);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.designationId || !form.joiningDate || !form.status) {
            toast.error('Please fill in all required employment fields.');
            return;
        }

        if (!validateHierarchy(form.designationId, form.reportingTo)) {
            return;
        }

        const formData = new FormData();
        formData.append('firstName', form.firstName);
        formData.append('lastName', form.lastName);
        formData.append('email', form.email);
        formData.append('phone', form.phone);
        formData.append('password', form.password);
        formData.append('designationId', form.designationId);
        if (form.reportingTo) formData.append('reportingTo', form.reportingTo);
        formData.append('joiningDate', form.joiningDate);
        formData.append('status', form.status);
        if (form.profilePhoto) {
            formData.append('profilePhoto', form.profilePhoto);
        }

        try {
            const res = await employeeService.createEmployee(formData);
            if (res.success) {
                toast.success('Employee created successfully!');
                navigate('/admin/employees');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create employee');
        }
    };

    const selectedDesig = designations.find(d => d._id === form.designationId);
    
    const getFilteredManagers = (selectedDesigId) => {
        if (!selectedDesigId) return [];
        const selD = designations.find(d => d._id === selectedDesigId);
        if (!selD) return [];

        const isSh = selD.name?.trim().toLowerCase() === 'sales head';
        const isAdmin = selD.name?.trim().toLowerCase() === 'admin';

        if (isAdmin) return [];

        return allEmployees.filter(emp => {
            let empDesig = emp.designationId;
            if (!empDesig) return false;

            if (typeof empDesig === 'string') {
                empDesig = designations.find(d => d._id === empDesig);
            }
            if (!empDesig) return false;

            const isEmpAdmin = empDesig.name?.trim().toLowerCase() === 'admin';

            if (isSh) {
                return isEmpAdmin;
            } else {
                if (isEmpAdmin) return false;
                return empDesig.level < selD.level;
            }
        });
    };

    return (
        <main className="min-h-full p-4 flex flex-col gap-4 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">Add New Employee</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Configure new staff credentials, role classifications, and organizational reporting lines</p>
                </div>
                <button
                    onClick={() => navigate('/admin/employees')}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-md font-bold text-[10px] uppercase tracking-widest transition-colors shadow-sm">
                    Back to List
                </button>
            </div>

            <div className="max-w-2xl mx-auto w-full space-y-4">
                {/* Step Banner / Progress */}
                <div className="flex items-center justify-between gap-2 bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 w-full">
                        <div className="flex items-center gap-2 flex-1">
                            <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-widest ${formStep >= 1 ? 'bg-[#011d52] text-white shadow-sm' : 'bg-slate-50 border border-slate-200 text-slate-500'}`}>1. Basic Info</span>
                            <div className={`h-[1px] flex-1 ${formStep >= 2 ? 'bg-[#011d52]' : 'bg-slate-200'}`}></div>
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                            <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-widest ${formStep >= 2 ? 'bg-[#011d52] text-white shadow-sm' : 'bg-slate-50 border border-slate-200 text-slate-500'}`}>2. Credentials</span>
                            <div className={`h-[1px] flex-1 ${formStep >= 3 ? 'bg-[#011d52]' : 'bg-slate-200'}`}></div>
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                            <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-widest ${formStep >= 3 ? 'bg-[#011d52] text-white shadow-sm' : 'bg-slate-50 border border-slate-200 text-slate-500'}`}>3. Employment</span>
                        </div>
                    </div>
                </div>

                {/* Main Form Card */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                    {loadingMasters && formStep === 3 ? (
                        <div className="text-center py-12 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                            <div className="w-6 h-6 border-2 border-[#011d52]/20 border-t-[#011d52] rounded-full animate-spin mx-auto mb-3"></div>
                            Loading master data registries...
                        </div>
                    ) : (
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                            {/* STEP 1: Basic Info */}
                            {formStep === 1 && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">First Name *</label>
                                            <input
                                                value={form.firstName}
                                                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 outline-none focus:border-[#011d52] transition-colors"
                                                placeholder="Priya"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Last Name *</label>
                                            <input
                                                value={form.lastName}
                                                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 outline-none focus:border-[#011d52] transition-colors"
                                                placeholder="Das"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Email Address *</label>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 outline-none focus:border-[#011d52] transition-colors"
                                            placeholder="priya@domain.com"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Phone Number *</label>
                                        <input
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 outline-none focus:border-[#011d52] transition-colors font-mono"
                                            placeholder="9876543210"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Profile Photo (Optional)</label>
                                        <div className="flex items-center gap-3 mt-2">
                                            {form.profilePhotoPreview ? (
                                                <img src={form.profilePhotoPreview} alt="Preview" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                                            ) : form.firstName ? (
                                                <div className="w-8 h-8 rounded-full bg-[#011d52]/10 flex items-center justify-center text-[#011d52] font-bold text-[9px] border border-[#011d52]/20 uppercase">
                                                    {form.firstName[0]}{form.lastName ? form.lastName[0] : ''}
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                className="text-[9px] text-slate-500 font-bold file:mr-2.5 file:py-1 file:px-2.5 file:rounded-md file:border file:border-slate-200 file:bg-slate-50 file:text-slate-500 hover:file:bg-[#011d52]/10 hover:file:text-slate-800 cursor-pointer outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: Password */}
                            {formStep === 2 && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Create Password *</label>
                                        <input
                                            type="password"
                                            value={form.password}
                                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 outline-none focus:border-[#011d52] transition-colors font-mono"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Confirm Password *</label>
                                        <input
                                            type="password"
                                            value={form.confirmPassword}
                                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 outline-none focus:border-[#011d52] transition-colors font-mono"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: Employment Details */}
                            {formStep === 3 && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Designation *</label>
                                        <select
                                            value={form.designationId}
                                            onChange={(e) => {
                                                const desigId = e.target.value;
                                                const selD = designations.find(d => d._id === desigId);
                                                const isAdmin = !!(selD && selD.name?.trim().toLowerCase() === 'admin');
                                                
                                                setForm(prev => {
                                                    let newReportingTo = prev.reportingTo;
                                                    if (isAdmin) {
                                                        newReportingTo = '';
                                                    } else {
                                                        const validManagers = getFilteredManagers(desigId);
                                                        const isValid = validManagers.some(m => m._id === prev.reportingTo);
                                                        if (!isValid) {
                                                            newReportingTo = '';
                                                        }
                                                    }
                                                    return {
                                                        ...prev,
                                                        designationId: desigId,
                                                        reportingTo: newReportingTo
                                                    };
                                                });
                                            }}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 outline-none focus:border-[#011d52] transition-colors cursor-pointer"
                                            required
                                        >
                                            <option value="">Select...</option>
                                            {designations.map(d => (
                                                <option key={d._id} value={d._id}>{d.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedDesig && selectedDesig.name?.trim().toLowerCase() !== 'admin' && (
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Reporting Manager</label>
                                            <select
                                                value={form.reportingTo}
                                                onChange={(e) => setForm({ ...form, reportingTo: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 outline-none focus:border-[#011d52] transition-colors cursor-pointer"
                                            >
                                                <option value="">Select Reporting Manager...</option>
                                                {getFilteredManagers(form.designationId).map(e => (
                                                    <option key={e._id} value={e._id}>
                                                        {e.firstName} {e.lastName} ({e.designationId?.name || 'No Designation'})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Joining Date *</label>
                                            <input
                                                type="date"
                                                value={form.joiningDate}
                                                onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 outline-none focus:border-[#011d52] transition-colors font-mono"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Status *</label>
                                            <select
                                                value={form.status}
                                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[10px] font-bold text-slate-800 outline-none focus:border-[#011d52] transition-colors cursor-pointer"
                                                required
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                                <option value="Resigned">Resigned</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Footer Controls */}
                            <div className="pt-6 border-t border-slate-200 flex justify-between gap-4">
                                {formStep > 1 && (
                                    <button
                                        type="button"
                                        onClick={handlePrevStep}
                                        className="bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 px-4 py-2 rounded-md font-bold text-[10px] uppercase tracking-widest transition-colors shadow-sm"
                                    >
                                        Back
                                    </button>
                                )}
                                <div className="flex-1"></div>
                                {formStep < 3 ? (
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        className="bg-[#011d52] hover:bg-[#02143a] text-white px-4 py-2 rounded-md font-bold text-[10px] uppercase tracking-widest transition-colors shadow-sm"
                                    >
                                        Continue
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="bg-[#011d52] hover:bg-[#02143a] text-white px-6 py-2 rounded-md font-bold text-[10px] uppercase tracking-widest transition-colors shadow-sm"
                                    >
                                        Save Employee
                                    </button>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </main>
    );
};

export default CreateEmployee;
