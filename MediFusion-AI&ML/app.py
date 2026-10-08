import os
import json
import joblib
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify

app = Flask(__name__)

# Medical Disclaimer Constant
MEDICAL_DISCLAIMER = (
    "MediFusion AI assessment is for clinical decision-support and educational purposes only. "
    "This output does not constitute a formal diagnosis or treatment prescription. "
    "Always consult a licensed medical professional for personal clinical advice."
)

# Load Models & Metadata ONCE at startup
print("==================================================")
print("Loading MediFusion Unified Multi-Model AI Engine...")

try:
    general_model = joblib.load("model/disease_model.pkl")
    label_encoder = joblib.load("model/label_encoder.pkl")
    df_general = pd.read_csv("dataset/Training_Clean.csv")
    symptom_columns = df_general.drop("prognosis", axis=1).columns.tolist()
    print("General Disease Model V2 Loaded Successfully.")
except Exception as e:
    print("Warning: Could not load General Model V2:", e)
    general_model, label_encoder, symptom_columns = None, None, []

try:
    diabetes_pipeline = joblib.load("model/diabetes_model.pkl")
    print("Diabetes Risk Model Loaded Successfully.")
except Exception as e:
    print("Warning: Could not load Diabetes Model:", e)
    diabetes_pipeline = None

try:
    heart_pipeline = joblib.load("model/heart_model.pkl")
    print("Heart Disease Risk Model Loaded Successfully.")
except Exception as e:
    print("Warning: Could not load Heart Model:", e)
    heart_pipeline = None

print("==================================================")

# Symptom Alias Mapping
symptom_mapping = {
    "Fever": "high_fever",
    "High Fever": "high_fever",
    "Cough": "cough",
    "Cold": "continuous_sneezing",
    "Runny Nose": "continuous_sneezing",
    "Sneezing": "continuous_sneezing",
    "Headache": "headache",
    "Fatigue": "fatigue",
    "Vomiting": "vomiting",
    "Nausea": "nausea",
    "Chest Pain": "chest_pain",
    "Shortness of Breath": "breathlessness",
    "Breathlessness": "breathlessness",
    "Dizziness": "dizziness",
    "Joint Pain": "joint_pain",
    "Back Pain": "back_pain",
    "Neck Pain": "neck_pain",
    "Muscle Pain": "muscle_pain",
    "Body Pain": "muscle_pain",
    "Abdominal Pain": "abdominal_pain",
    "Stomach Pain": "stomach_pain",
    "Diarrhea": "diarrhoea",
    "Constipation": "constipation",
    "Weight Loss": "weight_loss",
    "Weight Gain": "weight_gain",
    "Loss of Appetite": "loss_of_appetite",
    "Frequent Urination": "polyuria",
    "Blurred Vision": "blurred_and_distorted_vision",
    "Skin Rash": "skin_rash",
    "Itching": "itching",
    "Sore Throat": "patches_in_throat",
    "Chills": "chills",
    "Sweating": "sweating",
    "Restlessness": "restlessness",
    "Weakness": "weakness_in_limbs"
}

@app.route("/")
def home():
    return jsonify({
        "status": "online",
        "service": "MediFusion Multi-Model AI Inference Engine",
        "version": "2.0.0",
        "loadedModels": {
            "generalDisease": general_model is not None,
            "diabetesRisk": diabetes_pipeline is not None,
            "heartRisk": heart_pipeline is not None
        }
    })

# ==========================================
# 1. General Disease Prediction Route V2
# ==========================================
@app.route("/api/ml/general-disease/predict", methods=["POST"])
@app.route("/predict", methods=["POST"])
def predict_general_disease():
    if not general_model:
        return jsonify({"error": "General Disease Model is not loaded"}), 500

    data = request.get_json() or {}
    symptoms = data.get("symptoms", [])

    if not isinstance(symptoms, list) or len(symptoms) == 0:
        return jsonify({
            "error": "Input validation failed: At least one physical symptom is required.",
            "received": symptoms
        }), 400

    input_vector = [0] * len(symptom_columns)
    matched_symptoms = []

    for s in symptoms:
        clean_s = s.strip()
        ds = symptom_mapping.get(clean_s)
        if ds is None:
            ds = clean_s.lower().replace(" ", "_")

        if ds in symptom_columns:
            idx = symptom_columns.index(ds)
            input_vector[idx] = 1
            matched_symptoms.append(clean_s)

    if len(matched_symptoms) == 0:
        return jsonify({
            "error": "No valid symptoms matched the trained clinical dataset.",
            "received": symptoms
        }), 400

    input_df = pd.DataFrame([input_vector], columns=symptom_columns)

    # Predict Probabilities across classes
    probabilities = general_model.predict_proba(input_df)[0]
    top3_indices = np.argsort(probabilities)[::-1][:3]

    top3_predictions = []
    for idx in top3_indices:
        disease_name = label_encoder.inverse_transform([idx])[0]
        prob_pct = round(float(probabilities[idx] * 100), 2)
        top3_predictions.append({
            "disease": disease_name,
            "probability": prob_pct
        })

    top_pred = top3_predictions[0]
    predicted_disease = top_pred["disease"]
    confidence = top_pred["probability"]

    # Compute Feature Importance Attribution (SHAP-style explainability)
    importances = general_model.feature_importances_
    matched_importances = []
    for s in symptoms:
        ds = symptom_mapping.get(s.strip()) or s.strip().lower().replace(" ", "_")
        if ds in symptom_columns:
            idx = symptom_columns.index(ds)
            matched_importances.append({
                "symptom": s,
                "importance": round(float(importances[idx]), 4)
            })

    matched_importances = sorted(matched_importances, key=lambda x: x["importance"], reverse=True)

    return jsonify({
        "model": "General Disease Model V2",
        "version": "2.0.0",
        "predictedDisease": predicted_disease,
        "confidence": confidence,
        "top3Predictions": top3_predictions,
        "importantSymptoms": matched_importances,
        "disclaimer": MEDICAL_DISCLAIMER
    })

# ==========================================
# 2. Diabetes Risk Prediction Route
# ==========================================
@app.route("/api/ml/diabetes/predict", methods=["POST"])
def predict_diabetes():
    if not diabetes_pipeline:
        return jsonify({"error": "Diabetes Model is not loaded"}), 500

    data = request.get_json() or {}

    try:
        input_data = pd.DataFrame([{
            "pregnancies": float(data.get("pregnancies", 0)),
            "glucose": float(data.get("glucose", 100)),
            "blood_pressure": float(data.get("blood_pressure", 70)),
            "skin_thickness": float(data.get("skin_thickness", 20)),
            "insulin": float(data.get("insulin", 80)),
            "bmi": float(data.get("bmi", 25.0)),
            "diabetes_pedigree": float(data.get("diabetes_pedigree", 0.5)),
            "age": float(data.get("age", 30))
        }])
    except ValueError as ve:
        return jsonify({"error": "Invalid numerical parameters for diabetes assessment.", "details": str(ve)}), 400

    proba = float(diabetes_pipeline.predict_proba(input_data)[0][1] * 100)
    risk_level = "High" if proba >= 60 else "Moderate" if proba >= 35 else "Low"

    rf_model = diabetes_pipeline.named_steps['classifier']
    importances = rf_model.feature_importances_
    features = input_data.columns.tolist()
    feature_ranking = sorted([
        {"feature": features[i], "importance": round(float(importances[i]), 4)}
        for i in range(len(features))
    ], key=lambda x: x["importance"], reverse=True)

    return jsonify({
        "model": "Diabetes Risk Model",
        "version": "1.0.0",
        "riskAssessment": "High Risk of Diabetes" if proba >= 50 else "Low Risk of Diabetes",
        "probability": round(proba, 2),
        "riskLevel": risk_level,
        "importantFeatures": feature_ranking,
        "disclaimer": MEDICAL_DISCLAIMER
    })

# ==========================================
# 3. Heart Disease Risk Prediction Route
# ==========================================
@app.route("/api/ml/heart/predict", methods=["POST"])
def predict_heart():
    if not heart_pipeline:
        return jsonify({"error": "Heart Risk Model is not loaded"}), 500

    data = request.get_json() or {}

    try:
        input_data = pd.DataFrame([{
            "age": float(data.get("age", 50)),
            "sex": float(data.get("sex", 1)),
            "cp": float(data.get("cp", 0)),
            "trestbps": float(data.get("trestbps", 120)),
            "chol": float(data.get("chol", 200)),
            "fbs": float(data.get("fbs", 0)),
            "restecg": float(data.get("restecg", 0)),
            "thalach": float(data.get("thalach", 150)),
            "exang": float(data.get("exang", 0)),
            "oldpeak": float(data.get("oldpeak", 0.0)),
            "slope": float(data.get("slope", 1)),
            "ca": float(data.get("ca", 0)),
            "thal": float(data.get("thal", 2))
        }])
    except ValueError as ve:
        return jsonify({"error": "Invalid numerical parameters for heart assessment.", "details": str(ve)}), 400

    proba = float(heart_pipeline.predict_proba(input_data)[0][1] * 100)
    risk_level = "High" if proba >= 60 else "Moderate" if proba >= 35 else "Low"

    gb_model = heart_pipeline.named_steps['classifier']
    importances = gb_model.feature_importances_
    features = input_data.columns.tolist()
    feature_ranking = sorted([
        {"feature": features[i], "importance": round(float(importances[i]), 4)}
        for i in range(len(features))
    ], key=lambda x: x["importance"], reverse=True)

    return jsonify({
        "model": "Heart Disease Risk Model",
        "version": "1.0.0",
        "riskAssessment": "High Risk of Cardiovascular Condition" if proba >= 50 else "Low Risk of Cardiovascular Condition",
        "probability": round(proba, 2),
        "riskLevel": risk_level,
        "importantFeatures": feature_ranking,
        "disclaimer": MEDICAL_DISCLAIMER
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)