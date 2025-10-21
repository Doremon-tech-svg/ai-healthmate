import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I’m your AI HealthMate. Ask me anything about health." },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input) return;
    const userMsg = { from: "user", text: input };
    setMessages([...messages, userMsg]);
    setInput("");

    // Fake AI response (replace with API later)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Thanks for your question! This is a placeholder response." },
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="w-16 h-16 rounded-full bg-blue-600 text-white shadow-xl hover:scale-110 transition transform text-2xl flex items-center justify-center"
      >
        💬
      </button>

      <AnimatePresence>
        {open && (
          <Motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="w-80 h-96 bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col"
          >
            <div className="flex-1 p-4 overflow-y-auto space-y-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-xl max-w-xs ${
                    msg.from === "bot" ? "bg-gray-100 text-gray-800 self-start" : "bg-blue-600 text-white self-end"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="p-2 border-t flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                Send
              </button>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
