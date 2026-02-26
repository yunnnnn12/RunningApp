import React, { useState } from "react";
import Timer from "./Timer";

function App() {
  const [sessionId, setSessionId] = useState(null);

  return (
    <div style={{ padding: "20px" }}>
      <h1>RunningApp</h1>
      <Timer sessionId={sessionId} setSessionId={setSessionId} />
      {sessionId && <p>Session ID: {sessionId}</p>}
    </div>
  );
}

export default App;