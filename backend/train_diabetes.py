# train_diabetes.py
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# Make sure models folder exists
os.makedirs("models", exist_ok=True)

# Data source: Pima Indians Diabetes dataset (public)
# We'll try a commonly available raw link; if blocked, paste dataset into backend/data/
CSV_URL = "https://raw.githubusercontent.com/plotly/datasets/master/diabetes.csv"

print("Loading dataset...")
df = pd.read_csv(CSV_URL)

# Check expected columns - this CSV has: Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age, Outcome
# We will use: Age, BMI, Glucose, Insulin, and a synthetic 'family_history' (not present) -> we'll ignore family_history for model input here
# Instead use a subset of features
FEATURES = ["Age", "BMI", "Glucose", "Insulin"]
TARGET = "Outcome"

X = df[FEATURES]
y = df[TARGET]

# quick train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

pipeline = Pipeline(
    [
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
        ("clf", LogisticRegression(max_iter=1000)),
    ]
)

print("Training model...")
pipeline.fit(X_train, y_train)

print("Evaluating model...")
pred = pipeline.predict(X_test)
print(classification_report(y_test, pred))

# Save model
model_path = "models/diabetes_model.pkl"
joblib.dump(pipeline, model_path)
print(f"Saved trained model to {model_path}")
