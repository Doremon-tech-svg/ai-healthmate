import Card from "../components/Card";

export default function Home({ setPage }) {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
     <section className="relative text-center py-28 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-3xl shadow-xl overflow-hidden">
  {/* Animated background circles */}
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
