import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import tipService from "../../services/tipService";
import agreementService from "../../services/agreementService";
import notificationService from "../../services/notificationService";
import ticketService from "../../services/ticketService";
import PortalStockCard from "./PortalStockCard";

export default function PortalDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [activeCalls, setActiveCalls] = useState([]);
  const [totalActiveCalls, setTotalActiveCalls] = useState(0);
  const [subscriptions, setSubscriptions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [activePlanIds, setActivePlanIds] = useState([]);

  const kycStatus = user?.kyc_status || 'none';
  const isKycComplete = ['approved', 'verified', 'completed', 'success'].includes(kycStatus.toLowerCase());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [tipsRes, subRes, notifRes, ticketRes] = await Promise.all([
          tipService.getTips({ trade_status: 'Open', limit: 50 }).catch(() => ({ success: false })),
          agreementService.getAccountServices().catch(() => ({ success: false })),
          notificationService.getNotifications().catch(() => ({ success: false })),
          ticketService.getMyTickets().catch(() => ({ success: false }))
        ]);

        // Process Subscriptions
        if (subRes.success && subRes.subscriptions) {
          const now = new Date();
          const validSubs = subRes.subscriptions.filter(s => {
            const status = (s.status || '').toLowerCase();
            return status === 'active';
          });
          setSubscriptions(validSubs);

          const validPlans = validSubs.map(s => {
            const plan = s.service_plan?._id || s.service_plan;
            return plan ? plan.toString() : null;
          }).filter(id => id !== null);
          setActivePlanIds(validPlans);
        }

        // Process Tips/Calls
        if (tipsRes.success && Array.isArray(tipsRes.data)) {
          const openCalls = tipsRes.data.filter(c => (c.trade_status || '').toLowerCase() === 'open');
          setTotalActiveCalls(openCalls.length);
          setActiveCalls(openCalls.slice(0, 3)); // Get top 3 latest
        }

        // Process Notifications
        if (notifRes.success && Array.isArray(notifRes.data)) {
          setNotifications(notifRes.data.slice(0, 10)); // Get top 10
        }

        // Process Tickets
        if (ticketRes.success && Array.isArray(ticketRes.data)) {
          setTickets(ticketRes.data.slice(0, 5)); // Get top 5
        }

      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const checkAccess = (call) => {
    if (user && user.role === 'super admin') return true;
    if (!call.allowed_plans || call.allowed_plans.length === 0) return true;
    if (activePlanIds.length === 0) return false;
    return call.allowed_plans.some(planId => {
        const pId = typeof planId === 'object' ? (planId._id || planId.id) : planId;
        return activePlanIds.includes(pId?.toString());
    });
  };

  const formatStockName = (call) => {
    let name = call.stock_name || 'N/A';
    if (call.tip_type === 'option' || call.tip_type === 'future') {
        name = name.replace(/[0-9]{2}[A-Za-z]{3}.*$/i, '');
    }
    return name;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: "#1b2c42", paddingBottom: "40px" }}>
      
      {/* KYC Warning Banner */}
      {!isKycComplete && (
        <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', borderRadius: '12px', padding: '15px 20px', marginBottom: '20px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800' }}>⚠️ KYC Pending or Not Approved</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.9 }}>Your account access may be restricted. Please complete your KYC verification immediately.</p>
          </div>
          <button onClick={() => navigate('/portal/kyc')} style={{ background: '#fff', color: '#dc2626', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', textTransform: 'uppercase' }}>
            Update KYC
          </button>
        </div>
      )}

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-10">
        <div>
          <h2 style={{ color: "#1B2B40", fontWeight: "800", fontSize: "24px", letterSpacing: "-0.5px", margin: "0 0 4px 0" }}>Welcome Back, {user?.name?.split(' ')[0] || 'User'}!</h2>
          <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>Here is your real-time advisory overview.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D0A85C] mx-auto mb-4"></div>
          <p style={{ fontWeight: "700", fontSize: "14px" }}>Syncing Dashboard Data...</p>
        </div>
      ) : (
        <>
          {/* KPI Row */}
          <div className="row mb-4">
            <div className="col-lg-6 col-xl-3 mb-3">
              <div style={{ padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: "24px", color: "#1B2B40", fontWeight: "800", margin: "0 0 4px 0" }}>{totalActiveCalls}</h3>
                    <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Total Active Calls</span>
                  </div>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "rgba(163, 255, 0, 0.1)", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                    📈
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6 col-xl-3 mb-3">
              <div style={{ padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: "24px", color: "#1B2B40", fontWeight: "800", margin: "0 0 4px 0" }}>{subscriptions.length}</h3>
                    <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Active Subscriptions</span>
                  </div>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "rgba(208, 168, 92, 0.1)", color: "#D0A85C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                    ⭐
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-xl-3 mb-3">
              <div style={{ padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: "24px", color: "#1B2B40", fontWeight: "800", margin: "0 0 4px 0" }}>{tickets.filter(t => t.status !== 'Closed').length}</h3>
                    <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Open Tickets</span>
                  </div>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "rgba(59, 130, 246, 0.1)", color: "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                    🎫
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Latest 4 Market Calls */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 style={{ color: "#1B2B40", fontWeight: "800", fontSize: "16px", margin: 0 }}>Latest Market Calls</h4>
              <Link to="/portal/market-calls" style={{ color: "#D0A85C", fontWeight: "700", fontSize: "12px", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.5px" }}>View All &rarr;</Link>
            </div>
            {activeCalls.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                {activeCalls.map(item => (
                  <PortalStockCard 
                    key={item._id || item.id}
                    item={item}
                    formatStockName={formatStockName}
                    formatDate={formatDate}
                    hasAccess={checkAccess(item)}
                  />
                ))}
              </div>
            ) : (
              <div style={{ padding: "40px", textAlign: "center", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
                <p style={{ fontWeight: "600", fontSize: "14px", color: "#64748b", margin: 0 }}>No active market calls found.</p>
              </div>
            )}
          </div>

          {/* Split Row for Widgets */}
          <div className="row">
            {/* Subscriptions Widget */}
            <div className="col-xl-4 mb-4">
              <div style={{ padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", boxShadow: "0 4px 10px rgba(0,0,0,0.02)", height: "100%" }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 style={{ color: "#1B2B40", fontWeight: "800", fontSize: "15px", margin: 0 }}>My Subscriptions</h4>
                  <Link to="/portal/plans" style={{ color: "#D0A85C", fontSize: "11px", fontWeight: "700", textDecoration: "none" }}>Upgrade</Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: "400px", overflowY: "auto", paddingRight: "5px" }}>
                  {subscriptions.length > 0 ? subscriptions.map((sub, idx) => {
                    const endDate = sub.end_date ? new Date(sub.end_date) : null;
                    const daysRemaining = endDate ? Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24)) : null;
                    const isExpiringSoon = daysRemaining !== null && daysRemaining <= 3 && daysRemaining >= 0;

                    return (
                      <div key={idx} style={{ padding: "12px", borderRadius: "8px", border: `1px solid ${isExpiringSoon ? '#fca5a5' : '#e2e8f0'}`, backgroundColor: isExpiringSoon ? '#fef2f2' : '#f8fafc' }}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#1b2b40" }}>
                            {sub.service_name || sub.service_plan?.plan_name || sub.plan_name || 'Premium Advisory Service'}
                          </h5>
                          {isExpiringSoon && (
                            <span style={{ background: '#ef4444', color: '#fff', fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>Expiring Soon</span>
                          )}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                          <span>Start: {sub.start_date ? new Date(sub.start_date).toLocaleDateString() : 'N/A'}</span>
                          <span style={{ color: isExpiringSoon ? '#dc2626' : '#64748b', fontWeight: isExpiringSoon ? '700' : '500' }}>
                            End: {sub.end_date ? new Date(sub.end_date).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        {isExpiringSoon && (
                          <div style={{ marginTop: '8px', fontSize: '11px', color: '#dc2626', fontWeight: '600' }}>
                            ⚠️ Renews/Expires in {daysRemaining} days.
                          </div>
                        )}
                      </div>
                    );
                  }) : (
                    <div style={{ textAlign: "center", color: "#94a3b8", padding: "20px 0", fontSize: "13px" }}>No active subscriptions</div>
                  )}
                </div>
              </div>
            </div>

            {/* Notifications Widget */}
            <div className="col-xl-4 mb-4">
              <div style={{ padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", boxShadow: "0 4px 10px rgba(0,0,0,0.02)", height: "100%" }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 style={{ color: "#1B2B40", fontWeight: "800", fontSize: "15px", margin: 0 }}>Latest Notifications</h4>
                  <Link to="/portal/notifications" style={{ color: "#D0A85C", fontSize: "11px", fontWeight: "700", textDecoration: "none" }}>View All</Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: "400px", overflowY: "auto", paddingRight: "5px" }}>
                  {notifications.length > 0 ? notifications.map((n, idx) => (
                    <div key={idx} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: n.isRead ? "#ffffff" : "#f0f9ff", display: 'flex', gap: '10px' }}>
                      {!n.isRead && <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#3b82f6", marginTop: "6px", flexShrink: 0 }}></div>}
                      <div>
                        <h5 style={{ margin: 0, fontSize: "12px", fontWeight: "600", color: "#1e293b" }}>{n.title}</h5>
                        <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: "#64748b", lineHeight: "1.4" }}>{n.message}</p>
                        <span style={{ fontSize: "9px", color: "#94a3b8", marginTop: "4px", display: "block" }}>{new Date(n.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  )) : (
                    <div style={{ textAlign: "center", color: "#94a3b8", padding: "20px 0", fontSize: "13px" }}>No recent notifications</div>
                  )}
                </div>
              </div>
            </div>

            {/* Support Tickets Widget */}
            <div className="col-xl-4 mb-4">
              <div style={{ padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", boxShadow: "0 4px 10px rgba(0,0,0,0.02)", height: "100%" }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 style={{ color: "#1B2B40", fontWeight: "800", fontSize: "15px", margin: 0 }}>Support Tickets</h4>
                  <Link to="/portal/support-tickets" style={{ color: "#D0A85C", fontSize: "11px", fontWeight: "700", textDecoration: "none" }}>Log Ticket</Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: "400px", overflowY: "auto", paddingRight: "5px" }}>
                  {tickets.length > 0 ? tickets.map((t, idx) => (
                    <div key={idx} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 style={{ margin: 0, fontSize: "12px", fontWeight: "700", color: "#1e293b" }}>#{t.ticket_id || t._id.substring(0,6).toUpperCase()}</h5>
                        <span style={{ 
                          fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase',
                          background: t.status === 'Open' ? '#dbeafe' : t.status === 'Closed' ? '#dcfce3' : '#fef9c3',
                          color: t.status === 'Open' ? '#2563eb' : t.status === 'Closed' ? '#16a34a' : '#ca8a04'
                        }}>
                          {t.status || 'Pending'}
                        </span>
                      </div>
                      <p style={{ margin: "0 0 6px 0", fontSize: "11px", color: "#475569", fontWeight: "600", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.subject || 'Support Request'}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: "9px", color: "#94a3b8" }}>{new Date(t.createdAt).toLocaleDateString()}</span>
                        {t.priority && (
                          <span style={{ fontSize: "9px", color: "#64748b", border: "1px solid #cbd5e1", padding: "1px 4px", borderRadius: "3px" }}>{t.priority} Priority</span>
                        )}
                      </div>
                    </div>
                  )) : (
                    <div style={{ textAlign: "center", color: "#94a3b8", padding: "20px 0", fontSize: "13px" }}>No support tickets found</div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
