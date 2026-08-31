@echo off
echo =^> Starting Shorecast infrastructure...
docker-compose up -d
echo =^> Waiting for database...
timeout /t 8 /nobreak > nul

echo =^> Setting up FastAPI backend...
cd apps\api
if not exist "venv" python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt -q
if not exist ".env" copy .env.example .env
start "Shorecast API" cmd /k "call venv\Scripts\activate.bat && uvicorn main:app --reload --port 8000"

echo =^> Setting up Next.js frontend...
cd ..\web
if not exist "node_modules" npm install
start "Shorecast Web" cmd /k "set NEXT_PUBLIC_API_URL=http://localhost:8000 && npm run dev"

echo.
echo ==============================
echo  Shorecast is starting!
echo  Frontend: http://localhost:3000
echo  Backend:  http://localhost:8000
echo  API Docs: http://localhost:8000/docs
echo ==============================
cd ..\..
pause
