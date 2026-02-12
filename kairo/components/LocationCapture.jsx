
'use client';

import { useState } from 'react';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LocationCapture({ onLocationUpdate, showInline = true }) {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const extractAddressParts = (address = {}) => {
    const city = address.city || address.town || address.village || address.suburb || address.county || '';
    const state = address.state || '';
    const district = address.state_district || address.county || address.region || '';
    const pincode = address.postcode || '';

    return { city, state, district, pincode };
  };

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      // Using OpenStreetMap Nominatim API for reverse geocoding (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      
      const data = await response.json();
      const address = extractAddressParts(data.address);
      return {
        displayName: data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        address,
      };
    } catch (error) {
      console.warn('Failed to get address, using coordinates:', error);
      return {
        displayName: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        address: { city: '', state: '', district: '', pincode: '' },
      };
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError(t('location.geolocationUnsupported', 'Geolocation is not supported by this browser.'));
      return;
    }

    setIsLoading(true);
    setError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude, accuracy } = position.coords;
          
          // Get human-readable address
          const { displayName, address } = await getAddressFromCoordinates(latitude, longitude);
          
          const locationData = {
            latitude,
            longitude,
            accuracy: Math.round(accuracy),
            address: displayName,
            city: address.city,
            state: address.state,
            district: address.district,
            pincode: address.pincode,
            timestamp: new Date().toISOString()
          };

          onLocationUpdate(locationData);
          setIsLoading(false);
        } catch (error) {
          console.error('Error processing location:', error);
          setError(t('location.locationProcessingFailed', 'Failed to process location data.'));
          setIsLoading(false);
        }
      },
      (error) => {
        let errorMessage = t('location.locationUnavailable', 'Unable to retrieve your location.');
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = t('location.locationAccessDenied', 'Location access was denied. Please enable location permissions.');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = t('location.locationUnavailable', 'Location information is unavailable.');
            break;
          case error.TIMEOUT:
            errorMessage = t('location.locationTimeout', 'Location request timed out. Please try again.');
            break;
        }
        
        setError(errorMessage);
        setIsLoading(false);
      },
      options
    );
  };

  if (showInline) {
    return (
      <div className="w-full max-w-md">
        <button
          onClick={handleGetLocation}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t('location.gettingLocation', 'Getting Location...')}</span>
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4" />
              <span>{t('location.enableLocation', 'Enable Location')}</span>
            </>
          )}
        </button>
        
        {error && (
          <div className="mt-2 flex items-center space-x-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  // Non-inline version (for use in banners/prompts)
  return (
    <button
      onClick={handleGetLocation}
      disabled={isLoading}
      className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 disabled:bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all border border-white/20"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t('location.gettingLocation', 'Getting Location...')}</span>
        </>
      ) : (
        <>
          <MapPin className="w-4 h-4" />
              <span>{t('location.enableLocation', 'Enable Location')}</span>
        </>
      )}
    </button>
  );
}