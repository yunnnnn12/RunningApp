import { useEffect } from "react";

function LocationTracker({ sessionId, isRunning }) {
  useEffect(() => {
    if (!sessionId || !isRunning) return;

    const interval = setInterval(async () => {
      try {
        const position = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        );

        await fetch("http://localhost:8080/api/running/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timeStamp: new Date().toISOString()
          })
        });
      } catch (err) {
        console.error("Location send failed:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [sessionId, isRunning]);

  return null;
}

export default LocationTracker;