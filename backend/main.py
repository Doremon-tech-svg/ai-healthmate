# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
import os

app = FastAPI(title="AI HealthMate Backend")

# Allow CORS from localhost and your frontend host
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],  # add your frontend URL(s)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load diabetes model (trained earlier)
MODEL_PATH = os.path.join("models", "diabetes_model.pkl")
if os.path.exists(MODEL_PATH):
    diabetes_model = joblib.load(MODEL_PATH)
    print("Loaded diabetes model.")
else:
    diabetes_model = None
    print("Warning: diabetes model not found. Please run train_diabetes.py to create models/diabetes_model.pkl")

# Pydantic schemas
class DiabetesInput(BaseModel):
    age: float
    bmi: float
    glucose: float
    insulin: float
    # family_history optional - we do not use it in our current model but accept it for frontend compatibility
    family_history: int | None = 0

class MentalHealthInput(BaseModel):
    mood: str
    moodTrigger: str | None = None
    sleep: str | None = None
    energy: str | None = None
    worry: str | None = None
    joy: str | None = None
    social: str | None = None
    selfcare: list[str] | None = []
    focus: str | None = None
    body: str | None = None
    outlook: str | None = None
    journal: str | None = None

@app.get("/")
def root():
    return {"message": "AI HealthMate backend is running."}

@app.post("/predict-diabetes")
def predict_diabetes(payload: DiabetesInput):
    if diabetes_model is None:
        return {"error": "Model not loaded. Train model first."}

    # prepare features in same order used for training: Age, BMI, Glucose, Insulin
    X = np.array([[payload.age, payload.bmi, payload.glucose, payload.insulin]], dtype=float)
    pred_proba = diabetes_model.predict_proba(X)[0, 1]  # probability of positive class
    pred_label = int(pred_proba >= 0.5)
    risk_text = "High Risk" if pred_label == 1 else "Low Risk"
    return {
        "prediction": risk_text,
        "probability": float(pred_proba)
    }

@app.post("/analyze-mental-health")
def analyze_mental(payload: MentalHealthInput):
    # Simple heuristic scoring — replace with ML/NLP later
    score = 0
    # mood mapping
    mood_map = {"good": 2, "okay": 1, "meh": 0, "bad": -2}
    score += mood_map.get(payload.mood, 0)

    energy_map = {"high": 2, "normal": 1, "low": -1, "drained": -2}
    score += energy_map.get(payload.energy, 0)

    worry_map = {"none": 1, "some": 0, "lot": -1, "constant": -2}
    score += worry_map.get(payload.worry, 0)

    sleep_map = {"rested": 1, "okay": 0, "restless": -1, "bad": -2}
    score += sleep_map.get(payload.sleep, 0)

    # selfcare boosts
    if payload.selfcare:
        score += min(len(payload.selfcare), 3)  # max +3

    # basic journaling heuristic
    if payload.journal and len(payload.journal) > 30:
        score += 1

    # Compose message
    if score <= -2:
        message = (
            "It sounds like you're going through a tough time. "
            "Consider reaching out to someone you trust, and if you're comfortable, consider seeking professional support. "
            "If you're in immediate danger or crisis, please contact local emergency services."
        )
    elif -2 < score <= 1:
        message = (
            "You might be feeling off today. Small self-care steps (hydration, a short walk, a breathing exercise) could help. "
            "If this continues, check in with a friend or a professional."
        )
    else:
        message = (
            "You're doing okay from this check-in. Keep practicing the self-care that supports you, "
            "and consider maintaining a brief daily reflection to track trends."
        )

    # return a compact summary too
    summary = {
        "score": int(score),
        "mood": payload.mood,
        "selfcare_count": len(payload.selfcare or []),
    }

    return {"message": message, "summary": summary}
