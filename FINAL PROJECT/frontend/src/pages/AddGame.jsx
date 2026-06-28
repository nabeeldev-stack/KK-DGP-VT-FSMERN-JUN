import { useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../services/axiosInstance";
import { FaGamepad, FaUpload, FaInfoCircle } from "react-icons/fa";

function AddGame() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [genre, setGenre] = useState("");
    const [developer, setDeveloper] = useState("");
    const [publisher, setPublisher] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [downloadLink, setDownloadLink] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            await axiosInstance.post("/games", {
                title,
                description,
                genre,
                developer,
                publisher,
                imageUrl,
                downloadLink,
                releaseDate
            });

            setMessage({ type: "success", text: "Game added successfully!" });
            // Reset form
            setTitle("");
            setDescription("");
            setGenre("");
            setDeveloper("");
            setPublisher("");
            setImageUrl("");
            setDownloadLink("");
            setReleaseDate("");
        } catch (err) {
            setMessage({ 
                type: "error", 
                text: err.response?.data?.message || "Failed to add game" 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a0000] via-[#0a0a0b] to-[#120000] text-white py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-black mb-2">Add New Game</h1>
                    <p className="text-gray-400">Add a new game to the platform</p>
                </motion.div>

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

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-red-500/20 bg-white/5 backdrop-blur-xl p-8"
                >
                    <form onSubmit={submitHandler} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                <FaGamepad className="inline mr-2 text-red-400" />
                                Game Title *
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter game title"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                <FaInfoCircle className="inline mr-2 text-red-400" />
                                Description *
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter game description"
                                required
                                rows="4"
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
                            />
                        </div>

                        {/* Genre & Developer */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Genre *
                                </label>
                                <input
                                    type="text"
                                    value={genre}
                                    onChange={(e) => setGenre(e.target.value)}
                                    placeholder="e.g., Action, RPG, Racing"
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Developer
                                </label>
                                <input
                                    type="text"
                                    value={developer}
                                    onChange={(e) => setDeveloper(e.target.value)}
                                    placeholder="Developer name"
                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                                />
                            </div>
                        </div>

                        {/* Publisher & Release Date */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Publisher
                                </label>
                                <input
                                    type="text"
                                    value={publisher}
                                    onChange={(e) => setPublisher(e.target.value)}
                                    placeholder="Publisher name"
                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Release Date
                                </label>
                                <input
                                    type="date"
                                    value={releaseDate}
                                    onChange={(e) => setReleaseDate(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                                />
                            </div>
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                <FaUpload className="inline mr-2 text-red-400" />
                                Cover Image URL
                            </label>
                            <input
                                type="text"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                            />
                        </div>

                        {/* Download Link */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Download Link
                            </label>
                            <input
                                type="text"
                                value={downloadLink}
                                onChange={(e) => setDownloadLink(e.target.value)}
                                placeholder="https://store.example.com/game"
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-red-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Adding Game...
                                </>
                            ) : (
                                <>
                                    <FaGamepad />
                                    Add Game
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}

export default AddGame;