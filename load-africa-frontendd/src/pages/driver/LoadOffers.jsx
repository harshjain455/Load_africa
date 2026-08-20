import React, { useState, useEffect } from 'react';
import { 
  MapPin, Package, Clock, AlertCircle, Loader2, CheckCircle2, 
  XCircle, ArrowRight, Wallet, ShieldAlert
} from 'lucide-react';
import { driverService } from '../../services/driverService';

export default function LoadOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchOffers();
    const interval = setInterval(fetchOffers, 10000); // Polling for new offers every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await driverService.getPendingOffers();
      if (res.success) {
        setOffers(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch offers:', err);
      if (offers.length === 0) setError('Failed to load offers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (offerId) => {
    try {
      setActionLoading(offerId);
      const res = await driverService.acceptOffer(offerId);
      if (res.success) {
        alert('Load Accepted Successfully! Waiting for customer payment.');
        fetchOffers();
      } else {
        alert(res.message || 'Failed to accept load');
      }
    } catch (err) {
      alert('Error accepting load offer');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (offerId) => {
    if (!window.confirm('Are you sure you want to reject this load offer? The system will assign it to another driver.')) return;
    try {
      setActionLoading(offerId);
      const res = await driverService.rejectOffer(offerId);
      if (res.success) {
        fetchOffers();
      } else {
        alert(res.message || 'Failed to reject load');
      }
    } catch (err) {
      alert('Error rejecting load offer');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading && offers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-amber-500">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Checking for new load offers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Load Offers</h1>
          <p className="text-sm font-semibold text-slate-500">Review and respond to matched load assignments.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {offers.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center shadow-sm">
          <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">You're all caught up!</h3>
          <p className="text-slate-500 max-w-sm mx-auto font-medium">
            No matching load offers are currently available. If you're online, we'll notify you automatically when a suitable load matches your vehicle.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {offers.map((offer) => {
            const booking = offer.booking;
            // Assuming 85% split for driver, you could calculate exact if quotes are available
            const estimatedPayout = booking.quotes?.length > 0 
              ? (Number(booking.quotes[0].grand_total) * 0.85).toFixed(2)
              : 'Calculating...';

            return (
              <div key={offer.id} className="bg-white rounded-3xl border border-amber-200 shadow-md shadow-amber-500/5 overflow-hidden">
                <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-xs font-black text-amber-800 uppercase tracking-wider">New Load Offer</span>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    Received: {new Date(offer.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 space-y-6">
                      <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-slate-100">
                        <div className="relative flex items-start gap-4">
                          <div className="absolute left-0 mt-1 h-6 w-6 rounded-full bg-white border-4 border-slate-200 z-10" />
                          <div className="pl-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Pickup Location</p>
                            <p className="text-sm font-bold text-slate-900">{booking.pickup_address}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              {booking.pickup_date ? new Date(booking.pickup_date).toLocaleDateString() : 'ASAP'}
                            </p>
                          </div>
                        </div>
                        <div className="relative flex items-start gap-4">
                          <div className="absolute left-0 mt-1 h-6 w-6 rounded-full bg-amber-500 border-4 border-amber-100 z-10" />
                          <div className="pl-10">
                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-wider mb-0.5">Delivery Location</p>
                            <p className="text-sm font-bold text-slate-900">{booking.delivery_address}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              {booking.distance_km ? `${Number(booking.distance_km).toFixed(1)} km trip distance` : 'Pending calculation'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-2 mb-1 text-slate-400">
                            <Package className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase">Cargo Details</span>
                          </div>
                          <p className="text-sm font-bold text-slate-900">{booking.cargo_name}</p>
                          <p className="text-xs text-slate-500">{booking.weight} kg</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-2 mb-1 text-slate-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase">Requirement</span>
                          </div>
                          <p className="text-sm font-bold text-slate-900">{booking.requested_vehicle || 'Standard'}</p>
                          <p className="text-xs text-slate-500">Specific vehicle match</p>
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-72 flex flex-col justify-between">
                      <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 mb-6 lg:mb-0">
                        <div className="flex items-center gap-2 text-emerald-600 mb-2">
                          <Wallet className="w-5 h-5" />
                          <span className="text-[10px] font-black uppercase tracking-wider">Estimated Earnings</span>
                        </div>
                        <p className="text-3xl font-black text-emerald-700">
                          {estimatedPayout !== 'Calculating...' ? `R ${estimatedPayout}` : 'TBD'}
                        </p>
                        <p className="text-[10px] text-emerald-600/80 mt-2 leading-relaxed">
                          Final payout is processed to your wallet upon successful delivery and POD verification.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => handleAccept(offer.id)}
                          disabled={actionLoading === offer.id}
                          className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {actionLoading === offer.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                          Accept Load Offer
                        </button>
                        <button
                          onClick={() => handleReject(offer.id)}
                          disabled={actionLoading === offer.id}
                          className="w-full py-3 px-4 bg-white border-2 border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject Offer
                        </button>
                        <div className="text-center flex items-center justify-center gap-1.5 text-slate-400 mt-2">
                          <ShieldAlert className="w-3 h-3" />
                          <span className="text-[10px] font-medium">Accepting reserves you for this load</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
