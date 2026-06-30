// I keep all the calls to the backend in this one file so the API
// address is only written in one place. If it changes I fix it here.

const API_URL = "http://localhost:8000";

// asks the backend if it is alive
export async function checkHealth() {
  const res = await fetch(`${API_URL}/health`);
  return res.json();
}
