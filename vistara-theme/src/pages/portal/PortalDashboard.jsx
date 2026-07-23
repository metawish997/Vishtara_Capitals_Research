import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function PortalDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const kycStatus = user?.kyc_status || 'none';
  const isKycComplete = ['approved', 'verified', 'completed', 'success'].includes(kycStatus.toLowerCase());
  // const isKycComplete = kycStatus.toLowerCase() === '' || kycStatus.toLowerCase() === 'verified' || kycStatus.toLowerCase() === 'completed';

  console.log("Current KYC Status:", kycStatus);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: "#1b2c42" }}>


      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-10">
        <div>
          <h2 style={{ color: "#1B2B40", fontWeight: "800", fontSize: "24px", letterSpacing: "-0.5px", margin: "0 0 2px 0" }}>Welcome Back, {user?.name?.split(' ')[0] || 'User'}!</h2>
          <p style={{ color: "#64748b", margin: 0, fontSize: "13px" }}>Here is your real-time advisory overview for today.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {!isKycComplete && (
            <button
              onClick={() => navigate('/portal/kyc')}
              style={{
                padding: "6px 14px",
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                border: "none",
                borderRadius: "30px",
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "11px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                cursor: "pointer",
                boxShadow: "0 4px 6px -1px rgba(239, 68, 68, 0.2)"
              }}
            >
              ⚠️ Complete KYC
            </button>
          )}
          <div style={{
            padding: "6px 14px",
            background: "linear-gradient(135deg, rgba(208, 168, 92, 0.15) 0%, rgba(208, 168, 92, 0.05) 100%)",
            border: "1px solid var(--tp-finance-primary)",
            borderRadius: "30px",
            color: "#243F63",
            fontWeight: "700",
            fontSize: "11px",
            letterSpacing: "0.5px",
            textTransform: "uppercase"
          }}>
            ● Subscription Active (Pro)
          </div>
        </div>
      </div>


      <div style={{
        padding: "10px 16px",
        backgroundColor: "#fff2e6",
        borderLeft: "4px solid #ff9900",
        borderRadius: "6px",
        fontSize: "12px",
        color: "#b36b00",
        fontWeight: "600",
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <span>⚠️ <strong>Risk Warning:</strong> Trading in Futures &amp; Options carries high market risk. Ensure you execute trades strictly according to stop-loss targets.</span>
        <button style={{ background: "none", border: "none", color: "#b36b00", fontWeight: "700", cursor: "pointer", fontSize: "14px" }} onClick={(e) => e.target.parentElement.remove()}>&times;</button>
      </div>


      <div className="row mb-3">
        {[
          { title: "Total recommendations", value: "124 Calls", sub: "+12% vs last month", icon: "📊", bg: "#ff9f43" },
          { title: "Active Market Calls", value: "3 Active", sub: "Equity & F&O segments", icon: "📈", bg: "#2c3e50" },
          { title: "Completed recommendations", value: "121 Hits", sub: "98% target hit rate", icon: "✅", bg: "#28c76f" },
          { title: "Subscribed Segments", value: "F&O Premium", sub: "Full access activated", icon: "🎯", bg: "#1d68e7" }
        ].map((stat, i) => (
          <div key={i} className="col-xl-3 col-sm-6 mb-3">
            <div style={{
              padding: "16px 20px",
              borderRadius: "8px",
              backgroundColor: stat.bg,
              color: "#ffffff",
              height: "100%",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              display: "flex",
              alignItems: "center",
              gap: "15px"
            }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                {stat.icon}
              </div>
              <div>
                <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.8 }}>{stat.title}</span>
                <h3 style={{ fontSize: "20px", fontWeight: "800", margin: "2px 0", color: "#ffffff" }}>{stat.value}</h3>
                <span style={{ fontSize: "10px", opacity: 0.85 }}>{stat.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>


      <div className="row mb-4">
        {[
          { title: "Recommended Capital", value: "₹2,50,000", sub: "For optimal risk setup", trend: "📊 For F&O calls", icon: "💰", iconBg: "#e0f2fe" },
          { title: "Holding Period", value: "3.5 Days", sub: "Average trade duration", trend: "⏱️ Active calls", icon: "⏳", iconBg: "#f3e5f5" },
          { title: "Research Precision", value: "87.4%", sub: "Recommendation accuracy", trend: "📈 Last 30 Days", icon: "🎯", iconBg: "#e8f5e9" },
          { title: "Grievance Registry", value: "0 Pending", sub: "Complaints registry status", trend: "🛡️ SEBI Compliant", icon: "⚖️", iconBg: "#fff3e0" }
        ].map((stat, i) => (
          <div key={i} className="col-xl-3 col-sm-6 mb-3">
            <div style={{
              padding: "16px 20px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
              height: "100%",
              boxShadow: "0 4px 10px rgba(0,0,0,0.01)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h3 style={{ fontSize: "20px", color: "#1B2B40", fontWeight: "800", margin: "0 0 2px 0" }}>{stat.value}</h3>
                  <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>{stat.title}</span>
                </div>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: stat.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
                  {stat.icon}
                </div>
              </div>
              <div style={{ borderTop: "1px dashed #f1f5f9", pt: "8px", marginTop: "8px", fontSize: "11px", color: "#94a3b8", fontWeight: "500" }}>
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>


      <div className="row">

        <div className="col-xl-8 mb-4">
          <div style={{ padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", boxShadow: "0 4px 10px rgba(0,0,0,0.01)" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4 style={{ color: "#1B2B40", fontWeight: "800", fontSize: "15px", margin: 0 }}>Advisory Performance Chart</h4>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>Cumulative targets hit by segment</span>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                {["1D", "1W", "1M", "1Y"].map((t) => (
                  <button key={t} style={{ border: "1px solid #cbd5e1", background: t === "1M" ? "#f1f5f9" : "#ffffff", padding: "3px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}>{t}</button>
                ))}
              </div>
            </div>

            <div style={{ height: "200px", position: "relative" }}>
              <svg viewBox="0 0 500 200" width="100%" height="100%">

                <line x1="40" y1="20" x2="40" y2="180" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="180" x2="480" y2="180" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="40" y1="140" x2="480" y2="140" stroke="#f1f5f9" strokeDasharray="3" />
                <line x1="40" y1="100" x2="480" y2="100" stroke="#f1f5f9" strokeDasharray="3" />
                <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeDasharray="3" />


                <text x="30" y="180" fill="#94a3b8" fontSize="9" textAnchor="end">0</text>
                <text x="30" y="140" fill="#94a3b8" fontSize="9" textAnchor="end">20</text>
                <text x="30" y="100" fill="#94a3b8" fontSize="9" textAnchor="end">50</text>
                <text x="30" y="60" fill="#94a3b8" fontSize="9" textAnchor="end">100</text>


                <rect x="70" y="80" width="30" height="100" fill="#ff9f43" rx="3" />
                <rect x="150" y="50" width="30" height="130" fill="#2c3e50" rx="3" />
                <rect x="230" y="95" width="30" height="85" fill="#28c76f" rx="3" />
                <rect x="310" y="30" width="30" height="150" fill="#1d68e7" rx="3" />
                <rect x="390" y="70" width="30" height="110" fill="#d0a85c" rx="3" />


                <text x="85" y="192" fill="#64748b" fontSize="9" textAnchor="middle">Equity</text>
                <text x="165" y="192" fill="#64748b" fontSize="9" textAnchor="middle">Futures</text>
                <text x="245" y="192" fill="#64748b" fontSize="9" textAnchor="middle">Options</text>
                <text x="325" y="192" fill="#64748b" fontSize="9" textAnchor="middle">Index CE</text>
                <text x="405" y="192" fill="#64748b" fontSize="9" textAnchor="middle">Index PE</text>
              </svg>
            </div>
          </div>
        </div>


        <div className="col-xl-4 mb-4">
          <div style={{ padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", boxShadow: "0 4px 10px rgba(0,0,0,0.01)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <h4 style={{ color: "#1B2B40", fontWeight: "800", fontSize: "15px", marginBottom: "15px" }}>Overall Information</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { label: "Active Advisory Desk", count: "3 Agents", progress: 90, color: "#1d68e7" },
                  { label: "Alert Dispatch Channels", count: "Telegram / SMS / Web", progress: 100, color: "#28c76f" },
                  { label: "Client Satisfaction Ratio", count: "98.2%", progress: 98, color: "#ff9f43" }
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: "12px" }}>
                      <span style={{ fontWeight: "600", color: "#475569" }}>{item.label}</span>
                      <span style={{ fontWeight: "700", color: "#1b2b40" }}>{item.count}</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", backgroundColor: "#f1f5f9", borderRadius: "10px", overflow: "hidden" }}>
                      <div style={{ width: `${item.progress}%`, height: "100%", backgroundColor: item.color, borderRadius: "10px" }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "15px", marginTop: "15px", display: "flex", alignItems: "center", justify: "space-between" }}>
              <span style={{ fontSize: "11px", color: "#94a3b8" }}>Need support? Contact us:</span>
              <Link to="/portal/support-tickets" style={{ fontSize: "12px", fontWeight: "700", color: "var(--primary)", textDecoration: "none" }}>Log Ticket &rarr;</Link>
            </div>
          </div>
        </div>
      </div>


      <div className="row">

        <div className="col-xl-8 mb-4">
          <div style={{ padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", boxShadow: "0 4px 10px rgba(0,0,0,0.01)" }}>
            <div className="d-flex justify-content-between align-items-center mb-15">
              <h4 style={{ color: "#1B2B40", fontWeight: "800", fontSize: "15px", margin: 0 }}>Recent Recommendations</h4>
              <Link to="/portal/market-calls" style={{ color: "var(--primary)", fontWeight: "700", fontSize: "12px", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.5px" }}>View Board &rarr;</Link>
            </div>
            <div className="table-responsive">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #f1f5f9", textAlign: "left", color: "#64748b" }}>
                    <th style={{ padding: "10px 8px", fontWeight: "700", textTransform: "uppercase", fontSize: "10px" }}>Script</th>
                    <th style={{ padding: "10px 8px", fontWeight: "700", textTransform: "uppercase", fontSize: "10px" }}>Type</th>
                    <th style={{ padding: "10px 8px", fontWeight: "700", textTransform: "uppercase", fontSize: "10px" }}>Entry</th>
                    <th style={{ padding: "10px 8px", fontWeight: "700", textTransform: "uppercase", fontSize: "10px" }}>Target</th>
                    <th style={{ padding: "10px 8px", fontWeight: "700", textTransform: "uppercase", fontSize: "10px" }}>Stop Loss</th>
                    <th style={{ padding: "10px 8px", fontWeight: "700", textTransform: "uppercase", fontSize: "10px", textAlign: "center" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { script: "RELIANCE JUL FUT", type: "BUY", entry: "2450", target: "2510", sl: "2410", status: "ACTIVE" },
                    { script: "NIFTY 18JUL 24300 CE", type: "BUY", entry: "120", target: "180", sl: "85", status: "ACTIVE" },
                    { script: "TCS JUL FUT", type: "SELL", entry: "3920", target: "3810", sl: "3980", status: "TARGET HIT" }
                  ].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "12px 8px", fontWeight: "700", color: "#1b2b40" }}>{row.script}</td>
                      <td style={{ padding: "12px 8px" }}>
                        <span style={{
                          padding: "3px 8px",
                          borderRadius: "15px",
                          fontSize: "10px",
                          fontWeight: "800",
                          backgroundColor: row.type === "BUY" ? "rgba(3, 105, 161, 0.08)" : "rgba(185, 28, 28, 0.08)",
                          color: row.type === "BUY" ? "#0369a1" : "#b91c1c"
                        }}>
                          {row.type}
                        </span>
                      </td>
                      <td style={{ padding: "12px 8px", color: "#475569", fontWeight: "600" }}>{row.entry}</td>
                      <td style={{ padding: "12px 8px", color: "#10b981", fontWeight: "700" }}>{row.target}</td>
                      <td style={{ padding: "12px 8px", color: "#ef4444", fontWeight: "600" }}>{row.sl}</td>
                      <td style={{ padding: "12px 8px", textAlign: "center" }}>
                        <span style={{
                          padding: "3px 10px",
                          borderRadius: "15px",
                          fontSize: "9px",
                          fontWeight: "800",
                          backgroundColor: row.status === "ACTIVE" ? "rgba(59, 130, 246, 0.08)" : "rgba(16, 185, 129, 0.08)",
                          color: row.status === "ACTIVE" ? "#3b82f6" : "#10b981"
                        }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>


        <div className="col-xl-4 mb-4">
          <div style={{ padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)", height: "100%" }}>
            <h4 style={{ color: "#1B2B40", fontWeight: "800", fontSize: "15px", marginBottom: "15px" }}>Latest Notifications</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { title: "Nifty 18JUL CE recommendation updated", time: "10 minutes ago" },
                { title: "Quarterly earnings report summary posted", time: "2 hours ago" },
                { title: "Your subscription renewal has been approved", time: "Yesterday" }
              ].map((item, idx) => (
                <div key={idx} style={{ paddingBottom: idx < 2 ? "12px" : "0", borderBottom: idx < 2 ? "1px solid #f1f5f9" : "none", display: "flex", gap: "10px" }}>
                  <div style={{ fontSize: "15px" }}>🔔</div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#1B2B40", marginBottom: "2px", lineHeight: "1.4" }}>{item.title}</div>
                    <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "500" }}>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
