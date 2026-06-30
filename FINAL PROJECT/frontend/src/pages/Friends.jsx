import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../services/axiosInstance";
import Notification from "../components/Notification";
import ChatBox from "../components/ChatBox";
import { 
    FaUserFriends, 
    FaUserPlus, 
    FaUserMinus, 
    FaCheck, 
    FaTimes, 
    FaClock,
    FaSearch,
    FaComment
} from "react-icons/fa";
import { 
    getFriends, 
    getPendingRequests, 
    getSentRequests,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend
} from "../services/friendService";

function Friends() {
    const [friends, setFriends] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [notification, setNotification] = useState(null);
    const [activeChat, setActiveChat] = useState(null);
    const [selectedFriend, setSelectedFriend] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [friendsData, pendingData, sentData] = await Promise.all([
                getFriends(),
                getPendingRequests(),
                getSentRequests()
            ]);
            setFriends(friendsData);
            setPendingRequests(pendingData);
            setSentRequests(sentData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setSearching(true);
        setSearchResults([]);
        setNotification(null);
        try {
            const { data } = await axiosInstance.get(`/users/search?search=${encodeURIComponent(searchQuery)}`);
            
            if (!Array.isArray(data)) {
                setNotification({
                    message: "Invalid response from server",
                    type: "error"
                });
                return;
            }
            
            const currentUserId = JSON.parse(localStorage.getItem("user"))?._id;
            const filteredResults = data.filter(user => user._id !== currentUserId);
            
            setSearchResults(filteredResults);
            
            if (filteredResults.length === 0) {
                setNotification({
                    message: data.length === 0 
                        ? `No users found for "${searchQuery}". Try searching by username.`
                        : "All matching users are already your friends",
                    type: "info"
                });
            }
        } catch (err) {
            console.error("Search error:", err);
            const errorMessage = err.response?.data?.message || err.message || "Unknown error";
            
            let userMessage = "Search failed";
            if (err.response?.status === 404) {
                userMessage = "Search service not available. Please ensure the backend server is running.";
            } else if (err.response?.status === 401) {
                userMessage = "Please log in to search users";
            } else if (err.response?.status === 500) {
                userMessage = "Server error. Please try again later.";
            } else {
                userMessage = `Search failed: ${errorMessage}`;
            }
            
            setNotification({
                message: userMessage,
                type: "error"
            });
        } finally {
            setSearching(false);
        }
    };

    const handleSendRequest = async (userId) => {
        try {
            await sendFriendRequest(userId);
            setSearchResults(searchResults.filter(user => user._id !== userId));
            setNotification({
                message: "Friend request sent!",
                type: "success"
            });
        } catch (err) {
            setNotification({
                message: err.response?.data?.message || "Failed to send friend request",
                type: "error"
            });
        }
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            await acceptFriendRequest(requestId);
            setPendingRequests(pendingRequests.filter(r => r._id !== requestId));
            setNotification({
                message: "Friend request accepted!",
                type: "success"
            });
        } catch (err) {
            setNotification({
                message: err.response?.data?.message || "Failed to accept request",
                type: "error"
            });
        }
    };

    const handleRejectRequest = async (requestId) => {
        try {
            await rejectFriendRequest(requestId);
            setPendingRequests(pendingRequests.filter(r => r._id !== requestId));
            setNotification({
                message: "Friend request rejected",
                type: "info"
            });
        } catch (err) {
            setNotification({
                message: err.response?.data?.message || "Failed to reject request",
                type: "error"
            });
        }
    };

    const handleRemoveFriend = async (friendshipId) => {
        if (!window.confirm("Are you sure you want to remove this friend?")) return;
        try {
            await removeFriend(friendshipId);
            setFriends(friends.filter(f => f.friendshipId !== friendshipId));
            setNotification({
                message: "Friend removed",
                type: "success"
            });
        } catch (err) {
            setNotification({
                message: err.response?.data?.message || "Failed to remove friend",
                type: "error"
            });
        }
    };

    const handleFriendClick = (friend) => {
        setSelectedFriend(friend);
        setActiveChat(friend);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0000] via-[#0a0a0b] to-[#120000]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Loading Friends...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a0000] via-[#0a0a0b] to-[#120000] text-white pt-20 pb-12">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            
            <div className="flex h-[calc(100vh-80px)]">
                {/* Left Sidebar - Discord Style */}
                <div className="w-80 border-r border-red-500/20 bg-white/5 backdrop-blur-xl flex flex-col">
                    {/* Search Bar */}
                    <div className="p-4 border-b border-red-500/10">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                            <input
                                type="text"
                                placeholder="Find or start a conversation"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500/50"
                            />
                        </div>
                    </div>

                    {/* Friends Section */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-4 border-b border-red-500/10">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <FaUserFriends className="text-red-400" />
                                Friends
                            </h2>
                        </div>

                        {/* Pending Requests */}
                        {pendingRequests.length > 0 && (
                            <div className="p-4 border-b border-yellow-500/20 bg-yellow-500/5">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold text-yellow-400">Friend Requests</h3>
                                    <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 text-xs font-bold">
                                        {pendingRequests.length}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {pendingRequests.slice(0, 3).map(request => (
                                        <div key={request._id} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs">
                                                    {request.requester.username?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm text-white truncate">{request.requester.username}</span>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleAcceptRequest(request._id)}
                                                    className="p-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all"
                                                    title="Accept"
                                                >
                                                    <FaCheck className="text-xs" />
                                                </button>
                                                <button
                                                    onClick={() => handleRejectRequest(request._id)}
                                                    className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                                                    title="Reject"
                                                >
                                                    <FaTimes className="text-xs" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Friends List */}
                        <div className="p-2">
                            {friends.length === 0 ? (
                                <p className="text-center text-gray-500 text-sm py-4">No friends yet</p>
                            ) : (
                                <div className="space-y-1">
                                    {friends.map(friend => (
                                        <div
                                            key={friend.id}
                                            onClick={() => handleFriendClick(friend)}
                                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                                                selectedFriend?.id === friend.id
                                                    ? "bg-red-500/20 border border-red-500/30"
                                                    : "hover:bg-white/5 border border-transparent"
                                            }`}
                                        >
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white font-bold">
                                                    {friend.username?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0b]" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white text-sm font-semibold truncate">{friend.username}</h3>
                                                <p className="text-gray-500 text-xs truncate">Online</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col">
                    {selectedFriend ? (
                        <>
                            {/* Chat Header */}
                            <div className="flex items-center justify-between p-4 border-b border-red-500/20 bg-gradient-to-r from-red-600/20 to-orange-500/10">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white font-bold">
                                            {selectedFriend.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0b]" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">{selectedFriend.username}</h3>
                                        <p className="text-gray-400 text-xs">Online</p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white/5">
                                {activeChat && (
                                    <ChatBox
                                        friend={activeChat}
                                        onClose={() => {
                                            setActiveChat(null);
                                            setSelectedFriend(null);
                                        }}
                                    />
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <FaUserFriends className="text-6xl text-gray-700 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-400 mb-2">Welcome to Friends</h3>
                                <p className="text-gray-500 text-sm">Select a friend to start chatting</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Search Results Modal */}
            {searchResults.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed top-24 right-4 w-96 max-h-[500px] overflow-y-auto rounded-2xl border border-red-500/20 bg-white/5 backdrop-blur-xl p-4 z-50 shadow-[0_4px_30px_rgba(239,68,68,0.2)]"
                >
                    <h3 className="text-lg font-bold text-white mb-3">Search Results</h3>
                    <div className="space-y-2">
                        {searchResults.map(user => (
                            <div key={user._id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-red-500/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white font-bold">
                                        {user.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">{user.username}</h3>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleSendRequest(user._id)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
                                >
                                    <FaUserPlus />
                                    Add Friend
                                </button>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default Friends;