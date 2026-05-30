import React, { useState } from 'react';

const ImportVideo = ({ onImport }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [platform, setPlatform] = useState('');
  const [error, setError] = useState('');

  const detectPlatform = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('tiktok.com')) return 'tiktok';
    if (url.includes('facebook.com')) return 'facebook';
    if (url.includes('vimeo.com')) return 'vimeo';
    return 'unknown';
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setVideoUrl(url);
    setPlatform(detectPlatform(url));
    setError('');
  };

  const handleImport = () => {
    if (!videoUrl.trim()) {
      setError('Por favor ingresa una URL de video');
      return;
    }

    if (platform === 'unknown') {
      setError('URL no reconocida. Usa YouTube, TikTok, Facebook o Vimeo');
      return;
    }

    onImport({ url: videoUrl, platform });
    setVideoUrl('');
    setPlatform('');
  };

  const platformInfo = {
    youtube: { icon: '📺', name: 'YouTube', placeholder: 'https://www.youtube.com/watch?v=...' },
    tiktok: { icon: '🎵', name: 'TikTok', placeholder: 'https://www.tiktok.com/@user/video/...' },
    facebook: { icon: '📘', name: 'Facebook', placeholder: 'https://www.facebook.com/...' },
    vimeo: { icon: '🎬', name: 'Vimeo', placeholder: 'https://vimeo.com/...' }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">📥 Importar Video Externo</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2">URL del Video</label>
          <input
            type="url"
            value={videoUrl}
            onChange={handleUrlChange}
            placeholder="Pega la URL del video aquí..."
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Preview de plataforma detectada */}
        {platform && platform !== 'unknown' && (
          <div className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg">
            <span className="text-3xl">{platformInfo[platform]?.icon}</span>
            <div>
              <p className="text-white font-medium">Plataforma detectada</p>
              <p className="text-purple-400">{platformInfo[platform]?.name}</p>
            </div>
          </div>
        )}

        {/* Instrucciones por plataforma */}
        {platform && platform !== 'unknown' && (
          <div className="bg-gray-700/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">📌 Cómo obtener la URL:</p>
            <ul className="text-gray-300 text-sm space-y-1">
              {platform === 'youtube' && (
                <>
                  <li>1. Ve al video en YouTube</li>
                  <li>2. Haz clic en "Compartir"</li>
                  <li>3. Copia la URL o usa "Copiar"</li>
                </>
              )}
              {platform === 'tiktok' && (
                <>
                  <li>1. Abre el video en TikTok</li>
                  <li>2. Toca el botón "Compartir" (flecha)</li>
                  <li>3. Copia el enlace</li>
                </>
              )}
              {platform === 'facebook' && (
                <>
                  <li>1. Ve al video en Facebook</li>
                  <li>2. Haz clic en la fecha del post</li>
                  <li>3. Copia la URL del navegador</li>
                </>
              )}
              {platform === 'vimeo' && (
                <>
                  <li>1. Ve al video en Vimeo</li>
                  <li>2. Copia la URL del navegador</li>
                </>
              )}
            </ul>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-600/20 border border-red-500 rounded-lg text-red-400">
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={!videoUrl || platform === 'unknown'}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            videoUrl && platform !== 'unknown'
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {platform ? `📥 Importar desde ${platformInfo[platform]?.name}` : '📥 Importar Video'}
        </button>
      </div>
    </div>
  );
};

export default ImportVideo;