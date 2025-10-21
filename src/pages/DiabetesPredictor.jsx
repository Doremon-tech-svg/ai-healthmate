import { useState } from "react";
import { motion as Motion} from "framer-motion";

export default function DiabetesPredictor({ setPage }) {
  const [form, setForm] = useState({
    age: "",
    bmi: "",
    glucose: "",
    insulin: "",
    family_history: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // Simulate AI processing delay
    setTimeout(() => {
      setLoading(false);
      setResult("High Risk"); // placeholder
    }, 1500);
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
        <button
          type="submit"
          className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 hover:scale-105 transition transform shadow-lg"
        >
          Predict
        </button>
      </form>

      {loading && (
        <div className="mt-6 text-center text-blue-600 font-bold animate-pulse">
          Calculating risk...
        </div>
      )}

      {result && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-6 text-center text-xl font-semibold text-red-600"
        >
          {result}
        </Motion.div>
      )}
    </div>
  );
}
