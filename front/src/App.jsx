import React, { useState } from "react";
import Timer from "./Timer";
<<<<<<< HEAD

function App() {
  const [sessionId, setSessionId] = useState(null);
=======
import LocationTracker from "./LocationTracker";

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
>>>>>>> feature/location-tracking

  return (
    <div style={{ padding: "20px" }}>
      <h1>RunningApp</h1>
<<<<<<< HEAD
      <Timer sessionId={sessionId} setSessionId={setSessionId} />
      {sessionId && <p>Session ID: {sessionId}</p>}
=======

      <Timer sessionId={sessionId} setSessionId={setSessionId} isRunning={isRunning} setIsRunning={setIsRunning} />

      {/* 위치 추적 */}
      <LocationTracker sessionId={sessionId} isRunning={isRunning} />
>>>>>>> feature/location-tracking
    </div>
  );
}

export default App;