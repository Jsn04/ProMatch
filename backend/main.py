"""
ProMatch backend.

Right now this only has a health check. I am using it in Step 1 just to
prove the backend container starts and that the frontend can reach it.
The matching logic and the database stuff come in the later steps.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# The frontend runs on a different port, so the browser blocks the request
# unless I allow it here. For this project I allow all origins to keep it simple.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    """Returns ok so I can check the backend is running."""
    return {"status": "ok"}
