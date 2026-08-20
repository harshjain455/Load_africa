import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from '../../components/ui';
import { Package, MapPin, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { plantService } from '../../services/plantService';

export default function PlantRequests() {
  const [requests, setRequests] = useState([]);
  const [machines, setMachines] = useState([]);
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);

  const [actionModal, setActionModal] = useState({ open: false, type: '', request: null });
  const [selectedMachine, setSelectedMachine] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('');
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
      const res = await plantService.getDashboard();
      if (res.success && res.data) {
        setRequests(res.data.hire_requests || []);
      }
      const resMachines = await plantService.getMachines();
      if (resMachines.success) {
        setMachines(resMachines.data.filter(m => m.status === 'AVAILABLE') || []);
      }
      const resOperators = await plantService.getOperators();
      if (resOperators.success) {
        setOperators(resOperators.data || []);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAcceptRequest = async (e) => {
    e.preventDefault();
    if (!selectedMachine) {
      showToast('Please select a machine to assign.', 'error');
      return;
    }

    try {
      const res = await plantService.acceptHireRequest(actionModal.request.id, {
        machine_id: selectedMachine,
        operator_id: selectedOperator || null
      });
      if (res.success) {
        setActionModal({ open: false, type: '', request: null });
        setSelectedMachine('');
        setSelectedOperator('');
        showToast('Hire Request accepted successfully!');
        await fetchData();
      } else {
        showToast(res.message || 'Failed to accept request', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to accept request', 'error');
    }
  };

  const handleRejectRequest = async () => {
    try {
      const res = await plantService.rejectHireRequest(actionModal.request.id);
      if (res.success) {
        setActionModal({ open: false, type: '', request: null });
        showToast('Hire request rejected.', 'success');
        await fetchData();
      } else {
        showToast(res.message || 'Failed to reject request', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to reject request', 'error');
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500 font-medium">Loading requests...</div>;

  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const activeRequests = requests.filter(r => r.status === 'ACCEPTED' || r.status === 'ON_HIRE');

  return (
    <div className="space-y-6 relative">
      {toast.show && (
        <div className={`absolute top-0 right-0 p-3 rounded shadow-md text-sm font-bold z-50 ${toast.type === 'error' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
          {toast.message}
        </div>
      )}

      <div>
        <h1 className="text-xl font-black text-slate-900">Pre-Paid Hire Requests</h1>
        <p className="text-xs text-slate-500 font-medium">Review and assign your machines to confirmed requests.</p>
      </div>

      <div className="space-y-8">
        {/* Pending Requests */}
        <section>
          <h2 className="text-sm font-bold text-slate-800 mb-4 border-b pb-2">Pending Requests (Action Required)</h2>
          {pendingRequests.length > 0 ? (
            <div className="grid gap-4">
              {pendingRequests.map((req) => (
                <Card key={req.id} className="p-5 border-l-4 border-yellow-500">
                  <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-mono">{req.booking_id?.slice(0, 8)}…</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider">PAID & READY</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-3">
                        <MapPin className="h-4 w-4 text-amber-500 shrink-0" />
                        <span className="truncate">{req.booking?.pickup_address?.split(',')[0] || 'Pickup'}</span>
                        <ChevronRight className="h-3 w-3 text-slate-400 mx-1" />
                        <span className="truncate">{req.booking?.delivery_address?.split(',')[0] || 'Delivery'}</span>
                      </div>
                      <div className="flex items-center gap-6 text-xs text-slate-600">
                        <div><span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Start Date</span>{new Date(req.start_date).toLocaleDateString()}</div>
                        <div><span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">End Date</span>{new Date(req.end_date).toLocaleDateString()}</div>
                        <div><span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Duration</span>{req.duration_days} Days</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setActionModal({ open: true, type: 'reject', request: req })}>Reject</Button>
                      <Button size="sm" className="bg-yellow-500 text-slate-900 hover:bg-yellow-400" onClick={() => setActionModal({ open: true, type: 'accept', request: req })}>Accept & Assign</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center bg-white border border-slate-200 rounded-3xl">
              <Package className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No pending pre-paid hire requests right now.</p>
            </div>
          )}
        </section>

        {/* Active Requests */}
        <section>
          <h2 className="text-sm font-bold text-slate-800 mb-4 border-b pb-2">Active Hires</h2>
          {activeRequests.length > 0 ? (
            <div className="grid gap-4">
              {activeRequests.map((req) => {
                const bookingStatus = req.booking?.status || 'N/A';
                const statusLabels = {
                  'DRIVER_ASSIGNED': 'Operator Assigned',
                  'DRIVER_EN_ROUTE': 'En Route to Site',
                  'ARRIVED_PICKUP': 'Arrived at Site',
                  'PICKED_UP': 'Work Started',
                  'IN_TRANSIT': 'Work In Progress',
                  'COMPLETED': 'Job Completed',
                };
                const statusLabel = statusLabels[bookingStatus] || bookingStatus.replace(/_/g, ' ');
                return (
                  <Card key={req.id} className="p-4 border-l-4 border-emerald-500 bg-slate-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-bold text-slate-800">{req.booking?.cargo_name || `Booking ${req.booking_id?.slice(0, 8)}`}</div>
                        <div className="text-xs text-slate-500 mt-1">{req.booking?.pickup_address} → {req.booking?.delivery_address}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded uppercase block">{statusLabel}</span>
                        <span className="text-[10px] text-slate-400 mt-1 block">{bookingStatus}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No active hires.</p>
          )}
        </section>
      </div>

      {/* Accept Modal */}
      <Modal open={actionModal.open && actionModal.type === 'accept'} onClose={() => setActionModal({ open: false, type: '', request: null })} title="Assign Machine">
        <form onSubmit={handleAcceptRequest} className="space-y-5">
          <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-xl">
            <p className="text-xs text-yellow-800 font-medium">This booking is pre-paid. Please select an available machine and operator to assign to this request.</p>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Select Machine</label>
            <select
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
              className="w-full p-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
              required
            >
              <option value="" disabled>Select an available machine...</option>
              {machines.map(m => (
                <option key={m.id} value={m.id}>{m.type} ({m.registration_number})</option>
              ))}
            </select>
            {machines.length === 0 && (
              <p className="text-xs text-rose-500 mt-2 font-medium">You have no available machines. Please add one first.</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Select Operator (Optional)</label>
            <select
              value={selectedOperator}
              onChange={(e) => setSelectedOperator(e.target.value)}
              className="w-full p-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            >
              <option value="">No operator (or I will assign later)</option>
              {operators.map(op => (
                <option key={op.id} value={op.id}>{op.name} ({op.license})</option>
              ))}
            </select>
            <p className="text-[10px] text-slate-500 mt-1">If assigned, the operator can log in to the Driver Portal to track the job.</p>
          </div>
          
          <div className="pt-4 flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setActionModal({ open: false, type: '', request: null })}>Cancel</Button>
            <Button type="submit" className="flex-1 bg-yellow-500 text-slate-900 hover:bg-yellow-400" disabled={machines.length === 0}>Confirm Assignment</Button>
          </div>
        </form>
      </Modal>

      {/* Reject Modal */}
      <Modal open={actionModal.open && actionModal.type === 'reject'} onClose={() => setActionModal({ open: false, type: '', request: null })} title="Reject Hire Request">
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 text-rose-800 rounded border border-rose-100 text-sm">
            Are you sure you want to reject this request? The booking will be returned to the broker to find another supplier.
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setActionModal({ open: false, type: '', request: null })}>Cancel</Button>
            <Button onClick={handleRejectRequest} className="flex-1 bg-rose-600 text-white hover:bg-rose-700">Yes, Reject</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
