'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Facebook, Linkedin, MessageCircle, Twitter } from 'lucide-react';
import { buildShareUrl, buildPlatformShareLinks } from '@/lib/shareUtils';

const getContentForLanguage = (petition, language) => {
  const preferred = petition?.content?.[language];
  if (preferred?.title || preferred?.description) {
    return preferred;
  }
  const fallback = language === 'hi' ? petition?.content?.en : petition?.content?.hi;
  return fallback || { title: '', description: '' };
};

export default function PetitionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token, isAuthenticated, isLoading, user } = useAuth();
  const { t, language } = useLanguage();
  const [petition, setPetition] = useState(null);
  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [isSigning, setIsSigning] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/petitions/${id}`;
  }, [id]);

  const shareLinks = useMemo(() => {
    if (!petition || !shareUrl) return {};
    const content = getContentForLanguage(petition, language);
    const baseUrl = shareUrl;
    return buildPlatformShareLinks({
      baseUrl: buildShareUrl(baseUrl, { campaign: 'petition_share' }),
      title: content.title || t('petitions.untitled', 'Untitled Petition'),
      description: content.description || t('petitions.noDescription', 'No description yet.'),
      language,
    });
  }, [petition, shareUrl, language, t]);

  useEffect(() => {
    const loadPetition = async () => {
      setIsFetching(true);
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await fetch(`/api/petitions/${id}`, { headers });
        const data = await response.json();
        if (!response.ok) {
          setError(data.error || 'Failed to load petition');
          return;
        }
        setPetition(data.petition);
      } catch (err) {
        console.error('Petition load error:', err);
        setError('Network error. Please try again.');
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      loadPetition();
    }
  }, [id, token]);

  const handleSign = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setIsSigning(true);
    setError('');

    try {
      const response = await fetch(`/api/petitions/${id}/sign`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to sign petition');
        return;
      }

      setPetition((prev) => ({
        ...prev,
        signatureCount: data.signatureCount,
      }));
    } catch (err) {
      console.error('Sign petition error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsSigning(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyMessage(t('petitions.shareCopied', 'Link copied!'));
    } catch (err) {
      console.error('Copy link error:', err);
      setCopyMessage(t('petitions.shareFailed', 'Unable to copy link.'));
    }
    setTimeout(() => setCopyMessage(''), 2000);
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-slate-50">
        <p className="text-sm text-slate-600">{t('forms.loading')}</p>
      </div>
    );
  }

  if (!petition) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-slate-50">
        <p className="text-sm text-slate-600">{error || t('petitions.notFound', 'Petition not found.')}</p>
      </div>
    );
  }

  const content = getContentForLanguage(petition, language);
  const isOwner = petition.isOwner || String(petition.author) === String(user?.id);
  const hasSigned = petition.signatures?.some(
    (signature) => String(signature.userId) === String(user?.id)
  );

  const shareActions = [
    {
      key: 'whatsapp',
      label: t('petitions.shareWhatsapp', 'WhatsApp'),
      href: shareLinks.whatsapp,
      Icon: MessageCircle,
      iconClass: 'text-emerald-600',
    },
    {
      key: 'twitter',
      label: t('petitions.shareTwitter', 'Twitter'),
      href: shareLinks.twitter,
      Icon: Twitter,
      iconClass: 'text-sky-600',
    },
    {
      key: 'facebook',
      label: t('petitions.shareFacebook', 'Facebook'),
      href: shareLinks.facebook,
      Icon: Facebook,
      iconClass: 'text-blue-600',
    },
    {
      key: 'linkedin',
      label: t('petitions.shareLinkedin', 'LinkedIn'),
      href: shareLinks.linkedin,
      Icon: Linkedin,
      iconClass: 'text-sky-700',
    },
  ].filter((item) => item.href);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-slate-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <Link href={isOwner ? '/my-petitions' : '/dashboard'} className="text-sm text-primary-600 hover:text-primary-700">
            ← {t('actions.back')}
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className={language === 'hi' ? 'font-hindi' : ''}>
              {content.title || t('petitions.untitled', 'Untitled Petition')}
            </CardTitle>
            <CardDescription className={language === 'hi' ? 'font-hindi' : ''}>
              {t('petitions.by', 'By')} {petition.authorName || 'Citizen'} • {t('petitions.signatures')}: {petition.signatureCount ?? petition.signatures?.length ?? 0}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
            <div>
              <p className={`text-slate-700 leading-relaxed ${language === 'hi' ? 'font-hindi' : ''}`}>
                {content.description || t('petitions.noDescription', 'No description yet.')}
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <span>{t('petitions.category')}: {petition.category || t('petitions.categoryGeneral', 'General')}</span>
                <span>•</span>
                <span>{t('petitions.target')}: {petition.target || t('petitions.targetPlaceholder', 'Local Authority')}</span>
              </div>
              {!isOwner && (
                <Button onClick={handleSign} isLoading={isSigning} disabled={isSigning || hasSigned}>
                  {hasSigned ? t('petitions.alreadySigned', 'Already signed') : t('petitions.signNow', 'Sign Petition')}
                </Button>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className={`text-sm font-semibold text-slate-800 ${language === 'hi' ? 'font-hindi' : ''}`}>
                      {t('petitions.shareTitle', 'Share this petition')}
                    </p>
                    <p className={`text-xs text-slate-500 ${language === 'hi' ? 'font-hindi' : ''}`}>
                      {t('petitions.shareHint', 'Invite others to support and spread the word.')}
                    </p>
                  </div>
                  {copyMessage && (
                    <span className="text-xs font-medium text-emerald-600">{copyMessage}</span>
                  )}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    aria-label={t('petitions.shareCopy', 'Copy link')}
                    className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                  />
                  <Button variant="secondary" onClick={handleCopyLink}>
                    {t('petitions.shareCopy', 'Copy link')}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {shareActions.map(({ key, label, href, Icon, iconClass }) => (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="group"
                    >
                      <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
                        <Icon className={`h-4 w-4 ${iconClass}`} />
                        <span>{label}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {isOwner && (
              <div>
                <h3 className={`text-base font-semibold text-slate-900 mb-3 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('petitions.signatures')}
                </h3>
                {petition.signatures?.length ? (
                  <ul className="space-y-2">
                    {petition.signatures.map((signature) => (
                      <li key={`${signature.userId}-${signature.signedAt}`} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                        <div className={`flex flex-col ${language === 'hi' ? 'font-hindi' : ''}`}>
                          <span>
                            {signature.name || t('petitions.supporter', 'Supporter')} • {new Date(signature.signedAt).toLocaleString()}
                          </span>
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
