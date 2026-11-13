import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import Footer from './components/Footer.js';

import Login from './components/Login.js';
import UserDashboard from './components/UserDashboard.js';
import AdminDashboard from './components/AdminDashboard.js';
import Practice from './components/Practice.js';
import Home from './components/Home.js';
import About from './components/About.js';
import CompanyDetails from './components/CompanyDetails.js';
import ContactPage from './components/ContactPage.js';
import CameraInterview from './components/CameraInterview.js';
import CombinedAssessment from './components/CombinedAssessment.js';
// import InterviewPage from './components/InterviewPage.js';
import MinimalMediaRecorderTest from './components/ExpressionTest.js';
// import QuestionQueue from './components/QuestionQueue.js';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import './App.css';
import MyInterviews from './components/MyInterviews.js';
import Signup from './components/Signup.js';
import ProfileSettings from './components/ProfileSettings.js';
import { AptitudeProvider, useAptitude } from './context/AptitudeContext.js';
import Aptitude from './components/Aptitude.js';
import HRDashboard from './components/HRDashboard.js';
import CandidateHistory from './components/CandidateHistory.js';
import CompanyInterviewHistory from './components/CompanyInterviewHistory.js';
import WarningPage from './components/WarningPage.js';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/camera-interview' || location.pathname === '/warning';
  const { passedAptitude, setPassedAptitude } = useAptitude();
  const navigate = useNavigate();

  // Handlers for Aptitude pass/fail
  const handleAptitudePass = ({ companyId, skills } = {}) => {
    setPassedAptitude(true);
    let url = '/warning';
    const params = [];
    if (companyId) params.push(`companyId=${companyId}`);
    if (skills) params.push(`skills=${encodeURIComponent(skills)}`);
    if (params.length) url += '?' + params.join('&');
    navigate(url);
  };
  const handleAptitudeFail = () => {
    setPassedAptitude(false);
    // Optionally show a message or stay on the page
  };
  const HRProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user || user.role !== "hr") {
      return <Navigate to="/login" />;
    }
    return children;
  };
  const CameraInterviewProtected = ({ children }) => {
    if (!passedAptitude) {
      return <Navigate to="/aptitude" />;
    }
    return children;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!hideNavbar && <Navbar />}
      <div style={{ flex: 1 }}>
        <Routes>
        <Route path="/assessment" element={<CombinedAssessment />} />
        <Route path="/aptitude" element={<Aptitude onPass={handleAptitudePass} onFail={handleAptitudeFail} />} />
        <Route path="/warning" element={<WarningPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactPage />} />
        {/* <Route path="/interview" element={<InterviewPage />} /> */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/company/:companyId" 
          element={
            <ProtectedRoute>
              <CompanyDetails />
            </ProtectedRoute>
          } 
        />
        <Route path="/camera-interview" element={
          <CameraInterviewProtected>
            <CameraInterview />
          </CameraInterviewProtected>
        } />
        <Route path="/expression-test" element={<MinimalMediaRecorderTest />} />
        {/* <Route path="/question-queue" element={<QuestionQueue />} /> */}
        <Route path="/my-interviews" element={<MyInterviews />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route
  path="/hr-dashboard"
  element={
    <HRProtectedRoute>
      <HRDashboard />
    </HRProtectedRoute>
  }
/>
        <Route
          path="/hr/candidate-history/:email"
          element={
            <HRProtectedRoute>
              <CandidateHistory />
            </HRProtectedRoute>
          }
        />
        <Route
          path="/hr/company-history/:companyId"
          element={
            <HRProtectedRoute>
              <CompanyInterviewHistory />
            </HRProtectedRoute>
          }
        />
        </Routes>
      </div>
      {!hideNavbar && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AptitudeProvider>
        <Router>
          <div>
            <AppContent />
          </div>
        </Router>
      </AptitudeProvider>
    </AuthProvider>
  );
}

export default App;