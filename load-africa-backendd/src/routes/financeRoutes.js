const express = require('express');
const { verifyPODAndReleasePayment, withdrawEarnings, getWallet, processPayment, stripeWebhook, approveWithdrawal, simulateStripeWebhook } = require('../controllers/financeController');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/verify-pod/:bookingId', verifyPODAndReleasePayment);
router.post('/withdraw', requireAuth, withdrawEarnings);
router.get('/wallet', requireAuth, getWallet);

// Payment Checkout Endpoint
router.post('/process-payment', requireAuth, processPayment);
router.post('/simulate-webhook', requireAuth, simulateStripeWebhook);

// Stripe Webhook (MUST use raw body parser)
router.post('/webhook/stripe', express.raw({type: 'application/json'}), stripeWebhook);

// Admin approve withdrawal
router.post('/withdraw/approve', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), approveWithdrawal);

module.exports = router;
