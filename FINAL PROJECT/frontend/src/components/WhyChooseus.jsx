import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaGamepad,
  FaUsers,
  FaShieldAlt,
  FaRocket,
} from "react-icons/fa";
import { API_BASE_URL as API } from "../services/api";

// Icon mapping
const iconMap = {
  FaGamepad,
  FaUsers,
  FaShieldAlt,
  FaRocket,
};

export default function WhyChooseUs() {
  const [features, setFeatures] = useState([
    {
      icon: FaGamepad,
      title: "Massive Game Library",
      description:
        "Explore thousands of PC, PlayStation, Xbox, Nintendo and mobile games in one place.",
      color: "from-red-500 to-rose-600",
    },
    {
      icon: FaUsers,
      title: "Gaming Community",
      description:
        "Follow other gamers, share reviews, build collections and discover hidden gems together.",
      color: "from-orange-500 to-amber-600",
    },
    {
      icon: FaShieldAlt,
      title: "Trusted Reviews",
      description:
        "Read authentic reviews and ratings from real players before downloading or buying.",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: FaRocket,
      title: "Fast & Modern",
      description:
        "Built with React, Node.js and MongoDB for a smooth, responsive gaming experience.",
      color: "from-pink-500 to-rose-600",
    },
  ]);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const res = await API.get("/site/features");
      // Map icon strings to actual icon components
      const featuresWithIcons = res.data.map(feature => ({
        ...feature,
        icon: iconMap[feature.icon] || FaGamepad
      }));
      setFeatures(featuresWithIcons);
    } catch (err) {
      console.error("Error fetching features:", err);
      // Keep default values on error
    }
  };

  return (
    <section className="relative py-20">
      {/* Red Glow */}
      <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[150px]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Heading */}
        
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="uppercase tracking-[0.2em] text-red-500 text-sm font-semibold mb-3">
            WHY CHOOSE US
          </p>

          <h2 className="text-4xl md:text-5xl font-black text-white">
            Built For
            <span className="bg-gradient-to-r from-red-400 via-orange-300 to-rose-400 bg-clip-text text-transparent">
              {" "}Gamers
            </span>
          </h2>

          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Everything you need to discover new games, track your favourites,
            write reviews and connect with the gaming community.
          </p>

        </motion.div>

        {/* Cards */}
        
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * .1,
                  duration: .6,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -6,
                }}
                className="group relative overflow-hidden rounded-xl border border-red-500/20 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-red-500/40"
              >
                {/* Icon */}
                
                <div
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br ${feature.color} mb-5`}
                >
                  <Icon className="text-white text-2xl" />
                </div>

                {/* Content */}
                
                <h3 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>

                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Bottom Gradient */}
                
                <div
                  className={`h-0.5 rounded-full bg-gradient-to-r ${feature.color} opacity-50 group-hover:opacity-100 transition-opacity`}
                />
              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}