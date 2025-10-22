import { useState } from "react";
import { motion as Motion } from "framer-motion";

export default function MentalHealth({ setPage }) {
  const [formData, setFormData] = useState({
    mood: "",
    moodTrigger: "",
    sleep: "",
    energy: "",
    worry: "",
    joy: "",
    social: "",
    selfcare: [],
    focus: "",
    body: "",
    outlook: "",
    journal: "",
  });

  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => {
        const updated = checked
          ? [...prev.selfcare, value]
          : prev.selfcare.filter((item) => item !== value);
        return { ...prev, selfcare: updated };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setResponse("");

  try {
    const res = await fetch("http://localhost:8000/analyze-mental-health", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.message) {
      setResponse(data.message);
    } else {
      setResponse("No response from server");
    }
  } catch (err) {
    console.error(err);
    setResponse("Error contacting server");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="relative max-w-3xl mx-auto bg-white backdrop-blur-md bg-opacity-80 p-8 rounded-3xl shadow-2xl mt-6">
      {/* Back Button */}
      <button
        onClick={() => setPage("home")}
        className="absolute top-6 left-6 px-4 py-2 bg-gray-200 rounded-full shadow-lg hover:bg-gray-300 transition"
      >
        ← Back
      </button>

      <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">
        Mental Health Check-in
      </h2>
      <p className="text-center text-gray-600 mb-6">
        This is a private space to reflect. Your response is not saved or shared.
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Mood */}
        <fieldset className="border p-4 rounded-xl">
          <legend className="font-semibold text-lg mb-2">
            What's your overall mood right now?
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {["good", "okay", "meh", "bad"].map((m) => (
              <label key={m} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="mood"
                  value={m}
                  checked={formData.mood === m}
                  onChange={handleChange}
                />{" "}
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Mood Trigger */}
        <div>
          <label className="font-semibold block mb-2">
            What's on your mind the most?
          </label>
          <select
            name="moodTrigger"
            value={formData.moodTrigger}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300"
          >
            <option value="">Select an area...</option>
            <option value="work">Work / School</option>
            <option value="relationships">Relationships</option>
            <option value="health">Personal Health</option>
            <option value="finances">Finances</option>
            <option value="world">World Events</option>
            <option value="today">Just today's events</option>
            <option value="none">Nothing in particular</option>
          </select>
        </div>

        {/* The rest (sleep, energy, worry, etc.) */}
        {[
          {
            name: "sleep",
            question: "How did you sleep last night?",
            options: ["rested", "okay", "restless", "bad"],
          },
          {
            name: "energy",
            question: "What's your energy level like today?",
            options: ["high", "normal", "low", "drained"],
          },
          {
            name: "worry",
            question: "How much have you been worrying today?",
            options: ["none", "some", "lot", "constant"],
          },
          {
            name: "joy",
            question: "Have you found joy or interest in your usual activities?",
            options: ["yes", "little", "not-really"],
          },
          {
            name: "social",
            question: "Have you felt connected to others?",
            options: ["yes", "bit", "no"],
          },
          {
            name: "focus",
            question: "How has your ability to focus been?",
            options: ["good", "ok", "distracted", "none"],
          },
          {
            name: "body",
            question: "How does your body feel physically?",
            options: ["relaxed", "tense", "pain"],
          },
          {
            name: "outlook",
            question: "How are you feeling about tomorrow?",
            options: ["good", "neutral", "worried"],
          },
        ].map((q) => (
          <fieldset key={q.name} className="border p-4 rounded-xl">
            <legend className="font-semibold text-lg mb-2">{q.question}</legend>
            <div className="grid grid-cols-2 gap-2">
              {q.options.map((opt) => (
                <label key={opt} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={q.name}
                    value={opt}
                    checked={formData[q.name] === opt}
                    onChange={handleChange}
                  />{" "}
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        {/* Self-care */}
        <fieldset className="border p-4 rounded-xl">
          <legend className="font-semibold text-lg mb-2">
            What self-care have you practiced today? (Check all that apply)
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {[
              "meal",
              "water",
              "move",
              "break",
              "hobby",
              "none",
            ].map((v, i) => (
              <label key={i} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={v}
                  checked={formData.selfcare.includes(v)}
                  onChange={handleChange}
                />
                {v === "meal"
                  ? "Ate a nourishing meal"
                  : v === "water"
                  ? "Drank enough water"
                  : v === "move"
                  ? "Moved my body (walk, stretch, etc.)"
                  : v === "break"
                  ? "Took a mindful break"
                  : v === "hobby"
                  ? "Spent time on a hobby"
                  : "Haven't had time for any yet"}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Journal */}
        <div>
          <label className="font-semibold block mb-2">
            Want to add more detail? (Optional)
          </label>
          <textarea
            name="journal"
            value={formData.journal}
            onChange={handleChange}
            placeholder="Feel free to expand on any of your answers..."
            rows="6"
            className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none shadow-sm transition"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 hover:scale-105 transition transform shadow-lg"
        >
          Submit Reflection
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
