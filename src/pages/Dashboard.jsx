import { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { db } from "../firebase";
import {
  doc,
  getDoc,
  query,
  where,
  orderBy,
  collection,
  onSnapshot,
} from "firebase/firestore";

import { useAuth } from "../contexts/AuthContext";
import InsightsCard from "../components/InsightsCard";
import DiabetesDetailModal from "../components/DiabetesDetailModal";

export default function Dashboard({ setPage }) {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [diabetesHistory, setDiabetesHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Correct modal state placement
  const [showModal, setShowModal] = useState(false);


  // Your original mock stress data
  const stressData = [
    { date: "2025-10-01", stress: 30 },
    { date: "2025-10-10", stress: 55 },
    { date: "2025-10-17", stress: 48 },
    { date: "2025-10-23", stress: 42 },
  ];
  const stressScore = 0.42;

  useEffect(() => {
    if (!user) {
      setPage("login");
      return;
    }

    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setUserData(snap.data());
        } else {
          setUserData({ name: user.displayName || user.email });
        }
      } catch (err) {
        console.error("User data error:", err);
        alert("Error fetching dashboard data");
      }
    };

    // Subscribe to diabetes test history
    const q = query(
      collection(db, "diabetesResults"),
      where("uid", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setDiabetesHistory(data);
        setLoading(false);
      },
      (err) => {
        console.error("History error:", err);
      }
    );

    fetchProfile();
    return () => unsub();
  }, [user, setPage]);

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-600">
        Loading dashboard…
      </div>
    );
  }

  const latestRisk = diabetesHistory[0]?.probability ?? null;

  const riskColor = (p) => {
    if (p >= 70) return "bg-red-500 text-white";
    if (p >= 40) return "bg-yellow-400 text-black";
    return "bg-green-500 text-white";
  };

  return (
    <div className="container mx-auto py-16 px-6 space-y-16">
      
      {/* Welcome Section */}
      <section className="text-center">
        <Motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
        >
          Welcome back, {userData?.name || "HealthMate User"} 👋
        </Motion.h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Here’s your weekly health snapshot — stress trends, diabetes risk,
          and personalized AI insights to support your wellness journey.
        </p>
      </section>

      {/* Stress Chart */}
      <section className="bg-white p-8 rounded-3xl shadow-lg">
        <h2 className="text-2xl font-semibold text-blue-700 mb-6">
          🧘 Weekly Stress Trend
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="stress"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Insight Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <InsightsCard
          title="🩸 Diabetes Risk Analysis"
          value={
            latestRisk !== null
              ? latestRisk.toFixed(1) + "%"
              : "No tests yet"
          }
          desc={
            latestRisk !== null
              ? "Based on your recent diabetes prediction test."
              : "Go run a diabetes check to get your first result."
          }
          color="blue"
          onClick={() => setShowModal(true)}
        />

        {/* ✅ Move modal right after card inside section */}
        <DiabetesDetailModal
          open={showModal}
          onClose={() => setShowModal(false)}
          history={diabetesHistory}
        />

        <InsightsCard
          title="🧠 Mental Health Insights"
          value={(stressScore * 100).toFixed(1) + "%"}
          desc="Your stress trend suggests moderate emotional strain. Continue mindfulness and healthy habits."
          color="green"
        />
      </section>


      {/* Diabetes Test History */}
      <section className="bg-white p-8 rounded-3xl shadow-lg">
        <h2 className="text-2xl font-semibold text-blue-700 mb-6">
          📂 Diabetes Test History
        </h2>

        {diabetesHistory.length === 0 ? (
          <p className="text-center text-gray-600">
            No diabetes test history yet. Take a test on the home page.
          </p>
        ) : (
          <div className="space-y-4">
            {diabetesHistory.map((r) => (
              <div
                key={r.id}
                className="bg-gray-50 p-4 rounded-xl shadow-sm border"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-lg">{r.prediction}</div>
                    <div className="text-xs text-gray-500">
                      {r.timestamp?.toDate?.().toLocaleString?.()}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${riskColor(r.probability)}`}>
                    {r.probability.toFixed(1)}%
                  </div>
                </div>

                {/* Key features preview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-sm">
                  <div>Glucose: {r.inputs.glucose}</div>
                  <div>Insulin: {r.inputs.insulin}</div>
                  <div>Skinfold: {r.inputs.skin_thickness}</div>
                  <div>Pedigree: {r.inputs.pedigree}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Closing Hero */}
      <section className="text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white py-16 rounded-3xl shadow-lg">
        <h2 className="text-3xl font-bold mb-4">
          Holistic AI Wellness Summary
        </h2>
        <p className="max-w-3xl mx-auto text-lg text-white/90">
          AI is monitoring your metabolic and emotional markers to guide you
          toward healthier living, every single day.
        </p>
      </section>
    </div>
  );
}
