import React, { useState } from "react";

function Timer({ sessionId, setSessionId, isRunning, setIsRunning }) {
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | running | paused | ended

  React.useEffect(() => {
    if (status !== "running") return;

    const interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [status]);

  const start = async () => {
    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );

      const res = await fetch("http://localhost:8080/api/running/startLocation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timeStamp: new Date().toISOString()
        })
      });

      const data = await res.json();
      setSessionId(data.id);
      setStatus("running");
      setIsRunning(true);

      console.log("✅ Session started, id:", data.id);

    } catch (err) {
      console.error("Session start failed:", err);
    }
  };

  const pause = () => {
    setStatus("paused");
    setIsRunning(false);
    console.log("⏸ Paused");
  };

  const resume = () => {
    setStatus("running");
    setIsRunning(true);
    console.log("▶ Resumed");
  };

  const end = async () => {
    if (!sessionId) return;

    try {
      await fetch("http://localhost:8080/api/running/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId })
      });
      setStatus("ended");
      setIsRunning(false);
      console.log("🏁 Session ended");
    } catch (err) {
      console.error("Session end failed:", err);
    }
  };

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div>
      <h2>Time: {minutes}:{secs.toString().padStart(2,"0")}</h2>

      {status === "idle" && <button onClick={start}>Start</button>}
      {status === "running" && <button onClick={pause}>Pause</button>}
      {status === "paused" && <button onClick={resume}>Resume</button>}
      {(status === "running" || status === "paused") && <button onClick={end}>End</button>}
    </div>
  );
}

export default Timer;