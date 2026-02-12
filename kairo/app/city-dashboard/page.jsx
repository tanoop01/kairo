'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin } from 'lucide-react';

const getContentForLanguage = (petition, language) => {
  const preferred = petition?.content?.[language];
  if (preferred?.title || preferred?.description) {
    return preferred;
  }
  const fallback = language === 'hi' ? petition?.content?.en : petition?.content?.hi;
  return fallback || { title: '', description: '' };
};

export default function CityDashboardPage() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [petitions, setPetitions] = useState([]);
  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  const city = user?.profile?.city || '';
  const state = user?.profile?.state || '';
  const hasLocation = Boolean(city || state);

  useEffect(() => {
    if (!hasLocation) return;

    const loadCityPetitions = async () => {
      setIsFetching(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (city) {
          params.set('city', city);
        } else if (state) {
          params.set('state', state);
        }

        const response = await fetch(`/api/petitions?${params.toString()}`);
        const data = await response.json();
        if (!response.ok) {
          setError(data.error || 'Failed to load petitions');
          return;
        }
        setPetitions(data.petitions || []);
      } catch (err) {
        console.error('Load city petitions error:', err);
        setError('Network error. Please try again.');
      } finally {
        setIsFetching(false);
      }
    };

    loadCityPetitions();
  }, [city, state, hasLocation]);

  const locationLabel = useMemo(() => {
    if (city && state) return `${city}, ${state}`;
    if (city) return city;
    if (state) return state;
    return '';
  }, [city, state]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-slate-50 pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link href="/dashboard" className="text-sm text-primary-600 hover:text-primary-700">
            ← {t('actions.back')}
          </Link>
          <Link href="/create-petition">
            <Button variant="secondary">
              {t('dashboard.cityMapCreate', 'Create a petition')}
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className={language === 'hi' ? 'font-hindi' : ''}>
              {t('dashboard.cityMapTitle', 'Your City Petitions')}
            </CardTitle>
            <CardDescription className={language === 'hi' ? 'font-hindi' : ''}>
              {t('dashboard.cityMapIntro', 'Petitions created by people in your city.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 mb-4">
                {error}
              </div>
            )}

            {!hasLocation ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white">
                  <MapPin className="h-5 w-5 text-slate-500" />
                </div>
                <p className={`text-sm text-slate-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('dashboard.cityMapMissingLocation', 'Add your city to see local petitions.')}
                </p>
                <Link href="/dashboard" className="mt-4 inline-block">
                  <Button variant="secondary">
                    {t('dashboard.cityMapChangeLocation', 'Update location')}
                  </Button>
                </Link>
              </div>
            ) : isFetching ? (
              <p className="text-sm text-slate-600">{t('forms.loading')}</p>
            ) : petitions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                <p className={`text-sm text-slate-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('dashboard.cityMapEmpty', 'No petitions found in your city yet.')}
                </p>
                <Link href="/create-petition" className="mt-4 inline-block">
                  <Button variant="secondary">
                    {t('dashboard.cityMapCreate', 'Create a petition')}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-slate-100 px-3 py-1">
                    {locationLabel}
                  </span>
                  <span>•</span>
                  <span>{t('petitions.signatures')}: {petitions.reduce((sum, petition) => sum + (petition.signatures?.length || 0), 0)}</span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {petitions.map((petition) => {
                    const content = getContentForLanguage(petition, language);
                    return (
                      <Card key={petition._id} className="border border-slate-200 shadow-sm">
                        <CardContent className="p-5 space-y-3">
                          <div>
                            <h3 className={`text-lg font-semibold text-slate-900 ${language === 'hi' ? 'font-hindi' : ''}`}>
                              {content.title || t('petitions.untitled', 'Untitled Petition')}
                            </h3>
                            <p className={`text-sm text-slate-600 line-clamp-3 ${language === 'hi' ? 'font-hindi' : ''}`}>
                              {content.description || t('petitions.noDescription', 'No description yet.')}
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-sm text-slate-500">
                            <span>
                              {t('petitions.signatures')}: {petition.signatures?.length || 0}
                            </span>
                            <span className="uppercase text-xs">
                              {petition.status || 'active'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <Link href={`/petitions/${petition._id}`}>
                              <Button variant="secondary">
                                {t('petitions.signNow', 'Sign Petition')}
                              </Button>
                            </Link>
                            <span className="text-xs text-emerald-600">
                              {t('dashboard.cityIssuesMap')}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
