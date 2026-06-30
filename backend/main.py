"""
ProMatch backend.

This is the API for the project. When it starts it loads the player data into the
database, and it gives the frontend a few endpoints to use: a health check, a list of
players, and some info about the attributes (which the form will use later).
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from seed_data import seed
from database import get_connection

app = FastAPI()

# The frontend runs on a different port, so the browser blocks the request
# unless I allow it here. For this project I allow all origins to keep it simple.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# the six attributes I match players on
ATTRIBUTES = ["pace", "shooting", "passing", "dribbling", "defending", "physical"]


@app.on_event("startup")
def startup():
    # when the backend starts, make sure the player data is loaded into the database
    seed()


@app.get("/health")
def health():
    """Returns ok so I can check the backend is running."""
    return {"status": "ok"}


@app.get("/players")
def get_players(limit: int = 20):
    """Return some players from the database (20 by default)."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT id, name, club, nationality, age, overall, positions, "
        "pace, shooting, passing, dribbling, defending, physical "
        "FROM players LIMIT %s",
        (limit,),
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    # turn each database row into a dictionary so it comes out as nice json
    players = []
    for row in rows:
        players.append({
            "id": row[0],
            "name": row[1],
            "club": row[2],
            "nationality": row[3],
            "age": row[4],
            "overall": row[5],
            "positions": row[6],
            "pace": row[7],
            "shooting": row[8],
            "passing": row[9],
            "dribbling": row[10],
            "defending": row[11],
            "physical": row[12],
        })
    return players


@app.get("/meta")
def get_meta():
    """Return the attributes and their value range. The form uses this to build itself."""
    return {
        "attributes": ATTRIBUTES,
        "min_value": 0,
        "max_value": 99,
    }
