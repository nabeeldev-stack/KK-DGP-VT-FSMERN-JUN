import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaGamepad,
  FaUsers,
  FaStar,
  FaTrophy,
} from "react-icons/fa";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const stats = [
  {
    title: "Games",
    subtitle: "Available",
    icon: FaGamepad,
    color: "from-red-500 to-rose-700",
  },
  {
    title: "Players",
    subtitle: "Worldwide",
    icon: FaUsers,
    color: "from-orange-500 to-amber-600",
  },
  {
    title: "Reviews",
    subtitle: "Written",
    icon: FaStar,
    color: "from-yellow-500 to-orange-500",
  },
  {
    title: "Studios",
    subtitle: "Featured",
    icon: FaTrophy,
    color: "from-pink-500 to-rose-500",
  },
];

export default function Stats() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const [statValues, setStatValues] = useState({
    games: 50000,
    players: 5000000,
    reviews: 98000,
    studios: 120
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/api/site/stats`);
      setStatValues({
        games: res.data.totalGames,
        players: res.data.totalPlayers,
        reviews: res.data.totalReviews,
        studios: 120 // This could be fetched from a studios endpoint
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
      // Keep default values on error
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(0)}M+`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K+`;
    }
    return `${num}+`;
  };

  return (
    <section
      ref={ref}
      className="relative py-20"
    >
      {/* Red Glow Background */}
      <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[150px]" />
      
      <div className="mx-auto max-w-7xl px-6 relative z-10">

        {/* Heading */}
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="uppercase tracking-[0.2em] text-red-500 text-sm font-semibold mb-3">
            COMMUNITY
          </p>

          <h2 className="text-4xl md:text-5xl font-black text-white">
            Gaming In
            <span className="bg-gradient-to-r from-red-400 via-orange-300 to-rose-400 bg-clip-text text-transparent">
              {" "}Numbers
            </span>
          </h2>
        </motion.div>

        {/* Cards */}
        
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

          {stats.map((item, index) => {
            const Icon = item.icon;
            const valueKey = item.title.toLowerCase();

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: .6,
                  delay: index * .15,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                className="group relative overflow-hidden rounded-2xl border border-red-500/20 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:border-red-500/40"
              >
                {/* Icon */}
                
                <div
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} mb-6`}
                >
                  <Icon className="text-2xl text-white" />
                </div>

                {/* Counter */}
                
                <h3 className="text-4xl font-black text-white mb-2">
                  {inView && (
                    <CountUp
                      end={statValues[valueKey]}
                      duration={3}
                      separator=","
                    />
                  )}
                  {formatNumber(statValues[valueKey]).replace(/[0-9,]/g, '')}
                </h3>

                <h4 className="text-lg font-bold text-gray-300">
                  {item.title}
                </h4>

                <p className="text-sm text-gray-500 mt-1">
                  {item.subtitle}
                </p>

                {/* Bottom Glow */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500/0 via-red-500/50 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}