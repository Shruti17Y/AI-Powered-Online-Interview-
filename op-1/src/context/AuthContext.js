// import React, { createContext, useState, useContext } from 'react';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   // Initialize user from localStorage if available
//   const [user, setUser] = useState(() => {
//     const storedUser = localStorage.getItem('user');
//     return storedUser ? JSON.parse(storedUser) : null;
//   });

//   const login = async (emailOrUsername, password, type) => {
//     try {
//       const response = await fetch("http://127.0.0.1:5000/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ emailOrUsername, password, type }),
//       });
//       if (!response.ok) {
//         throw new Error("Invalid credentials");
//       }
//       const userData = await response.json();
//       setUser(userData);
//       localStorage.setItem("user", JSON.stringify(userData));
//       return userData;
//     } catch (e) {
//       // Fallback: Demo login/signup logic if backend login fails
//       if (emailOrUsername && password) {
//         const userData = {
//           id: 1, // Demo user ID
//           email: emailOrUsername,
//           name: emailOrUsername.split('@')[0],
//           type: type // 'user' or 'admin'
//         };
//         setUser(userData);
//         localStorage.setItem('user', JSON.stringify(userData));
//         return userData;
//       }
//       throw new Error('Invalid credentials');
//     }
//   };
//     // Example with real backend response


//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('user'); // Remove user from storage
//   };

//   return (
    
//       <AuthContext.Provider value={{ user, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (email, password) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Invalid credentials");
      }
      const userData = await response.json();
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (e) {
      console.error('Login error:', e);
      throw new Error('Login failed. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};