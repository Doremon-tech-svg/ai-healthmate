import { useState } from "react";
import axios from "axios";

export default function DiabetesPredictor({ setPage }) {
  const [form, setForm] = useState({
    age: "",
    bmi: "",
    glucose: "",
    insulin: "",
    family_history: "",
  });
  const [result, setResult] = useState(null);
  const [prob, setProb] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setProb(null);

    try {
      const res = await axios.post("http://localhost:8000/predict-diabetes", {
        age: parseFloat(form.age),
        bmi: parseFloat(form.bmi),
        glucose: parseFloat(form.glucose),
        insulin: parseFloat(form.insulin),
        family_history: parseInt(form.family_history) || 0,
      });
      if (res.data.error) {
        setResult("Model not ready on server");
      } else {
        setResult(res.data.prediction);
        setProb((res.data.probability * 100).toFixed(1));
      }
    } catch (err) {
      console.error(err);
      setResult("Error contacting server");
    } finally {
      setLoading(false);
    }
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
        {["age", "bmi", "glucose", "insulin"].map((f) => (
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

        <label className="text-sm text-gray-500">Family history (1 = yes, 0 = no)</label>
        <input
          type="number"
          name="family_history"
          value={form.family_history}
          onChange={handleChange}
          className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 hover:scale-105 transition transform shadow-lg"
        >
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {loading && (
        <div className="mt-6 text-center text-blue-600 font-bold animate-pulse">
          Calculating risk...
        </div>
      )}

      {result && (
        <div className="mt-6 text-center">
          <div className="text-xl font-semibold">{result}</div>
          {prob && <div className="text-sm text-gray-600 mt-1">Confidence: {prob}%</div>}
        </div>
      )}
    </div>
  );
}
