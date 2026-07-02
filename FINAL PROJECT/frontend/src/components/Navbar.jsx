import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaGamepad, FaUserFriends, FaComments, FaCircle, FaUser } from "react-icons/fa";
import { getPendingRequests } from "../services/friendService";
import { connectSocket, disconnectSocket } from "../services/socket";
import SocialSidebar from "./SocialSidebar";
import UserSidebar from "./UserSidebar";
import { API_BASE_URL } from "../services/api";

function Navbar() {
    const API_URL = API_BASE_URL;
    const [scrolled, setScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [user, setUser] = useState(null);
    const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
    const [showSocial, setShowSocial] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const lastScrollY = useRef(0);
    const navigate = useNavigate();

  // Load user from localStorage on mount and listen for changes
  useEffect(() => {
    const loadUser = () => {
      try {
        const stored = localStorage.getItem("user");
        setUser(stored ? JSON.parse(stored) : null);
      } catch {
        setUser(null);
      }
    };

    loadUser();

    window.addEventListener("storage", loadUser);
    window.addEventListener("user-updated", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("user-updated", loadUser);
    };
  }, []);

  // Connect socket when user is logged in
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        connectSocket(token);
      }
    } else {
      disconnectSocket();
    }
  }, [user]);

  // Fetch pending friend requests count
  useEffect(() => {
    const fetchPendingRequests = async () => {
      if (!user) {
        setPendingRequestsCount(0);
        return;
      }

      try {
        const requests = await getPendingRequests();
        setPendingRequestsCount(requests.length);
      } catch (err) {
        console.error("Failed to fetch pending requests:", err);
      }
    };

    fetchPendingRequests();
    const interval = setInterval(fetchPendingRequests, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/users/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });
    } catch {
      // Server logout is best-effort
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      
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
    <>
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
                SynthPlay
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

              {user ? (
                <>
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

                  <button
                    onClick={() => setShowUserMenu(true)}
                    className="user-sidebar-toggle relative flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600/20 to-orange-500/10 border border-red-500/30 text-red-400 hover:from-red-600/30 hover:to-orange-500/20 hover:border-red-500/50 transition-all duration-200 text-sm font-semibold"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-5 h-5 rounded-full object-cover border border-red-500/30"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-[10px] font-bold">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span>Account</span>
                  </button>

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

                  {/* Social Hub Toggle */}
                  <button
                    onClick={() => setShowSocial(true)}
                    className="social-sidebar-toggle relative flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600/20 to-orange-500/10 border border-red-500/30 text-red-400 hover:from-red-600/30 hover:to-orange-500/20 hover:border-red-500/50 transition-all duration-200 text-sm font-semibold"
                  >
                    <FaComments className="text-sm" />
                    <span>Social</span>
                    {pendingRequestsCount > 0 && (
                      <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]">
                        {pendingRequestsCount}
                      </span>
                    )}
                  </button>

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
            <div className="md:hidden flex items-center gap-2">
              {user && (
                <button
                  onClick={() => setShowSocial(true)}
                  className="social-sidebar-toggle p-2 rounded-lg bg-white/5 border border-red-500/20 text-red-400 hover:bg-white/10 transition-all relative"
                >
                  <FaComments className="text-sm" />
                  {pendingRequestsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">
                      {pendingRequestsCount}
                    </span>
                  )}
                </button>
              )}
              <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-red-500/30 transition-all">
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Social Sidebar */}
      <SocialSidebar isOpen={showSocial} onClose={() => setShowSocial(false)} />
      
      {/* User Menu Sidebar */}
      <UserSidebar isOpen={showUserMenu} onClose={() => setShowUserMenu(false)} />
    </>
  );
}

export default Navbar;