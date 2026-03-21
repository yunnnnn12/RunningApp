import React, { useEffect, useState } from "react";

export function formatPace(secPerKm) {
  if (!secPerKm || secPerKm === Infinity || secPerKm <= 0) return "--:--";
  const minutes = Math.floor(secPerKm / 60);
  const seconds = Math.round(secPerKm % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")} min/km`;
}

function PaceDisplay({ sessionId, isEnded, finalPace }) {
  const [currentPace, setCurrentPace] = useState(null);

  useEffect(() => {
    if (!sessionId || isEnded) return;

    const fetchPace = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/running/session/${sessionId}`);
        const data = await res.json();
        setCurrentPace(data.averagePace);
      } catch (err) {
        console.error("Pace fetch failed:", err);
      }
    };

    fetchPace();
    const interval = setInterval(fetchPace, 5000);
    return () => clearInterval(interval);
  }, [sessionId, isEnded]);

  return (
    <div style={{ marginTop: "10px" }}>
      {!isEnded ? (
        <h2>실시간 페이스: {currentPace !== null ? formatPace(currentPace) : "--:--"}</h2>
      ) : (
        <h2 style={{ color: "#007bff" }}>완주 페이스: {finalPace !== null ? formatPace(finalPace) : "--:--"}</h2>
      )}
    </div>
  );
}

export default PaceDisplay;