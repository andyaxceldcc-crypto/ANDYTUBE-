import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY || 'pk_test_default');

function PaymentForm({ videoId, price, onPaymentSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Por favor inicia sesión primero');
        return;
      }

      // Create payment intent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ videoId, amount: price })
      });

      if (!response.ok) throw new Error('Error creating payment intent');
      const { clientSecret } = await response.json();

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        // Payment successful
        const paymentResponse = await fetch('/api/payments/payment-success', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            paymentIntentId: result.paymentIntent.id,
            videoId
          })
        });

        if (paymentResponse.ok) {
          onPaymentSuccess();
        }
      }
    } catch (err) {
      setError('Error en pago: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-4 glass rounded-lg border border-purple-500/20" />
      {error && <div className="text-red-400 text-sm font-medium">❌ {error}</div>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full btn-gradient py-3 rounded-lg text-white font-bold disabled:opacity-50"
      >
        {loading ? '⏳ Procesando...' : `💳 Pagar $${price}`}
      </button>
    </form>
  );
}

function VideoPlayer({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    try {
      const response = await fetch(`/api/videos/${id}`);
      if (!response.ok) throw new Error('Video no encontrado');
      const data = await response.json();
      setVideo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-red-400 mb-4">❌ {error}</p>
          <button onClick={() => navigate('/')} className="btn-gradient px-6 py-2 rounded-lg text-white">
            ← Volver
          </button>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <p className="text-2xl text-gray-400">🎥 Video no encontrado</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-400 mb-4">🔒 Por favor inicia sesión para ver videos</p>
          <button onClick={() => navigate('/login')} className="btn-gradient px-8 py-3 rounded-lg text-white font-bold">
            🚀 Inicia Sesión
          </button>
        </div>
      </div>
    );
  }

  if (!hasPaid && !user.isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12">
        <div className="max-w-md mx-auto">
          <div className="card p-8 rounded-2xl">
            <h2 className="text-3xl font-black gradient-text mb-4">{video.title}</h2>
            <p className="text-gray-400 mb-6">{video.description}</p>
            <p className="text-4xl font-black text-green-400 mb-8">${video.price}</p>

            <div className="bg-gray-800/50 p-6 rounded-xl border border-purple-500/20">
              <p className="text-sm font-medium text-gray-300 mb-4">💳 Ingresa tus datos de pago:</p>
              <Elements stripe={stripePromise}>
                <PaymentForm videoId={id} price={video.price} onPaymentSuccess={() => setHasPaid(true)} />
              </Elements>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12">
      <div className="max-w-6xl mx-auto px-4">
        <button onClick={() => navigate('/')} className="mb-6 text-purple-400 hover:text-purple-300 font-bold">
          ← Volver a Videos
        </button>
        
        <video
          controls
          className="w-full rounded-2xl mb-8 bg-black shadow-2xl"
          src={video.videoUrl}
        />
        
        <div className="card p-8 rounded-2xl">
          <h1 className="text-4xl font-black gradient-text mb-4">{video.title}</h1>
          <p className="text-gray-300 text-lg mb-4">{video.description}</p>
          <div className="flex gap-4 text-sm text-gray-400">
            <span>👁️ Vistas: {video.views}</span>
            <span>⏱️ Duración: {Math.floor(video.duration / 60)}m {(video.duration % 60).toString().padStart(2, '0')}s</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
