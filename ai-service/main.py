import os
from fastapi import FastAPI, Depends, Header, HTTPException
from dotenv import load_dotenv
from routes import predict

load_dotenv()

app = FastAPI(title="Smart Home AI Service")

AI_KEY = os.getenv("AI_SERVICE_API_KEY", "YOUR_AI_KEY")

async def verify_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Bearer prefix")
    
    token = authorization.split(" ")[1]
    if token != AI_KEY:
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return token

app.include_router(predict.router, prefix="/api/v1", dependencies=[Depends(verify_token)])

@app.get("/")
def read_root(): return {"message": "AI Service is running", "env": os.getenv("NODE_ENV", "dev")}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
