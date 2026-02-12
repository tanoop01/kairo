import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <span className="text-2xl font-display font-bold gradient-text">Kairo</span>
            </div>
            <p className="text-gray-600 max-w-md mb-4">
              Know Your Rights. Raise Your Voice. Create Change. India&#39;s first unified civic action platform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-primary-50 transition-colors shadow-sm">
                <Facebook size={20} className="text-primary-600" />
              </a>
              <a href="#" className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-primary-50 transition-colors shadow-sm">
                <Twitter size={20} className="text-primary-600" />
              </a>
              <a href="#" className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-primary-50 transition-colors shadow-sm">
                <Instagram size={20} className="text-primary-600" />
              </a>
              <a href="#" className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-primary-50 transition-colors shadow-sm">
                <Linkedin size={20} className="text-primary-600" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/#features" className="text-gray-600 hover:text-primary-600 transition-colors">Features</Link></li>
              <li><Link href="/#how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors">How It Works</Link></li>
              <li><Link href="/#impact" className="text-gray-600 hover:text-primary-600 transition-colors">Impact Stories</Link></li>
              <li><Link href="/signup" className="text-gray-600 hover:text-primary-600 transition-colors">Get Started</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © 2026 Kairo. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">
              Made with ❤️ for Digital India
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}