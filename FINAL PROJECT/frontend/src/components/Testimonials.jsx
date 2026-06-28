import { motion } from "framer-motion";
import {
  FaStar,
  FaQuoteLeft,
  FaSteam,
  FaDiscord,
} from "react-icons/fa";

const testimonials = [
  {
    name: "Alex Carter",
    username: "@ShadowWolf",
    avatar: "https://i.pravatar.cc/150?img=32",
    rating: 5,
    platform: "Steam",
    review:
      "The UI is incredible. Finding games and reading community reviews has never been easier.",
  },
  {
    name: "Emma Wilson",
    username: "@Nova",
    avatar: "https://i.pravatar.cc/150?img=44",
    rating: 5,
    platform: "Discord",
    review:
      "The animations and overall design make this feel like a premium gaming platform.",
  },
  {
    name: "Ryan Brooks",
    username: "@CyberKnight",
    avatar: "https://i.pravatar.cc/150?img=14",
    rating: 5,
    platform: "Steam",
    review:
      "Love the wishlist and review features. Looking forward to discovering more games here!",
  },
];

const icons = {
  Steam: FaSteam,
  Discord: FaDiscord,
};

export default function Testimonials() {
  return (
    <section className="relative py-20">
      {/* Red Glow */}
      <div className="absolute top-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[160px]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Heading */}
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="uppercase tracking-[0.2em] text-red-500 text-sm font-semibold mb-3">
            COMMUNITY LOVE
          </p>

          <h2 className="text-4xl md:text-5xl font-black text-white">
            What Our
            <span className="bg-gradient-to-r from-red-400 via-orange-300 to-rose-400 bg-clip-text text-transparent">
              {" "}Gamers Say
            </span>
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-gray-400">
            Join thousands of gamers already reviewing, discovering and sharing their favorite games.
          </p>

        </motion.div>

        {/* Cards */}
        
        <div className="grid gap-6 lg:grid-cols-3">

          {testimonials.map((item, index) => {
            const PlatformIcon = icons[item.platform];

            return (
              <motion.div
                key={item.username}
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
                {/* Quote Icon */}
                
                <FaQuoteLeft className="text-3xl text-red-500 mb-4 opacity-50" />

                {/* Stars */}
                
                <div className="flex gap-1 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm" />
                  ))}
                </div>

                {/* Review */}
                
                <p className="leading-relaxed text-gray-300 mb-6">
                  "{item.review}"
                </p>

                {/* User */}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="h-12 w-12 rounded-full object-cover border-2 border-red-500"
                    />
                    <div>
                      <h4 className="font-bold text-white">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {item.username}
                      </p>
                    </div>
                  </div>

                  <PlatformIcon
                    className="text-2xl text-red-400"
                  />
                </div>

              </motion.div>
            );
          })}

        </div>

      </div>

    </section>
  );
}