import React, { useState } from 'react';

const FloatingChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: 'Hello! How can we help you today?', sender: 'admin', time: '10:00' },
    ]);
    const [newMessage, setNewMessage] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        
        const msg = {
            id: Date.now(),
            text: newMessage,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
        };
        
        setMessages([...messages, msg]);
        setNewMessage('');
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-plus-jakarta">
            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[320px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 animate-in slide-in-from-bottom-4">
                    {/* Minimal Header */}
                    <div className="p-4 bg-slate-900 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Support Terminal</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                            <i className="fa-solid fa-xmark text-xs"></i>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="h-80 overflow-y-auto p-5 space-y-4 bg-gray-50/30">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none' : 'bg-white border border-gray-100 text-slate-700 rounded-2xl rounded-tl-none'} p-3 shadow-sm`}>
                                    <p className="text-[11px] leading-relaxed font-medium">{msg.text}</p>
                                    <p className={`text-[7px] mt-1 font-bold uppercase tracking-widest ${msg.sender === 'user' ? 'text-blue-100/60' : 'text-slate-300'}`}>
                                        {msg.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Minimal Input */}
                    <div className="p-4 bg-white border-t border-gray-50">
                        <form onSubmit={handleSend} className="flex gap-2">
                            <input 
                                type="text" 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a signal..." 
                                className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2 text-[11px] focus:ring-2 focus:ring-blue-500/10 placeholder:text-slate-300 font-medium"
                            />
                            <button 
                                type="submit"
                                className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all"
                            >
                                <i className="fa-solid fa-paper-plane text-[10px]"></i>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Permanent Floating Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-90 ${isOpen ? 'bg-slate-900 text-white rotate-180' : 'bg-blue-600 text-white shadow-blue-200'}`}
            >
                {isOpen ? (
                    <i className="fa-solid fa-xmark text-lg"></i>
                ) : (
                    <i className="fa-solid fa-comment-dots text-xl"></i>
                )}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-black text-white">
                        1
                    </span>
                )}
            </button>
        </div>
    );
};

export default FloatingChat;
