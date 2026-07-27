import React, { useState, useRef, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuth from '../hooks/useAuth';
import { BASE_URL } from '../services/api';
import toast from 'react-hot-toast';
import notificationService from '../services/notificationService';
import { Bell } from 'lucide-react';

export default function PortalLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
      try {
          const res = await notificationService.getNotifications();
          if (res.success) {
              setNotifications(res.data);
              setUnreadCount(res.data.length);
          }
      } catch (error) {
          console.error("Error fetching notifications:", error);
      }
  };

  useEffect(() => {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
      const handler = (e) => {
          if (profileRef.current && !profileRef.current.contains(e.target)) {
              setProfileOpen(false);
          }
          if (notifRef.current && !notifRef.current.contains(e.target)) {
              setIsNotifOpen(false);
          }
      };
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkAsRead = async (e, id) => {
      e.preventDefault();
      e.stopPropagation();
      try {
          await notificationService.markAsRead(id);
          fetchNotifications();
      } catch (error) { }
  };

  const handleMarkAllAsRead = async () => {
      try {
          await notificationService.markAllAsRead();
          fetchNotifications();
      } catch (error) { }
  };

  const menuItems = [
    { label: "Dashboard", path: "/portal", icon: "📊" },
    { label: "Market Calls", path: "/portal/market-calls", icon: "📈" },
    { label: "Latest News", path: "/portal/latest-news", icon: "📰" },
    { label: "Alert Logs", path: "/portal/notifications", icon: "🔔" },
    { label: "Support Desk", path: "/portal/support-tickets", icon: "💬" },
    { label: "Profile", path: "/portal/profile", icon: "👤" }
  ];

  const handleLogout = (e) => {
    if (e) e.preventDefault();
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      toast.success('Signed out successfully');
      setTimeout(() => {
          window.location.href = '/login';
      }, 100);
    }
  };

  const getInitials = (name) => {
      if (!name) return 'A';
      return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", backgroundColor: "#f4f6f8", fontFamily: "'Inter', sans-serif" }}>
      
      <div style={{
        width: sidebarOpen ? "260px" : "70px",
        backgroundColor: "#ffffff",
        color: "#475569",
        transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "visible",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        borderRight: "1px solid #e2e8f0",
        zIndex: 1000
      }}>
        
        <div style={{ padding: sidebarOpen ? "24px 20px" : "24px 0", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: sidebarOpen ? "flex-start" : "center", gap: "10px", whiteSpace: "nowrap" }}>
          <img src="/vistaralogo.svg" alt="Vishtara Logo" style={{ width: "32px", height: "auto" }} />
          {sidebarOpen && <span style={{ fontWeight: "800", fontSize: "17px", color: "#1E293B", letterSpacing: "-0.3px" }}>Vishtara Portal</span>}
        </div>

        
        <div style={{ flex: 1, padding: "20px 12px", display: "flex", flexDirection: "column", gap: "4px", overflowY: "auto", overflowX: "hidden" }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                  gap: sidebarOpen ? "12px" : "0",
                  padding: sidebarOpen ? "10px 16px" : "10px 0",
                  borderRadius: "6px",
                  color: isActive ? "#243F63" : "#64748b",
                  backgroundColor: isActive ? "rgba(208, 168, 92, 0.08)" : "transparent",
                  borderLeft: isActive ? "4px solid var(--tp-finance-primary, #D0A85C)" : "4px solid transparent",
                  textDecoration: "none",
                  fontWeight: isActive ? "700" : "500",
                  fontSize: "14px",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => { 
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "#f8fafc";
                    e.currentTarget.style.color = "#1e293b";
                  }
                }}
                onMouseOut={(e) => { 
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#64748b";
                  }
                }}
              >
                <span style={{ fontSize: "16px" }}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        
        <div style={{ padding: "20px 12px", borderTop: "1px solid #f1f5f9" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: sidebarOpen ? "flex-start" : "center",
              gap: sidebarOpen ? "12px" : "0",
              padding: sidebarOpen ? "10px 16px" : "10px 0",
              borderRadius: "6px",
              color: "#ef4444",
              backgroundColor: "transparent",
              border: "none",
              textAlign: "left",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#fee2e2"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <span>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowX: "hidden", height: "100vh" }}>
        
        <header style={{
          height: "70px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 15px",
          position: "sticky",
          top: 0,
          zIndex: 900
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "none",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              color: "#64748b",
              padding: "6px 10px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f1f5f9"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            ☰
          </button>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "20px" }}>
            <span style={{ fontSize: "13px", color: "#64748b", background: "#f1f5f9", padding: "6px 12px", borderRadius: "20px", fontWeight: "500", display: "flex", alignItems: "center", gap: "5px" }}>
              📅 Session Date: <strong style={{ color: "#1e293b" }}>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
            </span>
            <div style={{ width: "1px", height: "20px", backgroundColor: "#e2e8f0" }}></div>
            
            {/* Notification Dropdown */}
            <div style={{ position: "relative" }} ref={notifRef}>
                <button
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: "#f1f5f9",
                        color: "#64748b",
                        border: "1px solid #e2e8f0",
                        cursor: "pointer",
                        transition: "all 0.2s"
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#e2e8f0"; e.currentTarget.style.color = "#1e293b"; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#f1f5f9"; e.currentTarget.style.color = "#64748b"; }}
                >
                    <Bell size={18} strokeWidth={2} />
                    {unreadCount > 0 && (
                        <span style={{
                            position: "absolute",
                            top: "-4px",
                            right: "-4px",
                            height: "16px",
                            minWidth: "16px",
                            backgroundColor: "#ef4444",
                            color: "#ffffff",
                            fontSize: "10px",
                            fontWeight: "bold",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0 4px",
                            border: "2px solid #ffffff"
                        }}>
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </button>

                {isNotifOpen && (
                    <div style={{
                        position: "absolute",
                        top: "100%",
                        right: 0,
                        marginTop: "8px",
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                        width: "320px",
                        zIndex: 1001,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9", backgroundColor: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "12px", fontWeight: "700", color: "#1e293b", textTransform: "uppercase" }}>Notifications</span>
                            {unreadCount > 0 && (
                                <button onClick={handleMarkAllAsRead} style={{ fontSize: "10px", color: "#3b82f6", background: "none", border: "none", cursor: "pointer", fontWeight: "600" }}>
                                    Mark all as read
                                </button>
                            )}
                        </div>
                        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                            {notifications.length > 0 ? notifications.map((n, i) => (
                                <div key={i} style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", gap: "10px", alignItems: "flex-start", backgroundColor: n.isRead ? "#ffffff" : "#f0f9ff", cursor: "pointer" }} onClick={(e) => handleMarkAsRead(e, n._id)}>
                                    {!n.isRead && <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#3b82f6", marginTop: "6px", flexShrink: 0 }}></div>}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ margin: 0, fontSize: "12px", fontWeight: "600", color: "#1e293b", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>{n.title}</p>
                                        <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: "#64748b", lineHeight: "1.4" }}>{n.message}</p>
                                        <span style={{ fontSize: "10px", color: "#94a3b8", marginTop: "6px", display: "block" }}>{new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ padding: "20px", textAlign: "center", color: "#94a3b8", fontSize: "12px" }}>No new notifications</div>
                            )}
                        </div>
                        <div style={{ padding: "10px", borderTop: "1px solid #f1f5f9", textAlign: "center", backgroundColor: "#f8fafc" }}>
                            <Link to="/portal/notifications" onClick={() => setIsNotifOpen(false)} style={{ fontSize: "11px", fontWeight: "600", color: "#3b82f6", textDecoration: "none" }}>
                                View All Notifications
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <div style={{ width: "1px", height: "20px", backgroundColor: "#e2e8f0" }}></div>
            <div style={{ position: "relative" }} ref={profileRef}>
                <div 
                    onClick={() => setProfileOpen(!profileOpen)}
                    style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", padding: "4px 8px", borderRadius: "8px", transition: "background-color 0.2s" }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #243F63 0%, #1A2B40 100%)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px", border: "2px solid rgba(208, 168, 92, 0.4)", overflow: "hidden" }}>
                    <img 
                        src={user?.image ? (user.image.startsWith('http') ? user.image : `${BASE_URL}${user.image}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || user?.name || 'User'}`} 
                        alt="Profile" 
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>{user?.name?.split(' ')[0] || 'User'}</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#64748b", transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                          <path d="M6 9l6 6 6-6"/>
                      </svg>
                  </div>
                </div>

                {profileOpen && (
                    <div style={{
                        position: "absolute",
                        top: "100%",
                        right: 0,
                        marginTop: "8px",
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                        width: "200px",
                        zIndex: 1001,
                        overflow: "hidden"
                    }}>
                        <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9", backgroundColor: "#f8fafc" }}>
                            <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name}</p>
                            <p style={{ margin: 0, fontSize: "12px", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: "2px" }}>{user?.email}</p>
                        </div>
                        <div style={{ padding: "8px" }}>
                            <Link to="/portal/profile" onClick={() => setProfileOpen(false)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", color: "#475569", textDecoration: "none", fontSize: "14px", borderRadius: "6px", transition: "all 0.2s" }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#f1f5f9"; e.currentTarget.style.color = "#1e293b"; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#475569"; }}>
                                <span>👤</span> My Profile
                            </Link>
                            <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", color: "#ef4444", backgroundColor: "transparent", border: "none", fontSize: "14px", borderRadius: "6px", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#fee2e2"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                                <span>🚪</span> Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </header>

        
        <main style={{ flex: 1, padding: "20px 15px", width: "100%", overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
