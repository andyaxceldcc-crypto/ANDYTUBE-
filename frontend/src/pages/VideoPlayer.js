import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

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

        const paymentData = await paymentResponse.json();
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
    fetchVideo();
  }, [id]);

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

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!video) {
    return <div className="text-center py-12">Video not found</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p>Please login to watch videos</p>
        <button onClick={() => navigate('/login')} className="mt-4 bg-blue-600 px-4 py-2 rounded">
          Login
        </button>
      </div>
    );
  }

  if (!hasPaid && !user.isPremium) {
    return (
      <div className="bg-gray-800 p-8 rounded-lg max-w-md mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-4">{video.title}</h2>
        <p className="text-gray-300 mb-6">{video.description}</p>
        <p className="text-3xl font-bold text-green-400 mb-6">${video.price}</p>

        <div className="bg-gray-700 p-4 rounded">
          <p className="text-sm font-medium mb-4">Enter your card details to watch:</p>
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
        <video
          controls
          className="w-full rounded-lg mb-8"
          src={video.videoUrl}
        />
        <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
        <p className="text-gray-300 mb-4">{video.description}</p>
        <p className="text-sm text-gray-400">Views: {video.views} | Duration: {Math.floor(video.duration / 60)}m {video.duration % 60}s</p>
      </div>
    </div>
  );
}

function VideoPlayer({ user }) {
  return <VideoPlayerContent user={user} />;
}

export default VideoPlayer;
