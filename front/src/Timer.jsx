import React, { useState, useEffect } from "react";

function Timer({ sessionId, setSessionId }) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // 타이머
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const startSession = async () => {
    try {
      // 브라우저 위치 가져오기
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      // 서버에 session 생성
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
      setSessionId(data.id); // sessionId 저장
      setIsRunning(true); // 타이머 시작
    } catch (err) {
      console.error("Failed to start session:", err);
      alert("위치 가져오기 실패 또는 서버 오류");
    }
  };

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Time: {minutes}:{secs.toString().padStart(2,"0")}</h2>
      <button onClick={startSession} disabled={isRunning}>
        Start
      </button>
      <button onClick={() => setIsRunning(false)}>Stop</button>
      <button onClick={() => setSeconds(0)}>Reset</button>
    </div>
  );
}

export default Timer;