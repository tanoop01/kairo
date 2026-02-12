'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const getContentForLanguage = (petition, language) => {
  const preferred = petition?.content?.[language];
  if (preferred?.title || preferred?.description) {
    return preferred;
  }
  const fallback = language === 'hi' ? petition?.content?.en : petition?.content?.hi;
  return fallback || { title: '', description: '' };
};

export default function MyPetitionsPage() {
  const { token, isAuthenticated, isLoading } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();
  const [petitions, setPetitions] = useState([]);
  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const loadPetitions = async () => {
      if (!token) return;
      setIsFetching(true);
      try {
        const response = await fetch('/api/petitions?mine=1', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.error || 'Failed to load petitions');
          return;
        }
        setPetitions(data.petitions || []);
      } catch (err) {
        console.error('Load petitions error:', err);
        setError('Network error. Please try again.');
      } finally {
        setIsFetching(false);
      }
    };

    if (isAuthenticated) {
      loadPetitions();
    }
  }, [token, isAuthenticated]);

  const filteredPetitions = petitions.filter((petition) => {
    if (activeTab === 'all') return true;
    return petition.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-slate-50 pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Card>
          <CardHeader>
            <CardTitle className={language === 'hi' ? 'font-hindi' : ''}>
              {t('petitions.myPetitions')}
            </CardTitle>
            <CardDescription className={language === 'hi' ? 'font-hindi' : ''}>
              {t('petitions.myPetitionsIntro', 'Manage and share your petitions.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-wrap gap-2">
              {['all', 'active', 'closed'].map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? 'primary' : 'ghost'}
                  onClick={() => setActiveTab(tab)}
                >
                  {t(`petitions.tab.${tab}`, tab)}
                </Button>
              ))}
            </div>
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 mb-4">
                {error}
              </div>
            )}
            {isFetching ? (
              <p className="text-sm text-slate-600">{t('forms.loading')}</p>
            ) : filteredPetitions.length === 0 ? (
              <div className="text-center text-slate-600">
                <p className={language === 'hi' ? 'font-hindi' : ''}>
                  {t('petitions.noPetitions', 'You have not created any petitions yet.')}
                </p>
                <div className="mt-4">
                  <Link href="/create-petition">
                    <Button>{t('petitions.createNew')}</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredPetitions.map((petition) => {
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
                        <div className="flex flex-wrap gap-2">
                          <Link href={`/petitions/${petition._id}`}>
                            <Button variant="secondary">
                              {t('petitions.viewPetition', 'View Petition')}
                            </Button>
                          </Link>
                          <Link href={`/petitions/${petition._id}/analytics`}>
                            <Button variant="ghost">
                              {t('petitions.viewAnalytics', 'View Analytics')}
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
