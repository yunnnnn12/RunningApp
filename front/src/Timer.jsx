import React, { useState, useEffect } from "react";

function Timer({ sessionId, setSessionId }) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // 타이머 증가
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleStartPause = async () => {
    if (isRunning) {
      // 일시정지
      setIsRunning(false);
      return;
    }

    if (!sessionId) {
      // 새 세션 시작
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
          }),
        });

        if (!res.ok) throw new Error("Session creation failed");

        const data = await res.json();
        setSessionId(data.id);
        setSeconds(0);
        setIsRunning(true);

      } catch (err) {
        console.error(err);
        alert("세션 생성 실패");
      }
    } else {
      // 이미 생성된 세션 재개
      setIsRunning(true);
    }
  };

  const resetTimer = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Time: {minutes}:{secs.toString().padStart(2, "0")}</h2>

      <button onClick={toggleStartPause}>
        {isRunning ? "Pause" : "Start"}
      </button>

      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}

export default Timer;