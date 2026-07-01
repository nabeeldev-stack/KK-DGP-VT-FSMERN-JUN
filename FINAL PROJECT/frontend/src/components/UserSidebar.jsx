import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    FaUser, FaCog, FaShieldAlt, FaGamepad, FaTimes,
    FaSignOutAlt, FaUserFriends, FaComments
} from "react-icons/fa";
import axiosInstance from "../services/axiosInstance";

function UserSidebar({ isOpen, onClose }) {
    const [user, setUser] = useState(null);
    const sidebarRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                setUser(null);
            }
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target) && !e.target.closest(".user-sidebar-toggle")) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    const handleLogout = async () => {
        try {
            await axiosInstance.post("/users/logout");
        } catch {
            // Best-effort
        }
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("user-updated"));
        onClose();
        navigate("/login");
    };

    const accentColor = user?.accentColor || "#5865F2";

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
            )}

            {/* Sidebar */}
            <div 
                ref={sidebarRef}
                className={`fixed top-0 right-0 h-full w-80 bg-[#0d0d1a] border-l border-red-500/20 shadow-[-10px_0_40px_rgba(239,68,68,0.15)] z-50 transform transition-all duration-300 ease-out ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-red-500/10">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center">
                                <FaUser className="text-white text-lg" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-lg">My Account</h2>
                            <p className="text-gray-500 text-xs">{user?.role === "admin" ? "Administrator" : "Gamer"}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* User Info Section */}
                <div className="p-4 border-b border-red-500/10 bg-gradient-to-r from-red-600/5 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div 
                                className="absolute inset-0 rounded-full blur-md opacity-50"
                                style={{ background: accentColor }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold text-base truncate">{user?.username}</h3>
                            <p className="text-gray-500 text-xs truncate">{user?.email}</p>
                            <span
                                className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                                style={{
                                    backgroundColor: `${accentColor}20`,
                                    borderColor: `${accentColor}50`,
                                    color: accentColor
                                }}
                            >
                                {user?.role?.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto p-3" style={{ height: "calc(100vh - 200px)" }}>
                    <div className="space-y-1">
                        {/* Profile Section */}
                        <div className="mb-4">
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider px-2 py-1.5 mb-2">
                                Profile
                            </p>
                            <Link
                                to="/profile"
                                onClick={onClose}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all group"
                            >
                                <div className="p-2 rounded-lg bg-red-500/10 text-red-400 group-hover:bg-red-500/20 transition-all">
                                    <FaUser className="text-sm" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white text-sm font-medium">My Profile</h3>
                                    <p className="text-gray-500 text-xs">View and edit your profile</p>
                                </div>
                            </Link>
                        </div>

                        {/* Social Hub */}
                        <div className="mb-4">
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider px-2 py-1.5 mb-2">
                                Social
                            </p>
                            <button
                                onClick={() => {
                                    onClose();
                                    // This will be handled by the navbar's social button
                                    setTimeout(() => {
                                        const socialBtn = document.querySelector('.social-sidebar-toggle');
                                        if (socialBtn) socialBtn.click();
                                    }, 100);
                                }}
                                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all group"
                            >
                                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-all">
                                    <FaComments className="text-sm" />
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-white text-sm font-medium">Social Hub</h3>
                                    <p className="text-gray-500 text-xs">Chat and connect</p>
                                </div>
                            </button>
                        </div>

                        {/* Admin Section */}
                        {user?.role === "admin" && (
                            <div className="mb-4">
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider px-2 py-1.5 mb-2">
                                    Administration
                                </p>
                                <Link
                                    to="/admin-dashboard"
                                    onClick={onClose}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all group"
                                >
                                    <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 group-hover:bg-yellow-500/20 transition-all">
                                        <FaShieldAlt className="text-sm" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white text-sm font-medium">Admin Dashboard</h3>
                                        <p className="text-gray-500 text-xs">Manage users and content</p>
                                    </div>
                                </Link>
                                <Link
                                    to="/add-game"
                                    onClick={onClose}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all group"
                                >
                                    <div className="p-2 rounded-lg bg-green-500/10 text-green-400 group-hover:bg-green-500/20 transition-all">
                                        <FaGamepad className="text-sm" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white text-sm font-medium">Add Game</h3>
                                        <p className="text-gray-500 text-xs">Add new games to platform</p>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-red-500/10 bg-[#0d0d1a]">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all text-sm font-semibold"
                    >
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
}

export default UserSidebar;