export default function Card({ title, desc, color, onClick, icon }) {
  const colors = {
    blue: "bg-blue-100 hover:bg-blue-200 text-blue-700",
    green: "bg-green-100 hover:bg-green-200 text-green-700",
  };
  const btnColors = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
  };

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-8 rounded-3xl shadow-2xl transition transform hover:-translate-y-3 hover:scale-105 ${colors[color]} flex flex-col justify-between`}
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h2 className="text-2xl font-bold mb-3">{title}</h2>
      <p className="text-gray-700 mb-5">{desc}</p>
      <button
        className={`px-5 py-3 rounded-full font-semibold text-white ${btnColors[color]} shadow-lg hover:shadow-xl transition`}
      >
        Explore
      </button>
    </div>
  );
}
