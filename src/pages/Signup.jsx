import { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const defaultAvatars = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=2",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=4",
];

export default function Signup({ setPage }) {
  const { signup, loginWithGoogle, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showExtraForm, setShowExtraForm] = useState(false);
  const [hasCheckedUserDoc, setHasCheckedUserDoc] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    bmi: "",
    bio: "",
    avatar: defaultAvatars[0],
  });

  const [saving, setSaving] = useState(false);
  const [skipping, setSkipping] = useState(false);

  // BMI calculation
  const calculateBMI = (height, weight) => {
    if (!height || !weight) return "";
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    return (w / (h * h)).toFixed(1);
  };

  // Check if user already has profile
  useEffect(() => {
    const checkUserProfile = async () => {
      if (user && !hasCheckedUserDoc) {
        setHasCheckedUserDoc(true);
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (!docSnap.exists()) {
          setShowExtraForm(true);
        } else {
          setPage("dashboard");
        }
      }
    };
    checkUserProfile();
  }, [user, hasCheckedUserDoc, setPage]);

  // Email/password signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, password);
    } catch (err) {
      alert("Signup failed: " + err.message);
      setLoading(false);
    }
  };

  // Google signup
  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      alert("Google sign-in failed: " + err.message);
      setLoading(false);
    }
  };

  // Save extended form
  const handleExtraFormSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const bmi = calculateBMI(formData.height, formData.weight);
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name || user.displayName || user.email,
        age: formData.age || "",
        height: formData.height || "",
        weight: formData.weight || "",
        bmi: bmi || "",
        bio: formData.bio || "",
        avatar: formData.avatar || defaultAvatars[0],
        email: user.email,
        createdAt: new Date().toISOString(),
      });
      setShowExtraForm(false);
      setPage("dashboard");
    } catch (err) {
      console.error(err);
      alert("Error saving profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Skip extended form
  const handleSkip = async () => {
    if (!user) return;
    setSkipping(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName || user.email,
        avatar: defaultAvatars[0],
        email: user.email,
        createdAt: new Date().toISOString(),
      });
      setShowExtraForm(false);
      setPage("dashboard");
    } catch (err) {
      console.error(err);
      alert("Error skipping profile: " + err.message);
    } finally {
      setSkipping(false);
    }
  };

  // --- Extended form UI ---
  if (showExtraForm && user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50 p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
            Complete Your Profile
          </h2>
          <form onSubmit={handleExtraFormSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border rounded-lg p-3"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Age"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                className="border rounded-lg p-3"
              />
              <input
                type="number"
                placeholder="Height (cm)"
                value={formData.height}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    height: e.target.value,
                    bmi: calculateBMI(e.target.value, formData.weight),
                  })
                }
                className="border rounded-lg p-3"
              />
              <input
                type="number"
                placeholder="Weight (kg)"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    weight: e.target.value,
                    bmi: calculateBMI(formData.height, e.target.value),
                  })
                }
                className="border rounded-lg p-3"
              />
              <input
                type="text"
                placeholder="BMI (auto)"
                value={formData.bmi}
                readOnly
                className="border rounded-lg p-3 bg-gray-100"
              />
            </div>

            <textarea
              placeholder="Short Bio (optional)"
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className="w-full border rounded-lg p-3"
              rows="2"
            />

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Choose an Avatar
              </label>
              <div className="flex gap-2">
                {defaultAvatars.map((avatar, idx) => (
                  <img
                    key={idx}
                    src={avatar}
                    alt={`Avatar ${idx + 1}`}
                    className={`w-12 h-12 rounded-full border-2 cursor-pointer ${
                      formData.avatar === avatar
                        ? "border-blue-600"
                        : "border-gray-300"
                    }`}
                    onClick={() => setFormData({ ...formData, avatar })}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={handleSkip}
                disabled={skipping || saving}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                {skipping ? "Please wait..." : "Skip / Fill Later"}
              </button>
              <button
                type="submit"
                disabled={saving || skipping}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                {saving ? "Saving..." : "Save Profile & Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- Main signup page UI ---
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50 p-6">
      <Motion.div
        className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Create Your Account
        </h1>
        <form onSubmit={handleSignup} className="space-y-5">
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="you@example.com"
          />
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="********"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center text-gray-500 mt-4">or</div>

        <button
          onClick={handleGoogleSignup}
          className="mt-4 w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-3 font-semibold hover:bg-gray-100 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Sign up with Google
        </button>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer font-semibold hover:underline"
            onClick={() => setPage("login")}
          >
            Login
          </span>
        </p>
      </Motion.div>
    </div>
  );
}
