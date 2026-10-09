from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any

from context_awarness.cleaning import clean_context_pipeline

app = FastAPI(title="Simply Backend - Context Awareness")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://simply-rouge.vercel.app",
        "https://www.youtube.com",
        "https://youtube.com",
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    allow_origin_regex=r"^(chrome-extension://.*|https://.*\.vercel\.app)$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PrivateNetworkMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["Access-Control-Allow-Private-Network"] = "true"
        return response


app.add_middleware(PrivateNetworkMiddleware)


class VideoContextPayload(BaseModel):
    videourl: str
    trackurl: Optional[str] = ""
    channel_name: Optional[str] = ""
    title: Optional[str] = ""
    description: Optional[str] = ""
    storyboard_spec: Optional[str] = ""
    rawtext: str


class LiveFramePayload(BaseModel):
    videourl: str
    timestamp: float
    image_data: str


@app.post("/api/captions")
@app.post("/api/context")
def receive_video_context(payload: VideoContextPayload) -> Dict[str, Any]:
    try:
        cleaned_context = clean_context_pipeline(payload.model_dump())
        return cleaned_context
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Context processing failed: {str(e)}")


@app.post("/api/frame-update")
def receive_frame_update(payload: LiveFramePayload) -> Dict[str, Any]:
    return {
        "status": "success",
        "videourl": payload.videourl,
        "timestamp": payload.timestamp
    }


@app.get("/health")
@app.get("/")
def health_check() -> Dict[str, str]:
    return {"status": "ok", "service": "simply-backend"}