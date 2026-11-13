import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Signup() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validatePassword = (pass) => {
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumbers = /[0-9]/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?\":{}|<>]/.test(pass);
    const isLongEnough = pass.length >= 8;
    
    let strength = 0;
    let errorMessages = [];
    
    if (!hasUpperCase) errorMessages.push('uppercase letter');
    if (!hasLowerCase) errorMessages.push('lowercase letter');
    if (!hasNumbers) errorMessages.push('number');
    if (!hasSpecialChar) errorMessages.push('special character');
    if (!isLongEnough) errorMessages.push('8+ characters');
    
    if (hasUpperCase) strength++;
    if (hasLowerCase) strength++;
    if (hasNumbers) strength++;
    if (hasSpecialChar) strength++;
    if (pass.length >= 12) strength++;
    
    setPasswordStrength((strength / 5) * 100);
    
    if (errorMessages.length > 0) {
      return `Password must contain: ${errorMessages.join(', ')}`;
    }
    return '';
  };
  
  useEffect(() => {
    if (password) {
      const error = validatePassword(password);
      setPasswordError(error);
    } else {
      setPasswordError('');
      setPasswordStrength(0);
    }
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setError('Please fix password requirements');
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await fetch('/api/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      console.log('Signup response:', response.status, data);
  
      if (!response.ok) {
        setError(data.error || 'Signup failed');
      } else {
        // Signup successful, now log the user in automatically
        const loginResponse = await fetch('/api/login/', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const loginData = await loginResponse.json();
        console.log('Login response:', loginResponse.status, loginData);
  
        if (!loginResponse.ok) {
          setError(loginData.error || 'Signup succeeded but login failed. Please try logging in.');
        } else {
          setUser(loginData);
          localStorage.setItem("user", JSON.stringify(loginData));
          if (loginData.role === 'admin') {
            navigate('/admin-dashboard');
          } else {
            navigate('/dashboard');
          }
        }
      }
    } catch (err) {
      setError('Server error. Please try again.');
      console.error('Signup catch error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="https://img.icons8.com/fluency/48/artificial-intelligence.png"
          alt="AIvista Logo"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <div className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <span
            className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Log In
          </span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={8}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <div className="relative rounded-md shadow-sm">
                  {/* Vertical password strength indicator (enhanced) */}
                  {password && (
                    <div className="absolute inset-y-0 left-0 w-1.5 rounded-full overflow-hidden bg-gray-200/70" aria-hidden="true">
                      <div
                        className={`absolute bottom-0 left-0 w-full transition-all duration-300 ease-out ${
                          passwordStrength < 40
                            ? 'bg-red-500'
                            : passwordStrength < 70
                            ? 'bg-gradient-to-b from-yellow-300 to-yellow-500'
                            : 'bg-gradient-to-b from-green-400 to-green-600'
                        }`}
                        style={{ height: `${passwordStrength}%`, boxShadow: passwordStrength > 0 ? '0 0 8px rgba(34,197,94,0.35)' : 'none' }}
                      />
                    </div>
                  )}
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    )}
                  </button>
                </div>
                {password && (
                  <div className="mt-1">
                    {passwordError ? (
                      <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                    ) : (
                      <p className="mt-1 text-sm text-green-600">Password meets all requirements</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Signing up...' : 'Sign Up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;