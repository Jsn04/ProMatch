# ProMatch

ProMatch is a matching app. You enter a football player's attributes (pace, shooting,
passing, dribbling, defending, physical) and it finds the professional players whose
stats are the most similar to what you entered, ranked by a match percentage.

This is still being built. Right now (Step 1) only the skeleton is set up: the three
containers start and the frontend can reach the backend.

## How to run

You need Docker installed. From the project folder run:

```
docker compose up
```

Then open:

- Frontend: http://localhost:5173
- Backend health check: http://localhost:8000/health

## How it is built

- Backend: Python with FastAPI
- Frontend: React (Vite)
- Database: PostgreSQL
- The frontend, backend and database each run in their own container and are
  connected on a custom Docker network.

## Data

The player data will come from the FIFA complete player dataset on Kaggle (added in a
later step). The source will be credited here.
