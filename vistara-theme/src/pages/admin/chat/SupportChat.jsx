import React, { useState, useEffect } from 'react';
import chatService from '../../../services/chatService';
import useAuth from '../../../hooks/useAuth';
import toast from 'react-hot-toast';

const SupportChat = () => {
    const { user: currentUser } = useAuth();
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchConversations();
        const interval = setInterval(fetchConversations, 5000); // Poll for new conversations
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser.userId);
            const interval = setInterval(() => fetchMessages(selectedUser.userId), 3000); // Poll for new messages
            return () => clearInterval(interval);
        }
    }, [selectedUser]);

    const fetchConversations = async () => {
        try {
            const res = await chatService.getConversations();
            if (res.success) setConversations(res.data);
        } catch (error) {
            console.error('Conv error:', error);
        }
    };

    const fetchMessages = async (userId) => {
        try {
            const res = await chatService.getMessages(userId);
            if (res.success) setMessages(res.data);
        } catch (error) {
            console.error('Msg error:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            const res = await chatService.sendMessage(selectedUser.userId, newMessage);
            if (res.success) {
                setMessages([...messages, res.data]);
                setNewMessage('');
                fetchConversations();
            }
        } catch (error) {
            toast.error('Failed to send message');
        }
    };

    return (
        <div className="flex h-[calc(100dvh-105px)] sm:h-[calc(100dvh-120px)] font-plus-jakarta -mx-2 sm:-mx-4 -mb-2 sm:-mb-4 overflow-hidden border-b-0">
            {/* User List Sidebar */}
            <div className="w-64 border-r border-[slate-200] flex flex-col bg-[slate-50]">
                <div className="px-3 py-2 border-b border-[slate-200] bg-[white]">
                    <h2 className="text-xs font-black tracking-tight text-[slate-800]">Support Chat</h2>
                    <p className="text-[9px] font-bold text-[slate-500] mt-0.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Live Support Feed
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {conversations.length === 0 ? (
                        <div className="text-center p-4 opacity-40">
                            <i className="fa-solid fa-inbox text-xs font-semibold mb-3 text-[slate-500]"></i>
                            <p className="text-[11px] font-black uppercase tracking-widest text-[slate-500]">No conversations</p>
                        </div>
                    ) : (
                        conversations.map(conv => (
                            <div 
                                key={conv.userId}
                                onClick={() => setSelectedUser(conv)}
                                className={`p-2.5 rounded-lg cursor-pointer transition-all flex items-center gap-3 ${selectedUser?.userId === conv.userId ? 'bg-[#011d52] text-white shadow-md shadow-[#011d52]/20' : 'hover:bg-slate-100 border border-slate-200 bg-white'}`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center font-black text-[10px] ${selectedUser?.userId === conv.userId ? 'bg-white/20 text-white' : 'bg-slate-50 text-[#011d52] border border-slate-200'}`}>
                                    {conv.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h3 className={`text-[11px] font-bold tracking-tight truncate ${selectedUser?.userId === conv.userId ? 'text-white' : 'text-slate-800'}`}>{conv.name}</h3>
                                        <span className={`text-[8px] font-bold uppercase tracking-widest ${selectedUser?.userId === conv.userId ? 'text-white/80' : 'text-slate-400'}`}>
                                            {new Date(conv.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                    <p className={`text-[9px] font-medium truncate ${selectedUser?.userId === conv.userId ? 'text-white/90' : 'text-slate-500'}`}>{conv.lastMessage}</p>
                                </div>
                                {conv.unread && (
                                    <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-[white] relative">
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="px-5 py-2 border-b border-[slate-200] flex items-center justify-between bg-[white] z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[[#011d52]]/10 text-[[#011d52]] flex items-center justify-center font-black text-[10px] border border-[[#011d52]]/20">
                                    {selectedUser.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-xs font-black text-[slate-800] tracking-tight uppercase">{selectedUser.name}</h3>
                                    <p className="text-[9px] font-black text-[slate-500] uppercase tracking-widest">{selectedUser.smra_id}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-1 bg-green-50 text-green-600 border border-green-200 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                    <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                                    Online
                                </span>
                            </div>
                        </div>

                        {/* Message History */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[slate-50] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                            {messages.map((msg) => (
                                <div key={msg._id} className={`flex ${(msg.sender === currentUser?.id || msg.sender === currentUser?._id) ? 'justify-end' : 'justify-start'}`}>
                                    <div className="max-w-[75%]">
                                        <div className={`px-4 py-2 rounded-2xl text-[11px] font-medium leading-relaxed shadow-sm ${(msg.sender === currentUser?.id || msg.sender === currentUser?._id) ? 'bg-[#011d52] text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'}`}>
                                            {msg.message}
                                        </div>
                                        <p className={`text-[8px] font-bold uppercase tracking-widest mt-1 ${(msg.sender === currentUser?.id || msg.sender === currentUser?._id) ? 'text-right text-slate-400' : 'text-left text-slate-400'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            {(msg.sender === currentUser?.id || msg.sender === currentUser?._id) && <i className={`fa-solid fa-check-double ml-1.5 ${msg.isRead ? 'text-[#011d52]' : 'text-slate-300'}`}></i>}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-[white] border-t border-[slate-200]">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-[slate-50] rounded-xl p-2 pr-2 border border-[slate-200] focus-within:border-[[#011d52]] focus-within:ring-4 focus-within:ring-[[#011d52]]/10 transition-all duration-300">
                                <input 
                                    type="text" 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..." 
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-xs font-bold text-[slate-800] py-3 px-4 placeholder:text-[slate-500] placeholder:opacity-50 outline-none"
                                />
                                <button 
                                    type="submit"
                                    className="bg-[[#011d52]] text-[slate-800] rounded-lg px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-md shadow-[[#011d52]]/20 active:scale-95 flex items-center gap-2"
                                >
                                    Send
                                    <i className="fa-solid fa-paper-plane"></i>
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                        <div className="w-20 h-20 rounded-2xl bg-[[#011d52]]/10 text-[[#011d52]] flex items-center justify-center text-xs font-semibold mb-6 border border-[[#011d52]]/20">
                            <i className="fa-solid fa-comments"></i>
                        </div>
                        <h3 className="text-xs font-black text-[slate-800] tracking-tight">Select a Conversation</h3>
                        <p className="text-[11px] font-medium text-[slate-500] mt-2 max-w-[250px] leading-relaxed">Choose a user from the sidebar to view their support chat history and reply to their messages.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupportChat;

