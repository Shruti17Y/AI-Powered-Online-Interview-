import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { motion } from 'framer-motion';
import { 
  FaRobot, FaBrain, FaMicrochip, FaGraduationCap, 
  FaChartLine, FaUsers, FaClock, FaLightbulb,
  FaCode, FaChartBar, FaCertificate, FaHeadset,
  FaLinkedin, FaTwitter, FaGithub
} from 'react-icons/fa';

// Add this new component for animated numbers
const AnimatedCounter = ({ end, duration = 2000 }) => {
  const [count, setCount] = React.useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{count}</span>;
};

function About() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  // Enhanced stats with more professional metrics
  const stats = [
    {
      number: "98%",
      label: "Success Rate",
      description: "Interview success ratio",
      icon: "📈",
      color: "from-green-400 to-emerald-500"
    },
    {
      number: "50K+",
      label: "Users Worldwide",
      description: "Growing community",
      icon: "🌍",
      color: "from-blue-400 to-indigo-500"
    },
    {
      number: "200+",
      label: "AI Models",
      description: "Specialized training",
      icon: "🤖",
      color: "from-purple-400 to-pink-500"
    },
    {
      number: "24/7",
      label: "AI Support",
      description: "Always available",
      icon: "🛟",
      color: "from-orange-400 to-red-500"
    }
  ];

  // Enhanced features with more detailed offerings
  const features = [
    {
      title: "Advanced AI Interview Simulation",
      description: "Experience realistic interviews with our state-of-the-art AI that adapts to your responses and industry.",
      icon: FaRobot,
      color: "from-blue-400 to-indigo-500",
      points: [
        "Natural Language Processing",
        "Real-time Company Register System",
        "Behavioral Analysis"
      ]
    },
    {
      title: "Comprehensive Analytics",
      description: "Get detailed insights into your performance with our advanced analytics platform.",
      icon: FaChartBar,
      color: "from-purple-400 to-pink-500",
      points: [
        "Performance Metrics",
        "Improvement Tracking",
        "Skill Gap Analysis",
        "Custom Reports"
      ]
    },
    {
      title: "Expert-Curated Content",
      description: "Access a vast library of resources created by industry professionals.",
      icon: FaCertificate,
      color: "from-green-400 to-emerald-500",
      points: [
        "Industry Best Practices",
        "Interview Strategies",
        "Success Stories",
        "Expert Tips"
      ]
    },
    {
      title: "24/7 Learning Support",
      description: "Get help whenever you need it with our comprehensive support system.",
      icon: FaHeadset,
      color: "from-orange-400 to-red-500",
      points: [
        "AI-powered Assistance",
        "Resource Library",
        "Community Support",
        "Expert Guidance"
      ]
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Software Engineer",
      company: "Tech Giant Corp",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      content: "AIvista helped me land my dream job! The AI interview practice was incredibly realistic.",
      rating: 5
    },
    {
      name: "James L.",
      role: "Product Manager",
      company: "Startup Inc",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      content: "The industry-specific questions really prepared me for my actual interviews.",
      rating: 5
    },
    {
      name: "Emily R.",
      role: "Data Scientist",
      company: "Analytics Co",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      content: "The feedback system is amazing. It helped me improve my communication skills.",
      rating: 5
    }
  ];

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      bio: "10+ years in AI and EdTech",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      bio: "AI/ML Expert & System Architect",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Product",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      bio: "Product Strategy & Innovation",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "David Kim",
      role: "Lead Developer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      bio: "Full-stack & AI Integration",
      linkedin: "#",
      twitter: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Redesigned Hero Section with Split Layout */}
      <div className="relative min-h-screen bg-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-24"
            >
              <div className="relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "40%" }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mb-6"
                ></motion.div>
                
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-sm font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500"
                >
                  WELCOME TO AIVISTA
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-4 text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight"
                >
                  Master Your
                  <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                    Interview Skills
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="mt-8 text-xl text-gray-600 leading-relaxed max-w-lg"
                >
                  Transform your interview performance with our cutting-edge 
                  <span className="text-indigo-600 font-semibold"> AI-powered platform</span>. 
                  Get personalized feedback and expert guidance to 
                  <span className="text-purple-600 font-semibold"> achieve your career goals</span>.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mt-10 flex flex-col sm:flex-row gap-4"
                >
                  <button
                    onClick={handleGetStarted}
                    className="inline-flex items-center px-8 py-4 rounded-full text-white font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {user ? 'Access Dashboard' : 'Start Your Journey'}
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="ml-2"
                    >
                      →
                    </motion.span>
                  </button>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="mt-12 grid grid-cols-3 gap-8"
                >
                  {[
                    { number: "98%", label: "Success Rate" },
                    { number: "50K+", label: "Users" },
                    { number: "24/7", label: "Support" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">{stat.number}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.div>

            {/* Right Content - Interactive 3D Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative hidden lg:flex items-center justify-center"
            >
              {/* Main Circle */}
              <div className="relative w-[500px] h-[500px]">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-100"
                ></motion.div>

                {/* Center AI Element */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48"
                >
                  <div className="relative w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] shadow-2xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                    <span className="text-4xl font-bold text-white">AI</span>
                    <div className="absolute inset-0 bg-white opacity-20 rounded-[30%_70%_70%_30%/30%_30%_70%_70%]"></div>
                  </div>
                </motion.div>

                {/* Orbiting Elements */}
                {[FaRobot, FaBrain, FaMicrochip].map((Icon, index) => (
                  <motion.div
                    key={index}
                    animate={{ rotate: 360 }}
                    transition={{ 
                      duration: 20, 
                      repeat: Infinity, 
                      ease: "linear",
                      delay: index * -7
                    }}
                    className="absolute top-1/2 left-1/2 w-full h-full"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    >
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                        <Icon className="text-3xl text-indigo-600" />
                      </div>
                    </motion.div>
                  </motion.div>
                ))}

                {/* Floating Particles */}
                {[...Array(8)].map((_, index) => (
                  <motion.div
                    key={index}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.2
                    }}
                    className="absolute"
                    style={{
                      top: `${30 + Math.random() * 40}%`,
                      left: `${30 + Math.random() * 40}%`,
                      width: `${4 + Math.random() * 8}px`,
                      height: `${4 + Math.random() * 8}px`,
                      borderRadius: '50%',
                      background: `linear-gradient(to right, rgb(99, 102, 241, ${0.3 + Math.random() * 0.5}), rgb(168, 85, 247, ${0.3 + Math.random() * 0.5}))`
                    }}
                  ></motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Section */}
      <div className="relative bg-gradient-to-r from-indigo-800 to-blue-800 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQ4YzEuNjUgMCAzLTEuMzUgMy0zcy0xLjM1LTMtMy0zLTMgMS4zNS0zIDMgMS4zNSAzIDMgM3oiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii4yIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        </div>
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="relative group"
                style={{ animation: `float ${6 + index}s ease-in-out infinite` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                     style={{ background: `linear-gradient(to right, ${stat.color})` }}
                ></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center transform group-hover:-translate-y-2 transition-all duration-300">
                  <div className="text-5xl mb-4">{stat.icon}</div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg font-semibold text-white mb-1">{stat.label}</div>
                  <div className="text-sm text-blue-200">{stat.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Features Section with 3D Cards and Animations */}
      <div className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQ4YzEuNjUgMCAzLTEuMzUgMy0zcy0xLjM1LTMtMy0zLTMgMS4zNS0zIDMgMS4zNSAzIDMgM3oiIGZpbGw9IiMzYjgyZjYiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-40"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-sm font-bold tracking-wider uppercase">
              Why Choose AIvista
            </span>
            <h2 className="mt-6 text-4xl font-extrabold text-gray-900 sm:text-5xl">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Revolutionizing Interview Preparation
              </span>
            </h2>
            <p className="mt-6 text-xl text-gray-600">
              Our comprehensive platform combines cutting-edge AI technology with expert knowledge to provide you with the most effective interview preparation experience.
            </p>
          </motion.div>

          <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group transform hover:-translate-y-2 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-r rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                     style={{ background: `linear-gradient(to right, ${feature.color})` }}
                ></div>
                <div className="relative bg-white rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300 p-8 h-full border border-gray-100">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                         style={{ background: `linear-gradient(to right, ${feature.color})` }}
                    ></div>
                    <div className="relative flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r mb-8"
                         style={{ background: `linear-gradient(to right, ${feature.color})` }}>
                      <feature.icon className="w-8 h-8 text-black transform group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {feature.points.map((point, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center text-gray-700"
                      >
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r flex items-center justify-center mr-3"
                             style={{ background: `linear-gradient(to right, ${feature.color})` }}>
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {point}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Testimonials Section with Modern Cards */}
      <div className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQ4YzEuNjUgMCAzLTEuMzUgMy0zcy0xLjM1LTMtMy0zLTMgMS4zNS0zIDMgMS4zNSAzIDMgM3oiIGZpbGw9IiMzYjgyZjYiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-sm font-bold tracking-wider uppercase">
              Success Stories
            </span>
            <h2 className="mt-6 text-4xl font-extrabold text-gray-900 sm:text-5xl">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                What Our Users Say
              </span>
            </h2>
            <p className="mt-6 text-xl text-gray-600">
              Join thousands of successful professionals who transformed their interview performance with AIvista
            </p>
          </motion.div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group transform hover:-translate-y-2 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                <div className="relative bg-white rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100">
                  {/* Enhanced Quote Icon */}
                  <div className="absolute -top-4 -left-4 w-12 h-12">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-sm"></div>
                    <div className="relative w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-sm"></div>
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="relative w-16 h-16 rounded-full object-cover border-2 border-white shadow-md transform group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-sm bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-medium">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.svg
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </motion.svg>
                    ))}
                  </div>

                  <p className="text-gray-600 italic leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    "{testimonial.content}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Team Section with Modern Cards and Animations */}
      <div className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent"></div>
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQ4YzEuNjUgMCAzLTEuMzUgMy0zcy0xLjM1LTMtMy0zLTMgMS4zNS0zIDMgMS4zNSAzIDMgM3oiIGZpbGw9IiMzYjgyZjYiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')]"
          ></motion.div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-sm font-bold tracking-wider uppercase">
              Our Team
            </span>
            <h2 className="mt-6 text-4xl font-extrabold text-gray-900 sm:text-5xl">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Meet the Experts Behind AIvista
              </span>
            </h2>
            <p className="mt-6 text-xl text-gray-600">
              Our team of industry veterans and AI experts is dedicated to revolutionizing the interview preparation process
            </p>
          </motion.div>
          
          <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group text-center"
              >
                {/* Enhanced Image Container with 3D Effect */}
                <div className="relative mx-auto w-48 h-48 mb-8 perspective-1000">
                  <motion.div
                    whileHover={{ rotateY: 180 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="relative w-full h-full transform-style-3d"
                  >
                    {/* Front */}
                    <div className="absolute inset-0 w-full h-full backface-hidden">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-indigo-400/20 transform -rotate-6 group-hover:rotate-6 transition-transform duration-300"></div>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400/20 to-purple-400/20 transform rotate-3 group-hover:-rotate-3 transition-transform duration-300"></div>
                      <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 group-hover:opacity-0 transition-opacity duration-300"></div>
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover transform scale-110 group-hover:scale-125 transition-transform duration-300"
                        />
                      </div>
                    </div>
                    {/* Back */}
                    <div className="absolute inset-0 w-full h-full backface-hidden transform rotateY-180 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center p-4">
                      <div className="text-white text-center">
                        <p className="font-medium">{member.bio}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Enhanced Content */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative"
                >
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">
                    {member.name}
                  </h3>
                  <p className="text-lg font-medium text-indigo-600 mt-1">{member.role}</p>
                  
                  {/* Enhanced Social Links with Floating Effect */}
                  <div className="mt-4 flex justify-center space-x-4">
                    {[
                      { icon: FaLinkedin, href: member.linkedin, color: "from-blue-500 to-blue-600" },
                      { icon: FaTwitter, href: member.twitter, color: "from-blue-400 to-blue-500" },
                      { icon: FaGithub, href: "#", color: "from-gray-700 to-gray-800" }
                    ].map((social, idx) => (
                      <motion.a
                        key={idx}
                        href={social.href}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="transform transition-all duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r p-0.5"
                             style={{ backgroundImage: `linear-gradient(to right, ${social.color})` }}>
                          <div className="w-full h-full rounded-full bg-white flex items-center justify-center group-hover:bg-opacity-90 transition-all duration-300">
                            <social.icon className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors duration-300" />
                          </div>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced CTA Section with Modern Design */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute inset-0"
        >
          <div className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{
            width: '150%',
            height: '150%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 50%)',
          }}></div>
        </motion.div>
        
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 lg:p-12 border border-white/20"
          >
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  <span className="block">Ready to Transform</span>
                  <span className="block text-blue-200">Your Interview Game?</span>
                </h2>
                <p className="mt-4 text-lg text-blue-100">
                  Join thousands of successful candidates who have mastered their interview skills with AIvista.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="mt-8 lg:mt-0 flex flex-col sm:flex-row gap-4 justify-end"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGetStarted}
                  className="px-8 py-4 rounded-xl font-medium text-indigo-600 bg-white hover:bg-blue-50 transform transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {user ? 'Access Dashboard' : 'Start Free Trial'}
                  <FaRobot className="text-xl" />
                </motion.button>
                
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

     

      {/* Add new styles */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
        
        .rotateY-180 {
          transform: rotateY(180deg);
        }
        
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

        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .gradient-text {
          background-size: 200% auto;
          animation: gradientBG 3s ease infinite;
        }

        .hover-card {
          transition: all 0.3s ease;
        }

        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .glass-effect {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .text-shadow-sm {
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .text-gradient-purple {
          background: linear-gradient(to right, #8B5CF6, #6366F1, #7C3AED);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .text-gradient-indigo {
          background: linear-gradient(to right, #6366F1, #4F46E5, #4338CA);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .text-gradient-violet {
          background: linear-gradient(to right, #7C3AED, #6D28D9, #5B21B6);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .drop-shadow-sm {
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }
      `}</style>
    </div>
  );
}

export default About;