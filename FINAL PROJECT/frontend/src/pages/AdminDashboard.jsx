import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../services/axiosInstance";
import { FaUsers, FaGamepad, FaStar, FaTrash, FaBan, FaCheckCircle } from "react-icons/fa";

function AdminDashboard() {
    const [stats, setStats] = useState({ totalUsers: 0, totalGames: 0, totalReviews: 0 });
    const [users, setUsers] = useState([]);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, usersRes, gamesRes] = await Promise.all([
                    axiosInstance.get("/admin/stats"),
                    axiosInstance.get("/admin/users"),
                    axiosInstance.get("/games")
                ]);
                setStats(statsRes.data);
                setUsers(usersRes.data);
                setGames(gamesRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Delete this user?")) return;
        try {
            await axiosInstance.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
            alert("User deleted");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete user");
        }
    };

    const handleBanUser = async (id) => {
        try {
            await axiosInstance.put(`/admin/users/${id}/ban`);
            setUsers(users.map(u => u._id === id ? { ...u, isBanned: true } : u));
            alert("User banned");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to ban user");
        }
    };

    const handleUnbanUser = async (id) => {
        try {
            await axiosInstance.put(`/admin/users/${id}/unban`);
            setUsers(users.map(u => u._id === id ? { ...u, isBanned: false } : u));
            alert("User unbanned");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to unban user");
        }
    };

    const handleDeleteGame = async (id) => {
        if (!window.confirm("Delete this game?")) return;
        try {
            await axiosInstance.delete(`/admin/games/${id}`);
            setGames(games.filter(g => g._id !== id));
            alert("Game deleted");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete game");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0000] via-[#0a0a0b] to-[#120000]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Loading Admin Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a0000] via-[#0a0a0b] to-[#120000] text-white pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-black mb-2">Admin Dashboard</h1>
                    <p className="text-gray-400">Manage users, games, and platform settings</p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-2xl border border-red-500/20 bg-white/5 backdrop-blur-xl p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-red-600 to-orange-500">
                                <FaUsers className="text-white text-xl" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-1">{stats.totalUsers}</h3>
                        <p className="text-gray-400 text-sm">Total Users</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-2xl border border-red-500/20 bg-white/5 backdrop-blur-xl p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-red-600 to-orange-500">
                                <FaGamepad className="text-white text-xl" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-1">{stats.totalGames}</h3>
                        <p className="text-gray-400 text-sm">Total Games</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-2xl border border-red-500/20 bg-white/5 backdrop-blur-xl p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-red-600 to-orange-500">
                                <FaStar className="text-white text-xl" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-1">{stats.totalReviews}</h3>
                        <p className="text-gray-400 text-sm">Total Reviews</p>
                    </motion.div>
                </div>

                {/* Users Management */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-2xl border border-red-500/20 bg-white/5 backdrop-blur-xl p-6 mb-8"
                >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <FaUsers className="text-red-400" />
                        Users Management
                    </h2>
                    <div className="space-y-4">
                        {users.map(user => (
                            <div key={user._id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-red-500/10 hover:border-red-500/20 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white font-bold">
                                        {user.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">{user.username}</h3>
                                        <p className="text-gray-400 text-sm">{user.email}</p>
                                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                            user.isBanned 
                                                ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                                                : "bg-green-500/20 text-green-400 border border-green-500/30"
                                        }`}>
                                            {user.isBanned ? "Banned" : "Active"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDeleteUser(user._id)}
                                        className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
                                        title="Delete User"
                                    >
                                        <FaTrash />
                                    </button>
                                    {user.isBanned ? (
                                        <button
                                            onClick={() => handleUnbanUser(user._id)}
                                            className="p-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-all"
                                            title="Unban User"
                                        >
                                            <FaCheckCircle />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleBanUser(user._id)}
                                            className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 transition-all"
                                            title="Ban User"
                                        >
                                            <FaBan />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Games Management */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="rounded-2xl border border-red-500/20 bg-white/5 backdrop-blur-xl p-6"
                >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <FaGamepad className="text-red-400" />
                        Games Management
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {games.map(game => (
                            <div key={game._id} className="p-4 rounded-lg bg-white/5 border border-red-500/10 hover:border-red-500/20 transition-all">
                                <h3 className="text-white font-semibold mb-2 line-clamp-1">{game.title}</h3>
                                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{game.description}</p>
                                <button
                                    onClick={() => handleDeleteGame(game._id)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all text-sm font-semibold"
                                >
                                    <FaTrash />
                                    Delete Game
                                </button>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default AdminDashboard;