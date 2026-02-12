'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/Button';
import { ChevronDown, Languages, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const LanguageToggle = ({ variant = "default", showLabel = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, switchLanguage, getLanguageDisplayName, isTransitioning, availableLanguages } = useLanguage();

  const languageOptions = [
    { 
      code: 'en', 
      name: 'English', 
      nativeName: 'English',
      flag: '🇺🇸'
    },
    { 
      code: 'hi', 
      name: 'Hindi', 
      nativeName: 'हिन्दी',
      flag: '🇮🇳'
    }
  ];

  const currentLanguage = languageOptions.find(lang => lang.code === language);

  const handleLanguageChange = async (langCode) => {
    await switchLanguage(langCode);
    setIsOpen(false);
  };

  if (variant === "compact") {
    return (
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          disabled={isTransitioning}
          className="flex items-center space-x-1 px-2 py-1"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">
            {currentLanguage?.flag} {language.toUpperCase()}
          </span>
          <ChevronDown className={cn(
            "w-3 h-3 transition-transform", 
            isOpen && "rotate-180"
          )} />
        </Button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)} 
            />
            <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-lg shadow-lg border border-slate-200 py-1 min-w-[120px]">
              {languageOptions.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center space-x-2",
                    language === lang.code && "bg-primary-50 text-primary-700"
                  )}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="glass"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isTransitioning}
        className="flex items-center space-x-2"
      >
        <Languages className="w-4 h-4" />
        {showLabel && (
          <span className="hidden sm:inline">
            {getLanguageDisplayName()}
          </span>
        )}
        <span className="text-lg">{currentLanguage?.flag}</span>
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform", 
          isOpen && "rotate-180"
        )} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-2 z-20 bg-white rounded-xl shadow-lg border border-slate-200 py-2 min-w-[180px] animate-fade-in">
            <div className="px-3 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
              Select Language
            </div>
            {languageOptions.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                disabled={isTransitioning}
                className={cn(
                  "w-full px-3 py-3 text-left hover:bg-slate-50 flex items-center justify-between transition-colors",
                  language === lang.code && "bg-primary-50 text-primary-700 font-medium"
                )}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{lang.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{lang.nativeName}</span>
                    <span className="text-xs text-slate-500">{lang.name}</span>
                  </div>
                </div>
                {language === lang.code && (
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageToggle;