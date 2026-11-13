import React, { useRef, useState, useEffect } from "react";


export default function ExpressionTest() {
  const videoRef = useRef(null);
  const [expression, setExpression] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Request camera access on mount
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => setError("Camera error: " + err.message));
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureAndSend = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      if (!blob) return;
      const formData = new FormData();
      formData.append("frame", blob, "frame.jpg");
      fetch("http://localhost:8000/api/ai/expression/", {
        method: "POST",
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if (data.expression) {
            setExpression(data.expression);
            setError("");
          } else {
            setExpression("");
            setError(data.error || "Unknown error");
          }
        })
        .catch(err => setError("Backend error: " + err.message));
    }, "image/jpeg");
  };

  return (
    <div style={{padding: 20}}>
      <h2>Facial Expression Analysis</h2>
      <video ref={videoRef} autoPlay playsInline width={320} height={240}
        style={{border: "1px solid #ccc", borderRadius: 8}} />
      <div>
        <button onClick={captureAndSend} style={{marginTop: 10}}>Analyze Expression</button>
      </div>
      {expression && <div style={{marginTop: 10}}>Detected Expression: <b>{expression}</b></div>}
      {error && <div style={{color: "red", marginTop: 10}}>Error: {error}</div>}
    </div>
  );
}