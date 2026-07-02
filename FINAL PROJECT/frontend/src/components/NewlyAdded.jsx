import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaFire, FaStar, FaGamepad, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL as API } from "../services/api";

const NewlyAdded = ({ isLoggedIn = false }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewGames();
  }, []);

  const fetchNewGames = async () => {
    try {
      const res = await axios.get(`${API}/games?sort=newest&limit=4`);
      setGames(res.data.slice(0, 4));
    } catch (err) {
      console.error("Error fetching new games:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      </section>
    );
  }

  if (games.length === 0) {
    return null;
  }

  return (
    <section className="relative py-20">
      {/* Red Glow */}
      <div className="absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[150px]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <p className="uppercase tracking-[0.2em] text-red-500 text-sm font-semibold mb-3">
            JUST ARRIVED
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Newly Added Games
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            Check out the latest additions to our gaming collection
          </p>
        </motion.div>

        {/* Games Grid - Single Row of 4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {games.map((game, index) => (
            <GameCard key={game._id} game={game} index={index} isLoggedIn={isLoggedIn} />
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center"
        >
          {isLoggedIn ? (
            <Link
              to="/games"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all duration-300 hover:scale-105"
            >
              View All Games
              <FaArrowRight />
            </Link>
          ) : (
            <div className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gray-700/50 text-gray-400 font-semibold cursor-not-allowed">
              🔒 Login to View
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

// Game Card Component
const GameCard = ({ game, index, isLoggedIn }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={isLoggedIn ? { y: -8, scale: 1.02 } : {}}
      className={`group relative overflow-hidden rounded-xl border border-red-500/20 bg-white/5 backdrop-blur-xl transition-all duration-300 ${
        isLoggedIn ? "hover:border-red-500/40 cursor-pointer" : "cursor-not-allowed opacity-75"
      }`}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={game.imageUrl || "https://placehold.co/600x400?text=Game"}
          alt={game.title}
          onError={(e) => { e.target.src = `https://placehold.co/600x400/1a0505/ef4444?text=${encodeURIComponent(game.title)}`; }}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        {/* New Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-600/90 text-xs font-bold backdrop-blur">
            <FaFire />
            NEW
          </span>
        </div>

        {/* Rating Badge */}
        {game.rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 backdrop-blur">
            <FaStar className="text-yellow-400 text-xs" />
            <span className="text-xs font-semibold">{game.rating}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-bold text-white mb-1 group-hover:text-red-400 transition-colors line-clamp-1">
          {game.title}
        </h3>

        <p className="text-gray-400 text-xs mb-2 line-clamp-2">
          {game.description || "No description available"}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <FaGamepad />
            {game.genre || "Action"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default NewlyAdded;