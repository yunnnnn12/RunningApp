import React, { useState, useEffect } from "react";

function Timer({ sessionId, setSessionId }) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // 1️⃣ 타이머 (1초마다 증가)
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // 2️⃣ 세션 시작
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

      const data = await res.json();
      setSessionId(data.id);
      setIsRunning(true);
    } catch (err) {
      console.error("Failed to start session:", err);
      alert("세션 생성 실패 또는 서버 오류");
    }
  };

  const stopSession = () => setIsRunning(false);
  const resetTimer = () => setSeconds(0);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>
        Time: {minutes}:{secs.toString().padStart(2, "0")}
      </h2>

      <button onClick={startSession} disabled={isRunning}>Start</button>
      <button onClick={stopSession}>Stop</button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}

export default Timer;