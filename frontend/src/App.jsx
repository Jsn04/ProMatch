import { useEffect, useState } from "react";
import { getMeta, getRecommendations } from "./api";

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
    <div style={{ fontFamily: "sans-serif", padding: 40, maxWidth: 700, margin: "0 auto" }}>
      <h1>ProMatch</h1>
      <p>Enter your attributes and find the players most similar to you.</p>

      {/* one slider for each attribute */}
      {attributes.map((attribute) => (
        <div key={attribute} style={{ marginBottom: 12 }}>
          <label>
            {attribute}: {values[attribute]}
          </label>
          <br />
          <input
            type="range"
            min="0"
            max="99"
            value={values[attribute] || 0}
            onChange={(e) => handleChange(attribute, e.target.value)}
          />
        </div>
      ))}

      {/* choose how to match */}
      <div style={{ marginTop: 10 }}>
        <label>Match by: </label>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="euclidean">Overall similarity</option>
          <option value="cosine">Playing style</option>
        </select>
      </div>

      <button onClick={handleSubmit} style={{ marginTop: 20, padding: "8px 16px" }}>
        Find matches
      </button>

      {/* the results */}
      {loading && <p>Finding matches...</p>}

      {results.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h2>Your matches</h2>
          {results.map((player, index) => (
            <div key={index} style={{ borderBottom: "1px solid #ccc", padding: "8px 0" }}>
              <strong>{player.name}</strong> ({player.match_percent}% match)
              <br />
              {player.club} — {player.positions}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
