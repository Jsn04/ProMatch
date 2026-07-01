"""
The matching logic for the backend.

This is the same idea as my similarity notebook, but instead of reading a csv it loads
the players from the database. It uses scikit-learn's k-NN to find the players most
similar to the attributes the user sends in. It can also filter the players by position
and age before matching.
"""

import numpy as np
from sklearn.neighbors import NearestNeighbors

from database import get_connection

# the six attributes I match on (same order everywhere)
ATTRIBUTES = ["pace", "shooting", "passing", "dribbling", "defending", "physical"]


def load_players(position=None, min_age=None, max_age=None):
    """Read players from the database, with optional filters for position and age."""
    conn = get_connection()
    cur = conn.cursor()

    query = (
        "SELECT name, club, nationality, age, overall, positions, "
        "pace, shooting, passing, dribbling, defending, physical FROM players"
    )

    # only add the filters that were actually given
    conditions = []
    params = []
    if position:
        conditions.append("positions LIKE %s")
        params.append("%" + position + "%")
    if min_age is not None:
        conditions.append("age >= %s")
        params.append(min_age)
    if max_age is not None:
        conditions.append("age <= %s")
        params.append(max_age)

    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    cur.execute(query, params)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows


def recommend(user, method="euclidean", weights=None, top_n=10,
              position=None, min_age=None, max_age=None):
    """Return the players most similar to the user's attributes (after any filters)."""
    if weights is None:
        weights = {a: 1 for a in ATTRIBUTES}
    weight_vector = np.array([weights[a] for a in ATTRIBUTES])

    rows = load_players(position, min_age, max_age)

    # if the filters left no players there is nothing to match
    if len(rows) == 0:
        return []

    # cannot ask for more neighbours than the number of players we have
    n = min(top_n, len(rows))

    # the six attribute values are the last six columns of each row
    attribute_matrix = np.array([row[-6:] for row in rows], dtype=float) * weight_vector
    user_point = np.array([user[a] for a in ATTRIBUTES], dtype=float) * weight_vector

    knn = NearestNeighbors(n_neighbors=n, metric=method)
    knn.fit(attribute_matrix)
    distances, indices = knn.kneighbors([user_point])

    # turn the distance into an easy 0-100 match score
    if method == "euclidean":
        max_distance = np.sqrt((weight_vector ** 2 * (99 ** 2)).sum())
        scores = (1 - distances[0] / max_distance) * 100
    else:  # cosine distance is 1 - similarity
        scores = (1 - distances[0]) * 100

    # build the list of matched players to send back
    matches = []
    for place, row_index in enumerate(indices[0]):
        row = rows[row_index]
        matches.append({
            "name": row[0],
            "club": row[1],
            "nationality": row[2],
            "age": row[3],
            "overall": row[4],
            "positions": row[5],
            "pace": row[6],
            "shooting": row[7],
            "passing": row[8],
            "dribbling": row[9],
            "defending": row[10],
            "physical": row[11],
            "match_percent": round(float(scores[place]), 1),
        })
    return matches
