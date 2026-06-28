import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaGamepad } from "react-icons/fa";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();

  const user = (() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Add background when scrolled
      setScrolled(currentScrollY > 20);
      
      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isVisible ? "translate-y-0" : "-translate-y-full"
    } ${
      scrolled 
        ? "bg-[#0a0a0b]/90 backdrop-blur-xl border-b border-red-500/20 shadow-[0_4px_30px_rgba(239,68,68,0.1)]" 
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-red-600/30 blur-xl rounded-full group-hover:bg-red-600/50 transition-all" />
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 shadow-lg group-hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all">
                <FaGamepad className="text-white text-xl" />
              </div>
            </div>
            <span className="relative text-2xl font-bold bg-gradient-to-r from-red-400 via-orange-300 to-rose-400 bg-clip-text text-transparent tracking-tight">
              SynthPlay.Ai
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className="relative text-gray-300 hover:text-white transition-colors duration-200 group"
            >
              <span className="text-sm font-semibold tracking-wide">Home</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 group-hover:w-full transition-all duration-300" />
            </Link>

            <Link 
              to="/games" 
              className="relative text-gray-300 hover:text-white transition-colors duration-200 group"
            >
              <span className="text-sm font-semibold tracking-wide">Games</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 group-hover:w-full transition-all duration-300" />
            </Link>

            <Link 
              to="/top-games" 
              className="relative text-gray-300 hover:text-white transition-colors duration-200 group"
            >
              <span className="text-sm font-semibold tracking-wide">Top Games</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 group-hover:w-full transition-all duration-300" />
            </Link>

            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="relative text-gray-300 hover:text-white transition-colors duration-200 group"
                >
                  <span className="text-sm font-semibold tracking-wide">Profile</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 group-hover:w-full transition-all duration-300" />
                </Link>

                {user.role === "admin" && (
                  <>
                    <Link 
                      to="/add-game" 
                      className="relative text-gray-300 hover:text-white transition-colors duration-200 group"
                    >
                      <span className="text-sm font-semibold tracking-wide">Add Game</span>
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 group-hover:w-full transition-all duration-300" />
                    </Link>
                    <Link 
                      to="/admin-dashboard" 
                      className="relative text-gray-300 hover:text-white transition-colors duration-200 group"
                    >
                      <span className="text-sm font-semibold tracking-wide">Admin</span>
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 group-hover:w-full transition-all duration-300" />
                    </Link>
                  </>
                )}

                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-200 text-sm font-semibold tracking-wide"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-gray-300 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-200 text-sm font-semibold tracking-wide"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-200 text-sm font-semibold tracking-wide"
                >
                  Join Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {}}
            className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 hover:border-red-500/30 transition-all"
          >
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;