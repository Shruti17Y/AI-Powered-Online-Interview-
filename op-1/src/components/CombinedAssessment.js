import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAptitude } from '../context/AptitudeContext.js';
import Aptitude from './Aptitude.js';
import CameraInterview from './CameraInterview.js';

export default function CombinedAssessment() {
  const [searchParams] = useSearchParams();
  const { setPassedAptitude } = useAptitude();

  const [startedInterview, setStartedInterview] = useState(false);
  const [companyId, setCompanyId] = useState(searchParams.get('companyId') || null);
  const [skills, setSkills] = useState(() => {
    const s = searchParams.get('skills');
    return s ? s.split(',').map(x => x.trim()).filter(Boolean) : [];
  });

  const handlePass = ({ score, companyId: cid, skills: sk }) => {
    setPassedAptitude(true);
    if (cid) setCompanyId(cid);
    if (sk) setSkills(typeof sk === 'string' ? sk.split(',').map(x => x.trim()) : sk);
    setStartedInterview(true);
  };

  const handleFail = () => {
    setPassedAptitude(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!startedInterview ? (
        <Aptitude onPass={handlePass} onFail={handleFail} />
      ) : (
        <div className="max-w-6xl mx-auto p-4">
          <CameraInterview companyId={companyId} skills={skills} />
        </div>
      )}
    </div>
  );
}
