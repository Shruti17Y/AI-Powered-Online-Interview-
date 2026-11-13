import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { motion } from 'framer-motion';
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaRegQuestionCircle,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaArrowRight,
  FaRobot,
  FaBrain,
  FaMicrochip,
  FaBuilding,
  FaFileUpload,
  FaMoneyBill,
  FaBriefcase,
  FaUserTie,
  FaClipboardList,
  FaCheckCircle,
  FaListAlt,
  FaGift,
  FaLock,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

import './ContactPage.css';

const ContactPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    inquiry: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const inquiryTypes = [
    'General Inquiry',
    'Technical Support',
    'Business Partnership',
    'Career Opportunities'
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setSubmitted(true);
  };

  const [companyForm, setCompanyForm] = useState({
    name: '',
    logo: null,
    location: '',
    job_type: '',
    salary: '',
    experience_required: '',
    description: '',
    contact_info: '',
    required_skills: '',
    benefits: '',
    hr_email: '',
    company_password: '',
  });
  const [companySubmitted, setCompanySubmitted] = useState(false);
  const [companyError, setCompanyError] = useState('');
  const [showCompanyPassword, setShowCompanyPassword] = useState(false);
  const [companyPasswordError, setCompanyPasswordError] = useState('');

  const validateCompanyPassword = (pass) => {
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumbers = /[0-9]/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const isLongEnough = pass.length >= 8;

    const missing = [];
    if (!hasUpperCase) missing.push('uppercase letter');
    if (!hasLowerCase) missing.push('lowercase letter');
    if (!hasNumbers) missing.push('number');
    if (!hasSpecialChar) missing.push('special character');
    if (!isLongEnough) missing.push('8+ characters');

    return missing.length ? `Password must include: ${missing.join(', ')}` : '';
  };

  const handleCompanyChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'logo') {
      setCompanyForm({ ...companyForm, logo: files[0] });
    } else {
      setCompanyForm({ ...companyForm, [name]: value });
      if (name === 'company_password') {
        setCompanyPasswordError(validateCompanyPassword(value));
      }
    }
  };
 

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
  if (!user) {
    navigate('/login');
    return;
  }
    setCompanyError('');
    // Validate password before submitting
    const pwdError = validateCompanyPassword(companyForm.company_password || '');
    if (pwdError) {
      setCompanyPasswordError(pwdError);
      setCompanyError('Please fix password requirements');
      return;
    }
    const formData = new FormData();
    Object.entries(companyForm).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    try {
      const res = await fetch('http://127.0.0.1:8000/api/company/register/', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to submit company registration.');
      setCompanySubmitted(true);
      setCompanyForm({
        name: '', logo: null, location: '', job_type: '', salary: '', experience_required: '', description: '', contact_info: '', required_skills: '', benefits: '', hr_email: '', company_password: '',
      });
    } catch (err) {
      setCompanyError(err.message);
    }
  };

  return (
    <div className="contact-page" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      fontFamily: "'Poppins', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Enhanced Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '400px',
          height: '400px',
          background: 'linear-gradient(45deg, #60a5fa 0%, #3b82f6 100%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: '0.1',
          zIndex: 0
        }}
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          bottom: '-15%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'linear-gradient(45deg, #818cf8 0%, #6366f1 100%)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: '0.1',
          zIndex: 0
        }}
      />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative py-12 px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Decorative Line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "30%" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 mb-4 mx-auto"
        ></motion.div>

        {/* AI Logo Animation - Reduced size */}
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 20px',
            position: 'relative'
          }}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '32px',
              fontWeight: 'bold',
              letterSpacing: '2px',
              boxShadow: '0 8px 32px rgba(99,102,241,0.25)',
              border: '4px solid rgba(255,255,255,0.8)',
              transform: 'rotate(-5deg)',
              transition: 'all 0.3s ease'
            }}
          >
            AI
          </motion.div>
          
          {/* Tech Icons Animation - Reduced size */}
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              fontSize: '18px',
              color: '#6366f1'
            }}
          >
            <FaRobot />
          </motion.div>
          
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [-10, 10, -10],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              bottom: '-4px',
              left: '-4px',
              fontSize: '18px',
              color: '#8b5cf6'
            }}
          >
            <FaBrain />
          </motion.div>
          
          <motion.div
            animate={{
              y: [0, -5, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              position: 'absolute',
              top: '50%',
              right: '-12px',
              fontSize: '18px',
              color: '#4f46e5'
            }}
          >
            <FaMicrochip />
          </motion.div>
        </motion.div>

        {/* Heading with gradient text - Reduced size */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-2 text-4xl sm:text-5xl lg:text-6xl font-extrabold"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Contact Us
          </span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-4 text-xl sm:text-2xl font-bold"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
            Empowering Smarter Interviews with AI
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-4 text-base sm:text-lg text-gray-600 max-w-xl mx-auto"
        >
          Our platform leverages advanced AI to ensure fair, insightful, and efficient interviews for candidates and companies alike. Reach out to our team for support.
        </motion.p>
      </motion.div>

      {/* Enhanced Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px 60px',
        position: 'relative',
        zIndex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '40px',
        alignItems: 'start'
      }}>
        {/* Enhanced Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.01 }}
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 20px 40px rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.2)',
            transition: 'transform 0.3s ease',
            borderTop: '4px solid #6366f1'
          }}
        >
          {submitted ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                textAlign: 'center',
                padding: '40px 20px'
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: 'white',
                  fontSize: '40px'
                }}
              >
                ✓
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  fontSize: '24px',
                  color: '#6366f1',
                  marginBottom: '10px'
                }}
              >
                Message Sent!
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{
                  color: '#4b5563',
                  fontSize: '16px'
                }}
              >
                We'll get back to you as soon as possible.
              </motion.p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Form fields with enhanced animations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ marginBottom: '24px' }}
              >
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#1e293b',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  Name
                </label>
                <div style={{
                  position: 'relative',
                  transition: 'all 0.3s ease'
                }}>
                  <FaUserCircle style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                    fontSize: '20px'
                  }} />
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      borderRadius: '12px',
                      border: '2px solid #e2e8f0',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      background: 'rgba(255, 255, 255, 0.9)'
                    }}
                    placeholder="Your name"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ marginBottom: '24px' }}
              >
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#1e293b',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <FaEnvelope style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                    fontSize: '20px'
                  }} />
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      borderRadius: '12px',
                      border: '2px solid #e2e8f0',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      background: 'rgba(255, 255, 255, 0.9)'
                    }}
                    placeholder="Your email"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ marginBottom: '24px' }}
              >
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#1e293b',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>Phone</label>
                <div style={{ position: 'relative' }}>
                  <FaPhone style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                    fontSize: '20px'
                  }} />
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      borderRadius: '12px',
                      border: '2px solid #e2e8f0',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      background: 'rgba(255, 255, 255, 0.9)'
                    }}
                    placeholder="Your phone number"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ marginBottom: '24px' }}
              >
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#1e293b',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>Inquiry Type</label>
                <div style={{ position: 'relative' }}>
                  <FaRegQuestionCircle style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                    fontSize: '20px'
                  }} />
                  <motion.select
                    whileFocus={{ scale: 1.02 }}
                    name="inquiry"
                    value={form.inquiry}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      borderRadius: '12px',
                      border: '2px solid #e2e8f0',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      background: 'rgba(255, 255, 255, 0.9)',
                      appearance: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Select inquiry type...</option>
                    {inquiryTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </motion.select>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ marginBottom: '32px' }}
              >
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#1e293b',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    fontSize: '1rem',
                    resize: 'vertical',
                    transition: 'all 0.3s ease',
                    background: 'rgba(255, 255, 255, 0.9)'
                  }}
                  placeholder="Your message"
                />
              </motion.div>

              <motion.button
                type="submit"
                className="btn-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>Send Message</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <FaArrowRight />
                </motion.span>
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* Company Registration Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          whileHover={{ scale: 1.01 }}
          className="scroll-card"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 20px 40px rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.2)',
            transition: 'transform 0.3s ease',
            marginTop: '40px',
            maxHeight: '115vh',
            overflowY: 'auto',
            borderTop: '4px solid #6366f1'
          }}
        >
          <h2 style={{
            fontSize: '1.25rem',
            color: '#1e293b',
            margin: 0,
            textAlign: 'left',
            fontWeight: 700,
            
            top: 0,
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '12px 0',
            borderBottom: '1px solid rgba(99,102,241,0.2)',
          
          }}>Company Registration Form</h2>
          {companySubmitted ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <FaCheckCircle style={{ color: '#22c55e', fontSize: '40px', marginBottom: '10px' }} />
              <h3 style={{ color: '#6366f1', fontSize: '22px', marginBottom: '10px' }}>Registration Submitted!</h3>
              <p style={{ color: '#4b5563', fontSize: '16px' }}>Your company registration has been received and is pending admin approval.</p>
            </div>
          ) : (
            <form onSubmit={handleCompanySubmit} encType="multipart/form-data">
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontWeight: 500, color: '#1e293b' }}>Company Name</label>
                <div style={{ position: 'relative' }}>
                  <FaBuilding style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '20px' }} />
                  <input type="text" name="name" value={companyForm.name} onChange={handleCompanyChange} required style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', background: 'rgba(255,255,255,0.9)' }} placeholder="Company name" />
                </div>
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontWeight: 500, color: '#1e293b' }}>Logo</label>
                <div style={{ position: 'relative' }}>
                  <FaFileUpload style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '20px' }} />
                  <input type="file" name="logo" accept="image/*" onChange={handleCompanyChange} style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', background: 'rgba(255,255,255,0.9)' }} />
                </div>
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontWeight: 500, color: '#1e293b' }}>Location</label>
                <div style={{ position: 'relative' }}>
                  <FaMapMarkerAlt style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '20px' }} />
                  <input type="text" name="location" value={companyForm.location} onChange={handleCompanyChange} required style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', background: 'rgba(255,255,255,0.9)' }} placeholder="Location" />
                </div>
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontWeight: 500, color: '#1e293b' }}>Job Type</label>
                <div style={{ position: 'relative' }}>
                  <FaBriefcase style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '20px' }} />
                  <input type="text" name="job_type" value={companyForm.job_type} onChange={handleCompanyChange} required style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', background: 'rgba(255,255,255,0.9)' }} placeholder="Job type (e.g. Full-time)" />
                </div>
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontWeight: 500, color: '#1e293b' }}>Salary</label>
                <div style={{ position: 'relative' }}>
                  <FaMoneyBill style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '20px' }} />
                  <input type="text" name="salary" value={companyForm.salary} onChange={handleCompanyChange} required style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', background: 'rgba(255,255,255,0.9)' }} placeholder="Salary offered" />
                </div>
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontWeight: 500, color: '#1e293b' }}>Experience Required</label>
                <div style={{ position: 'relative' }}>
                  <FaUserTie style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '20px' }} />
                  <input type="text" name="experience_required" value={companyForm.experience_required} onChange={handleCompanyChange} required style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', background: 'rgba(255,255,255,0.9)' }} placeholder="Experience required (e.g. 2+ years)" />
                </div>
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontWeight: 500, color: '#1e293b' }}>Description</label>
                <div style={{ position: 'relative' }}>
                  <FaClipboardList style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '20px' }} />
                  <textarea name="description" value={companyForm.description} onChange={handleCompanyChange} required rows={3} style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', background: 'rgba(255,255,255,0.9)' }} placeholder="Company/job description" />
                </div>
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontWeight: 500, color: '#1e293b' }}>HR Email</label>
                <div style={{ position: 'relative' }}>
                  <FaEnvelope style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '20px' }} />
                  <input type="email" name="hr_email" value={companyForm.hr_email} onChange={handleCompanyChange} required style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', background: 'rgba(255,255,255,0.9)' }} placeholder="HR email address" />
                </div>
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontWeight: 500, color: '#1e293b' }}>Company Password</label>
                <div style={{ position: 'relative' }}>
                  <FaLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '20px' }} />
                  <input
                    type={showCompanyPassword ? 'text' : 'password'}
                    name="company_password"
                    value={companyForm.company_password}
                    onChange={handleCompanyChange}
                    required
                    style={{ width: '100%', padding: '12px 40px 12px 40px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', background: 'rgba(255,255,255,0.9)' }}
                    placeholder="Set a password for company HR"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCompanyPassword(!showCompanyPassword)}
                    aria-label={showCompanyPassword ? 'Hide password' : 'Show password'}
                    title={showCompanyPassword ? 'Hide password' : 'Show password'}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
                  >
                    {showCompanyPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
                {companyForm.company_password && (
                  companyPasswordError ? (
                    <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '6px' }}>{companyPasswordError}</p>
                  ) : (
                    <p style={{ color: '#16a34a', fontSize: '0.85rem', marginTop: '6px' }}>Password looks good</p>
                  )
                )}
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontWeight: 500, color: '#1e293b' }}>Required Skills</label>
                <div style={{ position: 'relative' }}>
                  <FaListAlt style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '20px' }} />
                  <input type="text" name="required_skills" value={companyForm.required_skills} onChange={handleCompanyChange} required style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', background: 'rgba(255,255,255,0.9)' }} placeholder="Required skills (comma separated)" />
                </div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontWeight: 500, color: '#1e293b' }}>Benefits</label>
                <div style={{ position: 'relative' }}>
                  <FaGift style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '20px' }} />
                  <textarea name="benefits" value={companyForm.benefits} onChange={handleCompanyChange} rows={2} style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', background: 'rgba(255,255,255,0.9)' }} placeholder="Benefits offered" />
                </div>
              </div>
              {companyError && <p style={{ color: 'red', marginBottom: '10px' }}>{companyError}</p>}
              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease' }}>Submit Registration</button>
            </form>
          )}
        </motion.div>

        {/* Enhanced Map and Info Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '40px'
        }}>
          {/* Enhanced Map Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.2)',
              transition: 'transform 0.3s ease',
              borderTop: '4px solid #6366f1'
            }}
          >
            <div style={{
              width: '100%',
              height: '300px',
              position: 'relative'
            }}>
              <iframe
                title="Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537363153169!3d-37.81627977975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f1f6e0b1%3A0x5045675218ce6e0!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div style={{
              padding: '24px',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                color: '#1e293b',
                marginBottom: '8px'
              }}>Visit Our Office</h3>
              <p style={{
                color: '#475569',
                fontSize: '1rem'
              }}>Melbourne, VIC, Australia</p>
            </div>
          </motion.div>

          {/* Enhanced Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              display: 'grid',
              gap: '20px'
            }}
          >
            {[
              // {
              //   icon: FaPhone,
              //   title: 'Phone',
              //   content: '+1 (555) 123-4567',
              //   link: 'tel:+15551234567',
              //   gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
              // },
              {
                icon: FaEnvelope,
                title: 'Email',
                content: 'support@ai-interview.com',
                link: 'mailto:support@ai-interview.com',
                gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
              }
            ].map((item, index) => (
              <motion.a
                key={index}
                href={item.link}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  textDecoration: 'none',
                  boxShadow: '0 10px 20px rgba(99,102,241,0.05)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  transition: 'all 0.3s ease'
                }}
              >
                <motion.div
                  whileHover={{ rotate: 15 }}
                  style={{
                    width: '48px',
                    height: '48px',
                    background: item.gradient,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '24px'
                  }}
                >
                  <item.icon />
                </motion.div>
                <div>
                  <h3 style={{
                    color: '#1e293b',
                    fontSize: '1.1rem',
                    marginBottom: '4px'
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    background: item.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '1rem',
                    margin: 0
                  }}>
                    {item.content}
                  </p>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Enhanced Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '24px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.2)'
            }}
          >
            <h3 style={{
              fontSize: '1.2rem',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '16px'
            }}>
              Connect With Us
            </h3>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px'
            }}>
              {[
                { icon: FaLinkedin, link: 'https://linkedin.com', gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' },
                { icon: FaTwitter, link: 'https://twitter.com', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
                { icon: FaFacebook, link: 'https://facebook.com', gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: '40px',
                    height: '40px',
                    background: social.gradient,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <social.icon />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
        }

        select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236366f1'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 16px;
        }

        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;