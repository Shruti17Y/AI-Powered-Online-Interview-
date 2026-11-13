import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

const CompanyInterviewHistory = () => {
  const { companyId } = useParams();
  const [searchParams] = useSearchParams();
  const companyName = searchParams.get('name') || '';
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!companyId) {
      setError('Missing company ID.');
      setLoading(false);
      return;
    }
    setLoading(true);
    axios
      .get(`http://localhost:8000/api/hr/interview-history/?company_id=${companyId}`)
      .then((res) => {
        const raw = Array.isArray(res.data) ? res.data : [];
        // Sort users (by email) and each user's attempts (by attempt_number, else by date)
        const sorted = raw
          .map((user) => {
            const attempts = Array.isArray(user.attempts) ? [...user.attempts] : [];
            attempts.sort((a, b) => {
              const aNum = Number(a?.attempt_number ?? a?.attempt);
              const bNum = Number(b?.attempt_number ?? b?.attempt);
              const aNumValid = Number.isFinite(aNum);
              const bNumValid = Number.isFinite(bNum);
              if (aNumValid && bNumValid) return aNum - bNum; // ascending sequence
              // Fallback to date ascending if numbers are missing
              const aDate = new Date(a?.date || 0).getTime();
              const bDate = new Date(b?.date || 0).getTime();
              return aDate - bDate;
            });
            return { ...user, attempts };
          })
          .sort((u1, u2) => (u1?.email || '').localeCompare(u2?.email || ''));
        setInterviewHistory(sorted);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch interview history.');
        setLoading(false);
      });
  }, [companyId]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-4">
        <Link to="/hr-dashboard" className="text-blue-600 hover:underline">&larr; Back to HR Dashboard</Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">Interview Results &amp; History {companyName ? `for ${companyName}` : ''}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : interviewHistory.length === 0 ? (
        <div className="text-gray-500">No interview results found for this company.</div>
      ) : (
        <div className="space-y-8">
          {interviewHistory.map(user => (
            <div key={user.email} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{user.email}</span>
                <a
                  href={`/hr/candidate-history/${encodeURIComponent(user.email)}?company_id=${companyId}`}
                  className="text-blue-600 hover:underline text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View History
                </a>
              </div>
              <table className="w-full text-left border mb-2">
                <thead>
                  <tr>
                    <th className="py-1 px-2 border-b">Attempt #</th>
                    <th className="py-1 px-2 border-b">Score</th>
                    <th className="py-1 px-2 border-b">Pass/Fail</th>
                    <th className="py-1 px-2 border-b">Date</th>
                    <th className="py-1 px-2 border-b">Round Type</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const attempts = Array.isArray(user.attempts) ? user.attempts : [];
                    // Since we sort ascending in useEffect, latest is the last
                    const latest = attempts[attempts.length - 1];
                    if (!latest) return (
                      <tr>
                        <td className="py-1 px-2 border-b" colSpan={5}>No attempts yet.</td>
                      </tr>
                    );
                    return (
                      <tr>
                        <td className="py-1 px-2 border-b">{latest.attempt_number ?? latest.attempt ?? '-'}</td>
                        <td className="py-1 px-2 border-b">{latest.score}</td>
                        <td className="py-1 px-2 border-b">{latest.pass_fail}</td>
                        <td className="py-1 px-2 border-b">{latest.date ? new Date(latest.date).toLocaleString() : '-'}</td>
                        <td className="py-1 px-2 border-b">{latest.round_type}</td>
                      </tr>
                    );
                  })()}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyInterviewHistory;
