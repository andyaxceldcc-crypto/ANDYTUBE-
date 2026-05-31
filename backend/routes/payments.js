const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_default');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Create payment intent for video
router.post('/create-intent', auth, async (req, res) => {
  try {
    const { videoId, amount } = req.body;

    if (!videoId || !amount) {
      return res.status(400).json({ error: 'videoId y amount son requeridos' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        videoId,
        userId: req.userId
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (err) {
    console.error('Payment intent error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Handle successful payment
router.post('/payment-success', auth, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'paymentIntentId requerido' });
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update user premium status
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      user.isPremium = true;
      user.premiumExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      await user.save();

      res.json({
        success: true,
        msg: '✅ ¡Pago exitoso! Acceso otorgado.'
      });
    } else {
      res.status(400).json({ msg: 'Pago no completado' });
    }
  } catch (err) {
    console.error('Payment success error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get payment history
router.get('/history', auth, async (req, res) => {
  try {
    const charges = await stripe.charges.list({
      limit: 100
    });

    res.json(charges.data);
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
