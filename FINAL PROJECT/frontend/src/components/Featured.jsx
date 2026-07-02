import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaArrowRight, FaGamepad, FaPlay, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL as API } from "../services/api";

export default function Featured({ isLoggedIn = false }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    loadGames();
  }, []);

  async function loadGames() {
    try {
      const res = await API.get("/games");

      // show highest rated games
      const featured = [...res.data]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 6);

      setGames(featured);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Auto-advance slideshow every 5 seconds
  useEffect(() => {
    if (games.length === 0) return;

    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % games.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [games.length]);

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + games.length) % games.length);
  }, [games.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % games.length);
  }, [games.length]);

  if (loading) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-white">Loading Featured Games...</h2>
        </div>
      </section>
    );
  }

  const selectedGame = games[selectedIndex];

  return (
    <section className="relative py-20 bg-gradient-to-br from-[#1a0000] via-[#0a0a0b] to-[#120000]">
      {/* Blood Red Glow Effects */}
      <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-red-700/25 blur-[180px]" />
      <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-red-600/20 blur-[150px]" />
      <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-800/15 blur-[120px]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .8 }}
          className="mb-12"
        >
          <p className="uppercase tracking-[0.2em] text-red-600 text-sm font-semibold mb-3">
            FEATURED
          </p>
          <h2 className="text-5xl font-black text-white">
            Top Rated
            <span className="bg-gradient-to-r from-red-300 via-red-400 to-red-500 bg-clip-text text-transparent">
              {" "}Games
            </span>
          </h2>
        </motion.div>

        {/* Epic Games Style Layout with Slideshow */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Featured Game - Left Side (2/3 width) with Slideshow */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: .8 }}
            className="lg:col-span-2"
          >
            {selectedGame && (
              <div className="relative h-[500px] rounded-2xl overflow-hidden border border-red-500/20 group">
                {/* Background Image with Animation */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedGame._id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                  >
                    <img
                      src={
                        selectedGame.imageUrl ||
                        "https://placehold.co/1200x600?text=Game"
                      }
                      alt={selectedGame.title}
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
                  <div className="max-w-2xl">
                    {/* Badge */}
                    <motion.div
                      key={`badge-${selectedGame._id}`}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="inline-flex items-center gap-2 rounded-full bg-red-700/90 px-4 py-2 mb-4 backdrop-blur"
                    >
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-sm font-bold">Top Rated</span>
                    </motion.div>

                    {/* Title */}
                    <motion.h3
                      key={`title-${selectedGame._id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="text-4xl md:text-5xl font-black text-white mb-4"
                    >
                      {selectedGame.title}
                    </motion.h3>

                    {/* Genre & Platform */}
                    <motion.div
                      key={`genre-${selectedGame._id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="flex flex-wrap gap-3 mb-4"
                    >
                      <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm text-gray-200 backdrop-blur">
                        🎮 {selectedGame.genre || "Action"}
                      </span>
                      <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm text-gray-200 backdrop-blur">
                        📅 {selectedGame.releaseDate?.slice(0,4) || "2025"}
                      </span>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                      key={`desc-${selectedGame._id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="text-gray-200 text-lg mb-6 line-clamp-2"
                    >
                      {selectedGame.description || "Experience the ultimate gaming adventure with stunning graphics and immersive gameplay."}
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                      key={`buttons-${selectedGame._id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="flex flex-wrap gap-4"
                    >
                      {isLoggedIn ? (
                        <>
                          <Link
                            to={`/games/${selectedGame._id}`}
                            className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-6 py-3 font-bold transition hover:scale-105"
                          >
                            <FaPlay />
                            Play Now
                          </Link>
                          <Link
                            to={`/games/${selectedGame._id}`}
                            className="inline-flex items-center gap-2 rounded-xl border-2 border-red-500/50 bg-red-500/5 px-6 py-3 font-bold text-white backdrop-blur-xl transition hover:bg-red-500/10"
                          >
                            More Info
                            <FaArrowRight />
                          </Link>
                        </>
                      ) : (
                        <div className="inline-flex items-center gap-2 rounded-xl bg-gray-700/50 px-6 py-3 font-bold text-gray-400 cursor-not-allowed">
                          🔒 Login to View
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>

                {/* Navigation Arrows */}
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={goToPrevious}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-xl border border-red-500/20 flex items-center justify-center text-white hover:bg-red-500/20 transition z-10"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-xl border border-red-500/20 flex items-center justify-center text-white hover:bg-red-500/20 transition z-10"
                    >
                      <FaChevronRight />
                    </button>

                    {/* Slide Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {games.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedIndex(idx)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            idx === selectedIndex
                              ? "w-8 bg-red-500"
                              : "w-2 bg-white/30 hover:bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            )}
          </motion.div>

          {/* Sidebar - Right Side (1/3 width) */}
          {isLoggedIn && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: .8, delay: .2 }}
              className="lg:col-span-1"
            >
              <div className="rounded-2xl border border-red-500/20 bg-white/5 backdrop-blur-xl overflow-hidden h-full">
                {/* Header */}
                <div className="p-4 border-b border-red-500/10">
                  <h3 className="text-lg font-bold text-white">More Featured Games</h3>
                </div>

                {/* Game List */}
                <div className="max-h-[420px] overflow-y-auto">
                  {games.map((game, index) => (
                    <motion.div
                      key={game._id}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: .5, delay: index * .1 }}
                      onClick={() => setSelectedIndex(index)}
                      className={`group flex items-center gap-4 p-4 border-b border-red-500/5 last:border-b-0 cursor-pointer transition ${
                        index === selectedIndex ? "bg-red-500/10" : "hover:bg-red-500/5"
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden">
                        <img
                          src={
                            game.imageUrl ||
                            "https://placehold.co/100x100?text=Game"
                          }
                          alt={game.title}
                          className="h-full w-full object-cover"
                        />
                        {index === selectedIndex && (
                          <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                            <FaPlay className="text-white text-xs" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-bold truncate transition ${
                          index === selectedIndex ? "text-red-400" : "text-white group-hover:text-red-400"
                        }`}>
                          {game.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">
                          {game.genre || "Action"}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <FaStar className="text-yellow-400 text-xs" />
                          <span className="text-xs text-gray-300">{game.rating || "4.8"}</span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <FaArrowRight className={`transition flex-shrink-0 ${
                        index === selectedIndex ? "text-red-400" : "text-gray-500 group-hover:text-red-400"
                      }`} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

      </div>
    </section>
  );
}