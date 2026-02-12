'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function CreatePetitionPage() {
  const { token, isAuthenticated, isLoading, user } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    target: '',
    city: '',
    state: '',
  });
  const [aiInputs, setAiInputs] = useState({
    whatAbout: '',
    whyImportant: '',
    personalStory: '',
  });
  const [error, setError] = useState('');
  const [aiError, setAiError] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!user?.profile) return;
    setFormData((prev) => ({
      ...prev,
      city: prev.city || user.profile.city || '',
      state: prev.state || user.profile.state || '',
    }));
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/petitions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create petition');
        return;
      }

      router.push(`/petitions/${data.petition._id}`);
    } catch (err) {
      console.error('Create petition error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateWithAI = async () => {
    setAiError('');
    setAiLoading(true);

    try {
      const response = await fetch('/api/ai/generate-petition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...aiInputs,
          category: formData.category,
          target: formData.target,
          language,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setAiError(data.error || 'Failed to generate petition');
        return;
      }

      setFormData((prev) => ({
        ...prev,
        title: data.title || prev.title,
        description: data.description || prev.description,
      }));
    } catch (err) {
      console.error('AI generate error:', err);
      setAiError('Network error. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-slate-50 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Card>
          <CardHeader>
            <CardTitle className={language === 'hi' ? 'font-hindi' : ''}>
              {t('petitions.createNew')}
            </CardTitle>
            <CardDescription className={language === 'hi' ? 'font-hindi' : ''}>
              {t('petitions.createIntro', 'Start a petition in a few simple steps.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4">
                <p className={`text-base font-semibold text-slate-900 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('petitions.aiAssistTitle', 'AI-assisted petition')}
                </p>
                <p className={`text-sm text-slate-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('petitions.aiAssistDescription', 'Answer a few quick questions to draft your petition.')}
                </p>
              </div>
              {aiError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 mb-4">
                  {aiError}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium text-slate-700 mb-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {t('petitions.aiWhatAbout', 'What is the issue?')}
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    value={aiInputs.whatAbout}
                    onChange={(event) => setAiInputs({ ...aiInputs, whatAbout: event.target.value })}
                    placeholder={t('petitions.aiWhatAboutPlaceholder', 'Example: unsafe roads in my area')}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium text-slate-700 mb-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {t('petitions.aiWhyImportant', 'Why is this important?')}
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    value={aiInputs.whyImportant}
                    onChange={(event) => setAiInputs({ ...aiInputs, whyImportant: event.target.value })}
                    placeholder={t('petitions.aiWhyImportantPlaceholder', 'Example: accidents happen frequently')}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium text-slate-700 mb-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {t('petitions.aiPersonalStory', 'Personal story (optional)')}
                  </label>
                  <textarea
                    className="w-full min-h-[100px] rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    value={aiInputs.personalStory}
                    onChange={(event) => setAiInputs({ ...aiInputs, personalStory: event.target.value })}
                    placeholder={t('petitions.aiPersonalStoryPlaceholder', 'Example: my family faced this issue last week')}
                  />
                </div>
                <div className="flex items-center justify-end">
                  <Button
                    type="button"
                    onClick={handleGenerateWithAI}
                    isLoading={aiLoading}
                    disabled={aiLoading || !aiInputs.whatAbout || !aiInputs.whyImportant}
                  >
                    {t('petitions.aiGenerate', 'Generate with AI')}
                  </Button>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div>
                <label className={`block text-sm font-medium text-slate-700 mb-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('petitions.title')}
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  value={formData.title}
                  onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                  placeholder={t('petitions.titlePlaceholder', 'Give your petition a short title')}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium text-slate-700 mb-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('petitions.description')}
                </label>
                <textarea
                  className="w-full min-h-[140px] rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  value={formData.description}
                  onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                  placeholder={t('petitions.descriptionPlaceholder', 'Explain the issue and the change you want')}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={`block text-sm font-medium text-slate-700 mb-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {t('location.city', 'City')}
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    value={formData.city}
                    onChange={(event) => setFormData({ ...formData, city: event.target.value })}
                    placeholder={t('location.city', 'City')}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium text-slate-700 mb-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {t('location.state', 'State')}
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    value={formData.state}
                    onChange={(event) => setFormData({ ...formData, state: event.target.value })}
                    placeholder={t('location.state', 'State')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={`block text-sm font-medium text-slate-700 mb-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {t('petitions.category')}
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    value={formData.category}
                    onChange={(event) => setFormData({ ...formData, category: event.target.value })}
                  >
                    <option value="general">{t('petitions.categoryGeneral', 'General')}</option>
                    <option value="infrastructure">{t('petitions.categoryInfrastructure', 'Infrastructure')}</option>
                    <option value="safety">{t('petitions.categorySafety', 'Safety')}</option>
                    <option value="rights">{t('petitions.categoryRights', 'Rights')}</option>
                    <option value="environment">{t('petitions.categoryEnvironment', 'Environment')}</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium text-slate-700 mb-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {t('petitions.target')}
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    value={formData.target}
                    onChange={(event) => setFormData({ ...formData, target: event.target.value })}
                    placeholder={t('petitions.targetPlaceholder', 'Who should act?')}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                  {t('petitions.submitCreate', 'Publish Petition')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
