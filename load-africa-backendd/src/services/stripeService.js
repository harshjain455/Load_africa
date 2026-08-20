const Stripe = require('stripe');

// Initialize stripe with the secret key, or a mock if missing
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2023-10-16',
});

const stripeService = {
  createPaymentIntent: async (amount, currency = 'zar', metadata = {}) => {
    // Fallback for mock testing without real Stripe keys
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('mock')) {
      return {
        success: true,
        clientSecret: 'mock_client_secret_for_simulation',
        id: `pi_mock_${Math.floor(Math.random() * 1000000)}`
      };
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe uses cents
        currency: currency.toLowerCase(),
        metadata,
      });
      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id
      };
    } catch (error) {
      console.error('Stripe Payment Intent Error:', error);
      return { success: false, message: error.message };
    }
  },

  verifyWebhookSignature: (payload, signature) => {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    try {
      return stripe.webhooks.constructEvent(payload, signature, secret);
    } catch (error) {
      throw error;
    }
  }
};

module.exports = stripeService;
