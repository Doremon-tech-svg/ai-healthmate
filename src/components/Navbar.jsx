export default function Navbar({ setPage }) {
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
