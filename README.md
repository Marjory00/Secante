# Secante Security Control Panel

Full-stack security control panel built with:

- FastAPI (Python backend)
- React + TypeScript (frontend)
- PostgreSQL (database)
- Docker

## Run Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

## Run Frontend
cd frontend
npm install
npm run dev

## Run Database
docker-compose up -d