import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { motion } from "framer-motion";
import { FaTrophy, FaStar, FaCalendar, FaDownload, FaGamepad } from "react-icons/fa";

const TopGames = () => {
    const [topGames, setTopGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                // Fetch top rated games
                const topRes = await axiosInstance.get("/games/top");
                setTopGames(topRes.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white">
            {/* Header Section */}
            <div className="relative py-20 bg-gradient-to-br from-[#1a0505] via-[#0a0a0b] to-[#120202]">
                {/* Red Glow */}
                <div className="absolute top-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[150px]" />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="uppercase tracking-[0.2em] text-red-500 text-sm font-semibold mb-3">
                            ELITE GAMES
                        </p>
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
                            Top Rated Games
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl">
                            The highest rated games loved by our community
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Top Games List */}
            <div className="max-w-7xl mx-auto px-6 pb-16 bg-gradient-to-br from-[#1a0505] via-[#0a0a0b] to-[#120202]">
                {topGames.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <FaTrophy className="text-6xl text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-xl">No top games available.</p>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {topGames.map((game, index) => (
                            <motion.div
                                key={game._id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ y: -8, scale: 1.01 }}
                                className="group relative overflow-hidden rounded-2xl border border-red-500/20 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-red-500/40"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
                                    {/* Rank Badge */}
                                    <div className="flex items-center justify-center">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-red-600/20 blur-xl rounded-full" />
                                            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-600 to-orange-500 shadow-lg">
                                                <span className="text-3xl font-black text-white">
                                                    #{index + 1}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Image */}
                                    <div className="md:col-span-1">
                                        <div className="relative h-32 md:h-full rounded-xl overflow-hidden">
                                            <img
                                                src={game.imageUrl || "https://placehold.co/600x400?text=Game"}
                                                alt={game.title}
                                                onError={(e) => { e.target.src = `https://placehold.co/600x400/1a0505/ef4444?text=${encodeURIComponent(game.title)}`; }}
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="md:col-span-2 flex flex-col justify-center">
                                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                                            {game.title}
                                        </h3>
                                        
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                            {game.description || "No description available"}
                                        </p>

                                        <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                                            {game.genre && (
                                                <span className="flex items-center gap-1">
                                                    <FaGamepad />
                                                    {game.genre}
                                                </span>
                                            )}
                                            {game.releaseDate && (
                                                <span className="flex items-center gap-1">
                                                    <FaCalendar />
                                                    {new Date(game.releaseDate).getFullYear()}
                                                </span>
                                            )}
                                            {game.rating && (
                                                <span className="flex items-center gap-1">
                                                    <FaStar className="text-yellow-400" />
                                                    {game.rating.toFixed(1)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col justify-center gap-3">
                                        {game.downloadLink && (
                                            <a
                                                href={game.downloadLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold text-sm hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
                                            >
                                                <FaDownload />
                                                Download
                                            </a>
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
};

export default TopGames;