from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import xgboost as xgb
import numpy as np

app = FastAPI(title="ShipFlow ML Service", version="1.0.0")

class ETAPredictionRequest(BaseModel):
    distance_km: float
    traffic_index: float
    weather_condition: int
    vehicle_type: int
    historical_avg_speed: float

class RiskPredictionRequest(BaseModel):
    driver_rating: float
    vehicle_age: float
    weather_condition: int
    route_complexity: float

@app.get("/health")
def health_check():
    return {"status": "healthy", "version": "1.0.0"}

@app.post("/predict/eta")
def predict_eta(request: ETAPredictionRequest):
    # In a real scenario, we would load a pre-trained XGBoost model.
    # For now, we simulate the ETA prediction using a simple heuristic/dummy model calculation
    # to demonstrate the API structure and response.
    
    # Base time: distance / historical avg speed (converted to hours)
    base_time_hours = request.distance_km / max(request.historical_avg_speed, 10.0)
    
    # Adjust for traffic (traffic_index 0 to 1)
    traffic_multiplier = 1.0 + (request.traffic_index * 0.5)
    
    # Adjust for weather
    weather_multiplier = 1.0 + (request.weather_condition * 0.1)
    
    predicted_hours = base_time_hours * traffic_multiplier * weather_multiplier
    predicted_minutes = predicted_hours * 60
    
    return {
        "predicted_eta_minutes": round(predicted_minutes, 2),
        "confidence": 0.85,
        "model_version": "v1.0.eta"
    }

@app.post("/predict/risk")
def predict_risk(request: RiskPredictionRequest):
    # Simulate a risk prediction
    risk_score = 0.0
    
    if request.weather_condition > 2:
        risk_score += 0.3
    if request.driver_rating < 4.0:
        risk_score += 0.4
    if request.vehicle_age > 5:
        risk_score += 0.2
    
    risk_score += request.route_complexity * 0.1
    
    # Cap between 0 and 1
    risk_score = min(max(risk_score, 0.0), 1.0)
    
    risk_level = "LOW"
    if risk_score > 0.7:
        risk_level = "HIGH"
    elif risk_score > 0.4:
        risk_level = "MEDIUM"
        
    return {
        "risk_score": round(risk_score, 2),
        "risk_level": risk_level,
        "confidence": 0.90,
        "model_version": "v1.0.risk"
    }
