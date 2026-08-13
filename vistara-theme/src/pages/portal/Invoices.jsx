import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import agreementService from "../../services/agreementService";

export default function Invoices() {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [fetchingData, setFetchingData] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await agreementService.getAccountServices();
                if (res.success) {
                    setInvoices(res.invoices || []);
                }
            } catch (err) {
                console.error("Failed to load invoices:", err);
            } finally {
                setFetchingData(false);
            }
        };
        fetchInvoices();
    }, []);

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", color: "#1b2c42", paddingBottom: "40px" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 style={{ color: "#011D52", fontWeight: "800", fontSize: "24px", letterSpacing: "-0.5px", margin: "0 0 4px 0" }}>All Invoices</h2>
                    <p style={{ color: "#64748b", margin: 0, fontSize: "13px" }}>View your complete payment history and download invoices.</p>
                </div>
                <button
                    onClick={() => navigate('/portal/profile')}
                    style={{ padding: "8px 16px", backgroundColor: "#f1f5f9", color: "#011D52", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}
                >
                    &larr; Back to Profile
                </button>
            </div>

            <div style={{ padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
                {fetchingData ? (
                    <div style={{ textAlign: "center", padding: "40px" }}>Loading invoices...</div>
                ) : invoices && invoices.length > 0 ? (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#f8fafc", textAlign: "left" }}>
                                    <th style={{ padding: "12px 16px", borderBottom: "1px solid #cbd5e1", color: "#475569", fontWeight: "700" }}>Invoice #</th>
                                    <th style={{ padding: "12px 16px", borderBottom: "1px solid #cbd5e1", color: "#475569", fontWeight: "700" }}>Amount</th>
                                    <th style={{ padding: "12px 16px", borderBottom: "1px solid #cbd5e1", color: "#475569", fontWeight: "700" }}>Date</th>
                                    <th style={{ padding: "12px 16px", borderBottom: "1px solid #cbd5e1", color: "#475569", fontWeight: "700" }}>Status</th>
                                    <th style={{ padding: "12px 16px", borderBottom: "1px solid #cbd5e1", color: "#475569", fontWeight: "700", textAlign: "right" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((inv, idx) => (
                                    <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                        <td style={{ padding: "16px", color: "#0f172a", fontWeight: "600" }}>{inv.invoice_number || '-'}</td>
                                        <td style={{ padding: "16px", fontWeight: "800", color: "#011D52" }}>₹{inv.amount}</td>
                                        <td style={{ padding: "16px", color: "#64748b" }}>{new Date(inv.createdAt).toLocaleDateString()}</td>
                                        <td style={{ padding: "16px" }}>
                                            <span style={{ 
                                                padding: "4px 10px", 
                                                borderRadius: "20px", 
                                                fontSize: "11px", 
                                                fontWeight: "800", 
                                                backgroundColor: (inv.status === 'paid' || !inv.status) ? "rgba(22, 163, 74, 0.1)" : "rgba(220, 38, 38, 0.1)",
                                                color: (inv.status === 'paid' || !inv.status) ? "#16a34a" : "#dc2626", 
                                                textTransform: "uppercase" 
                                            }}>
                                                {inv.status ? inv.status.toUpperCase() : 'PAID'}
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <button 
                                                onClick={() => navigate(`/portal/invoices/${inv._id}`, { state: { invoice: inv } })}
                                                style={{ padding: "6px 12px", backgroundColor: "#011D52", color: "#fff", border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ padding: "40px", borderRadius: "8px", backgroundColor: "#f8fafc", border: "1px dashed #cbd5e1", textAlign: "center" }}>
                        <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>No payment history available.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
