from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"]}})

# Load trained model
model = joblib.load("./machine_failure_model.pkl")

# Required feature columns
REQUIRED_FEATURES = ["Machine_ID", "Temperature", "Pressure", "Vibration", "Humidity", "Power_Consumption"]

@app.route("/")
def home():
    return "Machine Failure Prediction API is running"

@app.route("/health")
def health():
    return jsonify({"status": "healthy", "model_loaded": model is not None})

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    
    # Validate required fields
    missing_fields = [f for f in REQUIRED_FEATURES if f not in data]
    if missing_fields:
        return jsonify({"error": f"Missing required fields: {missing_fields}"}), 400

    # Extract features in correct order
    features = np.array([[
        data["Machine_ID"],
        data["Temperature"],
        data["Pressure"],
        data["Vibration"],
        data["Humidity"],
        data["Power_Consumption"]
    ]])

    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0][1]

    return jsonify({
        "prediction": int(prediction),
        "status": "FAILURE" if prediction == 1 else "WORKING",
        "failure_probability": round(float(probability), 3)
    })

@app.route("/predict/batch", methods=["POST"])
def predict_batch():
    """Handle batch predictions from CSV data"""
    data = request.json
    
    if not data or "records" not in data:
        return jsonify({"error": "No records provided"}), 400
    
    records = data["records"]
    results = []
    
    for i, record in enumerate(records):
        # Validate required fields
        missing_fields = [f for f in REQUIRED_FEATURES if f not in record]
        if missing_fields:
            results.append({
                "row": i + 1,
                "error": f"Missing fields: {missing_fields}"
            })
            continue
        
        try:
            features = np.array([[
                record["Machine_ID"],
                record["Temperature"],
                record["Pressure"],
                record["Vibration"],
                record["Humidity"],
                record["Power_Consumption"]
            ]])
            
            prediction = model.predict(features)[0]
            probability = model.predict_proba(features)[0][1]
            
            results.append({
                "row": i + 1,
                "Machine_ID": record.get("Machine_ID"),
                "prediction": int(prediction),
                "status": "FAILURE" if prediction == 1 else "WORKING",
                "failure_probability": round(float(probability), 3)
            })
        except Exception as e:
            results.append({
                "row": i + 1,
                "error": str(e)
            })
    
    # Summary statistics
    successful = [r for r in results if "error" not in r]
    failures_detected = sum(1 for r in successful if r["prediction"] == 1)
    
    return jsonify({
        "total_records": len(records),
        "successful_predictions": len(successful),
        "failures_detected": failures_detected,
        "working_machines": len(successful) - failures_detected,
        "results": results
    })

if __name__ == "__main__":
    app.run(debug=True)
