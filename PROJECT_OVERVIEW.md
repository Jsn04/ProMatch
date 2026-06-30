# ProMatch — Find Your Pro Twin

> A matching service that takes an amateur athlete's playing attributes and returns the
> professional players whose statistical profile is most similar to theirs — ranked, with a
> match % and a human-readable reason for each result.

---

## 1. The Problem Statement (as given)

The task is to **create a matching or suggestion-based application**. The user either inputs
data through a form or selects preferences from a list/form, and the system uses those entries
to **match the input against a dataset and return multiple ranked results**.

The brief lists three valid kinds of project:

1. **Matching**
2. **Recommendation**
3. **Image Recognition**

Their own examples include movie suggestions (Netflix), **dating/matrimonial matching**, and
"similar to your image" search.

### Strict requirements pulled from both documents (brief + Specifications table)

- **Kind:** Build one of Matching / Recommendation / Image Recognition.
- **Input:** User inputs data via a form *or* selects preferences.
- **Output:** System returns **multiple** results matched to the input.
- **Data:** Any database or open API may be used, **as long as the source is declared**.
  Data may be downloaded (e.g. Kaggle) or streamed from an open API.
- **Components:** (1) Frontend to enter options + display results, (2) the matching application,
  (3) a database to match from.
- **Containers:** The web interface, the backend, and the database must **each run in their own
  container**, connected through a **custom Docker network**.
- **Backend & API:** Must be **Python**.
- **Frontend:** Any modern JS framework (React/Vue/Angular/Next/Nuxt). TypeScript allowed.
  **No jQuery.**
- **Final output:**
  - Public **GitHub** repository.
  - **Plug-and-play** with a single `docker compose up`.
  - Comprehensive documentation: *why* the project was chosen and what is special about it;
    technical docs as **docstrings** plus a **README.md**.
- **Integrity:** Must be the candidate's **own original work** (AI tools allowed as a reference,
  but every line must be explainable/justifiable in the reviews). **Git used from the start**,
  full history pushed, repo public.
- **Reviews:** 3 stages — Division Manager → Technical Director/Division Manager → Final Review.
- **Deadline:** Submit by **5 July 2026** (target completion **4 July 2026**).

---

## 2. The Idea — ProMatch ("Find Your Pro Twin")

ProMatch is a **pure matching application**. It is the same pattern as a dating/matrimonial
matcher (one of the brief's own examples) — but instead of matching a person to a partner, it
matches an **amateur athlete to the professional athletes they most resemble**.

### Why this idea

- **Authentic "why":** As an international athlete, "who do I play like / which pro matches my
  profile?" is a genuine, personal question. That makes the *why-did-you-choose-this* answer
  unfakeable in review.
- **Tight fit to the brief:** It is almost a one-to-one match with their stated
  dating/matrimonial example, so there is zero ambiguity about whether it qualifies.
- **Defensible engine:** Person-to-person similarity over numeric attributes is the cleanest
  possible algorithm to explain line-by-line across three review rounds.
- **Low data risk:** A single static dataset, no fragile live-API dependency at demo time.

### Scope decision — one sport

The app matches **within a single sport (football)**. Similarity only works inside a shared
feature space — footballers and basketball players are scored on different attributes, so
cross-sport similarity would be mathematically meaningless and indefensible. Depth in one sport
beats shallow coverage of many. Multi-sport support is documented as **future work**: the schema
and engine are designed so a new sport is just a new dataset + attribute configuration.

### Data source (declared)

- **FIFA complete player dataset (Kaggle)** — ~18,000 players, each with numeric attributes
  (pace, shooting, passing, dribbling, defending, physical, plus age/height/weight/position).
- Downloaded once and **seeded into PostgreSQL**, so the running app and the demo do not depend
  on a live network call. Source credited in the README.

---

## 3. The User Flow

1. **Form (frontend).** The user enters their own profile:
   - Position (e.g. Winger).
   - Attribute ratings: Pace, Shooting, Passing, Dribbling, Defending, Physical.
   - (Optional) Weight sliders — "how much do I care about each attribute?"
   - (Optional) Filters — position, age range, league/nationality.
2. **Request.** The frontend sends the profile to the backend API as JSON.
3. **Match.** The backend scores the user's profile against every player in the database.
4. **Results (frontend).** A ranked list of multiple players, each with:
   - A **match %**.
   - The player's key stats.
   - A **"why matched"** explanation (which attributes drove the score).

---

## 4. The Matching Engine (the part to defend in review)

For each candidate player, the engine computes a similarity between the user's attribute vector
and the player's attribute vector. Design choices the candidate owns and can justify:

1. **Normalization** — scale all attributes to a common range so no single stat dominates.
2. **Optional weighting** — apply the user's per-attribute weights to the vector.
3. **Similarity metric** — cosine similarity (or weighted Euclidean), converted to a 0–100%
   match score.
4. **Ranking** — sort all players by score, return the top N.
5. **Explainability** — expose per-attribute contributions so the UI can say *why* each player
   matched.

Because there is no single "correct" weighting, the chosen weights and metric are **deliberate
design decisions** — this is where the candidate's individual thinking is demonstrated.

---

## 5. Architecture

| Container  | Tech                     | Role                                    |
|------------|--------------------------|-----------------------------------------|
| `frontend` | React + Vite (plain JS)  | Preference form + ranked-results UI     |
| `backend`  | Python + FastAPI         | Similarity engine + REST API            |
| `db`       | PostgreSQL               | Seeded player dataset                   |

- All three on a **named custom Docker network**.
- One command — `docker compose up` — brings the whole system up from a fresh clone.

### API endpoints (the "connected through an API" requirement)

- `GET /health` — liveness check (proves containers communicate).
- `GET /meta` — positions, attribute list, value ranges (populates the form).
- `POST /recommend` — body = user profile + weights; returns ranked players with scores + reasons.
- `GET /players/{id}` — optional detail view for a single player.

---

## 6. How This Maps 1:1 to the Requirements

| Requirement                                   | ProMatch                                              |
|-----------------------------------------------|------------------------------------------------------|
| Matching / Recommendation / Image Recognition | **Matching** (person-to-person similarity)           |
| Input via form / preferences                  | Attribute form + weight sliders + filters            |
| Multiple ranked results                       | Top-N players with match %                            |
| Declared data source                          | Kaggle FIFA dataset, credited in README              |
| Frontend component                            | React form + results UI                              |
| Matching application                          | FastAPI similarity engine                            |
| Database component                            | PostgreSQL, seeded                                    |
| Containerized, custom Docker network          | 3 containers on a named network                      |
| Python backend & API                          | FastAPI                                              |
| Modern JS frontend, no jQuery                 | React                                                |
| Public GitHub, plug-and-play                  | `docker compose up`                                  |
| Documentation (why/what's special)            | This file + README + docstrings                      |
| Original work, Git from the start             | Fresh repo, commit #1 from Day 0                     |

---

## 7. Timeline (target completion 4 July 2026)

| Day | Date    | Goal                          | Done when                                                              |
|-----|---------|-------------------------------|-----------------------------------------------------------------------|
| 0   | Jun 30  | Skeleton + Docker spine       | Repo + commit #1; 3 services + custom network; `docker compose up` works (empty); frontend reaches backend `/health`. |
| 1   | Jul 1   | Data layer                    | FIFA CSV committed; DB schema + idempotent seed-on-startup; `/players` + `/meta` return real data. |
| 2   | Jul 2   | Matching engine (core)        | Normalization + weighted similarity; `/recommend` returns ranked top-N with reasons; unit tests. |
| 3   | Jul 3   | Frontend                      | Form + filters + weight sliders; results cards with match % + "why"; full flow works in browser. |
| 4   | Jul 4   | Docs + ship + buffer          | README (why/what's special, architecture, run steps, data declaration); docstrings; fresh-clone `docker compose up` test; push to public GitHub. |

The hardest part (the engine) is locked by **2 July**, leaving two days for frontend, docs, and
a clean re-clone test.
