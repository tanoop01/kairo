'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function PetitionAnalyticsPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const { t, language } = useLanguage();
  const [petition, setPetition] = useState(null);
  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const loadPetition = async () => {
      setIsFetching(true);
      try {
        const response = await fetch(`/api/petitions/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.error || 'Failed to load petition');
          return;
        }
        setPetition(data.petition);
      } catch (err) {
        console.error('Analytics load error:', err);
        setError('Network error. Please try again.');
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      loadPetition();
    }
  }, [id, token]);

  const signatureCount = petition?.signatureCount ?? petition?.signatures?.length ?? 0;
  const shareCount = 0;
  const viewCount = 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-slate-50 pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <Link href={`/petitions/${id}`} className="text-sm text-primary-600 hover:text-primary-700">
            ← {t('actions.back')}
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className={language === 'hi' ? 'font-hindi' : ''}>
              {t('petitions.analyticsTitle', 'Petition Analytics')}
            </CardTitle>
            <CardDescription className={language === 'hi' ? 'font-hindi' : ''}>
              {t('petitions.analyticsIntro', 'Simple analytics for your petition')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 mb-4">
                {error}
              </div>
            )}

            {isFetching ? (
              <p className="text-sm text-slate-600">{t('forms.loading')}</p>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm text-slate-500">
                      {t('petitions.analyticsSignatures')}
                    </p>
                    <p className="text-2xl font-semibold text-slate-900">{signatureCount}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm text-slate-500">
                      {t('petitions.analyticsShares')}
                    </p>
                    <p className="text-2xl font-semibold text-slate-900">{shareCount}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm text-slate-500">
                      {t('petitions.analyticsViews')}
                    </p>
                    <p className="text-2xl font-semibold text-slate-900">{viewCount}</p>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-medium text-slate-700 mb-2">
                      {t('petitions.analyticsTimeline')}
                    </p>
                    <div className="h-40 rounded-lg bg-slate-50 flex items-center justify-center text-sm text-slate-500">
                      {t('petitions.analyticsComingSoon')}
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-medium text-slate-700 mb-2">
                      {t('petitions.analyticsHeatmap')}
                    </p>
                    <div className="h-40 rounded-lg bg-slate-50 flex items-center justify-center text-sm text-slate-500">
                      {t('petitions.analyticsComingSoon')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Button variant="secondary">
                    {t('petitions.analyticsExport')}
                  </Button>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className={`text-sm font-medium text-slate-700 mb-3 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {t('petitions.analyticsSigners', 'Signers')}
                  </p>
                  {petition?.signatures?.length ? (
                    <ul className="space-y-2">
                      {petition.signatures.map((signature) => (
                        <li key={`${signature.userId}-${signature.signedAt}`} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm">
                          <div className={`flex flex-col ${language === 'hi' ? 'font-hindi' : ''}`}>
                            <span>{signature.name || t('petitions.supporter', 'Supporter')}</span>
                            {signature.email && (
                              <span className="text-xs text-slate-500">{signature.email}</span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={`text-sm text-slate-500 ${language === 'hi' ? 'font-hindi' : ''}`}>
                      {t('petitions.noSignatures', 'No signatures yet.')}
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
