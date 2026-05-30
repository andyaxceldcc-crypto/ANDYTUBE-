import React, { useState } from 'react';

function AdminPanel() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnail: '',
    duration: '',
    price: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [showVideos, setShowVideos] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          duration: parseInt(formData.duration),
          price: parseFloat(formData.price)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage('Error uploading video: ' + (data.error || 'Unknown error'));
        setMessageType('error');
        return;
      }

      setMessage('✅ Video subido exitosamente!');
      setMessageType('success');
      setFormData({ title: '', description: '', videoUrl: '', thumbnail: '', duration: '', price: '' });
      fetchMyVideos();
    } catch (err) {
      setMessage('Error: ' + err.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyVideos = async () => {
    try {
      const response = await fetch('/api/videos');
      const data = await response.json();
      setVideos(data);
      setShowVideos(true);
    } catch (err) {
      console.error('Error fetching videos:', err);
    }
  };

  const deleteVideo = async (videoId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este video?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/videos/${videoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMessage('✅ Video eliminado');
        setMessageType('success');
        fetchMyVideos();
      } else {
        setMessage('Error al eliminar');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
      setMessageType('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-black py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="glass p-8 rounded-2xl mb-8 text-center border-2 border-blue-500/30">
          <h1 className="text-5xl font-black gradient-text mb-3">⚙️ Panel de Administrador</h1>
          <p className="text-gray-400 text-lg">Sube y gestiona tus videos premium</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border-l-4 font-medium fade-in ${
              messageType === 'success'
                ? 'bg-green-500/20 border-green-500 text-green-400'
                : 'bg-red-500/20 border-red-500 text-red-400'
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card p-8 rounded-2xl space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-blue-300 mb-2">📝 Título del Video</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ej: Tutorial de React Pro"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-blue-300 mb-2">📄 Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Escribe una descripción detallada..."
                  rows="4"
                  required
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-bold text-blue-300 mb-2">🎥 URL del Video</label>
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/video.mp4"
                  required
                />
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="block text-sm font-bold text-blue-300 mb-2">🖼️ URL de la Miniatura</label>
                <input
                  type="url"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/thumb.jpg"
                  required
                />
              </div>

              {/* Duration & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-blue-300 mb-2">⏱️ Duración (segundos)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="3600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blue-300 mb-2">💰 Precio ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    placeholder="9.99"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gradient py-4 rounded-lg text-white font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                    Subiendo...
                  </>
                ) : (
                  <>🚀 Subir Video</>
                )}
              </button>
            </form>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <div className="card p-6 rounded-2xl text-center">
              <div className="text-4xl font-black gradient-text mb-2">{videos.length}</div>
              <div className="text-gray-400 font-medium">Videos Subidos</div>
            </div>

            <button
              onClick={fetchMyVideos}
              className="w-full card p-6 rounded-2xl text-center font-bold text-purple-300 hover:text-purple-200 transition"
            >
              📊 Ver Videos
            </button>
          </div>
        </div>

        {/* Videos List */}
        {showVideos && videos.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-black gradient-text mb-8">📺 Tus Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video._id} className="card p-4 rounded-xl overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{video.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{video.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-green-400 font-bold">${video.price}</span>
                    <span className="badge badge-secondary">Premium</span>
                  </div>
                  <button
                    onClick={() => deleteVideo(video._id)}
                    className="w-full py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition font-medium"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
