from pydantic import BaseModel


class ProspectSummary(BaseModel):
    id: str
    name: str | None = None
    email: str | None = None
    score: int = 0
    band: str = "cold"
    page_views: int = 0
    form_submits: int = 0
    repeat_visits: int = 0
    last_seen: str | None = None
    first_seen: str | None = None
    source: str | None = None
    device: str | None = None
    city: str | None = None
    child_name: str | None = None
    year_group: str | None = None


class TimelineEvent(BaseModel):
    event: str
    timestamp: str
    properties: dict = {}


class ProspectDetail(BaseModel):
    id: str
    name: str | None = None
    email: str | None = None
    score: int = 0
    band: str = "cold"
    page_views: int = 0
    form_submits: int = 0
    repeat_visits: int = 0
    last_seen: str | None = None
    first_seen: str | None = None
    source: str | None = None
    device: str | None = None
    city: str | None = None
    child_name: str | None = None
    year_group: str | None = None
    events: list[TimelineEvent] = []


class AnalyticsOverview(BaseModel):
    total_visitors: int = 0
    total_sessions: int = 0
    avg_session_duration: str = "0m 0s"
    enquiry_rate: float = 0.0


class TrafficSource(BaseModel):
    name: str
    value: int
    sessions: int


class HealthResponse(BaseModel):
    status: str = "ok"
    posthog_connected: bool = False
