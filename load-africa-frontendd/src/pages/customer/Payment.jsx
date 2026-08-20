import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, ArrowLeft, Loader2, CheckCircle2, Shield, Calendar, Truck, RefreshCw } from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import api from '../../services/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe Promise
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_mock');

const CheckoutForm = ({ invoice, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message);
      setProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/customer/booking-history`,
      },
      redirect: "if_required"
    });

    if (error) {
      setError(error.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && <div className="text-red-500 text-xs font-bold bg-red-50 p-2 rounded">{error}</div>}
      <button 
        type="submit" 
        disabled={!stripe || processing}
        className="w-full py-3 bg-[#f4a236] hover:bg-amber-500 text-white text-xs font-black rounded-xl uppercase tracking-wider transition-all shadow-md shadow-amber-500/10 cursor-pointer disabled:opacity-50"
      >
        {processing ? 'Processing...' : `Pay ZAR ${parseFloat(invoice.total_amount).toFixed(2)}`}
      </button>
    </form>
  );
};

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getBookingDetails(id);
      if (res.success) {
        setBooking(res.data);
      } else {
        setError(res.message || 'Failed to fetch booking details');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error connecting to database');
    } finally {
      setLoading(false);
    }
  };

  const handleInitializePayment = async () => {
    const invoice = booking?.invoices?.[0] || booking?.invoices?.find(inv => inv.status === 'PENDING');
    if (!invoice) {
      alert("No active invoice found for this booking.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/finance/process-payment', { invoiceId: invoice.id });
      if (response.data.success && response.data.clientSecret) {
        setClientSecret(response.data.clientSecret);
        setTransactionId(response.data.transactionId);
      } else {
        setError(response.data.message || 'Payment initialization failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Network error during payment initialization');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-2 text-slate-500 font-semibold text-xs tracking-wider uppercase">
        <RefreshCw className="h-6 w-6 animate-spin text-amber-500" /> Fetching Details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-red-50 border border-red-100 rounded-2xl text-center space-y-4 shadow-sm">
        <div className="text-red-500 font-bold text-sm">{error}</div>
        <button onClick={() => navigate('/customer/booking-history')} className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl">
          Back to Bookings
        </button>
      </div>
    );
  }

  const invoice = booking?.invoices?.[0] || booking?.invoices?.find(inv => inv.status === 'PENDING');

  if (paymentSuccess) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-6 shadow-xl animate-fadeIn">
        <div className="h-16 w-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Payment Successful!</h2>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            Your payment for booking <strong className="text-slate-800 font-mono">#{id.slice(0, 8)}</strong> has been processed securely. Your load is now being broadcasted.
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs font-semibold text-slate-700 space-y-2.5">
          <div className="flex justify-between">
            <span className="text-slate-450 font-bold">Transaction ID:</span>
            <span className="font-mono text-slate-900">{transactionId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-450 font-bold">Amount Paid:</span>
            <span className="text-slate-900 font-black">R {parseFloat(invoice?.total_amount || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        <button onClick={() => navigate('/customer/booking-history')} className="w-full py-3 bg-[#f4a236] hover:bg-amber-500 text-white text-xs font-black rounded-xl uppercase tracking-wider transition-all shadow-md shadow-amber-500/10 cursor-pointer">
          View Bookings History
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-10 space-y-6 text-left animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3.5">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200">
          <ArrowLeft className="h-4 w-4 text-slate-600" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Secure Checkout</h2>
          <p className="text-xs text-slate-400 mt-0.5">Powered by Stripe</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Left Column: Invoice Details */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">Booking Summary</h3>
            <div className="space-y-4 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-slate-400" />
                <span>Cargo: <strong className="text-slate-800">{booking.cargo_name}</strong> ({booking.weight} kg)</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>Requested Vehicle: <strong className="text-slate-800">{booking.requested_vehicle || 'Any Vehicle'}</strong></span>
              </div>
              <div className="border-t border-slate-100 pt-3 relative space-y-3">
                <div className="absolute left-2.5 top-6 bottom-4 w-0.5 bg-slate-200" />
                <div className="flex items-start gap-3 relative">
                  <div className="h-5 w-5 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center shrink-0 z-10"><div className="h-1.5 w-1.5 bg-amber-500 rounded-full" /></div>
                  <div><p className="text-[10px] text-slate-400 uppercase font-black">Pickup Location</p><p className="text-slate-800 text-sm mt-0.5 leading-snug">{booking.pickup_address}</p></div>
                </div>
                <div className="flex items-start gap-3 relative">
                  <div className="h-5 w-5 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center shrink-0 z-10"><div className="h-1.5 w-1.5 bg-emerald-500 rounded-full" /></div>
                  <div><p className="text-[10px] text-slate-400 uppercase font-black">Delivery Location</p><p className="text-slate-800 text-sm mt-0.5 leading-snug">{booking.delivery_address}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Payment & Stripe */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-3">Amount Due</h3>
              <div className="flex items-end justify-between py-2">
                <span className="text-3xl font-black text-[#f4a236]">ZAR {parseFloat(invoice?.total_amount || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pt-3 border-t border-slate-800 flex items-center gap-1.5">
                <Shield className="h-3 w-3 text-emerald-400" /> Secure SSL Connection
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            {!clientSecret ? (
              <button
                onClick={handleInitializePayment}
                className="w-full py-3 bg-[#f4a236] hover:bg-amber-500 text-white text-xs font-black rounded-xl uppercase tracking-wider transition-all shadow-md shadow-amber-500/10 cursor-pointer"
              >
                Proceed to Checkout
              </button>
            ) : clientSecret === 'mock_client_secret_for_simulation' ? (
              <div className="space-y-4 text-center">
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-xs font-semibold">
                  <p className="font-black mb-1 text-amber-900 uppercase">Test Mode Active</p>
                  <p>You are using mock API keys. This button simulates a successful payment from the gateway.</p>
                </div>
                <button
                  onClick={async () => {
                    try {
                      setLoading(true);
                      await api.post('/finance/simulate-webhook', { 
                        invoiceId: invoice.id, 
                        bookingId: invoice.booking_id,
                        transactionId
                      });
                      setPaymentSuccess(true);
                    } catch (err) {
                      setError('Failed to simulate payment webhook.');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-black rounded-xl uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  Simulate Successful Payment
                </button>
              </div>
            ) : (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm 
                  invoice={invoice} 
                  onSuccess={(txnId) => {
                    setTransactionId(txnId);
                    setPaymentSuccess(true);
                  }}
                />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
