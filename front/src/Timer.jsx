import React, { useState, useEffect } from "react";

function Timer({ sessionId, setSessionId }) {
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState("idle"); 
  // idle | running | paused | ended

  useEffect(() => {
    if (status !== "running") return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  const start = async () => {
    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );

      const res = await fetch("http://localhost:8080/api/running/startLocation", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timeStamp: new Date().toISOString()
        })
      });

      const data = await res.json();

      setSessionId(data.id);
      setStatus("running");

    } catch (err) {
      console.error(err);
    }
  };

  const pause = () => {
    setStatus("paused");
  };

  const resume = () => {
    setStatus("running");
  };

  const end = async () => {
    if (!sessionId) return;

    try {
      await fetch(`http://localhost:8080/api/running/end/${sessionId}`, {
        method: "POST"
      });

      setStatus("ended");

    } catch (err) {
      console.error(err);
    }
  };

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div>
      <h2>
        Time: {minutes}:{secs.toString().padStart(2, "0")}
      </h2>

      {status === "idle" && (
        <button onClick={start}>Start</button>
      )}

      {status === "running" && (
        <button onClick={pause}>Pause</button>
      )}

      {status === "paused" && (
        <button onClick={resume}>Resume</button>
      )}

      {(status === "running" || status === "paused") && (
        <button onClick={end}>End</button>
      )}
    </div>
  );
}

export default Timer;