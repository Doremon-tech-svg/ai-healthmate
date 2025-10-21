# AI HealthMate

**AI HealthMate** is a responsive web app designed for hackathons that integrates AI/ML concepts in healthcare. It provides two main modules: 

1. **Diabetes Predictor** – Predicts diabetes risk based on user input (age, BMI, glucose, insulin, family history).  
2. **Mental Health Companion** – Allows users to input their mood and receive AI-guided feedback.  

The frontend is built with **React**, **Tailwind CSS**, and **Framer Motion** for animations. A future feature includes a **chatbot** for user queries.

---

## Table of Contents

- [Project Overview](#project-overview)  
- [Technologies Used](#technologies-used)  
- [Folder Structure](#folder-structure)  
- [Setup Instructions](#setup-instructions)  
- [Code Explanation](#code-explanation)  
- [Next Steps](#next-steps)  
- [Deployment Instructions](#deployment-instructions)  
- [Credits](#credits)  
- [Notes for New Contributors](#notes-for-new-contributors)

---

## Project Overview

The project focuses on creating a modern, interactive web interface for AI health applications:

- **Home Page**: Hero section, module cards with hover effects, gradient backgrounds, and animations.  
- **Diabetes Predictor**: Form-based input for age, BMI, glucose, insulin, family history. Placeholder AI prediction logic implemented.  
- **Mental Health Companion**: Textarea input for user mood. Placeholder AI analysis logic implemented.  
- **Navigation**: Navbar with page switching, Footer, and optional Chatbot.  
- **Animations**: Page transitions using `Framer Motion`.  

---

## Technologies Used

- **React** – Frontend framework  
- **Tailwind CSS** – Utility-first CSS framework for styling  
- **Framer Motion** – Animations and smooth page transitions  
- **Node.js & npm** – Development environment  
- Optional: **Chatbot API** integration in the future

---

## Folder Structure

ai-healthmate/
├── public/
├── src/
│ ├── components/
│ │ ├── Navbar.jsx
│ │ ├── Footer.jsx
│ │ ├── Home.jsx
│ │ ├── DiabetesPredictor.jsx
│ │ ├── MentalHealth.jsx
│ │ └── Chatbot.jsx
│ ├── App.jsx
│ ├── index.css
│ └── main.jsx
├── package.json
├── tailwind.config.js
└── README.md

---

## Setup Instructions

1. **Clone the repository**  

`'bash
git clone https://github.com/your-username/ai-healthmate.git
cd ai-healthmate

2. Install dependencies

npm install


3. Run the project locally

npm run dev


4. Build for production

npm run build

Code Explanation
1. App.jsx

Manages page navigation using React useState.

Wraps all pages in AnimatePresence for smooth transitions.

Renders Navbar, Footer, and optional Chatbot.

2. Navbar.jsx

Contains buttons for switching between Home, Diabetes Predictor, and Mental Health pages.

Calls setPage on click.

3. Footer.jsx

Static footer with credits.

4. Home.jsx

Hero section with gradient background, animated floating shapes, heading, description, and CTA button.

Module cards for Diabetes and Mental Health modules with hover effects and icons.

5. DiabetesPredictor.jsx

Form to input user health parameters.

Placeholder AI prediction logic (setResult("High Risk")).

Back button (needs setPage prop) to navigate to Home.

6. MentalHealth.jsx

Textarea for user mood input.

Placeholder AI analysis logic (setResponse(...)).

Back button (needs setPage prop) to navigate to Home.

7. Chatbot.jsx (optional)

Floating chatbot for AI-powered user queries.

8. Tailwind CSS

Styling for gradients, shadows, hover effects, and responsive layouts.

9. Framer Motion

Used for animations in page transitions and hover effects.

Next Steps / Improvements

Integrate actual AI models

Diabetes: train ML model (e.g., scikit-learn) and connect via API.

Mental Health: use NLP model or pre-trained sentiment analyzer.

Improve UX/UI

Add Back buttons to all modules.

Enhance Home page animations, hover glows, and floating shapes.

Chatbot Integration

Connect to free AI APIs or OpenAI for interactive queries.

Deployment

Use Vercel or Netlify for free hosting.










Notes for New Contributors

Make sure to install dependencies before running.

Pass setPage as a prop to modules to enable back navigation.

Placeholder results should be replaced with actual AI predictions.

Use Framer Motion for animations; Tailwind handles styling.

Test responsiveness on mobile and desktop.







## Component & Page Flow Diagram

App.jsx
│
├─ Navbar.jsx (page navigation)
│
├─ Main Content (dynamic)
│ ├─ Home.jsx
│ │ ├─ Hero Section (Heading + Description + CTA)
│ │ └─ Module Cards
│ │ ├─ Diabetes Predictor Card (onClick → setPage("diabetes"))
│ │ └─ Mental Health Card (onClick → setPage("mental"))
│ │
│ ├─ DiabetesPredictor.jsx
│ │ ├─ Form Inputs (age, BMI, glucose, insulin, family_history)
│ │ ├─ Predict Button (placeholder result)
│ │ └─ (Future: Back button to Home)
│ │
│ └─ MentalHealth.jsx
│ ├─ Textarea Input
│ ├─ Analyze Button (placeholder response)
│ └─ (Future: Back button to Home)
│
├─ Chatbot.jsx (optional floating AI chatbot)
│
└─ Footer.jsx (static)


---

### **Explanation of Flow**

1. **App.jsx**  
   - The root component. Manages `page` state.  
   - Wraps dynamic content with `AnimatePresence` for smooth transitions.

2. **Navbar.jsx**  
   - Top navigation bar.  
   - Calls `setPage` to switch between pages (`home`, `diabetes`, `mental`).

3. **Home.jsx**  
   - Default landing page.  
   - Hero section + Module cards.  
   - Clicking on cards navigates to corresponding modules.

4. **DiabetesPredictor.jsx**  
   - Shows input form for user health metrics.  
   - Button triggers placeholder prediction logic.

5. **MentalHealth.jsx**  
   - Textarea for mood input.  
   - Button triggers placeholder AI analysis.

6. **Chatbot.jsx** *(optional)*  
   - Floating chatbot for user queries.  
   - Can be connected to OpenAI API later.

7. **Footer.jsx**  
   - Static footer for credits and information.

---

### **How a Beginner Should Work With This Structure**

- **Adding New Features**: Add new components in `src/components/`.  
- **Navigation**: Use `setPage("module_name")` to navigate.  
- **Styling**: Tailwind CSS classes handle layout and design.  
- **Animations**: Framer Motion is used for page transitions; wrap new pages with `<Motion.div>` inside `<AnimatePresence>`.  
- **AI/ML Integration**: Replace placeholder logic in `DiabetesPredictor.jsx` and `MentalHealth.jsx` with real API calls or ML models.  

