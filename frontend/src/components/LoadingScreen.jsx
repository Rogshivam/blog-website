// components/LoadingScreen.jsx
import { useEffect, useState } from "react";

export default function LoadingScreen({ seconds = 3, onFinish }) {
  const [countdown, setCountdown] = useState(seconds);

  useEffect(() => {
    if (countdown <= 0) {
      onFinish?.();
      return;
    }
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, onFinish]);

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "2rem",
      background: "#111",
      color: "#fff"
    }}>
      <p>Loading... {countdown}</p>
    </div>
  );
}
