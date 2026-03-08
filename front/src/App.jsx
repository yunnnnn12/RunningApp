import React, { useState } from "react";
import Timer from "./Timer";
import LocationTracker from "./LocationTracker";
import PaceDisplay from "./PaceDisplay/PaceDisplay";

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div>
      <h1>Running App</h1>
      <Timer
        sessionId={sessionId}
        setSessionId={setSessionId}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
      />
      <LocationTracker sessionId={sessionId} isRunning={isRunning} />
      <PaceDisplay sessionId={sessionId} isRunning={isRunning} />
    </div>
  );
}

export default App;