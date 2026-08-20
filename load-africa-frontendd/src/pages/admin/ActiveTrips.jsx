import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Map, Loader2, Compass, Truck } from 'lucide-react';

export default function ActiveTrips() {
  const [activeTrips, setActiveTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveTrips();
    const interval = setInterval(fetchActiveTrips, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchActiveTrips = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/admin/active-trips', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await response.json();
      if (res.success) {
        setActiveTrips(res.data);
      }
    } catch (error) {
      console.error('Error fetching active trips', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Active Trips & Tracking</h1>
        <p className="text-sm font-semibold text-slate-500">Live monitoring of all IN_TRANSIT loads</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl overflow-hidden shadow-sm relative min-h-[500px]">
          <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=-29.0,24.0&zoom=5&size=800x600&maptype=roadmap&style=feature:all|element:labels.text.fill|color:0x9ca3af&style=feature:all|element:labels.text.stroke|color:0x111827&style=feature:water|color:0x1f2937&style=feature:landscape|color:0x111827&style=feature:road|color:0x374151&style=feature:poi|visibility:off')] bg-cover bg-center opacity-80 mix-blend-screen" />
          
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 bg-slate-900/60 backdrop-blur-sm z-10">
             <Map className="h-12 w-12 text-slate-500 mb-4 animate-pulse" />
             <h3 className="text-lg font-bold text-white">Live Tracking Hub</h3>
             <p className="text-slate-400 text-sm mt-2 max-w-md">
               Google Maps API integration for live DOT tracking is being initialized. For now, you can monitor the status of all active trips in the panel.
             </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <Navigation className="w-4 h-4 text-amber-500" /> Active Roster
            </h3>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">{activeTrips.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading && activeTrips.length === 0 ? (
              <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 text-amber-500 animate-spin" /></div>
            ) : activeTrips.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm font-medium">No active trips currently.</div>
            ) : (
              activeTrips.map(trip => (
                <div key={trip.id} className="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-black text-slate-900">#{trip.id.split('-')[0].toUpperCase()}</span>
                    <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded uppercase tracking-wider">
                      {trip.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="space-y-1 mb-3">
                    <p className="text-xs text-slate-600 flex items-center gap-1.5 font-medium truncate">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" /> {trip.pickup_address}
                    </p>
                    <p className="text-xs text-slate-600 flex items-center gap-1.5 font-medium truncate">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {trip.delivery_address}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-bold text-slate-700">
                      {trip.assignments?.[0]?.driver?.user?.first_name} {trip.assignments?.[0]?.driver?.user?.last_name}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
