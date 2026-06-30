import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch, FaGamepad, FaStar, FaCalendar, FaDownload, FaEdit, FaTrash } from "react-icons/fa";

function Games() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const user = (() => {
        try {
            const stored = localStorage.getItem("user");
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    })();

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const res = await axiosInstance.get(`/games?search=${search}`);
                setGames(res.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchGames();
    }, [search]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Delete this game?");
        if (!confirmDelete) return;
        try {
            await axiosInstance.delete(`/games/${id}`);
            setGames((prevGames) => prevGames.filter((game) => game._id !== id));
            alert("Game deleted successfully");
        } catch (error) {
            console.error("Delete game error:", error.response?.status, error.response?.data);
            alert(error?.response?.data?.message || "Failed to delete game");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Loading Games...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white pt-24">
            {/* Header Section */}
            <div className="relative py-20 bg-gradient-to-br from-[#1a0000] via-[#0a0a0b] to-[#120000]">
                {/* Red Glow */}
                <div className="absolute top-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[150px]" />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="uppercase tracking-[0.2em] text-red-500 text-sm font-semibold mb-3">
                            GAME LIBRARY
                        </p>
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
                            All Games
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl">
                            Discover and explore our complete collection of games
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-8"
                    >
                        <div className="relative max-w-2xl">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search games..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-red-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Games Grid */}
            <div className="max-w-7xl mx-auto px-6 pb-20">
                {games.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <FaGamepad className="text-6xl text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-xl">No games available.</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {games.map((game, index) => (
                            <motion.div
                                key={game._id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="group relative overflow-hidden rounded-2xl border border-red-500/20 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-red-500/40"
                            >
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={game.imageUrl || "https://placehold.co/600x400?text=Game"}
                                        alt={game.title}
                                        onError={(e) => { e.target.src = `https://placehold.co/600x400/1a0505/ef4444?text=${encodeURIComponent(game.title)}`; }}
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    
                                    {/* Genre Badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-600/90 text-xs font-semibold backdrop-blur">
                                            {game.genre || "Action"}
                                        </span>
                                    </div>

                                    {/* Rating Badge */}
                                    {game.rating && (
                                        <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 backdrop-blur">
                                            <FaStar className="text-yellow-400 text-xs" />
                                            <span className="text-xs font-semibold">{game.rating}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <Link to={`/games/${game._id}`} className="block mb-3">
                                        <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
                                            {game.title}
                                        </h3>
                                    </Link>

                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                        {game.description || "No description available"}
                                    </p>

                                    {/* Meta Info */}
                                    <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-400">
                                        {game.releaseDate && (
                                            <span className="flex items-center gap-1">
                                                <FaCalendar />
                                                {new Date(game.releaseDate).getFullYear()}
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 mt-auto">
                                        {game.downloadLink && (
                                            <a
                                                href={game.downloadLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold text-sm hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
                                            >
                                                <FaDownload />
                                                Download Game
                                            </a>
                                        )}

                                        {user?.role === "admin" && (
                                            <div className="flex gap-2">
                                                <Link
                                                    to={`/games/edit/${game._id}`}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-all text-sm font-medium"
                                                >
                                                    <FaEdit />
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(game._id)}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all text-sm font-medium"
                                                >
                                                    <FaTrash />
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Games;