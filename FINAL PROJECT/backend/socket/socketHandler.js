const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Message = require("../models/message");

const connectedUsers = new Map(); // userId -> socketId

const setupSocket = (io) => {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token || socket.handshake.query.token;
            if (!token) {
                return next(new Error("Authentication required"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select("-password");

            if (!user) {
                return next(new Error("User not found"));
            }

            socket.user = user;
            next();
        } catch (error) {
            next(new Error("Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        const userId = socket.user._id.toString();
        connectedUsers.set(userId, socket.id);

        console.log(`User connected: ${socket.user.username} (${userId})`);

        // Join a personal room for direct messaging
        socket.join(userId);

        // Notify all connected users about online status
        io.emit("user-online", userId);

        // Handle sending messages
        socket.on("send-message", async (data) => {
            try {
                const { recipientId, message } = data;

                if (!recipientId || !message.trim()) return;

                // Save message to database
                const newMessage = await Message.create({
                    sender: userId,
                    recipient: recipientId,
                    message: message.trim()
                });

                const populatedMessage = await Message.findById(newMessage._id)
                    .populate("sender", "username avatar");

                // Send to recipient if online
                if (connectedUsers.has(recipientId)) {
                    io.to(recipientId).emit("receive-message", {
                        ...populatedMessage.toObject(),
                        _id: populatedMessage._id
                    });
                }

                // Send back to sender for confirmation
                socket.emit("message-sent", {
                    ...populatedMessage.toObject(),
                    _id: populatedMessage._id
                });
            } catch (error) {
                console.error("Error sending message:", error);
                socket.emit("message-error", { error: "Failed to send message" });
            }
        });

        // Mark messages as read
        socket.on("mark-read", async (data) => {
            try {
                const { senderId } = data;
                await Message.updateMany(
                    { sender: senderId, recipient: userId, read: false },
                    { read: true }
                );
                io.to(senderId).emit("messages-read", { readBy: userId });
            } catch (error) {
                console.error("Error marking messages as read:", error);
            }
        });

        // User is typing
        socket.on("typing", (data) => {
            const { recipientId } = data;
            if (connectedUsers.has(recipientId)) {
                io.to(recipientId).emit("user-typing", { userId, username: socket.user.username });
            }
        });

        socket.on("stop-typing", (data) => {
            const { recipientId } = data;
            if (connectedUsers.has(recipientId)) {
                io.to(recipientId).emit("user-stop-typing", { userId });
            }
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            connectedUsers.delete(userId);
            io.emit("user-offline", userId);
            console.log(`User disconnected: ${socket.user.username} (${userId})`);
        });
    });
};

module.exports = { setupSocket, connectedUsers };