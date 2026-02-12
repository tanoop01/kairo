'use client';

import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Define logout function before useEffect to avoid hoisting issues
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    const rawLanguage = userData?.profile?.language || userData?.language;
    if (rawLanguage) {
      const langCode = rawLanguage === 'Hindi' ? 'hi' : 'en';
      localStorage.setItem('preferredLanguage', langCode);
    }
    setToken(token);
    setUser(userData);
  };

  const updateUser = (userData) => {
    if (!userData) return;
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setToken(storedToken);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const isAuthenticated = !!user && !!token;

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    updateUser,
    logout,
  };
};