import React from 'react';

const VideoEmbed = ({ url, title }) => {
  // Detectar tipo de video
  const getEmbedInfo = (videoUrl) => {
    // YouTube
    const youtubeMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (youtubeMatch) {
      return {
        type: 'youtube',
        videoId: youtubeMatch[1],
        embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`
      };
    }

    // TikTok
    if (videoUrl.includes('tiktok.com')) {
      return {
        type: 'tiktok',
        videoId: videoUrl,
        embedUrl: videoUrl
      };
    }

    // Facebook
    const fbMatch = videoUrl.match(/facebook\.com\/.*videos\/(\d+)/);
    if (fbMatch || videoUrl.includes('facebook.com')) {
      return {
        type: 'facebook',
        videoId: videoUrl,
        embedUrl: videoUrl
      };
    }

    // Vimeo
    const vimeoMatch = videoUrl.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return {
        type: 'vimeo',
        videoId: vimeoMatch[1],
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`
      };
    }

    // Default: video local o directo
    return {
      type: 'direct',
      videoId: videoUrl,
      embedUrl: videoUrl
    };
  };

  const embedInfo = getEmbedInfo(url);

  const renderEmbed = () => {
    switch (embedInfo.type) {
      case 'youtube':
        return (
          <div className="aspect-video">
            <iframe
              src={embedInfo.embedUrl}
              title={title || 'YouTube Video'}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );

      case 'tiktok':
        return (
          <div className="bg-black rounded-lg overflow-hidden">
            <iframe
              src={`https://www.tiktok.com/embed/${embedInfo.videoId.split('/').pop()}`}
              title="TikTok Video"
              className="w-full h-[600px]"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );

      case 'facebook':
        return (
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&appId`}
              title="Facebook Video"
              className="w-full h-[500px]"
              style={{ border: 'none', overflow: 'hidden' }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
            />
          </div>
        );

      case 'vimeo':
        return (
          <div className="aspect-video">
            <iframe
              src={embedInfo.embedUrl}
              title={title || 'Vimeo Video'}
              className="w-full h-full rounded-lg"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        );

      case 'direct':
        return (
          <video
            controls
            className="w-full rounded-lg bg-black"
            src={url}
          >
            Tu navegador no soporta videos.
          </video>
        );

      default:
        return (
          <div className="bg-red-600 text-white p-8 rounded-lg text-center">
            <p className="text-xl">❌ Formato de video no soportado</p>
            <p className="mt-2 text-sm opacity-80">URL: {url}</p>
          </div>
        );
    }
  };

  const getPlatformIcon = () => {
    switch (embedInfo.type) {
      case 'youtube': return '📺';
      case 'tiktok': return '🎵';
      case 'facebook': return '📘';
      case 'vimeo': return '🎬';
      default: return '🎥';
    }
  };

  return (
    <div className="w-full">
      {/* Badge de plataforma */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-2xl">{getPlatformIcon()}</span>
        <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full capitalize">
          {embedInfo.type}
        </span>
      </div>
      
      {/* Video */}
      {renderEmbed()}
    </div>
  );
};

export default VideoEmbed;