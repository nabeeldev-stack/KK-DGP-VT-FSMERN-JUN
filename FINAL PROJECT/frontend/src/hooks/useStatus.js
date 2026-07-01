import { useState, useEffect, useCallback } from "react";
import { getSocket } from "../services/socket";

const STATUS_CONFIG = {
    online: { color: "bg-green-500", label: "Online" },
    idle: { color: "bg-yellow-500", label: "Idle" },
    dnd: { color: "bg-red-500", label: "Do Not Disturb" },
    offline: { color: "bg-gray-500", label: "Offline" },
};

export function useUserStatus(userId) {
    const [status, setStatus] = useState("offline");

    useEffect(() => {
        const socket = getSocket();
        if (!socket || !userId) return;

        const handleStatus = ({ userId: uid, status: newStatus }) => {
            if (uid === userId) {
                setStatus(newStatus);
            }
        };

        const handleAllStatuses = (statuses) => {
            if (statuses[userId]) {
                setStatus(statuses[userId]);
            }
        };

        socket.on("user-status", handleStatus);
        socket.on("all-statuses", handleAllStatuses);

        return () => {
            socket.off("user-status", handleStatus);
            socket.off("all-statuses", handleAllStatuses);
        };
    }, [userId]);

    return status;
}

export function useAllStatuses() {
    const [statuses, setStatuses] = useState({});

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const handleStatus = ({ userId, status }) => {
            setStatuses(prev => ({ ...prev, [userId]: status }));
        };

        const handleAllStatuses = (statusesData) => {
            setStatuses(statusesData);
        };

        socket.on("user-status", handleStatus);
        socket.on("all-statuses", handleAllStatuses);

        // Request initial statuses
        socket.emit("get-statuses");

        return () => {
            socket.off("user-status", handleStatus);
            socket.off("all-statuses", handleAllStatuses);
        };
    }, []);

    return statuses;
}

export function useMyStatus() {
    const [myStatus, setMyStatus] = useState("online");
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const userId = currentUser?.id || currentUser?._id;

    useEffect(() => {
        const socket = getSocket();
        if (!socket || !userId) return;

        const handleStatus = ({ userId: uid, status }) => {
            if (uid === userId) {
                setMyStatus(status);
            }
        };

        socket.on("user-status", handleStatus);
        return () => socket.off("user-status", handleStatus);
    }, [userId]);

    const updateStatus = useCallback((newStatus) => {
        const socket = getSocket();
        if (!socket) return;
        socket.emit("update-status", { status: newStatus });
        setMyStatus(newStatus);
    }, []);

    return [myStatus, updateStatus];
}

export function getStatusColor(status) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.offline;
    return config.color;
}

export function getStatusLabel(status) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.offline;
    return config.label;
}

export default STATUS_CONFIG;
