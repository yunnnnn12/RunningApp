import React, { useState } from "react";
import Timer from "./Timer";
import LocationTracker from "./LocationTracker";
import PaceDisplay from "./PaceDisplay/PaceDisplay";
import DistanceDisplay from "./DistanceDisplay";

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isEnded, setIsEnded] = useState(false); 
  const [finalDistance, setFinalDistance] = useState(null);
  const [finalPace, setFinalPace] = useState(null);

  return (
    <div style={{ padding: "20px", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1>🏃‍♂️ Running App</h1>

      <Timer
        sessionId={sessionId}
        setSessionId={setSessionId}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        setIsEnded={setIsEnded}
        setFinalDistance={setFinalDistance}
        setFinalPace={setFinalPace}
      />

      <LocationTracker sessionId={sessionId} isRunning={isRunning} />

      <DistanceDisplay
        sessionId={sessionId}
        isEnded={isEnded}
        finalDistance={finalDistance}
      />

      <PaceDisplay
        sessionId={sessionId}
        isRunning={isRunning}
        isEnded={isEnded}
        finalPace={finalPace}
      />
    </div>
  );
}

export default App;