import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import Chatbot from "./components/Chatbot";
import MentalHealth from "./pages/MentalHealth";
import DiabetesPredictor from "./pages/DiabetesPredictor";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Card from "./components/Card";
import "./styles/Home.css"; // External stylesheet for gradients, animations, etc.
import Home from "./pages/Home"
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

/**
 * App.jsx — improved version
 * - preserves all existing functionality
 * - refactors motion into reusable variants
 * - improves hero responsiveness, accessibility, and small UX tweaks
 */

/* Reusable motion variants for page transitions */
const pageVariants = {
  enterUp: { opacity: 0, y: 30 },
  enterRight: { opacity: 0, x: 40 },
  enterDown: { opacity: 0, y: -30 },
  center: { opacity: 1, x: 0, y: 0 },
  exitUp: { opacity: 0, y: -20 },
  exitLeft: { opacity: 0, x: -40 },
};

const pageTransition = { duration: 0.45, ease: "easeInOut" };

/* Small wrapper to avoid repeating Motion.div props */
function ComponentTransition({ children, variant = "center", keyName }) {
  /* choose initial/exit based on provided variant */
  const initial =
    variant === "right"
      ? pageVariants.enterRight
      : variant === "down"
      ? pageVariants.enterDown
      : pageVariants.enterUp;
  const exit =
    variant === "right"
      ? pageVariants.exitLeft
      : variant === "down"
      ? pageVariants.exitUp
      : pageVariants.exitUp;

  return (
    <Motion.div
      key={keyName}
      initial={initial}
      animate={pageVariants.center}
      exit={exit}
      transition={pageTransition}
    >
      {children}
    </Motion.div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");

return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50">
        <Navbar setPage={setPage} />

        <main className="flex-grow container mx-auto px-4 py-10">
          <AnimatePresence mode="wait">
            {page === "home" && (
              <Motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={pageTransition}
              >
                <Home setPage={setPage} />
              </Motion.div>
            )}

            {page === "login" && (
              <Motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Login setPage={setPage} />
              </Motion.div>
            )}

            {page === "signup" && (
              <Motion.div key="signup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Signup setPage={setPage} />
              </Motion.div>
            )}


            {page === "diabetes" && (
              <Motion.div
                key="diabetes"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={pageTransition}
              >
                <DiabetesPredictor setPage={setPage} />
              </Motion.div>
            )}

            {page === "mental" && (
              <Motion.div
                key="mental"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={pageTransition}
              >
                <MentalHealth setPage={setPage} />
              </Motion.div>
            )}

            {page === "dashboard" && (
              <Motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={pageTransition}
              >
                <Dashboard />
              </Motion.div>
            )}

            {page === "profile" && (
              <Motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={pageTransition}
              >
                <Profile />
              </Motion.div>
            )}
          </AnimatePresence>
        </main>

        <Chatbot />
        <Footer />
      </div>
    </AuthProvider>
  );
}
