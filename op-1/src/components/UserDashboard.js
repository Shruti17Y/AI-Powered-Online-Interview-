import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyDetailsModal from './CompanyDetailsModal.js';

function UserDashboard() {
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [detectedSkills, setDetectedSkills] = useState([]);
  const [resumeAnalysis, setResumeAnalysis] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Fetch approved companies from backend and map to card structure
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('recommended'); // 'recommended' | 'all'

  useEffect(() => {
    fetchApprovedCompanies();
  }, []);

  const fetchApprovedCompanies = async () => {
    try {
      const res = await fetch('/api/company/approved/');
      if (!res.ok) throw new Error('Failed to fetch approved companies');
      const data = await res.json();
      // Map backend fields to frontend card structure
      const mapped = data.map((c) => ({
        id: c.id,
        name: c.name,
        position: c.job_type || '',
        location: c.location || '',
        type: c.job_type || '',
        salary: c.salary || '',
        logo: c.logo ? (c.logo.startsWith('http') ? c.logo : `http://127.0.0.1:8000${c.logo}`) : '',
        experience: c.experience_required || '',
        skills: c.required_skills ? c.required_skills.split(',').map(s => s.trim()) : [],
        description: c.description || '',
        postedDate: '', // You can add a date field if available
        benefits: c.benefits ? c.benefits.split(',').map(s => s.trim()) : [],
        contact_info: c.contact_info || '',
      }));
      setCompanies(mapped);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type === 'application/msword' || 
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setResume(file);
        setUploadStatus('File selected: ' + file.name);
      } else {
        setUploadStatus('Please upload a PDF or Word document');
      }
    }
  };

  const normalizeSkill = (s) => (s || '').trim().toLowerCase();
  const unique = (arr) => Array.from(new Set(arr.map(normalizeSkill))).filter(Boolean);

  const extractSkillsFromText = (text) => {
    if (!text) return [];
    const lower = text.toLowerCase();
    // Look for a "key skills" section first
    const secMatch = lower.match(/key\s+skills\s*[:\-]?\s*([\s\S]{0,500})/);
    let candidates = [];
    if (secMatch && secMatch[1]) {
      candidates = secMatch[1].split(/[\n,•;]+/);
    } else {
      // Fallback: keyword spotting across common tech skills
      const dictionary = [
        'python','java','javascript','typescript','c++','c#','golang','ruby','php','swift','kotlin','rust',
        'react','redux','angular','vue','next.js','node','node.js','express','django','flask','spring','spring boot',
        'mysql','postgres','postgresql','mongodb','redis','sqlite','oracle','sql','nosql','graphql','rest',
        'aws','azure','gcp','docker','kubernetes','terraform','ansible','linux',
        'html','css','sass','tailwind','bootstrap','psycopg2','SQLAlchemy',
        'pandas','numpy','scikit-learn','tensorflow','pytorch','nlp','opencv',
        'git','jira','agile','ci/cd','cd'
      ];
      candidates = dictionary.filter((w) => lower.includes(w));
    }
    return unique(candidates).slice(0, 30);
  };

  const handleUpload = async () => {
    if (!resume) {
      setUploadStatus('Please select a file first');
      return;
    }
    setIsScanning(true);
    setUploadStatus('Scanning resume...');
    try {
      const form = new FormData();
      form.append('file', resume);
      const resp = await fetch('/api/resume-scan/', {
        method: 'POST',
        body: form,
      });
      const data = await resp.json();
      if (!resp.ok) {
        setUploadStatus(data.error || 'Failed to scan resume');
        setIsScanning(false);
        return;
      }
      const analysisText = data.analysis || data.extracted_text || data.extracted_text_preview || '';
      setResumeAnalysis(analysisText);
      const skills = extractSkillsFromText(analysisText);
      setDetectedSkills(skills);
      setUploadStatus(`Detected ${skills.length} skill(s): ${skills.join(', ')}`);
      setResume(null);
    } catch (e) {
      setUploadStatus('Error scanning resume: ' + e.message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleApplyClick = (company) => {
    navigate(`/company/${company.id}`);
  };

  const handleCloseModal = () => {
    setSelectedCompany(null);
  };

  const skillMatchScore = (company) => {
    if (!detectedSkills.length) return 0;
    const resumeSkillSet = new Set(detectedSkills.map(normalizeSkill));
    let score = 0;
    for (const s of company.skills || []) {
      if (resumeSkillSet.has(normalizeSkill(s))) score += 1;
    }
    return score;
  };

  const filteredCompanies = useMemo(() =>
    companies
      .filter(company => {
        const term = searchTerm.toLowerCase();
        return (
          company.name.toLowerCase().includes(term) ||
          company.position.toLowerCase().includes(term) ||
          company.skills.some(skill => skill.toLowerCase().includes(term))
        );
      })
      .sort((a, b) => skillMatchScore(b) - skillMatchScore(a))
  , [companies, searchTerm]);

  const recommendedCompanies = useMemo(() => {
    if (!detectedSkills.length) return [];
    const withScore = companies
      .map(c => ({ c, score: skillMatchScore(c) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(x => x.c);
    return withScore;
  }, [companies, detectedSkills]);

  const handleSkillChipClick = (skill) => {
    setSearchTerm(prev => (prev.toLowerCase() === skill.toLowerCase() ? '' : skill));
  };

  const displayedCompanies = useMemo(() => {
    if (activeTab === 'recommended' && recommendedCompanies.length > 0) {
      return recommendedCompanies;
    }
    return filteredCompanies;
  }, [activeTab, recommendedCompanies, filteredCompanies]);

  const MatchBadge = ({ company }) => {
    const score = skillMatchScore(company);
    if (!score || !detectedSkills.length) return null;
    // Simple percent by overlap ratio vs top 6 visible skills
    const denom = Math.min(6, (company.skills || []).length || 6);
    const pct = Math.min(100, Math.round((score / (denom || 1)) * 100));
    const tone = pct >= 67 ? 'green' : pct >= 34 ? 'yellow' : 'gray';
    const cls = tone === 'green' ? 'bg-green-100 text-green-800' : tone === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800';
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${cls}`}>
        Match {pct}%
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Detected Skills & Recommendations */}
        {detectedSkills.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Detected Skills</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {detectedSkills.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSkillChipClick(s)}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    searchTerm.toLowerCase() === s.toLowerCase()
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {recommendedCompanies.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Recommended for You</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendedCompanies.map((company) => (
                    <div
                      key={company.id}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <img
                            src={company.logo}
                            alt={`${company.name} logo`}
                            className="h-12 w-12 rounded-lg object-contain"
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                            <p className="text-sm text-gray-500">{company.position}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(company.skills || []).slice(0, 6).map((skill, idx) => (
                            <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">{company.location}</span>
                          <button
                            onClick={() => handleApplyClick(company)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {/* Resume Upload Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Resume Upload</h2>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            <button
              onClick={handleUpload}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Upload Resume
            </button>
          </div>
          {uploadStatus && (
            <p className={`mt-2 text-sm ${uploadStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {uploadStatus}
            </p>
          )}
        </div>

        {/* Search Section (filters removed) */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Featured Companies Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Companies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className="h-12 w-12 rounded-lg object-contain"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                      <p className="text-sm text-gray-500">{company.position}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Location:</span> {company.location}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Job Type:</span> {company.type}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Salary:</span> {company.salary}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Experience:</span> {company.experience}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {company.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{company.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Posted {company.postedDate}</span>
                    <button
                      onClick={() => handleApplyClick(company)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Company Details Modal */}
      {selectedCompany && (
        <CompanyDetailsModal
          company={selectedCompany}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default UserDashboard; 