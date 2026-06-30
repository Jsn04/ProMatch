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

## How to check it is working

After running `docker compose up`, you can check each part:

1. Check all three containers are running:

   ```
   docker compose ps
   ```

   You should see frontend, backend and db all showing "Up".

2. Check the backend is alive. Open http://localhost:8000/health in the browser. It should
   show `{"status":"ok"}`.

3. Check the frontend can reach the backend. Open http://localhost:5173. The page should say
   "Backend connected".

4. Check the backend can reach the database:

   ```
   docker compose exec backend python -c "from database import get_connection; c=get_connection(); cur=c.cursor(); cur.execute('SELECT 1'); print(cur.fetchone()); c.close()"
   ```

   It should print `(1,)`, which means the database answered.

## How it is built

- Backend: Python with FastAPI
- Frontend: React (Vite)
- Database: PostgreSQL
- The frontend, backend and database each run in their own container and are
  connected on a custom Docker network.

## Data

The player data will come from the FIFA complete player dataset on Kaggle (added in a
later step). The source will be credited here.
