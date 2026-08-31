#!/usr/bin/env bash
# Shorecast local startup script (macOS/Linux)
set -e
echo "==> Starting Shorecast infrastructure..."
docker-compose up -d
echo "==> Waiting for Postgres to be ready..."
sleep 5

echo "==> Setting up FastAPI backend..."
cd apps/api
python3 -m venv venv 2>/dev/null || true
source venv/bin/activate
pip install -r requirements.txt -q
cp -n .env.example .env 2>/dev/null || true
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID (http://localhost:8000)"

echo "==> Setting up Next.js frontend..."
cd ../web
npm install --silent
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID (http://localhost:3000)"

echo ""
echo "=============================="
echo " Shorecast is running!"
echo " Frontend: http://localhost:3000"
echo " Backend:  http://localhost:8000"
echo " API Docs: http://localhost:8000/docs"
echo "=============================="
wait
