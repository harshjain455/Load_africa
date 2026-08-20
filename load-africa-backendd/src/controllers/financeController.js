const { prisma } = require('../config/db');

// Helper for dev, assuming user id is driver id for now.
const getDriverId = async (req) => {
  if (req.user?.driver?.id) return req.user.driver.id;
  const driver = await prisma.driver.findFirst();
  return driver ? driver.id : null;
};

const verifyPODAndReleasePayment = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        assignments: {
          include: { driver: { include: { user: true } } }
        },
        quotes: true
      }
    });

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.status !== 'POD_UPLOADED') {
      return res.status(400).json({ success: false, message: 'Booking is not awaiting POD verification' });
    }

    const assignment = booking.assignments[0];
    if (!assignment) return res.status(400).json({ success: false, message: 'No driver assigned' });

    // Fetch the PAID invoice
    const invoice = await prisma.invoice.findFirst({
      where: { booking_id: bookingId, status: 'PAID' }
    });

    if (!invoice) return res.status(400).json({ success: false, message: 'No paid invoice found for this booking' });

    const totalAmount = Number(invoice.total_amount);
    
    // Strict 100% cap check
    // In production, these should come from configurable `PricingConfig` or `SystemSetting`
    const fleetPercentage = 0.90;
    const brokerPercentage = assignment.broker_id ? 0.05 : 0.00;
    const platformPercentage = 0.10 - brokerPercentage; // Platform yields its cut to broker
    
    if (fleetPercentage + brokerPercentage + platformPercentage > 1.0) {
      throw new Error("Configuration Error: Payout percentages exceed 100%.");
    }

    const providerAmount = totalAmount * fleetPercentage;
    const platformAmount = totalAmount * platformPercentage;
    const brokerAmount = totalAmount * brokerPercentage;
    
    // Admin Wallet logic
    const adminUser = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } });
    if (!adminUser) throw new Error("No platform admin configured for wallets");

    await prisma.$transaction(async (tx) => {
      // 1. Mark booking as COMPLETED
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: 'COMPLETED' }
      });

      // 2. Add to Tracking
      await tx.trackingHistory.create({
        data: { booking_id: bookingId, status: 'COMPLETED', remarks: 'Admin verified POD. Booking completed and funds released.' }
      });

      // Platform Wallet Update
      let adminWallet = await tx.wallet.findFirst({ where: { user_id: adminUser.id } });
      if (!adminWallet) adminWallet = await tx.wallet.create({ data: { user_id: adminUser.id, balance: 0 } });
      await tx.wallet.update({
        where: { id: adminWallet.id },
        data: { balance: { increment: platformAmount } }
      });
      await tx.walletTransaction.create({
        data: {
          wallet_id: adminWallet.id,
          type: 'CREDIT',
          amount: platformAmount,
          description: `Platform Fee for Booking ${invoice.booking_id}`,
          reference_id: invoice.booking_id,
          status: 'COMPLETED'
        }
      });
      await tx.commission.create({
        data: {
          reference_type: 'BOOKING',
          reference_id: invoice.booking_id,
          earned_by_user_id: adminUser.id,
          commission_type: 'PLATFORM_FEE',
          amount: platformAmount,
          status: 'PAID'
        }
      });

      // Provider Wallet Update
      let providerUserId = null;
      if (assignment.driver_id && !assignment.fleet_owner_id) {
        const driver = await tx.driver.findUnique({ where: { id: assignment.driver_id } });
        providerUserId = driver.user_id;
      } else if (assignment.fleet_owner_id) {
        const fleet = await tx.fleetOwner.findUnique({ where: { id: assignment.fleet_owner_id } });
        providerUserId = fleet.user_id;
      }
      
      if (providerUserId) {
        let pWallet = await tx.wallet.findFirst({ where: { user_id: providerUserId } });
        if (!pWallet) pWallet = await tx.wallet.create({ data: { user_id: providerUserId, balance: 0 } });
        
        await tx.wallet.update({
          where: { id: pWallet.id },
          data: { balance: { increment: providerAmount } }
        });
        await tx.walletTransaction.create({
          data: {
            wallet_id: pWallet.id,
            type: 'CREDIT',
            amount: providerAmount,
            description: `Earnings for Booking ${invoice.booking_id}`,
            reference_id: invoice.booking_id,
            status: 'COMPLETED'
          }
        });
      }

      // Broker Wallet Update
      if (assignment.broker_id && brokerAmount > 0) {
        const broker = await tx.broker.findUnique({ where: { id: assignment.broker_id } });
        let bWallet = await tx.wallet.findFirst({ where: { user_id: broker.user_id } });
        if (!bWallet) bWallet = await tx.wallet.create({ data: { user_id: broker.user_id, balance: 0 } });

        await tx.wallet.update({
          where: { id: bWallet.id },
          data: { balance: { increment: brokerAmount } }
        });
        await tx.walletTransaction.create({
          data: {
            wallet_id: bWallet.id,
            type: 'CREDIT',
            amount: brokerAmount,
            description: `Broker Commission for Booking ${invoice.booking_id}`,
            reference_id: invoice.booking_id,
            status: 'COMPLETED'
          }
        });
        await tx.commission.create({
          data: {
            reference_type: 'BOOKING',
            reference_id: invoice.booking_id,
            earned_by_user_id: broker.user_id,
            commission_type: 'BROKER_FEE',
            amount: brokerAmount,
            status: 'PAID'
          }
        });
      }
    });

    res.status(200).json({ success: true, message: 'POD Verified and Escrow funds released.' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const withdrawEarnings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: 'Invalid withdrawal amount' });

    const wallet = await prisma.wallet.findFirst({ where: { user_id: userId } });
    if (!wallet || Number(wallet.balance) < amount) return res.status(400).json({ success: false, message: 'Insufficient funds' });

    await prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { 
          balance: { decrement: amount },
          pending_balance: { increment: amount }
        }
      });

      await tx.walletTransaction.create({
        data: {
          wallet_id: wallet.id,
          type: 'DEBIT',
          amount,
          description: `Withdrawal request submitted`,
          status: 'PENDING'
        }
      });
    });

    res.status(200).json({ success: true, message: 'Withdrawal request submitted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getWallet = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let wallet = await prisma.wallet.findFirst({ 
      where: { user_id: userId },
      include: { 
        transactions: { orderBy: { created_at: 'desc' } },
        user: { select: { first_name: true, last_name: true } }
      }
    });
 
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { user_id: userId, balance: 0 },
        include: { 
          transactions: true,
          user: { select: { first_name: true, last_name: true } }
        }
      });
    }
 
    res.status(200).json({ success: true, data: wallet });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

const stripeService = require('../services/stripeService');

const processPayment = async (req, res) => {
  try {
    const { invoiceId } = req.body;
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { booking: true }
    });

    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    if (invoice.status === 'PAID') return res.status(400).json({ success: false, message: 'Invoice already paid' });

    // Payment MUST only be collected if booking is PAYMENT_PENDING
    if (invoice.booking.status !== 'PAYMENT_PENDING') {
      return res.status(400).json({ success: false, message: 'Booking is not awaiting payment.' });
    }

    // Call stripe service
    const paymentIntentResult = await stripeService.createPaymentIntent(
      invoice.total_amount, 
      'zar', 
      { invoiceId: invoice.id, bookingId: invoice.booking_id }
    );

    if (!paymentIntentResult.success) {
      return res.status(500).json({ success: false, message: 'Failed to initialize payment gateway' });
    }

    // Save payment intent ID in DB
    await prisma.payment.create({
      data: {
        invoice_id: invoiceId,
        amount: invoice.total_amount,
        payment_method: 'CARD',
        transaction_id: paymentIntentResult.id,
        status: 'PENDING'
      }
    });

    res.status(200).json({ 
      success: true, 
      clientSecret: paymentIntentResult.clientSecret,
      transactionId: paymentIntentResult.id,
      invoiceId: invoice.id,
      bookingId: invoice.booking_id,
      message: 'Payment intent created successfully' 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const simulateStripeWebhook = async (req, res) => {
  try {
    const { invoiceId, bookingId, transactionId } = req.body;
    
    await prisma.$transaction(async (tx) => {
      await tx.payment.updateMany({
        where: { transaction_id: transactionId },
        data: { status: 'PAID' }
      });
      await tx.invoice.update({
        where: { id: invoiceId },
        data: { status: 'PAID' }
      });
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: 'TRANSPORTER_ASSIGNMENT' }
      });
      await tx.trackingHistory.create({
        data: { booking_id: bookingId, status: 'PAYMENT_RECEIVED', remarks: 'Customer completed payment.' }
      });

      // Find the accepted offer to create the assignment
      const acceptedOffer = await tx.loadOffer.findFirst({
        where: { booking_id: bookingId, status: 'ACCEPTED' }
      });

      if (acceptedOffer && acceptedOffer.fleet_owner_id) {
        await tx.bookingAssignment.create({
          data: {
            booking_id: bookingId,
            fleet_owner_id: acceptedOffer.fleet_owner_id,
            status: 'PENDING'
          }
        });
      }
    });

    res.json({ success: true, message: 'Mock payment verified' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripeService.verifyWebhookSignature(req.body, sig);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const { invoiceId, bookingId } = paymentIntent.metadata;

    try {
      await prisma.$transaction(async (tx) => {
        // 1. Mark Payment as PAID
        await tx.payment.updateMany({
          where: { transaction_id: paymentIntent.id },
          data: { status: 'PAID' }
        });

        // 2. Mark Invoice as PAID
        await tx.invoice.update({
          where: { id: invoiceId },
          data: { status: 'PAID' }
        });

        // 3. Mark Booking as TRANSPORTER_ASSIGNMENT
        await tx.booking.update({
          where: { id: bookingId },
          data: { status: 'TRANSPORTER_ASSIGNMENT' }
        });

        // Add to tracking
        await tx.trackingHistory.create({
          data: { booking_id: bookingId, status: 'PAYMENT_RECEIVED', remarks: 'Customer completed Stripe payment.' }
        });

        // Create assignment
        const acceptedOffer = await tx.loadOffer.findFirst({
          where: { booking_id: bookingId, status: 'ACCEPTED' }
        });

        if (acceptedOffer && acceptedOffer.fleet_owner_id) {
          await tx.bookingAssignment.create({
            data: {
              booking_id: bookingId,
              fleet_owner_id: acceptedOffer.fleet_owner_id,
              status: 'PENDING'
            }
          });
        }

        // Log Financial Activity
        await tx.activityLog.create({
          data: {
            action: 'PAYMENT_PROCESSED',
            description: `Stripe payment of ${paymentIntent.amount / 100} processed for Invoice ${invoiceId}`
          }
        });
      });
      
      // Start matching driver in background now that payment is confirmed
      const { searchAndOfferLoad } = require('../services/matchingService');
      searchAndOfferLoad(bookingId).catch(console.error);

    } catch (dbError) {
      console.error('Error updating DB on Stripe webhook:', dbError);
    }
  }

  res.json({received: true});
};

const approveWithdrawal = async (req, res) => {
  try {
    const { transactionId } = req.body;
    
    const transaction = await prisma.walletTransaction.findUnique({
      where: { id: transactionId },
      include: { wallet: true }
    });

    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });
    if (transaction.status !== 'PENDING' || transaction.type !== 'DEBIT') {
      return res.status(400).json({ success: false, message: 'Invalid transaction for approval' });
    }

    await prisma.$transaction(async (tx) => {
      // Mark transaction as COMPLETED
      await tx.walletTransaction.update({
        where: { id: transactionId },
        data: { status: 'COMPLETED' }
      });

      // Deduct from pending_balance
      await tx.wallet.update({
        where: { id: transaction.wallet_id },
        data: { pending_balance: { decrement: transaction.amount } }
      });

      // Log
      await tx.activityLog.create({
        data: {
          user_id: req.user.id,
          action: 'WITHDRAWAL_APPROVED',
          description: `Admin approved withdrawal of ${transaction.amount} for wallet ${transaction.wallet_id}`
        }
      });
    });

    res.status(200).json({ success: true, message: 'Withdrawal approved successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  verifyPODAndReleasePayment,
  processPayment,
  simulateStripeWebhook,
  stripeWebhook,
  withdrawEarnings,
  getWallet,
  approveWithdrawal
};
