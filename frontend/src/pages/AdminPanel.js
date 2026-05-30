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
  const [loading, setLoading] = useState(false);

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
        return;
      }

      setMessage('Video uploaded successfully!');
      setFormData({ title: '', description: '', videoUrl: '', thumbnail: '', duration: '', price: '' });
    } catch (err) {
      setMessage('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Admin Panel - Upload Video</h1>

        {message && (
          <div className={`p-4 rounded mb-6 text-white ${message.includes('Error') ? 'bg-red-600' : 'bg-green-600'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
              rows="4"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Video URL</label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
            <input
              type="url"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Duration (seconds)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded font-bold transition"
          >
            {loading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;
