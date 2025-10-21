import { useState } from "react";
import { motion as Motion } from "framer-motion";

export default function MentalHealth({ setPage }) {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    // Simulate AI processing delay
    setTimeout(() => {
      setLoading(false);
      setResponse(
        "You seem okay. Keep up the positive vibes!" // placeholder
      );
    }, 1200);
  };

  return (
    <div className="relative max-w-lg mx-auto bg-white backdrop-blur-md bg-opacity-80 p-8 rounded-3xl shadow-2xl mt-6">
      {/* Back Button */}
      <button
        onClick={() => setPage("home")}
        className="absolute top-6 left-6 px-4 py-2 bg-gray-200 rounded-full shadow-lg hover:bg-gray-300 transition"
      >
        ← Back
      </button>

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
        <button
          type="submit"
          className="w-full py-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 hover:scale-105 transition transform shadow-lg"
        >
          Analyze
        </button>
      </form>

      {loading && (
        <div className="mt-6 text-center text-green-600 font-bold animate-pulse">
          Analyzing...
        </div>
      )}

      {response && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-6 text-center italic text-gray-700"
        >
          {response}
        </Motion.div>
      )}
    </div>
  );
}
