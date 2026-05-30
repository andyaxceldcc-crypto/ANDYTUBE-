import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home({ user }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading videos...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Premium Videos</h1>

        {videos.length === 0 ? (
          <div className="text-center text-gray-400">
            <p>No videos available yet</p>
            {user?.isAdmin && <p>Start by uploading videos in the admin panel</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Link key={video._id} to={`/video/${video._id}`}>
                <div className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition cursor-pointer">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg truncate">{video.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{video.description.substring(0, 50)}...</p>
                    <p className="text-green-400 font-bold">${video.price}</p>
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
