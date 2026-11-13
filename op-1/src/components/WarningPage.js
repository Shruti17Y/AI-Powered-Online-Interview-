import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAptitude } from '../context/AptitudeContext.js';

function WarningPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { passedAptitude } = useAptitude();

  // If someone lands here without passing aptitude, send them back (avoid navigating during render)
  useEffect(() => {
    if (passedAptitude) return;
    const t = setTimeout(() => {
      if (!passedAptitude) {
        navigate('/aptitude' + (location.search || ''), { replace: true });
      }
    }, 120);
    return () => clearTimeout(t);
  }, [passedAptitude, navigate, location.search]);

  const handleAgree = () => {
    const qs = location.search || '';
    navigate('/camera-interview' + qs);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white border border-gray-200 rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0 mr-3">
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-amber-100 text-amber-700 text-xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Before You Start Your Camera Interview</h1>
        </div>

        <p className="text-gray-600 mb-4">
          Please read and acknowledge the following rules to maintain integrity during the interview:
        </p>

        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
          <li>Make sure you are alone and in a quiet, well‑lit environment.</li>
          <li>Keep your face centered and clearly visible to the camera.</li>
          <li>Multiple faces in the frame will trigger warnings and may terminate the interview.</li>
          <li>Do not switch tabs or use external help during the interview.</li>
          <li>Grant your browser access to camera and microphone when prompted.</li>
        </ul>

        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 mb-6">
          <b>Note:</b> You will be recorded for analysis and proctoring purposes. By continuing, you consent to the use of your audio/video during this session.
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => navigate('/aptitude')}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Go Back
          </button>
          <button
            onClick={handleAgree}
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            I Understand, Start Interview
          </button>
        </div>
      </div>
    </div>
  );
}

export default WarningPage;
