import { motion } from "framer-motion";
import { FaPlay, FaGamepad, FaStar } from "react-icons/fa";
import { MdTrendingUp } from "react-icons/md";
import Hero3D from "./Hero3d";
import { useEffect, useState } from "react";
import axios from "axios";

const API = (import.meta.env.VITE_API_URL || "https://kk-dgp-vt-fsmern-jun.onrender.com").replace(/\/$/, "");

const fadeLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      delay: 0.3,
    },
  },
};

export default function Hero() {
  const [stats, setStats] = useState({
    totalGames: "50K+",
    totalPlayers: "5M+",
    avgRating: "98%"
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/api/site/stats`);
      setStats({
        totalGames: res.data.totalGames >= 1000 ? `${(res.data.totalGames / 1000).toFixed(0)}K+` : `${res.data.totalGames}+`,
        totalPlayers: res.data.totalPlayers >= 1000000 ? `${(res.data.totalPlayers / 1000000).toFixed(0)}M+` : `${(res.data.totalPlayers / 1000).toFixed(0)}K+`,
        avgRating: `${res.data.avgRating}%`
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
      // Keep default values on error
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#1a0000] via-[#0a0a0b] to-[#120000]">

      {/* Blood Red Glow Effects */}
      
      <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-red-700/25 blur-[180px]" />
      
      <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-red-600/20 blur-[150px]" />
      
      <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-800/15 blur-[120px]" />

      {/* Subtle Grid Pattern */}
      
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff22_1px,transparent_1px),linear-gradient(to_bottom,#ffffff22_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-24 lg:grid-cols-2">

        {/* LEFT - Text Content */}
        
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >

          <div className="inline-flex items-center gap-2 rounded-full border border-red-600/50 bg-red-900/20 px-4 py-2 text-sm font-medium text-red-300">
            <MdTrendingUp />
            #1 Gaming Discovery Platform
          </div>

          <h1 className="text-5xl font-black leading-tight md:text-6xl lg:text-7xl">
            Level Up
            <br />
            <span className="bg-gradient-to-r from-red-300 via-red-400 to-red-500 bg-clip-text text-transparent">
              Your Gaming
            </span>
            <br />
            Experience
          </h1>

          <p className="max-w-xl text-lg text-gray-400 leading-relaxed">
            Discover thousands of games, read reviews, watch trailers,
            build your wishlist, and connect with gamers from around the world.
          </p>

          {/* Buttons */}
          
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => (window.location.href = "/games")}
              className="group flex items-center gap-3 rounded-xl bg-gradient-to-r from-red-700 to-red-600 px-8 py-4 font-semibold text-white transition hover:scale-105 hover:shadow-[0_0_40px_rgba(220,38,38,.5)]"
            >
              <FaGamepad />
              Explore Games
            </button>

            <button
              className="group flex items-center gap-3 rounded-xl border border-red-600/40 bg-red-900/10 px-8 py-4 font-semibold text-red-300 backdrop-blur-xl transition hover:bg-red-900/20 hover:border-red-600/60"
            >
              <FaPlay />
              Watch Trailer
            </button>
          </div>

          {/* Stats */}
          
          <div className="grid grid-cols-3 gap-6 pt-8">
            <Stat number={stats.totalGames} label="Games" />
            <Stat number={stats.totalPlayers} label="Players" />
            <Stat number={stats.avgRating} label="Positive" />
          </div>

        </motion.div>

        {/* RIGHT - 3D Model */}
        
        <motion.div
          variants={fadeRight}
          initial="hidden"
          animate="visible"
          className="relative flex justify-center items-start pt-12"
        >
          {/* Blood Red Glow Behind 3D Model */}
          <div className="absolute h-[650px] w-[650px] rounded-full bg-red-700/20 blur-[180px]" />
          
          <div className="relative h-[600px] w-full">
            <Hero3D />
          </div>
        </motion.div>

      </div>

    </section>
  );
}

function Stat({ number, label }) {
  return (
    <div className="space-y-1">
      <h3 className="text-3xl font-black text-red-300">
        {number}
      </h3>
      <p className="text-sm text-gray-400">
        {label}
      </p>
    </div>
  );
}