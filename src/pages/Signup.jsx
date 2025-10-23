import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { motion as Motion } from "framer-motion";

export default function Signup({ setPage }) {
  const { signup, signupWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password);
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
      <h2 className="text-3xl font-bold text-green-600">Create Account 🩺</h2>
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
          className="w-full bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition"
        >
          Sign Up
        </button>
      </form>
        <div className="flex items-center justify-center gap-3 mt-4">
        <button
          onClick={signupWithGoogle}
          className="flex items-center justify-center gap-2 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-100 transition"
        >
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
          Sign in with Google
        </button>
      </div>
      <p className="text-gray-500 mt-6">
        Already have an account?{" "}
        <span
          onClick={() => setPage("login")}
          className="text-green-600 font-medium cursor-pointer hover:underline"
        >
          Log In
        </span>
      </p>
    </Motion.div>
  );
}
