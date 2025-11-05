export default function InsightsCard({ title, value, desc, color, onClick }) {
  const colorMap = {
    blue: "border-blue-400",
    green: "border-green-400",
    purple: "border-purple-400",
  };

  const isClickable = typeof onClick === "function";

  return (
    <div
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : -1}
      onClick={isClickable ? onClick : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`p-8 bg-white rounded-3xl shadow-md border-t-4 ${
        colorMap[color]
      } hover:shadow-xl transition-all duration-300 ${
        isClickable ? "cursor-pointer" : ""
      }`}
    >
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="text-4xl font-extrabold mb-3 text-gray-800">{value}</div>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}
