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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50">
      <Navbar setPage={setPage} />

      <main className="flex-grow container mx-auto px-4 py-10">
        {/* Use mode="wait" so exit completes before next enters (replaces exitBeforeEnter) */}
        <AnimatePresence mode="wait">
          {page === "home" && (
            <ComponentTransition keyName="home" variant="up">
              <Home setPage={setPage} />
            </ComponentTransition>
          )}

          {page === "diabetes" && (
            <ComponentTransition keyName="diabetes" variant="right">
              <DiabetesPredictor setPage={setPage} />
            </ComponentTransition>
          )}

          {page === "mental" && (
            <ComponentTransition keyName="mental" variant="down">
              <MentalHealth setPage={setPage} />
            </ComponentTransition>
          )}
        </AnimatePresence>
      </main>

      <Chatbot />

      <Footer />
    </div>
  );
}
