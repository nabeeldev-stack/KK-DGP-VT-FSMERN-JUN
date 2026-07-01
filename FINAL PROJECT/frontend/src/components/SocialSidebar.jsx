import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    FaUserFriends, FaTimes, FaChevronDown, FaCircle, 
    FaComments, FaSearch, FaUserPlus, FaCheck, FaGamepad
} from "react-icons/fa";
import axiosInstance from "../services/axiosInstance";
import { getSocket } from "../services/socket";
import { useMyStatus, useAllStatuses, getStatusLabel } from "../hooks/useStatus";
import { getFriends, getPendingRequests, acceptFriendRequest, rejectFriendRequest, sendFriendRequest } from "../services/friendService";

const STATUS_OPTIONS = [
    { key: "online", color: "bg-green-500", label: "Online" },
    { key: "idle", color: "bg-yellow-500", label: "Idle" },
    { key: "dnd", color: "bg-red-500", label: "Do Not Disturb" },
];

function SocialSidebar({ isOpen, onClose }) {
    const [myStatus, updateStatus] = useMyStatus();
    const [friends, setFriends] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [showStatusMenu, setShowStatusMenu] = useState(false);
    const [activeTab, setActiveTab] = useState("friends");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [notification, setNotification] = useState(null);
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const sidebarRef = useRef(null);
    const statusMenuRef = useRef(null);
    const statuses = useAllStatuses();

    const myStatusColor = {
        online: "bg-green-500",
        idle: "bg-yellow-500",
        dnd: "bg-red-500",
        offline: "bg-gray-500"
    }[myStatus] || "bg-gray-500";

    useEffect(() => {
        if (!isOpen) return;
        fetchFriends();
        fetchPending();
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target) && !e.target.closest(".social-sidebar-toggle")) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    useEffect(() => {
        const handleClickOutsideStatus = (e) => {
            if (statusMenuRef.current && !statusMenuRef.current.contains(e.target)) {
                setShowStatusMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutsideStatus);
        return () => document.removeEventListener("mousedown", handleClickOutsideStatus);
    }, []);

    const fetchFriends = async () => {
        try {
            const data = await getFriends();
            setFriends(data);
        } catch (err) {
            console.error("Failed to fetch friends:", err);
        }
    };

    const fetchPending = async () => {
        try {
            const data = await getPendingRequests();
            setPendingRequests(data);
        } catch (err) {
            console.error("Failed to fetch pending:", err);
        }
    };

    const handleAccept = async (requestId) => {
        await acceptFriendRequest(requestId);
        setPendingRequests(prev => prev.filter(r => r._id !== requestId));
        fetchFriends();
    };

    const handleReject = async (requestId) => {
        await rejectFriendRequest(requestId);
        setPendingRequests(prev => prev.filter(r => r._id !== requestId));
    };

    const onlineFriends = friends.filter(f => statuses[f.id] && statuses[f.id] !== "offline");

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
            )}

            {/* Sidebar */}
            <div 
                ref={sidebarRef}
                className={`fixed top-0 right-0 h-full w-96 bg-[#0d0d1a] border-l border-red-500/20 shadow-[-10px_0_40px_rgba(239,68,68,0.15)] z-50 transform transition-all duration-300 ease-out ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-red-500/10">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center">
                                <FaGamepad className="text-white text-lg" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-lg">Social Hub</h2>
                            <p className="text-gray-500 text-xs">{onlineFriends.length} friends online</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* User Status Section */}
                <div className="p-4 border-b border-red-500/10 bg-gradient-to-r from-red-600/5 to-transparent">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                                    {currentUser?.username?.charAt(0).toUpperCase()}
                                </div>
                                <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 ${myStatusColor} rounded-full border-2 border-[#0d0d1a]`} />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-sm">{currentUser?.username}</h3>
                                <p className="text-gray-500 text-xs">{getStatusLabel(myStatus)}</p>
                            </div>
                        </div>

                        {/* Status Selector */}
                        <div className="relative" ref={statusMenuRef}>
                            <button
                                onClick={() => setShowStatusMenu(!showStatusMenu)}
                                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                                title="Change Status"
                            >
                                <FaChevronDown className="text-xs" />
                            </button>
                            {showStatusMenu && (
                                <div className="absolute bottom-full mb-2 right-0 w-48 bg-[#1a1a2e] border border-red-500/20 rounded-xl p-2 shadow-[0_0_30px_rgba(239,68,68,0.2)] z-50">
                                    <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider px-2 py-1.5">
                                        Set Status
                                    </div>
                                    {STATUS_OPTIONS.map(opt => (
                                        <button
                                            key={opt.key}
                                            onClick={() => {
                                                updateStatus(opt.key);
                                                setShowStatusMenu(false);
                                            }}
                                            className={`flex items-center gap-3 w-full px-2 py-2 rounded-lg text-sm transition-all ${
                                                myStatus === opt.key
                                                    ? "bg-red-500/10 text-white"
                                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                            }`}
                                        >
                                            <div className={`w-3 h-3 ${opt.color} rounded-full`} />
                                            <span>{opt.label}</span>
                                            {myStatus === opt.key && (
                                                <FaCircle className="ml-auto text-[8px] text-red-500" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-red-500/10">
                    <button
                        onClick={() => setActiveTab("friends")}
                        className={`flex-1 py-3 text-sm font-semibold transition-all relative ${
                            activeTab === "friends" 
                                ? "text-red-400" 
                                : "text-gray-500 hover:text-gray-300"
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <FaUserFriends className="text-xs" />
                            Friends
                        </div>
                        {activeTab === "friends" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 to-orange-500" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("requests")}
                        className={`flex-1 py-3 text-sm font-semibold transition-all relative ${
                            activeTab === "requests" 
                                ? "text-red-400" 
                                : "text-gray-500 hover:text-gray-300"
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <FaUserPlus className="text-xs" />
                            Requests
                            {pendingRequests.length > 0 && (
                                <span className="px-1.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-bold">
                                    {pendingRequests.length}
                                </span>
                            )}
                        </div>
                        {activeTab === "requests" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 to-orange-500" />
                        )}
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto" style={{ height: "calc(100vh - 280px)" }}>
                    {activeTab === "friends" ? (
                        <div className="p-3">
                            {/* Online Friends */}
                            <div className="mb-4">
                                <div className="flex items-center gap-2 px-2 py-2">
                                    <FaCircle className="text-[6px] text-green-500" />
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Online — {onlineFriends.length}
                                    </span>
                                </div>
                                {onlineFriends.length === 0 ? (
                                    <p className="text-gray-600 text-xs text-center py-4">No friends online</p>
                                ) : (
                                    <div className="space-y-0.5">
                                        {friends.map(friend => {
                                            const friendStatus = statuses[friend.id];
                                            if (!friendStatus || friendStatus === "offline") return null;
                                            const statusColor = friendStatus === "online" ? "bg-green-500" : friendStatus === "idle" ? "bg-yellow-500" : "bg-red-500";
                                            return (
                                                <Link 
                                                    key={friend.id} 
                                                    to={`/user/${friend.id}`}
                                                    onClick={onClose}
                                                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                                                >
                                                    <div className="relative">
                                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                                                            {friend.username?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${statusColor} rounded-full border-2 border-[#0d0d1a]`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-white text-sm font-medium truncate">{friend.username}</h3>
                                                        <p className="text-gray-500 text-xs">{getStatusLabel(friendStatus)}</p>
                                                    </div>
                                                    <div className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-red-400 transition-all">
                                                        <FaUserFriends className="text-xs" />
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Offline Friends */}
                            <div>
                                <div className="flex items-center gap-2 px-2 py-2">
                                    <FaCircle className="text-[6px] text-gray-600" />
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Offline — {friends.length - onlineFriends.length}
                                    </span>
                                </div>
                                {friends.filter(f => !statuses[f.id] || statuses[f.id] === "offline").length === 0 ? (
                                    <p className="text-gray-600 text-xs text-center py-4">No offline friends</p>
                                ) : (
                                    <div className="space-y-0.5">
                                        {friends.map(friend => {
                                            const friendStatus = statuses[friend.id];
                                            if (friendStatus && friendStatus !== "offline") return null;
                                            return (
                                                <Link 
                                                    key={friend.id} 
                                                    to={`/user/${friend.id}`}
                                                    onClick={onClose}
                                                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer opacity-60"
                                                >
                                                    <div className="relative">
                                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-600 to-gray-500 flex items-center justify-center text-white font-bold text-sm">
                                                            {friend.username?.charAt(0).toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-gray-400 text-sm font-medium truncate">{friend.username}</h3>
                                                        <p className="text-gray-600 text-xs">Offline</p>
                                                    </div>
                                                    <div className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-red-400 transition-all">
                                                        <FaUserFriends className="text-xs" />
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="p-3">
                            {/* Add Friend Search */}
                            <div className="mb-4">
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                                    <input
                                        type="text"
                                        placeholder="Search users to add friends..."
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            if (!e.target.value.trim()) {
                                                setSearchResults([]);
                                                setSearching(false);
                                            }
                                        }}
                                        onKeyDown={async (e) => {
                                            if (e.key === 'Enter' && searchQuery.trim()) {
                                                e.preventDefault();
                                                setSearching(true);
                                                setSearchResults([]);
                                                try {
                                                    const { data } = await axiosInstance.get(`/users/search?search=${encodeURIComponent(searchQuery.trim())}`);
                                                    if (Array.isArray(data)) {
                                                        const currentUserId = currentUser?._id || currentUser?.id;
                                                        setSearchResults(data.filter(u => u._id !== currentUserId));
                                                    }
                                                } catch (err) {
                                                    console.error("Search error:", err);
                                                } finally {
                                                    setSearching(false);
                                                }
                                            }
                                        }}
                                        className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500/50"
                                    />
                                </div>

                                {/* Search Results */}
                                {searchResults.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        <p className="text-xs text-gray-500 px-1 py-1 font-semibold uppercase tracking-wider">Search Results</p>
                                        {searchResults.map(user => (
                                            <Link 
                                                key={user._id} 
                                                to={`/user/${user._id}`}
                                                onClick={onClose}
                                                className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-red-500/10 hover:bg-white/10 transition-all"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white font-bold text-xs">
                                                        {user.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-white text-sm font-medium">{user.username}</span>
                                                </div>
                                            <button
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    await sendFriendRequest(user._id);
                                                    setSearchResults(prev => prev.filter(u => u._id !== user._id));
                                                }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-semibold hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
                                            >
                                                <FaUserPlus className="text-[10px]" />
                                                Add
                                            </button>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                                {searching && (
                                    <div className="flex items-center justify-center py-3">
                                        <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>

                            {/* Friend Requests */}
                            <div>
                                <div className="flex items-center justify-between px-1 py-2">
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Incoming Requests</span>
                                    {pendingRequests.length > 0 && (
                                        <span className="px-1.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-bold">
                                            {pendingRequests.length}
                                        </span>
                                    )}
                                </div>
                                {pendingRequests.length === 0 ? (
                                    <p className="text-gray-600 text-xs text-center py-6">No pending friend requests</p>
                                ) : (
                                    <div className="space-y-1">
                                        {pendingRequests.map(request => (
                                            <div key={request._id} className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-red-500/10">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs">
                                                        {request.requester.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-white text-sm font-medium">{request.requester.username}</h3>
                                                        <p className="text-gray-500 text-[10px]">Wants to be friends</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleAccept(request._id)}
                                                        className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all"
                                                        title="Accept"
                                                    >
                                                        <FaCheck className="text-xs" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(request._id)}
                                                        className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                                                        title="Reject"
                                                    >
                                                        <FaTimes className="text-xs" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Links */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-red-500/10 bg-[#0d0d1a]">
                    <Link 
                        to="/friends"
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-gradient-to-r from-red-600/20 to-orange-500/10 border border-red-500/20 text-red-400 hover:from-red-600/30 hover:to-orange-500/20 transition-all text-sm font-semibold"
                    >
                        <FaComments />
                        Open Full Chat
                    </Link>
                </div>
            </div>
        </>
    );
}

export default SocialSidebar;