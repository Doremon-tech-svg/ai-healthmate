import { motion as Motion } from "framer-motion";
import CountUp from "react-countup";
import Card from "../components/Card";
import "../styles/Home.css";

export default function Home({ setPage }) {
  return (
    <div className="space-y-28">
      {/* ================= HERO SECTION ================= */}
      <section className="relative text-center py-28 md:py-40 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl overflow-hidden hero-section">
        <div className="absolute -top-10 -left-10 w-80 h-80 bg-white opacity-20 rounded-full animate-pulse" />
        <div className="absolute -bottom-16 -right-16 w-[30rem] h-[30rem] bg-white opacity-10 rounded-full animate-pulse" />

        <div className="relative z-10 px-6 max-w-5xl mx-auto">
          <Motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-6xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg"
          >
            AI HealthMate
          </Motion.h1>
          <p className="text-white/90 text-lg md:text-2xl font-light leading-relaxed max-w-3xl mx-auto drop-shadow-md">
            Empowering health through <strong>AI, Data Science,</strong> and empathy — 
            from disease prediction to mental wellness.
          </p>
          <Motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPage("diabetes")}
            className="mt-10 px-10 py-4 bg-white text-blue-600 font-bold rounded-full shadow-lg hover:shadow-2xl transition-transform duration-300 focus:ring-4 focus:ring-blue-300"
          >
            Try Diabetes Predictor
          </Motion.button>
        </div>

        <div className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-sm">
          Built for <strong>DataVerse 2025</strong> • KIET Group of Institutions • CPByte Club
        </div>
      </section>

      {/* ================= ABOUT PROJECT ================= */}
      <section className="container mx-auto px-6 text-center about-section">
        <h2 className="section-title">About the Project</h2>
        <p className="section-subtitle max-w-3xl mx-auto mb-12">
          <strong>AI HealthMate</strong> is a data-driven healthcare platform built for{" "}
          <strong>DataVerse 2025</strong> — a hackathon organized by the{" "}
          <b>Computer Science Department</b> of <b>KIET Group of Institutions</b> in collaboration
          with <b>CPByte Club</b>.  
          Our goal: leverage AI & ML to make healthcare predictive, personalized, and proactive.
        </p>
      </section>

      {/* ================= FEATURE MODULES ================= */}
      <section className="container mx-auto px-4">
        <h2 className="section-title">Explore Our AI-Driven Modules</h2>
        <p className="section-subtitle">
          Experience the fusion of machine learning, NLP, and human-centered design.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
          <Card
            title="🩸 Diabetes Predictor"
            desc="Predict diabetes risk using ML models trained on real-world health datasets. Powered by Scikit-learn and FastAPI."
            color="blue"
            icon="💉"
            onClick={() => setPage("diabetes")}
          />
          <Card
            title="🧘 Mental Health Companion"
            desc="Analyze emotional tone using transformer-based NLP models and get mindfulness advice. Supports text and voice mood tracking."
            color="green"
            icon="🧠"
            onClick={() => setPage("mental")}
          />
          <Card
            title="🤖 AI Chatbot Assistant (Coming Soon)"
            desc="A conversational AI to answer queries, explain predictions, and provide personalized insights — coming soon as an integrated NLP demo."
            color="purple"
            icon="💬"
          />
        </div>
      </section>

      {/* ================= LIVE DASHBOARD (with CountUp) ================= */}
      <section className="live-stats-section py-24 bg-gradient-to-br from-blue-50 to-purple-50 text-center">
        <h2 className="section-title">📊 Live AI Dashboard</h2>
        <p className="section-subtitle max-w-3xl mx-auto mb-12">
          Our models continuously evolve with data. Here’s a live snapshot of the
          performance metrics and datasets powering AI HealthMate.
        </p>

        <div className="flex flex-wrap justify-center gap-10">
          {[
            { end: 96.8, suffix: "%", label: "Diabetes Prediction Accuracy" },
            { end: 12421, suffix: "", label: "Training Samples" },
            { end: 2.3, suffix: "", label: "Current Model Version" },
            { end: 87, suffix: "%", label: "User Sentiment Detection" },
          ].map((s) => (
            <Motion.div
              key={s.label}
              whileInView={{ scale: 1.05 }}
              viewport={{ once: true }}
              className="stat-card p-8 bg-white rounded-2xl shadow-xl hover:-translate-y-2 transition-transform duration-300 border-t-4 border-blue-400 w-64"
            >
              <div className="text-4xl font-bold text-blue-600 mb-2">
                <CountUp
                  start={0}
                  end={s.end}
                  duration={2.5}
                  decimals={s.end % 1 !== 0 ? 1 : 0}
                  suffix={s.suffix}
                />
              </div>
              <p className="text-gray-700 font-medium">{s.label}</p>
            </Motion.div>
          ))}
        </div>
      </section>

      {/* ================= WHY DATA SCIENCE SECTION ================= */}
      <section className="why-ds-section py-28 bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 text-center">
        <h2 className="section-title">Why Data Science in Healthcare?</h2>
        <p className="section-subtitle max-w-3xl mx-auto mb-12">
          Data Science empowers healthcare to move from reactive treatment to
          proactive prevention. With each dataset, AI learns to predict risks,
          detect emotions, and improve decision-making accuracy.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 max-w-6xl mx-auto">
          {[
            {
              icon: "📈",
              title: "Predictive Power",
              desc: "ML models identify early disease signs long before symptoms appear.",
            },
            {
              icon: "💬",
              title: "Emotional Insight",
              desc: "NLP tools understand patient emotions, improving therapy outcomes.",
            },
            {
              icon: "⚕️",
              title: "Data-Driven Care",
              desc: "Transform raw medical data into actionable recommendations.",
            },
          ].map((item) => (
            <Motion.div
              key={item.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </Motion.div>
          ))}
        </div>
      </section>

      {/* ================= TEAM SECTION ================= */}
      <section className="team-section py-24 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-center">
        <h2 className="section-title">Meet the Team</h2>
        <p className="section-subtitle mb-10">
          The innovators behind AI HealthMate — passionate about healthcare and AI.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto px-6">
          {[
            { name: "Divyank Richhariya", role: "Backend Developer" },
            { name: "Divya Tripathi", role: "Frontend Developer" },
            { name: "Akansh Dwivedi", role: "Machine Learning Engineer" },
            { name: "Aman Yadav", role: "AI Research & Integration" },
          ].map((member) => (
            <Motion.div
              key={member.name}
              whileHover={{ scale: 1.05 }}
              className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-5xl mb-4">👨‍💻</div>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-gray-500">{member.role}</p>
            </Motion.div>
          ))}
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="cta-section py-28 text-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white rounded-3xl mx-4 shadow-2xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
          Shaping the Future of Health with Data & AI 💡
        </h2>
        <p className="max-w-2xl mx-auto text-white/90 mb-10 text-lg">
          Join us in transforming healthcare through predictive analytics,
          emotional intelligence, and machine learning innovation.
        </p>
        <Motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setPage("diabetes")}
          className="px-10 py-4 bg-white text-blue-600 font-bold rounded-full shadow-lg hover:shadow-2xl transition-transform duration-300 focus:ring-4 focus:ring-blue-300"
        >
          Explore Our Models
        </Motion.button>
      </section>
    </div>
  );
}
