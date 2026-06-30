import { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaTimes, FaSearch } from "react-icons/fa";
import axiosInstance from "../services/axiosInstance";
import { getSocket } from "../services/socket";

function ChatBox({ friend, onClose }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [typing, setTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const friendId = friend.id || friend._id;

    useEffect(() => {
        if (friendId) {
            fetchMessages();
        }
    }, [friendId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const handleReceiveMessage = (message) => {
            const senderId = message.sender?._id || message.sender;
            const recipientId = message.recipient;
            
            if (
                (senderId === friendId && recipientId === currentUser?.id) ||
                (senderId === currentUser?.id && recipientId === friendId)
            ) {
                setMessages(prev => [...prev, message]);
            }
        };

        const handleMessageSent = (message) => {
            setMessages(prev => {
                const exists = prev.find(m => m._id === message._id);
                if (exists) return prev;
                return [...prev, message];
            });
        };

        const handleUserTyping = (data) => {
            if (data.userId === friendId) {
                setTyping(true);
            }
        };

        const handleUserStopTyping = (data) => {
            if (data.userId === friendId) {
                setTyping(false);
            }
        };

        socket.on("receive-message", handleReceiveMessage);
        socket.on("message-sent", handleMessageSent);
        socket.on("user-typing", handleUserTyping);
        socket.on("user-stop-typing", handleUserStopTyping);

        return () => {
            socket.off("receive-message", handleReceiveMessage);
            socket.off("message-sent", handleMessageSent);
            socket.off("user-typing", handleUserTyping);
            socket.off("user-stop-typing", handleUserStopTyping);
        };
    }, [friendId, currentUser?.id]);

    const fetchMessages = async () => {
        try {
            const { data } = await axiosInstance.get(`/chat/messages/${friendId}`);
            setMessages(data);

            // Mark messages as read via socket
            const socket = getSocket();
            if (socket) {
                socket.emit("mark-read", { senderId: friendId });
            }
        } catch (err) {
            console.error("Failed to fetch messages:", err);
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const socket = getSocket();
        if (socket) {
            socket.emit("send-message", {
                recipientId: friendId,
                message: newMessage.trim()
            });
            socket.emit("stop-typing", { recipientId: friendId });
        }
        setNewMessage("");
    };

    const handleTyping = () => {
        const socket = getSocket();
        if (socket) {
            socket.emit("typing", { recipientId: friendId });
        }
    };

    const handleStopTyping = () => {
        const socket = getSocket();
        if (socket) {
            socket.emit("stop-typing", { recipientId: friendId });
        }
    };

    const userId = currentUser?.id || currentUser?._id;

    return (
        <div className="fixed bottom-0 right-4 w-96 z-50 rounded-t-2xl border border-red-500/20 bg-[#0a0a0b] backdrop-blur-xl shadow-[0_-4px_30px_rgba(239,68,68,0.15)] overflow-hidden flex flex-col" style={{ height: '600px' }}>
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-red-500/20 bg-gradient-to-r from-red-600/20 to-orange-500/10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white font-bold text-xs">
                        {friend.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-white text-sm font-semibold">{friend.username}</h3>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                >
                    <FaTimes />
                </button>
            </div>

            {/* Search Bar */}
            <div className="p-2 border-b border-red-500/10 bg-white/5">
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full pl-8 pr-3 py-1.5 rounded-md bg-white/5 border border-red-500/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-red-500/30"
                    />
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-white/5">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-6 h-6 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-sm text-center">Start a conversation!</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const senderId = msg.sender?._id || msg.sender;
                        const isMine = senderId === userId;
                        return (
                            <div
                                key={msg._id || idx}
                                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] p-2.5 rounded-lg text-sm ${
                                        isMine
                                            ? "bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-br-none"
                                            : "bg-white/10 text-gray-200 rounded-bl-none"
                                    }`}
                                >
                                    <p>{msg.message}</p>
                                    <p className="text-[10px] mt-1 opacity-60">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                {typing && (
                    <div className="flex justify-start">
                        <div className="bg-white/10 p-2.5 rounded-lg rounded-bl-none text-sm text-gray-400 italic">
                            {friend.username} is typing...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 border-t border-red-500/20 bg-white/5">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onFocus={handleTyping}
                        onBlur={handleStopTyping}
                        placeholder="Message"
                        className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500/50"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaPaperPlane className="text-sm" />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ChatBox;