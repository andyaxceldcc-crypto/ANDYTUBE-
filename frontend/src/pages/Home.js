import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home({ user }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos');
      const data = await response.json();
      setVideos(data);
    } catch (err) {
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-black py-12">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="glass p-8 rounded-2xl mb-12 text-center">
          <h1 className="text-5xl font-black gradient-text mb-4">🎬 Premium Videos</h1>
          <p className="text-gray-400 text-lg">Acceso exclusivo a contenido de alta calidad</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="🔍 Buscar videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full glass px-6 py-4 rounded-xl text-white placeholder-gray-400 text-lg"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-12 overflow-x-auto pb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full font-medium transition whitespace-nowrap ${
              filter === 'all'
                ? 'btn-gradient text-white'
                : 'glass text-gray-300 hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('recent')}
            className={`px-6 py-2 rounded-full font-medium transition whitespace-nowrap ${
              filter === 'recent'
                ? 'btn-gradient text-white'
                : 'glass text-gray-300 hover:text-white'
            }`}
          >
            Recientes
          </button>
          <button
            onClick={() => setFilter('popular')}
            className={`px-6 py-2 rounded-full font-medium transition whitespace-nowrap ${
              filter === 'popular'
                ? 'btn-gradient text-white'
                : 'glass text-gray-300 hover:text-white'
            }`}
          >
            Popular
          </button>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="max-w-7xl mx-auto px-4">
        {filteredVideos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400 mb-4">📭 No hay videos disponibles</p>
            {user?.isAdmin && (
              <Link
                to="/admin"
                className="btn-gradient px-8 py-3 rounded-lg text-white font-medium inline-block"
              >
                Subir Videos
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVideos.map((video, index) => (
              <Link key={video._id} to={`/video/${video._id}`}>
                <div className="card group overflow-hidden h-full fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* Thumbnail */}
                  <div className="relative overflow-hidden aspect-video">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition"></div>
                    <div className="absolute bottom-2 right-2 bg-black/80 px-3 py-1 rounded-lg text-sm font-bold">
                      ⏱️ {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg truncate group-hover:text-purple-400 transition mb-2">
                      {video.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {video.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-green-400 font-black text-lg">${video.price}</span>
                      <span className="badge badge-secondary">Premium</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
