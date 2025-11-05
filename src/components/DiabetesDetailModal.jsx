import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";

/* =========================================================
   Helpers
   ========================================================= */

function buildGlucoseCompareData(glucoseValue) {
  // Fasting glucose normal range: 70–99 mg/dL
  const normalLow = 70;
  const normalHigh = 99;
  const user = Number(glucoseValue ?? 0);
  return [
    { label: "Normal Low", value: normalLow },
    { label: "Normal High", value: normalHigh },
    { label: "You", value: isFinite(user) ? user : 0 },
  ];
}

function computeStreak(history) {
  if (!history || history.length === 0) return 0;

  // Collapse timestamps to unique YYYY-MM-DD days, sorted desc
  const days = Array.from(
    new Set(
      history
        .map((h) => h.timestamp?.toDate?.())
        .filter(Boolean)
        .map((d) => d.toISOString().slice(0, 10))
    )
  ).sort((a, b) => (a < b ? 1 : -1));

  if (days.length === 0) return 0;

  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const curr = new Date(days[i]);
    const diffDays = Math.round((prev - curr) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) streak += 1;
    else break;
  }
  return streak;
}

function historyToSeries(history) {
  // Convert history to time series for probability bar chart
  // Most recent first in your DB; reverse for chronological chart
  const arr = (history || []).slice().reverse();
  return arr.map((r, idx) => {
    const ts =
      r.timestamp?.toDate?.()?.toLocaleDateString?.() ||
      `#${idx + 1}`;
    return {
      ts,
      probability: Number(r.probability || 0),
      glucose: Number(r?.inputs?.glucose || 0),
      insulin: Number(r?.inputs?.insulin || 0),
      skinfold: Number(r?.inputs?.skin_thickness || 0),
      pedigree: Number(r?.inputs?.pedigree || 0),
    };
  });
}

function normalizeStatus(val, {max, warnAbove, unit = "" }) {
  const v = Number(val);
  const ok = typeof warnAbove === "number" ? v <= warnAbove : v <= max;
  const status = ok ? "normal" : "high";
  const badge =
    status === "normal"
      ? "bg-green-50 text-green-700 border-green-200"
      : "bg-red-50 text-red-700 border-red-200";
  return { v, unit, status, badge };
}

/* =========================================================
   Modal
   ========================================================= */

export default function DiabetesDetailModal({ open, onClose, history }) {
  // Tabs
  const tabs = [
    "Insights",
    "Metrics",
    "Suggestions",
    "History",
    "Report",
    "Streaks",
  ];
  const [tab, setTab] = useState("Insights");

  // Latest record
  const latest = history?.[0] || null;
  const latestGlucose = latest?.inputs?.glucose ?? null;

  // Memos
  const chartData = useMemo(
    () => buildGlucoseCompareData(latestGlucose),
    [latestGlucose]
  );
  const streak = useMemo(() => computeStreak(history), [history]);
  const series = useMemo(() => historyToSeries(history), [history]);

  if (!open) return null;

  // Render modal at the document root to avoid parent layout constraints
  return createPortal(
    (
      <div
        role="dialog"
        aria-modal="true"
        className="
          fixed inset-0 z-[9999]
          w-screen h-screen
          bg-black/60 backdrop-blur-md
          flex flex-col
        "
      >
        <div
          className="
            w-full h-full
            bg-white
            flex flex-col
            overflow-hidden
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-50 shadow-md">
            <h2 className="text-2xl font-bold text-blue-700">
              Diabetes Deep Insights
            </h2>
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Subheader */}
          <div className="px-6 py-2 text-xs text-gray-600 border-b bg-gray-50 sticky top-[56px] sm:top-[64px] z-30">
            Clinical-style view with normal-range comparisons, historical trend, and suggestions.
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto px-4 py-3 border-b bg-white sticky top-[88px] sm:top-[96px] z-20">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                  tab === t
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto px-6 py-6 bg-white">
            {tab === "Insights" && (
              <InsightsTab latest={latest} chartData={chartData} />
            )}
            {tab === "Metrics" && <MetricsTab />}
            {tab === "Suggestions" && <SuggestionsTab latest={latest} />}
            {tab === "History" && (
              <HistoryTab latest={latest} series={series} history={history} />
            )}
            {tab === "Report" && (
              <ReportTab history={history} onClose={onClose} />
            )}
            {tab === "Streaks" && <StreaksTab streak={streak} />}
          </div>
        </div>
      </div>
    ),
    document.body
  );
}

/* =========================================================
   Subcomponents
   ========================================================= */

/* ---------- Insights ---------- */

function MetricBadge({ label, value, unit, normalMax, info }) {
  const v = Number(value);
  const high = isFinite(v) && isFinite(normalMax) ? v > normalMax : false;
  return (
    <div
      className={`p-4 rounded-xl border text-sm ${
        high ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
      }`}
      title={info || ""}
    >
      <div className="text-gray-500">{label}</div>
      <div className="text-lg font-bold text-gray-800">
        {isFinite(v) ? v : "—"} {unit}
      </div>
      <div className={`text-xs ${high ? "text-red-700" : "text-green-700"}`}>
        {high ? "Above normal" : "Normal range"}
      </div>
    </div>
  );
}

function InsightsTab({ latest, chartData }) {
  const risk = latest?.probability ?? null;

  // Normal thresholds for quick badges
  const g = Number(latest?.inputs?.glucose);
  const ins = Number(latest?.inputs?.insulin);
  const skin = Number(latest?.inputs?.skin_thickness);
  const ped = Number(latest?.inputs?.pedigree);

  return (
    <div className="space-y-8">
      {/* Risk headline */}
      <div className="text-center">
        <p className="text-gray-700 font-medium">Predicted Diabetes Risk</p>
        <p className="text-5xl font-extrabold text-blue-600 mt-1">
          {risk !== null ? `${risk.toFixed(1)}%` : "—"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Probability estimated by your ML model.
        </p>
      </div>

      {/* Glucose compare card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-indigo-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-800">
            Glucose vs Normal Fasting Range
          </h4>
          <span className="text-xs text-gray-500">70–99 mg/dL</span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              {/* shaded normal band */}
              <ReferenceArea x1="Normal Low" x2="Normal High" fill="#10b98122" />
              <Bar
                dataKey="value"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
                isAnimationActive={true}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Values above 99 mg/dL are considered impaired fasting glucose or diabetic depending on context.
        </p>
      </div>

      {/* Current metrics quick badges */}
      {latest?.inputs && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricBadge
            label="Glucose"
            value={g}
            unit="mg/dL"
            normalMax={99}
            info="Fasting plasma glucose"
          />
          <MetricBadge
            label="Insulin"
            value={ins}
            unit="µU/mL"
            normalMax={25}
            info="Fasting insulin typical upper bound"
          />
          <MetricBadge
            label="Skinfold"
            value={skin}
            unit="mm"
            normalMax={30}
            info="Triceps skinfold proxy for adiposity"
          />
          <MetricBadge
            label="Pedigree"
            value={ped}
            unit=""
            normalMax={0.8}
            info="Family history proxy from PIMA"
          />
        </div>
      )}
    </div>
  );
}

/* ---------- Metrics (BMI + HbA1c) ---------- */

function MetricsTab() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const bmi =
    weight && height
      ? (Number(weight) / (Number(height) / 100) ** 2).toFixed(1)
      : "";

  const [glucose, setGlucose] = useState("");
  const a1c = glucose
    ? ((Number(glucose) + 46.7) / 28.7).toFixed(2)
    : "";

  const bmiBadge = () => {
    const v = Number(bmi);
    if (!isFinite(v)) return "";
    if (v < 18.5) return "Underweight";
    if (v < 25) return "Normal";
    if (v < 30) return "Overweight";
    return "Obese";
  };

  return (
    <div className="grid gap-6">
      <div className="bg-white rounded-2xl border shadow-sm p-5">
        <h4 className="font-semibold text-gray-800 mb-3">BMI Calculator</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            placeholder="Weight (kg)"
            className="border p-3 rounded-xl"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            inputMode="decimal"
          />
          <input
            placeholder="Height (cm)"
            className="border p-3 rounded-xl"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            inputMode="decimal"
          />
        </div>
        {bmi && (
          <div className="mt-3 text-sm">
            Your BMI:{" "}
            <span className="font-semibold">{bmi}</span>{" "}
            <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {bmiBadge()}
            </span>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">
          BMI is a screening tool, not a diagnosis.
        </p>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-5">
        <h4 className="font-semibold text-gray-800 mb-3">
          HbA1c Estimate from Fasting Glucose
        </h4>
        <input
          placeholder="Fasting Glucose (mg/dL)"
          className="border p-3 rounded-xl w-full"
          value={glucose}
          onChange={(e) => setGlucose(e.target.value)}
          inputMode="decimal"
        />
        {a1c && (
          <div className="mt-3 text-sm">
            Estimated HbA1c:{" "}
            <span className="font-semibold">{a1c}%</span>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Approximation for education only. Seek clinical testing for diagnosis.
        </p>
      </div>
    </div>
  );
}

/* ---------- Suggestions ---------- */

function SuggestionsTab({ latest }) {
  const g = Number(latest?.inputs?.glucose);
  const insulin = Number(latest?.inputs?.insulin);
  const skin = Number(latest?.inputs?.skin_thickness);
  const pedigree = Number(latest?.inputs?.pedigree);

  const highGlucose = isFinite(g) && g >= 100;
  const highInsulin = isFinite(insulin) && insulin > 25;
  const highSkin = isFinite(skin) && skin > 30;
  const highPedigree = isFinite(pedigree) && pedigree > 0.8;

  return (
    <div className="space-y-5 text-gray-800">
      <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
        <p className="font-semibold text-blue-800 mb-2">
          Personalized Insights
        </p>

        {highGlucose && (
          <p>
            • Your fasting glucose is above the 70–99 mg/dL range. Emphasize
            low-GI staples (millets, legumes, oats), 25–35 g fiber/day, and
            daily 30-minute brisk walks.
          </p>
        )}
        {highInsulin && (
          <p>
            • Fasting insulin suggests insulin resistance. Prefer resistance
            training 3×/week, limit added sugars, and prioritize sleep regularity.
          </p>
        )}
        {highSkin && (
          <p>
            • Skinfold indicates higher adiposity. Add two short HIIT sessions
            weekly and increase lean protein.
          </p>
        )}
        {highPedigree && (
          <p>
            • Family predisposition detected. Schedule annual fasting glucose
            and HbA1c screening and maintain a consistent activity routine.
          </p>
        )}
        {!highGlucose && !highInsulin && !highSkin && !highPedigree && (
          <p>
            • Your current readings are generally favorable. Maintain balanced
            meals, daily activity, and routine screenings.
          </p>
        )}
      </div>

      <div className="p-5 bg-white rounded-2xl border">
        <p className="font-semibold mb-2">Daily Practice Checklist</p>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>7k–10k steps and 150 minutes of moderate activity each week</li>
          <li>Plate method: 50% vegetables, 25% lean protein, 25% whole grains</li>
          <li>Hydration and consistent bed/wake times</li>
          <li>Mindfulness: 5–10 minutes/day</li>
        </ul>
      </div>

      <div className="p-5 bg-green-50 rounded-2xl border border-green-200 text-green-800">
        🧠 Mental-health supportive habits: morning sunlight, journaling,
        and 60 minutes screens-off before bed.
      </div>
    </div>
  );
}

/* ---------- History (visual) ---------- */

function LegendPill({ color, label }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className="inline-block w-3 h-3 rounded"
        style={{ backgroundColor: color }}
      />
      <span className="text-gray-600">{label}</span>
    </div>
  );
}

function HistoryTab({ latest, series }) {
  // Build a compact comparison grid row helper
  const cmpRow = (label, value, normal, colorClass, note) => (
    <div className={`flex items-center justify-between p-3 rounded-xl ${colorClass}`}>
      <div className="font-medium text-gray-700">{label}</div>
      <div className="text-sm">
        <span className="font-semibold">{value}</span>
        <span className="text-gray-500"> | Normal: {normal}</span>
        {note && <span className="ml-2 text-gray-500">{note}</span>}
      </div>
    </div>
  );

  const lg = Number(latest?.inputs?.glucose ?? NaN);
  const li = Number(latest?.inputs?.insulin ?? NaN);
  const ls = Number(latest?.inputs?.skin_thickness ?? NaN);
  const lp = Number(latest?.inputs?.pedigree ?? NaN);

  const glucoseState = normalizeStatus(lg, { warnAbove: 99, unit: "mg/dL" });
  const insulinState = normalizeStatus(li, { warnAbove: 25, unit: "µU/mL" });
  const skinState = normalizeStatus(ls, { warnAbove: 30, unit: "mm" });
  const pedigreeState = normalizeStatus(lp, { warnAbove: 0.8, unit: "" });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
      {/* Left: charts */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-800">
              Probability Trend (last {series.length} tests)
            </h4>
            <div className="flex gap-3">
              <LegendPill color="#3b82f6" label="Risk %" />
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ts" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar
                  dataKey="probability"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Lower is better. Large spikes may reflect unusually high glucose inputs.
          </p>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <div className="font-semibold text-gray-800 mb-2">
            Inputs Over Time (quick read)
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {series.slice(-8).map((r, i) => (
              <div
                key={r.ts + i}
                className="p-3 rounded-xl border bg-gray-50"
                title={`Glucose ${r.glucose} mg/dL, Insulin ${r.insulin}, Skinfold ${r.skinfold} mm, Pedigree ${r.pedigree}`}
              >
                <div className="font-medium text-gray-700">{r.ts}</div>
                <div className="mt-1 text-gray-600">
                  G:{r.glucose} | I:{r.insulin} | S:{r.skinfold} | P:{r.pedigree}
                </div>
              </div>
            ))}
            {series.length === 0 && (
              <div className="text-gray-500">No history available.</div>
            )}
          </div>
        </div>
      </div>

      {/* Right: comparisons */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 shadow-sm p-5">
          <div className="font-semibold text-gray-800 mb-2">
            Latest vs Normal Range
          </div>
          <div className="space-y-2">
            {cmpRow(
              "Glucose",
              isFinite(glucoseState.v) ? `${glucoseState.v} mg/dL` : "—",
              "70–99 mg/dL",
              `border ${glucoseState.badge}`,
              glucoseState.status === "high" ? "Consider recheck" : "Good"
            )}
            {cmpRow(
              "Insulin",
              isFinite(insulinState.v) ? `${insulinState.v} µU/mL` : "—",
              "≤ 25 µU/mL",
              `border ${insulinState.badge}`
            )}
            {cmpRow(
              "Skinfold",
              isFinite(skinState.v) ? `${skinState.v} mm` : "—",
              "≤ 30 mm",
              `border ${skinState.badge}`
            )}
            {cmpRow(
              "Pedigree",
              isFinite(pedigreeState.v) ? `${pedigreeState.v}` : "—",
              "≤ 0.8",
              `border ${pedigreeState.badge}`
            )}
          </div>

          <p className="text-[11px] text-gray-500 mt-3">
            Ranges are approximate screening thresholds for quick visualization, not clinical diagnosis.
          </p>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <div className="font-semibold text-gray-800 mb-2">Latest Record</div>
          {latest ? (
            <div className="text-sm text-gray-700 space-y-1">
              <div>
                Prediction:{" "}
                <span className="font-semibold">{latest.prediction}</span>
              </div>
              <div>
                Probability:{" "}
                <span className="font-semibold">
                  {Number(latest.probability || 0).toFixed(1)}%
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {latest.timestamp?.toDate?.()?.toLocaleString?.()}
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                <div>Glucose: {latest.inputs?.glucose}</div>
                <div>Insulin: {latest.inputs?.insulin}</div>
                <div>Skinfold: {latest.inputs?.skin_thickness}</div>
                <div>Pedigree: {latest.inputs?.pedigree}</div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">No latest record.</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Report (PDF export) ---------- */

function ReportTab({ history, onClose }) {
  const exportPDF = async () => {
    try {
      const [{ default: jsPDF }, html2canvas] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);

      const node = document.querySelector("#dv-report-root");
      if (!node) return;

      const canvas = await html2canvas.default(node, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();

      // Fit to width with margin
      const ratio = canvas.width / canvas.height;
      const pdfWidth = pageWidth - 40;
      const pdfHeight = pdfWidth / ratio;

      pdf.addImage(imgData, "PNG", 20, 20, pdfWidth, pdfHeight);
      pdf.save("AI-HealthMate-Report.pdf");
    } catch {
      // If libs missing:
      alert("To export, install: npm i jspdf html2canvas");
    }
  };

  return (
    <div className="space-y-4">
      <div
        id="dv-report-root"
        className="bg-white rounded-2xl border shadow-sm p-5"
      >
        <h4 className="font-semibold text-gray-800 mb-2">
          Health Report Preview
        </h4>
        <p className="text-xs text-gray-500 mb-3">
          Includes your recent diabetes tests with inputs and probabilities.
        </p>
        <div className="space-y-2 text-sm">
          {history?.slice(0, 6).map((r) => (
            <div key={r.id} className="border rounded-xl p-3 bg-gray-50">
              <div className="flex justify-between">
                <div className="font-medium">{r.prediction}</div>
                <div className="font-semibold">
                  {Number(r.probability || 0).toFixed(1)}%
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {r.timestamp?.toDate?.()?.toLocaleString?.()}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-xs">
                <div>Glucose: {r.inputs?.glucose}</div>
                <div>Insulin: {r.inputs?.insulin}</div>
                <div>Skinfold: {r.inputs?.skin_thickness}</div>
                <div>Pedigree: {r.inputs?.pedigree}</div>
              </div>
            </div>
          ))}
          {(!history || history.length === 0) && (
            <div className="text-gray-500">No records yet.</div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={exportPDF}
          className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Export PDF Report
        </button>
        <button
          onClick={onClose}
          className="px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* ---------- Streaks ---------- */

function StreaksTab({ streak }) {
  const level =
    streak >= 14 ? "Platinum" : streak >= 7 ? "Gold" : streak >= 3 ? "Silver" : "Bronze";

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold text-blue-700">Your Streak</h3>
      <p className="text-5xl font-extrabold mt-2">{streak}🔥</p>
      <p className="mt-2 text-gray-600 text-sm">
        Consecutive days with a diabetes check.
      </p>

      <div className="mt-4 inline-block px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold">
        Level: {level}
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Keep logging daily to level up and unlock badges.
      </p>
    </div>
  );
}
