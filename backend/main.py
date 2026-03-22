from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from config import get_settings
from models import HealthResponse
import posthog_client

app = FastAPI(title="EnrollIQ API", version="0.1.0")

# Serve test school pages from /public so other devices can access them on port 8000
PUBLIC_DIR = Path(__file__).resolve().parent.parent / "public"

settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health() -> HealthResponse:
    connected = await posthog_client.check_connection()
    return HealthResponse(status="ok", posthog_connected=connected)


@app.get("/api/prospects")
async def list_prospects():
    return await posthog_client.get_prospects()


@app.get("/api/prospects/{person_id}")
async def get_prospect(person_id: str):
    detail = await posthog_client.get_prospect_detail(person_id)
    if detail is None:
        raise HTTPException(status_code=404, detail="Prospect not found")
    return detail


@app.get("/api/analytics/overview")
async def analytics_overview():
    return await posthog_client.get_analytics_overview()


@app.get("/api/analytics/sources")
async def analytics_sources():
    return await posthog_client.get_traffic_sources()


@app.get("/api/activity")
async def activity_feed():
    return await posthog_client.get_recent_activity()


# Mount static test pages last (so /api routes take priority)
app.mount("/", StaticFiles(directory=PUBLIC_DIR, html=True), name="public")
