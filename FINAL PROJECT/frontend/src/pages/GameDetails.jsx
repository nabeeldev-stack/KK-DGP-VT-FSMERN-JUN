import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../services/axiosInstance";
import { FaStar, FaDownload, FaComment, FaArrowLeft } from "react-icons/fa";

const GameDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchGame = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get(`/games/${id}`);
            setGame(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchGame();
    }, [fetchGame]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("Please log in to submit a review");
            navigate("/login");
            return;
        }
        try {
            setSubmitting(true);
            await axiosInstance.post(`/games/${id}/reviews`, { rating: Number(rating), comment });
            alert("Review submitted successfully!");
            setRating(5);
            setComment("");
            fetchGame();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0000] via-[#0a0a0b] to-[#120000]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Loading Game Details...</p>
                </div>
            </div>
        );
    }

    if (!game) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0000] via-[#0a0a0b] to-[#120000]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Game not found</h2>
                    <button 
                        onClick={() => navigate("/games")}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
                    >
                        Back to Games
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a0000] via-[#0a0a0b] to-[#120000] text-white pt-24 pb-12 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate("/games")}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <FaArrowLeft />
                    <span className="font-semibold">Back to Games</span>
                </motion.button>

                {/* Game Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-red-500/20 bg-white/5 backdrop-blur-xl overflow-hidden mb-8"
                >
                    {/* Game Image */}
                    <div className="relative h-64 md:h-96 overflow-hidden">
                        <img
                            src={game.imageUrl || "https://placehold.co/1200x600?text=Game"}
                            alt={game.title}
                            onError={(e) => { e.target.src = `https://placehold.co/1200x600/1a0000/ef4444?text=${encodeURIComponent(game.title)}`; }}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        
                        {/* Genre Badge */}
                        <div className="absolute top-4 left-4">
                            <span className="inline-flex items-center px-4 py-2 rounded-full bg-red-600/90 text-sm font-semibold backdrop-blur">
                                {game.genre || "Action"}
                            </span>
                        </div>

                        {/* Rating Badge */}
                        {game.rating > 0 && (
                            <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 backdrop-blur">
                                <FaStar className="text-yellow-400" />
                                <span className="font-semibold">{game.rating.toFixed(1)} / 10</span>
                            </div>
                        )}
                    </div>

                    {/* Game Info */}
                    <div className="p-8">
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                            {game.title}
                        </h1>

                        <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-400">
                            {game.developer && (
                                <span className="flex items-center gap-1">
                                    <strong className="text-gray-300">Developer:</strong> {game.developer}
                                </span>
                            )}
                            {game.publisher && (
                                <span className="flex items-center gap-1">
                                    <strong className="text-gray-300">Publisher:</strong> {game.publisher}
                                </span>
                            )}
                            {game.releaseDate && (
                                <span className="flex items-center gap-1">
                                    <strong className="text-gray-300">Released:</strong> {new Date(game.releaseDate).getFullYear()}
                                </span>
                            )}
                        </div>

                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            {game.description || "No description available for this game."}
                        </p>

                        {/* Download Button */}
                        {game.downloadLink && (
                            <a
                                href={game.downloadLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all duration-300 hover:scale-105"
                            >
                                <FaDownload />
                                Download Game
                            </a>
                        )}
                    </div>
                </motion.div>

                {/* Reviews Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-2xl border border-red-500/20 bg-white/5 backdrop-blur-xl p-8 mb-8"
                >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <FaComment className="text-red-400" />
                        Reviews ({game.reviews?.length || 0})
                    </h2>

                    {/* Write Review Form */}
                    <form onSubmit={handleSubmitReview} className="mb-8 p-6 rounded-lg bg-red-500/5 border border-red-500/10">
                        <h3 className="text-lg font-bold text-white mb-4">Write a Review</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Rating (1-10)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    required
                                    className="w-full md:w-32 px-4 py-2 rounded-lg bg-white/5 border border-red-500/20 text-white focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Comment
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows="4"
                                    required
                                    placeholder="Share your thoughts about this game..."
                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? "Submitting..." : "Submit Review"}
                            </button>
                        </div>
                    </form>

                    {/* Reviews List */}
                    <div className="space-y-4">
                        {game.reviews && game.reviews.length > 0 ? (
                            game.reviews.map((review, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-4 rounded-lg bg-white/5 border border-red-500/10"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-semibold text-white">{review.username}</p>
                                        <div className="flex items-center gap-1">
                                            <FaStar className="text-yellow-400 text-sm" />
                                            <span className="text-sm text-gray-300">{review.rating}/10</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 mb-2">{review.comment}</p>
                                    <small className="text-gray-500">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </small>
                                </motion.div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-8">No reviews yet. Be the first to review this game!</p>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default GameDetails;