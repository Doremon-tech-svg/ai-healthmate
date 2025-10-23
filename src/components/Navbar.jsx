import { useState, useRef, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { Menu, LogOut, User, Home as HomeIcon, ActivitySquare } from "lucide-react";

export default function Navbar({ setPage }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  const goToDashboard = () => {
    if (user) setPage("dashboard");
    else setPage("login");
    setMenuOpen(false);
  };

  const goToProfile = () => {
    if (user) setPage("profile");
    else setPage("login");
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setPage("home");
      setMenuOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        <Motion.h1
          className="text-2xl font-extrabold text-blue-600 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => setPage("home")}
        >
          AI HealthMate
        </Motion.h1>

        <div className="hidden md:flex space-x-6 font-medium">
          <button onClick={() => setPage("home")} className="hover:text-blue-600 transition">
            Home
          </button>
          <button onClick={() => setPage("diabetes")} className="hover:text-blue-600 transition">
            Diabetes Predictor
          </button>
          <button onClick={() => setPage("mental")} className="hover:text-blue-600 transition">
            Mental Health
          </button>
          <button onClick={goToDashboard} className="hover:text-blue-600 transition">
            Dashboard
          </button>
        </div>

        <div className="relative" ref={menuRef}>
          {user ? (
            <div className="flex items-center space-x-3">
              <img
                src={
                  user.photoURL ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || "User")}`
                }
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-blue-500 cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
              />
              <span
                className="font-semibold text-gray-700 hidden sm:block cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {user.displayName || user.email}
              </span>

              {menuOpen && (
                <div className="absolute right-0 mt-12 w-48 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 animate-fadeIn z-50">
                  <button
                    onClick={goToProfile}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-blue-50 transition"
                  >
                    <User size={18} className="text-blue-500" /> Profile
                  </button>

                  <button
                    onClick={goToDashboard}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-blue-50 transition"
                  >
                    <ActivitySquare size={18} className="text-green-500" /> Dashboard
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-500 transition"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-x-3">
              <button
                onClick={() => setPage("login")}
                className="px-5 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Login
              </button>
              <button
                onClick={() => setPage("signup")}
                className="px-5 py-2 rounded-full border border-blue-600 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>
    </nav>
  );
}
