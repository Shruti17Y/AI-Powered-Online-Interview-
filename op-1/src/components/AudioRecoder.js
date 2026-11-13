import React, { useRef, useState } from 'react';

function AudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    setAnalysisResult(null);
    setError('');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new window.MediaRecorder(stream);
    audioChunksRef.current = [];
    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current); // No type needed, browser default is webm
      setAudioURL(URL.createObjectURL(audioBlob));
      uploadAudio(audioBlob);
    };
    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const uploadAudio = (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm'); // CORRECT extension!
    fetch('http://127.0.0.1:8000/api/analyze-audio/', {
      method: 'POST',
      body: formData,
    })
      .then(async (res) => {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          setAnalysisResult(data);
        } catch (e) {
          if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
            setError('Upload failed: Server error or invalid response. Please check your backend logs.');
          } else {
            setError('Upload failed: ' + text);
          }
        }
      })
      .catch((err) => {
        setError('Upload failed: ' + err);
      });
  };

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {audioURL && <audio src={audioURL} controls />}
      {analysisResult && (
        <div className="mt-2 p-2 bg-green-100 rounded text-sm">
          <b>Analysis Result:</b>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {JSON.stringify(analysisResult, null, 2)}
          </pre>
        </div>
      )}
      {error && (
        <div className="mt-2 p-2 bg-red-100 rounded text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}

export default AudioRecorder;