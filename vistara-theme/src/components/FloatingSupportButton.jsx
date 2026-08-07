import React, { useState, useEffect, useRef, memo } from 'react';
import chatService from '../services/chatService';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const FloatingSupportButton = memo(() => {
    const { user: currentUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [admin, setAdmin] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);
    
    // Admin View State
    const isAdminView = currentUser?.role?.includes('admin') || currentUser?.role === 'super-admin' || currentUser?.role === 'super_admin';
    const [conversations, setConversations] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const messagesEndRef = useRef(null);
    const isOpenRef = useRef(isOpen);
    const selectedCustomerRef = useRef(selectedCustomer);

    useEffect(() => {
        isOpenRef.current = isOpen;
        if (isOpen && unreadCount > 0) {
            setUnreadCount(0);
            chatService.markAllNotificationsRead().catch(() => {});
        }
    }, [isOpen, unreadCount]);

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
            
            setMessages(prev => {
                // notification check
                if (!isAdminView && !isOpenRef.current && prev.length > 0 && historyData.length > prev.length) {
                    const newMsgs = historyData.length - prev.length;
                    setUnreadCount(c => c + newMsgs);
                    toast.success('New message from Support', {
                        icon: '💬',
                        style: { background: 'var(--card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }
                    });
                }
                return historyData;
            });
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
            const res = await chatService.sendMessage(target, textToSend);
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
        if (isOpen && messages.length > 0) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    // Handle selecting a customer as Admin
    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
        fetchHistory(customer.userId || customer.id, true);
    };

    if (!currentUser) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-inter">
            {/* Chat Window */}
            {isOpen && (
                <div 
                    className="absolute bottom-20 right-0 w-[360px] max-w-[90vw] rounded-[24px] shadow-2xl overflow-hidden flex flex-col transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
                    style={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        height: '500px',
                        maxHeight: '80vh'
                    }}
                >
                    {/* Header */}
                    <div 
                        className="p-4 flex items-center justify-between"
                        style={{ borderBottom: '1px solid var(--border)', background: 'var(--card)' }}
                    >
                        <div className="flex items-center gap-3">
                            {isAdminView && selectedCustomer ? (
                                <button onClick={() => setSelectedCustomer(null)} className="mr-2 hover:opacity-70" style={{ color: 'var(--text-primary)' }}>
                                    <i className="fa-solid fa-arrow-left"></i>
                                </button>
                            ) : null}
                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md" style={{ background: 'var(--accent)', color: '#020210' }}>
                                {isAdminView && selectedCustomer ? (
                                    selectedCustomer.name?.substring(0, 2).toUpperCase()
                                ) : (
                                    <i className="fa-solid fa-headset text-lg"></i>
                                )}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold m-0 p-0" style={{ color: 'var(--text-primary)' }}>
                                    {isAdminView ? (selectedCustomer ? selectedCustomer.name : 'Support Terminal') : (admin?.name || 'Support')}
                                </h3>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10B981' }}></span>
                                    <span className="text-[10px] font-semibold" style={{ color: '#10B981' }}>
                                        {isAdminView ? (selectedCustomer ? 'Active' : `${conversations.length} Active Links`) : 'Online'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ color: 'var(--text-secondary)' }} className="hover:opacity-80 transition-opacity p-2">
                            <i className="fa-solid fa-xmark text-lg"></i>
                        </button>
                    </div>

                    {/* Main Content Area */}
                    {isLoading ? (
                        <div className="flex-1 flex items-center justify-center" style={{ background: 'var(--bg)' }}>
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--accent)' }}></div>
                        </div>
                    ) : (isAdminView && !selectedCustomer) ? (
                        /* Admin Conversation List */
                        <div className="flex-1 overflow-y-auto p-3" style={{ background: 'var(--bg)' }}>
                            {conversations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full opacity-50 gap-3">
                                    <i className="fa-solid fa-inbox text-3xl" style={{ color: 'var(--text-secondary)' }}></i>
                                    <span className="text-xs font-semibold text-center" style={{ color: 'var(--text-secondary)' }}>No Active Conversations</span>
                                </div>
                            ) : (
                                conversations.map(conv => (
                                    <div 
                                        key={conv.userId || conv.id} 
                                        onClick={() => handleSelectCustomer(conv)}
                                        className="flex items-center gap-3 p-3 mb-2 rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                                        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                                    >
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'rgba(163, 255, 0, 0.15)', color: 'var(--accent)' }}>
                                            {conv.name?.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h4 className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{conv.name}</h4>
                                                <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                                                    {conv.time ? new Date(conv.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                                                </span>
                                            </div>
                                            <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{conv.lastMessage}</p>
                                        </div>
                                        {conv.unread && (
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--accent)' }}></div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        /* Chat History */
                        <>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ background: 'var(--bg)' }}>
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full opacity-50 gap-3">
                                        <i className="fa-solid fa-comments text-3xl" style={{ color: 'var(--text-secondary)' }}></i>
                                        <span className="text-xs font-semibold text-center" style={{ color: 'var(--text-secondary)' }}>Start the conversation...</span>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => {
                                        const isMe = msg.sender === currentUser.id || msg.sender === currentUser._id;
                                        return (
                                            <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div 
                                                    className={`max-w-[85%] p-3 shadow-sm ${isMe ? 'rounded-2xl rounded-tr-none' : 'rounded-2xl rounded-tl-none'}`}
                                                    style={{
                                                        background: isMe ? 'var(--accent)' : 'var(--card)',
                                                        border: isMe ? 'none' : '1px solid var(--border)',
                                                        color: isMe ? '#020210' : 'var(--text-primary)'
                                                    }}
                                                >
                                                    <p className="text-[13px] leading-relaxed font-medium whitespace-pre-wrap">{msg.message}</p>
                                                    <p className={`text-[9px] mt-1.5 font-bold uppercase tracking-widest ${isMe ? 'opacity-70' : 'opacity-50'}`}>
                                                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-3" style={{ borderTop: '1px solid var(--border)', background: 'var(--card)' }}>
                                <form onSubmit={handleSend} className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..." 
                                        className="flex-1 bg-transparent border rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)] outline-none transition-all"
                                        style={{ color: 'var(--text-primary)', borderColor: 'var(--border)' }}
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                                        style={{ background: newMessage.trim() ? 'var(--accent)' : 'var(--border)', color: newMessage.trim() ? '#020210' : 'var(--text-secondary)' }}
                                    >
                                        <i className="fa-solid fa-paper-plane"></i>
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Permanent Floating Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 z-50 relative"
                style={{
                    background: isOpen ? 'var(--card)' : 'var(--accent)',
                    color: isOpen ? 'var(--text-primary)' : '#020210',
                    border: isOpen ? '1px solid var(--border)' : 'none',
                    boxShadow: isOpen ? 'none' : '0 10px 25px rgba(163, 255, 0, 0.3)'
                }}
            >
                {isOpen ? (
                    <i className="fa-solid fa-xmark text-xl"></i>
                ) : (
                    <>
                        <i className="fa-solid fa-comment-dots text-2xl"></i>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg border-2 border-[var(--bg)]">
                                {unreadCount}
                            </span>
                        )}
                    </>
                )}
            </button>
        </div>
    );
});

FloatingSupportButton.displayName = 'FloatingSupportButton';

export default FloatingSupportButton;
