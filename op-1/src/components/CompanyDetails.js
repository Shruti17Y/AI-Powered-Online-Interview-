import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.js';

const CompanyDetails = () => {
  const navigate = useNavigate();
  const { companyId } = useParams();
  const { user } = useAuth();
  const dateInputRef = useRef(null);
  const [state, setState] = useState({
    showScheduling: false,
    selectedDate: '',
    selectedTime: '',
    scheduleStatus: '',
    isSubmitting: false,
    company: null,
    loading: true,
    error: null,
    activeTab: 'overview',
    isScrolled: false,
    hoveredBenefit: null,
    hoveredSkill: null,
    scheduledInterview: null, // epoch ms of scheduled datetime
    now: Date.now() // current time to drive UI updates
  });

  useEffect(() => {
    const handleScroll = () => {
      setState(prev => ({ ...prev, isScrolled: window.scrollY > 50 }));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const res = await axios.get(`http://localhost:8000/api/company/${companyId}/`);
        setState(prev => ({ ...prev, company: res.data, loading: false }));
      } catch (err) {
        setState(prev => ({ 
          ...prev, 
          error: 'Company not found or error loading details',
          loading: false 
        }));
      }
    };
    fetchCompany();
  }, [companyId]);

  // Helper to build localStorage key
  const getScheduledKey = () => (user?.email && state.company?.id) ? `interview:${user.email}:${state.company.id}` : null;

  // Load any pending scheduled interview from localStorage when user/company available
  useEffect(() => {
    const key = getScheduledKey();
    if (!key) return;
    const ts = localStorage.getItem(key);
    setState(prev => ({ ...prev, scheduledInterview: ts ? Number(ts) : null }));
  }, [user?.email, state.company?.id]);

  // Tick to refresh current time so UI switches automatically around the slot time
  useEffect(() => {
    const id = setInterval(() => {
      setState(prev => ({ ...prev, now: Date.now() }));
    }, 30000); // every 30s
    return () => clearInterval(id);
  }, []);

  const handleScheduleInterview = async () => {
    if (!user?.email) {
      alert('Authentication required');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/schedule-interview', {
        email: user.email,
        name: user.name,
        company: state.company.name,
        position: state.company.position,
        interviewTime: `${state.selectedDate} ${state.selectedTime}`
      });
    } catch (err) {
      console.error('Email error:', err);
    }
  };

  const handleCancelInterview = () => {
    const key = getScheduledKey();
    if (key) {
      localStorage.removeItem(key);
    }
    setState(prev => ({ ...prev, scheduledInterview: null }));
  };

  const handleSchedule = async () => {
    if (!state.selectedDate || !state.selectedTime) {
      setState(prev => ({ ...prev, scheduleStatus: 'Please select date and time' }));
      return;
    }

    setState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      await handleScheduleInterview();
      
      setState(prev => ({ 
        ...prev, 
        scheduleStatus: 'Interview scheduled successfully! Check your email for confirmation.',
        showScheduling: false
      }));
      
      const now = new Date();
      const scheduledDateTime = new Date(`${state.selectedDate}T${state.selectedTime}:00`);
      const delay = scheduledDateTime - now;

      // Persist scheduled interview locally to control UI until the slot time
      const key = getScheduledKey();
      if (key) {
        localStorage.setItem(key, String(scheduledDateTime.getTime()));
        setState(prev => ({ ...prev, scheduledInterview: scheduledDateTime.getTime() }));
      }

      const skillsParam = skillsArray.length > 0 ? skillsArray.join(',') : '';
      const aptitudeUrl = `/aptitude?companyId=${state.company.id}${skillsParam ? `&skills=${encodeURIComponent(skillsParam)}` : ''}`;
      
      if (delay > 0) {
        setTimeout(() => window.open(aptitudeUrl, '_blank'), delay);
      } else {
        window.open(aptitudeUrl, '_blank');
      }

      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        scheduleStatus: 'Scheduling failed. Please try again.' 
      }));
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let min = 0; min < 60; min += 30) {
        if (hour === 17 && min > 0) break;
        const h24 = hour.toString().padStart(2, '0');
        const m = min.toString().padStart(2, '0');
        let h12 = hour % 12 || 12;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        slots.push({
          value: `${h24}:${m}`,
          display: `${h12}:${m} ${ampm}`
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Determine if there is an upcoming scheduled interview (hide schedule, show cancel)
  const isBeforeScheduled = state.scheduledInterview && state.now < state.scheduledInterview;

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-blue-300 border-b-transparent rounded-full animate-spin animation-delay-150"></div>
          </div>
          <h2 className="text-xl font-medium text-gray-700">Loading Company Profile</h2>
          <p className="text-gray-500">Preparing the finest details for you</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-rose-600 p-5">
            <div className="flex items-center">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="ml-2 text-xl font-semibold text-white">Data Unavailable</h3>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-700 mb-6">{state.error}</p>
            <div className="flex space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-md transition-all"
              >
                Retry
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!state.company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden text-center">
          <div className="p-8">
            <div className="mx-auto h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">Company Not Found</h3>
            <p className="mt-2 text-gray-600">The company profile you requested is currently unavailable.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-6 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-md transition-all"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Process company data
  const logoUrl = state.company?.logo?.startsWith('http') 
    ? state.company.logo 
    : state.company?.logo?.startsWith('/media/') 
      ? `http://localhost:8000${state.company.logo}`
      : state.company?.logo 
        ? `http://localhost:8000/media/${state.company.logo.replace(/^([\/\\])+/u, '')}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(state.company.name)}&background=random&color=fff&bold=true&size=128`;

  const benefitsArray = Array.isArray(state.company.benefits)
    ? state.company.benefits
    : (typeof state.company.benefits === 'string' ? state.company.benefits.split(',').map(b => b.trim()) : []);

  const skillsArray = Array.isArray(state.company.required_skills)
    ? state.company.required_skills
    : (typeof state.company.required_skills === 'string' ? state.company.required_skills.split(',').map(s => s.trim()) : []);

  const jobTypeArray = Array.isArray(state.company.job_type)
    ? state.company.job_type
    : (typeof state.company.job_type === 'string' ? state.company.job_type.split(',').map(j => j.trim()) : []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sticky Glass Header */}
      <header className={`fixed top-0 left-0 right-0 z-20 backdrop-blur-md bg-white/80 shadow-sm transition-all duration-300 ${
        state.isScrolled ? 'py-3' : 'py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm group-hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
              </div>
              <span className="font-medium">Back</span>
            </button>
            <h1 className={`font-bold text-gray-900 transition-all duration-300 ${
              state.isScrolled ? 'text-xl' : 'text-2xl'
            }`}>
              {state.company.name}
            </h1>
            <div className="w-8"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Company Hero Section */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl mb-10 border border-blue-400">
          <div className="absolute inset-0 bg-white"></div>
          <div className="relative z-10 p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="relative">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                  <img 
                    src={logoUrl} 
                    alt={state.company.name} 
                    className="w-full h-full object-contain p-2 rounded-full"
                  />
                </div>
              </div>
              <div className="flex-1 text-gray-900">
                <h1 className="text-2xl md:text-3xl font-bold">{state.company.position}</h1>
                <p className="text-2xl md:text-3xl text-gray-900 font-extrabold mt-1">{state.company.name}</p>
                <div className="flex flex-wrap gap-3 mt-5">
                  {state.company.location && (
                    <span className="inline-flex items-center bg-gray-100 rounded-full px-4 py-1.5 text-sm text-gray-700">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      {state.company.location}
                    </span>
                  )}
                  {state.company.salary && (
                    <span className="inline-flex items-center bg-gray-100 rounded-full px-4 py-1.5 text-sm text-gray-700">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {state.company.salary}
                    </span>
                  )}
                  {state.company.experience_required && (
                    <span className="inline-flex items-center bg-gray-100 rounded-full px-4 py-1.5 text-sm text-gray-700">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {state.company.experience_required}
                    </span>
                  )}
                </div>
              </div>
              {!state.showScheduling && (
                <div className="mt-4 md:mt-0">
                  {/* Stats Box - Kept identical to original but with better alignment */}

                  {/* Schedule/Cancel Controls */}
                  {isBeforeScheduled ? (
                    <>
                      <div className="mb-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                        Interview scheduled at {new Date(state.scheduledInterview).toLocaleString()}
                      </div>
                      <button
                        onClick={handleCancelInterview}
                        className="w-full py-2.5 px-4 rounded-lg border-2 border-rose-600 text-rose-600 bg-white hover:bg-rose-50 transition-colors font-medium"
                      >
                        Cancel Interview
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setState(prev => ({ ...prev, showScheduling: true }))}
                      className="w-full py-2.5 px-4 rounded-lg border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-50 transition-colors font-medium"
                    >
                      Schedule Interview
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px space-x-8">
              <button
                onClick={() => setState(prev => ({ ...prev, activeTab: 'overview' }))}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  state.activeTab === 'overview' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <svg className={`w-5 h-5 mr-2 ${
                    state.activeTab === 'overview' ? 'text-blue-500' : 'text-gray-400'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                  </svg>
                  Overview
                </div>
              </button>
              <button
                onClick={() => setState(prev => ({ ...prev, activeTab: 'requirements' }))}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  state.activeTab === 'requirements' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <svg className={`w-5 h-5 mr-2 ${
                    state.activeTab === 'requirements' ? 'text-blue-500' : 'text-gray-400'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                  Requirements
                </div>
              </button>
              <button
                onClick={() => setState(prev => ({ ...prev, activeTab: 'benefits' }))}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  state.activeTab === 'benefits' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <svg className={`w-5 h-5 mr-2 ${
                    state.activeTab === 'benefits' ? 'text-blue-500' : 'text-gray-400'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Benefits
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-10">
          {state.activeTab === 'overview' && (
            <>
              <div className="bg-white rounded-xl shadow-sm p-8 border border-blue-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Job Description</h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="leading-relaxed">{state.company.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm p-8 border border-blue-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Job Details</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Job Type</h4>
                      {jobTypeArray.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {jobTypeArray.map((type, idx) => (
                            <span 
                              key={idx} 
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm">Not specified</p>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Experience Level</h4>
                      <p className="text-gray-900">{state.company.experience_required || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-8 border border-blue-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Key Information</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Location</h4>
                      <p className="text-gray-900">{state.company.location || 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Salary</h4>
                      <p className="text-gray-900">{state.company.salary || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {state.activeTab === 'requirements' && (
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">Skills & Requirements</h2>
              {skillsArray.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No Specific Requirements</h3>
                  <p className="mt-2 text-gray-600 max-w-md mx-auto">
                    This position doesn't require any specific skills. We're looking for passionate individuals ready to learn.
                  </p>
                </div>
              ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {skillsArray.map((skill, index) => (
                    <li 
                      key={index} 
                      className="relative bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors"
                      onMouseEnter={() => setState(prev => ({ ...prev, hoveredSkill: index }))}
                      onMouseLeave={() => setState(prev => ({ ...prev, hoveredSkill: null }))}
                    >
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 h-6 w-6 mt-0.5 transition-all ${
                          state.hoveredSkill === index ? 
                            'text-blue-600 scale-110' : 
                            'text-blue-500'
                        }`}>
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{skill}</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {state.hoveredSkill === index ? 
                              'This skill is essential for the position' : 
                              'Required skill'}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {state.activeTab === 'benefits' && (
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">Employee Benefits</h2>
              {benefitsArray.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Benefits Coming Soon</h3>
                  <p className="mt-2 text-gray-600 max-w-md mx-auto">
                    We're currently working on our benefits package. Check back later for updates.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {benefitsArray.map((benefit, index) => (
                    <div 
                      key={index} 
                      className={`relative bg-white border border-gray-200 rounded-xl p-6 transition-all ${
                        state.hoveredBenefit === index ? 
                          'shadow-lg transform -translate-y-1 border-blue-200' : 
                          'shadow-sm hover:shadow-md'
                      }`}
                      onMouseEnter={() => setState(prev => ({ ...prev, hoveredBenefit: index }))}
                      onMouseLeave={() => setState(prev => ({ ...prev, hoveredBenefit: null }))}
                    >
                      <div className="absolute top-0 right-0 h-16 w-16 bg-blue-50 opacity-20 rounded-bl-full"></div>
                      <div className="relative z-10">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center transition-all ${
                            state.hoveredBenefit === index ? 
                              'bg-blue-600 text-white' : 
                              'bg-blue-100 text-blue-600'
                          }`}>
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                            </svg>
                          </div>
                          <h3 className="ml-4 text-lg font-medium text-gray-900">{benefit}</h3>
                        </div>
                        <p className="mt-4 text-sm text-gray-600">
                          {state.hoveredBenefit === index ? 
                            `As part of our commitment to employee satisfaction, ${state.company.name} provides this benefit to all team members.` : 
                            'Available to all full-time employees.'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Enhanced Interview Scheduling Modal */}
      {state.showScheduling && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-30">
          <div className={`bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all duration-300 ${
            state.showScheduling ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}>
            <div className="relative p-6">
              {/* Scoped styles to hide native date icon and keep only custom icon */}
              <style>
                {`
                  .custom-date::-webkit-calendar-picker-indicator { display: none; }
                  .custom-date { -webkit-appearance: none; appearance: none; padding-right: 20px; }
                `}
              </style>
              {/* Close Button */}
              <button 
                onClick={() => {
                  setState(prev => ({ ...prev, showScheduling: false, scheduleStatus: '' }));
                }}
                className="absolute top-5 right-5 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-3">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Schedule Your Interview</h3>
                <p className="mt-1 text-gray-500">Select a date and time for your {state.company.position} interview</p>
              </div>

              {/* Interview Details Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl mb-6 border border-blue-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-semibold text-blue-800">Interview Details</h4>
                    <div className="mt-1 grid grid-cols-1 gap-y-2 text-sm text-gray-700">
                      <div className="flex items-start">
                        <span className="text-gray-500 mr-2">Company:</span>
                        <span className="font-medium">{state.company.name}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-gray-500 mr-2">Email:</span>
                        <span className="font-medium">{user?.email || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date and Time Selection */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={state.selectedDate}
                      onChange={(e) => setState(prev => ({ ...prev, selectedDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      className="custom-date block w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                      ref={dateInputRef}
                    />
                    <div
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                      onClick={() => {
                        const el = dateInputRef.current;
                        if (!el) return;
                        if (typeof el.showPicker === 'function') {
                          el.showPicker();
                        } else {
                          el.focus();
                          el.click();
                        }
                      }}
                      aria-label="Open date picker"
                    >
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Time Slot</label>
                  <div className="relative">
                    <select
                      value={state.selectedTime}
                      onChange={(e) => setState(prev => ({ ...prev, selectedTime: e.target.value }))}
                      className="block w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    >
                      <option value="">Choose a time</option>
                      {timeSlots.map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.display}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Message */}
              {state.scheduleStatus && (
                <div className={`mt-4 p-3 rounded-lg flex items-start ${
                  state.scheduleStatus.includes('successfully') ? 
                    'bg-green-50 text-green-800' : 
                    'bg-rose-50 text-rose-800'
                }`}>
                  <svg className={`flex-shrink-0 h-5 w-5 mt-0.5 ${
                    state.scheduleStatus.includes('successfully') ? 'text-green-500' : 'text-rose-500'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={
                      state.scheduleStatus.includes('successfully') ? 
                      "M5 13l4 4L19 7" : 
                      "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    }></path>
                  </svg>
                  <p className="ml-2 text-sm">{state.scheduleStatus}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => {
                    setState(prev => ({ ...prev, showScheduling: false, scheduleStatus: '' }));
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSchedule}
                  disabled={state.isSubmitting}
                  className={`flex-1 px-4 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
                    state.isSubmitting ? 'opacity-80 cursor-not-allowed' : ''
                  }`}
                >
                  {state.isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0.395 0 4.586 0 12c0 5.514 2.977 10.305 8 11.604v1.493a8 8 0 018 8v-1.5C20.727 23.305 24 18.514 24 12c0-7.48-5.733-13.956-14-15.197V6.864a8 8 0 018-8z"></path>
                      </svg>
                      Scheduling...
                    </span>
                  ) : (
                    'Confirm Interview'
                  )}
                </button>
              </div>

              {/* Help Text */}
              <p className="mt-4 text-xs text-gray-500 text-center">
                You'll receive a confirmation email with all the details.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetails;  