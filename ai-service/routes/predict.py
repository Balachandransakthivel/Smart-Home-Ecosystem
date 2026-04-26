from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from services.recommendation import suggest_tasks, predict_low_inventory

router = APIRouter()

class ItemList(BaseModel):
    items: List[dict]

@router.post("/suggest-tasks")
def route_suggest_tasks(data: ItemList):
    suggestions = suggest_tasks(data.items)
    return {"suggestions": suggestions}

@router.post("/predict-inventory")
def route_predict_inventory(data: ItemList):
    predictions = predict_low_inventory(data.items)
    return {"at_risk": predictions}

class DeviceData(BaseModel):
    usage_history: List[float]
    room_occupancy: bool = True

@router.post("/recommend")
def get_recommendations(data: DeviceData):
    # Dummy ML recommendation based on logic
    # Real implementation would use TF model predicting over data.usage_history
    if not data.room_occupancy and sum(data.usage_history) > 10:
        return {"suggestion": "Turn off devices in empty rooms to save energy.", "predictedSavings": 15.5}
    return {"suggestion": "Energy consumption is optimal.", "predictedSavings": 0.0}
