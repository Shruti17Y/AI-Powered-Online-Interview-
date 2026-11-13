import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.js';

// // // import React, { useEffect, useState } from 'react';
// // // import axios from 'axios';
// // // import { useAuth } from '../context/AuthContext.js';

// // // const HRDashboard = () => {
// // //   const { user, setUser } = useAuth();
// // //   const [companies, setCompanies] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState('');
// // //   const [selectedCompany, setSelectedCompany] = useState(null);
// // //   const [showPasswordModal, setShowPasswordModal] = useState(false);
// // //   const [hrEmail, setHrEmail] = useState('');
// // //   const [companyPassword, setCompanyPassword] = useState('');
// // //   const [passwordError, setPasswordError] = useState('');
// // //   const [interviews, setInterviews] = useState(null);
// // // const [interviewHistory, setInterviewHistory] = useState(null);
// // //   const [companyName, setCompanyName] = useState('');
// // //   const [detailsLoading, setDetailsLoading] = useState(false);
// // //   const [unlockedCompanyIds, setUnlockedCompanyIds] = useState([]);

// // //   // Fetch approved companies on mount
// // //   useEffect(() => {
// // //     setLoading(true);
// // //     axios.get('/api/company/approved/')
// // //       .then(res => {
// // //         setCompanies(res.data);
// // //         setLoading(false);
// // //       })
// // //       .catch(() => {
// // //         setError('Failed to load approved companies.');
// // //         setLoading(false);
// // //       });
// // //   }, []);

// // //   // Handle company click
// // //   const handleCompanyClick = (company) => {
// // //     setSelectedCompany(company);
// // //     setCompanyPassword('');
// // //     setHrEmail(company.hr_email || '');
// // //     setPasswordError('');
// // //     setShowPasswordModal(true);
// // //     setInterviews(null);
// // //     setCompanyName(company.name);
// // //   };

// // //   // Handle HR login submit
// // //   const handleHRLoginSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setPasswordError('');
// // //     setDetailsLoading(true);
// // //     try {
// // //       const res = await axios.post('/api/hr/login/', {
// // //         email: hrEmail,
// // //         password: companyPassword
// // //       });
// // //       setInterviews(res.data.interviews);
// // //       setCompanyName(res.data.company);
// // //       setShowPasswordModal(false);
// // //       // Mark this company as unlocked for viewing results
// // //       setUnlockedCompanyIds(prev => [...prev, selectedCompany.id]);
// // //       // Elevate client-side role to HR so protected routes open
// // //       setUser(prev => {
// // //         const nextUser = prev || {};
// // //         const hrUser = {
// // //           ...nextUser,
// // //           username: nextUser.username || 'HR',
// // //           email: hrEmail,
// // //           role: 'hr'
// // //         };
// // //         localStorage.setItem('user', JSON.stringify(hrUser));
// // //         return hrUser;
// // //       });
// // //     } catch (err) {
// // //       setPasswordError(err.response?.data?.error || 'Invalid credentials or error fetching interviews.');
// // //       setInterviews(null);
// // //     } finally {
// // //       setDetailsLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-gray-50 p-6">
// // //       <h1 className="text-3xl font-bold mb-6">HR Dashboard</h1>
// // //       {loading ? (
// // //         <div>Loading approved companies...</div>
// // //       ) : error ? (
// // //         <div className="text-red-600">{error}</div>
// // //       ) : (
// // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// // //           {companies.map(company => (
// // //             <div
// // //               key={company.id}
// // //               className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition"
// // //               onClick={() => handleCompanyClick(company)}
// // //             >
// // //               <div className="flex items-center mb-4">
// // //                 <img
// // //                   src={company.logo ? (company.logo.startsWith('http') ? company.logo : `http://localhost:8000${company.logo}`) : 'https://via.placeholder.com/80'}
// // //                   alt={company.name}
// // //                   className="w-16 h-16 rounded-full mr-4 object-cover"
// // //                 />
// // //                 <div>
// // //                   <h2 className="text-xl font-semibold">{company.name}</h2>
// // //                   <p className="text-gray-500 text-sm">{company.location}</p>
// // //                 </div>
// // //               </div>
// // //               <div className="text-gray-700">{company.job_type}</div>
// // //               {unlockedCompanyIds.includes(company.id) && (
// // //                 <div className="mt-4">
// // //                   <a
// // //                     href={`/hr/company-history/${company.id}?name=${encodeURIComponent(company.name)}`}
// // //                     className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
// // //                     target="_blank"
// // //                     rel="noopener noreferrer"
// // //                   >
// // //                     View Interview Results
// // //                   </a>
// // //                 </div>
// // //               )}
// // //             </div>
// // //           ))}
// // //         </div>
// // //       )}

// // //       {/* HR Login Modal */}
// // //       {showPasswordModal && selectedCompany && (
// // //         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
// // //           <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
// // //             <button
// // //               className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
// // //               onClick={() => setShowPasswordModal(false)}
// // //             >
// // //               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
// // //               </svg>
// // //             </button>
// // //             <h2 className="text-2xl font-bold mb-4">HR Verification</h2>
// // //             <form onSubmit={handleHRLoginSubmit}>
// // //               <input
// // //                 type="email"
// // //                 value={hrEmail}
// // //                 onChange={e => setHrEmail(e.target.value)}
// // //                 className="w-full border rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                 placeholder="HR Email"
// // //                 required
// // //                 autoFocus
// // //               />
// // //               <input
// // //                 type="password"
// // //                 value={companyPassword}
// // //                 onChange={e => setCompanyPassword(e.target.value)}
// // //                 className="w-full border rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                 placeholder="Company password"
// // //                 required
// // //               />
// // //               {passwordError && <div className="text-red-600 mb-2">{passwordError}</div>}
// // //               <button
// // //                 type="submit"
// // //                 className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
// // //                 disabled={detailsLoading}
// // //               >
// // //                 {detailsLoading ? 'Verifying...' : 'Submit'}
// // //               </button>
// // //             </form>
// // //           </div>
// // //         </div>
// // //       )}




// // //     </div>
// // //   );
// // // };

// // // export default HRDashboard;

// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import { useAuth } from '../context/AuthContext.js';

// // const HRDashboard = () => {
// //   const { user, setUser } = useAuth();
// //   const [companies, setCompanies] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState('');
// //   const [selectedCompany, setSelectedCompany] = useState(null);
// //   const [showPasswordModal, setShowPasswordModal] = useState(false);
// //   const [hrEmail, setHrEmail] = useState('');
// //   const [companyPassword, setCompanyPassword] = useState('');
// //   const [passwordError, setPasswordError] = useState('');
// //   const [interviews, setInterviews] = useState(null);
// //   const [interviewHistory, setInterviewHistory] = useState(null);
// //   const [companyName, setCompanyName] = useState('');
// //   const [detailsLoading, setDetailsLoading] = useState(false);
// //   const [unlockedCompanyIds, setUnlockedCompanyIds] = useState([]);

// //   // Fetch approved companies on mount
// //   useEffect(() => {
// //     setLoading(true);
// //     axios.get('/api/company/approved/')
// //       .then(res => {
// //         setCompanies(res.data);
// //         setLoading(false);
// //       })
// //       .catch(() => {
// //         setError('Failed to load approved companies.');
// //         setLoading(false);
// //       });
// //   }, []);

// //   // Handle company click
// //   const handleCompanyClick = (company) => {
// //     setSelectedCompany(company);
// //     setCompanyPassword('');
// //     setHrEmail(company.hr_email || '');
// //     setPasswordError('');
// //     setShowPasswordModal(true);
// //     setInterviews(null);
// //     setCompanyName(company.name);
// //   };

// //   // Handle HR login submit
// //   const handleHRLoginSubmit = async (e) => {
// //     e.preventDefault();
// //     setPasswordError('');
// //     setDetailsLoading(true);
// //     try {
// //       const res = await axios.post('/api/hr/login/', {
// //         email: hrEmail,
// //         password: companyPassword
// //       });
// //       setInterviews(res.data.interviews);
// //       setCompanyName(res.data.company);
// //       setShowPasswordModal(false);
// //       // Mark this company as unlocked for viewing results
// //       setUnlockedCompanyIds(prev => [...prev, selectedCompany.id]);
// //       // Elevate client-side role to HR so protected routes open
// //       setUser(prev => {
// //         const nextUser = prev || {};
// //         const hrUser = {
// //           ...nextUser,
// //           username: nextUser.username || 'HR',
// //           email: hrEmail,
// //           role: 'hr'
// //         };
// //         localStorage.setItem('user', JSON.stringify(hrUser));
// //         return hrUser;
// //       });
// //     } catch (err) {
// //       setPasswordError(err.response?.data?.error || 'Invalid credentials or error fetching interviews.');
// //       setInterviews(null);
// //     } finally {
// //       setDetailsLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
// //       <div className="max-w-7xl mx-auto">
// //         <div className="flex justify-between items-center mb-8">
// //           <div>
// //             <h1 className="text-3xl font-bold text-gray-800">HR Dashboard</h1>
// //             <p className="text-gray-600 mt-2">View and manage company interview data</p>
// //           </div>
// //           {user?.role === 'hr' && (
// //             <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
// //               HR Mode Activated
// //             </div>
// //           )}
// //         </div>

// //         {loading ? (
// //           <div className="flex justify-center items-center h-64">
// //             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
// //           </div>
// //         ) : error ? (
// //           <div className="bg-red-50 border-l-4 border-red-500 p-4">
// //             <div className="flex">
// //               <div className="flex-shrink-0">
// //                 <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
// //                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
// //                 </svg>
// //               </div>
// //               <div className="ml-3">
// //                 <p className="text-sm text-red-700">{error}</p>
// //               </div>
// //             </div>
// //           </div>
// //         ) : (
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //             {companies.map(company => (
// //               <div
// //                 key={company.id}
// //                 className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100"
// //               >
// //                 <div className="p-6">
// //                   <div className="flex items-start">
// //                     <div className="flex-shrink-0">
// //                       <img
// //                         src={company.logo ? (company.logo.startsWith('http') ? company.logo : `http://localhost:8000${company.logo}`) : 'https://via.placeholder.com/80'}
// //                         alt={company.name}
// //                         className="h-16 w-16 rounded-lg object-cover border border-gray-200"
// //                       />
// //                     </div>
// //                     <div className="ml-4">
// //                       <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
// //                       <div className="mt-1 flex items-center text-sm text-gray-500">
// //                         <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
// //                           <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
// //                         </svg>
// //                         {company.location}
// //                       </div>
// //                       <div className="mt-2">
// //                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
// //                           {company.job_type}
// //                         </span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //                 <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
// //                   <div className="flex justify-between items-center">
// //                     <button
// //                       onClick={() => handleCompanyClick(company)}
// //                       className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
// //                     >
// //                       Access Data
// //                     </button>
// //                     {unlockedCompanyIds.includes(company.id) && (
// //                       <a
// //                         href={`/hr/company-history/${company.id}?name=${encodeURIComponent(company.name)}`}
// //                         className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
// //                         target="_blank"
// //                         rel="noopener noreferrer"
// //                       >
// //                         View Results
// //                         <svg className="ml-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
// //                         </svg>
// //                       </a>
// //                     )}
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}

// //         {/* HR Login Modal */}
// //         {showPasswordModal && selectedCompany && (
// //           <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity flex items-center justify-center z-50">
// //             <div className="bg-white rounded-lg shadow-xl transform transition-all sm:max-w-lg w-full">
// //               <div className="px-6 py-4 border-b border-gray-200">
// //                 <div className="flex items-center justify-between">
// //                   <h3 className="text-lg leading-6 font-medium text-gray-900">HR Verification</h3>
// //                   <button
// //                     type="button"
// //                     className="text-gray-400 hover:text-gray-500 focus:outline-none"
// //                     onClick={() => setShowPasswordModal(false)}
// //                   >
// //                     <span className="sr-only">Close</span>
// //                     <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                     </svg>
// //                   </button>
// //                 </div>
// //                 <p className="mt-1 text-sm text-gray-500">
// //                   Verify your HR credentials for <span className="font-medium">{companyName}</span>
// //                 </p>
// //               </div>
// //               <form onSubmit={handleHRLoginSubmit}>
// //                 <div className="px-6 py-4 space-y-4">
// //                   <div>
// //                     <label htmlFor="hr-email" className="block text-sm font-medium text-gray-700">
// //                       HR Email
// //                     </label>
// //                     <div className="mt-1 relative rounded-md shadow-sm">
// //                       <input
// //                         type="email"
// //                         id="hr-email"
// //                         value={hrEmail}
// //                         onChange={e => setHrEmail(e.target.value)}
// //                         className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 pr-10 py-2 sm:text-sm border-gray-300 rounded-md border"
// //                         placeholder="you@company.com"
// //                         required
// //                         autoFocus
// //                       />
// //                       <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
// //                         <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
// //                           <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
// //                           <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
// //                         </svg>
// //                       </div>
// //                     </div>
// //                   </div>
// //                   <div>
// //                     <label htmlFor="company-password" className="block text-sm font-medium text-gray-700">
// //                       Company Password
// //                     </label>
// //                     <div className="mt-1 relative rounded-md shadow-sm">
// //                       <input
// //                         type="password"
// //                         id="company-password"
// //                         value={companyPassword}
// //                         onChange={e => setCompanyPassword(e.target.value)}
// //                         className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 pr-10 py-2 sm:text-sm border-gray-300 rounded-md border"
// //                         placeholder="••••••••"
// //                         required
// //                       />
// //                       <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
// //                         <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
// //                           <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
// //                         </svg>
// //                       </div>
// //                     </div>
// //                   </div>
// //                   {passwordError && (
// //                     <div className="rounded-md bg-red-50 p-4">
// //                       <div className="flex">
// //                         <div className="flex-shrink-0">
// //                           <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
// //                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
// //                           </svg>
// //                         </div>
// //                         <div className="ml-3">
// //                           <h3 className="text-sm font-medium text-red-800">{passwordError}</h3>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   )}
// //                 </div>
// //                 <div className="px-6 py-3 bg-gray-50 text-right border-t border-gray-200">
// //                   <button
// //                     type="button"
// //                     className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
// //                     onClick={() => setShowPasswordModal(false)}
// //                   >
// //                     Cancel
// //                   </button>
// //                   <button
// //                     type="submit"
// //                     className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
// //                     disabled={detailsLoading}
// //                   >
// //                     {detailsLoading ? (
// //                       <>
// //                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// //                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// //                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// //                         </svg>
// //                         Verifying...
// //                       </>
// //                     ) : 'Verify'}
// //                   </button>
// //                 </div>
// //               </form>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default HRDashboard;
// NOTE: Removed duplicate component definition. The active component is defined below.
// const HRDashboard = () => {
//   const { user, setUser } = useAuth();
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedCompany, setSelectedCompany] = useState(null);
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [hrEmail, setHrEmail] = useState('');
//   const [companyPassword, setCompanyPassword] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const [interviews, setInterviews] = useState(null);
//   const [interviewHistory, setInterviewHistory] = useState(null);
//   const [companyName, setCompanyName] = useState('');
//   const [detailsLoading, setDetailsLoading] = useState(false);
//   const [unlockedCompanyIds, setUnlockedCompanyIds] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [error, setError] = useState('');
//   const [selectedCompany, setSelectedCompany] = useState(null);
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [hrEmail, setHrEmail] = useState('');
//   const [companyPassword, setCompanyPassword] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const [interviews, setInterviews] = useState(null);
//   const [interviewHistory, setInterviewHistory] = useState(null);
//   const [companyName, setCompanyName] = useState('');
//   const [detailsLoading, setDetailsLoading] = useState(false);
//   const [unlockedCompanyIds, setUnlockedCompanyIds] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   // Fetch approved companies on mount
//   useEffect(() => {
//     setLoading(true);
//     axios.get('/api/company/approved/')
//       .then(res => {
//         setCompanies(res.data);
//         setLoading(false);
//       })
//       .catch(() => {
//         setError('Failed to load approved companies.');
//         setLoading(false);
//       });
//   }, []);

//   // Handle company click
//   const handleCompanyClick = (company) => {
//     setSelectedCompany(company);
//     setCompanyPassword('');
//     setHrEmail(company.hr_email || '');
//     setPasswordError('');
//     setShowPasswordModal(true);
//     setInterviews(null);
//     setCompanyName(company.name);
//   };

//   // Handle HR login submit
//   const handleHRLoginSubmit = async (e) => {
//     e.preventDefault();
//     setPasswordError('');
//     setDetailsLoading(true);
//     try {
//       const res = await axios.post('/api/hr/login/', {
//         email: hrEmail,
//         password: companyPassword
//       });
//       setInterviews(res.data.interviews);
//       setCompanyName(res.data.company);
//       setShowPasswordModal(false);
//       setUnlockedCompanyIds(prev => [...prev, selectedCompany.id]);
//       setUser(prev => {
//         const nextUser = prev || {};
//         const hrUser = {
//           ...nextUser,
//           username: nextUser.username || 'HR',
//           email: hrEmail,
//           role: 'hr'
//         };
//         localStorage.setItem('user', JSON.stringify(hrUser));
//         return hrUser;
//       });
//     } catch (err) {
//       setPasswordError(err.response?.data?.error || 'Invalid credentials or error fetching interviews.');
//       setInterviews(null);
//     } finally {
//       setDetailsLoading(false);
//     }
//   };

//   // Filter companies based on search term
//   const filteredCompanies = companies.filter(company =>
//     company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     company.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     company.job_type.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//           <div className="mb-6 md:mb-0">
//             <h1 className="text-3xl font-bold text-gray-800">HR Insights Dashboard</h1>
//             <p className="text-gray-600 mt-2">Manage and analyze company interview data</p>
//           </div>
          
//           {/* Search Bar */}
//           <div className="relative w-full md:w-64">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <input
//               type="text"
//               placeholder="Search companies..."
//               className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Status Indicator */}
//         {user?.role === 'hr' && (
//           <div className="flex items-center bg-blue-50 text-blue-800 px-4 py-3 rounded-lg mb-8 animate-fade-in">
//             <div className="flex-shrink-0">
//               <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm font-medium">You are currently in HR mode with access to detailed analytics.</p>
//             </div>
//           </div>
//         )}

//         {/* Loading State */}
//         {loading && (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         )}

//         {/* Error State */}
//         {error && (
//           <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-lg shadow-sm">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-red-700">{error}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Company Grid */}
//         {!loading && !error && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredCompanies.length > 0 ? (
//               filteredCompanies.map(company => (
//                 <div
//                   key={company.id}
//                   className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1"
//                 >
//                   <div className="p-6">
//                     <div className="flex items-start">
//                       <div className="flex-shrink-0 relative">
//                         <img
//                           src={company.logo ? (company.logo.startsWith('http') ? company.logo : `http://localhost:8000${company.logo}`) : 'https://via.placeholder.com/80'}
//                           alt={company.name}
//                           className="h-16 w-16 rounded-lg object-cover border border-gray-200"
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = 'https://via.placeholder.com/80';
//                           }}
//                         />
//                         {unlockedCompanyIds.includes(company.id) && (
//                           <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 shadow-md">
//                             <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                               <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
//                             </svg>
//                           </div>
//                         )}
//                       </div>
//                       <div className="ml-4">
//                         <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
//                         <div className="mt-1 flex items-center text-sm text-gray-500">
//                           <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                             <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
//                           </svg>
//                           {company.location}
//                         </div>
//                         <div className="mt-2 flex flex-wrap gap-2">
//                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                             {company.job_type}
//                           </span>
//                           {unlockedCompanyIds.includes(company.id) && (
//                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                               Verified
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
//                     <div className="flex justify-between items-center">
//                       <button
//                         onClick={() => handleCompanyClick(company)}
//                         className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
//                       >
//                         <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                           <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
//                         </svg>
//                         Access Data
//                       </button>
//                       {unlockedCompanyIds.includes(company.id) && (
//                         <a
//                           href={`/hr/company-history/${company.id}?name=${encodeURIComponent(company.name)}`}
//                           className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           View Analytics
//                           <svg className="ml-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                           </svg>
//                         </a>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="col-span-full py-12 text-center">
//                 <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <h3 className="mt-2 text-lg font-medium text-gray-900">No companies found</h3>
//                 <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* HR Verification Modal */}
//         {showPasswordModal && selectedCompany && (
//           <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
//             <div className="bg-white rounded-xl shadow-xl transform transition-all sm:max-w-lg w-full overflow-hidden">
//               <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-500 sm:px-6">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-lg font-medium text-white">HR Verification</h3>
//                   <button
//                     type="button"
//                     className="text-blue-100 hover:text-white focus:outline-none"
//                     onClick={() => setShowPasswordModal(false)}
//                   >
//                     <span className="sr-only">Close</span>
//                     <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>
//                 <p className="mt-1 text-sm text-blue-100">
//                   Verify your HR credentials for <span className="font-medium">{companyName}</span>
//                 </p>
//               </div>
//               <form onSubmit={handleHRLoginSubmit}>
//                 <div className="px-6 py-6 space-y-6">
//                   <div>
//                     <label htmlFor="hr-email" className="block text-sm font-medium text-gray-700">
//                       HR Email
//                     </label>
//                     <div className="mt-1 relative rounded-md shadow-sm">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                           <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//                           <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//                         </svg>
//                       </div>
//                       <input
//                         type="email"
//                         id="hr-email"
//                         value={hrEmail}
//                         onChange={e => setHrEmail(e.target.value)}
//                         className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-3 sm:text-sm border-gray-300 rounded-md border"
//                         placeholder="you@company.com"
//                         required
//                         autoFocus
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="company-password" className="block text-sm font-medium text-gray-700">
//                       Company Password
//                     </label>
//                     <div className="mt-1 relative rounded-md shadow-sm">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                           <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
//                         </svg>
//                       </div>
//                       <input
//                         type="password"
//                         id="company-password"
//                         value={companyPassword}
//                         onChange={e => setCompanyPassword(e.target.value)}
//                         className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-3 sm:text-sm border-gray-300 rounded-md border"
//                         placeholder="••••••••"
//                         required
//                       />
//                     </div>
//                   </div>
//                   {passwordError && (
//                     <div className="rounded-md bg-red-50 p-4">
//                       <div className="flex">
//                         <div className="flex-shrink-0">
//                           <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                           </svg>
//                         </div>
//                         <div className="ml-3">
//                           <h3 className="text-sm font-medium text-red-800">{passwordError}</h3>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//                 <div className="px-6 py-4 bg-gray-50 text-right border-t border-gray-200">
//                   <button
//                     type="button"
//                     className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
//                     onClick={() => setShowPasswordModal(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
//                     disabled={detailsLoading}
//                   >
//                     {detailsLoading ? (
//                       <>
//                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Verifying...
//                       </>
//                     ) : (
//                       <>
//                         <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                           <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
//                         </svg>
//                         Verify & Access
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

const HRDashboard = () => {
  // Auth context
  const { user, setUser } = useAuth();

  // Core state
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [hrEmail, setHrEmail] = useState('');
  const [companyPassword, setCompanyPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [unlockedCompanyIds, setUnlockedCompanyIds] = useState([]);

  // Fetch approved companies
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    axios
      .get('/api/company/approved/')
      .then((res) => {
        if (!isMounted) return;
        setCompanies(Array.isArray(res.data) ? res.data : []);
        setError('');
      })
      .catch(() => {
        if (!isMounted) return;
        setError('Failed to load approved companies.');
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Derived: filter by search term on name, location, job_type
  const filteredCompanies = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter((c) => {
      const name = (c.name || '').toLowerCase();
      const loc = (c.location || '').toLowerCase();
      const jt = (c.job_type || '').toLowerCase();
      return name.includes(q) || loc.includes(q) || jt.includes(q);
    });
  }, [companies, searchTerm]);

  // Handlers
  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    setCompanyPassword('');
    setHrEmail(company?.hr_email || '');
    setPasswordError('');
    setShowPasswordModal(true);
    setCompanyName(company?.name || '');
  };

  const handleHRLoginSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setDetailsLoading(true);
    try {
      const res = await axios.post('/api/hr/login/', {
        email: hrEmail,
        password: companyPassword,
      });

      // If successful: close modal, mark company unlocked, elevate role in client context
      setShowPasswordModal(false);
      if (selectedCompany?.id != null) {
        setUnlockedCompanyIds((prev) => (prev.includes(selectedCompany.id) ? prev : [...prev, selectedCompany.id]));
      }

      setUser((prev) => {
        const nextUser = prev || {};
        const hrUser = {
          ...nextUser,
          username: nextUser.username || 'HR',
          email: hrEmail,
          role: 'hr',
        };
        try {
          localStorage.setItem('user', JSON.stringify(hrUser));
        } catch {}
        return hrUser;
      });
    } catch (err) {
      setPasswordError(err?.response?.data?.error || 'Invalid credentials or error verifying access.');
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-800">HR Insights Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage and analyze company interview data</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search companies..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* ... (keep loading and error states the same) */}

        {/* Company Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map(company => (
                <div
                  key={company.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 transform hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 relative">
                        <img
                          src={company.logo || 'https://via.placeholder.com/80'}
                          alt={company.name}
                          className="h-16 w-16 rounded-lg object-cover border-2 border-gray-100"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/80';
                          }}
                        />
                        {unlockedCompanyIds.includes(company.id) && (
                          <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 shadow-md">
                            <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {company.location}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {company.job_type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => handleCompanyClick(company)}
                        className={`inline-flex items-center px-4 py-2 border-2 text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                          unlockedCompanyIds.includes(company.id)
                            ? 'border-green-500 text-green-600 bg-green-50 hover:bg-green-100 focus:ring-green-500'
                            : 'border-blue-500 text-blue-600 bg-transparent hover:bg-blue-50 focus:ring-blue-500'
                        }`}
                      >
                        <svg
                          className={`-ml-1 mr-2 h-5 w-5 ${
                            unlockedCompanyIds.includes(company.id) ? 'text-green-500' : 'text-blue-500'
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          {unlockedCompanyIds.includes(company.id) ? (
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" clipRule="evenodd" />
                          )}
                        </svg>
                        {unlockedCompanyIds.includes(company.id) ? 'Access Granted' : 'Verify Access'}
                      </button>
                      {unlockedCompanyIds.includes(company.id) && (
                        <a
                          href={`/hr/company-history/${company.id}?name=${encodeURIComponent(company.name)}`}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Analytics
                          <svg className="ml-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No companies found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
              </div>
            )}
          </div>
        )}

        {/* HR Verification Modal */}
        {showPasswordModal && selectedCompany && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-xl transform transition-all sm:max-w-lg w-full overflow-hidden">
              <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-500 sm:px-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">HR Verification</h3>
                  <button
                    type="button"
                    className="text-blue-100 hover:text-white focus:outline-none"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="mt-1 text-sm text-blue-100">
                  Verify your HR credentials for <span className="font-medium">{companyName}</span>
                </p>
              </div>
              <form onSubmit={handleHRLoginSubmit}>
                <div className="px-6 py-6 space-y-6">
                  <div>
                    <label htmlFor="hr-email" className="block text-sm font-medium text-gray-700">
                      HR Email
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        id="hr-email"
                        value={hrEmail}
                        onChange={e => setHrEmail(e.target.value)}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-3 sm:text-sm border-gray-300 rounded-md border"
                        placeholder="you@company.com"
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="company-password" className="block text-sm font-medium text-gray-700">
                      Company Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        id="company-password"
                        value={companyPassword}
                        onChange={e => setCompanyPassword(e.target.value)}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-3 sm:text-sm border-gray-300 rounded-md border"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                  {passwordError && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">{passwordError}</h3>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="px-6 py-4 bg-gray-50 text-right border-t border-gray-200">
                  <button
                    type="button"
                    className="mr-3 inline-flex justify-center py-2 px-4 border-2 border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-transparent hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border-2 border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    disabled={detailsLoading}
                  >
                    {detailsLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Verify & Access
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRDashboard;


