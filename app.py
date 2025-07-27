from flask import Flask, render_template, request, jsonify
import numpy as np
import pandas as pd
import pickle
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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
    app.run(host="0.0.0.0", port=5000, debug=True)
