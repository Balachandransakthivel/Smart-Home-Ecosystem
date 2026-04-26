import os
import shutil

base_dir = r"d:\projects\Mini Project\Smart_home"

files = {
    ".env": """EXPO_PUBLIC_API_URL=http://localhost:5000/api
EXPO_PUBLIC_FIREBASE_API_KEY=your_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain_here
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
EXPO_PUBLIC_AI_URL=http://localhost:8000""",

    "src/app/_layout.tsx": """import { Tabs } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';

export default function Layout() {
  return (
    <ThemeProvider>
      <Tabs screenOptions={{ headerShown: true }}>
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="tasks" options={{ title: 'Tasks' }} />
        <Tabs.Screen name="inventory" options={{ title: 'Inventory' }} />
        <Tabs.Screen name="maintenance" options={{ title: 'Maintenance' }} />
        <Tabs.Screen name="alerts" options={{ title: 'Alerts' }} />
        <Tabs.Screen name="household" options={{ title: 'Household' }} />
        <Tabs.Screen name="(auth)" options={{ href: null, headerShown: false }} />
      </Tabs>
    </ThemeProvider>
  );
}""",

    "src/app/(auth)/_layout.tsx": """import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}""",

    "src/config/firebase.ts": """import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;""",

    "src/services/api.ts": """import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import Constants from 'expo-constants';

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL && !process.env.EXPO_PUBLIC_API_URL.includes('localhost')) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  const hostUri = Constants?.expoConfig?.hostUri;
  if (hostUri) {
    const pcIpAddress = hostUri.split(':')[0];
    return `http://${pcIpAddress}:5000/api`;
  }
  return 'http://localhost:5000/api';
};

const api = axios.create({ baseURL: getBaseUrl() });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      await SecureStore.deleteItemAsync('token');
      router.replace('/(auth)/login');
    }
    return Promise.reject(err);
  }
);
export default api;""",

    "src/services/taskService.ts": """import api from './api';
export default {
  getTasks: () => api.get('/tasks'),
  createTask: (data: any) => api.post('/tasks', data),
  updateTask: (id: string, data: any) => api.put(`/tasks/${id}`, data),
  deleteTask: (id: string) => api.delete(`/tasks/${id}`)
};""",

    "src/services/cleaningService.ts": """import api from './api';
export default {
  getCleanings: () => api.get('/cleaning'),
  createCleaning: (data: any) => api.post('/cleaning', data),
  updateCleaning: (id: string, data: any) => api.put(`/cleaning/${id}`, data),
  deleteCleaning: (id: string) => api.delete(`/cleaning/${id}`)
};""",

    "src/services/inventoryService.ts": """import api from './api';
export default {
  getInventory: () => api.get('/inventory'),
  addInventory: (data: any) => api.post('/inventory', data),
  updateInventory: (id: string, data: any) => api.put(`/inventory/${id}`, data),
  deleteInventory: (id: string) => api.delete(`/inventory/${id}`)
};""",

    "src/services/expenseService.ts": """import api from './api';
export default {
  getExpenses: () => api.get('/expenses'),
  addExpense: (data: any) => api.post('/expenses', data),
  deleteExpense: (id: string) => api.delete(`/expenses/${id}`)
};""",

    "src/services/maintenanceService.ts": """import api from './api';
export default {
  getMaintenance: () => api.get('/maintenance'),
  addMaintenance: (data: any) => api.post('/maintenance', data),
  updateMaintenance: (id: string, data: any) => api.put(`/maintenance/${id}`, data),
  deleteMaintenance: (id: string) => api.delete(`/maintenance/${id}`)
};""",

    "src/services/alertService.ts": """import api from './api';
export default {
  getAlerts: () => api.get('/alerts'),
  markRead: (id: string) => api.put(`/alerts/${id}/read`),
  markAllRead: () => api.put('/alerts/read-all')
};""",

    "src/services/householdService.ts": """import api from './api';
export default {
  createHousehold: (name: string) => api.post('/household/create', { name }),
  joinHousehold: (inviteCode: string) => api.post('/household/join', { inviteCode }),
  getMembers: () => api.get('/household/members')
};""",

    "src/services/aiService.ts": """import axios from 'axios';
import Constants from 'expo-constants';

const getAiUrl = () => {
  if (process.env.EXPO_PUBLIC_AI_URL && !process.env.EXPO_PUBLIC_AI_URL.includes('localhost')) {
    return process.env.EXPO_PUBLIC_AI_URL;
  }
  const hostUri = Constants?.expoConfig?.hostUri;
  if (hostUri) {
    const pcIpAddress = hostUri.split(':')[0];
    return `http://${pcIpAddress}:8000/api/v1`;
  }
  return 'http://localhost:8000/api/v1';
};

const aiApi = axios.create({ baseURL: getAiUrl() });

export default {
  getSuggestions: (items: any) => aiApi.post('/suggest-tasks', { items }, { headers: { 'Authorization': 'Bearer YOUR_AI_KEY' } }),
  predictLowInventory: (items: any) => aiApi.post('/predict-inventory', { items }, { headers: { 'Authorization': 'Bearer YOUR_AI_KEY' } })
};""",

    "src/context/ThemeContext.tsx": """import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext({ isDark: false });
export const ThemeProvider = ({ children }: any) => {
  const scheme = useColorScheme();
  const [isDark, setIsDark] = useState(scheme === 'dark');
  useEffect(() => setIsDark(scheme === 'dark'), [scheme]);
  return <ThemeContext.Provider value={{ isDark }}>{children}</ThemeContext.Provider>;
};
export const useTheme = () => useContext(ThemeContext);""",

    "ai-service/main.py": """from fastapi import FastAPI, Depends, Header, HTTPException
from routes import predict

app = FastAPI(title="Smart Home AI Service")

async def verify_token(authorization: str = Header(...)):
    if authorization != "Bearer YOUR_AI_KEY":
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return authorization

app.include_router(predict.router, prefix="/api/v1", dependencies=[Depends(verify_token)])

@app.get("/")
def read_root(): return {"message": "AI Service is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)""",

    "ai-service/routes/predict.py": """from fastapi import APIRouter
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
    return {"at_risk": predictions}""",

    "ai-service/services/recommendation.py": """def get_high_spend_categories(usage_data: list) -> list:
    return ["Supplies"] if any([i for i in usage_data if i.get('unitCost', 0) > 50]) else []

def suggest_tasks(usage_data: list) -> list:
    suggestions = []
    low_items = [i for i in usage_data if i.get('quantity', 1) <= i.get('threshold', 1)]
    if low_items:
        suggestions.append(f"Restock {len(low_items)} low inventory items")
    high_expense_cats = get_high_spend_categories(usage_data)
    for cat in high_expense_cats:
        suggestions.append(f"Review spending in {cat} category")
    if not suggestions:
        suggestions.append("All items are well stocked")
    return suggestions

def predict_low_inventory(usage_data: list) -> list:
    at_risk = []
    for item in usage_data:
        qty = item.get('quantity', 0)
        threshold = item.get('threshold', 1)
        if qty <= threshold * 1.5:
            at_risk.append(item.get('itemName', 'Unknown item'))
    return at_risk if at_risk else ["No items at risk"]""",
    
    "scaffold.py": """import os
base_dir = os.path.dirname(os.path.abspath(__file__))
# the rest of the file..."""
}

# Write and deploy files safely
for p, content in files.items():
    full_path = os.path.join(base_dir, p)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding='utf-8') as f:
        f.write(content.strip() + "\\n")

frontend_dir = os.path.join(base_dir, "frontend")
if os.path.exists(frontend_dir):
    try:
        shutil.rmtree(frontend_dir)
        print("Deleted legacy frontend/ directory.")
    except Exception as e:
        print(f"Failed to delete frontend directory: {e}")

print(f"Successfully generated {len(files)} frontend/AI foundational files!")
