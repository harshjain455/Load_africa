import React, { useState, useEffect } from 'react';
import { Truck } from 'lucide-react';
import { Card } from '../../components/ui';
import { fleetService } from '../../services/fleetService';

export default function FleetActiveTrips() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resLoads = await fleetService.getLoads();
      if (resLoads.success) {
        setBookings(resLoads.data || []);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (loading) return <div className="p-10 text-center text-slate-500 font-medium">Loading active trips...</div>;

  const activeTrips = bookings.filter(b => b.status === 'ACTIVE' && ['DRIVER_ASSIGNED', 'DRIVER_EN_ROUTE', 'ARRIVED_PICKUP', 'LOADING', 'PICKED_UP', 'IN_TRANSIT'].includes(b.booking?.status));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-900">Active Trips</h1>
        <p className="text-xs text-slate-500 font-medium">Monitor your fleet's active and ongoing deliveries.</p>
      </div>

      <Card>
        <div className="space-y-3">
          {activeTrips.map(trip => {
            const vehicle = trip.vehicle;
            const driver = trip.driver;
            const load = trip.booking;
            if (!load) return null;
            return (
              <div key={trip.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Truck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{vehicle?.registration_number || 'Unknown Vehicle'} <span className="text-slate-400 font-normal ml-2">({vehicle?.vehicle_type || 'Type'})</span></p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{load.pickup_address?.split(',')[0]} → {load.delivery_address?.split(',')[0]}</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">Booking: {trip.booking_id?.slice(0,8)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700">
                    {load.status?.replace(/_/g, ' ')}
                  </span>
                  <p className="text-xs text-slate-600 mt-2 font-bold">{driver?.user ? `${driver.user.first_name} ${driver.user.last_name || ''}` : 'No Driver'}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider font-bold">{driver?.user?.phone || 'No Phone'}</p>
                </div>
              </div>
            );
          })}
          {activeTrips.length === 0 && (
            <div className="p-10 text-center text-slate-500 text-sm bg-slate-50 rounded-xl border border-slate-100">
              <Truck className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-700">No Active Trips</p>
              <p className="text-xs text-slate-400 mt-1">Your fleet currently has no trips in progress.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
