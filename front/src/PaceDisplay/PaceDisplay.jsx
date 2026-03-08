import React, { useEffect, useState } from "react";
import { formatPace } from "./paceUtils";

function PaceDisplay({ sessionId, isRunning }) {
  const [currentPace, setCurrentPace] = useState(null);
  const [finalPace, setFinalPace] = useState(null);

  useEffect(() => {
    if (!sessionId) return;

    const interval = setInterval(async () => {
      try {
        // 실시간 세션 정보 가져오기
        const res = await fetch(`http://localhost:8080/api/running/session/${sessionId}`);
        if (!res.ok) throw new Error("Failed to fetch session info");

        const data = await res.json();
        setCurrentPace(data.averagePace); // sec/km
        if (!isRunning && data.endTime) {
          setFinalPace(data.averagePace);
        }

      } catch (err) {
        console.error("Pace fetch failed:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [sessionId, isRunning]);

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>실시간 페이스: {formatPace(currentPace)}</h2>
      {!isRunning && finalPace && <h2>완주 페이스: {formatPace(finalPace)}</h2>}
    </div>
  );
}

export default PaceDisplay;