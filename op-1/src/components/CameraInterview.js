


import API_BASE_URL from '../apiConfig.js';
import React, { useRef, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import './CameraInterview.css';

const CameraInterview = ({ companyId: propCompanyId, skills: propSkills }) => {

  const videoRef = useRef(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionId] = useState("1");
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [chunks, setChunks] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [isInterviewFinished, setIsInterviewFinished] = useState(false);
  const [allResults, setAllResults] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [pendingNext, setPendingNext] = useState(false);
  const [searchParams] = useSearchParams();
  // Resolve effective companyId and skills (props take precedence over URL)
  const companyId = propCompanyId ?? searchParams.get('companyId');
  const navigate = useNavigate();
  const [finalScore, setFinalScore] = useState(null);
  const [finalPassed, setFinalPassed] = useState(null);
  const { user } = useAuth();
  const userId = user?.id;
  const [videoStream, setVideoStream] = useState(null);
  

  // Shuffle questions
  const shuffle = (array) => {
    let arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  // Filter questions based on required skills
  const filterQuestionsBySkills = (allQuestions, requiredSkills) => {
    if (!requiredSkills || requiredSkills.length === 0) {
      return allQuestions; // Return all questions if no skills specified
    }

    // Normalize skills to match question subjects
    const normalizedSkills = requiredSkills.map(skill => {
      const skillLower = skill.toLowerCase();
      // Map common skill variations to question subjects
      if (skillLower.includes('java')) return 'Java';
      if (skillLower.includes('python')) return 'Python';
      if (skillLower.includes('javascript') || skillLower.includes('js')) return 'JavaScript';
      if (skillLower.includes('c++') || skillLower.includes('cpp')) return 'C++';
      if (skillLower.includes('c ')) return 'C';
      if (skillLower.includes('html')) return 'HTML';
      if (skillLower.includes('css')) return 'CSS';
      if (skillLower.includes('django')) return 'Django';
      if (skillLower.includes('database') || skillLower.includes('dbms') || skillLower.includes('sql')) return 'DBMS';
      if (skillLower.includes('data structure') || skillLower.includes('ds')) return 'DS';
      if (skillLower.includes('network') || skillLower.includes('networking')) return 'Networking';
      if (skillLower.includes('oop') || skillLower.includes('object oriented')) return 'OOP';
      return skill; // Return original if no match
    });

    // Filter questions that match any of the required skills
    const filteredQuestions = allQuestions.filter(question => 
      normalizedSkills.some(skill => 
        question.subject.toLowerCase() === skill.toLowerCase()
      )
    );

    return filteredQuestions;
  };


  // Start webcam video stream
  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setVideoStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Failed to access webcam: " + err.message);
      }
    };

    startVideo();

    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line
  }, []);
  
  useEffect(() => {

    const requiredSkillsParam = (propSkills && Array.isArray(propSkills))
      ? propSkills.join(',')
      : (typeof propSkills === 'string' ? propSkills : searchParams.get('skills'));
    let requiredSkills = [];
    
    if (requiredSkillsParam) {
      // Parse skills from URL parameter (comma-separated)
      requiredSkills = (Array.isArray(propSkills)
        ? propSkills
        : requiredSkillsParam.split(',').map(skill => skill.trim())
      );
      console.log('Required skills from URL:', requiredSkills);
    }

    fetch(`${API_BASE_URL}/api/questions/`)
      .then((res) => res.json())
      .then((data) => {
        // Filter questions based on required skills
        const filteredQuestions = filterQuestionsBySkills(data, requiredSkills);
        console.log('Total questions available:', data.length);
        console.log('Filtered questions for skills:', filteredQuestions.length);
        
        if (filteredQuestions.length === 0) {
          setError("No questions found for the specified skills. Using all available questions.");
          const shuffled = shuffle(data).slice(0, 10);
          setQuestions(shuffled);
        } else {
          const shuffled = shuffle(filteredQuestions).slice(0, 10);
          setQuestions(shuffled);
        }
        
        setCurrentIndex(0);
        setTimestamps([{ start: Date.now() }]);
      })
      .catch((err) => setError("Fetch error: " + err.message));
 
    
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
        setVideoStream(null);
      }
      if (mediaRecorder && isRecording) {
        stopRecording();
      }
    };
    // eslint-disable-next-line
  }, []);

  // Start recording when question changes (except after last question)
  useEffect(() => {
    if (questions.length > 0 && !isInterviewFinished) {
      startRecording();
    }
    // eslint-disable-next-line
  }, [currentIndex, questions.length]);

  // Wait for audioBlob after stopping recording, then submit answer
  useEffect(() => {
    if (pendingNext && audioBlob) {
      submitAnswerWithAudio();
    }
    // eslint-disable-next-line
  }, [audioBlob, pendingNext]);

  const startRecording = async () => {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Your browser does not support audio recording (getUserMedia missing). Try updating your browser, or use Chrome/Firefox.");
      console.error("getUserMedia not supported");
      return;
    }
    if (window.isSecureContext === false && window.location.hostname !== 'localhost') {
      setError("Audio recording only works on HTTPS or localhost. Please use a secure connection.");
      console.error("Insecure context: getUserMedia requires HTTPS or localhost.");
      return;
    }
    // Use default device
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (!window.MediaRecorder) {
      setError("MediaRecorder is not supported in this browser. Try updating your browser or use Chrome/Firefox.");
      console.error("MediaRecorder not supported");
      return;
    }
    const recorder = new window.MediaRecorder(stream);
    let localChunks = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        localChunks.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(localChunks, { type: "audio/webm" });
      setAudioBlob(blob);
      setChunks([]);
      stream.getTracks().forEach((track) => track.stop());
      console.log("Recording stopped. Audio blob set.");
    };

    recorder.start();
    setChunks(localChunks);
    setMediaRecorder(recorder);
    setIsRecording(true);
    console.log("Recording started successfully.");
  } catch (err) {
    let userMessage = "Could not start recording: ";
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      userMessage += "Microphone access was denied. Please allow microphone access in your browser settings.";
    } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      userMessage += "No microphone was found. Please connect a microphone and try again.";
    } else if (err.name === 'NotReadableError') {
      userMessage += "Microphone is already in use by another application.";
    } else if (err.name === 'OverconstrainedError') {
      userMessage += "No microphone matches the requested constraints.";
    } else {
      userMessage += err.message;
    }
    setError(userMessage);
    console.error("Audio recording error:", err);
  }
};


  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const captureWebcamFrame = () => {
    return new Promise((resolve) => {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });
  };

  const handleNext = async () => {
    setIsAnalyzing(true);
    setError("");
    if (isRecording) {
      stopRecording();
      setPendingNext(true);
      return;
    }
    // If not recording, submit immediately (shouldn't happen, but fallback)
    submitAnswerWithAudio();
  };
  
  const submitFinalInterviewResult = async () => {
   
    try {
      const res = await fetch(`${API_BASE_URL}/api/submit_interview_result/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: userId,
          company: companyId,
          score: finalScore,
          pass_fail: finalPassed ? "Pass" : "Fail",
        }),
      });
      const data = await res.json();
      if (data.success) {
        console.log("Interview result saved!", data);
      } else {
        console.error("Failed to save interview result:", data);
      }
    } catch (err) {
      console.error("Error submitting interview result:", err);
    }
  };

  useEffect(() => {
    if (isInterviewFinished && finalScore !== null && finalPassed !== null && userId) {
      submitFinalInterviewResult();
    }
    // eslint-disable-next-line
  }, [isInterviewFinished, finalScore, finalPassed, userId]);

  
  const submitAnswerWithAudio = async () => {
    try {
      if (!audioBlob) {
        setError("No audio recorded for this answer. Please check your microphone.");
        setIsAnalyzing(false);
        setPendingNext(false);
        return;
      }

      const frameBlob = await captureWebcamFrame();

      const formData = new FormData();
      formData.append("session_id", sessionId);
      formData.append("question_number", currentIndex + 1);
      formData.append("current_question", JSON.stringify(questions[currentIndex]));
      formData.append("audio", audioBlob, "audio.webm");
      if (frameBlob) formData.append("frame", frameBlob, "frame.jpg");

      const res = await fetch(`${API_BASE_URL}/submit_answer/`, {
        method: "POST",
        body: formData,
      });

      const responseText = await res.text();
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error(`Server returned an invalid response (${res.status})`);
      }
      if (!res.ok) {
        throw new Error(data.error || `Server rejected the submission (${res.status})`);
      }

      const result = {
        question: questions[currentIndex],
        questionNumber: currentIndex + 1,
        sbert_score: data.sbert_score,
        deepface_result: data.deepface_result,
        transcription: data.transcription,
        reference_answer: data.reference_answer,
      };

      setAllResults((prev) => [...prev, result]);
      setAudioBlob(null); // Clear for next question
      setPendingNext(false);

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Calculate final results
        let totalScore = 0;
        let sbertSum = 0;
        allResults.concat([result]).forEach(r => {
          sbertSum += r.sbert_score || 0;
          let expr = "";
          if (r.deepface_result && typeof r.deepface_result === "object") {
            expr = r.deepface_result.dominant_emotion;
          } else if (Array.isArray(r.deepface_result)) {
            expr = r.deepface_result[0];
          } else {
            expr = r.deepface_result;
          }
          if (expr === "happy" || expr === "neutral") {
            totalScore += 4;
          } else if (expr === "surprise") {
            totalScore += 2;
          } else if (["angry", "disgust", "fear"].includes(expr)) {
            totalScore -= 1;
          }
        });
        const avgSbert = allResults.length ? sbertSum / allResults.length : 0;
        const passed = totalScore >= 20 && avgSbert >= 0.5;
        const mergedScore = totalScore + avgSbert * 100;
        setFinalScore(mergedScore);
        setFinalPassed(passed);
        setIsInterviewFinished(true);
      }
    } catch (err) {
      setError("Submission error: " + err.message);
      setPendingNext(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (questions.length === 0) return <div>Loading questions...</div>;

  const current = questions[currentIndex];

  if (isInterviewFinished) {
    // Calculate final result
    let totalScore = 0;
    let sbertSum = 0;

    allResults.forEach(r => {
      sbertSum += r.sbert_score || 0;
      let expr = "";
      if (r.deepface_result && typeof r.deepface_result === "object") {
        expr = r.deepface_result.dominant_emotion;
      } else if (Array.isArray(r.deepface_result)) {
        expr = r.deepface_result[0];
      } else {
        expr = r.deepface_result;
      }
      if (expr === "happy" || expr === "neutral") {
        totalScore += 4;
      } else if (expr === "surprise") {
        totalScore += 2;
      } else if (["angry", "disgust", "fear"].includes(expr)) {
        totalScore -= 1;
      }
    });

    const avgSbert = allResults.length ? sbertSum / allResults.length : 0;
    const passed = totalScore >= 20 && avgSbert >= 0.5;
    const mergedScore = totalScore + avgSbert * 100;

    return (
      <div className="ci-app">
        <div className="ci-container ci-final">
          <h1>Interview Complete</h1>
          <h2>
            Final Result: {" "}
            <span className={passed ? 'ci-pass' : 'ci-fail'}>{passed ? 'PASS' : 'FAIL'}</span>
          </h2>
          <div className="ci-card">
            <div className="ci-card-body">
              <p>Total Expression Score: {totalScore}</p>
              <p>Average Answer Score: {(avgSbert * 100).toFixed(1)}%</p>
              <p><b>Merged Final Score:</b> {mergedScore.toFixed(1)}</p>
            </div>
          </div>
          <div className="ci-spacer" />
          <div className="ci-card">
            <div className="ci-card-header">
              <div className="ci-title">Answer Breakdown</div>
              <div className="ci-subtle">{allResults.length} questions</div>
            </div>
            <div className="ci-card-body">
              <div className="ci-list">
                {allResults.map((r, i) => {
          let dominant = "";
          let scores = null;
          let dominantScore = null;

          if (r.deepface_result && typeof r.deepface_result === "object") {
            dominant = r.deepface_result.dominant_emotion;
            scores = r.deepface_result.emotion_scores;
            if (dominant && scores && typeof scores === "object" && dominant in scores) {
              dominantScore = scores[dominant];
            }
          } else if (Array.isArray(r.deepface_result)) {
            dominant = r.deepface_result.join(", ");
          } else {
            dominant = r.deepface_result;
          }

          // Handle error or no_frame cases
          let expressionDisplay = "";
          if (dominant === "error") {
            expressionDisplay = "Could not detect expression";
          } else if (dominant === "no_frame") {
            expressionDisplay = "No frame provided";
          } else if (dominant && dominantScore !== null) {
            expressionDisplay = `${dominant} (${(dominantScore * 100).toFixed(1)}%)`;
          } else if (dominant) {
            expressionDisplay = dominant;
          } else {
            expressionDisplay = "N/A";
          }

                  return (
                    <div className="ci-list-item" key={i}>
                      <p><b>Q{i + 1}:</b> {r.question.question}</p>
                      <p><b>Your Answer:</b> {r.transcription}</p>
                      <p><b>Reference:</b> {r.reference_answer}</p>
                      <p><b>Score:</b> {(r.sbert_score * 100).toFixed(1)}%</p>
                      <p><b>Expression:</b> {expressionDisplay}</p>
                      {scores && typeof scores === "object" && Object.keys(scores).length > 0 && (
                        <div>
                          <b>Scores:</b>
                          <ul>
                            {Object.entries(scores).map(([emo, score]) => (
                              <li key={emo}>
                                {emo}: {typeof score === "number" && !isNaN(score) ? (score * 100).toFixed(1) + "%" : "-"}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="ci-spacer" />
          <div className="ci-actions">
            <button className="ci-btn primary" onClick={() => navigate(`/company/${companyId}`)}>Submit</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ci-app">
      <div className="ci-container">
        <div className="ci-grid">
          <section className="ci-card">
            <div className="ci-card-header">
              <div className="ci-title">Interview Question {currentIndex + 1}</div>
              <div className="ci-subtle">Session #{sessionId}</div>
            </div>
            <div className="ci-card-body ci-qa">
              <div className="ci-chip">
                <span>Subject</span>
                <span>•</span>
                <span>{current.subject}</span>
              </div>
              <div className="ci-question">
                <b>Q:</b> {current.question}
              </div>
              <div className="ci-actions">
                <button className="ci-btn primary" onClick={handleNext} disabled={isAnalyzing}>
                  {isAnalyzing ? 'Analyzing...' : 'Submit'}
                </button>
                <span className="ci-hint">Your audio is recorded automatically. Click Submit when done.</span>
              </div>
              {error && (
                <div className="ci-error">🚫 {error}</div>
              )}
            </div>
          </section>

          <section className="ci-card">
            <div className="ci-card-header">
              <div className="ci-title">Camera</div>
              <div className="ci-subtle">Live Preview</div>
            </div>
            <div className="ci-card-body">
              <div className="ci-video-wrap">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="ci-video"
                  width={640}
                  height={480}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CameraInterview;