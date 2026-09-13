# Shorecast  — Agentic AI Coastal Safety Platform

> A production-grade, multi-agent AI platform for real-time coastal safety, marine intelligence, and travel planning. 100% free-tier infrastructure.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router) + Tailwind CSS + MapLibre GL JS |
| Backend | FastAPI (Python 3.12, async) |
| AI Agents | LangGraph + Groq Cloud (Llama 3.3) |
| Database | PostgreSQL 16 + PostGIS + pgvector |
| Cache | Redis 7 |
| Marine Data | Open-Meteo (free, no key needed) |
| Safety Alerts | INCOIS API |
| POI / Places | OpenStreetMap Overpass API |

## Quick Start

### Prerequisites
- Docker Desktop
- Node.js 20+
- Python 3.12+
- (Optional) Free Groq API key from https://console.groq.com

### 1. Start Infrastructure
```bash
docker-compose up -d
```
This starts Postgres+PostGIS+pgvector on :5432 and Redis on :6379.
The SQL migration runs automatically on first boot, seeding 10 Indian beaches.

### 2. Start FastAPI Backend
```bash
cd apps/api
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt

# Copy env and optionally add Groq key
copy .env.example .env   # Windows
# cp .env.example .env   # macOS/Linux

uvicorn main:app --reload --port 8000
```
Backend: http://localhost:8000
API Docs: http://localhost:8000/docs

### 3. Start Next.js Frontend
```bash
cd apps/web
npm install
npm run dev
```
Frontend: http://localhost:3000

## Features

###  Geospatial Dashboard
- MapLibre GL JS with OpenMapTiles (free, no billing)
- Color-coded beach suitability nodes (blue/orange gradient — colorblind friendly)
- Real-time suitability scores overlaid on map
- Click any beach for live telemetry panel

###  Multi-Agent AI
- **Planner Agent**: Parses natural language → queries Open-Meteo + OSM → builds itineraries
- **Sentinel Agent**: Background loop monitoring all beaches for wave anomalies → triggers alerts
- Tool streaming: watch the agent's thought process in real-time

###  Voice Input
- Native Web Speech API (free, no external service)
- Speak: "Is Marina Beach safe tomorrow?" → agent responds with full analysis

###  Session Governance
- JWT auth with Redis-backed session tracking
- Anomalous location detection (>500km shift → force logout)
- Redis pub/sub for real-time alert broadcasting

###  Suitability Engine
Multi-variable weighted score (0-100):
- Wave height (35% weight) — Open-Meteo Marine API
- Tide level (25% weight) — Open-Meteo Marine API
- UV index (20% weight) — Open-Meteo Weather API
- INCOIS alert severity (20% weight) — INCOIS API

## API Endpoints

```
GET  /                        # API info
GET  /docs                    # Interactive Swagger UI
GET  /api/beaches             # List all beaches with suitability scores
GET  /api/beaches/{id}        # Beach detail with live marine data
GET  /api/marine?lat=&lon=    # Live marine + weather data for any coordinates
GET  /api/pois?lat=&lon=      # Nearby hotels, restaurants, attractions
POST /api/chat                # Non-streaming AI agent response
POST /api/chat/stream         # SSE streaming AI agent response
POST /api/auth/login          # JWT auth + session creation
POST /api/auth/location-update # Sentinel location anomaly check
GET  /health                  # Health check
```

## Architecture

```
[Browser] ──SSE──► [Next.js :3000] ──HTTP──► [FastAPI :8000]
                                                    │
                                         [LangGraph Orchestrator]
                                         ├── Planner Agent ──► Open-Meteo / OSM
                                         └── Sentinel Agent ──► INCOIS / Open-Meteo
                                                    │
                                         [PostgreSQL+PostGIS :5432]
                                         [Redis :6379]
```

## Environment Variables

Copy `.env.example` to `.env` in `apps/api/` and `apps/web/`.

| Variable | Default | Required |
|---|---|---|
| DATABASE_URL | postgresql://shorecast:shorecast_secret@localhost:5432/shorecast | Yes |
| REDIS_URL | redis://localhost:6379 | Yes |
| GROQ_API_KEY | (empty) | No — falls back to stub LLM |
| JWT_SECRET | shorecast_dev_secret | Yes (change in prod) |
| NEXT_PUBLIC_API_URL | http://localhost:8000 | Yes |

## Data Sources (All Free)

| Source | Data | Cost |
|---|---|---|
| Open-Meteo | Wave height, tide, UV, temperature, wind | Free, no key |
| INCOIS | Indian coastal safety alerts, water quality | Free |
| OSM Overpass | Hotels, restaurants, tourist attractions | Free |
| MapLibre + OpenMapTiles | Vector map tiles | Free |
| Groq Cloud | LLM inference (Llama 3.3 70B) | Free tier |
