import React, { useState, useEffect, memo } from 'react';
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
    const isOpenRef = React.useRef(isOpen);

    useEffect(() => {
        isOpenRef.current = isOpen;
        if (isOpen) setUnreadCount(0);
    }, [isOpen]);

    useEffect(() => {
        if (currentUser) {
            fetchSupportAdmin();
        }
    }, [currentUser]);

    useEffect(() => {
        if (admin && currentUser) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 3000);
            return () => clearInterval(interval);
        }
    }, [admin, currentUser]);

    const fetchSupportAdmin = async () => {
        try {
            const res = await chatService.getSupportAdmin();
            if (res.success) setAdmin(res.data);
        } catch (error) {
            console.error('Support admin error:', error);
        }
    };

    const fetchMessages = async () => {
        if (!admin) return;
        try {
            const res = await chatService.getMessages(admin._id);
            if (res.success) {
                setMessages(prev => {
                    if (!isOpenRef.current && prev.length > 0 && res.data.length > prev.length) {
                        const newMsgs = res.data.length - prev.length;
                        setUnreadCount(c => c + newMsgs);
                        toast.success('New message from Neural Intel', {
                            icon: '🤖',
                            style: { background: 'var(--card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }
                        });
                    }
                    return res.data;
                });
            }
        } catch (error) {
            console.error('Messages error:', error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !admin) return;
        
        try {
            const res = await chatService.sendMessage(admin._id, newMessage);
            if (res.success) {
                setMessages([...messages, res.data]);
                setNewMessage('');
            }
        } catch (error) {
            toast.error('Failed to send signal');
        }
    };

    if (currentUser?.role?.includes('admin')) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-inter">
            {/* Chat Window */}
            {isOpen && (
                <div 
                    className="absolute bottom-20 right-0 w-[320px] rounded-[24px] shadow-2xl overflow-hidden flex flex-col transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
                    style={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                    }}
                >
                    {/* Minimal Header */}
                    <div 
                        className="p-4 flex items-center justify-between"
                        style={{ borderBottom: '1px solid var(--border)', background: 'var(--card)' }}
                    >
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent)' }}></span>
                            <span className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-primary)' }}>Neural Intel</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ color: 'var(--text-secondary)' }} className="hover:opacity-80 transition-opacity">
                            <i className="fa-solid fa-xmark text-sm"></i>
                        </button>
                    </div>

                    {/* Messages Area & Input */}
                    {!currentUser ? (
                        <div className="h-[368px] flex flex-col items-center justify-center p-6 space-y-5 text-center" style={{ background: 'var(--bg)' }}>
                            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                                <i className="fa-solid fa-lock text-2xl" style={{ color: 'var(--text-secondary)' }}></i>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Encrypted Channel</h4>
                                <p className="text-[10px] uppercase tracking-widest font-black leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    Authentication required to establish secure connection with Neural Intel.
                                </p>
                            </div>
                            <a 
                                href="/login" 
                                className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[var(--accent)]/20" 
                                style={{ background: 'var(--accent)', color: '#020210', marginTop: '1rem' }}
                            >
                                Initiate Login
                            </a>
                        </div>
                    ) : (
                        <>
                            <div className="h-80 overflow-y-auto p-4 space-y-4" style={{ background: 'var(--bg)' }}>
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full opacity-50 gap-3">
                                        <i className="fa-solid fa-satellite-dish text-3xl" style={{ color: 'var(--text-secondary)' }}></i>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-center" style={{ color: 'var(--text-secondary)' }}>Awaiting Signals...</span>
                                    </div>
                                ) : (
                                    messages.map((msg) => (
                                        <div key={msg._id} className={`flex ${(msg.sender === currentUser.id || msg.sender === currentUser._id) ? 'justify-end' : 'justify-start'}`}>
                                            <div 
                                                className={`max-w-[85%] p-3 shadow-sm ${
                                                    (msg.sender === currentUser.id || msg.sender === currentUser._id) 
                                                        ? 'rounded-2xl rounded-tr-none' 
                                                        : 'rounded-2xl rounded-tl-none'
                                                }`}
                                                style={{
                                                    background: (msg.sender === currentUser.id || msg.sender === currentUser._id) 
                                                        ? 'var(--accent)' 
                                                        : 'var(--card)',
                                                    border: (msg.sender === currentUser.id || msg.sender === currentUser._id) 
                                                        ? 'none' 
                                                        : '1px solid var(--border)',
                                                    color: (msg.sender === currentUser.id || msg.sender === currentUser._id) 
                                                        ? '#020210' 
                                                        : 'var(--text-primary)'
                                                }}
                                            >
                                                <p className="text-[12px] leading-relaxed font-bold tracking-tight">{msg.message}</p>
                                                <p className={`text-[8px] mt-1.5 font-black uppercase tracking-widest opacity-60`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Minimal Input */}
                            <div className="p-3" style={{ borderTop: '1px solid var(--border)', background: 'var(--card)' }}>
                                <form onSubmit={handleSend} className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Transmit message..." 
                                        className="flex-1 bg-transparent border rounded-xl px-4 py-2 text-[12px] focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)] font-bold outline-none transition-all"
                                        style={{ color: 'var(--text-primary)', borderColor: 'var(--border)' }}
                                    />
                                    <button 
                                        type="submit"
                                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                                        style={{ background: 'var(--accent)', color: '#020210' }}
                                    >
                                        <i className="fa-solid fa-paper-plane text-[12px]"></i>
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
                className="w-14 h-14 rounded-[18px] flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 z-50 relative"
                style={{
                    background: isOpen ? 'rgba(255,255,255,0.1)' : 'var(--accent)',
                    color: isOpen ? 'white' : '#020210',
                    backdropFilter: isOpen ? 'blur(10px)' : 'none',
                    border: isOpen ? '1px solid rgba(255,255,255,0.2)' : 'none',
                    boxShadow: isOpen ? 'none' : '0 10px 25px rgba(163, 255, 0, 0.3)'
                }}
            >
                {isOpen ? (
                    <i className="fa-solid fa-xmark text-xl"></i>
                ) : (
                    <>
                        <i className="fa-solid fa-comment-dots text-2xl"></i>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg animate-bounce border border-[var(--bg)]">
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
