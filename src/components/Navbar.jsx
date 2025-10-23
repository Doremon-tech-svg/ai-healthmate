// src/components/Navbar.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar({ setPage }) {
  const { user, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
      setPage("home");
    } catch (err) {
      console.error("Logout failed:", err);
      // optionally show toast
    }
  }

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setPage("home")}
            className="text-xl font-bold text-blue-600"
          >
            AI HealthMate
          </button>
          <div className="hidden md:flex space-x-3 text-gray-600">
            <button onClick={() => setPage("home")} className="hover:underline">
              Home
            </button>
            <button
              onClick={() => setPage("diabetes")}
              className="hover:underline"
            >
              Diabetes
            </button>
            <button onClick={() => setPage("mental")} className="hover:underline">
              Mental
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {!user && (
            <>
              <button
                onClick={() => setPage("login")}
                className="px-4 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
              >
                Login
              </button>
              <button
                onClick={() => setPage("signup")}
                className="px-4 py-2 rounded-full bg-blue-600 text-white hover:opacity-95 transition"
              >
                Sign up
              </button>
            </>
          )}

          {user && (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setPage("dashboard")}
                className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 hover:shadow-sm transition"
              >
                Dashboard
              </button>
              <div className="flex items-center space-x-2">
                <div
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-semibold"
                  title={user.displayName || user.email}
                >
                  {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
