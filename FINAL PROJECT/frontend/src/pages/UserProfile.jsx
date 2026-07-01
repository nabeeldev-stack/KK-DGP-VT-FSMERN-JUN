import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../services/axiosInstance";
import {
    FaUser,
    FaEnvelope,
    FaGamepad,
    FaArrowLeft,
    FaTwitter,
    FaInstagram,
    FaYoutube,
    FaTwitch,
    FaGithub,
    FaLinkedin,
    FaGlobe,
    FaInfoCircle,
    FaSmile
} from "react-icons/fa";

function UserProfile() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
    }, [userId]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await axiosInstance.get(`/users/profile/${userId}`);
            setUser(res.data);
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || "Failed to load user profile");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "online": return "bg-green-500";
            case "idle": return "bg-yellow-500";
            case "dnd": return "bg-red-500";
            default: return "bg-gray-500";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "online": return "Online";
            case "idle": return "Idle";
            case "dnd": return "Do Not Disturb";
            default: return "Offline";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0000] via-[#0a0a0b] to-[#120000]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Loading Profile...</p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0000] via-[#0a0a0b] to-[#120000]">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">😕</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
                    <p className="text-gray-400 mb-6">{error || "This user doesn't exist or has been removed"}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const accentColor = user.accentColor || "#5865F2";

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a0000] via-[#0a0a0b] to-[#120000] text-white pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-all"
                >
                    <FaArrowLeft />
                    <span>Back</span>
                </motion.button>

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-red-500/20 bg-white/5 backdrop-blur-xl overflow-hidden mb-6"
                >
                    {/* Banner */}
                    <div className="relative h-48 md:h-64 bg-gradient-to-r from-gray-800 to-gray-900 overflow-hidden">
                        {user?.banner ? (
                            <img
                                src={user.banner}
                                alt="Profile Banner"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div 
                                className="w-full h-full"
                                style={{ background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}11)` }}
                            />
                        )}
                    </div>

                    {/* Profile Header with Avatar */}
                    <div className="px-8 pb-8 -mt-16 relative">
                        <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                            <div className="relative group">
                                <div className="absolute inset-0 blur-xl rounded-full" style={{ background: `${accentColor}50` }} />
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.username}
                                        className="relative w-32 h-32 rounded-full object-cover border-4 border-[#0a0a0b]"
                                    />
                                ) : (
                                    <div
                                        className="relative w-32 h-32 rounded-full flex items-center justify-center text-5xl font-bold border-4 border-[#0a0a0b]"
                                        style={{
                                            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`
                                        }}
                                    >
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 mb-2">
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-3xl font-bold text-white">{user?.username}</h2>
                                    {user?.pronouns && (
                                        <span className="text-sm text-gray-400">({user.pronouns})</span>
                                    )}
                                </div>
                                
                                {/* Custom Status */}
                                {(user?.customStatus?.text || user?.customStatus?.emoji) && (
                                    <div className="flex items-center gap-2 text-gray-300 mb-2">
                                        {user.customStatus.emoji && <span>{user.customStatus.emoji}</span>}
                                        <span className="text-sm">{user.customStatus.text}</span>
                                    </div>
                                )}

                                {/* Role Badge */}
                                <span
                                    className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold border"
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

                    {/* Bio Section */}
                    {user?.bio && (
                        <div className="px-8 mb-6">
                            <div className="p-4 rounded-lg bg-white/5 border border-red-500/10">
                                <div className="flex items-start gap-2">
                                    <FaInfoCircle className="text-red-400 mt-1 flex-shrink-0" />
                                    <p className="text-gray-300">{user.bio}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Social Links Display */}
                    {Object.values(user?.socialLinks || {}).some(link => link) && (
                        <div className="px-8 mb-6">
                            <h3 className="text-sm font-semibold text-gray-400 mb-3">Social Links</h3>
                            <div className="flex flex-wrap gap-3">
                                {user?.socialLinks?.twitter && (
                                    <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                                        className="p-3 rounded-lg bg-white/5 border border-red-500/20 hover:border-red-500/40 hover:bg-white/10 transition-all">
                                        <FaTwitter className="text-blue-400 text-xl" />
                                    </a>
                                )}
                                {user?.socialLinks?.instagram && (
                                    <a href={user.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                                        className="p-3 rounded-lg bg-white/5 border border-red-500/20 hover:border-red-500/40 hover:bg-white/10 transition-all">
                                        <FaInstagram className="text-pink-400 text-xl" />
                                    </a>
                                )}
                                {user?.socialLinks?.youtube && (
                                    <a href={user.socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                                        className="p-3 rounded-lg bg-white/5 border border-red-500/20 hover:border-red-500/40 hover:bg-white/10 transition-all">
                                        <FaYoutube className="text-red-500 text-xl" />
                                    </a>
                                )}
                                {user?.socialLinks?.twitch && (
                                    <a href={user.socialLinks.twitch} target="_blank" rel="noopener noreferrer"
                                        className="p-3 rounded-lg bg-white/5 border border-red-500/20 hover:border-red-500/40 hover:bg-white/10 transition-all">
                                        <FaTwitch className="text-purple-400 text-xl" />
                                    </a>
                                )}
                                {user?.socialLinks?.github && (
                                    <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer"
                                        className="p-3 rounded-lg bg-white/5 border border-red-500/20 hover:border-red-500/40 hover:bg-white/10 transition-all">
                                        <FaGithub className="text-gray-400 text-xl" />
                                    </a>
                                )}
                                {user?.socialLinks?.linkedin && (
                                    <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                                        className="p-3 rounded-lg bg-white/5 border border-red-500/20 hover:border-red-500/40 hover:bg-white/10 transition-all">
                                        <FaLinkedin className="text-blue-600 text-xl" />
                                    </a>
                                )}
                                {user?.socialLinks?.website && (
                                    <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer"
                                        className="p-3 rounded-lg bg-white/5 border border-red-500/20 hover:border-red-500/40 hover:bg-white/10 transition-all">
                                        <FaGlobe className="text-green-400 text-xl" />
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Profile Stats */}
                    <div className="px-8 pb-8">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg bg-white/5 border border-red-500/10 text-center">
                                <div className="text-2xl font-bold text-white mb-1">
                                    {user?.role === "admin" ? "Admin" : "Gamer"}
                                </div>
                                <div className="text-xs text-gray-400">Role</div>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5 border border-red-500/10 text-center">
                                <div className="text-2xl font-bold text-white mb-1">
                                    {user?.createdAt ? new Date(user.createdAt).getFullYear() : "N/A"}
                                </div>
                                <div className="text-xs text-gray-400">Joined</div>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5 border border-red-500/10 text-center">
                                <div className="text-2xl font-bold text-white mb-1">
                                    {user?.accentColor || "#5865F2"}
                                </div>
                                <div className="text-xs text-gray-400">Theme</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Info Note */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center text-gray-500 text-sm"
                >
                    <p>This is a public profile view. Some information may be hidden for privacy.</p>
                </motion.div>
            </div>
        </div>
    );
}

export default UserProfile;