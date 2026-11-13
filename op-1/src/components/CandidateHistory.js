import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

const CandidateHistory = () => {
  const { email } = useParams();
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get('company_id');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!companyId || !email) {
      setError('Missing company ID or candidate email.');
      setLoading(false);
      return;
    }
    setLoading(true);
    axios
      .get(`http://localhost:8000/api/hr/interview-history/?company_id=${companyId}`)
      .then((res) => {
        // Find the candidate by email
        const candidate = res.data.find((u) => u.email === email);
        setHistory(candidate ? candidate.attempts : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch candidate history.');
        setLoading(false);
      });
  }, [companyId, email]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-4">
        <Link to="/hr-dashboard" className="text-blue-600 hover:underline">&larr; Back to HR Dashboard</Link>
      </div>
      <h1 className="text-3xl font-bold mb-4">Interview History for {email}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : history.length === 0 ? (
        <div className="text-gray-500">No interview attempts found for this candidate.</div>
      ) : (
        <table className="w-full text-left border bg-white rounded-lg shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Attempt #</th>
              <th className="py-2 px-4 border-b">Score</th>
              <th className="py-2 px-4 border-b">Pass/Fail</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Round Type</th>
            </tr>
          </thead>
          <tbody>
            {history.map((attempt, idx) => (
              <tr key={idx}>
                <td className="py-2 px-4 border-b">{attempt.attempt_number}</td>
                <td className="py-2 px-4 border-b">{attempt.score}</td>
                <td className="py-2 px-4 border-b">{attempt.pass_fail}</td>
                <td className="py-2 px-4 border-b">{new Date(attempt.date).toLocaleString()}</td>
                <td className="py-2 px-4 border-b">{attempt.round_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CandidateHistory;
