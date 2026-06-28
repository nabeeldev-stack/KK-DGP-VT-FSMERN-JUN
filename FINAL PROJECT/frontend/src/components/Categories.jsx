import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

import {
  FaCrosshairs,
  FaDragon,
  FaCarSide,
  FaGhost,
  FaFutbol,
  FaChessKnight,
  FaSpaceShuttle,
  FaHatWizard,
} from "react-icons/fa";

const categories = [
  {
    title: "Action",
    icon: FaCrosshairs,
    games: "12,000+ Games",
    color: "from-red-500 to-orange-500",
  },
  {
    title: "RPG",
    icon: FaDragon,
    games: "8,200+ Games",
    color: "from-red-500 to-rose-600",
  },
  {
    title: "Racing",
    icon: FaCarSide,
    games: "3,400+ Games",
    color: "from-orange-500 to-amber-600",
  },
  {
    title: "Horror",
    icon: FaGhost,
    games: "2,800+ Games",
    color: "from-slate-600 to-black",
  },
  {
    title: "Sports",
    icon: FaFutbol,
    games: "4,900+ Games",
    color: "from-red-500 to-rose-600",
  },
  {
    title: "Strategy",
    icon: FaChessKnight,
    games: "3,100+ Games",
    color: "from-yellow-500 to-orange-500",
  },
  {
    title: "Sci-Fi",
    icon: FaSpaceShuttle,
    games: "2,600+ Games",
    color: "from-orange-500 to-amber-600",
  },
  {
    title: "Fantasy",
    icon: FaHatWizard,
    games: "5,100+ Games",
    color: "from-rose-500 to-pink-600",
  },
];

export default function Categories() {
  return (
    <section className="relative py-20">
      {/* Red Glow */}
      <div className="absolute top-0 left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[160px]" />
      
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
            EXPLORE
          </p>

          <h2 className="text-4xl md:text-5xl font-black text-white">
            Browse By
            <span className="bg-gradient-to-r from-red-400 via-orange-300 to-rose-400 bg-clip-text text-transparent">
              {" "}Category
            </span>
          </h2>

          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Find your favorite genre and discover thousands of incredible games.
          </p>

        </motion.div>

        {/* Grid */}
        
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <Tilt
                key={category.title}
                tiltMaxAngleX={8}
                tiltMaxAngleY={8}
                glareEnable
                glareMaxOpacity={0.1}
                glareColor="#ffffff"
                scale={1.02}
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: .5,
                    delay: index * .05,
                  }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -6,
                  }}
                  className="group relative overflow-hidden rounded-xl border border-red-500/20 bg-white/5 p-6 backdrop-blur-xl cursor-pointer transition-all duration-300 hover:border-red-500/40"
                >
                  {/* Icon */}
                  
                  <div
                    className={`inline-flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br ${category.color} mb-4`}
                  >
                    <Icon className="text-2xl text-white" />
                  </div>

                  {/* Title */}
                  
                  <h3 className="text-lg font-bold text-white mb-1">
                    {category.title}
                  </h3>

                  <p className="text-sm text-gray-400 mb-4">
                    {category.games}
                  </p>

                  {/* Bottom Gradient */}
                  
                  <div
                    className={`h-0.5 rounded-full bg-gradient-to-r ${category.color} opacity-50 group-hover:opacity-100 transition-opacity`}
                  />
                </motion.div>
              </Tilt>
            );
          })}

        </div>

      </div>

    </section>
  );
}