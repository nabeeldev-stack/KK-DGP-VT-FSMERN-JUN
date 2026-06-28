import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import {
  FaFire,
  FaStar,
  FaArrowRight,
  FaGamepad,
} from "react-icons/fa";

import "swiper/css";
import "swiper/css/navigation";

import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Trending() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    loadTrending();
  }, []);

  async function loadTrending() {
    try {
      const res = await axios.get(`${API}/api/games`);

      const trending = [...res.data]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 10);

      setGames(trending);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <section className="relative py-20 bg-[#0a0a0b]">

      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .7 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <p className="uppercase tracking-[0.2em] text-red-500 text-sm font-semibold mb-3">
              Trending Now
            </p>
            <h2 className="text-5xl font-black text-white">
              Most Popular
              <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                {" "}Games
              </span>
            </h2>
          </div>

          <Link
            to="/games"
            className="hidden md:flex items-center gap-2 text-red-400 hover:text-white transition font-semibold"
          >
            View All
            <FaArrowRight />
          </Link>
        </motion.div>

        <Swiper
          modules={[Autoplay, Navigation]}
          navigation
          autoplay={{
            delay: 3500,
          }}
          spaceBetween={20}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            700: {
              slidesPerView: 2,
            },
            1100: {
              slidesPerView: 3,
            },
          }}
        >
          {games.map((game) => (
            <SwiperSlide key={game._id}>
              <motion.div
                whileHover={{
                  y: -8,
                }}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300"
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={
                      game.imageUrl ||
                      "https://placehold.co/700x900?text=Game"
                    }
                    alt={game.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-black/20 to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-red-600/90 px-3 py-1.5 backdrop-blur">
                    <FaFire />
                    <span className="text-xs font-semibold">Trending</span>
                  </div>

                  <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 backdrop-blur">
                    <FaStar className="text-yellow-400 text-sm" />
                    <span className="text-sm font-semibold">{game.rating || "4.8"}</span>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-black text-white">
                      {game.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-300">
                      {game.genre || "Action Adventure"}
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between text-sm text-gray-400 mb-4">
                    <span>🎮 {game.platform || "PC"}</span>
                    <span>👀 {game.views || 0} Views</span>
                  </div>

                  <Link
                    to={`/games/${game._id}`}
                    className="flex items-center justify-between rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-5 py-3 font-semibold text-white transition hover:scale-[1.02]"
                  >
                    <span>View Details</span>
                    <FaGamepad />
                  </Link>
                </div>

              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>

    </section>
  );
}