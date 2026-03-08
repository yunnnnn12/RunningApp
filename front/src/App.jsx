import React, { useState } from "react";
import Timer from "./Timer";
import LocationTracker from "./LocationTracker";
import PaceDisplay from "./PaceDisplay/PaceDisplay";

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const startRun = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/running/start", {
        method: "POST",
      });

      const data = await res.json();
      setSessionId(data.sessionId);
      setIsRunning(true);
    } catch (err) {
      console.error("Start failed:", err);
    }
  };

  const stopRun = async () => {
    try {
      await fetch(`http://localhost:8080/api/running/stop/${sessionId}`, {
        method: "POST",
      });

      setIsRunning(false);
    } catch (err) {
      console.error("Stop failed:", err);
    }
  };

  return (
    <div>
      <h1>Running Tracker</h1>

      {!isRunning ? (
        <button onClick={startRun}>Start Run</button>
      ) : (
        <button onClick={stopRun}>Stop Run</button>
      )}

      <Timer isRunning={isRunning} />

      <LocationTracker
        isRunning={isRunning}
        sessionId={sessionId}
      />

      <PaceDisplay
        isRunning={isRunning}
        sessionId={sessionId}
      />
    </div>
  );
}

export default App;