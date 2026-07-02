import { io } from "socket.io-client";

const SOCKET_URL = (import.meta.env.VITE_API_URL || "https://kk-dgp-vt-fsmern-jun.onrender.com").replace(/\/$/, "");

let socket = null;
let connectionListeners = [];

export const connectSocket = (token) => {
    if (socket?.connected) return socket;

    socket = io(SOCKET_URL, {
        auth: { token },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000
    });

    socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
        connectionListeners.forEach(fn => fn(true));
    });

    socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
    });

    socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        connectionListeners.forEach(fn => fn(false));
    });

    return socket;
};

export const getSocket = () => socket;

export const waitForSocket = () => {
    return new Promise((resolve) => {
        if (socket?.connected) {
            resolve(socket);
            return;
        }
        const onConnect = (connected) => {
            if (connected) {
                connectionListeners = connectionListeners.filter(fn => fn !== onConnect);
                resolve(socket);
            }
        };
        connectionListeners.push(onConnect);
        if (socket?.connected) {
            resolve(socket);
        }
    });
};

export const disconnectSocket = () => {
    if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
    }
    connectionListeners = [];
};

export default socket;