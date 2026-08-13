import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function AdminInvoiceDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id, invoiceId } = useParams();

    const invoice = location.state?.invoice;
    const customer = location.state?.customer;

    useEffect(() => {
        if (!invoice || !customer) {
            // If accessed directly without state, redirect back to customer details
            navigate(`/admin/customers/${id}`);
        }
    }, [invoice, customer, id, navigate]);

    if (!invoice || !customer) return null;

    // Formatting dates
    const invoiceDate = new Date(invoice.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    let servicePeriod = "N/A";
    if (invoice.service_start_date && invoice.service_end_date) {
        const start = new Date(invoice.service_start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const end = new Date(invoice.service_end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        servicePeriod = `${start} to ${end}`;
    }

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", color: "#1b2c42", paddingBottom: "40px", maxWidth: "900px", margin: "20px auto" }}>
            <div className="d-flex justify-content-between align-items-center mb-4 flex justify-between">
                <button
                    onClick={() => navigate(-1)}
                    style={{ padding: "8px 16px", backgroundColor: "#f1f5f9", color: "#011D52", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}
                >
                    &larr; Back to Customer
                </button>
                <button
                    onClick={() => window.print()}
                    style={{ padding: "8px 16px", backgroundColor: "#011D52", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}
                >
                    <i className="fa-solid fa-print me-2"></i> Print Invoice
                </button>
            </div>

            {/* Invoice Printable Area */}
            <div 
                id="invoice-printable"
                style={{ 
                    backgroundColor: "#fff", 
                    padding: "40px", 
                    borderRadius: "8px", 
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    border: "1px solid #e2e8f0"
                }}
            >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #011D52", paddingBottom: "20px", marginBottom: "30px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginRight: "10px" }}>
                            <img src="/vistaralogo.svg" alt="Vishtara Logo" style={{ height: "60px", width: "auto" }} />
                        </div>
                        <div>
                            <h1 style={{ margin: 0, color: "#011D52", fontSize: "24px", fontWeight: "800" }}>Vishtara Capital Research</h1>
                            <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#64748b", maxWidth: "250px" }}>
                                123, Financial District, Corporate Block,<br/>
                                City Center, Bharat - 110001<br/>
                                support@vishtaracapital.com
                            </p>
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ color: "#011D52", fontSize: "12px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase" }}>INVOICE</div>
                        <h2 style={{ margin: "5px 0 10px 0", fontSize: "24px", color: "#0f172a" }}># {invoice.invoice_number}</h2>
                        <span style={{ 
                            padding: "4px 12px", 
                            backgroundColor: (invoice.status === 'paid' || !invoice.status) ? "#16a34a" : "#dc2626", 
                            color: "#fff", 
                            fontSize: "10px", 
                            fontWeight: "800", 
                            borderRadius: "4px",
                            textTransform: "uppercase"
                        }}>
                            {invoice.status ? invoice.status : 'PAID'}
                        </span>
                    </div>
                </div>

                {/* Bill To & Info */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
                    <div>
                        <div style={{ color: "#011D52", fontSize: "12px", fontWeight: "800", fontStyle: "italic", marginBottom: "8px" }}>BILL TO</div>
                        <div style={{ fontWeight: "700", fontSize: "15px", color: "#0f172a" }}>{customer?.name || "Client"}</div>
                        <div style={{ fontSize: "13px", color: "#475569", marginTop: "4px" }}>{customer?.email}</div>
                        <div style={{ fontSize: "13px", color: "#475569", marginTop: "2px" }}>{customer?.phone}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "20px", marginBottom: "5px" }}>
                            <span style={{ fontSize: "12px", color: "#64748b", fontStyle: "italic" }}>Invoice Date</span>
                            <span style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", minWidth: "100px" }}>{invoiceDate}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}>
                            <span style={{ fontSize: "12px", color: "#64748b", fontStyle: "italic" }}>Amount</span>
                            <span style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", minWidth: "100px" }}>Rs. {invoice.amount?.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "30px" }}>
                    <thead>
                        <tr>
                            <th style={{ borderBottom: "2px solid #011D52", borderTop: "1px solid #e2e8f0", padding: "12px 8px", textAlign: "left", color: "#011D52", fontSize: "12px", fontStyle: "italic" }}>#</th>
                            <th style={{ borderBottom: "2px solid #011D52", borderTop: "1px solid #e2e8f0", padding: "12px 8px", textAlign: "left", color: "#011D52", fontSize: "12px", fontStyle: "italic" }}>DESCRIPTION</th>
                            <th style={{ borderBottom: "2px solid #011D52", borderTop: "1px solid #e2e8f0", padding: "12px 8px", textAlign: "right", color: "#011D52", fontSize: "12px", fontStyle: "italic" }}>QTY</th>
                            <th style={{ borderBottom: "2px solid #011D52", borderTop: "1px solid #e2e8f0", padding: "12px 8px", textAlign: "right", color: "#011D52", fontSize: "12px", fontStyle: "italic" }}>RATE</th>
                            <th style={{ borderBottom: "2px solid #011D52", borderTop: "1px solid #e2e8f0", padding: "12px 8px", textAlign: "right", color: "#011D52", fontSize: "12px", fontStyle: "italic" }}>AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ borderBottom: "1px solid #e2e8f0", padding: "16px 8px", fontSize: "13px", verticalAlign: "top" }}>1</td>
                            <td style={{ borderBottom: "1px solid #e2e8f0", padding: "16px 8px" }}>
                                <div style={{ fontWeight: "700", fontSize: "14px", fontStyle: "italic", color: "#0f172a" }}>
                                    Vishtara Capital Research Service
                                </div>
                                {invoice.service_start_date && (
                                    <div style={{ fontSize: "11px", color: "#64748b", marginTop: "6px" }}>
                                        Service Period: {servicePeriod}
                                    </div>
                                )}
                            </td>
                            <td style={{ borderBottom: "1px solid #e2e8f0", padding: "16px 8px", textAlign: "right", fontSize: "13px" }}>1.00</td>
                            <td style={{ borderBottom: "1px solid #e2e8f0", padding: "16px 8px", textAlign: "right", fontSize: "13px" }}>Rs. {invoice.amount?.toFixed(2)}</td>
                            <td style={{ borderBottom: "1px solid #e2e8f0", padding: "16px 8px", textAlign: "right", fontSize: "13px" }}>Rs. {invoice.amount?.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Totals */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "30px" }}>
                    <div style={{ width: "300px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px" }}>
                            <span style={{ fontStyle: "italic", color: "#64748b" }}>Sub Total</span>
                            <span style={{ fontWeight: "700" }}>Rs. {invoice.amount?.toFixed(2)}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px", borderBottom: "1px solid #e2e8f0" }}>
                            <span style={{ fontStyle: "italic", color: "#64748b" }}>Total</span>
                            <span style={{ fontWeight: "700" }}>Rs. {invoice.amount?.toFixed(2)}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 8px", backgroundColor: "#011D52", color: "#fff", fontSize: "14px", fontWeight: "700", marginTop: "10px" }}>
                            <span style={{ fontStyle: "italic" }}>Amount Paid</span>
                            <span>Rs. {invoice.amount?.toFixed(2)}</span>
                        </div>
                        <div style={{ textAlign: "right", fontSize: "10px", color: "#64748b", marginTop: "8px" }}>
                            Total In Words: INR {invoice.amount} Only
                        </div>
                    </div>
                </div>

                {/* Footer Text */}
                <div style={{ fontSize: "9px", color: "#94a3b8", textAlign: "center", marginBottom: "30px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
                    This is a system generated invoice. No signature required.
                    <br/>
                    website: www.vishtaracapital.com | Support: +91 86020 27324
                </div>

                {/* Policies at the end as requested */}
                <div style={{ fontSize: "10px", color: "#475569", lineHeight: "1.5" }}>
                    <h4 style={{ fontSize: "11px", fontWeight: "700", color: "#011D52", marginBottom: "6px" }}>Terms & Conditions</h4>
                    <p style={{ marginBottom: "4px" }}>By using our services, you agree that fees once paid are non-refundable unless explicitly stated otherwise. You must not misuse, hack, or attempt unauthorized access to the platform. We reserve the right to suspend or terminate your access if you violate these Terms and Conditions.</p>
                    
                    <h4 style={{ fontSize: "11px", fontWeight: "700", color: "#011D52", marginTop: "12px", marginBottom: "6px" }}>Disclaimers</h4>
                    <p style={{ marginBottom: "4px" }}>Trading/investing in the Stock Market involves considerable systemic volatility. You can lose part or all of your underlying principal asset capital pool. All outputs distributed must be strictly consumed as independent market observations, not financial guidance counsel.</p>
                    <p style={{ marginBottom: "4px" }}>We issue zero profit commitments. We hold zero liability for loss matrices incurred by the user based on views generated across our platforms.</p>
                    <p>Vishtara Capital Research confirms that no automated Artificial Intelligence (AI) generation tools are deployed to form or construct core research recommendations.</p>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #invoice-printable, #invoice-printable * {
                        visibility: visible;
                    }
                    #invoice-printable {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        box-shadow: none;
                        border: none;
                    }
                }
            ` }} />
        </div>
    );
}
