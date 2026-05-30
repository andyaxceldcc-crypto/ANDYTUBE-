import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.msg || 'Login failed');
        return;
      }

      onLogin(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError('Error logging in: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center px-4">
      <div className="glass p-8 rounded-2xl w-full max-w-md border-2 border-purple-500/30">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black gradient-text mb-2">Login</h2>
          <p className="text-gray-400">Accede a tu cuenta ANDYTUBE</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border-l-4 border-red-500 rounded-lg text-red-400 font-medium">
            ❌ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-bold text-purple-300 mb-2">📧 Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className="w-full"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-bold text-purple-300 mb-2">🔐 Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gradient py-3 rounded-lg text-white font-bold text-lg disabled:opacity-50"
          >
            {loading ? 'Cargando...' : '🚀 Entrar'}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 border-t border-purple-500/20"></div>

        {/* Register Link */}
        <p className="text-center text-gray-400">
          ¿Sin cuenta?{' '}
          <Link to="/register" className="text-purple-400 hover:text-purple-300 font-bold">
            Registrarse aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
