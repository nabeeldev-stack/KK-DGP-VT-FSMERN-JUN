const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Message = require("../models/message");

const connectedUsers = new Map(); // userId -> { socketId, status }

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

    io.on("connection", async (socket) => {
        const userId = socket.user._id.toString();
        
        // Set the user status (default online)
        const prevData = connectedUsers.get(userId);
        const userStatus = prevData?.status || "online";
        connectedUsers.set(userId, { socketId: socket.id, status: userStatus });

        console.log(`User connected: ${socket.user.username} (${userId})`);

        // Join a personal room for direct messaging
        socket.join(userId);

        // Update user in DB
        await User.findByIdAndUpdate(userId, { status: userStatus });

        // Broadcast online status to all users
        io.emit("user-status", { userId, status: userStatus });

        // Handle sending messages (unchanged from before)
        socket.on("send-message", async (data) => {
            try {
                const { recipientId, message, sticker } = data;

                if (!recipientId) return;
                if (!message?.trim() && !sticker) return;

                const newMessage = await Message.create({
                    sender: userId,
                    recipient: recipientId,
                    message: message?.trim() || "",
                    sticker: sticker || null
                });

                const populatedMessage = await Message.findById(newMessage._id)
                    .populate("sender", "username avatar");

                if (connectedUsers.has(recipientId)) {
                    io.to(recipientId).emit("receive-message", {
                        ...populatedMessage.toObject(),
                        _id: populatedMessage._id
                    });
                }

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

        // Update user status (idle, dnd, online)
        socket.on("update-status", async (data) => {
            try {
                const { status } = data;
                if (!["online", "idle", "dnd"].includes(status)) return;

                const userEntry = connectedUsers.get(userId);
                if (userEntry) {
                    userEntry.status = status;
                    connectedUsers.set(userId, userEntry);
                }

                await User.findByIdAndUpdate(userId, { status });
                io.emit("user-status", { userId, status });
                console.log(`User ${socket.user.username} changed status to ${status}`);
            } catch (error) {
                console.error("Error updating status:", error);
            }
        });

        // Request current statuses of all online users
        socket.on("get-statuses", () => {
            const statuses = {};
            connectedUsers.forEach((value, key) => {
                statuses[key] = value.status;
            });
            socket.emit("all-statuses", statuses);
        });

        // Handle disconnection
        socket.on("disconnect", async () => {
            connectedUsers.delete(userId);
            await User.findByIdAndUpdate(userId, { status: "offline" });
            io.emit("user-status", { userId, status: "offline" });
            console.log(`User disconnected: ${socket.user.username} (${userId})`);
        });
    });
};

module.exports = { setupSocket, connectedUsers };