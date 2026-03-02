import React, { useState, useEffect } from "react";

function Timer({ sessionId, setSessionId, isRunning, setIsRunning }) {
  const [seconds, setSeconds] = useState(0);

  // 타이머 증가
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const startSession = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const res = await fetch("http://localhost:8080/api/running/startLocation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timeStamp: new Date().toISOString()
        }),
      });

      if (!res.ok) throw new Error("Session creation failed");

      const data = await res.json();

      setSessionId(data.id);
      setIsRunning(true);
      setSeconds(0);

    } catch (err) {
      console.error(err);
      alert("세션 생성 실패");
    }
  };

  const stopSession = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setSeconds(0);
  };

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>
        Time: {minutes}:{secs.toString().padStart(2, "0")}
      </h2>

      <button onClick={startSession} disabled={isRunning}>
        Start
      </button>

      <button onClick={stopSession}>
        Stop
      </button>

      <button onClick={resetTimer}>
        Reset
      </button>
    </div>
  );
}

export default Timer;