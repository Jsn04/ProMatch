import { useEffect, useState } from "react";
import { getMeta, getRecommendations } from "./api";
import "./styles.css";

function App() {
  const [attributes, setAttributes] = useState([]);
  const [values, setValues] = useState({});
  const [method, setMethod] = useState("euclidean");
  const [results, setResults] = useState([]);
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

  // send the values to the backend and show the matches
  async function handleSubmit() {
    setLoading(true);
    const matches = await getRecommendations(values, method);
    setResults(matches);
    setLoading(false);
  }

  return (
    <div className="page">
      <h1>ProMatch</h1>
      <p className="subtitle">Enter your attributes and find the players most similar to you.</p>

      {/* one slider for each attribute */}
      {attributes.map((attribute) => (
        <div className="attribute" key={attribute}>
          <label>
            {attribute}: {values[attribute]}
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

      {/* choose how to match, and search */}
      <div className="controls">
        <label>Match by: </label>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="euclidean">Overall similarity</option>
          <option value="cosine">Playing style</option>
        </select>
        <button onClick={handleSubmit}>Find matches</button>
      </div>

      {/* the results */}
      {loading && <p>Finding matches...</p>}

      {results.length > 0 && (
        <div>
          <h2>Your matches</h2>
          {results.map((player, index) => (
            <div className="player-card" key={index}>
              <span className="name">{player.name}</span>{" "}
              <span className="percent">{player.match_percent}% match</span>
              <div className="info">
                {player.club} — {player.positions}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
