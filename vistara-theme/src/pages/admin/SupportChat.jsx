import React, { useState, useEffect } from 'react';

const SupportChat = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const users = [
        { id: 1, name: 'Rahul Sharma', lastMessage: 'Is NIFTY 19500 CE a good buy?', time: '2m ago', unread: 2, avatar: 'RS' },
        { id: 2, name: 'Priya Patel', lastMessage: 'Thank you for the tips!', time: '1h ago', unread: 0, avatar: 'PP' },
        { id: 3, name: 'Amit Kumar', lastMessage: 'My KYC is still pending.', time: '3h ago', unread: 0, avatar: 'AK' },
        { id: 4, name: 'Sneha Gupta', lastMessage: 'Subscription issues.', time: 'Yesterday', unread: 0, avatar: 'SG' },
    ];

    const mockMessages = {
        1: [
            { id: 1, text: 'Hello, I need help with my current trade.', sender: 'user', time: '10:30 AM' },
            { id: 2, text: 'Sure, Rahul. What seems to be the issue?', sender: 'admin', time: '10:32 AM' },
            { id: 3, text: 'Is NIFTY 19500 CE a good buy at 120?', sender: 'user', time: '10:35 AM' },
        ]
    };

    useEffect(() => {
        if (selectedUser) {
            setMessages(mockMessages[selectedUser.id] || []);
        }
    }, [selectedUser]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msg = {
            id: Date.now(),
            text: newMessage,
            sender: 'admin',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, msg]);
        setNewMessage('');
    };

    return (
        <div className="flex h-[calc(100vh-120px)] bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/60 border border-white">
            {/* User List Sidebar */}
            <div className="w-80 border-r border-gray-50 flex flex-col bg-gray-50/30">
                <div className="p-4 border-b border-gray-50 bg-white/50 backdrop-blur-md">
                    <h2 className="text-xs font-semibold font-black tracking-tighter text-slate-900">Conversations</h2>
                    <p className="text-[10px] font-black text-[#011d52] uppercase tracking-widest mt-1">Real-time Support Terminal</p>
                    
                    <div className="mt-4 relative">
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            className="w-full bg-white border border-gray-100 rounded-xl px-4 py-1.5 text-[11px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                        />
                        <i className="fa-solid fa-magnifying-glass absolute right-4 top-2.5 text-slate-300 text-xs"></i>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {users.map(user => (
                        <div 
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center gap-4 ${selectedUser?.id === user.id ? 'bg-[#011d52] text-[var(--text-primary)] shadow-lg shadow-blue-200' : 'hover:bg-white border border-transparent hover:border-gray-100'}`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${selectedUser?.id === user.id ? 'bg-white/20' : 'bg-blue-50 text-[#011d52]'}`}>
                                {user.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-0.5">
                                    <h3 className="text-[12px] font-black tracking-tight truncate">{user.name}</h3>
                                    <span className={`text-[8px] font-black uppercase tracking-widest ${selectedUser?.id === user.id ? 'text-blue-100' : 'text-slate-400'}`}>{user.time}</span>
                                </div>
                                <p className={`text-[10px] truncate ${selectedUser?.id === user.id ? 'text-blue-100' : 'text-slate-500'}`}>{user.lastMessage}</p>
                            </div>
                            {user.unread > 0 && selectedUser?.id !== user.id && (
                                <div className="w-4 h-4 bg-rose-500 text-[var(--text-primary)] rounded-full flex items-center justify-center text-[8px] font-black">
                                    {user.unread}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white relative">
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#011d52] flex items-center justify-center font-black text-xs shadow-sm">
                                    {selectedUser.avatar}
                                </div>
                                <div>
                                    <h3 className="text-xs font-black text-slate-900 tracking-tight">{selectedUser.name}</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Live Now</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="w-9 h-9 rounded-xl bg-gray-50 text-slate-400 flex items-center justify-center hover:bg-blue-50 hover:text-[#011d52] transition-all shadow-sm">
                                    <i className="fa-solid fa-phone text-xs"></i>
                                </button>
                                <button className="w-9 h-9 rounded-xl bg-gray-50 text-slate-400 flex items-center justify-center hover:bg-blue-50 hover:text-[#011d52] transition-all shadow-sm">
                                    <i className="fa-solid fa-ellipsis-vertical text-xs"></i>
                                </button>
                            </div>
                        </div>

                        {/* Message History */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:20px_20px]">
                            {messages.map((msg, index) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] group`}>
                                        <div className={`p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${msg.sender === 'admin' ? 'bg-[#011d52] text-[var(--text-primary)] rounded-tr-none' : 'bg-gray-100 text-slate-700 rounded-tl-none'}`}>
                                            {msg.text}
                                        </div>
                                        <p className={`text-[8px] font-black uppercase tracking-widest mt-2 ${msg.sender === 'admin' ? 'text-right text-slate-400' : 'text-left text-slate-400'}`}>
                                            {msg.time} {msg.sender === 'admin' && <i className="fa-solid fa-check-double text-blue-500 ml-1"></i>}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-50">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-gray-50 rounded-2xl p-2 pr-4 border border-gray-100 focus-within:border-blue-200 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
                                <button type="button" className="w-10 h-10 rounded-xl text-slate-400 hover:bg-white hover:text-[#011d52] transition-all">
                                    <i className="fa-solid fa-paperclip"></i>
                                </button>
                                <input 
                                    type="text" 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your response here..." 
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-xs font-medium text-slate-700 py-3"
                                />
                                <button 
                                    type="submit"
                                    className="bg-[#011d52] text-[var(--text-primary)] rounded-xl px-6 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-[#03173d] transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center gap-2"
                                >
                                    Transmit
                                    <i className="fa-solid fa-paper-plane"></i>
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-30">
                        <div className="w-24 h-24 rounded-[2rem] bg-blue-50 text-[#011d52] flex items-center justify-center text-4xl mb-6 shadow-xl shadow-blue-100">
                            <i className="fa-solid fa-comments"></i>
                        </div>
                        <h3 className="text-xs font-semibold font-black text-slate-900 tracking-tighter">Command Center Active</h3>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2">Select a user to begin neural communication</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupportChat;
