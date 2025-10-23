import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { motion as Motion } from "framer-motion";

export default function Login({ setPage }) {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      setPage("dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Motion.div
      className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-2xl text-center space-y-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold text-blue-600">Welcome Back 👋</h2>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-xl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-xl"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition"
        >
          Log In
        </button>
      </form>

      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          onClick={loginWithGoogle}
          className="flex items-center justify-center gap-2 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-100 transition"
        >
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
          Sign in with Google
        </button>
      </div>

      <p className="text-gray-500 mt-6">
        Don’t have an account?{" "}
        <span
          onClick={() => setPage("signup")}
          className="text-blue-600 font-medium cursor-pointer hover:underline"
        >
          Sign Up
        </span>
      </p>
    </Motion.div>
  );
}
