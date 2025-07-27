from flask import Flask, render_template, request, jsonify
import numpy as np
import pandas as pd
import pickle
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import SystemMessage, HumanMessage
from pymongo import MongoClient


from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    google_api_key=GEMINI_API_KEY,
)

# Load model
with open("heart_disease_model.pkl", "rb") as f:
    model = pickle.load(f)

# Encoders (same as training)
def encode_input(data):
    mappings = {
        'Sex': {'M': 1, 'F': 0},
        'ChestPainType': {'TA': 3, 'ATA': 0, 'NAP': 2, 'ASY': 1},
        'RestingECG': {'Normal': 1, 'ST': 2, 'LVH': 0},
        'ExerciseAngina': {'Y': 1, 'N': 0},
        'ST_Slope': {'Flat': 1, 'Up': 2, 'Down': 0}
    }

    for col in mappings:
        if col in data:
            value = data[col]
            if value in mappings[col]:
                data[col] = mappings[col][value]
            else:
                print(f"[Warning] Unknown value for {col}: '{value}' – defaulting to 0")
                data[col] = 0  # Fallback to default
    return data

@app.route('/api/gemini', methods=['POST'])
def gemini_summary():
    try:
        data = request.get_json()
        print("[DEBUG] Received JSON:", data)

        # Dynamically construct prompt from patient data
        patient_info = f"""
Patient Details:
- Age: {data.get('Age')}
- Sex: {data.get('Sex')}
- Chest Pain Type: {data.get('ChestPainType')}
- Cholesterol: {data.get('Cholesterol')}
- Resting BP: {data.get('RestingBP')}
- FastingBS: {data.get('FastingBS')}
- RestingECG: {data.get('RestingECG')}
- MaxHR: {data.get('MaxHR')}
- Exercise Angina: {data.get('ExerciseAngina')}
- Oldpeak: {data.get('Oldpeak')}
- ST Slope: {data.get('ST_Slope')}
"""

        prompt = f"""
You are a medical assistant helping doctors evaluate heart disease risk.
Given this patient's clinical data:

{patient_info}

Summarize the risk trends and suggest next steps in one short paragraph.
"""

        messages = [
            SystemMessage(content="You are a clinical insights assistant trained to analyze patient heart risk data."),
            HumanMessage(content=prompt)
        ]

        result = llm(messages)

        return jsonify({'summary': result.content}), 200

    except Exception as e:
        print("[ERROR]", str(e))
        return jsonify({'error': str(e)}), 500



# Web form route (optional)
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        input_data = {
            'Age': int(request.form['Age']),
            'Sex': request.form['Sex'],
            'ChestPainType': request.form['ChestPainType'],
            'RestingBP': int(request.form['RestingBP']),
            'Cholesterol': int(request.form['Cholesterol']),
            'FastingBS': int(request.form['FastingBS']),
            'RestingECG': request.form['RestingECG'],
            'MaxHR': int(request.form['MaxHR']),
            'ExerciseAngina': request.form['ExerciseAngina'],
            'Oldpeak': float(request.form['Oldpeak']),
            'ST_Slope': request.form['ST_Slope']
        }

        encoded = encode_input(input_data.copy())
        df = pd.DataFrame([encoded])
        prob = model.predict_proba(df)[0][1]
        percentage = round(prob * 100, 2)
        risk = "High Risk ⚠️" if prob > 0.5 else "Low Risk ✅"

        return render_template("index.html", result=True, risk=risk, percentage=percentage)

    return render_template("index.html", result=False)

# JSON API for frontend
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    print("[Received JSON]:", data)

    features = encode_input(data)
    if features is None:
        return jsonify({"error": "Invalid input"}), 400

    # Drop PatientID – it's not a model input
    if "PatientID" in features:
        del features["PatientID"]

    try:
        # Assumes model expects a DataFrame
        input_df = pd.DataFrame([features])
        proba = model.predict_proba(input_df)[0][1]  # probability of class 1 (has heart disease)
        risk_percent = round(proba * 100, 2)
        prediction = model.predict(input_df)[0]
        proba = model.predict_proba(input_df)[0][1]
        if proba >= 0.75:
            risk_level = "Extremely High Risk"
        elif proba >= 0.5:
            risk_level = "High Risk"
        elif proba >= 0.25:
            risk_level = "Moderate Risk"
        else:
            risk_level = "Low Risk"

        return jsonify({
            "percentage": round(proba * 100, 2),
            "risk": risk_level
        })

    except Exception as e:
        print("[Prediction Error]:", e)
        return jsonify({"error": "Prediction failed"}), 400



# Allow all IPs to connect
if __name__ == "__main__":
    app.run(use_reloader=False, host="0.0.0.0", port=5000, debug=True)
