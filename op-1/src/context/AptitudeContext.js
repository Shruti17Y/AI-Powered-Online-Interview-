import React, { createContext, useContext, useState, useEffect } from 'react';

const AptitudeContext = createContext();

export function AptitudeProvider({ children }) {
  const [passedAptitude, setPassedAptitude] = useState(() => {
    const stored = localStorage.getItem('passedAptitude');
    return stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem('passedAptitude', passedAptitude);
  }, [passedAptitude]);

  return (
    <AptitudeContext.Provider value={{ passedAptitude, setPassedAptitude }}>
      {children}
    </AptitudeContext.Provider>
  );
}

export function useAptitude() {
  return useContext(AptitudeContext);
} 