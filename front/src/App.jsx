import React, { useState } from "react";
import Timer from "./Timer";
import LocationTracker from "./LocationTracker";

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div style={{ padding: "20px" }}>
      <h1>RunningApp</h1>

      <Timer sessionId={sessionId} setSessionId={setSessionId} isRunning={isRunning} setIsRunning={setIsRunning} />

      {/* 위치 추적 */}
      <LocationTracker sessionId={sessionId} isRunning={isRunning} />
    </div>
  );
}

export default App;