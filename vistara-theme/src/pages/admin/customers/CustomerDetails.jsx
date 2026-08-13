import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { BASE_URL } from '../../../services/api';
import toast from 'react-hot-toast';
import RefundModal from './components/RefundModal';
import ManualAllocationModal from './components/ManualAllocationSection';
import SubscriptionDetailsModal from './components/SubscriptionDetailsModal';
import AdminInvoiceModal from './components/AdminInvoiceModal';

const CustomerDetails = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
    const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const fetchDetails = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/customers/${id}`);
            setData(res.data.data);
        } catch (error) {
            toast.error('Failed to load identity records');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-full flex items-center justify-center bg-white p-4">
                <div className="w-8 h-8 border-2 border-t-transparent border-[#011D52] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!data) return <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-white min-h-full">Identity Not Found</div>;

    const { user = {}, kyc = {}, subscriptions = [], invoices = [], agreements = [], refunds = [] } = data;

    const getFullUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const baseUrlClean = BASE_URL.replace(/\/$/, '');
        const pathClean = path.startsWith('/') ? path : `/${path}`;
        return `${baseUrlClean}${pathClean}`;
    };

    const displayRefunds = (refunds && refunds.length > 0) ? refunds : [
        { _id: 'dummy1', refund_id: 'REF-DUMMY-01', amount: 0, status: 'Simulated', createdAt: new Date() }
    ];

    const getAadhaar = () => {
        return user.adhar_card || kyc?.kyc_details?.aadhaar || kyc?.aadhaar_details?.id_number || 'NOT_VERIFIED';
    };

    const getPan = () => {
        return user.pan_card || kyc?.kyc_details?.pan || 'NOT_VERIFIED';
    };

    const calculateDays = (start, end) => {
        const diffTime = Math.abs(new Date(end) - new Date(start));
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="min-h-full p-4 flex flex-col gap-4 bg-white">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3 gap-4">
                <div>
                    <nav className="flex text-[8px] font-bold uppercase tracking-widest mb-1.5 text-slate-400">
                        <Link to="/admin/customers" className="hover:text-[#011D52] transition-colors">Directory</Link>
                        <span className="mx-1.5 text-slate-200">/</span>
                        <span className="text-slate-800">Entity Details</span>
                    </nav>
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-[13px] font-bold text-slate-800 uppercase">{user.name}</h2>
                        <div className="flex gap-1.5">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${user.status === 'active' ? 'bg-[#ecfdf5] text-[#10b981] border-[#a7f3d0]' : 'bg-[#fef2f2] text-[#ef4444] border-[#fecaca]'
                                }`}>
                                {user.status || 'active'}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${['approved', 'completed', 'success'].includes(user.kyc_status?.toLowerCase()) || ['approved', 'completed', 'success'].includes(kyc?.status?.toLowerCase()) ? 'bg-blue-50 text-[#011D52] border-blue-200' : 'bg-[#fffbeb] text-[#f59e0b] border-[#fde68a]'
                                }`}>
                                KYC: {user.kyc_status || kyc?.status || 'none'}
                            </span>
                        </div>
                    </div>
                    <p className="text-[8px] font-bold uppercase tracking-widest mt-1 text-slate-400">Identity ID: {user.smra_id || user.bsmr_id || user._id}</p>
                </div>

                <div className="flex gap-2">
                    <button onClick={() => setIsAllocationModalOpen(true)} className="px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest transition shadow-sm bg-[#10b981] text-white hover:bg-[#059669]">
                        Assign Service
                    </button>
                    <button onClick={() => setIsRefundModalOpen(true)} className="px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest transition shadow-sm bg-[#011D52] text-white hover:bg-[#02143a]">
                        Initiate Refund
                    </button>
                    <Link to="/admin/customers" className="px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest transition bg-white text-slate-600 border border-slate-200 hover:bg-slate-50">
                        Exit View
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Sidebar Column (Left Section) */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-200 p-4 text-center">
                        <div className="w-16 h-16 rounded-xl mx-auto mb-3 flex items-center justify-center text-[14px] font-black overflow-hidden bg-slate-50 border border-slate-200 text-slate-400">
                            {user.image ? <img src={getFullUrl(user.image)} className="w-full h-full object-cover" /> : (user.name ? user.name.substring(0, 2).toUpperCase() : '??')}
                        </div>
                        <h3 className="text-[12px] font-bold text-slate-800 tracking-tight">{user.name || 'Anonymous User'}</h3>
                        <p className="text-[10px] font-medium mt-0.5 text-slate-500">{user.email || 'No email record'}</p>
                        <p className="text-[9px] font-bold font-mono mt-1 text-[#011D52] bg-blue-50 py-0.5 px-2 rounded-full inline-block border border-blue-100">{user.phone}</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-200 p-4">
                        <h4 className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-3">Metadata</h4>
                        <div className="space-y-2.5">
                            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Onboarded</span>
                                <span className="text-[10px] font-bold text-slate-800">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Income</span>
                                <span className="text-[10px] font-bold text-slate-800 uppercase">{user.annual_income || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-200 p-4">
                        <h3 className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-3">Executed Agreements</h3>
                        <div className="space-y-2.5">
                            {agreements.length > 0 ? agreements.map(agr => (
                                <div key={agr._id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 transition-all group hover:-translate-y-0.5 hover:border-blue-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-6 h-6 rounded flex items-center justify-center text-[10px] bg-white border border-slate-200 text-[#011D52]">
                                            <i className="fa-solid fa-file-signature"></i>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold uppercase tracking-tight text-[#011D52]">#{agr.agreement_number || 'GEN-882'}</p>
                                            <p className="text-[7px] font-bold uppercase tracking-widest text-slate-400">{new Date(agr.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    {agr.pdf_path ? (
                                        <a href={getFullUrl(agr.pdf_path)} target="_blank" rel="noreferrer" className="block text-center py-1.5 rounded text-[8px] font-bold uppercase tracking-widest transition bg-[#011D52] border border-[#011D52] text-white hover:bg-[#02143a]">View Document</a>
                                    ) : (
                                        <div className="block text-center py-1.5 rounded text-[8px] font-bold uppercase tracking-widest bg-slate-100 border border-slate-200 text-slate-400">Pending E-Sign</div>
                                    )}
                                </div>
                            )) : (
                                <p className="text-[8px] font-bold uppercase italic text-slate-400 text-center py-2">No documents found</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-200 p-4">
                        <h3 className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-3">Return Ledger</h3>
                        <div className="space-y-2.5">
                            {displayRefunds.map(ref => (
                                <div key={ref._id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                                    <div>
                                        <p className="text-[8px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">{ref.refund_id}</p>
                                        <span className="text-[7px] font-bold uppercase px-1 py-0.5 rounded border bg-white border-slate-200 text-slate-500">{ref.status}</span>
                                    </div>
                                    <p className="text-[11px] font-black text-slate-800">₹{ref.amount?.toLocaleString('en-IN')}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 flex flex-col gap-4">
                    {/* KYC Section */}
                    <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-200 p-4">
                        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-800">Identity Record Artifacts</h3>
                            <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200">SECURE VAULT</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mb-6">
                            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Aadhaar Identity</span>
                                <span className="text-[10px] font-bold tracking-tighter text-[#011D52] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{getAadhaar()}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Verified Address</span>
                                <span className="text-[9px] font-medium leading-tight text-right max-w-[150px] text-slate-700">{user.address || kyc?.kyc_details?.address || kyc?.aadhaar_details?.address || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">PAN Identity</span>
                                <span className="text-[10px] font-bold tracking-widest uppercase text-[#011D52] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{getPan()}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Digio Doc ID</span>
                                <span className="text-[9px] font-bold font-mono break-all text-right max-w-[150px] text-slate-700">{kyc?.digio_document_id || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                                { label: 'Identity Selfie', url: getFullUrl(kyc?.selfie_image) },
                                { label: 'E-Signature', url: getFullUrl(kyc?.signature_image) },
                                { label: 'Aadhaar Record', url: getFullUrl(kyc?.aadhaar_image || user.adhar_card_image) }
                            ].map((doc, idx) => (
                                <div key={idx} className="flex flex-col gap-1.5">
                                    <p className="text-[8px] font-bold uppercase tracking-widest text-center text-slate-400">{doc.label}</p>
                                    <div className="aspect-[4/3] rounded-xl overflow-hidden flex items-center justify-center group relative transition-all bg-slate-50 border border-slate-200">
                                        {doc.url ? (
                                            <>
                                                <img src={doc.url} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt={doc.label} />
                                                <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <a href={doc.url} target="_blank" rel="noreferrer" className="px-2 py-1 rounded-md text-[8px] font-bold uppercase tracking-widest hover:scale-105 transition bg-[#011D52] text-white shadow-sm">Inspect</a>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-[7px] font-bold uppercase text-slate-300">MISSING</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Subscription Ledger */}
                    <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden">
                        <div className="px-4 pt-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-800">Service Subscription Ledger</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-4 py-2 text-[8px] font-bold uppercase tracking-widest text-slate-400">Plan Designation</th>
                                        <th className="px-4 py-2 text-[8px] font-bold uppercase tracking-widest text-center text-slate-400">Status</th>
                                        <th className="px-4 py-2 text-[8px] font-bold uppercase tracking-widest text-slate-400">Validity Node</th>
                                        <th className="px-4 py-2 text-[8px] font-bold uppercase tracking-widest text-center text-slate-400">Days</th>
                                        <th className="px-4 py-2 text-[8px] font-bold uppercase tracking-widest text-right text-slate-400">Value (INR)</th>
                                        <th className="px-4 py-2 text-[8px] font-bold uppercase tracking-widest text-center text-slate-400">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subscriptions.length > 0 ? subscriptions.map(sub => (
                                        <tr key={sub._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="text-[10px] font-bold text-slate-800">{sub.status?.toLowerCase() === 'demo' ? 'Free Trial / Demo' : (sub.service_plan?.name || 'PLAN_NOT_RESOLVED')}</div>
                                                <div className="text-[8px] font-bold uppercase mt-0.5 text-slate-400">{sub.status?.toLowerCase() === 'demo' ? 'TRIAL' : (sub.service_plan_duration?.duration || 'N/A')}</div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-1.5 py-0.5 rounded text-[7px] font-bold uppercase tracking-widest border ${sub.status === 'active' ? 'bg-[#ecfdf5] text-[#10b981] border-[#a7f3d0]' : 'bg-slate-50 text-slate-500 border-slate-200'
                                                    }`}>
                                                    {sub.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-[9px] font-medium text-slate-600">{new Date(sub.start_date).toLocaleDateString()} - {new Date(sub.end_date).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="text-[10px] font-bold text-slate-700 bg-slate-100 inline-block px-1.5 py-0.5 rounded">{sub.payment_payload?.grantedDays || calculateDays(sub.start_date, sub.end_date)}</div>
                                            </td>
                                            <td className="px-4 py-3 text-right font-black text-[11px] text-slate-800">
                                                ₹{sub.amount?.toLocaleString('en-IN')}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button onClick={() => setSelectedSubscription(sub)} className="text-[7px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-[#011D52]/20 text-[#011D52] bg-blue-50 hover:bg-[#011D52] hover:text-white transition-colors">
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="6" className="px-4 py-8 text-center text-[9px] font-bold uppercase tracking-widest italic text-slate-400">No historical subscriptions found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Invoices Section */}
                    <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-200 p-4">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest mb-3 border-b border-slate-100 pb-2 text-slate-800">Financial Invoices</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {invoices.length > 0 ? invoices.map(inv => (
                                <div key={inv._id} className="flex justify-between items-center p-3 rounded-lg border border-slate-100 bg-slate-50 transition-all hover:-translate-y-0.5 hover:border-blue-200">
                                    <div>
                                        <p className="text-[8px] font-bold uppercase tracking-widest mb-0.5 text-slate-400">{inv.invoice_number}</p>
                                        <p className="text-[10px] font-bold text-[#011D52]">{inv.user_subscription?.service_plan?.name || 'Institutional Service'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[11px] font-black text-slate-800">₹{inv.amount?.toLocaleString('en-IN')}</p>
                                        <div className="flex gap-2 justify-end mt-1">
                                            <button onClick={() => setSelectedInvoice(inv)} className="text-[7px] font-bold uppercase tracking-widest hover:underline text-[#011D52]">View Invoice</button>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center py-6 text-[9px] font-bold uppercase italic col-span-2 text-slate-400">No financial artifacts found</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <RefundModal isOpen={isRefundModalOpen} onClose={() => setIsRefundModalOpen(false)} userId={user._id} subscriptionId={subscriptions[0]?._id} />
            <ManualAllocationModal isOpen={isAllocationModalOpen} onClose={() => setIsAllocationModalOpen(false)} userId={user._id} onAllocationSuccess={fetchDetails} />
            <SubscriptionDetailsModal isOpen={!!selectedSubscription} onClose={() => setSelectedSubscription(null)} subscription={selectedSubscription} />
            <AdminInvoiceModal isOpen={!!selectedInvoice} onClose={() => setSelectedInvoice(null)} invoice={selectedInvoice} customer={user} />
        </div>
    );
};

export default CustomerDetails;
