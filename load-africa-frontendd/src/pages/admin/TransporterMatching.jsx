import React, { useState, useEffect } from 'react';
import { Target, Search, AlertCircle, RefreshCcw, Truck, MapPin, Map } from 'lucide-react';

export default function TransporterMatching() {
  const [matchingData, setMatchingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatchingData();
    const interval = setInterval(fetchMatchingData, 10000); // Live poll every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchMatchingData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/admin/matching-data', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await response.json();
      if (res.success) {
        setMatchingData(res.data);
      }
    } catch (error) {
      console.error('Error fetching matching data', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Transporter Matching</h1>
          <p className="text-sm font-semibold text-slate-500">Live monitor of the automatic driver assignment engine</p>
        </div>
        <button onClick={fetchMatchingData} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg">
          <RefreshCcw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading && matchingData.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <RefreshCcw className="h-8 w-8 text-amber-500 animate-spin" />
        </div>
      ) : matchingData.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
          <Target className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900">All bookings are matched</h3>
          <p className="text-slate-500 text-sm mt-2">No bookings are currently searching for transporters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {matchingData.map(booking => (
            <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-wrap justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-black text-slate-900">Booking #{booking.id.split('-')[0].toUpperCase()}</h3>
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wide
                      ${booking.status === 'TRANSPORTER_SEARCHING' ? 'bg-amber-100 text-amber-800' : 
                        booking.status === 'MANUAL_ASSIGNMENT_REQUIRED' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`
                    }>
                      {booking.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-500 mt-1">
                    {booking.customer?.user?.first_name} {booking.customer?.user?.last_name} • {booking.cargo_name} ({booking.weight} kg)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Required Vehicle</p>
                  <p className="font-black text-slate-900">{booking.vehicle_type}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                <div className="p-5 space-y-4 bg-slate-50/50">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Map className="w-4 h-4" /> Route Details
                  </h4>
                  <div className="relative pl-6 space-y-4 before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-slate-200">
                    <div className="relative">
                      <div className="absolute -left-6 w-3 h-3 bg-white border-2 border-slate-300 rounded-full z-10" />
                      <p className="text-sm font-bold text-slate-900">{booking.pickup_address}</p>
                      <p className="text-xs text-slate-500">Pickup</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-6 w-3 h-3 bg-amber-500 ring-4 ring-amber-500/20 rounded-full z-10" />
                      <p className="text-sm font-bold text-slate-900">{booking.delivery_address}</p>
                      <p className="text-xs text-slate-500">Delivery</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Truck className="w-4 h-4" /> Driver Matching Engine
                  </h4>
                  
                  {booking.status === 'MANUAL_ASSIGNMENT_REQUIRED' ? (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-800 text-sm">
                      <p className="font-bold mb-1 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Automatic Matching Failed</p>
                      <p>No suitable or available drivers accepted the load. Broker or Admin manual assignment is now required.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {booking.load_offers?.length > 0 ? (
                        booking.load_offers.map(offer => (
                          <div key={offer.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg bg-slate-50">
                            <div>
                              <p className="text-sm font-bold text-slate-900">{offer.driver?.user?.first_name} {offer.driver?.user?.last_name}</p>
                              <p className="text-xs text-slate-500">Distance: {offer.distance_km || '?'} km away</p>
                            </div>
                            <div>
                              <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-wide
                                ${offer.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 
                                  offer.status === 'REJECTED' || offer.status === 'EXPIRED' ? 'bg-red-100 text-red-800' : 
                                  offer.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`
                              }>
                                {offer.status}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-slate-500 italic p-4 text-center">
                          Scanning area for eligible {booking.vehicle_type} transporters...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
