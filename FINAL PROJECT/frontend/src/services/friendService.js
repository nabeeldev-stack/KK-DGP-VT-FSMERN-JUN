import axiosInstance from "./axiosInstance";

// Send friend request
export const sendFriendRequest = async (recipientId) => {
    const { data } = await axiosInstance.post("/friends/send-request", { recipientId });
    return data;
};

// Accept friend request
export const acceptFriendRequest = async (requestId) => {
    const { data } = await axiosInstance.post("/friends/accept-request", { requestId });
    return data;
};

// Reject friend request
export const rejectFriendRequest = async (requestId) => {
    const { data } = await axiosInstance.post("/friends/reject-request", { requestId });
    return data;
};

// Remove friend
export const removeFriend = async (friendId) => {
    const { data } = await axiosInstance.post("/friends/remove-friend", { friendId });
    return data;
};

// Get friends list
export const getFriends = async () => {
    const { data } = await axiosInstance.get("/friends/friends");
    return data;
};

// Get pending requests
export const getPendingRequests = async () => {
    const { data } = await axiosInstance.get("/friends/pending-requests");
    return data;
};

// Get sent requests
export const getSentRequests = async () => {
    const { data } = await axiosInstance.get("/friends/sent-requests");
    return data;
};