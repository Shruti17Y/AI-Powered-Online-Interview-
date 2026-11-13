// // import React from 'react';
// // import axios from 'axios';
// // import { useAuth } from '../context/AuthContext';

// // function InterviewPage() {
// //   const { user } = useAuth();

// //   const handleJoinInterview = () => {
// //     // Add these debug logs
// //     console.log('=== BUTTON CLICKED ===');
// //     console.log('Current user:', user);
// //     console.log('User email:', user?.email);
// //     console.log('User name:', user?.name);
    
// //     if (!user || !user.email) {
// //       console.log('ERROR: No user or email found!');
// //       alert('No user logged in or email not found!');
// //       return;
// //     }

// //     console.log('About to send API request...');
    
// //     axios.post('http://localhost:5000/api/schedule-interview', {
// //       email: user.email,
// //       name: user.name
// //     })
// //     .then(res => {
// //       console.log('SUCCESS: API response:', res.data);
// //       alert('Thank you email sent!');
// //     })
// //     .catch(err => {
// //       console.log('ERROR: API call failed:', err);
// //       alert('Failed to send email');
// //     });
// //   };

// //   return (
// //     <div className="container mx-auto px-4 py-8">
// //       <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
// //         <h2 className="text-2xl font-bold mb-4 text-center">Interview Page</h2>
// //         <div className="mb-4 p-3 bg-gray-100 rounded">
// //           <p className="text-sm text-gray-600">Logged in as:</p>
// //           <p className="font-medium">{user?.email || 'No user'}</p>
// //         </div>
// //         <button 
// //           onClick={handleJoinInterview}
// //           className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
// //         >
// //           Schedule Interview
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // export default InterviewPage;
import React, { useState, useEffect } from "react";
import axios from "axios";

const InterviewPage = () => {
  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [answer, setAnswer] = useState("");
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/start_interview/", { method: "POST" })
      .then(res => res.json())
      .then(data => {
        setQuestion(data.question);
        setSessionId(data.session_id);
        setQuestionNumber(data.question_number);
      });
  }, []);

  const handleSubmit = async () => {
    const res = await axios.post("http://127.0.0.1:8000/submit_answer/", {
      session_id: sessionId,
      answer,
      question_number: questionNumber,
    });
    setAnswer("");
    if (res.data.finished) {
      setFinished(true);
    } else {
      setQuestion(res.data.next_question);
      setQuestionNumber(res.data.question_number);
    }
  };

  if (finished) {
    return <div>Interview finished!</div>;
  }

  return (
    <div>
      <h2>Question {questionNumber}</h2>
      {question ? (
        <>
          <p><strong>Subject:</strong> {question.subject}</p>
          <p><strong>Question:</strong> {question.question}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
      <textarea value={answer} onChange={e => setAnswer(e.target.value)} />
      <button onClick={handleSubmit} disabled={!answer}>Next</button>
    </div>
  );
};

export default InterviewPage;