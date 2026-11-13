import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { FiLogOut } from 'react-icons/fi';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Handle navigation
  const handleNavigation = (path) => {
    setIsProfileOpen(false);
    navigate(path);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  // Handler for dashboard navigation (works for user and HR; admin goes to admin-dashboard)
  const handleDashboard = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role === 'admin') {
      navigate('/admin-dashboard');
    } else if (user.role === 'hr') {
      navigate('/hr-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.username) return user.username.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200 transition-colors duration-300">
      <div className="container-pro">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-8"
                src="https://img.icons8.com/fluency/48/artificial-intelligence.png"
                alt="AIvista Logo"
              />
              <span className="ml-2 text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AIvista</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Show links for normal users; hide on Admin Dashboard and for HR */}
            {location.pathname !== '/admin-dashboard' && user?.role !== 'hr' && (
              <>
                <button
                  onClick={() => handleNavigation('/')}
                  className="btn btn-ghost px-3 py-2"
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavigation('/practice')}
                  className="btn btn-ghost px-3 py-2"
                >
                  Practice
                </button>
                <button
                  onClick={handleDashboard}
                  className="btn btn-ghost px-3 py-2"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNavigation('/about')}
                  className="btn btn-ghost px-3 py-2"
                >
                  About
                </button>
                <button
                  onClick={() => handleNavigation('/contact')}
                  className="btn btn-ghost px-3 py-2"
                >
                  Contact
                </button>
              </>
            )}
          </div>

          {/* Theme Toggle & User Profile/Login Button */}
          <div className="flex items-center space-x-2" ref={profileRef}>
            {!user ? (
              <div className="flex flex-col items-end">
                <button
                  onClick={() => handleNavigation('/signup')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-200"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {user.profilePicUrl ? (
                    <img 
                      src={user.profilePicUrl} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full border-2 border-blue-600 object-cover shadow-sm"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full border-2 border-blue-600 bg-blue-600 text-white flex items-center justify-center font-semibold shadow-sm">
                      {getUserInitials()}
                    </div>
                  )}
                  <span className="text-gray-700 text-sm font-medium">
                    {user.username || user.email}
                  </span>
                  <svg
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                      isProfileOpen ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <p className="font-medium">{user.username || user.email}</p>
                      <p className="text-gray-500 capitalize">{user.role}</p>
                    </div>
                    {user?.role !== 'hr' && (
                      <button
                        onClick={() => handleNavigation('/profile-settings')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Profile Settings
                      </button>
                    )}
                    {user?.role !== 'admin' && user?.role !== 'hr' && (
                      <button
                        onClick={() => handleNavigation('/my-interviews')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        My Interviews
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-rose-50"
                      aria-label="Logout"
                    >
                      <span className="inline-flex items-center gap-2">
                        <FiLogOut className="h-4 w-4" />
                        Logout
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {location.pathname !== '/admin-dashboard' && user?.role !== 'hr' && (
            <>
              <button
                onClick={() => handleNavigation('/')}
                className="block w-full text-left text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
              >
                Home
              </button>
              <button
                onClick={() => handleNavigation('/practice')}
                className="block w-full text-left text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
              >
                Practice
              </button>
              <button
                onClick={handleDashboard}
                className="block w-full text-left text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavigation('/about')}
                className="block w-full text-left text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
              >
                About
              </button>
              <button
                onClick={() => handleNavigation('/contact')}
                className="block w-full text-left text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
              >
                Contact
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;