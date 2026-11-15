import API_BASE_URL from '../apiConfig.js';
import React, { useState, useEffect } from "react";

const subjects = [
  { name: "Python", icon: "🐍", color: "bg-blue-100 text-blue-800" },
  { name: "Java", icon: "☕", color: "bg-red-100 text-red-800" },
  { name: "JavaScript", icon: "📜", color: "bg-yellow-100 text-yellow-800" },
  { name: "React", icon: "⚛️", color: "bg-cyan-100 text-cyan-800" },
  { name: "SQL", icon: "🗃️", color: "bg-purple-100 text-purple-800" },
  { name: "CSS", icon: "🎨", color: "bg-indigo-100 text-indigo-800" },
  { name: "OS", icon: "💻", color: "bg-gray-100 text-gray-800" },
  { name: "C++", icon: "➕", color: "bg-blue-200 text-blue-900" },
];

const difficultyColors = {
  Easy: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Hard: "bg-red-100 text-red-800"
};

export default function Practice() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [showAptitude, setShowAptitude] = useState(false);
  const [aptitudeQuestions, setAptitudeQuestions] = useState([]);
  const [aptitudeAnswers, setAptitudeAnswers] = useState({});
  const [aptitudeResults, setAptitudeResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("subjects");
  const [progress, setProgress] = useState(0);

  const sanitizeQuestionText = (text) => {
    if (!text) return text;
    return String(text).replace(/^\s*(Q\s*\d+[:.-]\s*)?/i, "").replace(/^\s*\d+[).:\-]\s*/, "");
  };

  const fetchQuestions = async (subject) => {
    setSelectedSubject(subject);
    setFeedback({});
    setAnswers({});
    setShowAptitude(false);
    setActiveTab("questions");
    setLoading(true);
    setProgress(30);
    try {
      const res = await fetch(`${API_BASE_URL}/api/practice-questions/?subject=${encodeURIComponent(subject)}`);
      const data = await res.json();
      const cleaned = data.slice(0, 10).map((q) => ({
        ...q,
        question: sanitizeQuestionText(q.question),
      }));
      setQuestions(cleaned);
      setProgress(80);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
    } finally {
      setLoading(false);
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const fetchAptitudeQuestions = async () => {
    setShowAptitude(true);
    setSelectedSubject("");
    setQuestions([]);
    setActiveTab("aptitude");
    setLoading(true);
    setProgress(30);
    try {
      const res = await fetch(`${API_BASE_URL}/api/aptitude-questions/`);
      const data = await res.json();
      setAptitudeQuestions(data);
      setAptitudeAnswers({});
      setAptitudeResults({});
      setProgress(80);
    } catch (error) {
      console.error('Error fetching aptitude questions:', error);
      setAptitudeQuestions([
        {
          question: "If a train travels at 60 km/h, how long will it take to travel 300 km?",
          options: ["4 hours", "5 hours", "6 hours", "7 hours"],
          correct: 1,
          category: "Time and Distance",
          difficulty: "Easy"
        },
        {
          question: "What is 25% of 200?",
          options: ["25", "50", "75", "100"],
          correct: 1,
          category: "Percentage",
          difficulty: "Easy"
        },
        {
          question: "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies?",
          options: ["True", "False", "Uncertain", "None of the above"],
          correct: 0,
          category: "Logical Reasoning",
          difficulty: "Medium"
        }
      ]);
    } finally {
      setLoading(false);
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const handleAnswerChange = (idx, value) => {
    setAnswers((prev) => ({ ...prev, [idx]: value }));
  };

  const handleSubmit = async (idx) => {
    const answer = answers[idx] || "";
    try {
      const res = await fetch(`${API_BASE_URL}/api/evaluate-answer/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questions[idx].question,
          answer,
          reference_answer: questions[idx].answer,
        }),
      });
      if (!res.ok) {
        throw new Error('Evaluation request failed');
      }
      const data = await res.json();
      setFeedback((prev) => ({ ...prev, [idx]: data }));
    } catch (error) {
      console.error('Error evaluating answer:', error);
      // Smart client-side fallback evaluator so the user always receives helpful feedback
      const ref = questions[idx]?.answer || "";
      let score = 50;
      let feedbackMsg = "Good attempt!";
      if (!answer.trim()) {
        score = 0;
        feedbackMsg = "Please provide an answer before submitting.";
      } else {
        const uLower = answer.toLowerCase();
        const rLower = ref.toLowerCase();
        const rWords = rLower.split(/\s+/).filter(w => w.length > 3);
        const matchCount = rWords.filter(w => uLower.includes(w)).length;
        const matchRatio = rWords.length > 0 ? matchCount / rWords.length : 0.5;
        score = Math.min(100, Math.max(30, Math.round(matchRatio * 100)));
        if (score >= 80) feedbackMsg = "Excellent answer! Very relevant and comprehensive.";
        else if (score >= 60) feedbackMsg = "Good answer, covers the key points well.";
        else feedbackMsg = "Some relevance, but check the reference answer for key details.";
      }
      setFeedback((prev) => ({ 
        ...prev, 
        [idx]: { 
          score: `${score}%`, 
          feedback: feedbackMsg,
          reference_answer: questions[idx]?.answer || ""
        } 
      }));
    }
  };

  const handleAptitudeAnswer = (questionIdx, optionIdx) => {
    setAptitudeAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
  };

  const handleAptitudeSubmit = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/evaluate-aptitude/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: aptitudeAnswers,
          questions: aptitudeQuestions,
        }),
      });
      const data = await res.json();
      setAptitudeResults(data.results);
      
      // Show a beautiful modal with results
      const percentage = data.percentage || 
        Math.round((Object.values(data.results).filter(r => r.isCorrect).length / aptitudeQuestions.length) * 100);
      const passed = percentage >= 60;
      
      const modal = document.getElementById('results-modal');
      if (modal) {
        modal.classList.remove('hidden');
      }
    } catch (error) {
      console.error('Error evaluating aptitude test:', error);
      const results = {};
      aptitudeQuestions.forEach((q, idx) => {
        const userAnswer = aptitudeAnswers[idx];
        const isCorrect = userAnswer === q.correct;
        results[idx] = {
          isCorrect,
          userAnswer: userAnswer !== undefined ? q.options[userAnswer] : "Not answered",
          correctAnswer: q.options[q.correct],
          score: isCorrect ? 1 : 0
        };
      });
      setAptitudeResults(results);
      
      const percentage = Math.round((Object.values(results).filter(r => r.isCorrect).length / aptitudeQuestions.length) * 100);
      const passed = percentage >= 60;
      
      const modal = document.getElementById('results-modal');
      if (modal) {
        modal.classList.remove('hidden');
      }
    }
  };

  const closeModal = () => {
    const modal = document.getElementById('results-modal');
    modal.classList.add('hidden');
  };

  const calculateResults = () => {
    if (aptitudeQuestions.length === 0) return { score: 0, total: 0, percentage: 0 };
    
    const correct = Object.values(aptitudeResults).filter(r => r.isCorrect).length;
    const total = aptitudeQuestions.length;
    const percentage = Math.round((correct / total) * 100);
    const passed = percentage >= 60;
    
    return { correct, total, percentage, passed };
  };

  const results = calculateResults();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Progress bar */}
      {progress > 0 && (
        <div className="fixed top-0 left-0 right-0 h-1.5 bg-gray-200 z-50">
          <div 
            className="h-full bg-blue-600 transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* Results Modal */}
      <div id="results-modal" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-bold text-gray-800">Test Results</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <div className={`mx-auto flex items-center justify-center h-24 w-24 rounded-full ${results.passed ? 'bg-green-100' : 'bg-red-100'}`}>
                <span className={`text-3xl font-bold ${results.passed ? 'text-green-600' : 'text-red-600'}`}>
                  {results.percentage}%
                </span>
              </div>
              
              <h4 className={`mt-4 text-xl font-semibold ${results.passed ? 'text-green-600' : 'text-red-600'}`}>
                {results.passed ? 'Congratulations!' : 'Keep Practicing!'}
              </h4>
              <p className="mt-2 text-gray-600">
                You scored {results.correct} out of {results.total} questions
              </p>
              
              <div className="mt-6 w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${results.passed ? 'bg-green-600' : 'bg-red-600'}`} 
                  style={{ width: `${results.percentage}%` }}
                ></div>
              </div>
              
              <button
                onClick={closeModal}
                className={`mt-6 w-full py-3 px-4 rounded-md text-white font-medium ${results.passed ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 ${results.passed ? 'focus:ring-green-500' : 'focus:ring-red-500'} transition-colors`}
              >
                {results.passed ? 'Continue' : 'Try Again'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Interview Preparation Hub
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Master technical subjects and aptitude tests to excel in your next interview
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
            <button
              onClick={() => { setShowAptitude(false); setSelectedSubject(""); setQuestions([]); setActiveTab("subjects"); }}
              className={`px-6 py-3 text-sm font-medium ${activeTab === "subjects" || activeTab === "questions" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"} transition-colors`}
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Technical Practice
              </span>
            </button>
            <button
              onClick={fetchAptitudeQuestions}
              className={`px-6 py-3 text-sm font-medium ${activeTab === "aptitude" ? "bg-gradient-to-r from-green-600 to-teal-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"} transition-colors`}
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Aptitude Test
              </span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-flex flex-col items-center">
              <div className="relative w-20 h-20 mb-4">
                <svg className="animate-spin absolute inset-0 h-full w-full text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="h-10 w-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <span className="text-lg font-medium text-gray-600">Preparing your questions...</span>
              <p className="mt-2 text-gray-500">This will just take a moment</p>
            </div>
          </div>
        )}

        {/* Subject Selection */}
        {activeTab === "subjects" && !loading && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Select a Technical Subject</h2>
              <p className="text-gray-600 text-center mb-6">Choose a topic to practice interview questions</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {subjects.map((subject, index) => (
                  <button
                    key={subject.name}
                    onClick={() => fetchQuestions(subject.name)}
                    className={`group relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300 bg-white transform hover:-translate-y-1`}
                  >
                    <div className="p-5">
                      <div className="flex justify-center mb-3">
                        <div className={`h-14 w-14 rounded-full ${subject.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                          {subject.icon}
                        </div>
                      </div>
                      <h3 className="text-center font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                        {subject.name}
                      </h3>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Subject Questions */}
        {activeTab === "questions" && questions.length > 0 && !loading && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                      {selectedSubject}
                    </span> Practice
                  </h2>
                  <p className="text-gray-600">Answer these questions as you would in an interview</p>
                </div>
                <div className="mt-3 sm:mt-0 flex items-center space-x-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {questions.length} Questions
                  </span>
                  <button 
                    onClick={() => { setActiveTab("subjects"); setQuestions([]); }}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-full text-sm font-medium bg-white text-gray-700 hover:bg-gray-50"
                  >
                    Change Subject
                  </button>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {questions.map((q, idx) => (
                <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 rounded-xl p-3 mr-4">
                      <span className="text-blue-800 font-bold text-lg">{idx + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 leading-snug">{q.question}</h3>
                      <div className="relative">
                        <textarea
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm"
                          rows={4}
                          value={answers[idx] || ""}
                          onChange={(e) => handleAnswerChange(idx, e.target.value)}
                          placeholder="Type your detailed answer here..."
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                          {answers[idx]?.length || 0} characters
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleSubmit(idx)}
                          disabled={!answers[idx]}
                          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${answers[idx] ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150`}
                        >
                          <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                          </svg>
                          Submit Answer
                        </button>
                      </div>
                      {feedback[idx] && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 animate-fade-in">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h3 className="text-sm font-medium text-blue-800">Feedback</h3>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Score: {feedback[idx].score}
                                </span>
                              </div>
                              <div className="text-sm text-blue-700">
                                <p className="mb-2">{feedback[idx].feedback}</p>
                                <details className="mt-2">
                                  <summary className="font-medium text-blue-800 cursor-pointer">View Reference Answer</summary>
                                  <div className="mt-2 p-3 bg-white rounded border border-blue-100">
                                    <p className="text-gray-800">{feedback[idx].reference_answer}</p>
                                  </div>
                                </details>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Aptitude Questions */}
        {activeTab === "aptitude" && aptitudeQuestions.length > 0 && !loading && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-teal-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">
                      Aptitude Test
                    </span>
                  </h2>
                  <p className="text-gray-600">Test your problem-solving and reasoning skills</p>
                </div>
                <div className="mt-3 sm:mt-0 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {aptitudeQuestions.length} Questions
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    60% to Pass
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    {aptitudeQuestions.filter(q => q.category).reduce((acc, q) => {
                      acc[q.category] = (acc[q.category] || 0) + 1;
                      return acc;
                    }, {})['Logical Reasoning'] || 0} Logical
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {aptitudeQuestions.filter(q => q.category).reduce((acc, q) => {
                      acc[q.category] = (acc[q.category] || 0) + 1;
                      return acc;
                    }, {})['Quantitative'] || 0} Quantitative
                  </span>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {aptitudeQuestions.map((q, idx) => (
                <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-green-100 rounded-xl p-3 mr-4">
                      <span className="text-green-800 font-bold text-lg">{idx + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-800 leading-snug">{q.question}</h3>
                        <div className="mt-2 sm:mt-0 flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {q.category || "General"}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyColors[q.difficulty] || difficultyColors['Medium']}`}>
                            {q.difficulty || "Medium"}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3 mt-4">
                        {q.options.map((option, optionIdx) => (
                          <div key={optionIdx} className="flex items-center">
                            <input
                              id={`question-${idx}-option-${optionIdx}`}
                              name={`question-${idx}`}
                              type="radio"
                              className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                              checked={aptitudeAnswers[idx] === optionIdx}
                              onChange={() => handleAptitudeAnswer(idx, optionIdx)}
                            />
                            <label 
                              htmlFor={`question-${idx}-option-${optionIdx}`} 
                              className={`ml-3 block text-sm font-medium ${aptitudeAnswers[idx] === optionIdx ? 'text-green-700' : 'text-gray-700'}`}
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                      {aptitudeResults[idx] && (
                        <div className={`mt-4 p-4 rounded-lg border-l-4 ${aptitudeResults[idx].isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'} animate-fade-in`}>
                          <div className="flex">
                            <div className="flex-shrink-0">
                              {aptitudeResults[idx].isCorrect ? (
                                <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <div className="ml-3">
                              <h3 className={`text-sm font-medium ${aptitudeResults[idx].isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                                {aptitudeResults[idx].isCorrect ? 'Correct!' : 'Incorrect'}
                              </h3>
                              <div className="mt-1 text-sm space-y-1">
                                <p className={aptitudeResults[idx].isCorrect ? 'text-green-700' : 'text-red-700'}>
                                  Your answer: <span className="font-medium">{aptitudeResults[idx].userAnswer}</span>
                                </p>
                                {!aptitudeResults[idx].isCorrect && (
                                  <p className="text-green-700">
                                    Correct answer: <span className="font-medium">{aptitudeResults[idx].correctAnswer}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-center">
              <button
                onClick={handleAptitudeSubmit}
                disabled={Object.keys(aptitudeAnswers).length !== aptitudeQuestions.length}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${Object.keys(aptitudeAnswers).length === aptitudeQuestions.length ? 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700' : 'bg-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors`}
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Submit Test
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {activeTab === "questions" && questions.length === 0 && !loading && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden text-center py-16">
            <div className="mx-auto max-w-md px-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No questions selected</h3>
              <p className="mt-1 text-sm text-gray-500">Choose a subject from the technical practice tab to get started.</p>
              <div className="mt-6">
                <button
                  onClick={() => setActiveTab("subjects")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Browse Subjects
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}