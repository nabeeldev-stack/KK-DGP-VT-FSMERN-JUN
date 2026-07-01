import { motion } from "framer-motion";

import Hero from "../components/Hero";
import Featured from "../components/Featured";
import NewlyAdded from "../components/NewlyAdded";
import Categories from "../components/Categories";
import WhyChooseUs from "../components/WhyChooseus";
import Testimonials from "../components/Testimonials";
import Stats from "../components/Stats";
import Footer from "../components/Footer";

function useAuth() {
  const token = localStorage.getItem("accessToken");
  const user = localStorage.getItem("user");
  return !!(token && user);
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function Home() {
  const isLoggedIn = useAuth();

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-[#1a0000] via-[#0a0a0b] to-[#120000] text-white">

      {/* Hero */}
      <Hero />

      {/* Featured - Top Rated Games */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="relative py-24"
      >
        <Featured isLoggedIn={isLoggedIn} />
      </motion.section>

      {/* Newly Added Games */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="relative py-24"
      >
        <NewlyAdded isLoggedIn={isLoggedIn} />
      </motion.section>

      {/* Categories */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="relative py-24"
      >
        <Categories isLoggedIn={isLoggedIn} />
      </motion.section>

      {/* Why Choose Us */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="relative py-24"
      >
        <WhyChooseUs />
      </motion.section>

      {/* Testimonials - What Our Gamers Say */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="relative py-24"
      >
        <Testimonials />
      </motion.section>

      {/* Stats - Gaming in Numbers */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="relative py-24"
      >
        <Stats />
      </motion.section>

      {/* CTA Section */}
      <section className="relative py-32 bg-gradient-to-br from-[#1a0000] via-[#120000] to-[#0a0a0b]">
        {/* Red Glow */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/20 blur-[180px]" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent p-12 md:p-20 text-center backdrop-blur-xl">
                {isLoggedIn && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                  >
                    <h3 className="text-3xl md:text-4xl font-bold text-white">
                      Welcome,{" "}
                      <span className="bg-gradient-to-r from-red-400 via-orange-300 to-rose-400 bg-clip-text text-transparent">
                        {JSON.parse(localStorage.getItem("user"))?.username || "Gamer"}
                      </span>
                      <span className="text-gray-400"> 👋</span>
                    </h3>
                    <p className="mt-2 text-gray-500 text-base">Ready to level up your gaming experience?</p>
                  </motion.div>
                )}
                <span className="inline-block rounded-full border border-red-500/40 bg-red-500/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.35em] text-red-400">
                  {isLoggedIn ? "Your Gaming Hub" : "Join The Community"}
                </span>
                <h2 className="mt-8 text-4xl font-black leading-tight md:text-6xl">
                  Ready To
                  <span className="bg-gradient-to-r from-red-400 via-orange-300 to-rose-400 bg-clip-text text-transparent">
                    {" "}Level Up?
                  </span>
                </h2>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
                  Discover thousands of games, write reviews, create your wishlist,
                  track your favorites, and connect with gamers from around the world.
                </p>
                <div className="mt-12 flex flex-wrap justify-center gap-4">
                  {!isLoggedIn && (
                    <button
                      onClick={() => (window.location.href = "/register")}
                      className="rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-8 py-4 font-semibold text-white transition hover:scale-105 hover:shadow-[0_0_40px_rgba(239,68,68,.45)]"
                    >
                      🚀 Create Free Account
                    </button>
                  )}
                  <button
                    onClick={() => (window.location.href = "/games")}
                    className="rounded-xl border border-red-500/30 bg-red-500/5 px-8 py-4 font-semibold text-red-400 backdrop-blur-md transition hover:bg-red-500/10 hover:border-red-500/50"
                  >
                    🎮 Explore Games
                  </button>
                  {isLoggedIn && (
                    <button
                      onClick={() => (window.location.href = "/dashboard")}
                      className="rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-8 py-4 font-semibold text-white transition hover:scale-105 hover:shadow-[0_0_40px_rgba(239,68,68,.45)]"
                    >
                      📊 Go to Dashboard
                    </button>
                  )}
                </div>
          </div>
        </div>
      </section>

      <Footer />

    </main>
  );
}