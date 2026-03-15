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

  return (
    <div>
      <h1>Running App</h1>

      <Timer
        sessionId={sessionId}
        setSessionId={setSessionId}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        setFinalDistance={setFinalDistance}
        setIsEnded={setIsEnded}
      />

      <LocationTracker sessionId={sessionId} isRunning={isRunning} />

      <DistanceDisplay
        sessionId={sessionId}
        isRunning={isRunning}
        finalDistance={finalDistance}
        isEnded={isEnded}
      />

      <PaceDisplay
        sessionId={sessionId}
        isRunning={isRunning}
        isEnded={isEnded}
      />
    </div>
  );
}

export default App;