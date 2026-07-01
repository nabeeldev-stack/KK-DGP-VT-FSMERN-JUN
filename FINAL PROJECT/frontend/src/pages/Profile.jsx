import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../services/axiosInstance";
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaSignOutAlt,
    FaGamepad,
    FaEdit,
    FaShieldAlt,
    FaCamera,
    FaPalette,
    FaInfoCircle,
    FaLink,
    FaSmile,
    FaTimes,
    FaCheck,
    FaTwitter,
    FaInstagram,
    FaYoutube,
    FaTwitch,
    FaGithub,
    FaLinkedin,
    FaGlobe,
    FaUpload,
    FaTrash
} from "react-icons/fa";
import AvatarCropper from "../components/AvatarCropper";

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadingBanner, setUploadingBanner] = useState(false);
    const [editing, setEditing] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState({ type: "", text: "" });
    const [imageSrc, setImageSrc] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const navigate = useNavigate();

    // Customization fields
    const [bio, setBio] = useState("");
    const [accentColor, setAccentColor] = useState("#5865F2");
    const [pronouns, setPronouns] = useState("");
    const [customStatusEmoji, setCustomStatusEmoji] = useState("");
    const [customStatusText, setCustomStatusText] = useState("");
    const [socialLinks, setSocialLinks] = useState({
        twitter: "",
        instagram: "",
        youtube: "",
        twitch: "",
        github: "",
        linkedin: "",
        website: ""
    });

    const fetchUser = useCallback(async () => {
        try {
            const res = await axiosInstance.get("/users/profile");
            setUser(res.data);
            setUsername(res.data.username || "");
            setEmail(res.data.email || "");
            setBio(res.data.bio || "");
            setAccentColor(res.data.accentColor || "#5865F2");
            setPronouns(res.data.pronouns || "");
            setCustomStatusEmoji(res.data.customStatus?.emoji || "");
            setCustomStatusText(res.data.customStatus?.text || "");
            setSocialLinks(res.data.socialLinks || {
                twitter: "",
                instagram: "",
                youtube: "",
                twitch: "",
                github: "",
                linkedin: "",
                website: ""
            });
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
        setBio(user?.bio || "");
        setAccentColor(user?.accentColor || "#5865F2");
        setPronouns(user?.pronouns || "");
        setCustomStatusEmoji(user?.customStatus?.emoji || "");
        setCustomStatusText(user?.customStatus?.text || "");
        setSocialLinks(user?.socialLinks || {
            twitter: "",
            instagram: "",
            youtube: "",
            twitch: "",
            github: "",
            linkedin: "",
            website: ""
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setEditing(true);
        clearMessage();
    };

    const cancelEditing = () => {
        setUsername(user?.username || "");
        setEmail(user?.email || "");
        setBio(user?.bio || "");
        setAccentColor(user?.accentColor || "#5865F2");
        setPronouns(user?.pronouns || "");
        setCustomStatusEmoji(user?.customStatus?.emoji || "");
        setCustomStatusText(user?.customStatus?.text || "");
        setSocialLinks(user?.socialLinks || {
            twitter: "",
            instagram: "",
            youtube: "",
            twitch: "",
            github: "",
            linkedin: "",
            website: ""
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setEditing(false);
        clearMessage();
    };

    const handleFileSelect = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            setMessage({ type: "error", text: "Only JPG, PNG, GIF & WebP images are allowed." });
            return;
        }

        const maxSize = type === "banner" ? 5 * 1024 * 1024 : 2 * 1024 * 1024;
        if (file.size > maxSize) {
            setMessage({ type: "error", text: `File size must be under ${type === "banner" ? "5MB" : "2MB"}.` });
            return;
        }

        // Only avatars go through the cropper
        if (type === "avatar") {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        } else if (type === "banner") {
            // Banners are uploaded directly without cropping
            handleBannerUploadDirect(file);
        }
    };

    const handleBannerUploadDirect = async (file) => {
        setUploadingBanner(true);
        clearMessage();

        try {
            const form = new FormData();
            form.append("banner", file);

            const res = await axiosInstance.put("/users/banner", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setUser((prev) => ({ ...prev, banner: res.data.banner }));
            setMessage({ type: "success", text: "Banner uploaded successfully!" });
        } catch (err) {
            setMessage({
                type: "error",
                text: err?.response?.data?.message || "Failed to upload banner",
            });
        } finally {
            setUploadingBanner(false);
        }
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


    const handleRemoveBanner = async () => {
        try {
            // Set banner to empty string via profile update
            await axiosInstance.put("/users/profile", { banner: "" });
            setUser((prev) => ({ ...prev, banner: "" }));
            setMessage({ type: "success", text: "Banner removed successfully!" });
        } catch (err) {
            setMessage({
                type: "error",
                text: err?.response?.data?.message || "Failed to remove banner",
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearMessage();

        try {
            const updateData = {
                username,
                email,
                bio,
                accentColor,
                pronouns,
                customStatus: {
                    emoji: customStatusEmoji,
                    text: customStatusText
                },
                socialLinks
            };

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
                accentColor: updatedUser.accentColor || "#5865F2"
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

    const presetColors = [
        "#5865F2", // Discord Blurple
        "#EB459E", // Discord Pink
        "#57F287", // Discord Green
        "#FEE75C", // Discord Yellow
        "#ED4245", // Discord Red
        "#9B59B6", // Purple
        "#3498DB", // Blue
        "#1ABC9C", // Teal
        "#E67E22", // Orange
        "#34495E", // Dark
        "#FF6B6B", // Coral
        "#4ECDC4", // Cyan
    ];

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
                            <div className="w-full h-full bg-gradient-to-r from-red-600/20 to-orange-500/20" />
                        )}
                        {editing && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3">
                                <label className="cursor-pointer px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all flex items-center gap-2">
                                    <FaUpload />
                                    <span>Upload Banner</span>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/gif,image/webp"
                                        onChange={(e) => handleFileSelect(e, "banner")}
                                        className="hidden"
                                        disabled={uploadingBanner}
                                    />
                                </label>
                                {user?.banner && (
                                    <button
                                        onClick={handleRemoveBanner}
                                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all flex items-center gap-2"
                                    >
                                        <FaTrash />
                                        <span>Remove</span>
                                    </button>
                                )}
                            </div>
                        )}
                        {uploadingBanner && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                                <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </div>

                    {/* Profile Header with Avatar */}
                    <div className="px-8 pb-8 -mt-16 relative">
                        <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-red-600/30 blur-xl rounded-full" />
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
                                {/* Upload Overlay */}
                                {editing && (
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
                                            onChange={(e) => handleFileSelect(e, "avatar")}
                                            className="hidden"
                                            disabled={uploading || showCropper}
                                        />
                                    </label>
                                )}
                                {/* Upload spinner */}
                                {uploading && (
                                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
                                        <div className="w-8 h-8 border-[3px] border-red-500 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 mb-2">
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-3xl font-bold text-white">{user?.username}</h2>
                                    {pronouns && (
                                        <span className="text-sm text-gray-400">({pronouns})</span>
                                    )}
                                </div>
                                {customStatusText && (
                                    <div className="flex items-center gap-2 text-gray-300 mb-2">
                                        {customStatusEmoji && <span>{customStatusEmoji}</span>}
                                        <span className="text-sm">{customStatusText}</span>
                                    </div>
                                )}
                                <p className="text-gray-400 flex items-center gap-2">
                                    <FaEnvelope className="text-red-400" />
                                    {user?.email}
                                </p>
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

                    {/* Message Alert */}
                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mx-8 mb-6 p-4 rounded-lg ${
                                message.type === "success"
                                    ? "bg-green-500/10 border border-green-500/30 text-green-400"
                                    : "bg-red-500/10 border border-red-500/30 text-red-400"
                            }`}
                        >
                            {message.text}
                        </motion.div>
                    )}

                    {/* Tabs */}
                    {editing && (
                        <div className="px-8 border-b border-red-500/10">
                            <div className="flex gap-6">
                                <button
                                    onClick={() => setActiveTab("profile")}
                                    className={`pb-3 px-2 font-semibold transition-all border-b-2 ${
                                        activeTab === "profile"
                                            ? "border-red-500 text-white"
                                            : "border-transparent text-gray-400 hover:text-gray-300"
                                    }`}
                                >
                                    <FaUser className="inline mr-2" />
                                    Profile
                                </button>
                                <button
                                    onClick={() => setActiveTab("customization")}
                                    className={`pb-3 px-2 font-semibold transition-all border-b-2 ${
                                        activeTab === "customization"
                                            ? "border-red-500 text-white"
                                            : "border-transparent text-gray-400 hover:text-gray-300"
                                    }`}
                                >
                                    <FaPalette className="inline mr-2" />
                                    Customization
                                </button>
                                <button
                                    onClick={() => setActiveTab("social")}
                                    className={`pb-3 px-2 font-semibold transition-all border-b-2 ${
                                        activeTab === "social"
                                            ? "border-red-500 text-white"
                                            : "border-transparent text-gray-400 hover:text-gray-300"
                                    }`}
                                >
                                    <FaLink className="inline mr-2" />
                                    Social Links
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Profile Form */}
                    <div className="p-8">
                        {editing ? (
                            <form onSubmit={handleSubmit}>
                                {/* Profile Tab */}
                                {activeTab === "profile" && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-6"
                                    >
                                        <div className="grid md:grid-cols-2 gap-6">
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
                                            className="p-6 rounded-lg bg-red-500/5 border border-red-500/10"
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
                                    </motion.div>
                                )}

                                {/* Customization Tab */}
                                {activeTab === "customization" && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-6"
                                    >
                                        {/* Bio */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                <FaInfoCircle className="inline mr-2 text-red-400" />
                                                Bio
                                            </label>
                                            <textarea
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                placeholder="Tell us about yourself..."
                                                maxLength={160}
                                                rows={3}
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">{bio.length}/160 characters</p>
                                        </div>

                                        {/* Accent Color */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                <FaPalette className="inline mr-2 text-red-400" />
                                                Profile Accent Color
                                            </label>
                                            <div className="flex flex-wrap gap-3 mb-3">
                                                {presetColors.map((color) => (
                                                    <button
                                                        key={color}
                                                        type="button"
                                                        onClick={() => setAccentColor(color)}
                                                        className={`w-10 h-10 rounded-lg transition-all ${
                                                            accentColor === color
                                                                ? "ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0b]"
                                                                : "hover:scale-110"
                                                        }`}
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                            </div>
                                            <input
                                                type="text"
                                                value={accentColor}
                                                onChange={(e) => setAccentColor(e.target.value)}
                                                placeholder="#5865F2"
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                                            />
                                        </div>

                                        {/* Pronouns */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                <FaUser className="inline mr-2 text-red-400" />
                                                Pronouns
                                            </label>
                                            <input
                                                type="text"
                                                value={pronouns}
                                                onChange={(e) => setPronouns(e.target.value)}
                                                placeholder="e.g., they/them, he/him, she/her"
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                                            />
                                        </div>

                                        {/* Custom Status */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                <FaSmile className="inline mr-2 text-red-400" />
                                                Custom Status
                                            </label>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={customStatusEmoji}
                                                        onChange={(e) => setCustomStatusEmoji(e.target.value)}
                                                        placeholder="Emoji (optional)"
                                                        maxLength={2}
                                                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={customStatusText}
                                                        onChange={(e) => setCustomStatusText(e.target.value)}
                                                        placeholder="Status text"
                                                        maxLength={128}
                                                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">{customStatusText.length}/128 characters</p>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Social Links Tab */}
                                {activeTab === "social" && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                <FaTwitter className="inline mr-2 text-blue-400" />
                                                Twitter
                                            </label>
                                            <input
                                                type="text"
                                                value={socialLinks.twitter}
                                                onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                                                placeholder="https://twitter.com/username"
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                <FaInstagram className="inline mr-2 text-pink-400" />
                                                Instagram
                                            </label>
                                            <input
                                                type="text"
                                                value={socialLinks.instagram}
                                                onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                                                placeholder="https://instagram.com/username"
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                <FaYoutube className="inline mr-2 text-red-500" />
                                                YouTube
                                            </label>
                                            <input
                                                type="text"
                                                value={socialLinks.youtube}
                                                onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                                                placeholder="https://youtube.com/@channel"
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                <FaTwitch className="inline mr-2 text-purple-400" />
                                                Twitch
                                            </label>
                                            <input
                                                type="text"
                                                value={socialLinks.twitch}
                                                onChange={(e) => setSocialLinks({ ...socialLinks, twitch: e.target.value })}
                                                placeholder="https://twitch.tv/username"
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                <FaGithub className="inline mr-2 text-gray-400" />
                                                GitHub
                                            </label>
                                            <input
                                                type="text"
                                                value={socialLinks.github}
                                                onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                                                placeholder="https://github.com/username"
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                <FaLinkedin className="inline mr-2 text-blue-600" />
                                                LinkedIn
                                            </label>
                                            <input
                                                type="text"
                                                value={socialLinks.linkedin}
                                                onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                                                placeholder="https://linkedin.com/in/username"
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                <FaGlobe className="inline mr-2 text-green-400" />
                                                Website
                                            </label>
                                            <input
                                                type="text"
                                                value={socialLinks.website}
                                                onChange={(e) => setSocialLinks({ ...socialLinks, website: e.target.value })}
                                                placeholder="https://yourwebsite.com"
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3 mt-6">
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
                                    >
                                        <FaCheck />
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
                                {/* Bio Section */}
                                {user?.bio && (
                                    <div className="mb-6 p-4 rounded-lg bg-white/5 border border-red-500/10">
                                        <p className="text-gray-300">{user.bio}</p>
                                    </div>
                                )}

                                {/* Custom Status Display */}
                                {(user?.customStatus?.text || user?.customStatus?.emoji) && (
                                    <div className="mb-6 flex items-center gap-2 text-gray-300">
                                        {user.customStatus.emoji && <span className="text-xl">{user.customStatus.emoji}</span>}
                                        {user.customStatus.text && <span>{user.customStatus.text}</span>}
                                    </div>
                                )}

                                {/* Social Links Display */}
                                {Object.values(user?.socialLinks || {}).some(link => link) && (
                                    <div className="mb-6">
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
                    </div>
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