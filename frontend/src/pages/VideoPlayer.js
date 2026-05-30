import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import VideoEmbed from '../components/VideoEmbed';
import ShareButtons from '../components/ShareButtons';

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

      // Create payment intent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ videoId, amount: price })
      });

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
      setError('Payment error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement className="mb-4" />
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded font-bold"
      >
        {loading ? 'Processing...' : `Pay $${price}`}
      </button>
    </form>
  );
}

function VideoPlayerContent({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`/api/videos/${id}`);
        const data = await response.json();
        setVideo(data);
      } catch (err) {
        console.error('Error fetching video:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-400">Loading video...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center py-12">
        <p className="text-2xl mb-4">🎬 Video not found</p>
        <button onClick={() => navigate('/')} className="bg-purple-600 px-4 py-2 rounded">
          Go Home
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-800 p-8 rounded-lg max-w-md mx-auto">
          <p className="text-3xl mb-4">🔐</p>
          <p className="text-xl mb-4">Please login to watch videos</p>
          <button 
            onClick={() => navigate('/login')} 
            className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // Si el video es externo (YouTube, TikTok, etc.), se muestra directamente
  const isExternalVideo = video.sourceType === 'external' || 
    (video.videoUrl && (
      video.videoUrl.includes('youtube.com') || 
      video.videoUrl.includes('youtu.be') ||
      video.videoUrl.includes('tiktok.com') ||
      video.videoUrl.includes('facebook.com') ||
      video.videoUrl.includes('vimeo.com')
    ));

  // Videos externos son gratis por ahora
  const canWatch = hasPaid || user.isPremium || isExternalVideo;

  if (!canWatch && video.price > 0) {
    return (
      <div className="bg-gray-800 p-8 rounded-lg max-w-md mx-auto mt-12">
        <div className="text-center mb-6">
          {video.thumbnail && (
            <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover rounded-lg mb-4" />
          )}
          <h2 className="text-2xl font-bold mb-2">{video.title}</h2>
          <p className="text-gray-300">{video.description}</p>
        </div>
        
        {/* Badge de plataforma si es externo */}
        {isExternalVideo && (
          <div className="mb-4 p-3 bg-purple-600/20 rounded-lg text-center">
            <span className="text-purple-400">📺 Este video es de plataforma externa</span>
          </div>
        )}
        
        <div className="text-center mb-6">
          <p className="text-gray-400 text-sm mb-2">Precio</p>
          <p className="text-4xl font-bold text-green-400">${video.price}</p>
        </div>

        <div className="bg-gray-700 p-4 rounded">
          <p className="text-sm font-medium mb-4">💳 Ingresa tus datos de tarjeta:</p>
          <Elements stripe={loadStripe(process.env.REACT_APP_STRIPE_KEY)}>
            <PaymentForm videoId={id} price={video.price} onPaymentSuccess={() => setHasPaid(true)} />
          </Elements>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Video Embed o Video nativo */}
        {isExternalVideo ? (
          <VideoEmbed url={video.videoUrl} title={video.title} />
        ) : (
          <video
            controls
            className="w-full rounded-lg mb-8"
            src={video.videoUrl}
          />
        )}

        {/* Info del video */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{video.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-gray-400">
              <span>👁️ {video.views || 0} views</span>
              {video.duration && (
                <span>⏱️ {Math.floor(video.duration / 60)}m {video.duration % 60}s</span>
              )}
              {video.sourceType && (
                <span className="px-3 py-1 bg-purple-600/30 rounded-full text-sm">
                  {video.sourceType}
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-gray-300 mb-6">{video.description}</p>

        {/* Compartir */}
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-lg font-semibold text-white mb-3">📤 Compartir video</h3>
          <ShareButtons 
            url={window.location.href} 
            title={video.title} 
          />
        </div>

        {/* Info adicional */}
        <div className="mt-8 bg-gray-800/50 rounded-lg p-4">
          <h4 className="text-white font-medium mb-2">ℹ️ Información</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Plataforma:</span>
              <span className="text-white ml-2">{video.sourceType || 'Direct'}</span>
            </div>
            <div>
              <span className="text-gray-400">Precio:</span>
              <span className="text-green-400 ml-2">${video.price || 0}</span>
            </div>
            <div>
              <span className="text-gray-400">Usuario:</span>
              <span className="text-white ml-2">{user.name}</span>
            </div>
            <div>
              <span className="text-gray-400">Miembro:</span>
              <span className="text-purple-400 ml-2">
                {user.isPremium ? '⭐ Premium' : 'Free'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoPlayer({ user }) {
  return <VideoPlayerContent user={user} />;
}

export default VideoPlayer;
