import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../services/axiosInstance";
import { FaUser, FaEnvelope, FaLock, FaSignOutAlt, FaGamepad, FaEdit, FaShieldAlt } from "react-icons/fa";

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [message, setMessage] = useState({ type: "", text: "" });
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const res = await axiosInstance.get("/users/profile");
            setUser(res.data);
            setFormData({
                username: res.data.username,
                email: res.data.email,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setMessage({ type: "", text: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        try {
            const updateData = {
                username: formData.username,
                email: formData.email
            };

            // Only include password fields if user wants to change password
            if (formData.newPassword) {
                if (formData.newPassword !== formData.confirmPassword) {
                    setMessage({ type: "error", text: "New passwords do not match" });
                    return;
                }
                if (formData.newPassword.length < 6) {
                    setMessage({ type: "error", text: "Password must be at least 6 characters" });
                    return;
                }
                updateData.currentPassword = formData.currentPassword;
                updateData.newPassword = formData.newPassword;
            }

            const res = await axiosInstance.put("/users/profile", updateData);
            setUser(res.data);
            setMessage({ type: "success", text: "Profile updated successfully!" });
            setEditing(false);
            setFormData({ ...formData, currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            setMessage({ 
                type: "error", 
                text: err?.response?.data?.message || "Failed to update profile" 
            });
        }
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        navigate("/login");
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a0000] via-[#0a0a0b] to-[#120000] text-white py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-black mb-2">My Profile</h1>
                    <p className="text-gray-400">Manage your account settings and preferences</p>
                </motion.div>

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-red-500/20 bg-white/5 backdrop-blur-xl p-8 mb-6"
                >
                    {/* Profile Header */}
                    <div className="flex items-center gap-6 mb-8 pb-8 border-b border-red-500/10">
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-600/30 blur-xl rounded-full" />
                            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-3xl font-bold">
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">{user?.username}</h2>
                            <p className="text-gray-400 flex items-center gap-2">
                                <FaEnvelope className="text-red-400" />
                                {user?.email}
                            </p>
                            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                                {user?.role?.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Message Alert */}
                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-6 p-4 rounded-lg ${
                                message.type === "success" 
                                    ? "bg-green-500/10 border border-green-500/30 text-green-400" 
                                    : "bg-red-500/10 border border-red-500/30 text-red-400"
                            }`}
                        >
                            {message.text}
                        </motion.div>
                    )}

                    {/* Profile Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Username & Email */}
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    <FaUser className="inline mr-2 text-red-400" />
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    <FaEnvelope className="inline mr-2 text-red-400" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Password Section */}
                        {editing && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mb-6 p-6 rounded-lg bg-red-500/5 border border-red-500/10"
                            >
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <FaLock className="text-red-400" />
                                    Change Password
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                            placeholder="Enter current password"
                                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                placeholder="Enter new password"
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Confirm new password"
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                            {!editing ? (
                                <button
                                    type="button"
                                    onClick={() => setEditing(true)}
                                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
                                >
                                    <FaEdit />
                                    Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
                                    >
                                        <FaShieldAlt />
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditing(false);
                                            setFormData({
                                                ...formData,
                                                username: user?.username,
                                                email: user?.email,
                                                currentPassword: "",
                                                newPassword: "",
                                                confirmPassword: ""
                                            });
                                            setMessage({ type: "", text: "" });
                                        }}
                                        className="px-6 py-3 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all font-semibold"
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </motion.div>

                {/* Quick Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid md:grid-cols-2 gap-4"
                >
                    <Link
                        to="/games"
                        className="flex items-center gap-4 p-6 rounded-xl border border-red-500/20 bg-white/5 backdrop-blur-xl hover:border-red-500/40 hover:bg-white/10 transition-all group"
                    >
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-red-600 to-orange-500">
                            <FaGamepad className="text-white text-xl" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">Browse Games</h3>
                            <p className="text-sm text-gray-400">Explore our game library</p>
                        </div>
                    </Link>

                    <button
                        onClick={logout}
                        className="flex items-center gap-4 p-6 rounded-xl border border-red-500/20 bg-white/5 backdrop-blur-xl hover:border-red-500/40 hover:bg-red-500/10 transition-all group w-full text-left"
                    >
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-red-700 to-red-600">
                            <FaSignOutAlt className="text-white text-xl" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">Logout</h3>
                            <p className="text-sm text-gray-400">Sign out of your account</p>
                        </div>
                    </button>
                </motion.div>
            </div>
        </div>
    );
}

export default Profile;