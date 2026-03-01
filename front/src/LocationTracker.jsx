import { useEffect } from "react";

function LocationTracker({ sessionId, isRunning }) {
  useEffect(() => {
    if (!isRunning || !sessionId) return;

    const interval = setInterval(async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        await fetch("http://localhost:8080/api/running/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timeStamp: new Date().toISOString()
          }),
        });

        console.log("Location saved");
      } catch (err) {
        console.error("Location send failed:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isRunning, sessionId]);

  return null; // UI는 필요 없으므로 null 반환
}

export default LocationTracker;