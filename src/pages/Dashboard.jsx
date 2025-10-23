import { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import InsightsCard from "../components/InsightsCard";

export default function Dashboard({ user }) {
  // Mock data for now (replace with API data later)
const [stressData] = useState([
  { date: "2025-10-01", stress: 30 },
  { date: "2025-10-10", stress: 55 },
  { date: "2025-10-17", stress: 48 },
  { date: "2025-10-23", stress: 42 },
]);

const [stressScore] = useState(42);
const [diabetesRisk] = useState(27);


  useEffect(() => {
    // Later fetch from backend:
    // fetch('/api/dashboard-data').then(...)
  }, []);

  return (
    <div className="container mx-auto py-16 px-6 space-y-16">
      {/* Welcome Section */}
      <section className="text-center">
        <Motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
        >
          Welcome back, {user?.name || "HealthMate User"} 👋
        </Motion.h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Here’s your weekly health snapshot — track your stress trends, diabetes prediction, 
          and personalized AI insights.
        </p>
      </section>

      {/* Stress Trend Chart */}
      <section className="bg-white p-8 rounded-3xl shadow-lg">
        <h2 className="text-2xl font-semibold text-blue-700 mb-6">
          🧘 Stress Trend (Last 7 Days)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Line type="monotone" dataKey="stress" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Combined Health Insights Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <InsightsCard
          title="🩸 Diabetes Risk Analysis"
          value={(diabetesRisk * 100).toFixed(1) + "%"}
          desc="Based on your latest inputs, your current diabetes risk level is moderate. 
          Keep up with healthy meals and physical activity."
          color="blue"
        />
        <InsightsCard
          title="🧠 Mental Health Insights"
          value={(stressScore * 100).toFixed(1) + "%"}
          desc="Stress levels show improvement this week! AI suggests continuing relaxation 
          routines and consistent sleep schedules."
          color="green"
        />
      </section>

      {/* Holistic Health AI Summary */}
      <section className="text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white py-16 rounded-3xl shadow-lg">
        <h2 className="text-3xl font-bold mb-4">Holistic AI Health Summary</h2>
        <p className="max-w-3xl mx-auto text-lg text-white/90">
          Your physical and mental health data are continuously analyzed by AI 
          to create a personalized wellness strategy.  
          <br />
          <span className="font-semibold">
            “Because true health is both mind and body.”
          </span>
        </p>
      </section>
    </div>
  );
}
