'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X, User, LogOut, Brain, LayoutDashboard } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/Button'
import LanguageToggle from '@/components/LanguageToggle'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, isAuthenticated, logout, isLoading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    router.push('/')
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('nav')) {
        setIsOpen(false)
      }
      if (showUserMenu && !event.target.closest('.user-menu')) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isOpen, showUserMenu])

  return (
    <nav className="sticky top-0 w-full bg-glass-white backdrop-blur-lg z-50 border-b border-slate-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-purple rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-all duration-200 shadow-md">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Kairo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Navigation Links */}
            <Link 
              href="/#features" 
              className="px-3 py-2 text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium rounded-lg hover:bg-slate-50"
            >
              {t('navigation.about', 'Features')}
            </Link>
            <Link 
              href="/#how-it-works" 
              className="px-3 py-2 text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium rounded-lg hover:bg-slate-50"
            >
              How It Works
            </Link>
            <Link 
              href="/#impact" 
              className="px-3 py-2 text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium rounded-lg hover:bg-slate-50"
            >
              Impact
            </Link>
            
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  /* Authenticated User Menu */
                  <div className="flex items-center space-x-3 ml-4">
                    {/* AI Assistant Link */}
                    <Link href="/ai-assistant">
                      <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                        <Brain className="w-4 h-4" />
                        <span>{t('dashboard.aiAssistant')}</span>
                      </Button>
                    </Link>
                    
                    {/* Dashboard Link */}
                    <Link href="/dashboard">
                      <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                        <LayoutDashboard className="w-4 h-4" />
                        <span>{t('navigation.dashboard')}</span>
                      </Button>
                    </Link>
                    
                    {/* Language Toggle */}
                    <LanguageToggle variant="compact" />
                    
                    {/* User Menu */}
                    <div className="relative user-menu">
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center space-x-2 p-2 text-slate-700 hover:text-slate-900 transition-colors duration-200 rounded-lg hover:bg-slate-50"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center">
                          <User size={16} className="text-primary-600" />
                        </div>
                        <span className="max-w-24 truncate font-medium">{user?.name}</span>
                      </button>
                      
                      {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-20 animate-fade-in">
                          <div className="py-2">
                            {/* User Info Header */}
                            <div className="px-4 py-3 border-b border-slate-100">
                              <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                            </div>
                            
                            {/* Menu Items */}
                            <Link
                              href="/ai-assistant"
                              className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Brain size={16} className="text-accent-purple" />
                              <span>{t('dashboard.aiAssistant')}</span>
                            </Link>
                            <Link
                              href="/dashboard"
                              className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <LayoutDashboard size={16} className="text-primary-600" />
                              <span>{t('navigation.dashboard')}</span>
                            </Link>
                            <Link
                              href="/my-petitions"
                              className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <span>📋</span>
                              <span>{t('navigation.myPetitions')}</span>
                            </Link>
                            <Link
                              href="/profile"
                              className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <User size={16} className="text-slate-500" />
                              <span>{t('navigation.profile')}</span>
                            </Link>
                            
                            {/* Logout */}
                            <div className="border-t border-slate-100 mt-1 pt-1">
                              <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <LogOut size={16} />
                                <span>{t('navigation.logout')}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Non-authenticated Links */
                  <div className="flex items-center space-x-3 ml-4">
                    {/* Language Toggle for non-authenticated users */}
                    <LanguageToggle variant="compact" />
                    
                    <Link href="/login">
                      <Button variant="ghost">
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button variant="primary">
                        {t('actions.getStarted', 'Get Started')}
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-slide-down border-t border-slate-200/50 pt-4">
            {/* Navigation Links */}
            <Link 
              href="/#features" 
              className="block py-3 px-2 text-slate-600 hover:text-slate-900 transition-colors font-medium rounded-lg hover:bg-slate-50"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="/#how-it-works" 
              className="block py-3 px-2 text-slate-600 hover:text-slate-900 transition-colors font-medium rounded-lg hover:bg-slate-50"
              onClick={() => setIsOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              href="/#impact" 
              className="block py-3 px-2 text-slate-600 hover:text-slate-900 transition-colors font-medium rounded-lg hover:bg-slate-50"
              onClick={() => setIsOpen(false)}
            >
              Impact
            </Link>
            
            {/* Language Toggle */}
            <div className="py-2 px-2">
              <LanguageToggle />
            </div>
            
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  /* Authenticated Mobile Menu */
                  <>
                    <div className="border-t border-slate-200 pt-4 mt-4">
                      <div className="flex items-center space-x-3 mb-4 px-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-xl flex items-center justify-center">
                          <User size={20} className="text-primary-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{user?.name}</p>
                          <p className="text-sm text-slate-500 truncate">{user?.email}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <Link
                          href="/ai-assistant"
                          className="flex items-center space-x-3 py-3 px-2 text-slate-700 hover:bg-slate-50 transition-colors font-medium rounded-lg"
                          onClick={() => setIsOpen(false)}
                        >
                          <Brain size={18} className="text-accent-purple" />
                          <span>{t('dashboard.aiAssistant')}</span>
                        </Link>
                        <Link
                          href="/dashboard"
                          className="flex items-center space-x-3 py-3 px-2 text-slate-700 hover:bg-slate-50 transition-colors font-medium rounded-lg"
                          onClick={() => setIsOpen(false)}
                        >
                          <LayoutDashboard size={18} className="text-primary-600" />
                          <span>{t('navigation.dashboard')}</span>
                        </Link>
                        <Link
                          href="/my-petitions"
                          className="flex items-center space-x-3 py-3 px-2 text-slate-700 hover:bg-slate-50 transition-colors font-medium rounded-lg"
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="text-lg">📋</span>
                          <span>{t('navigation.myPetitions')}</span>
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout()
                            setIsOpen(false)
                          }}
                          className="flex items-center space-x-3 w-full py-3 px-2 text-red-600 hover:bg-red-50 transition-colors font-medium rounded-lg"
                        >
                          <LogOut size={18} />
                          <span>{t('navigation.logout')}</span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Non-authenticated Mobile Menu */
                  <div className="border-t border-slate-200 pt-4 mt-4 space-y-2">
                    <Link 
                      href="/login" 
                      className="block py-3 px-2 text-slate-700 hover:bg-slate-50 transition-colors font-medium rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      href="/signup" 
                      onClick={() => setIsOpen(false)}
                    >
                      <Button variant="primary" className="w-full">
                        {t('actions.getStarted', 'Get Started')}
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}