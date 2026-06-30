import {
  FaDiscord,
  FaGithub,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaGamepad,
  FaArrowRight,
} from "react-icons/fa";

import { Link } from "react-router-dom";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Games", path: "/games" },
  { name: "Reviews", path: "/reviews" },
  { name: "Community", path: "/community" },
];

const supportLinks = [
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "Privacy Policy", path: "/privacy" },
  { name: "Terms", path: "/terms" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#04060f]">

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[170px]" />

        <div className="absolute bottom-0 right-0 h-[250px] w-[250px] rounded-full bg-orange-500/10 blur-[130px]" />

      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">

        {/* Top */}

        <div className="grid gap-12 lg:grid-cols-4">

          {/* Brand */}

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-orange-500">

                <FaGamepad className="text-2xl text-white" />

              </div>

              <div>

                <h2 className="text-2xl font-black">

                  SynthPlay

                </h2>

                <p className="text-sm text-red-400">

                  Gaming Platform

                </p>

              </div>

            </div>

            <p className="mt-6 text-gray-400 leading-7">

              Discover thousands of games,
              create collections, review your
              favourites and connect with
              gamers worldwide.

            </p>

            {/* Social */}

            <div className="mt-8 flex gap-4">

              {[
                FaDiscord,
                FaGithub,
                FaTwitter,
                FaInstagram,
                FaYoutube,
              ].map((Icon, index) => (

                <button
                  key={index}
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 transition hover:bg-red-600 hover:scale-110"
                >
                  <Icon />
                </button>

              ))}

            </div>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="text-xl font-bold mb-6">

              Quick Links

            </h3>

            <div className="space-y-4">

              {quickLinks.map(link => (

                <Link
                  key={link.name}
                  to={link.path}
                  className="block text-gray-400 transition hover:text-red-400"
                >
                  {link.name}
                </Link>

              ))}

            </div>

          </div>

          {/* Support */}

          <div>

            <h3 className="text-xl font-bold mb-6">

              Support

            </h3>

            <div className="space-y-4">

              {supportLinks.map(link => (

                <Link
                  key={link.name}
                  to={link.path}
                  className="block text-gray-400 transition hover:text-red-400"
                >
                  {link.name}
                </Link>

              ))}

            </div>

          </div>

          {/* Newsletter */}

          <div>

            <h3 className="text-xl font-bold mb-6">

              Newsletter

            </h3>

            <p className="text-gray-400 mb-6">

              Get notified whenever new games
              are added.

            </p>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-2 flex">

              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 bg-transparent outline-none px-4"
              />

              <button className="rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-5">

                <FaArrowRight />

              </button>

            </div>

          </div>

        </div>

        {/* Divider */}

        <div className="my-14 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Bottom */}

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          <p className="text-gray-500">

            © {new Date().getFullYear()} SynthPlay.
            All rights reserved.

          </p>

          <div className="flex gap-6 text-gray-500">

            <span>Made by Nabeel</span>

          </div>

        </div>

      </div>

    </footer>
  );
}