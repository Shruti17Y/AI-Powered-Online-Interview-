// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext.js';
// import UserDebug from './UserDebug.js';

// function Home() {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [searchQuery, setSearchQuery] = useState('');

//   const stats = [
//     { number: "500+", label: "Companies", icon: "🏢" },
//     { number: "1000+", label: "Jobs Posted", icon: "💼" },
//     { number: "2000+", label: "Candidates", icon: "👥" },
//     { number: "95%", label: "Success Rate", icon: "📈" }
//   ];

//   const testimonials = [
//     {
//       name: "Sarah Johnson",
//       role: "Software Engineer",
//       company: "Google",
//       image: "https://randomuser.me/api/portraits/women/1.jpg",
//       quote: "The AI-powered practice interviews helped me land my dream job at Google. The feedback was incredibly valuable!"
//     },
//     {
//       name: "Michael Chen",
//       role: "Product Manager",
//       company: "Microsoft",
//       image: "https://randomuser.me/api/portraits/men/2.jpg",
//       quote: "The platform's comprehensive preparation tools and real-time feedback made all the difference in my interview process."
//     },
//     {
//       name: "Emily Rodriguez",
//       role: "Data Scientist",
//       company: "Amazon",
//       image: "https://randomuser.me/api/portraits/women/3.jpg",
//       quote: "I was able to practice with industry-specific questions and get personalized feedback. Highly recommended!"
//     }
//   ];

//   const featuredCompanies = [
//     {
//       id: 1,
//       name: "Tech Solutions Inc",
//       position: "Senior Software Engineer",
//       location: "New York, NY",
//       type: "Full-time",
//       salary: "$120,000 - $150,000",
//       logo: "https://via.placeholder.com/150",
//       skills: ["React", "Node.js", "TypeScript"],
//       rating: 4.8,
//       reviews: 128
//     },
//     {
//       id: 2,
//       name: "Digital Innovations",
//       position: "Full Stack Developer",
//       location: "San Francisco, CA",
//       type: "Remote",
//       salary: "$130,000 - $160,000",
//       logo: "https://via.placeholder.com/150",
//       skills: ["Python", "Django", "React"],
//       rating: 4.9,
//       reviews: 95
//     },
//     {
//       id: 3,
//       name: "Cloud Systems",
//       position: "DevOps Engineer",
//       location: "Austin, TX",
//       type: "Hybrid",
//       salary: "$110,000 - $140,000",
//       logo: "https://via.placeholder.com/150",
//       skills: ["AWS", "Kubernetes", "Docker"],
//       rating: 4.7,
//       reviews: 156
//     }
//   ];

//   const features = [
//     {
//       title: "AI-Powered Practice",
//       description: "Practice with our advanced AI interview system that provides real-time feedback and personalized suggestions.",
//       icon: "🤖",
//       color: "from-blue-500 to-blue-600"
//     },
//     {
//       title: "Expert Guidance",
//       description: "Get personalized feedback and tips from industry experts to improve your interview skills.",
//       icon: "👨‍🏫",
//       color: "from-purple-500 to-purple-600"
//     },
//     {
//       title: "Success Rate",
//       description: "Join thousands of successful candidates who landed their dream jobs through our platform.",
//       icon: "📈",
//       color: "from-green-500 to-green-600"
//     }
//   ];

//   const handleApplyClick = (companyId) => {
//     if (!user) {
//       // Store the intended destination
//       sessionStorage.setItem('redirectAfterLogin', `/company/${companyId}`);
//       navigate('/login');
//     } else {
//       navigate(`/interview?company_id=${companyId}`);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {user && <UserDebug />}
//       {/* Hero Section with Animated Background */}
//       <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
//         <div className="absolute inset-0">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 mix-blend-multiply"></div>
//           <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,theme(colors.white/10)_1px,transparent_0)] [background-size:20px_20px]"></div>
//         </div>
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
//           <div className="text-center">
//             <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
//               Find Your Dream Job
//             </h1>
//             <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto animate-fade-in-delay">
//               Connect with top companies and land your next opportunity. Our AI-powered platform helps you prepare and succeed in your interviews.
//             </p>
            
//             {/* Search Bar */}
//             <div className="max-w-2xl mx-auto mb-8 animate-fade-in-delay-2">
//               <div className="flex shadow-lg rounded-lg overflow-hidden">
//                 <input
//                   type="text"
//                   placeholder="Search for jobs, companies, or skills..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="flex-1 px-6 py-4 text-gray-700 focus:outline-none"
//                 />
//                 <button className="bg-blue-500 text-white px-8 py-4 hover:bg-blue-600 transition duration-200">
//                   Search
//                 </button>
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-delay-3">
//               <button
//                 onClick={() => navigate('/login')}
//                 className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold"
//               >
//                 Get Started
//               </button>
//               <button
//                 onClick={() => navigate('/practice')}
//                 className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold"
//               >
//                 Practice Interviews
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
//       </div>

//       {/* Stats Section with Animation */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
//         <div className="bg-white rounded-lg shadow-xl p-8 transform hover:scale-105 transition duration-200">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             {stats.map((stat, index) => (
//               <div key={index} className="text-center transform hover:scale-110 transition duration-200">
//                 <div className="text-4xl mb-2">{stat.icon}</div>
//                 <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
//                 <div className="text-gray-600">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Featured Companies Section */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <div className="text-center mb-12">
//           <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Companies</h2>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             Discover opportunities from leading companies in the industry. Apply now and take the next step in your career.
//           </p>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {featuredCompanies.map((company) => (
//             <div key={company.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-200">
//               <div className="p-6">
//                 <div className="flex items-center mb-4">
//                   <img src={company.logo} alt={company.name} className="w-16 h-16 rounded-full mr-4" />
//                   <div>
//                     <h3 className="text-xl font-semibold text-gray-900">{company.name}</h3>
//                     <p className="text-gray-600">{company.position}</p>
//                     <div className="flex items-center mt-1">
//                       <div className="flex text-yellow-400">
//                         {[...Array(5)].map((_, i) => (
//                           <svg key={i} className={`w-4 h-4 ${i < Math.floor(company.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
//                             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                           </svg>
//                         ))}
//                       </div>
//                       <span className="text-sm text-gray-600 ml-2">({company.reviews} reviews)</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="space-y-3 mb-6">
//                   <p className="text-gray-600 flex items-center">
//                     <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                     {company.location}
//                   </p>
//                   <p className="text-gray-600 flex items-center">
//                     <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                     </svg>
//                     {company.type}
//                   </p>
//                   <p className="text-gray-600 flex items-center">
//                     <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     {company.salary}
//                   </p>
//                 </div>
//                 <div className="mb-6">
//                   <div className="flex flex-wrap gap-2">
//                     {company.skills.map((skill, index) => (
//                       <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => handleApplyClick(company.id)}
//                   className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold transform hover:scale-105"
//                 >
//                   {user ? 'Apply for Interview' : 'Sign in to Apply'}
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Testimonials Section */}
//       <div className="bg-gray-100 py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
//             <p className="text-gray-600 max-w-2xl mx-auto">
//               Hear from our successful candidates who landed their dream jobs through our platform.
//             </p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {testimonials.map((testimonial, index) => (
//               <div key={index} className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-200">
//                 <div className="flex items-center mb-4">
//                   <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
//                     <p className="text-gray-600">{testimonial.role} at {testimonial.company}</p>
//                   </div>
//                 </div>
//                 <p className="text-gray-600 italic">"{testimonial.quote}"</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Features Section with Gradient Cards */}
//       <div className="py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
//             <p className="text-gray-600 max-w-2xl mx-auto">
//               Our platform offers unique features to help you succeed in your job search and interview process.
//             </p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {features.map((feature, index) => (
//               <div key={index} className={`bg-gradient-to-br ${feature.color} p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-200`}>
//                 <div className="text-4xl mb-4">{feature.icon}</div>
//                 <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
//                 <p className="text-blue-100">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* CTA Section with Parallax Effect */}
//       <div className="relative bg-blue-600 py-24 overflow-hidden">
//         <div className="absolute inset-0">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 mix-blend-multiply"></div>
//           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80')] bg-cover bg-center mix-blend-overlay"></div>
//         </div>
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
//           <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
//             Join our platform today and take the first step towards your dream career.
//           </p>
//           <button
//             onClick={() => navigate('/dashboard')}
//             className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold"
//           >
//             Get Started Now
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home; 
import API_BASE_URL from '../apiConfig';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

// Hoisted static data to avoid re-creation on each render
const stats = [
  { number: "500+", label: "Companies", icon: "🏢" },
  { number: "1000+", label: "Jobs Posted", icon: "💼" },
  { number: "2000+", label: "Candidates", icon: "👥" },
  { number: "95%", label: "Success Rate", icon: "📈" }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    company: "Google",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    quote: "The AI-powered practice interviews helped me land my dream job at Google. The feedback was incredibly valuable!"
  },
  {
    name: "Michael Chen",
    role: "Product Manager",
    company: "Microsoft",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    quote: "The platform's comprehensive preparation tools and real-time feedback made all the difference in my interview process."
  },
  {
    name: "Emily Rodriguez",
    role: "Data Scientist",
    company: "Amazon",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    quote: "I was able to practice with industry-specific questions and get personalized feedback. Highly recommended!"
  }
];

const featuredCompanies = [
  {
    id: 1,
    name: "Tech Solutions Inc",
    position: "Senior Software Engineer",
    location: "New York, NY",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    logo: "https://via.placeholder.com/150",
    skills: ["React", "Node.js", "TypeScript"],
    rating: 4.8,
    reviews: 128
  },
  {
    id: 2,
    name: "Digital Innovations",
    position: "Full Stack Developer",
    location: "San Francisco, CA",
    type: "Remote",
    salary: "$130,000 - $160,000",
    logo: "https://via.placeholder.com/150",
    skills: ["Python", "Django", "React"],
    rating: 4.9,
    reviews: 95
  },
  {
    id: 3,
    name: "Cloud Systems",
    position: "DevOps Engineer",
    location: "Austin, TX",
    type: "Hybrid",
    salary: "$110,000 - $140,000",
    logo: "https://via.placeholder.com/150",
    skills: ["AWS", "Kubernetes", "Docker"],
    rating: 4.7,
    reviews: 156
  }
];

const features = [
  {
    title: "AI-Powered Practice",
    description: "Practice with our advanced AI interview system that provides real-time feedback and personalized suggestions.",
    icon: "🤖",
    color: "bg-gradient-to-br from-blue-500 to-blue-600"
  },
  {
    title: "Expert Guidance",
    description: "Get personalized feedback and tips from industry experts to improve your interview skills.",
    icon: "👨‍🏫",
    color: "bg-gradient-to-br from-purple-500 to-purple-600"
  },
  {
    title: "Success Rate",
    description: "Join thousands of successful candidates who landed their dream jobs through our platform.",
    icon: "📈",
    color: "bg-gradient-to-br from-green-500 to-green-600"
  }
];

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [approvedCompanies, setApprovedCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [companiesError, setCompaniesError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchApproved = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/company/approved/');
        if (!res.ok) throw new Error('Failed to fetch approved companies');
        const data = await res.json();
        if (!isMounted) return;
        const mapped = (Array.isArray(data) ? data : [])
          .map(c => ({
            id: c.id,
            name: c.name,
            position: c.job_type || 'Open Role',
            location: c.location || '—',
            type: c.job_type || '—',
            salary: c.salary || '—',
            logo: c?.logo ? (String(c.logo).startsWith('http') ? c.logo : `${API_BASE_URL}${c.logo}`) : 'https://via.placeholder.com/150',
            skills: Array.isArray(c.required_skills)
              ? c.required_skills
              : typeof c.required_skills === 'string'
                ? c.required_skills.split(',').map(s => s.trim()).filter(Boolean)
                : [],
            // rating and reviews may not exist on backend; omit to avoid UI errors
          }))
          .slice(0, 3);
        setApprovedCompanies(mapped);
      } catch (err) {
        if (isMounted) setCompaniesError(err.message || 'Error loading companies');
      } finally {
        if (isMounted) setLoadingCompanies(false);
      }
    };
    fetchApproved();
    return () => { isMounted = false; };
  }, []);
  const handleApplyClick = (companyId) => {
    if (!user) {
      sessionStorage.setItem('redirectAfterLogin', `/company/${companyId}`);
      navigate('/login');
    } else {
      // Route to existing company details page instead of non-existent /interview
      navigate(`/company/${companyId}`);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/search?query=${encodeURIComponent(q)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-900 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Land Your <span className="text-blue-300">Dream Job</span> With Confidence
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with top companies and ace your interviews with our AI-powered preparation platform.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <form onSubmit={handleSearch} className="flex rounded-lg overflow-hidden shadow-xl" role="search" aria-label="Job search form">
                <input
                  type="text"
                  placeholder="Search for jobs, companies, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search jobs, companies, or skills"
                  className="flex-1 px-6 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" aria-label="Search" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 transition-all duration-300 ease-in-out transform hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate('/practice')}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-all duration-300 hover:-translate-y-1"
              >
                Practice Interviews
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="bg-white rounded-xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-90 border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                <div className="text-3xl font-bold text-blue-600 mb-2 group-hover:text-blue-700 transition-colors duration-300">{stat.number}</div>
                <div className="text-gray-600 uppercase text-sm tracking-wider font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Companies Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Companies</h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover opportunities from leading companies in the industry.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(approvedCompanies.length ? approvedCompanies : featuredCompanies).map((company) => (
            <div key={company.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-100">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <img src={company.logo} alt={company.name} loading="lazy" className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-md" />
                    {typeof company.rating === 'number' && (
                      <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
                        <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                          {company.rating.toFixed(1)}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-900">{company.name}</h3>
                    <p className="text-blue-600 font-medium">{company.position}</p>
                  </div>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {company.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {company.type}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {company.salary}
                  </div>
                </div>
                <div className="mb-8">
                  <div className="flex flex-wrap gap-2">
                    {company.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleApplyClick(company.id)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                >
                  {user ? 'Apply for Interview' : 'Sign in to Apply'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Hear from our successful candidates who landed their dream jobs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="flex items-center mb-6">
                  <img src={testimonial.image} alt={testimonial.name} loading="lazy" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md" />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-blue-600 text-sm">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic relative pl-6">
                  <span aria-hidden="true" className="absolute left-0 top-0 text-4xl text-blue-400 font-serif">"</span>
                  {testimonial.quote}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Our platform offers unique features to help you succeed in your job search.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`${feature.color} p-8 rounded-xl text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2`}>
                <div className="text-5xl mb-6 w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-blue-100 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-r from-indigo-900 to-blue-800 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-blue-800/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
            Join our platform today and take the first step towards your dream career.
          </p>
          <button
            onClick={() => {
              if (!user) {
                sessionStorage.setItem('redirectAfterLogin', '/dashboard');
                navigate('/login');
              } else {
                navigate('/dashboard');
              }
            }}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;



// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext.js';
// import UserDebug from './UserDebug.js';

// // Static data (would normally come from API in production)
// const STATS = [
//   { number: "500+", label: "Companies", icon: "🏢" },
//   { number: "1000+", label: "Jobs Posted", icon: "💼" },
//   { number: "2000+", label: "Candidates", icon: "👥" },
//   { number: "95%", label: "Success Rate", icon: "📈" }
// ];

// const TESTIMONIALS = [
//   {
//     name: "Sarah Johnson",
//     role: "Software Engineer",
//     company: "Google",
//     image: "https://randomuser.me/api/portraits/women/1.jpg",
//     quote: "The AI-powered practice interviews helped me land my dream job at Google. The feedback was incredibly valuable!"
//   },
//   {
//     name: "Michael Chen",
//     role: "Product Manager",
//     company: "Microsoft",
//     image: "https://randomuser.me/api/portraits/men/2.jpg",
//     quote: "The platform's comprehensive preparation tools and real-time feedback made all the difference in my interview process."
//   },
//   {
//     name: "Emily Rodriguez",
//     role: "Data Scientist",
//     company: "Amazon",
//     image: "https://randomuser.me/api/portraits/women/3.jpg",
//     quote: "I was able to practice with industry-specific questions and get personalized feedback. Highly recommended!"
//   }
// ];

// const FEATURED_COMPANIES = [
//   {
//     id: 1,
//     name: "Tech Solutions Inc",
//     position: "Senior Software Engineer",
//     location: "New York, NY",
//     type: "Full-time",
//     salary: "$120,000 - $150,000",
//     logo: "https://via.placeholder.com/150",
//     skills: ["React", "Node.js", "TypeScript"],
//     rating: 4.8,
//     reviews: 128
//   },
//   {
//     id: 2,
//     name: "Digital Innovations",
//     position: "Full Stack Developer",
//     location: "San Francisco, CA",
//     type: "Remote",
//     salary: "$130,000 - $160,000",
//     logo: "https://via.placeholder.com/150",
//     skills: ["Python", "Django", "React"],
//     rating: 4.9,
//     reviews: 95
//   },
//   {
//     id: 3,
//     name: "Cloud Systems",
//     position: "DevOps Engineer",
//     location: "Austin, TX",
//     type: "Hybrid",
//     salary: "$110,000 - $140,000",
//     logo: "https://via.placeholder.com/150",
//     skills: ["AWS", "Kubernetes", "Docker"],
//     rating: 4.7,
//     reviews: 156
//   }
// ];

// const FEATURES = [
//   {
//     title: "AI-Powered Practice",
//     description: "Practice with our advanced AI interview system that provides real-time feedback and personalized suggestions.",
//     icon: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
//       </svg>
//     ),
//     color: "from-blue-500 to-blue-600"
//   },
//   {
//     title: "Expert Guidance",
//     description: "Get personalized feedback and tips from industry experts to improve your interview skills.",
//     icon: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//       </svg>
//     ),
//     color: "from-purple-500 to-purple-600"
//   },
//   {
//     title: "Proven Success",
//     description: "Join thousands of successful candidates who landed their dream jobs through our platform.",
//     icon: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//       </svg>
//     ),
//     color: "from-green-500 to-green-600"
//   }
// ];

// function Home() {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isHovering, setIsHovering] = useState(null);

//   const handleApplyClick = (companyId) => {
//     if (!user) {
//       sessionStorage.setItem('redirectAfterLogin', `/company/${companyId}`);
//       navigate('/login');
//     } else {
//       navigate(`/interview?company_id=${companyId}`);
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     const q = searchQuery.trim();
//     if (!q) return;
//     navigate(`/search?query=${encodeURIComponent(q)}`);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {user && <UserDebug />}
      
//       {/* Hero Section with Floating Elements */}
//       <div className="relative bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-900 overflow-hidden">
//         {/* Decorative elements */}
//         <div className="absolute inset-0 opacity-20">
//           <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-overlay blur-3xl opacity-30"></div>
//           <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-400 rounded-full mix-blend-overlay blur-3xl opacity-20"></div>
//           <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-purple-400 rounded-full mix-blend-overlay blur-3xl opacity-10"></div>
//         </div>
        
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 z-10">
//           <div className="text-center">
//             <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
//               <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white">
//                 Land Your Dream Job
//               </span>
//               <br />
//               <span className="text-white">With Confidence</span>
//             </h1>
//             <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
//               Connect with top companies and ace your interviews with our AI-powered preparation platform.
//             </p>
            
//             {/* Search Bar */}
//             <div className="max-w-2xl mx-auto mb-8">
//               <form 
//                 onSubmit={handleSearch} 
//                 className="flex rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300"
//                 role="search" 
//                 aria-label="Job search form"
//               >
//                 <input
//                   type="text"
//                   placeholder="Search for jobs, companies, or skills..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   aria-label="Search jobs, companies, or skills"
//                   className="flex-1 px-6 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <button 
//                   type="submit" 
//                   aria-label="Search" 
//                   className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 transition-all duration-300 flex items-center justify-center"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                   </svg>
//                 </button>
//               </form>
//             </div>

//             <div className="flex flex-col sm:flex-row justify-center gap-4">
//               <button
//                 onClick={() => navigate('/login')}
//                 className="relative overflow-hidden bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
//               >
//                 <span className="relative z-10">Get Started</span>
//                 <span className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
//               </button>
//               <button
//                 onClick={() => navigate('/practice')}
//                 className="relative overflow-hidden bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:bg-opacity-10 transition-all duration-300 hover:-translate-y-1 group"
//               >
//                 <span className="relative z-10">Practice Interviews</span>
//                 <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent"></div>
//       </div>

//       {/* Stats Section with Floating Animation */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 z-20 relative">
//         <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-90 border border-gray-100 hover:shadow-3xl transition-shadow duration-300">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             {STATS.map((stat, index) => (
//               <div 
//                 key={index} 
//                 className="text-center group"
//                 onMouseEnter={() => setIsHovering(index)}
//                 onMouseLeave={() => setIsHovering(null)}
//               >
//                 <div className={`text-4xl mb-2 transition-all duration-300 ${isHovering === index ? 'scale-110 text-blue-500' : ''}`}>
//                   {stat.icon}
//                 </div>
//                 <div className={`text-3xl font-bold mb-2 transition-all duration-300 ${isHovering === index ? 'text-blue-600 scale-105' : 'text-gray-800'}`}>
//                   {stat.number}
//                 </div>
//                 <div className={`text-gray-600 uppercase text-sm tracking-wider font-medium transition-all duration-300 ${isHovering === index ? 'text-blue-500' : ''}`}>
//                   {stat.label}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Featured Companies Section */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//         <div className="text-center mb-16">
//           <h2 className="text-4xl font-bold text-gray-900 mb-4">
//             <span className="relative inline-block">
//               Featured Companies
//               <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full"></span>
//             </span>
//           </h2>
//           <p className="text-gray-600 max-w-2xl mx-auto text-lg">
//             Discover opportunities from leading companies in the industry.
//           </p>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {FEATURED_COMPANIES.map((company) => (
//             <div 
//               key={company.id} 
//               className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 group"
//             >
//               <div className="p-6">
//                 <div className="flex items-center mb-6">
//                   <div className="relative">
//                     <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                     <img 
//                       src={company.logo} 
//                       alt={company.name} 
//                       loading="lazy" 
//                       className="relative w-16 h-16 rounded-lg object-cover border-2 border-white shadow-md z-10"
//                     />
//                     <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md z-20">
//                       <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
//                         {company.rating.toFixed(1)}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="ml-4">
//                     <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{company.name}</h3>
//                     <p className="text-blue-600 font-medium">{company.position}</p>
//                   </div>
//                 </div>
//                 <div className="space-y-4 mb-6">
//                   <div className="flex items-center text-gray-600">
//                     <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                     {company.location}
//                   </div>
//                   <div className="flex items-center text-gray-600">
//                     <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                     </svg>
//                     {company.type}
//                   </div>
//                   <div className="flex items-center text-gray-600">
//                     <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     {company.salary}
//                   </div>
//                 </div>
//                 <div className="mb-8">
//                   <div className="flex flex-wrap gap-2">
//                     {company.skills.map((skill, index) => (
//                       <span 
//                         key={index} 
//                         className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium hover:bg-blue-100 transition-colors duration-200"
//                       >
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => handleApplyClick(company.id)}
//                   className="w-full relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg group"
//                 >
//                   <span className="relative z-10">{user ? 'Apply for Interview' : 'Sign in to Apply'}</span>
//                   <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Testimonials Section */}
//       <div className="bg-gray-50 py-20 relative">
//         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">
//               <span className="relative inline-block">
//                 Success Stories
//                 <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full"></span>
//               </span>
//             </h2>
//             <p className="text-gray-600 max-w-2xl mx-auto text-lg">
//               Hear from our successful candidates who landed their dream jobs.
//             </p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {TESTIMONIALS.map((testimonial, index) => (
//               <div 
//                 key={index} 
//                 className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
//               >
//                 <div className="flex items-center mb-6">
//                   <div className="relative">
//                     <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                     <img 
//                       src={testimonial.image} 
//                       alt={testimonial.name} 
//                       loading="lazy" 
//                       className="relative w-14 h-14 rounded-full object-cover border-2 border-white shadow-md z-10"
//                     />
//                   </div>
//                   <div className="ml-4">
//                     <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{testimonial.name}</h3>
//                     <p className="text-blue-600 text-sm">{testimonial.role} at {testimonial.company}</p>
//                   </div>
//                 </div>
//                 <p className="text-gray-600 italic relative pl-6">
//                   <span aria-hidden="true" className="absolute left-0 top-0 text-4xl text-blue-400 font-serif">"</span>
//                   {testimonial.quote}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Features Section */}
//       <div className="py-20 bg-white relative overflow-hidden">
//         <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-50 to-transparent"></div>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">
//               <span className="relative inline-block">
//                 Why Choose Us
//                 <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full"></span>
//               </span>
//             </h2>
//             <p className="text-gray-600 max-w-2xl mx-auto text-lg">
//               Our platform offers unique features to help you succeed in your job search.
//             </p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {FEATURES.map((feature, index) => (
//               <div 
//                 key={index} 
//                 className={`bg-gradient-to-br ${feature.color} p-8 rounded-2xl text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden group`}
//               >
//                 <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
//                 <div className="text-blue-100 mb-6 w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-opacity-30 group-hover:rotate-6">
//                   {feature.icon}
//                 </div>
//                 <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
//                 <p className="text-blue-100 leading-relaxed">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* CTA Section */}
//       <div className="relative bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-900 py-24 overflow-hidden">
//         {/* Decorative elements */}
//         <div className="absolute inset-0 opacity-20">
//           <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-overlay blur-3xl opacity-30"></div>
//           <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-400 rounded-full mix-blend-overlay blur-3xl opacity-20"></div>
//           <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-purple-400 rounded-full mix-blend-overlay blur-3xl opacity-10"></div>
//         </div>
        
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
//           <h2 className="text-4xl font-bold text-white mb-6">
//             Ready to Start Your Journey?
//           </h2>
//           <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
//             Join our platform today and take the first step towards your dream career.
//           </p>
//           <button
//             onClick={() => {
//               if (!user) {
//                 sessionStorage.setItem('redirectAfterLogin', '/dashboard');
//                 navigate('/login');
//               } else {
//                 navigate('/dashboard');
//               }
//             }}
//             className="relative overflow-hidden bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
//           >
//             <span className="relative z-10">Get Started Now</span>
//             <span className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;