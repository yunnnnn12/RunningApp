import React, { useEffect, useState } from "react";

function DistanceDisplay({ sessionId, isEnded, finalDistance }) {
  const [currentDistance, setCurrentDistance] = useState(null);

  useEffect(() => {
    if (!sessionId || isEnded) return;

    const fetchDistance = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/running/session/${sessionId}`);
        const data = await res.json();
        setCurrentDistance(data.totalDistance);
      } catch (err) {
        console.error("Distance fetch failed:", err);
      }
    };

    fetchDistance();
    const interval = setInterval(fetchDistance, 5000);
    return () => clearInterval(interval);
  }, [sessionId, isEnded]);

  return (
    <div style={{ marginTop: "20px" }}>
      {!isEnded ? (
        <h2>현재 거리: {currentDistance !== null ? (currentDistance / 1000).toFixed(2) : "0.00"} km</h2>
      ) : (
        <h2 style={{ color: "#007bff" }}>최종 거리: {finalDistance !== null ? (finalDistance / 1000).toFixed(2) : "0.00"} km</h2>
      )}
    </div>
  );
}

export default DistanceDisplay;