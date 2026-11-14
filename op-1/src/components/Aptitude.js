

import API_BASE_URL from '../apiConfig.js';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAptitude } from '../context/AptitudeContext.js';
import { useAuth } from '../context/AuthContext.js';

const QUESTIONS = [
  // { q: 'What is the capital of France?', options: ['Paris', 'London', 'Berlin', 'Madrid'], answer: 0 },

  { q: 'Which is a prime number?', options: ['4', '6', '9', '7'], answer: 3 },
  { q: '2 + 2 = ?', options: ['3', '4', '5', '6'], answer: 1 },
  // { q: 'Largest planet in solar system?', options: ['Earth', 'Mars', 'Jupiter', 'Venus'], answer: 2 },
  // { q: 'H2O is the chemical formula for?', options: ['Oxygen', 'Hydrogen', 'Water', 'Salt'], answer: 2 },
  // { q: 'Who wrote Hamlet?', options: ['Shakespeare', 'Dickens', 'Austen', 'Tolkien'], answer: 0 },
  // { q: 'Fastest land animal?', options: ['Lion', 'Cheetah', 'Tiger', 'Horse'], answer: 1 },
  // { q: 'Which is a mammal?', options: ['Shark', 'Dolphin', 'Octopus', 'Penguin'], answer: 1 },
];

const PASS_PERCENTAGE = 60;

export default function Aptitude({ onPass, onFail }) {
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setPassedAptitude } = useAptitude();
  const { user } = useAuth();
  const [submitError, setSubmitError] = useState("");
  const companyId = searchParams.get('companyId');
  const skills = searchParams.get('skills');
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Proceed button handler to show the Warning page before the interview
  const handleProceedToWarning = () => {
    if (typeof onPass === 'function') {
      onPass({ companyId, skills });
    } else {
      let url = '/warning';
      const params = [];
      if (companyId) params.push(`companyId=${companyId}`);
      if (skills) params.push(`skills=${encodeURIComponent(skills)}`);
      if (params.length) url += '?' + params.join('&');
      navigate(url);
    }
  };

  const handleOptionChange = (qIdx, optIdx) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[qIdx] = optIdx;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    let correct = 0;
    QUESTIONS.forEach((q, idx) => {
      if (answers[idx] === q.answer) correct++;
    });
    const percent = (correct / QUESTIONS.length) * 100;
    setScore(percent);
    setSubmitted(true);
    const didPass = percent >= PASS_PERCENTAGE;
    setPassed(didPass);
    setPassedAptitude(didPass);
    
    try {
      await fetch(`${API_BASE_URL}/api/submit_aptitude_result/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: user?.id,
          company: companyId,
          score: percent,
          pass_fail: didPass ? 'Pass' : 'Fail',
          timestamp: new Date().toISOString(),
        })
      });
    } catch (err) {
      setSubmitError('Failed to save aptitude result.');
    }
    
    if (!didPass) {
      if (typeof onFail === 'function') {
        onFail({ score: percent });
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Premium Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute -right-20 top-1/2 w-60 h-60 bg-white/5 rounded-full"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold">Aptitude Assessment</h1>
            <p className="opacity-90 mt-1">Demonstrate your knowledge and skills</p>
            <div className="flex items-center mt-4">
              <div className="flex-1 bg-white/20 h-1 rounded-full">
                <div 
                  className="bg-white h-1 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="ml-3 font-medium">
                {currentQuestion + 1}/{QUESTIONS.length}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {!submitted ? (
            <div className="space-y-8">
              {/* Question Card */}
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    Question {currentQuestion + 1}
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round(progress)}% complete
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {QUESTIONS[currentQuestion].q}
                </h3>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {QUESTIONS[currentQuestion].options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleOptionChange(currentQuestion, oIdx)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      answers[currentQuestion] === oIdx
                        ? 'border-indigo-500 bg-indigo-50 shadow-md'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-6 w-6 rounded-full border flex items-center justify-center mr-3 ${
                        answers[currentQuestion] === oIdx
                          ? 'border-indigo-500 bg-indigo-500 text-white'
                          : 'border-gray-300'
                      }`}>
                        {answers[currentQuestion] === oIdx && (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </div>
                      <span className="text-gray-700 font-medium">{opt}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <button
                  onClick={handlePrev}
                  disabled={currentQuestion === 0}
                  className={`px-6 py-3 rounded-lg flex items-center ${
                    currentQuestion === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                  Previous
                </button>
                
                {currentQuestion < QUESTIONS.length - 1 ? (
                  <button
                    onClick={handleNext}
                    disabled={answers[currentQuestion] === null}
                    className={`px-6 py-3 rounded-lg flex items-center ${
                      answers[currentQuestion] === null
                        ? 'bg-indigo-300 text-white cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                    }`}
                  >
                    Next
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={answers.includes(null)}
                    className={`px-8 py-3 rounded-lg flex items-center ${
                      answers.includes(null)
                        ? 'bg-indigo-300 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg shadow-md'
                    }`}
                  >
                    Submit Assessment
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className={`mx-auto w-32 h-32 rounded-full flex items-center justify-center ${
                passed ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {passed ? (
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                ) : (
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                )}
              </div>
              
              <h3 className={`text-3xl font-bold mt-6 ${
                passed ? 'text-green-600' : 'text-red-600'
              }`}>
                {passed ? 'Congratulations!' : 'Assessment Failed'}
              </h3>
              
              <div className="mt-6 mx-auto max-w-md bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Your Score:</span>
                  <span className="text-2xl font-bold text-indigo-600">{score.toFixed(1)}%</span>
                </div>
                <div className="mt-4 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      passed ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>0%</span>
                  <span>{PASS_PERCENTAGE}% to pass</span>
                  <span>100%</span>
                </div>
              </div>
              
              <div className="mt-8">
                {passed ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-green-50 border border-green-100 rounded-xl p-4 inline-block">
                      <p className="text-green-700 font-medium">
                        You've qualified for the next round.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleProceedToWarning}
                      className="px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow"
                    >
                      Show Warning & Continue
                    </button>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 inline-block">
                    <p className="text-red-700 font-medium">
                      Minimum {PASS_PERCENTAGE}% required to qualify
                    </p>
                  </div>
                )}
              </div>
              
              {submitError && (
                <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-xl p-4 inline-block">
                  <p className="text-yellow-700">{submitError}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}