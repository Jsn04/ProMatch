import { useEffect, useState } from "react";
import { checkHealth } from "./api";

// For Step 1 this page does nothing useful yet. It just calls the
// backend health check when it loads, so I can see that the frontend
// and backend are actually talking to each other.
function App() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    checkHealth()
      .then((data) => {
        if (data.status === "ok") {
          setStatus("connected");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 40 }}>
      <h1>ProMatch</h1>
      {status === "checking" && <p>Checking backend...</p>}
      {status === "connected" && <p>Backend connected</p>}
      {status === "error" && <p>Could not reach the backend</p>}
    </div>
  );
}

export default App;
