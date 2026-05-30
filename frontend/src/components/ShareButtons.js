import React from 'react';

const ShareButton = ({ url, title, platform }) => {
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    reddit: `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
  };

  const shareIcons = {
    facebook: '📘',
    twitter: '🐦',
    whatsapp: '💬',
    telegram: '✈️',
    linkedin: '💼',
    reddit: '🔴'
  };

  const shareLabels = {
    facebook: 'Facebook',
    twitter: 'Twitter',
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    linkedin: 'LinkedIn',
    reddit: 'Reddit'
  };

  const handleShare = () => {
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  if (!shareUrls[platform]) return null;

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
    >
      <span className="text-lg">{shareIcons[platform]}</span>
      <span className="text-sm">{shareLabels[platform]}</span>
    </button>
  );
};

const ShareButtons = ({ url, title }) => {
  const platforms = ['facebook', 'twitter', 'whatsapp', 'telegram', 'linkedin', 'reddit'];

  return (
    <div className="flex flex-wrap gap-2">
      {platforms.map(platform => (
        <ShareButton 
          key={platform} 
          platform={platform} 
          url={url} 
          title={title} 
        />
      ))}
    </div>
  );
};

export { ShareButton, ShareButtons };
export default ShareButtons;