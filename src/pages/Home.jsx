import { motion as Motion } from "framer-motion";
import Card from "../components/Card";
import "../styles/Home.css";

export default function Home({ setPage }) {
  return (
    <div className="space-y-28">
      {/* ================= HERO SECTION ================= */}
      <section className="relative text-center py-28 md:py-40 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl overflow-hidden hero-section">
        {/* Animated circles */}
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
            A Data-Science powered wellness assistant — merging AI, empathy, and
            prediction for better physical & mental health outcomes.
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
          <strong>AI HealthMate</strong> is our entry for <strong>DataVerse 2025</strong>, a
          data-science focused hackathon organized by the <b>Computer Science Department</b> of
          <b> KIET Group of Institutions</b> in collaboration with <b>CPByte Club</b>.  
          <br />
          It integrates machine learning, NLP, and predictive analytics to bring accessible AI health
          insights to everyone — all within a sleek, user-friendly web platform.
        </p>
      </section>

      {/* ================= FEATURE MODULES ================= */}
      <section className="container mx-auto px-4">
        <h2 className="section-title">Explore Our AI-Driven Health Modules</h2>
        <p className="section-subtitle">
          Each module integrates real data science models for actionable insights.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
          <Card
            title="🩸 Diabetes Predictor"
            desc="Predict diabetes risk using medical parameters like age, BMI, glucose level, and family history. Built and trained from scratch on authentic datasets."
            color="blue"
            icon="💉"
            onClick={() => setPage("diabetes")}
          />
          <Card
            title="🧘 Mental Health Companion"
            desc="Understand stress and mood through AI. Uses NLP to detect emotional tone and suggest mindfulness practices and coping strategies."
            color="green"
            icon="🧠"
            onClick={() => setPage("mental")}
          />
          <Card
            title="🤖 AI Chatbot Assistant (Coming Soon)"
            desc="A conversational AI built with transformer-based NLP models for real-time guidance, FAQs, and health conversations. Demo preview available soon."
            color="purple"
            icon="💬"
          />
        </div>
      </section>

      {/* ================= HACKATHON CONTEXT ================= */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-green-50 text-center">
        <h2 className="section-title">About DataVerse 2025</h2>
        <p className="section-subtitle max-w-3xl mx-auto">
          DataVerse is a premier data-science-focused hackathon organized by the
          <strong> Computer Science Department of KIET Group of Institutions</strong>,
          in association with the <strong>CPByte Club</strong>.  
          It celebrates the power of AI, ML, and data analytics in solving real-world challenges in
          healthcare, finance, and beyond.
        </p>

        <div className="flex flex-wrap justify-center gap-8 mt-12">
          {[
            {
              stat: "500+",
              label: "Participants Across India",
            },
            {
              stat: "24hr",
              label: "Hackathon Marathon",
            },
            {
              stat: "3",
              label: "AI-Driven Problem Statements",
            },
            {
              stat: "1",
              label: "Data Science Dream Team",
            },
          ].map((s) => (
            <Motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 bg-white rounded-2xl shadow-lg w-64"
            >
              <div className="text-4xl font-bold text-blue-600">{s.stat}</div>
              <p className="text-gray-700 mt-2">{s.label}</p>
            </Motion.div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-24 text-center container mx-auto px-6">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle max-w-2xl mx-auto">
          Our system combines **predictive analytics**, **machine learning**, and **natural language
          understanding** to create a 360° AI wellness companion.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
          {[
            {
              num: "01",
              title: "Collect & Process Data",
              desc: "Health parameters and emotional data are collected through an interactive frontend.",
            },
            {
              num: "02",
              title: "Run AI/ML Models",
              desc: "Trained models analyze the data using regression, classification, and NLP models.",
            },
            {
              num: "03",
              title: "Generate Insights",
              desc: "The system predicts outcomes, visualizes results, and interacts conversationally.",
            },
          ].map((item) => (
            <Motion.div
              key={item.num}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-8 bg-white rounded-2xl shadow-lg hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="text-4xl font-bold text-blue-600 mb-3">
                {item.num}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </Motion.div>
          ))}
        </div>
      </section>

      {/* ================= TECH STACK ================= */}
      <section className="tech-stack py-24 text-center bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
        <h2 className="section-title">Tech Stack</h2>
        <p className="section-subtitle mb-12">
          Combining state-of-the-art tools from data science and modern web engineering.
        </p>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-lg text-gray-700">
          {[
            "React + TailwindCSS",
            "Framer Motion",
            "Python / Scikit-Learn",
            "TensorFlow / Keras",
            "FastAPI / Flask",
            "OpenAI / Hugging Face",
            "Pandas / NumPy / Matplotlib",
          ].map((tech) => (
            <Motion.div
              key={tech}
              whileHover={{ scale: 1.1 }}
              className="bg-white/70 px-6 py-4 rounded-xl shadow-md hover:shadow-xl backdrop-blur-md transition-all duration-300"
            >
              {tech}
            </Motion.div>
          ))}
        </div>
      </section>

      {/* ================= TEAM SECTION ================= */}
      <section className="team-section py-24 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-center">
        <h2 className="section-title">Meet the Team</h2>
        <p className="section-subtitle mb-10">
          The innovators behind AI HealthMate.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto px-6">
          {[
            {
              name: "Aarav Singh",
              role: "Machine Learning Engineer",
            },
            {
              name: "Riya Patel",
              role: "Frontend Developer",
            },
            {
              name: "Devansh Sharma",
              role: "Data Scientist",
            },
            {
              name: "Ishita Mehra",
              role: "AI Research & Integration",
            },
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

      {/* ================= VISION SECTION ================= */}
      <section className="vision-section py-28 bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 text-center">
        <h2 className="section-title">Our Vision</h2>
        <p className="max-w-3xl mx-auto text-gray-700 text-lg mt-4 leading-relaxed">
          To create accessible, intelligent health tools that empower users to take
          charge of their physical and mental wellness.  
          <br /> AI HealthMate bridges healthcare and data science, shaping a
          proactive approach to personal well-being.
        </p>
      </section>
    </div>
  );
}
