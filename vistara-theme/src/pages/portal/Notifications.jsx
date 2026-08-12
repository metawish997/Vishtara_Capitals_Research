import React, { useState, useEffect } from "react";
import notificationService from "../../services/notificationService";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Fetch all notifications to get both read and unread
      const res = await notificationService.getAllNotifications();
      const allNotifs = res.data || [];
      
      // Properly check global vs user-specific
      const filteredForUser = allNotifs.filter(n => {
        const targetUserId = typeof n.user === 'object' ? n.user?._id : n.user;
        return n.is_global || targetUserId === user._id;
      });

      // Sort by newest first
      filteredForUser.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(filteredForUser);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      toast.success("All notifications marked as read");
      fetchNotifications();
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkRead = async (id, currentUnread) => {
    if (!currentUnread) return;
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const dynamicTabs = ["ALL", ...new Set(notifications.map(n => (n.type || 'SYSTEM').toUpperCase()))];

  const filteredNotifications = notifications.filter(n => {
    const typeMatch = activeTab === "ALL" || (n.type || 'SYSTEM').toUpperCase() === activeTab;
    const isUnread = n.isRead === false || typeof n.isRead === 'undefined';
    
    let statusMatch = true;
    if (statusFilter === "UNREAD") statusMatch = isUnread;
    if (statusFilter === "READ") statusMatch = !isUnread;

    return typeMatch && statusMatch;
  });

  // Helper for icons based on severity
  const getIconData = (severity) => {
    switch (severity) {
      case 'success': return { icon: "🎯", bg: "rgba(16, 185, 129, 0.08)", color: "#10b981" };
      case 'warning': return { icon: "⚠️", bg: "rgba(245, 158, 11, 0.08)", color: "#f59e0b" };
      case 'danger': return { icon: "🚨", bg: "rgba(239, 68, 68, 0.08)", color: "#ef4444" };
      case 'info':
      default: return { icon: "🛡️", bg: "rgba(36, 63, 99, 0.08)", color: "#243F63" };
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: "#1E293B", padding: "10px 0" }}>
      
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-15">
        <div>
          <h2 style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0" }}>Advisory Alerts &amp; Logs</h2>
          <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>System and advisory alerts dispatched to your account.</p>
        </div>
        <button onClick={handleMarkAllRead} style={{
          backgroundColor: "#ffffff",
          border: "1px solid #cbd5e1",
          borderRadius: "6px",
          padding: "8px 16px",
          fontSize: "12px",
          fontWeight: "700",
          color: "#475569",
          cursor: "pointer",
          transition: "background-color 0.2s"
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#ffffff"}
        >
          🧹 Mark All As Read
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "15px", marginBottom: "25px", flexWrap: "wrap", gap: "15px" }}>
        
        {/* Dynamic Categories */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {dynamicTabs.map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  border: "none",
                  backgroundColor: isSelected ? "var(--tp-finance-primary)" : "transparent",
                  color: isSelected ? "#ffffff" : "#64748b",
                  borderRadius: "4px",
                  padding: "6px 14px",
                  fontSize: "11px",
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseOver={(e) => { if (!isSelected) e.currentTarget.style.color = "#0f172a"; }}
                onMouseOut={(e) => { if (!isSelected) e.currentTarget.style.color = "#64748b"; }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Read / Unread Status Filter */}
        <div style={{ display: "flex", gap: "4px", backgroundColor: "#f1f5f9", padding: "4px", borderRadius: "6px" }}>
          {["ALL", "UNREAD", "READ"].map(status => {
            const isSelected = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  border: "none",
                  backgroundColor: isSelected ? "#ffffff" : "transparent",
                  color: isSelected ? "#0f172a" : "#64748b",
                  borderRadius: "4px",
                  padding: "4px 10px",
                  fontSize: "11px",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: isSelected ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.2s"
                }}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Loading notifications...</div>
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map((n, idx) => {
            const isUnread = n.isRead === false || typeof n.isRead === 'undefined';
            const iconData = getIconData(n.severity);
            return (
              <div key={n._id || idx} onClick={() => handleMarkRead(n._id, isUnread)} style={{
                display: "flex",
                gap: "18px",
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                backgroundColor: isUnread ? "#f8fafc" : "#ffffff",
                borderLeft: isUnread ? `4px solid #243F63` : "4px solid transparent",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.03)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.01)";
              }}
              >
                
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: iconData.bg,
                  color: iconData.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  flexShrink: 0
                }}>
                  {iconData.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-5 mb-1">
                    <div className="d-flex align-items-center gap-10">
                      <h4 style={{ fontSize: "15px", fontWeight: "750", color: "#0f172a", margin: 0 }}>
                        {n.title || "Alert"}
                      </h4>
                      {isUnread && (
                        <span style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: "#ef4444",
                          display: "inline-block"
                        }}></span>
                      )}
                    </div>
                    <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>
                      {new Date(n.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>

                  <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#475569", lineHeight: "1.5" }}>
                    {n.message}
                  </p>

                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "9px",
                      fontWeight: "800",
                      backgroundColor: iconData.bg,
                      color: iconData.color,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase"
                    }}>
                      {n.type || 'SYSTEM'}
                    </span>
                    {n.is_global && (
                      <span style={{
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "9px",
                        fontWeight: "800",
                        backgroundColor: "#f1f5f9",
                        color: "#64748b",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase"
                      }}>
                        GLOBAL
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        ) : (
          <div style={{ textAlign: "center", padding: "40px", border: "1px dashed #cbd5e1", borderRadius: "8px", color: "#64748b" }}>
            <span style={{ fontSize: "24px" }}>📭</span>
            <p style={{ margin: "10px 0 0 0", fontSize: "14px", fontWeight: "600" }}>No alerts found in this category.</p>
          </div>
        )}
      </div>

    </div>
  );
}
