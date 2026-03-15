import React, { useState } from "react";
import Timer from "./Timer";
import LocationTracker from "./LocationTracker";
import PaceDisplay from "./PaceDisplay/PaceDisplay";
import DistanceDisplay from "./DistanceDisplay";

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
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
      />

      <LocationTracker sessionId={sessionId} isRunning={isRunning} />

      <DistanceDisplay
        sessionId={sessionId}
        isRunning={isRunning}
        finalDistance={finalDistance}
      />

      <PaceDisplay sessionId={sessionId} isRunning={isRunning} />
    </div>
  );
}

export default App;