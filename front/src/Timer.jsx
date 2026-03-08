import React, { useEffect, useState } from "react";

function Timer({ isRunning }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div>
      <h2>Time: {time}s</h2>
    </div>
  );
}

export default Timer;