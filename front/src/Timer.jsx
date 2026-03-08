import React, { useState, useEffect } from "react";

function Timer({ sessionId, setSessionId }) {
  const [seconds, setSeconds] = useState(0);
  const [isEnded, setIsEnded] = useState(false); // 세션 종료 상태

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleStartPause = async () => {
    if (isRunning) {
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
        setIsEnded(false);

      } catch (err) {
        console.error(err);
        alert("세션 생성 실패");
      }
    } else {
      // 이미 생성된 세션 재개
      setIsRunning(true);
    }
  };

  const endSession = async () => {
    if (!sessionId) return;
    setIsRunning(false);
    setIsEnded(true);

    try {
      const res = await fetch(`http://localhost:8080/api/running/end/${sessionId}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("End session failed");

      const data = await res.json();
      alert(`완주 페이스: ${data.pace} min/km`);
    } catch (err) {
      console.error(err);
      alert("세션 종료 실패");
    }
  };

  const resetTimer = () => {
    setSeconds(0);
    setIsRunning(false);
    setIsEnded(false);
    setSessionId(null);
  };

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Time: {minutes}:{secs.toString().padStart(2, "0")}</h2>

      <button onClick={toggleStartPause} disabled={isEnded}>
        {isRunning ? "Pause" : "Start"}
      </button>

      <button onClick={endSession} disabled={isEnded || !sessionId}>
        End
      </button>

      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}

export default Timer;