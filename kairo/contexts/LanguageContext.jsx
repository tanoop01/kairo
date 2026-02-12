'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, getNestedTranslation } from '@/lib/translations';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Handle mounting to avoid SSR issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load language preference on mount
  useEffect(() => {
    if (!isMounted) return;

    try {
      const savedLanguage = localStorage.getItem('preferredLanguage');
      const userDataString = localStorage.getItem('user');
      
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          const rawLanguage = userData.profile?.language || userData.language;
          if (rawLanguage) {
            const userLanguage = rawLanguage === 'Hindi' ? 'hi' : 'en';
            setLanguage(userLanguage);
            localStorage.setItem('preferredLanguage', userLanguage);
          } else if (savedLanguage) {
            setLanguage(savedLanguage);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      } else if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
    
    setIsLoading(false);
  }, [isMounted]);

  // Switch language with smooth transition
  const switchLanguage = async (newLang) => {
    if (newLang === language || !isMounted) return;
    
    setIsTransitioning(true);
    
    // Add transition animation
    await new Promise(resolve => setTimeout(resolve, 150));
    
    setLanguage(newLang);
    
    try {
      localStorage.setItem('preferredLanguage', newLang);
      
      // Update user profile if logged in
      const userDataString = localStorage.getItem('user');
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          if (userData.profile) {
            userData.profile.language = newLang === 'hi' ? 'Hindi' : 'English';
            localStorage.setItem('user', JSON.stringify(userData));
            
            // TODO: API call to update user profile
            // await updateUserLanguagePreference(newLang);
          }
        } catch (error) {
          console.error('Error updating user language:', error);
        }
      }
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
    
    await new Promise(resolve => setTimeout(resolve, 150));
    setIsTransitioning(false);
  };

  // Translation function with fallback
  const t = (key, fallback = null) => {
    try {
      const translation = getNestedTranslation(translations, key, language);
      return translation !== key ? translation : (fallback || key);
    } catch (error) {
      console.error('Translation error:', error);
      return fallback || key;
    }
  };

  // Get language display name
  const getLanguageDisplayName = (lang = language) => {
    return lang === 'hi' ? 'हिन्दी' : 'English';
  };

  // Hindi is LTR; keep RTL for future languages if needed
  const isRTL = false;

  const value = {
    language,
    switchLanguage,
    t,
    isTransitioning,
    isLoading,
    getLanguageDisplayName,
    isRTL,
    availableLanguages: ['en', 'hi'],
    isMounted,
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted) {
    return (
      <LanguageContext.Provider value={{
        language: 'en',
        switchLanguage: () => {},
        t: (key, fallback = null) => fallback || key,
        isTransitioning: false,
        isLoading: true,
        getLanguageDisplayName: () => 'English',
        isRTL: false,
        availableLanguages: ['en', 'hi'],
        isMounted: false,
      }}>
        <div dir="ltr" lang="en">
          {children}
        </div>
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={value}>
      <div 
        className={`transition-opacity duration-300 ${
          isTransitioning ? 'opacity-90' : 'opacity-100'
        }`} 
        dir={isRTL ? 'rtl' : 'ltr'}
        lang={language}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
};