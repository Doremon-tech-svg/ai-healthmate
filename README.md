# 🧠🩸 AI HealthMate

> **An AI-powered unified health platform that connects physical (diabetes) and mental well-being — because health is holistic, not isolated.**

AI HealthMate is a modern, user-friendly web application built for **preventive healthcare**, designed to showcase how **machine learning + mental health intelligence** can work together to deliver actionable wellness insights.

This project was developed as a **hackathon-ready, demo-focused product** with real-world relevance, strong UX, and scalable architecture.

---

## ✨ Key Highlights

* 🔬 **Diabetes Risk Prediction (ML-powered)**
* 🧠 **Mental Health Assessment & Monitoring**
* 📊 **Interactive Dashboards & Visual Analytics**
* 🤖 **AI Wellness Coach (Chatbot-ready)**
* 🔐 **Secure Firebase Authentication & Storage**
* 🎨 **Modern UI with Animations & Responsive Design**

---

## 🚩 Problem We Are Solving

Today’s healthcare apps focus on **single conditions**:

* Diabetes apps track glucose — but ignore stress.
* Mental health apps track mood — but ignore metabolic health.

👉 **Reality:** Mental stress, anxiety, sleep quality, and emotional health directly affect diabetes risk and disease progression.

### ❌ Current Gaps

* No platform correlates **mental health + diabetes**
* Lack of early-warning systems for combined risk
* Generic advice instead of personalized insights

---

## 💡 Our Solution

**AI HealthMate** bridges this gap by delivering a **holistic AI-driven wellness experience**:

✔ Predicts diabetes risk using a trained ML model
✔ Assesses mental health through a structured assessment model
✔ Tracks historical trends with charts and insights
✔ Correlates emotional well-being with physical health indicators
✔ Provides supportive, non-judgmental guidance

---

## 🧠 Mental Health Model (Pretrained Logic)

* Uses a **validated questionnaire-style assessment** (Likert scale)
* Extracts interpretable features such as:

  * Distress
  * Vitality
  * Social withdrawal
  * Self-perception
  * Anhedonia
* Applies a **logistic scoring function** (pretrained logic, no training needed)
* Outputs:

  * Human-readable concern level (Low / Moderate / High)
  * Feature breakdown for visualization

📌 *This is not diagnosis — it is early-risk screening and awareness.*

---

## 🩸 Diabetes Prediction Model

* Based on classical ML (Scikit-learn)
* Inputs include:

  * Glucose
  * Insulin
  * Skin thickness
  * Pedigree function
  * Pregnancies
* Outputs:

  * Risk probability
  * Interpretable result (Diabetic / Not Diabetic)

---

## 📊 Dashboards & Visual Insights

* Line charts for trend tracking
* Comparison against normal health ranges
* Historical records (last check-ins)
* Separate detailed modals for:

  * Diabetes insights
  * Mental health insights

Designed to be:

* Easy for **non-medical users**
* Informative for **clinicians & judges**

---

## 🧱 Tech Stack

### Frontend

* **React (Vite)**
* **Tailwind CSS** – UI & layout
* **Framer Motion** – animations
* **Recharts** – data visualization

### Backend

* **FastAPI (Python)** – ML inference APIs
* **Pretrained ML logic** (no runtime training)

### Database & Auth

* **Firebase Authentication**
* **Firestore** – health records & history

### AI / ML

* Scikit-learn (Diabetes)
* Custom pretrained mental health scoring model

---

## 📁 Folder Structure

```
ai-healthmate/
│
├── backend/                # FastAPI backend
│   ├── main.py
│   ├── mental_model.py
│   └── diabetes_model.pkl
│
├── src/
│   ├── components/
│   │   ├── DiabetesDetailModal.jsx
│   │   ├── MentalHealthDetailModal.jsx
│   │   ├── AIChatBot.jsx
│   │   └── InsightsCard.jsx
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── MentalHealth.jsx
│   │   └── Home.jsx
│   │
│   ├── firebase.js
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── package.json
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Doremon-tech-svg/ai-healthmate.git
cd ai-healthmate
```

### 2️⃣ Install Frontend Dependencies

```bash
npm install
```

### 3️⃣ Run Frontend

```bash
npm run dev
```

### 4️⃣ Run Backend (FastAPI)

```bash
cd backend
uvicorn main:app --reload
```

---

## 🚀 Features in Action (Demo Flow)

1. User logs in securely
2. Runs a diabetes prediction
3. Completes mental health assessment
4. Views unified dashboard with trends
5. Opens detailed insight modals
6. Explores holistic wellness summary

---

## 📈 Market Potential

* 🌍 537M+ people with diabetes worldwide
* 🧠 970M+ people affected by mental health issues
* 💰 Digital health market growing at **18%+ CAGR**

**AI HealthMate targets preventive care, early intervention, and personalized wellness — a massive untapped space.**

---

## 🔮 Future Scope

* Wearable integration (sleep, steps, CGM)
* Multilingual AI coach
* Clinical validation & hospital dashboards
* Nutrition & lifestyle planner

---

## ⚠️ Disclaimer

AI HealthMate is a **decision-support & awareness tool**, not a medical diagnostic system. Always consult healthcare professionals for medical advice.

---

## 👥 Team & Credits

Built with ❤️ for hackathons, demos, and the future of preventive healthcare.

---

## ⭐ If You Like This Project

Give it a ⭐ on GitHub and help promote AI-powered holistic healthcare!
