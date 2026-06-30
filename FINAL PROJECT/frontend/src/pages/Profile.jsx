import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../services/axiosInstance";
import { FaUser, FaEnvelope, FaLock, FaSignOutAlt, FaGamepad, FaEdit, FaShieldAlt, FaCamera } from "react-icons/fa";
import AvatarCropper from "../components/AvatarCropper";

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState({ type: "", text: "" });
    const [imageSrc, setImageSrc] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const navigate = useNavigate();

    const fetchUser = useCallback(async () => {
        try {
            const res = await axiosInstance.get("/users/profile");
            setUser(res.data);
            setUsername(res.data.username || "");
            setEmail(res.data.email || "");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const clearMessage = () => setMessage({ type: "", text: "" });

    const startEditing = () => {
        setUsername(user?.username || "");
        setEmail(user?.email || "");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setEditing(true);
        clearMessage();
    };

    const cancelEditing = () => {
        setUsername(user?.username || "");
        setEmail(user?.email || "");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setEditing(false);
        clearMessage();
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            setMessage({ type: "error", text: "Only JPG, PNG, GIF & WebP images are allowed." });
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setMessage({ type: "error", text: "File size must be under 2MB." });
            return;
        }

        // Create image URL for cropper
        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result);
            setShowCropper(true);
        };
        reader.readAsDataURL(file);
    };

    const handleCropComplete = async (croppedBlob) => {
        setShowCropper(false);
        setUploading(true);
        clearMessage();

        try {
            const form = new FormData();
            form.append("avatar", croppedBlob, "avatar.jpg");

            const res = await axiosInstance.put("/users/avatar", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setUser((prev) => ({ ...prev, avatar: res.data.avatar }));

            // Update localStorage
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            storedUser.avatar = res.data.avatar;
            localStorage.setItem("user", JSON.stringify(storedUser));

            // Notify Navbar
            window.dispatchEvent(new Event("user-updated"));

            setMessage({ type: "success", text: "Avatar uploaded successfully!" });
        } catch (err) {
            setMessage({
                type: "error",
                text: err?.response?.data?.message || "Failed to upload avatar",
            });
        } finally {
            setUploading(false);
            setImageSrc(null);
        }
    };

    const handleCropCancel = () => {
        setShowCropper(false);
        setImageSrc(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearMessage();

        try {
            const updateData = { username, email };

            if (newPassword) {
                if (newPassword !== confirmPassword) {
                    setMessage({ type: "error", text: "New passwords do not match" });
                    return;
                }
                if (newPassword.length < 6) {
                    setMessage({ type: "error", text: "Password must be at least 6 characters" });
                    return;
                }
                updateData.currentPassword = currentPassword;
                updateData.newPassword = newPassword;
            }

            const res = await axiosInstance.put("/users/profile", updateData);
            const updatedUser = { ...user, ...res.data };
            setUser(updatedUser);

            // Update localStorage
            localStorage.setItem("user", JSON.stringify({
                id: updatedUser._id || updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                avatar: updatedUser.avatar || "",
            }));

            // Notify Navbar
            window.dispatchEvent(new Event("user-updated"));

            setMessage({ type: "success", text: "Profile updated successfully!" });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setEditing(false);
        } catch (err) {
            setMessage({
                type: "error",
                text: err?.response?.data?.message || "Failed to update profile",
            });
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post("/users/logout");
        } catch {
            // Best-effort
        }
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("user-updated"));
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
        <div className="min-h-screen bg-gradient-to-br from-[#1a0000] via-[#0a0a0b] to-[#120000] text-white pt-24 pb-12 px-4">
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
                    {/* Profile Header with Avatar */}
                    <div className="flex items-center gap-6 mb-8 pb-8 border-b border-red-500/10">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-red-600/30 blur-xl rounded-full" />
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.username}
                                    className="relative w-24 h-24 rounded-full object-cover border-2 border-red-500/30"
                                />
                            ) : (
                                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-4xl font-bold">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            {/* Upload Overlay */}
                            <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-200">
                                <div className="text-center">
                                    <FaCamera className="text-white text-xl mx-auto mb-1" />
                                    <span className="text-white text-xs font-semibold">
                                        {uploading ? "..." : "Change"}
                                    </span>
                                </div>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    disabled={uploading || showCropper}
                                />
                            </label>
                            {/* Upload spinner */}
                            {uploading && (
                                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
                                    <div className="w-8 h-8 border-[3px] border-red-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
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

                    {/* Profile Form - only render form element when editing */}
                    {editing ? (
                        <form onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        <FaUser className="inline mr-2 text-red-400" />
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        <FaEnvelope className="inline mr-2 text-red-400" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password Section */}
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mb-6 p-6 rounded-lg bg-red-500/5 border border-red-500/10"
                            >
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <FaLock className="text-red-400" />
                                    Change Password (Optional)
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
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
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
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
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Confirm new password"
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
                                >
                                    <FaShieldAlt />
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelEditing}
                                    className="px-6 py-3 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div>
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        <FaUser className="inline mr-2 text-red-400" />
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        value={username}
                                        disabled
                                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white opacity-50 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        <FaEnvelope className="inline mr-2 text-red-400" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        disabled
                                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white opacity-50 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={startEditing}
                                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
                            >
                                <FaEdit />
                                Edit Profile
                            </button>
                        </div>
                    )}
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

            {/* Avatar Cropper Modal */}
            {showCropper && (
                <AvatarCropper
                    imageSrc={imageSrc}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                />
            )}
        </div>
    );
}

export default Profile;
