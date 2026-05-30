import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register({ onLogin }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.msg || 'Registration failed');
        return;
      }

      onLogin(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError('Error registering: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center px-4">
      <div className="glass p-8 rounded-2xl w-full max-w-md border-2 border-green-500/30">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black gradient-text mb-2">Registro</h2>
          <p className="text-gray-400">Crea tu cuenta ANDYTUBE</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border-l-4 border-red-500 rounded-lg text-red-400 font-medium">
            ❌ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-bold text-green-300 mb-2">👤 Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tu nombre completo"
              className="w-full"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-bold text-green-300 mb-2">📧 Email</label>
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
            <label className="block text-sm font-bold text-green-300 mb-2">🔐 Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              className="w-full"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 py-3 rounded-lg text-white font-bold text-lg hover:shadow-lg hover:shadow-green-500/50 transition disabled:opacity-50"
          >
            {loading ? 'Cargando...' : '✨ Crear Cuenta'}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 border-t border-green-500/20"></div>

        {/* Login Link */}
        <p className="text-center text-gray-400">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-green-400 hover:text-green-300 font-bold">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
