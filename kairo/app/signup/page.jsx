'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  User,
  Mail,
  Phone,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  Languages
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function SignUpPage() {
  const [step, setStep] = useState('details') // 'details' | 'otp' | 'complete'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    role: 'citizen', // Default role
    language: 'English',
    password: '',
    confirmPassword: '',
  })
  const [otp, setOtp] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const router = useRouter()

  const roles = [
    { value: 'citizen', label: 'Citizen', icon: '👤' },
    { value: 'worker', label: 'Worker', icon: '👷' },
    { value: 'student', label: 'Student', icon: '🎓' },
    { value: 'woman', label: 'Woman', icon: '👩' },
    { value: 'senior', label: 'Senior Citizen', icon: '👴' },
    { value: 'business', label: 'Business Owner', icon: '💼' },
    { value: 'government', label: 'Government Employee', icon: '🏛️' },
    { value: 'ngo', label: 'NGO Worker', icon: '🤝' },
    { value: 'activist', label: 'Activist', icon: '✊' },
    { value: 'lawyer', label: 'Lawyer', icon: '⚖️' },
    { value: 'journalist', label: 'Journalist', icon: '📰' },
    { value: 'researcher', label: 'Researcher', icon: '🔬' },
    { value: 'volunteer', label: 'Volunteer', icon: '🙋' },
  ]

  const handleDetailsSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          role: formData.role,
          language: formData.language,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStep('otp')
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch (error) {
      console.error('Signup error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          otp,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        login(data.token, data.user)
        setStep('complete')
        // Redirect after showing success
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setError(data.error || 'OTP verification failed')
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-8 transition-colors">
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>

        {/* Sign Up Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">K</span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                {step === 'details' && 'Step 1 of 2: Your Details'}
                {step === 'otp' && 'Step 2 of 2: Verify Phone'}
                {step === 'complete' && 'Welcome to Kairo!'}
              </span>
              <span className="text-sm font-medium text-primary-600">
                {step === 'details' && '50%'}
                {step === 'otp' && '90%'}
                {step === 'complete' && '100%'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-full h-2 transition-all duration-500"
                style={{ 
                  width: 
                    step === 'details' ? '50%' : 
                    step === 'otp' ? '90%' : '100%' 
                }}
              ></div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">Create Your Account</h1>
            <p className="text-gray-600">Join thousands empowering change in India</p>
          </div>

          {/* Step 1: User Details */}
          {step === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Your Role (Optional)
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.icon} {role.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  This helps us provide personalized content (defaults to Citizen)
                </p>
              </div>

              {/* Preferred Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Language
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({...formData, language: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  You can change this anytime in settings
                </p>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Create Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full px-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Continue to Verification'}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="text-center">
                <Phone className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify Your Phone</h3>
                <p className="text-gray-600 mb-6">
                  We&#39;ve sent an OTP to {formData.phoneNumber}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                  Enter 6-digit OTP
                </label>
                <input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-center text-2xl font-mono tracking-widest"
                  maxLength={6}
                  required
                />
                
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify & Create Account'}
              </button>

              <button
                type="button"
                onClick={() => setStep('details')}
                className="w-full text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Change Details
              </button>
            </form>
          )}

          {/* Step 3: Success */}
          {step === 'complete' && (
            <div className="text-center space-y-6">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Kairo!</h3>
                <p className="text-gray-600">
                  Your account has been created successfully. Redirecting to your dashboard...
                </p>
              </div>
            </div>
          )}

          {/* DigiLocker Option (Visible as requested) */}
          {step === 'details' && (
            <>
              {/* Divider */}
              <div className="my-8 flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-sm text-gray-500">OR</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* DigiLocker Button (Coming Soon) */}
              <button
                type="button"
                className="w-full px-6 py-3 bg-gray-100 text-gray-400 border-2 border-gray-200 rounded-lg font-medium cursor-not-allowed relative group"
                disabled
              >
                <div className="flex items-center justify-center gap-2">
                  <Shield size={20} />
                  <span>Sign up with DigiLocker</span>
                </div>
                <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                  Soon
                </span>
              </button>
              <p className="mt-2 text-xs text-center text-gray-500">
                DigiLocker integration coming soon for instant verification
              </p>
            </>
          )}

          {/* Login Link */}
          {step === 'details' && (
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                  Log In
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Security Badge */}
        {step === 'details' && (
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Shield size={16} />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <Languages size={16} />
              <span>2 Languages</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}