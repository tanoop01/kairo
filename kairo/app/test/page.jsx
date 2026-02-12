'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import LanguageToggle from '@/components/LanguageToggle';

export default function TestPage() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold text-slate-900 ${language === 'hi' ? 'font-hindi' : ''}`}>
            Phase 1 Test Page
          </h1>
          <LanguageToggle />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Translation Test */}
          <Card>
            <CardHeader>
              <CardTitle className={language === 'hi' ? 'font-hindi' : ''}>
                {t('dashboard.welcome')} - Translation Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className={`text-slate-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
                {t('navigation.dashboard')}: {t('dashboard.dashboard')}
              </p>
              <p className={`text-slate-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
                {t('navigation.createPetition')}: {t('petitions.createNew')}
              </p>
              <p className={`text-slate-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
                {t('dashboard.aiAssistant')}: {t('dashboard.aiAssistantDescription')}
              </p>
            </CardContent>
          </Card>

          {/* UI Components Test */}
          <Card>
            <CardHeader>
              <CardTitle>UI Components Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" size="sm">Primary</Button>
                <Button variant="secondary" size="sm">Secondary</Button>
                <Button variant="ghost" size="sm">Ghost</Button>
                <Button variant="glass" size="sm">Glass</Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="success" size="sm">Success</Button>
                <Button variant="danger" size="sm">Danger</Button>
                <Button variant="accent" size="sm">Accent</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Glassmorphism Test */}
        <Card variant="glass" className="mb-8">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Glassmorphism Card Test
            </h2>
            <p className="text-slate-600">
              This card uses glassmorphism design with backdrop blur and transparency.
            </p>
          </CardContent>
        </Card>

        {/* Color Palette Test */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-primary-100 rounded-lg text-center">
                <div className="w-8 h-8 bg-primary-600 rounded mx-auto mb-2"></div>
                <p className="text-sm">Primary</p>
              </div>
              <div className="p-4 bg-slate-100 rounded-lg text-center">
                <div className="w-8 h-8 bg-slate-600 rounded mx-auto mb-2"></div>
                <p className="text-sm">Slate</p>
              </div>
              <div className="p-4 bg-accent-blue/10 rounded-lg text-center">
                <div className="w-8 h-8 bg-accent-blue rounded mx-auto mb-2"></div>
                <p className="text-sm">Accent Blue</p>
              </div>
              <div className="p-4 bg-accent-emerald/10 rounded-lg text-center">
                <div className="w-8 h-8 bg-accent-emerald rounded mx-auto mb-2"></div>
                <p className="text-sm">Emerald</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}