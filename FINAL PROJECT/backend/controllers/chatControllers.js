const Message = require("../models/message");
const User = require("../models/user");

// Get conversation messages between two users
const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, recipient: userId },
                { sender: userId, recipient: currentUserId }
            ]
        }).sort({ createdAt: 1 }).limit(100);

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Send a message (REST fallback - Socket.IO is primary)
const sendMessage = async (req, res) => {
    try {
        const { recipientId, message } = req.body;
        const senderId = req.user._id;

        if (!recipientId || !message) {
            return res.status(400).json({ message: "Recipient and message are required" });
        }

        const newMessage = await Message.create({
            sender: senderId,
            recipient: recipientId,
            message
        });

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Mark messages as read
const markAsRead = async (req, res) => {
    try {
        const { senderId } = req.body;
        const currentUserId = req.user._id;

        await Message.updateMany(
            { sender: senderId, recipient: currentUserId, read: false },
            { read: true }
        );

        res.json({ message: "Messages marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get recent conversations with last message
const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get all unique user IDs that the current user has chatted with
        const messages = await Message.find({
            $or: [
                { sender: userId },
                { recipient: userId }
            ]
        }).sort({ createdAt: -1 });

        // Extract unique conversation partners
        const conversationMap = new Map();

        for (const msg of messages) {
            const partnerId = msg.sender.toString() === userId.toString()
                ? msg.recipient.toString()
                : msg.sender.toString();

            if (!conversationMap.has(partnerId)) {
                conversationMap.set(partnerId, {
                    lastMessage: msg.message,
                    lastMessageTime: msg.createdAt,
                    unread: !msg.read && msg.sender.toString() !== userId.toString()
                });
            }
        }

        // Get user details for conversation partners
        const conversationUsers = await User.find({
            _id: { $in: Array.from(conversationMap.keys()) }
        }).select("username avatar");

        const conversations = conversationUsers.map(user => ({
            _id: user._id,
            username: user.username,
            avatar: user.avatar,
            ...conversationMap.get(user._id.toString())
        }));

        // Sort by last message time
        conversations.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getMessages,
    sendMessage,
    markAsRead,
    getConversations
};