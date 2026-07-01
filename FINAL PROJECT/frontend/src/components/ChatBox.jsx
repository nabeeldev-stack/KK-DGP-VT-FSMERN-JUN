import { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaTimes, FaSearch, FaSmile, FaCircle } from "react-icons/fa";
import axiosInstance from "../services/axiosInstance";
import { getSocket } from "../services/socket";
import { useUserStatus, getStatusLabel } from "../hooks/useStatus";

const STICKERS = [
    { id: "like", emoji: "👍", label: "Like" },
    { id: "love", emoji: "❤️", label: "Love" },
    { id: "laugh", emoji: "😂", label: "Laugh" },
    { id: "wow", emoji: "😮", label: "Wow" },
    { id: "sad", emoji: "😢", label: "Sad" },
    { id: "angry", emoji: "😡", label: "Angry" },
    { id: "clap", emoji: "👏", label: "Clap" },
    { id: "fire", emoji: "🔥", label: "Fire" },
    { id: "party", emoji: "🎉", label: "Party" },
    { id: "heart", emoji: "💖", label: "Heart" },
    { id: "thumbsup", emoji: "👍🏻", label: "Thumbs Up" },
    { id: "ok", emoji: "👌", label: "OK" },
    { id: "wave", emoji: "👋", label: "Wave" },
    { id: "rocket", emoji: "🚀", label: "Rocket" },
    { id: "star", emoji: "⭐", label: "Star" },
    { id: "100", emoji: "💯", label: "100" },
    { id: "eyes", emoji: "👀", label: "Eyes" },
    { id: "folded", emoji: "🙏", label: "Pray" },
    { id: "muscle", emoji: "💪", label: "Muscle" },
    { id: "cry", emoji: "😭", label: "Cry Laugh" },
    { id: "cool", emoji: "😎", label: "Cool" },
    { id: "thinking", emoji: "🤔", label: "Thinking" },
    { id: "shy", emoji: "🥹", label: "Shy" },
    { id: "ghost", emoji: "👻", label: "Ghost" },
];

function ChatBox({ friend, onClose }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [typing, setTyping] = useState(false);
    const [showStickers, setShowStickers] = useState(false);
    const messagesEndRef = useRef(null);
    const stickerPickerRef = useRef(null);
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const friendId = friend.id || friend._id;
    const friendStatus = useUserStatus(friendId);

    useEffect(() => {
        if (friendId) {
            fetchMessages();
        }
    }, [friendId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (stickerPickerRef.current && !stickerPickerRef.current.contains(e.target)) {
                setShowStickers(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

    const handleSendSticker = (sticker) => {
        const socket = getSocket();
        if (socket) {
            socket.emit("send-message", {
                recipientId: friendId,
                message: "",
                sticker: sticker.id
            });
        }
        setShowStickers(false);
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

    const getStickerById = (stickerId) => {
        return STICKERS.find(s => s.id === stickerId);
    };

    return (
        <div className="flex-1 flex flex-col bg-[#0a0a0b] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-red-500/20 bg-gradient-to-r from-red-600/20 to-orange-500/10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white font-bold">
                            {friend.username?.charAt(0).toUpperCase()}
                        </div>
                        {friendStatus !== "offline" && (
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0a0a0b] ${
                                friendStatus === "online" ? "bg-green-500" :
                                friendStatus === "idle" ? "bg-yellow-500" :
                                "bg-red-500"
                            }`} />
                        )}
                    </div>
                    <div>
                        <h3 className="text-white font-semibold">{friend.username}</h3>
                        <p className="text-gray-400 text-xs">{getStatusLabel(friendStatus)}</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                >
                    <FaTimes />
                </button>
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
                        const stickerData = msg.sticker ? getStickerById(msg.sticker) : null;
                        return (
                            <div
                                key={msg._id || idx}
                                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                            >
                                {stickerData ? (
                                    <div
                                        className={`p-1 rounded-lg ${
                                            isMine
                                                ? "bg-gradient-to-r from-red-600/20 to-orange-500/20"
                                                : "bg-white/5"
                                        }`}
                                    >
                                        <div className="text-5xl cursor-default select-none">
                                            {stickerData.emoji}
                                        </div>
                                        <p className="text-[10px] mt-1 opacity-60 text-center">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                ) : (
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
                                )}
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
            <form onSubmit={handleSend} className="p-3 border-t border-red-500/20 bg-white/5 relative">
                <div className="flex gap-2">
                    <div className="relative" ref={stickerPickerRef}>
                        <button
                            type="button"
                            onClick={() => setShowStickers(!showStickers)}
                            className="p-2 rounded-lg bg-white/5 border border-red-500/20 text-red-400 hover:text-red-300 hover:border-red-500/50 transition-all"
                            title="Send Sticker"
                        >
                            <FaSmile className="text-sm" />
                        </button>
                        
                        {/* Sticker Picker Popup */}
                        {showStickers && (
                            <div className="absolute bottom-12 left-0 w-72 bg-[#1a1a2e] border border-red-500/20 rounded-xl p-3 shadow-[0_0_30px_rgba(239,68,68,0.2)] z-50">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-white text-xs font-semibold">Stickers</h4>
                                    <button
                                        type="button"
                                        onClick={() => setShowStickers(false)}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        <FaTimes className="text-xs" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-6 gap-1">
                                    {STICKERS.map(sticker => (
                                        <button
                                            key={sticker.id}
                                            type="button"
                                            onClick={() => handleSendSticker(sticker)}
                                            className="w-10 h-10 flex items-center justify-center text-xl rounded-lg hover:bg-white/10 transition-all hover:scale-110"
                                            title={sticker.label}
                                        >
                                            {sticker.emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
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