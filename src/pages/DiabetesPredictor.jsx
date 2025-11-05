import { useState, useMemo } from "react";
import axios from "axios";
import { db, auth } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8000";

export default function DiabetesPredictor({ setPage }) {
  // Mode toggle
  const [mode, setMode] = useState("basic"); // "basic" | "advanced"

  // User-friendly fields
  const [sex, setSex] = useState("female"); // female | male
  const [pregnancies, setPregnancies] = useState(""); // shown only for female
  const [glucose, setGlucose] = useState(""); // fasting glucose mg/dL

  // Family history → pedigree proxy
  const [familyHistory, setFamilyHistory] = useState("unknown"); 
  // unknown | none | one_parent | sibling | multiple_relatives

  // Optional inputs with “I don’t know”
  const [knowsInsulin, setKnowsInsulin] = useState(false);
  const [insulin, setInsulin] = useState(""); // μU/mL

  const [knowsSkin, setKnowsSkin] = useState(false);
  const [skinThickness, setSkinThickness] = useState(""); // mm

  // Advanced overrides (raw features)
  const [advPedigree, setAdvPedigree] = useState("");
  const [advSkinThickness, setAdvSkinThickness] = useState("");
  const [advInsulin, setAdvInsulin] = useState("");
  const [advPregnancies, setAdvPregnancies] = useState("");

  // Results
  const [result, setResult] = useState(null);
  const [prob, setProb] = useState(null);
  const [loading, setLoading] = useState(false);

  // Conservative typical defaults (for unknowns)
  const DEFAULTS = {
    pregnancies: 0,
    skinThickness: 23,
    insulin: 100,
    pedigree: 0.47
  };

  // Map family history to a pedigree-like numeric score
  const pedigreeFromFamilyHistory = useMemo(() => {
    switch (familyHistory) {
      case "none": return 0.20;
      case "one_parent": return 0.40;
      case "sibling": return 0.55;
      case "multiple_relatives": return 0.75;
      case "unknown":
      default: return DEFAULTS.pedigree;
    }
  }, [familyHistory]);

  // Resolve the final 5 inputs the model expects
  const resolvedInputs = useMemo(() => {
    const preg =
      mode === "advanced"
        ? Number(advPregnancies || 0)
        : sex === "female"
        ? Number(pregnancies || DEFAULTS.pregnancies)
        : 0;

    const glu = Number(glucose);

    const skin =
      mode === "advanced"
        ? Number(advSkinThickness || DEFAULTS.skinThickness)
        : knowsSkin
        ? Number(skinThickness || DEFAULTS.skinThickness)
        : DEFAULTS.skinThickness;

    const ins =
      mode === "advanced"
        ? Number(advInsulin || DEFAULTS.insulin)
        : knowsInsulin
        ? Number(insulin || DEFAULTS.insulin)
        : DEFAULTS.insulin;

    const ped =
      mode === "advanced"
        ? Number(advPedigree || DEFAULTS.pedigree)
        : pedigreeFromFamilyHistory;

    return {
      pregnancies: isFinite(preg) ? preg : 0,
      glucose: isFinite(glu) ? glu : NaN, // must validate before submit
      skin_thickness: isFinite(skin) ? skin : DEFAULTS.skinThickness,
      insulin: isFinite(ins) ? ins : DEFAULTS.insulin,
      pedigree: isFinite(ped) ? ped : DEFAULTS.pedigree,
    };
  }, [
    mode, sex, pregnancies, glucose, knowsSkin, skinThickness, knowsInsulin, insulin,
    advPedigree, advSkinThickness, advInsulin, advPregnancies, pedigreeFromFamilyHistory
  ]);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setProb(null);

    // Validation
    if (!glucose || !isFinite(Number(glucose))) {
      alert("Please enter a valid fasting glucose value (mg/dL).");
      setLoading(false);
      return;
    }
    if (sex === "female" && mode !== "advanced" && pregnancies !== "" && Number(pregnancies) < 0) {
      alert("Pregnancies cannot be negative.");
      setLoading(false);
      return;
    }

    const payload = resolvedInputs;

    try {
      const res = await axios.post(`${API_BASE}/predict-diabetes`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data?.error) {
        setResult("Model error");
      } else {
        setResult(res.data.prediction);
        if (typeof res.data.probability === "number") {
          setProb((res.data.probability * 100).toFixed(1));
        }

        // Save to Firestore if logged in
        const user = auth.currentUser;
        if (user) {
          await addDoc(collection(db, "diabetesResults"), {
            uid: user.uid,
            timestamp: serverTimestamp(),
            prediction: res.data.prediction,
            probability: res.data.probability * 100,
            inputs: payload
          });
        }
      }
    } catch (err) {
      console.error(err);
      setResult("Error contacting server");
    } finally {
      setLoading(false);
    }
  };

  // UI helpers
  const pill = (active) =>
    `px-4 py-2 rounded-full border transition ${active ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 hover:bg-gray-50"}`;

  return (
    <div className="relative max-w-2xl mx-auto bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl mt-6">
      {/* Back */}
      <button
        onClick={() => setPage("home")}
        className="absolute top-6 left-6 px-4 py-2 bg-gray-200 rounded-full shadow-lg hover:bg-gray-300 transition"
        aria-label="Back to Home"
      >
        ← Back
      </button>

      {/* Title */}
      <h2 className="text-3xl font-bold text-blue-600 mb-2 text-center">
        Diabetes Predictor
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Provide a few details. If you do not know a value, choose “I don’t know” and we will use a reasonable estimate.
      </p>

      {/* Mode toggle */}
      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => setMode("basic")} className={pill(mode === "basic")}>
          Basic mode
        </button>
        <button onClick={() => setMode("advanced")} className={pill(mode === "advanced")}>
          Advanced mode
        </button>
      </div>

      {/* Form */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {mode === "basic" ? (
          <>
            {/* Sex */}
            <div>
              <label className="block font-medium mb-1">Sex</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="radio" name="sex" value="female" checked={sex === "female"} onChange={() => setSex("female")} />
                  Female
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="sex" value="male" checked={sex === "male"} onChange={() => setSex("male")} />
                  Male
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">If male, pregnancies will be set to 0.</p>
            </div>

            {/* Pregnancies */}
            {sex === "female" && (
              <div>
                <label className="block font-medium mb-1">Number of pregnancies</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={pregnancies}
                  onChange={(e) => setPregnancies(e.target.value)}
                  className="w-full p-3 rounded-xl border"
                  placeholder="e.g., 2"
                />
              </div>
            )}

            {/* Glucose */}
            <div>
              <label className="block font-medium mb-1">
                Fasting glucose (mg/dL) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="40"
                max="400"
                step="1"
                value={glucose}
                onChange={(e) => setGlucose(e.target.value)}
                className="w-full p-3 rounded-xl border"
                placeholder="e.g., 125"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your lab fasting plasma glucose. This is required for a prediction.
              </p>
            </div>

            {/* Insulin known? */}
            <div>
              <label className="block font-medium mb-1">Do you know your fasting insulin?</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={knowsInsulin}
                    onChange={(e) => setKnowsInsulin(e.target.checked)}
                  />
                  I will enter insulin
                </label>
                {!knowsInsulin && (
                  <span className="text-xs text-gray-500">
                    If unchecked, we will estimate a typical value.
                  </span>
                )}
              </div>

              {knowsInsulin && (
                <input
                  type="number"
                  min="1"
                  max="900"
                  step="1"
                  value={insulin}
                  onChange={(e) => setInsulin(e.target.value)}
                  className="mt-2 w-full p-3 rounded-xl border"
                  placeholder="Fasting insulin (μU/mL), e.g., 100"
                />
              )}
            </div>

            {/* Skin thickness known? */}
            <div>
              <label className="block font-medium mb-1">Do you know your triceps skinfold thickness?</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={knowsSkin}
                    onChange={(e) => setKnowsSkin(e.target.checked)}
                  />
                  I will enter skinfold thickness
                </label>
                {!knowsSkin && (
                  <span className="text-xs text-gray-500">
                    If unchecked, we will estimate a typical value.
                  </span>
                )}
              </div>

              {knowsSkin && (
                <input
                  type="number"
                  min="5"
                  max="70"
                  step="1"
                  value={skinThickness}
                  onChange={(e) => setSkinThickness(e.target.value)}
                  className="mt-2 w-full p-3 rounded-xl border"
                  placeholder="Skinfold thickness (mm), e.g., 23"
                />
              )}
            </div>

            {/* Family history */}
            <div>
              <label className="block font-medium mb-1">Family history of diabetes</label>
              <select
                value={familyHistory}
                onChange={(e) => setFamilyHistory(e.target.value)}
                className="w-full p-3 rounded-xl border"
              >
                <option value="unknown">I am not sure</option>
                <option value="none">No close relatives</option>
                <option value="one_parent">One parent</option>
                <option value="sibling">A sibling</option>
                <option value="multiple_relatives">Multiple close relatives</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                We convert this to a pedigree-like score internally to match the model input.
              </p>
            </div>
          </>
        ) : (
          // Advanced mode: raw feature inputs
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Pregnancies</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={advPregnancies}
                  onChange={(e) => setAdvPregnancies(e.target.value)}
                  className="w-full p-3 rounded-xl border"
                  placeholder="0 if male"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Fasting glucose (mg/dL) *</label>
                <input
                  type="number"
                  min="40"
                  max="400"
                  step="1"
                  value={glucose}
                  onChange={(e) => setGlucose(e.target.value)}
                  className="w-full p-3 rounded-xl border"
                  placeholder="e.g., 125"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Triceps skinfold (mm)</label>
                <input
                  type="number"
                  min="5"
                  max="70"
                  step="1"
                  value={advSkinThickness}
                  onChange={(e) => setAdvSkinThickness(e.target.value)}
                  className="w-full p-3 rounded-xl border"
                  placeholder="e.g., 23"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Fasting insulin (μU/mL)</label>
                <input
                  type="number"
                  min="1"
                  max="900"
                  step="1"
                  value={advInsulin}
                  onChange={(e) => setAdvInsulin(e.target.value)}
                  className="w-full p-3 rounded-xl border"
                  placeholder="e.g., 100"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Pedigree score</label>
                <input
                  type="number"
                  min="0.1"
                  max="2.5"
                  step="0.01"
                  value={advPedigree}
                  onChange={(e) => setAdvPedigree(e.target.value)}
                  className="w-full p-3 rounded-xl border"
                  placeholder="e.g., 0.47"
                />
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 hover:scale-105 transition transform shadow-lg"
        >
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {/* Loading indicator */}
      {loading && (
        <div className="mt-6 text-center text-blue-600 font-bold animate-pulse">
          Calculating risk...
        </div>
      )}

      {/* Result card */}
      {result && (
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-2xl font-bold text-blue-700">Result</h3>
            <span
              className={`px-4 py-1 rounded-full text-white text-sm font-semibold ${
                result === "Diabetic" ? "bg-red-600" : "bg-green-600"
              }`}
            >
              {result}
            </span>
          </div>

          {prob && (
            <div className="mb-4">
              <div className="text-lg font-semibold">
                Risk: <span className="text-blue-600">{prob}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                <div
                  className={`h-3 rounded-full ${
                    result === "Diabetic" ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{ width: `${prob}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500">
            Estimates are provided by a machine learning model trained on the PIMA Indians Diabetes dataset.
            Unknown fields were filled with conservative typical values.
          </div>
        </div>
      )}
    </div>
  );
}
