import React, { useState, useEffect } from "react";

function Timer({ sessionId, setSessionId, isRunning, setIsRunning, setIsEnded, setFinalDistance, setFinalPace }) {
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | running | paused

  useEffect(() => {
    let interval;
    if (status === "running") {
      interval = setInterval(() => setSeconds(prev => prev + 1), 1000);
    }
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
      setIsEnded(false);
      setSeconds(0);
      setFinalDistance(null);
      setFinalPace(null);
    } catch (err) {
      console.error("Start failed:", err);
      alert("위치 정보 권한을 허용해주세요.");
    }
  };

  const pause = () => {
    setStatus("paused");
    setIsRunning(false);
  };

  const resume = () => {
    setStatus("running");
    setIsRunning(true);
  };

  const end = async () => {
    if (!sessionId) return;
    try {
      await fetch("http://localhost:8080/api/running/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId })
      });

      const res = await fetch(`http://localhost:8080/api/running/session/${sessionId}`);
      const data = await res.json();

      setFinalDistance(data.totalDistance);
      setFinalPace(data.averagePace);
      
      setStatus("idle");
      setIsRunning(false);
      setIsEnded(true); 
    } catch (err) {
      console.error("End failed:", err);
    }
  };

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "10px", backgroundColor: "#f9f9f9" }}>
      <h2>Time: {minutes}:{secs.toString().padStart(2, "0")}</h2>
      {status === "idle" && <button onClick={start} style={{ padding: "10px 20px" }}>시작하기</button>}
      {status === "running" && <button onClick={pause} style={{ padding: "10px 20px" }}>일시정지</button>}
      {status === "paused" && <button onClick={resume} style={{ padding: "10px 20px" }}>다시시작</button>}
      {(status === "running" || status === "paused") && (
        <button onClick={end} style={{ marginLeft: "10px", padding: "10px 20px", color: "red" }}>종료</button>
      )}
    </div>
  );
}

export default Timer;