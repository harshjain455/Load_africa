import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, MapPin, ChevronRight } from 'lucide-react';
import { Card, Button, Modal } from '../../components/ui';
import { fleetService } from '../../services/fleetService';

export default function FleetRequests() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [actionModal, setActionModal] = useState({ open: false, type: '', load: null });
  const [assignModal, setAssignModal] = useState({ vehicleId: '', driverId: '' });
  const [rejectReason, setRejectReason] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fleetService.getDashboard();
      if (res.success && res.data) {
        setVehicles(res.data.vehicles || []);
        setDrivers(res.data.drivers || []);
      }
      const resLoads = await fleetService.getLoads();
      if (resLoads.success) {
        setBookings(resLoads.data || []);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAcceptRequest = async (e) => {
    e.preventDefault();
    if (!assignModal.vehicleId || !assignModal.driverId) {
      showToast('Please select both a vehicle and a driver.', 'error');
      return;
    }

    const assignment = actionModal.load;
    try {
      const res = await fleetService.dispatchLoad(assignment.booking_id, assignModal.driverId, assignModal.vehicleId);
      if (res.success) {
        setActionModal({ open: false, type: '', load: null });
        setAssignModal({ vehicleId: '', driverId: '' });
        showToast('Booking accepted! Vehicle & Driver assigned.');
        await fetchData();
      } else {
        showToast(res.message || 'Failed to assign booking', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to assign booking', 'error');
    }
  };

  const handleRejectRequest = () => {
    setActionModal({ open: false, type: '', load: null });
    setRejectReason('');
    showToast('Booking request rejected.', 'error');
  };

  if (loading) return <div className="p-10 text-center text-slate-500 font-medium">Loading requests...</div>;

  const pendingBookings = bookings.filter(b => b.status === 'PENDING');

  return (
    <div className="space-y-6 relative">
      {toast.show && (
        <div className={`absolute top-0 right-0 p-3 rounded shadow-md text-sm font-bold z-50 ${toast.type === 'error' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
          {toast.message}
        </div>
      )}
      <div>
        <h1 className="text-xl font-black text-slate-900">Booking Requests</h1>
        <p className="text-xs text-slate-500 font-medium">Review and assign your fleet to pending requests.</p>
      </div>

      {pendingBookings.length > 0 ? (
        <div className="grid gap-4">
          {pendingBookings.map((booking) => (
            <Card key={booking.id} className="p-5 border-l-4 border-l-amber-500">
              <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                <div className="flex-1 space-y-4 w-full">
                  
                  {/* Header Row */}
                  <div className="flex justify-between items-start w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-mono">ID: {booking.id?.slice(0, 8)}…</span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider">NEW REQUEST</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Date Received</span>
                      <span className="text-xs font-semibold text-slate-700">{new Date(booking.created_at || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Route & Logistics Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="space-y-3">
                      <div>
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1"><MapPin className="h-3 w-3 text-amber-500" /> Pickup</span>
                        <p className="text-sm font-semibold text-slate-800 line-clamp-2">{booking.booking?.pickup_address}</p>
                      </div>
                      <div>
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1"><MapPin className="h-3 w-3 text-emerald-500" /> Delivery</span>
                        <p className="text-sm font-semibold text-slate-800 line-clamp-2">{booking.booking?.delivery_address}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 lg:border-l lg:border-slate-200 lg:pl-4">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Cargo Details</span>
                        <p className="text-sm font-semibold text-slate-800">{booking.booking?.cargo_name} <span className="text-slate-500 font-normal">({booking.booking?.cargo_weight} Tons)</span></p>
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Required Vehicle</span>
                        <p className="text-sm font-semibold text-slate-800">{booking.booking?.required_vehicle_type || 'Any Suitable Vehicle'}</p>
                      </div>
                    </div>
                  </div>

                </div>
                
                <div className="flex flex-col gap-2 shrink-0 md:min-w-[140px]">
                  <Button className="bg-emerald-600 hover:bg-emerald-500 text-white w-full py-6 shadow-md shadow-emerald-600/20" onClick={() => setActionModal({ open: true, type: 'accept', load: booking })}>
                    Accept & Assign
                  </Button>
                  <Button variant="outline" className="w-full text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50" onClick={() => setActionModal({ open: true, type: 'reject', load: booking })}>
                    Decline Request
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white border border-slate-200 rounded-3xl">
          <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No Pending Requests</h3>
          <p className="text-sm text-slate-500 mt-2">You don't have any pending booking requests right now.</p>
        </div>
      )}

      {/* Accept / Assign Modal */}
      <Modal open={actionModal.open && actionModal.type === 'accept'} onClose={() => setActionModal({ open: false, type: '', load: null })} title="Assign Vehicle & Driver">
        <form onSubmit={handleAcceptRequest} className="space-y-5">
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Booking</p>
            <p className="text-xs text-slate-500">{actionModal.load?.booking?.pickup_address?.split(',')[0]} → {actionModal.load?.booking?.delivery_address?.split(',')[0]}</p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Select Verified & Available Vehicle</label>
            <select
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 outline-none"
              value={assignModal.vehicleId}
              onChange={(e) => setAssignModal({...assignModal, vehicleId: e.target.value})}
            >
              <option value="">-- Choose Vehicle --</option>
              {/* Only verified/available vehicles can be assigned */}
              {vehicles.filter(v => v.status === 'AVAILABLE').map(v => (
                <option key={v.id} value={v.id}>{v.registration_number} - {v.vehicle_type} ({v.capacity}T)</option>
              ))}
            </select>
            {vehicles.filter(v => v.status === 'AVAILABLE').length === 0 && (
              <p className="text-xs text-rose-500 font-bold mt-1">No verified and available vehicles.</p>
            )}
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Select Approved & Available Driver</label>
            <select
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 outline-none"
              value={assignModal.driverId}
              onChange={(e) => setAssignModal({...assignModal, driverId: e.target.value})}
            >
              <option value="">-- Choose Driver --</option>
              {/* Only ACTIVE user status (which implies approved) and AVAILABLE driver status */}
              {drivers.filter(d => d.status === 'AVAILABLE' && d.user?.status === 'ACTIVE').map(d => (
                <option key={d.id} value={d.id}>{d.user?.first_name} {d.user?.last_name} ({d.license})</option>
              ))}
            </select>
            {drivers.filter(d => d.status === 'AVAILABLE' && d.user?.status === 'ACTIVE').length === 0 && (
              <p className="text-xs text-rose-500 font-bold mt-1">No approved and available drivers.</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setActionModal({ open: false, type: '', load: null })}>Cancel</Button>
            <Button type="submit" disabled={!assignModal.vehicleId || !assignModal.driverId} className="bg-emerald-600 hover:bg-emerald-500 text-white">Confirm Assignment</Button>
          </div>
        </form>
      </Modal>

      {/* Reject Modal */}
      <Modal open={actionModal.open && actionModal.type === 'reject'} onClose={() => setActionModal({ open: false, type: '', load: null })} title="Reject Booking Request">
        <div className="space-y-5">
          <p className="text-sm text-slate-600">Are you sure you want to reject this booking request?</p>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Reason (Optional)</label>
            <textarea
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500"
              rows="3"
              placeholder="e.g. No capacity on this date..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            ></textarea>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setActionModal({ open: false, type: '', load: null })}>Cancel</Button>
            <Button className="bg-rose-600 hover:bg-rose-500 text-white" onClick={handleRejectRequest}>Confirm Reject</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
