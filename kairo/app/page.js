'use client'

import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { 
  Brain, 
  FileText, 
  Send, 
  TrendingUp, 
  Globe, 
  Shield,
  Users,
  Zap,
  MapPin,
  Languages,
  Check,
  ArrowRight
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 animate-fade-in">
              <div className="inline-block px-4 py-2 bg-primary-100 rounded-full text-primary-700 font-medium text-sm">
                🇮🇳 Built for Digital India
              </div>
              <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight">
                Know Your Rights.<br />
                <span className="gradient-text">Raise Your Voice.</span><br />
                Create Change.
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                India&#39;s first unified civic action platform connecting rights education with direct government outreach - all in your language.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/signup" className="btn-primary text-lg px-8 py-4">
                  Get Started Free
                </Link>
                <button className="btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-2">
                  Watch Demo
                  <ArrowRight size={20} />
                </button>
              </div>
              <div className="flex items-center gap-6 pt-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Free forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>2 languages</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>AI-powered</span>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative animate-slide-up animate-delay-200">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-lg">
                    <Brain className="text-primary-600" size={24} />
                    <div>
                      <p className="font-semibold">AI Rights Assistant</p>
                      <p className="text-sm text-gray-600">Get instant legal guidance</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-accent-50 rounded-lg">
                    <FileText className="text-accent-600" size={24} />
                    <div>
                      <p className="font-semibold">Smart Petition Generator</p>
                      <p className="text-sm text-gray-600">Create in 2 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                    <Send className="text-green-600" size={24} />
                    <div>
                      <p className="font-semibold">Direct Authority Email</p>
                      <p className="text-sm text-gray-600">One-click delivery</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Success Rate</p>
                      <p className="text-3xl font-bold">10x Higher</p>
                    </div>
                    <TrendingUp size={40} className="opacity-80" />
                  </div>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent-200 rounded-full blur-3xl opacity-60 animate-float"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary-200 rounded-full blur-3xl opacity-60 animate-float" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold gradient-text mb-2">1.4B</p>
              <p className="text-gray-600">Potential Users</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold gradient-text mb-2">28</p>
              <p className="text-gray-600">States Covered</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold gradient-text mb-2">2</p>
              <p className="text-gray-600">Languages</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold gradient-text mb-2">50+</p>
              <p className="text-gray-600">Legal Scenarios</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Complete Civic Action Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From awareness to action to impact - everything you need in one place
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                <Brain className="text-primary-600" size={28} />
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">AI Rights Assistant</h3>
              <p className="text-gray-600 mb-4">
                Get instant answers about your legal rights in your preferred language. Ask &#39;What if?&#39; scenarios and learn what to do.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>State-specific laws</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Regional language support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>24/7 availability</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
              <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center mb-6">
                <FileText className="text-accent-600" size={28} />
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">Smart Petition Generator</h3>
              <p className="text-gray-600 mb-4">
                Create professional petitions in 2 minutes with AI. Includes legal citations, proper formatting, and your personal story.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Auto-generated with AI</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Legal citations included</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Multi-language support</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Send className="text-green-600" size={28} />
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">Direct Authority Email</h3>
              <p className="text-gray-600 mb-4">
                One-click email draft with verified signatures, evidence, and professional formatting - sent from YOUR email.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Auto-attached documents</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Verified signature lists</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Smart authority routing</span>
                </li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="text-blue-600" size={28} />
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">Rights Violation Heatmap</h3>
              <p className="text-gray-600 mb-4">
                See civic issues in your area on an interactive map. Report problems, upvote existing reports, and join petitions.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Community-reported issues</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Photo/video evidence</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Pattern identification</span>
                </li>
              </ul>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Languages className="text-purple-600" size={28} />
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">English + Hindi</h3>
              <p className="text-gray-600 mb-4">
                Complete platform in English and Hindi with full translation coverage.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Full translation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>AI responds in your language</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Petition creation in regional language</span>
                </li>
              </ul>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="text-orange-600" size={28} />
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">Impact Tracking</h3>
              <p className="text-gray-600 mb-4">
                Track your petition&#39;s progress from creation to authority response to final victory. Celebrate wins publicly.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Real-time analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Response tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Success stories</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              From Problem to Solution in Minutes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our simple 4-step process empowers you to take action
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-display font-bold mb-2">Learn Your Rights</h3>
                <p className="text-gray-600 text-sm">
                  Ask our AI assistant about your legal rights in your language
                </p>
              </div>
              {/* Connector */}
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary-600 to-accent-600 -ml-8"></div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-display font-bold mb-2">Create Petition</h3>
                <p className="text-gray-600 text-sm">
                  AI generates a professional petition with legal citations in 2 minutes
                </p>
              </div>
              {/* Connector */}
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-accent-600 to-green-600 -ml-8"></div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-display font-bold mb-2">Email Authority</h3>
                <p className="text-gray-600 text-sm">
                  One-click email draft with verified signatures sent from YOUR email
                </p>
              </div>
              {/* Connector */}
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-green-600 to-orange-600 -ml-8"></div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg">
                  4
                </div>
                <h3 className="text-xl font-display font-bold mb-2">Track Impact</h3>
                <p className="text-gray-600 text-sm">
                  Monitor response, celebrate victory, and inspire others
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Kairo Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-accent-600 text-white">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Why Kairo is Different
              </h2>
              <p className="text-xl opacity-90 mb-8">
                We&#39;re not just another petition platform. We&#39;re building a complete bridge from citizen voice to government action.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">India-First Platform</h4>
                    <p className="opacity-90">Built for India&#39;s 28 states, English and Hindi, and local laws - not adapted from global platforms</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Rights Education First</h4>
                    <p className="opacity-90">Learn your legal rights before taking action - informed advocacy is powerful advocacy</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Direct Government Reach</h4>
                    <p className="opacity-90">One-click email to authorities with verified signatures - petitions that actually get delivered</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-display font-bold mb-6">By the Numbers</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg">Response Rate</span>
                    <span className="text-2xl font-bold">10x</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white rounded-full h-2 w-[90%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg">Time Saved</span>
                    <span className="text-2xl font-bold">98%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white rounded-full h-2 w-[98%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg">User Satisfaction</span>
                    <span className="text-2xl font-bold">95%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white rounded-full h-2 w-[95%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="section-container">
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Ready to Make Your Voice Heard?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of empowered citizens using Kairo to create real change in their communities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Get Started Free
              </Link>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-all duration-200">
                Learn More
              </button>
            </div>
            <p className="mt-6 text-sm opacity-80">
              No credit card required • Free forever • 2 minute setup
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
