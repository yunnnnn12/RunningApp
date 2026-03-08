import { useEffect } from "react";

function LocationTracker({ isRunning, sessionId }) {
  useEffect(() => {
    if (!isRunning || !sessionId) return;

    const watchId = navigator.geolocation.watchPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      try {
        await fetch("http://localhost:8080/api/running/location", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            latitude,
            longitude,
          }),
        });
      } catch (err) {
        console.error("Location send failed:", err);
      }
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isRunning, sessionId]);

  return null;
}

export default LocationTracker;