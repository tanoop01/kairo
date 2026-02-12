'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import LocationCapture from '@/components/LocationCapture';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import LanguageToggle from '@/components/LanguageToggle';
import { 
  Users, 
  User,
  FileText, 
  MessageCircle, 
  Settings, 
  LogOut,
  MapPin,
  Languages,
  CheckCircle,
  AlertTriangle,
  Navigation as NavigationIcon,
  Brain,
  TrendingUp,
  Clock,
  Eye,
  Award,
  Plus,
  ArrowRight
} from 'lucide-react';

export default function Dashboard() {
  const { user, token, isLoading, isAuthenticated, logout, updateUser } = useAuth();
  const { t, language } = useLanguage();
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const [showLocationSettings, setShowLocationSettings] = useState(false);
  const [isSavingLocation, setIsSavingLocation] = useState(false);
  const [locationSaveError, setLocationSaveError] = useState('');
  const [locationSaveMessage, setLocationSaveMessage] = useState('');
  const [activityItems, setActivityItems] = useState([]);
  const [activityError, setActivityError] = useState('');
  const [activityLoading, setActivityLoading] = useState(false);
  const [manualLocation, setManualLocation] = useState({
    city: '',
    state: '',
    pincode: '',
    address: '',
  });
  const router = useRouter();

  const roleLabels = {
    en: {
      citizen: 'Citizen',
      worker: 'Worker',
      student: 'Student',
      woman: 'Woman',
      senior: 'Senior Citizen',
      business: 'Business Owner',
      government: 'Government Employee',
      ngo: 'NGO Worker',
      activist: 'Activist',
      lawyer: 'Lawyer',
      journalist: 'Journalist',
      researcher: 'Researcher',
      volunteer: 'Volunteer',
    },
    hi: {
      citizen: 'नागरिक',
      worker: 'मज़दूर',
      student: 'छात्र',
      woman: 'महिला',
      senior: 'वरिष्ठ नागरिक',
      business: 'व्यवसायी',
      government: 'सरकारी कर्मचारी',
      ngo: 'एनजीओ कार्यकर्ता',
      activist: 'कार्यकर्ता',
      lawyer: 'वकील',
      journalist: 'पत्रकार',
      researcher: 'शोधकर्ता',
      volunteer: 'स्वयंसेवक',
    },
  };

  const roleKey = user?.profile?.role || 'citizen';
  const roleLabel = roleLabels[language]?.[roleKey]
    || `${roleKey.charAt(0).toUpperCase()}${roleKey.slice(1)}`;
  const roleTitle = roleKey === 'citizen'
    ? t('profile.citizenAdvocate')
    : `${roleLabel} ${t('profile.advocate')}`;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user && !user.profile?.isLocationEnabled) {
      setShowLocationPrompt(true);
    }
    if (user?.profile?.location) {
      setLocationData(user.profile.location);
    }
    if (user?.profile) {
      setManualLocation({
        city: user.profile.city || '',
        state: user.profile.state || '',
        pincode: user.profile.pincode || '',
        address: user.profile.location?.address || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (!token) return;

    const loadActivity = async () => {
      setActivityLoading(true);
      setActivityError('');
      try {
        const response = await fetch('/api/activity?limit=8', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          setActivityError(data.error || 'Failed to load activity');
          return;
        }
        setActivityItems(data.activity || []);
      } catch (error) {
        console.error('Activity load error:', error);
        setActivityError('Network error. Please try again.');
      } finally {
        setActivityLoading(false);
      }
    };

    loadActivity();
  }, [token]);

  const activityLabel = useMemo(() => ({
    petition_created: t('dashboard.activityCreatedPetition', 'Created a petition'),
    petition_signed: t('dashboard.activitySignedPetition', 'Signed a petition'),
  }), [t]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const saveLocation = async (payload) => {
    if (!token) {
      setLocationSaveError(t('location.locationSaveFailed', 'Unable to save location.'));
      return;
    }

    setIsSavingLocation(true);
    setLocationSaveError('');
    setLocationSaveMessage('');

    try {
      const response = await fetch('/api/user/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        setLocationSaveError(data.error || t('location.locationSaveFailed', 'Unable to save location.'));
        return;
      }

      updateUser(data.user);
      setLocationData(data.user?.profile?.location || null);
      setLocationSaveMessage(t('location.locationSaved', 'Location saved.'));
      setShowLocationPrompt(false);
    } catch (error) {
      console.error('Save location error:', error);
      setLocationSaveError(t('location.locationSaveFailed', 'Unable to save location.'));
    } finally {
      setIsSavingLocation(false);
      setTimeout(() => setLocationSaveMessage(''), 2500);
    }
  };

  const handleLocationUpdate = (location) => {
    setLocationData(location);
    saveLocation({
      location,
      city: location.city,
      state: location.state,
      pincode: location.pincode,
      address: location.address,
      isManuallyEntered: false,
    });
  };

  const handleManualLocationSave = async (event) => {
    event.preventDefault();
    await saveLocation({
      city: manualLocation.city,
      state: manualLocation.state,
      pincode: manualLocation.pincode,
      address: manualLocation.address,
      isManuallyEntered: true,
    });
  };

  const dismissLocationPrompt = () => {
    setShowLocationPrompt(false);
  };

  const navigateToAI = () => {
    router.push('/ai-assistant');
  };

  const navigateToCreatePetition = () => {
    router.push('/create-petition');
  };

  const navigateToCityDashboard = () => {
    router.push('/city-dashboard');
  };

  const navigateToMyPetitions = () => {
    router.push('/my-petitions');
  };

  const navigateToDiscoverPetitions = () => {
    router.push('/petitions');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">{t('forms.loading')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-slate-50 pt-16">
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1">
              <h1 className={`text-4xl font-bold text-slate-900 mb-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                {t('dashboard.welcomeBack')}, {user?.profile?.name || user?.name}!
              </h1>
              <p className={`text-slate-600 text-lg ${language === 'hi' ? 'font-hindi' : ''}`}>
                {roleTitle}
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center space-x-2 self-start"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('navigation.logout')}</span>
            </Button>
          </div>
        </div>

        {/* Settings Navbar */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className={`flex items-center space-x-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
              <Settings className="w-5 h-5" />
              <span>{t('navigation.settings')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button variant="ghost" className="justify-start">
                <User className="w-4 h-4 mr-2" />
                <span className={language === 'hi' ? 'font-hindi' : ''}>
                  {t('navigation.profile')}
                </span>
              </Button>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => setShowLocationSettings((prev) => !prev)}
              >
                <MapPin className="w-4 h-4 mr-2" />
                <span className={language === 'hi' ? 'font-hindi' : ''}>
                  {t('settings.locationSettings')}
                </span>
              </Button>
              <Button variant="ghost" className="justify-start">
                <MessageCircle className="w-4 h-4 mr-2" />
                <span className={language === 'hi' ? 'font-hindi' : ''}>
                  {t('settings.notifications')}
                </span>
              </Button>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                <div className="flex items-center space-x-2 text-slate-700">
                  <Languages className="w-4 h-4" />
                  <span className={language === 'hi' ? 'font-hindi' : ''}>
                    {t('forms.language')}: {language === 'hi' ? 'हिन्दी' : 'English'}
                  </span>
                </div>
                <LanguageToggle variant="compact" showLabel={false} />
              </div>
            </div>

            {showLocationSettings && (
              <div className="mt-5 border-t border-slate-200 pt-5">
                <div className="flex flex-col gap-4">
                  <div>
                    <p className={`text-sm font-semibold text-slate-900 ${language === 'hi' ? 'font-hindi' : ''}`}>
                      {t('location.updateLocation', 'Update your location')}
                    </p>
                    <p className={`text-xs text-slate-500 ${language === 'hi' ? 'font-hindi' : ''}`}>
                      {t('location.updateLocationHint', 'Use your current location or enter details manually.')}
                    </p>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className={`text-sm font-medium text-slate-700 mb-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                        {t('location.useCurrentLocation', 'Use my current location')}
                      </p>
                      <p className={`text-xs text-slate-500 mb-3 ${language === 'hi' ? 'font-hindi' : ''}`}>
                        {t('location.detectLocationHint', 'We will detect your city and state automatically.')}
                      </p>
                      <LocationCapture onLocationUpdate={handleLocationUpdate} showInline />
                    </div>

                    <form
                      onSubmit={handleManualLocationSave}
                      className="rounded-lg border border-slate-200 bg-white p-4"
                    >
                      <p className={`text-sm font-medium text-slate-700 mb-3 ${language === 'hi' ? 'font-hindi' : ''}`}>
                        {t('location.enterManually', 'Enter location manually')}
                      </p>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className={`text-xs font-medium text-slate-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
                            {t('location.city', 'City')}
                          </label>
                          <input
                            type="text"
                            value={manualLocation.city}
                            onChange={(event) => setManualLocation((prev) => ({ ...prev, city: event.target.value }))}
                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className={`text-xs font-medium text-slate-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
                            {t('location.state', 'State')}
                          </label>
                          <input
                            type="text"
                            value={manualLocation.state}
                            onChange={(event) => setManualLocation((prev) => ({ ...prev, state: event.target.value }))}
                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className={`text-xs font-medium text-slate-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
                            {t('location.pincode', 'Pincode')}
                          </label>
                          <input
                            type="text"
                            value={manualLocation.pincode}
                            onChange={(event) => setManualLocation((prev) => ({ ...prev, pincode: event.target.value }))}
                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className={`text-xs font-medium text-slate-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
                            {t('location.address', 'Address')}
                          </label>
                          <input
                            type="text"
                            value={manualLocation.address}
                            onChange={(event) => setManualLocation((prev) => ({ ...prev, address: event.target.value }))}
                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-xs text-slate-500">
                          {t('location.manualHint', 'You can update this anytime.')}
                        </p>
                        <Button type="submit" variant="secondary" isLoading={isSavingLocation} disabled={isSavingLocation}>
                          {t('location.saveLocation', 'Save location')}
                        </Button>
                      </div>
                    </form>
                  </div>

                  {locationSaveError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                      {locationSaveError}
                    </div>
                  )}
                  {locationSaveMessage && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-600">
                      {locationSaveMessage}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Location Prompt Banner */}
        {showLocationPrompt && (
          <Card variant="gradient" className="mb-8 border-none">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-accent-blue/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-accent-blue" />
                    </div>
                    <h3 className={`text-xl font-semibold text-slate-900 ${language === 'hi' ? 'font-hindi' : ''}`}>
                      {t('dashboard.locationPrompt')}
                    </h3>
                  </div>
                  <p className={`text-slate-600 mb-4 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {t('dashboard.locationPromptDescription')}
                  </p>
                  <div className="flex items-center space-x-4">
                    <LocationCapture 
                      onLocationUpdate={handleLocationUpdate}
                      showInline={false}
                    />
                    <Button
                      variant="ghost"
                      onClick={dismissLocationPrompt}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      {t('location.skipForNow')}
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={dismissLocationPrompt}
                  size="icon"
                >
                  ×
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User Impact Card */}
          <Card variant="glass" className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm text-slate-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {t('profile.roleImpact')}
                  </p>
                  <p className={`text-2xl font-bold text-slate-900 mt-1 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {user?.profile?.role && user.profile.role !== 'citizen' 
                      ? `${user.profile.role.charAt(0).toUpperCase()}${user.profile.role.slice(1)}` 
                      : 'Citizen'
                    }
                  </p>
                  <p className={`text-sm text-slate-500 mt-1 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {t('profile.makingDifference')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-accent-blue to-accent-purple rounded-xl flex items-center justify-center shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Status Card */}
          <Card variant="glass" className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm text-slate-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {t('profile.locationStatus')}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${language === 'hi' ? 'font-hindi' : ''} ${
                    locationData ? 'text-accent-emerald' : 'text-amber-600'
                  }`}>
                    {locationData ? t('profile.enabled') : t('profile.disabled')}
                  </p>
                  <p className={`text-sm text-slate-500 mt-1 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {locationData 
                      ? t('profile.gettingPersonalizedAdvice') 
                      : t('profile.enableForBetterAssistance')
                    }
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                  locationData 
                    ? 'bg-gradient-to-br from-accent-emerald to-green-500' 
                    : 'bg-gradient-to-br from-amber-500 to-orange-500'
                }`}>
                  {locationData ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Features Card */}
          <Card variant="glass" className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm text-slate-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {t('profile.platformFeatures')}
                  </p>
                  <p className={`text-2xl font-bold text-accent-purple mt-1 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {t('profile.ready')}
                  </p>
                  <p className={`text-sm text-slate-500 mt-1 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {t('dashboard.platformHighlights')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-accent-purple to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Summary Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className={language === 'hi' ? 'font-hindi' : ''}>
                {t('dashboard.profileSummary')}
              </CardTitle>
              {locationData && (
                <Badge variant="success" className="flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span className={language === 'hi' ? 'font-hindi' : ''}>
                    {t('profile.locationEnabled')}
                  </span>
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg text-center">
                <p className={`text-sm text-slate-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('profile.name')}
                </p>
                <p className={`font-semibold text-slate-900 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {user?.profile?.name || user?.name}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg text-center">
                <p className={`text-sm text-slate-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('profile.email')}
                </p>
                <p className={`font-semibold text-slate-900 text-xs ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {user?.email}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg text-center">
                <p className={`text-sm text-slate-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('profile.phone')}
                </p>
                <p className={`font-semibold text-slate-900 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {user?.phoneNumber}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg text-center">
                <p className={`text-sm text-slate-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('profile.role')}
                </p>
                <p className={`font-semibold text-slate-900 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {roleLabel}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg text-center">
                <p className={`text-sm text-slate-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('profile.location')}
                </p>
                {locationData ? (
                  <p className={`font-semibold text-slate-900 text-xs ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {locationData.address || `${user?.profile?.city || 'Unknown'}, ${user?.profile?.state || 'India'}`}
                  </p>
                ) : (
                  <div className="flex items-center justify-center space-x-1">
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    <p className={`font-semibold text-amber-600 text-xs ${language === 'hi' ? 'font-hindi' : ''}`}>
                      {t('profile.notSet')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {locationData && (
              <div className="mt-4 p-4 bg-accent-emerald/5 border border-accent-emerald/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <NavigationIcon className="w-4 h-4 text-accent-emerald" />
                  <span className={`text-sm font-medium text-accent-emerald ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {t('profile.preciseLocation')}: {locationData.latitude?.toFixed(6)}, {locationData.longitude?.toFixed(6)}
                  </span>
                  <Badge variant="success" size="sm">
                    ±{locationData.accuracy}m {t('profile.accuracy')}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Grid */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold text-slate-900 mb-6 ${language === 'hi' ? 'font-hindi' : ''}`}>
            {t('dashboard.quickActions')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* AI Rights Assistant */}
            <Card 
              className="group cursor-pointer hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1"
              onClick={navigateToAI}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-blue to-accent-purple rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className={`font-semibold text-slate-900 mb-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('dashboard.aiAssistant')}
                </h3>
                <p className={`text-slate-600 text-sm mb-4 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('dashboard.aiAssistantDescription')}
                  {locationData && (
                    <span className="text-accent-emerald"> • {locationData.address}</span>
                  )}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-accent-blue text-sm font-medium flex items-center">
                    {t('actions.tryNow')} <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                  {locationData && (
                    <Badge variant="success" size="sm">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      <span className={language === 'hi' ? 'font-hindi' : ''}>
                        {t('dashboard.personalized')}
                      </span>
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Create Petition */}
            <Card 
              className="group cursor-pointer hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1"
              onClick={navigateToCreatePetition}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-emerald to-green-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h3 className={`font-semibold text-slate-900 mb-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('dashboard.createPetition')}
                </h3>
                <p className={`text-slate-600 text-sm mb-4 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('dashboard.createPetitionDescription')}
                </p>
                <span className="text-accent-emerald text-sm font-medium flex items-center">
                  {t('actions.getStarted')} <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </CardContent>
            </Card>

            {/* My Petitions */}
            <Card 
              className="group cursor-pointer hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1"
              onClick={navigateToMyPetitions}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-amber to-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className={`font-semibold text-slate-900 mb-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('navigation.myPetitions')}
                </h3>
                <p className={`text-slate-600 text-sm mb-4 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('dashboard.managePetitions')}
                </p>
                <span className="text-accent-amber text-sm font-medium flex items-center">
                  {t('dashboard.viewAll')} <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </CardContent>
            </Card>

            {/* Discover Petitions */}
            <Card 
              className="group cursor-pointer hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1"
              onClick={navigateToDiscoverPetitions}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-blue rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className={`font-semibold text-slate-900 mb-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('dashboard.discoverPetitions')}
                </h3>
                <p className={`text-slate-600 text-sm mb-4 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('dashboard.discoverPetitionsDescription')}
                </p>
                <span className="text-primary-600 text-sm font-medium flex items-center">
                  {t('dashboard.browsePetitions')} <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </CardContent>
            </Card>

            {/* City Issues Map */}
            <Card 
              className="group cursor-pointer hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1"
              onClick={navigateToCityDashboard}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-purple to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className={`font-semibold text-slate-900 mb-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('dashboard.cityIssuesMap')}
                </h3>
                <p className={`text-slate-600 text-sm mb-4 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('dashboard.cityIssuesMapDescription')}
                </p>
                <span className="text-accent-purple text-sm font-medium flex items-center">
                  {t('dashboard.exploreMap')} <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                <Clock className="w-5 h-5" />
                <span>{t('dashboard.recentActivity')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activityError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 mb-4">
                  {activityError}
                </div>
              )}

              {activityLoading ? (
                <p className="text-sm text-slate-600">{t('forms.loading')}</p>
              ) : activityItems.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-slate-500">
                  <p className={language === 'hi' ? 'font-hindi' : ''}>
                    {t('dashboard.noRecentActivity')}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activityItems.map((item) => {
                    const isCreated = item.type === 'petition_created';
                    const Icon = isCreated ? FileText : CheckCircle;
                    const title = item.petitionTitle || t('petitions.untitled', 'Untitled Petition');
                    const time = new Date(item.createdAt).toLocaleString();

                    return (
                      <div key={item._id} className="flex items-center space-x-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                          isCreated ? 'bg-accent-emerald/10 text-accent-emerald' : 'bg-accent-blue/10 text-accent-blue'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium text-slate-900 ${language === 'hi' ? 'font-hindi' : ''}`}>
                            {activityLabel[item.type]}
                          </p>
                          <p className={`text-xs text-slate-500 ${language === 'hi' ? 'font-hindi' : ''}`}>
                            {title}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400">{time}</p>
                          {item.petitionId && (
                            <Link href={`/petitions/${item.petitionId}`} className="text-xs text-primary-600 hover:text-primary-700">
                              {t('petitions.viewPetition', 'View Petition')}
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 py-8 border-t border-slate-200">
          <p className={`text-slate-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
            {t('footer.tagline')}
          </p>
        </div>
      </div>
    </div>
  );
}
