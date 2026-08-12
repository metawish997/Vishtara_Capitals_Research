import React, { useState, useEffect, useRef } from 'react';
import chatService from '../../services/chatService';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { Send, ArrowLeft, Headphones, Inbox, MessageSquare } from 'lucide-react';

export default function PortalChat() {
    const { user: currentUser } = useAuth();
    const [admin, setAdmin] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    
    // Admin View State
    const isAdminView = currentUser?.role?.includes('admin') || currentUser?.role === 'super-admin' || currentUser?.role === 'super_admin';
    const [conversations, setConversations] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const messagesEndRef = useRef(null);
    const selectedCustomerRef = useRef(selectedCustomer);

    const THEME = {
        primary: '#D0A85C',
        white: '#ffffff',
        bg: '#f8fafc',
        card: '#ffffff',
        border: '#e2e8f0',
        textMain: '#1e293b',
        textMuted: '#64748b'
    };

    useEffect(() => {
        selectedCustomerRef.current = selectedCustomer;
    }, [selectedCustomer]);

    // Initial Fetch & Polling
    useEffect(() => {
        if (!currentUser) return;
        
        let interval;
        if (isAdminView) {
            fetchConversations();
            interval = setInterval(() => {
                fetchConversations();
                if (selectedCustomerRef.current) {
                    fetchHistory(selectedCustomerRef.current.userId || selectedCustomerRef.current.id, false);
                }
            }, 3000);
        } else {
            fetchSupportAdmin().then(adminTarget => {
                if (adminTarget) {
                    fetchHistory(adminTarget._id || adminTarget.id, true);
                    interval = setInterval(() => {
                        fetchHistory(adminTarget._id || adminTarget.id, false);
                    }, 3000);
                }
            });
        }
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [currentUser, isAdminView]);

    const fetchSupportAdmin = async () => {
        try {
            const res = await chatService.getSupportAdmin();
            const adminData = res?.data || res;
            setAdmin(adminData);
            return adminData;
        } catch (error) {
            console.error('Support admin error:', error);
            setIsLoading(false);
            return null;
        }
    };

    const fetchConversations = async () => {
        try {
            const res = await chatService.getConversations();
            const data = Array.isArray(res) ? res : (res?.data || []);
            setConversations(data);
            setIsLoading(false);
        } catch (error) {
            console.error('Conversations error:', error);
            setIsLoading(false);
        }
    };

    const fetchHistory = async (targetId, showLoader = true) => {
        if (!targetId) return;
        if (showLoader) setIsLoading(true);
        try {
            const res = await chatService.getMessages(targetId);
            const historyData = Array.isArray(res) ? res : (res?.data || res?.messages || []);
            setMessages(historyData);
        } catch (error) {
            console.error('Messages error:', error);
        } finally {
            if (showLoader) setIsLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        
        const target = isAdminView ? (selectedCustomer?.userId || selectedCustomer?.id) : (admin?._id || admin?.id);
        if (!target) return;

        const textToSend = newMessage.trim();
        setNewMessage('');
        
        // Optimistic UI
        const tempMsg = {
            _id: Date.now().toString(),
            message: textToSend,
            sender: currentUser.id || currentUser._id,
            createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, tempMsg]);
        setTimeout(() => scrollToBottom(), 100);

        try {
            await chatService.sendMessage(target, textToSend);
            // Re-fetch to get exact finalized list
            fetchHistory(target, false);
            if (isAdminView) fetchConversations();
        } catch (error) {
            toast.error('Failed to send message');
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
        fetchHistory(customer.userId || customer.id, true);
    };

    if (!currentUser) return null;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 110px)', 
            backgroundColor: THEME.bg,
            borderRadius: '16px',
            border: `1px solid ${THEME.border}`,
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Chat Header */}
            <div style={{
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: THEME.white,
                borderBottom: `1px solid ${THEME.border}`
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {isAdminView && selectedCustomer && (
                        <button 
                            onClick={() => setSelectedCustomer(null)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: THEME.textMain, fontSize: '18px' }}
                        >
                            <ArrowLeft size={18} />
                        </button>
                    )}
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        color: THEME.white,
                        backgroundColor: THEME.primary,
                        boxShadow: `0 4px 10px rgba(208, 168, 92, 0.3)`
                    }}>
                        {isAdminView && selectedCustomer ? (
                            selectedCustomer.name?.substring(0, 2).toUpperCase()
                        ) : (
                            <Headphones size={20} />
                        )}
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: THEME.textMain }}>
                            {isAdminView ? (selectedCustomer ? selectedCustomer.name : 'Support Terminal') : (admin?.name || 'Vishtara Support')}
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }}></span>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#10B981' }}>
                                {isAdminView ? (selectedCustomer ? (selectedCustomer.email || 'Active Session') : `${conversations.length} Active Conversations`) : (admin?.email || 'support@vishtaracapitalresearch.in')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Body */}
            {isLoading ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: THEME.bg }}>
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: THEME.primary }}></div>
                </div>
            ) : (isAdminView && !selectedCustomer) ? (
                /* Admin Conversation List */
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: THEME.bg }}>
                    {conversations.length === 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.6 }}>
                            <Inbox size={48} color={THEME.textMuted} className="mb-4" />
                            <span style={{ fontSize: '16px', fontWeight: '600', color: THEME.textMuted }}>No Active Conversations</span>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '10px' }}>
                            {conversations.map(conv => (
                                <div 
                                    key={conv.userId || conv.id} 
                                    onClick={() => handleSelectCustomer(conv)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px',
                                        padding: '15px',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        backgroundColor: THEME.white,
                                        border: `1px solid ${THEME.border}`,
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.borderColor = THEME.primary}
                                    onMouseOut={(e) => e.currentTarget.style.borderColor = THEME.border}
                                >
                                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px', backgroundColor: 'rgba(208, 168, 92, 0.1)', color: THEME.primary }}>
                                        {conv.name?.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                                            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: THEME.textMain, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.name}</h4>
                                            <span style={{ fontSize: '12px', color: THEME.textMuted }}>
                                                {conv.time ? new Date(conv.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                                            </span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '13px', color: THEME.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.lastMessage}</p>
                                    </div>
                                    {conv.unread && (
                                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: THEME.primary }}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                /* Chat Messages */
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: THEME.white }}>
                    {messages.length === 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.5 }}>
                            <MessageSquare size={48} color={THEME.textMuted} className="mb-4" />
                            <span style={{ fontSize: '15px', fontWeight: '600', color: THEME.textMuted }}>Send a message to start the conversation</span>
                        </div>
                    ) : (
                        messages.map((msg, index) => {
                            const isMe = msg.sender === currentUser.id || msg.sender === currentUser._id;
                            return (
                                <div key={msg._id || index} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                                    <div 
                                        style={{
                                            maxWidth: '75%',
                                            padding: '12px 18px',
                                            backgroundColor: isMe ? THEME.primary : THEME.bg,
                                            color: isMe ? THEME.white : THEME.textMain,
                                            borderRadius: '20px',
                                            borderTopRightRadius: isMe ? '4px' : '20px',
                                            borderTopLeftRadius: !isMe ? '4px' : '20px',
                                            border: isMe ? 'none' : `1px solid ${THEME.border}`,
                                            boxShadow: isMe ? `0 4px 10px rgba(208, 168, 92, 0.2)` : 'none'
                                        }}
                                    >
                                        <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.5', whiteSpace: 'pre-wrap', fontWeight: isMe ? '600' : '500' }}>{msg.message}</p>
                                        <p style={{ margin: '6px 0 0 0', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: isMe ? 0.9 : 0.6, textAlign: 'right' }}>
                                            {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>
            )}

            {/* Input Area */}
            {(!isAdminView || selectedCustomer) && (
                <div style={{
                    padding: '20px',
                    backgroundColor: THEME.white,
                    borderTop: `1px solid ${THEME.border}`
                }}>
                    <form onSubmit={handleSend} style={{ display: 'flex', gap: '15px' }}>
                        <input 
                            type="text" 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..." 
                            style={{
                                flex: 1,
                                backgroundColor: THEME.bg,
                                border: `1px solid ${THEME.border}`,
                                borderRadius: '12px',
                                padding: '12px 20px',
                                fontSize: '15px',
                                color: THEME.textMain,
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = THEME.primary}
                            onBlur={(e) => e.target.style.borderColor = THEME.border}
                        />
                        <button 
                            type="submit"
                            disabled={!newMessage.trim()}
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: newMessage.trim() ? THEME.primary : THEME.bg,
                                color: newMessage.trim() ? THEME.white : THEME.textMuted,
                                border: newMessage.trim() ? 'none' : `1px solid ${THEME.border}`,
                                cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                                transition: 'all 0.2s',
                                fontSize: '18px'
                            }}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
