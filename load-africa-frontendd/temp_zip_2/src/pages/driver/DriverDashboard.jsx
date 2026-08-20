import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Truck, MapPin, DollarSign, CheckCircle2, Clock,
  ArrowRight, Star, ToggleLeft, ToggleRight, ChevronRight,
  ShieldCheck, TrendingUp, Package, AlertCircle, FileText, Upload, User, Settings
} from 'lucide-react';
import { getMockData, saveMockData } from '../../data/mockData';
import { Modal, Button } from '../../components/ui';

const stats = [
  { label: 'Total Trips', value: '142', icon: Truck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { label: 'Active Trip', value: '0', icon: MapPin, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'This Month', value: 'R 8,200', icon: DollarSign, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { label: 'Rating', value: '4.8★', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
];

const availableLoads = [
  {
    id: 'LA-2024-091',
    from: 'Johannesburg, Gauteng',
    to: 'Polokwane, Limpopo',
    cargo: 'Building Materials',
    weight: '8 tons',
    vehicle: '8-Ton Truck',
    payout: 'R 2,800',
    distance: '320 km',
    urgency: 'Same Day',
    urgencyColor: 'bg-red-100 text-red-700',
    pickupDate: '2024-07-07 08:00 AM',
    eta: '4h 30m',
    customer: 'BuildIt Pro',
    rating: '4.9',
    instructions: 'Requires straps and tarps for rain protection.',
  },
  {
    id: 'LA-2024-090',
    from: 'Rustenburg, North West',
    to: 'Pretoria, Gauteng',
    cargo: 'Furniture & Goods',
    weight: '3 tons',
    vehicle: 'Furniture Truck',
    payout: 'R 950',
    distance: '110 km',
    urgency: 'Flexible',
    urgencyColor: 'bg-green-100 text-green-700',
    pickupDate: '2024-07-08 10:00 AM',
    eta: '1h 45m',
    customer: 'Mpho Logistics',
    rating: '4.5',
    instructions: 'Handle with care, fragile items included.',
  },
  {
    id: 'LA-2024-089',
    from: 'Kimberley, Northern Cape',
    to: 'Johannesburg, Gauteng',
    cargo: 'Mining Aggregate',
    weight: '15 tons',
    vehicle: 'Tipper Truck',
    payout: 'R 4,500',
    distance: '480 km',
    urgency: 'Tomorrow',
    urgencyColor: 'bg-amber-100 text-amber-700',
    pickupDate: '2024-07-07 06:00 AM',
    eta: '6h 15m',
    customer: 'Global Mining Co',
    rating: '4.8',
    instructions: 'Must wear full PPE on site.',
  },
];

const recentTrips = [
  { id: 'LA-2024-085', from: 'Joburg', to: 'Cape Town', cargo: 'Retail Pallets', date: '10 Jun', earned: 'R 5,200', rating: 5 },
  { id: 'LA-2024-078', from: 'Pretoria', to: 'Durban', cargo: 'Electronics', date: '4 Jun', earned: 'R 3,800', rating: 5 },
  { id: 'LA-2024-071', from: 'Rustenburg', to: 'Joburg', cargo: 'Sand Delivery', date: '28 May', earned: 'R 1,100', rating: 4 },
];

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [selectedLoad, setSelectedLoad] = useState(null);
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [acceptModal, setAcceptModal] = useState(false);
  const [activeTrip, setActiveTrip] = useState(null);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    const bookings = getMockData('bookings') || [];
    const active = bookings.find(b => b.driverId === 'drv-1' && ['assigned', 'picked_up', 'in_transit', 'arrived'].includes(b.bookingStatus));
    setActiveTrip(active || null);
  }, []);

  const handleOpenAccept = (load) => {
    setSelectedLoad(load);
    setAcceptModal(true);
  };

  const handleOpenDetails = (load) => {
    setSelectedLoad(load);
    setViewDetailsModal(true);
  };

  const handleConfirmAccept = () => {
    const bookings = getMockData('bookings') || [];
    const loads = getMockData('loads') || [];
    
    // Check if there's already an active trip
    const active = bookings.find(b => b.driverId === 'drv-1' && ['assigned', 'picked_up', 'in_transit', 'arrived'].includes(b.bookingStatus));
    if (active) {
      setErrorMessage('You already have an active trip! Please complete it first.');
      setErrorModal(true);
      setAcceptModal(false);
      return;
    }

    const loadData = selectedLoad;
    
    // Create new booking for this load
    const loadId = `ld-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      id: loadData.id,
      loadId: loadId,
      driverId: 'drv-1',
      customerId: 'cust-1',
      bookingStatus: 'assigned',
      price: parseInt(loadData.payout.replace(/\D/g, '')),
      date: new Date().toISOString(),
      distance: loadData.distance,
      eta: loadData.eta
    };
    
    bookings.unshift(newBooking);
    saveMockData('bookings', bookings);
    
    // Create the load
    const newLoad = {
      id: loadId,
      title: loadData.cargo,
      pickup: loadData.from,
      dropoff: loadData.to,
      weight: loadData.weight,
      vehicle: loadData.vehicle,
      instructions: loadData.instructions,
      pickupDate: loadData.pickupDate,
      status: 'assigned'
    };
    loads.push(newLoad);
    saveMockData('loads', loads);

    setAcceptModal(false);
    navigate('/driver/active-trip');
  };

  // 1. Available Loads Page View
  if (path.endsWith('/available-loads')) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-black text-slate-900">Available Loads near you</h1>
          <p className="text-xs text-slate-500 font-medium">Accept freight requests matching your vehicle.</p>
        </div>

        <div className="space-y-4">
          {availableLoads.map((load) => (
            <div key={load.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 hover:border-amber-300 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{load.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${load.urgencyColor}`}>
                      {load.urgency}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-extrabold text-slate-800">
                    <MapPin className="h-4 w-4 text-amber-500 shrink-0" />
                    <span className="truncate">{load.from}</span>
                    <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />
                    <span className="truncate">{load.to}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4 text-xs text-slate-600 font-medium">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Cargo Details</p>
                      <p>{load.cargo}</p>
                      <p>{load.weight} · {load.vehicle}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Trip Details</p>
                      <p>Distance: {load.distance}</p>
                      <p>Pickup: {load.pickupDate}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end shrink-0 min-w-[120px] space-y-3">
                  <div className="text-right">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Payout</span>
                    <span className="text-xl font-black text-emerald-600">{load.payout}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Shipper</span>
                    <span className="text-xs font-bold text-slate-800">{load.customer}</span>
                    <span className="text-[10px] text-yellow-500">{load.rating}★</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => handleOpenDetails(load)}>
                  View Details
                </Button>
                <Button onClick={() => handleOpenAccept(load)} className="bg-emerald-600 hover:bg-emerald-500 text-white border-0">
                  Accept Load
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Load Details Modal */}
        <Modal open={viewDetailsModal} onClose={() => setViewDetailsModal(false)} title="Load Details">
          {selectedLoad && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{selectedLoad.id}</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Route</span>
                  <p className="text-xs font-bold text-slate-800">{selectedLoad.from} → {selectedLoad.to}</p>
                  <p className="text-xs text-slate-500 mt-1">Distance: {selectedLoad.distance} | ETA: {selectedLoad.eta}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Cargo & Vehicle</span>
                  <p className="text-xs font-bold text-slate-800">{selectedLoad.cargo} ({selectedLoad.weight})</p>
                  <p className="text-xs text-slate-500 mt-1">Requires: {selectedLoad.vehicle}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Special Instructions</span>
                  <p className="text-xs text-slate-600">{selectedLoad.instructions}</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setViewDetailsModal(false)}>Close</Button>
                <Button onClick={() => {
                  setViewDetailsModal(false);
                  handleOpenAccept(selectedLoad);
                }} className="bg-emerald-600 hover:bg-emerald-500 text-white border-0">Accept Load</Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Accept Load Modal */}
        <Modal open={acceptModal} onClose={() => setAcceptModal(false)} title="Confirm Acceptance">
          {selectedLoad && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 bg-emerald-50 text-emerald-500 rounded-full mb-2">
                  <Truck className="h-8 w-8" />
                </div>
                <h3 className="text-base font-black text-slate-900">Accept this Load?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  You are committing to pick up {selectedLoad.cargo} ({selectedLoad.weight}) from {selectedLoad.from} on {selectedLoad.pickupDate}.
                </p>
                <p className="text-sm font-black text-emerald-600 mt-4 text-center">Payout: {selectedLoad.payout}</p>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setAcceptModal(false)}>Cancel</Button>
                <Button onClick={handleConfirmAccept} className="bg-emerald-600 hover:bg-emerald-500 text-white border-0">Confirm & Start Trip</Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Error Modal */}
        <Modal open={errorModal} onClose={() => setErrorModal(false)} title="Notice">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-amber-50 text-amber-500 rounded-full mb-2">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h3 className="text-base font-black text-slate-900">Cannot Accept Load</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {errorMessage}
              </p>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button onClick={() => setErrorModal(false)} className="bg-slate-900 hover:bg-slate-800 text-white">Understood</Button>
            </div>
          </div>
        </Modal>

      </div>
    );
  }

  // 4. Default Overview
  return (
    <div className="space-y-6">

      {/* Welcome + Online toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">Welcome, Sipho 👋</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {isOnline ? 'You are online — loads are visible to you.' : 'You are offline — go online to see available loads.'}
          </p>
        </div>
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
            isOnline
              ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-200 text-slate-600 border-slate-300'
          }`}
        >
          {isOnline ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
          {isOnline ? 'Online' : 'Offline'}
        </button>
      </div>

      {/* KYC Status */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
        <div>
          <p className="text-xs font-extrabold text-amber-800">KYC Documents Pending</p>
          <p className="text-[10px] text-amber-600">Some of your documents need review. This may limit load matching.</p>
        </div>
        <button onClick={() => navigate('/driver/kyc')} className="ml-auto text-[9px] font-bold bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-full uppercase transition-colors">
          View Status
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          // Dynamically show active trip count
          const value = i === 1 && activeTrip ? '1' : stat.value;
          return (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3 shadow-sm">
              <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-lg font-extrabold text-slate-900 leading-none">{value}</p>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Available Loads */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-800">Available Loads Near You</h2>
            <button onClick={() => navigate('/driver/available-loads')} className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
              View all <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-3">
            {availableLoads.slice(0, 2).map((load) => (
              <div key={load.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 hover:border-amber-300 transition-colors group">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                      <MapPin className="h-3 w-3 text-amber-500" />
                      {load.from}
                      <ArrowRight className="h-3 w-3 text-slate-400" />
                      {load.to}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{load.cargo} · {load.weight} · {load.vehicle} · {load.distance}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${load.urgencyColor}`}>
                    {load.urgency}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-extrabold text-emerald-600">{load.payout}</p>
                  <button onClick={() => navigate('/driver/available-loads')} className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase rounded-lg transition-all border-0">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active trip + Earnings */}
        <div className="space-y-4">

          {/* Active Trip Widget */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => activeTrip && navigate('/driver/active-trip')}>
            <h3 className="text-xs font-extrabold text-slate-800">Active Trip</h3>
            {activeTrip ? (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-800">
                  <MapPin className="h-3 w-3" />
                  Trip in Progress
                </div>
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{activeTrip.bookingStatus.replace('_', ' ')}</p>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-blue-600 font-bold flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> Action Required</span>
                  <span className="font-extrabold text-blue-800">R {activeTrip.price}</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center space-y-2">
                <Truck className="h-6 w-6 text-slate-300 mx-auto" />
                <p className="text-[10px] text-slate-500 font-medium">No active trips currently. Accept a load to get started.</p>
              </div>
            )}
          </div>

          {/* Earnings Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-800">Earnings</h3>
              <button onClick={() => navigate('/driver/earnings')} className="text-[10px] text-emerald-600 font-bold">Details</button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-medium">This Week</span>
                <span className="text-sm font-extrabold text-slate-900">R 3,450</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-medium">This Month</span>
                <span className="text-sm font-extrabold text-slate-900">R 8,200</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-medium">Wallet Balance</span>
                <span className="text-sm font-extrabold text-emerald-600">R 2,100</span>
              </div>
            </div>
            <button onClick={() => navigate('/driver/earnings')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-[10px] uppercase tracking-wider rounded-xl transition-all">
              Withdraw Earnings
            </button>
          </div>

        </div>
      </div>

      {/* Recent Trips */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-800">Recent Trips</h2>
          <button className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
            View all <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {recentTrips.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-800">{t.from} → {t.to}</p>
                <p className="text-[10px] text-slate-400">{t.cargo} · {t.date}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-extrabold text-slate-800">{t.earned}</p>
                <p className="text-[10px] text-yellow-500">{'★'.repeat(t.rating)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
