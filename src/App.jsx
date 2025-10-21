import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import Chatbot from "./components/Chatbot";

// Components
function Navbar({ setPage }) {
  return (
    <nav className="bg-white backdrop-blur-md bg-opacity-80 sticky top-0 z-50 shadow-md px-6 py-4 flex justify-between items-center">
      <h1
        className="text-3xl font-bold text-blue-600 cursor-pointer hover:text-blue-800 transition"
        onClick={() => setPage("home")}
      >
        AI HealthMate
      </h1>
      <div className="space-x-6">
        <button
          onClick={() => setPage("home")}
          className="text-gray-700 font-semibold hover:text-blue-600 transition"
        >
          Home
        </button>
        <button
          onClick={() => setPage("diabetes")}
          className="text-gray-700 font-semibold hover:text-blue-600 transition"
        >
          Diabetes Predictor
        </button>
        <button
          onClick={() => setPage("mental")}
          className="text-gray-700 font-semibold hover:text-green-600 transition"
        >
          Mental Health
        </button>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center py-6 mt-20 rounded-t-3xl shadow-inner">
      <p className="mb-2">Built with ❤️ by Team HealthHack | 2025</p>
      <p className="text-sm text-gray-300">
        AI-powered health solutions at your fingertips
      </p>
    </footer>
  );
}

function Card({ title, desc, color, onClick, icon }) {
  const colors = {
    blue: "bg-blue-100 hover:bg-blue-200 text-blue-700",
    green: "bg-green-100 hover:bg-green-200 text-green-700",
  };
  const btnColors = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
  };
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-8 rounded-3xl shadow-2xl transition transform hover:-translate-y-3 hover:scale-105 ${colors[color]} flex flex-col justify-between`}
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h2 className="text-2xl font-bold mb-3">{title}</h2>
      <p className="text-gray-700 mb-5">{desc}</p>
      <button
        className={`px-5 py-3 rounded-full font-semibold text-white ${btnColors[color]} shadow-lg hover:shadow-xl transition`}
      >
        Explore
      </button>
    </div>
  );
}

function Home({ setPage }) {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative text-center py-28 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-3xl shadow-xl overflow-hidden">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-white opacity-20 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-white opacity-10 rounded-full animate-pulse"></div>
        <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg">
          AI HealthMate
        </h1>
        <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto drop-shadow-md">
          Your intelligent companion for managing physical and mental health.
          Predict diabetes risk, track your wellbeing, and get AI-assisted support.
        </p>
        <button
          onClick={() => setPage("diabetes")}
          className="mt-10 px-8 py-4 bg-white text-blue-600 font-bold rounded-full shadow-lg hover:scale-105 transition transform"
        >
          Try Diabetes Predictor
        </button>
      </section>

      {/* Modules Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16">
        <Card
          title="Diabetes Predictor"
          desc="Predict your diabetes risk quickly with simple inputs."
          color="blue"
          icon="💉"
          onClick={() => setPage("diabetes")}
        />
        <Card
          title="Mental Health Companion"
          desc="Analyze your mental state and get AI guidance."
          color="green"
          icon="🧘"
          onClick={() => setPage("mental")}
        />
      </section>
    </div>
  );
}

function DiabetesPredictor() {
  const [form, setForm] = useState({
    age: "",
    bmi: "",
    glucose: "",
    insulin: "",
    family_history: "",
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setResult("High Risk"); // placeholder
  };

  return (
    <div className="max-w-lg mx-auto bg-white backdrop-blur-md bg-opacity-80 p-8 rounded-3xl shadow-2xl">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Diabetes Predictor
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {["age", "bmi", "glucose", "insulin", "family_history"].map((f) => (
          <input
            key={f}
            type="number"
            placeholder={f.replace("_", " ").toUpperCase()}
            name={f}
            value={form[f]}
            onChange={handleChange}
            className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition"
            required
          />
        ))}
        <button className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 hover:scale-105 transition transform shadow-lg">
          Predict
        </button>
      </form>
      {result && (
        <div className="mt-6 text-center text-xl font-semibold text-red-600">
          {result}
        </div>
      )}
    </div>
  );
}

function MentalHealth() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setResponse(
      "You seem okay. Keep up the positive vibes!" // placeholder
    );
  };

  return (
    <div className="max-w-lg mx-auto bg-white backdrop-blur-md bg-opacity-80 p-8 rounded-3xl shadow-2xl">
      <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">
        Mental Health Companion
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="How are you feeling today?"
          rows="5"
          className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none shadow-sm transition"
          required
        />
        <button className="w-full py-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 hover:scale-105 transition transform shadow-lg">
          Analyze
        </button>
      </form>
      {response && (
        <div className="mt-6 text-center italic text-gray-700">{response}</div>
      )}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50">
      <Navbar setPage={setPage} />

      <main className="flex-grow container mx-auto px-4 py-10">
        <AnimatePresence exitBeforeEnter>
          {page === "home" && (
            <Motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Home setPage={setPage} />
            </Motion.div>
          )}
          {page === "diabetes" && (
            <Motion.div
              key="diabetes"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
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
              transition={{ duration: 0.5 }}
            >
              <MentalHealth setPage={setPage} />
            </Motion.div>
          )}
        </AnimatePresence>
      </main>
          <Chatbot />
      <Footer />
    </div>
  );
}
