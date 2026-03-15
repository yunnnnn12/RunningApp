import React, { useEffect, useState } from "react";

function DistanceDisplay({ sessionId, isRunning, finalDistance }) {
  const [currentDistance, setCurrentDistance] = useState(null);

  useEffect(() => {
    if (!sessionId) return;

    const fetchDistance = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/running/session/${sessionId}`);
        const data = await res.json();
        setCurrentDistance(data.totalDistance);
      } catch (err) {
        console.error("Distance fetch failed:", err);
      }
    };

    // ⭐ 처음 실행
    fetchDistance();

    // ⭐ 이후 5초마다 실행
    const interval = setInterval(fetchDistance, 5000);

    return () => clearInterval(interval);

  }, [sessionId]);

  return (
    <div style={{ marginTop: "20px" }}>
      {currentDistance !== null && (
        <h2>현재 거리: {(currentDistance / 1000).toFixed(2)} km</h2>
      )}

      {!isRunning && finalDistance !== null && (
        <h2>최종 거리: {(finalDistance / 1000).toFixed(2)} km</h2>
      )}
    </div>
  );
}

export default DistanceDisplay;