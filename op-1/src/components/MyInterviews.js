import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.js";

export default function MyInterviews() {

  const [interviewData, setInterviewData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchInterviewData(user.id);
    } else {
      setInterviewData([]);
      setLoading(false);
      setError("You must be logged in to view your interview history.");
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchInterviewData = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://127.0.0.1:8000/api/my-interviews/?user_id=${userId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setInterviewData([]);
          setError("No interview history found for this user.");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setInterviewData(data);
    } catch (err) {
      console.error("Error fetching interview data:", err);
      setError("Failed to load interview data. Please try again later.");
      setInterviewData([]);
    } finally {
      setLoading(false);
    }
  };

  // Group interview results by company and attempt number (robust version)
  function groupByCompanyAndAttempt(data) {
    const grouped = {};
    data.forEach(item => {
      const companyName = item.company;
      const attempt = Number(item.attempt_number); // Ensure number
      if (!grouped[companyName]) grouped[companyName] = {};
      if (!grouped[companyName][attempt]) grouped[companyName][attempt] = [];
      grouped[companyName][attempt].push(item);
    });
    // Convert to array for easier rendering, sort attempts numerically
    return Object.entries(grouped).map(([companyName, attempts]) => ({
      companyName,
      attempts: Object.entries(attempts)
        .map(([attemptNumber, rounds]) => ({
          attemptNumber: Number(attemptNumber),
          rounds: rounds.sort((a, b) => new Date(a.date) - new Date(b.date)), // sort rounds by date
        }))
        .sort((a, b) => a.attemptNumber - b.attemptNumber)
    }));
  }

  // Load jsPDF from CDN once and cache it
  let jsPdfLoadingPromise = null;
  function loadJsPDF() {
    if (window.jspdf && window.jspdf.jsPDF) return Promise.resolve(window.jspdf.jsPDF);
    if (jsPdfLoadingPromise) return jsPdfLoadingPromise;
    jsPdfLoadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.async = true;
      script.onload = () => {
        if (window.jspdf && window.jspdf.jsPDF) {
          resolve(window.jspdf.jsPDF);
        } else {
          reject(new Error('jsPDF failed to load'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load jsPDF'));
      document.body.appendChild(script);
    });
    return jsPdfLoadingPromise;
  }

  

  // Generate a true PDF file client-side using jsPDF
  async function downloadCompanyPdf(companyGroup) {
    try {
      const jsPDF = await loadJsPDF();
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const left = 48; // 0.67in
      const right = 547; // a4 width 595pt - 48pt margin
      const width = right - left;
      let y = 56;

      // Compute summary stats
      const allRounds = companyGroup.attempts.flatMap(a => a.rounds || []);
      const numericScores = allRounds
        .map(r => (typeof r.score === 'number' ? r.score : null))
        .filter(v => v !== null);
      const avgScore = numericScores.length
        ? (numericScores.reduce((s, v) => s + v, 0) / numericScores.length).toFixed(1)
        : '-';
      const passCount = allRounds.filter(r => r.pass_fail === 'Pass').length;
      const failCount = allRounds.filter(r => r.pass_fail === 'Fail').length;
      const roundsCount = allRounds.length;
      const attemptsCount = companyGroup.attempts.length;

      const addHeader = () => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text(`Interview Report - ${companyGroup.companyName}`, left, y);
        y += 18;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(100);
        // User email line
        const email = (typeof user?.email === 'string' && user.email) ? user.email : (user?.username || 'Unknown user');
        const uid = (user?.id != null) ? ` (ID: ${user.id})` : '';
        doc.text(`User: ${email}${uid}`, left, y);
        y += 14;
        doc.text(`Generated on ${new Date().toLocaleString()}`, left, y);
        doc.setTextColor(0);
        y += 16;
        // Summary line
        doc.setTextColor(80);
        doc.text(`Summary: Attempts ${attemptsCount} • Rounds ${roundsCount} • Avg Score ${avgScore} • Pass ${passCount} • Fail ${failCount}`, left, y);
        doc.setTextColor(0);
        y += 18;
      };

      const ensureSpace = (needed) => {
        const pageHeight = doc.internal.pageSize.getHeight();
        if (y + needed > pageHeight - 48) {
          doc.addPage();
          y = 56;
          addHeader();
        }
      };

      addHeader();

      const drawTableHeader = () => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        const cols = [
          { name: 'Date', width: Math.floor(width * 0.48) },
          { name: 'Score', width: Math.floor(width * 0.14) },
          { name: 'Result', width: Math.floor(width * 0.18) },
          { name: 'Round', width: Math.floor(width * 0.20) },
        ];
        let x = left;
        cols.forEach(c => {
          doc.text(c.name, x, y);
          x += c.width;
        });
        y += 10;
        doc.setDrawColor(220);
        doc.line(left, y, right, y);
        y += 8;
        doc.setFont('helvetica', 'normal');
        return cols;
      };

      const drawRow = (cols, row) => {
        doc.setFontSize(10);
        const cellPad = 2;
        const dateLines = doc.splitTextToSize(row.date, cols[0].width);
        const scoreLines = doc.splitTextToSize(row.score, cols[1].width);
        const resultLines = doc.splitTextToSize(row.result, cols[2].width);
        const roundLines = doc.splitTextToSize(row.round, cols[3].width);
        const rowHeight = Math.max(dateLines.length, scoreLines.length, resultLines.length, roundLines.length) * 12 + cellPad * 2;
        ensureSpace(rowHeight + 6);
        let x = left;
        let yy = y + 10;
        doc.text(dateLines, x, yy); x += cols[0].width;
        doc.text(scoreLines, x, yy); x += cols[1].width;
        doc.text(resultLines, x, yy); x += cols[2].width;
        doc.text(roundLines, x, yy);
        y += rowHeight;
        doc.setDrawColor(240);
        doc.line(left, y, right, y);
        y += 4;
      };

      // Iterate attempts
      companyGroup.attempts.forEach((attempt, idx) => {
        ensureSpace(28);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(`Attempt #${attempt.attemptNumber}`, left, y);
        y += 16;
        const cols = drawTableHeader();
        attempt.rounds
          .slice()
          .sort((a, b) => a.round_type.localeCompare(b.round_type))
          .forEach(iv => {
            const row = {
              date: new Date(iv.date).toLocaleString(),
              score: (iv.score && typeof iv.score === 'number') ? iv.score.toFixed(1) : '-',
              result: String(iv.pass_fail || ''),
              round: (iv.round_type && iv.round_type.toLowerCase() === 'aptitude') ? 'Aptitude' : 'Camera'
            };
            drawRow(cols, row);
          });
        y += 6;
      });

      // Add page numbers footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(120);
        const footer = `Page ${i} of ${pageCount}`;
        const fw = doc.getTextWidth(footer);
        const px = left + (width - fw);
        const py = doc.internal.pageSize.getHeight() - 24;
        doc.text(footer, px, py);
        doc.setTextColor(0);
      }

      const fileName = `Interview_Report_${companyGroup.companyName.replace(/[^a-z0-9]+/gi, '_')}.pdf`;
      doc.save(fileName);
    } catch (e) {
      console.error('Failed to generate PDF', e);
      alert('Failed to generate PDF. Please try again.');
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">My Interviews</h1>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading your interviews...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">My Interviews</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          {user?.id && (
            <button
              onClick={() => fetchInterviewData(user.id)}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!interviewData || interviewData.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">My Interviews</h1>
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">No interviews found.</p>
          <p className="text-gray-500">Start your first interview to see your history here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">My Interviews</h1>
      {groupByCompanyAndAttempt(interviewData).map((company, idx) => (
        <div key={idx} className="mb-8 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-indigo-700 text-lg">{company.companyName}</div>
            <button
              onClick={() => downloadCompanyPdf(company)}
              className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              aria-label="Download PDF"
              title="Download PDF"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M3 14.5A1.5 1.5 0 0 1 4.5 13h11a1.5 1.5 0 0 1 0 3h-11A1.5 1.5 0 0 1 3 14.5z"/>
                <path d="M10 2a1 1 0 0 1 1 1v7.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4A1 1 0 1 1 6.707 8.293L9 10.586V3a1 1 0 0 1 1-1z"/>
              </svg>
            </button>
          </div>
          {company.attempts.map((attempt, aIdx) => (
            <div key={aIdx} className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Attempt #{attempt.attemptNumber}</div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Date</th>
                    <th className="py-2">Score</th>
                    <th className="py-2">Result</th>
                    <th className="py-2">Round</th>
                  </tr>
                </thead>
                <tbody>
                  {attempt.rounds
                    .sort((a, b) => a.round_type.localeCompare(b.round_type)) // Aptitude first, then Camera
                    .map((iv, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-2">{new Date(iv.date).toLocaleString()}</td>
                        <td className="py-2">{iv.score && typeof iv.score === 'number' ? iv.score.toFixed(1) : '-'}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            iv.pass_fail === 'Pass' ? 'bg-green-100 text-green-800' :
                            iv.pass_fail === 'Fail' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {iv.pass_fail}
                          </span>
                        </td>
                        <td className="py-2">{iv.round_type && iv.round_type.toLowerCase() === 'aptitude' ? 'Aptitude' : 'Camera'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}