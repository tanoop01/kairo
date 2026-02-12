const buildUtmParams = ({ source, medium = 'share', campaign = 'petition' }) => {
  const params = new URLSearchParams();
  if (source) params.set('utm_source', source);
  if (medium) params.set('utm_medium', medium);
  if (campaign) params.set('utm_campaign', campaign);
  return params.toString();
};

export const buildShareUrl = (baseUrl, { source, medium, campaign } = {}) => {
  if (!baseUrl) return '';
  const url = new URL(baseUrl);
  const utm = buildUtmParams({ source, medium, campaign });
  if (utm) {
    utm.split('&').forEach((pair) => {
      const [key, value] = pair.split('=');
      if (key) url.searchParams.set(key, decodeURIComponent(value));
    });
  }
  return url.toString();
};

export const buildShareMessage = ({ title, description }, language = 'en') => {
  if (language === 'hi') {
    return `${title}\n\n${description}`.trim();
  }
  return `${title}\n\n${description}`.trim();
};

export const buildPlatformShareLinks = ({ baseUrl, title, description, language = 'en' }) => {
  const message = buildShareMessage({ title, description }, language);
  const encodedUrl = encodeURIComponent(baseUrl);
  const encodedText = encodeURIComponent(message);

  return {
    whatsapp: `https://wa.me/?text=${encodedText}%0A${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };
};

export const generateShortLink = async (url) => {
  return url;
};
