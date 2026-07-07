from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, create_model
import pandas as pd
import numpy as np
import pickle
import json
import io
import os

app = FastAPI(title="Steel Plate Faults Predictor")

# Ensure static directory exists
os.makedirs("static", exist_ok=True)

# Load serialized model and label encoder
try:
    with open("model.pkl", "rb") as f:
        model = pickle.load(f)
    with open("label_encoder.pkl", "rb") as f:
        label_encoder = pickle.load(f)
    with open("metrics.json", "r") as f:
        metrics_data = json.load(f)
except Exception as e:
    print(f"Error loading model artifacts: {e}")
    model = None
    label_encoder = None
    metrics_data = {}

# Define Pydantic request model dynamically based on features
feature_names = metrics_data.get("feature_names", [
    "X_Minimum", "X_Maximum", "Y_Minimum", "Y_Maximum", "Pixels_Areas",
    "X_Perimeter", "Y_Perimeter", "Sum_of_Luminosity", "Minimum_of_Luminosity",
    "Maximum_of_Luminosity", "Length_of_Conveyer", "TypeOfSteel_A300",
    "TypeOfSteel_A400", "Steel_Plate_Thickness", "Edges_Index", "Empty_Index",
    "Square_Index", "Outside_X_Index", "Edges_X_Index", "Edges_Y_Index",
    "Outside_Global_Index", "LogOfAreas", "Log_X_Index", "Log_Y_Index",
    "Orientation_Index", "Luminosity_Index", "SigmoidOfAreas"
])

# Create dynamic Pydantic model for single prediction validation
field_definitions = {name: (float, ...) for name in feature_names}
PredictRequest = create_model("PredictRequest", **field_definitions)

@app.get("/")
def read_root():
    if os.path.exists("static/index.html"):
        return FileResponse("static/index.html")
    return HTMLResponse("<h3>Dashboard UI not found in static/index.html. Please build the frontend first.</h3>")

@app.get("/api/metrics")
def get_metrics():
    if not metrics_data:
        raise HTTPException(status_code=500, detail="Metrics data not loaded.")
    return metrics_data

@app.post("/api/predict")
def predict_single(data: PredictRequest):
    if model is None or label_encoder is None:
        raise HTTPException(status_code=500, detail="Model or label encoder is not loaded.")
    
    # Convert input data to DataFrame to match expected input formatting
    input_dict = data.dict()
    df_input = pd.DataFrame([input_dict])
    
    try:
        # Predict encoded class
        pred_encoded = model.predict(df_input)[0]
        # Predict class probabilities
        pred_proba = model.predict_proba(df_input)[0]
        
        # Decode prediction label
        pred_label = label_encoder.inverse_transform([pred_encoded])[0]
        
        # Map probabilities to classes
        probabilities = {
            cls: float(prob)
            for cls, prob in zip(label_encoder.classes_, pred_proba)
        }
        
        return {
            "prediction": pred_label,
            "probabilities": probabilities
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

@app.post("/api/predict-batch")
async def predict_batch(file: UploadFile = File(...)):
    if model is None or label_encoder is None:
        raise HTTPException(status_code=500, detail="Model or label encoder is not loaded.")
    
    # Read the uploaded file
    try:
        contents = await file.read()
        df_batch = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV file: {str(e)}")
    
    # Keep track of label column if present in the upload
    target_col = None
    if "Target_Label" in df_batch.columns:
        target_col = "Target_Label"
    elif "Fault" in df_batch.columns:
        target_col = "Fault"
    
    # Map columns to match expected feature names ignoring case
    col_map = {c.lower(): c for c in df_batch.columns}
    rename_map = {col_map.get(f.lower(), f): f for f in feature_names}
    df_batch = df_batch.rename(columns=rename_map)

    # Filter features based on model feature names
    missing_cols = [col for col in feature_names if col not in df_batch.columns]
    if missing_cols:
        raise HTTPException(
            status_code=400,
            detail=f"Uploaded CSV is missing required feature columns: {', '.join(missing_cols)}"
        )
    
    # Select feature columns in the exact order model expects
    X_batch = df_batch[feature_names]
    
    try:
        preds_encoded = model.predict(X_batch)
        preds_proba = model.predict_proba(X_batch)
        preds_labels = label_encoder.inverse_transform(preds_encoded)
        
        results = []
        for i in range(len(df_batch)):
            row_dict = df_batch.iloc[i].to_dict()
            pred_lbl = preds_labels[i]
            
            # Map probabilities for the row
            probs = {
                cls: float(prob)
                for cls, prob in zip(label_encoder.classes_, preds_proba[i])
            }
            
            # Keep original label if present for comparison
            actual_label = row_dict.get(target_col) if target_col else None
            
            original_row = {}
            for key, value in row_dict.items():
                if isinstance(value, (np.integer, np.floating)):
                    original_row[key] = value.item()
                else:
                    original_row[key] = value
            
            results.append({
                "index": i,
                "prediction": pred_lbl,
                "confidence": float(np.max(preds_proba[i])),
                "probabilities": probs,
                "actual": str(actual_label) if actual_label is not None else None,
                "features": {col: float(row_dict[col]) for col in feature_names},
                "original_row": original_row
            })
            
        return {
            "predictions": results,
            "total_records": len(results)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Batch prediction failed: {str(e)}")

# Mount static files (optional fallback, FastAPI serves root explicitly above)
app.mount("/static", StaticFiles(directory="static"), name="static")
