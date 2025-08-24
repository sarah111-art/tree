import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [globalLoading, setGlobalLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});

  const setLoading = (key, loading) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: loading
    }));
  };

  const startLoading = (key) => setLoading(key, true);
  const stopLoading = (key) => setLoading(key, false);
  const isLoading = (key) => loadingStates[key] || false;

  const value = {
    globalLoading,
    setGlobalLoading,
    loadingStates,
    setLoading,
    startLoading,
    stopLoading,
    isLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};
