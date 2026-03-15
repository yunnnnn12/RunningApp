import React, { useEffect, useState } from "react";
import { formatPace } from "./paceUtils";

function PaceDisplay({ sessionId, isRunning, isEnded }) {

  const [currentPace, setCurrentPace] = useState(null);
  const [finalPace, setFinalPace] = useState(null);

  useEffect(() => {
    if (!sessionId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/running/session/${sessionId}`);
        const data = await res.json();

        if (isRunning) {
          setCurrentPace(data.averagePace);
        }

        if (isEnded) {
          setFinalPace(data.averagePace);
        }

      } catch (err) {
        console.error("Pace fetch failed:", err);
      }
    }, 5000);

    return () => clearInterval(interval);

  }, [sessionId, isRunning, isEnded]);

  return (
    <div style={{ marginTop: "20px" }}>

      {isRunning && (
        <h2>실시간 페이스: {formatPace(currentPace)}</h2>
      )}

      {isEnded && finalPace && (
        <h2>완주 페이스: {formatPace(finalPace)}</h2>
      )}

    </div>
  );
}

export default PaceDisplay;