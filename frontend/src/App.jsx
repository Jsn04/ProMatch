import { useEffect, useState } from "react";
import { getMeta, getRecommendations } from "./api";
import "./styles.css";

// the position groups I let the user filter by (the backend maps these to real positions)
const POSITION_GROUPS = [
  { value: "attacker", label: "Attackers" },
  { value: "midfielder", label: "Midfielders" },
  { value: "defender", label: "Defenders" },
];

function App() {
  const [attributes, setAttributes] = useState([]);
  const [values, setValues] = useState({});
  const [method, setMethod] = useState("euclidean");
  const [position, setPosition] = useState("");
  const [minAge, setMinAge] = useState(15);
  const [maxAge, setMaxAge] = useState(45);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // when the page loads, get the attributes from the backend and start each one at 50
  useEffect(() => {
    getMeta().then((meta) => {
      setAttributes(meta.attributes);
      const start = {};
      meta.attributes.forEach((a) => {
        start[a] = 50;
      });
      setValues(start);
    });
  }, []);

  // update one slider's value
  function handleChange(attribute, newValue) {
    setValues({ ...values, [attribute]: Number(newValue) });
  }

  // send the values and filters to the backend and show the matches
  async function handleSubmit() {
    setLoading(true);
    const filters = { position: position, min_age: minAge, max_age: maxAge };
    const matches = await getRecommendations(values, method, filters);
    setResults(matches);
    setSearched(true);
    setLoading(false);
  }

  return (
    <div className="page">
      <div className="header">
        <h1>ProMatch</h1>
        <p className="subtitle">Enter your attributes and find the players most similar to you.</p>
      </div>

      {/* the form is inside a card */}
      <div className="card form-card">
        {attributes.map((attribute) => (
          <div className="attribute" key={attribute}>
            <label>
              <span>{attribute}</span>
              <span className="value">{values[attribute]}</span>
            </label>
            <input
              type="range"
              min="0"
              max="99"
              value={values[attribute] || 0}
              onChange={(e) => handleChange(attribute, e.target.value)}
            />
          </div>
        ))}

        {/* filters */}
        <div className="filters">
          <label>
            Position:
            <select value={position} onChange={(e) => setPosition(e.target.value)}>
              <option value="">Any</option>
              {POSITION_GROUPS.map((group) => (
                <option key={group.value} value={group.value}>
                  {group.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Min age:
            <input type="number" value={minAge} onChange={(e) => setMinAge(Number(e.target.value))} />
          </label>
          <label>
            Max age:
            <input type="number" value={maxAge} onChange={(e) => setMaxAge(Number(e.target.value))} />
          </label>
        </div>

        <div className="controls">
          <label>Match by:</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="euclidean">Overall similarity</option>
            <option value="cosine">Playing style</option>
          </select>
          <button onClick={handleSubmit}>Find matches</button>
        </div>
      </div>

      {loading && <p>Finding matches...</p>}

      {/* message when the filters return nothing */}
      {searched && !loading && results.length === 0 && (
        <p>No players found for these filters.</p>
      )}

      {results.length > 0 && (
        <div className="results">
          <h2>Your matches</h2>
          {results.map((player, index) => (
            <div className="player-card" key={index}>
              <div className="rank">{index + 1}</div>
              <div className="player-main">
                <div className="name">{player.name}</div>
                <div className="info">
                  {player.club} · {player.positions} · age {player.age}
                </div>
                <div className="stats">
                  PAC {player.pace} · SHO {player.shooting} · PAS {player.passing} · DRI{" "}
                  {player.dribbling} · DEF {player.defending} · PHY {player.physical}
                </div>
              </div>
              <div className="match">
                <div className="percent">{player.match_percent}%</div>
                <div className="bar">
                  <div className="bar-fill" style={{ width: `${player.match_percent}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
