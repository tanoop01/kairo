import { Inter } from 'next/font/google'
import { LanguageProvider } from '@/contexts/LanguageContext'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

// Load Hindi font for multilingual support
const notoSansDevanagari = Inter({
  subsets: ['latin'], // We'll use web fonts for Hindi
  variable: '--font-hindi',
  display: 'swap',
})

export const metadata = {
  title: 'Kairo - Know Your Rights. Raise Your Voice. Create Change.',
  description: "India's first unified civic action platform connecting rights education with direct government outreach",
  keywords: ['civic rights', 'petitions', 'India', 'government', 'activism', 'rights education'],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSansDevanagari.variable}`}>
      <head>
        {/* Load Hindi font from Google Fonts */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@100..900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
