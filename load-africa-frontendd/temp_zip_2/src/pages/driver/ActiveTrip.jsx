import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Navigation, Compass, AlertCircle, Play, 
  CheckCircle, Truck, Info, Phone, ShieldCheck, RefreshCw, Upload, Camera, FileText
} from 'lucide-react';
import { getMockData, saveMockData } from '../../data/mockData';
import { Modal, Button, Input } from '../../components/ui';

export default function ActiveTrip() {
  const navigate = useNavigate();
  const [activeBooking, setActiveBooking] = useState(null);
  const [load, setLoad] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [tripState, setTripState] = useState('assigned'); // assigned, arrived_pickup, in_transit, arrived_delivery, completed, credited
  const [simProgress, setSimProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('live'); // live, details, customer, documents

  // Modals
  const [issueModal, setIssueModal] = useState(false);
  const [issueReason, setIssueReason] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  
  // Fake uploads
  const [pickupPhoto, setPickupPhoto] = useState(null);
  const [podPhoto, setPodPhoto] = useState(null);

  useEffect(() => {
    const bookings = getMockData('bookings') || [];
    const active = bookings.find(b => b.driverId === 'drv-1' && ['assigned', 'arrived_pickup', 'in_transit', 'arrived_delivery', 'completed'].includes(b.bookingStatus));
    
    if (active) {
      setActiveBooking(active);
      setTripState(active.bookingStatus);
      
      const loads = getMockData('loads') || [];
      const ld = loads.find(l => l.id === active.loadId);
      setLoad(ld);

      const users = getMockData('users') || [];
      const cust = users.find(u => u.id === active.customerId);
      // Use mock if customer not found
      setCustomer(cust || {
        name: ld?.customer || 'Mock Customer',
        company: 'Logistics Co',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80',
        phone: '+27 82 555 1234'
      });

      if (active.bookingStatus === 'in_transit') {
        setSimProgress(45);
      }
    }
  }, []);

  // Map route simulation
  useEffect(() => {
    if (tripState === 'in_transit') {
      const timer = setInterval(() => {
        setSimProgress((prev) => {
          if (prev >= 95) {
            clearInterval(timer);
            return 95;
          }
          return prev + 2;
        });
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [tripState]);

  const updateGlobalStatus = (status) => {
    const bookings = getMockData('bookings') || [];
    const index = bookings.findIndex(b => b.id === activeBooking.id);
    if (index > -1) {
      bookings[index].bookingStatus = status;
      saveMockData('bookings', bookings);
    }

    const loads = getMockData('loads') || [];
    const loadIndex = loads.findIndex(l => l.id === activeBooking.loadId);
    if (loadIndex > -1) {
      loads[loadIndex].status = status;
      saveMockData('loads', loads);
    }
  };

  const handleAction = (nextState) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setTripState(nextState);
      updateGlobalStatus(nextState);

      if (nextState === 'in_transit') {
        setSimProgress(10);
      }

      if (nextState === 'completed') {
        // Payment Processing simulation
        setTimeout(() => {
          handlePaymentCredited();
        }, 3000);
      }
    }, 1000);
  };

  const handleVerifyOTP = () => {
    if (otp === '1234') {
      setOtpError('');
      handleAction('completed');
    } else {
      setOtpError('Invalid OTP code. Please ask the receiver for the correct code.');
    }
  };

  const handlePaymentCredited = () => {
    setTripState('credited');
    
    // Add to driver earnings
    const drivers = getMockData('drivers') || [];
    const driverIndex = drivers.findIndex(d => d.id === 'drv-1');
    if (driverIndex > -1) {
      drivers[driverIndex].trips += 1;
      drivers[driverIndex].earnings += activeBooking.price;
      drivers[driverIndex].walletBalance += activeBooking.price;
      saveMockData('drivers', drivers);
    }

    // Record transaction
    const payments = getMockData('payments') || [];
    payments.unshift({
      id: `tx-${Math.floor(2000 + Math.random() * 9000)}`,
      bookingId: activeBooking.id,
      amount: activeBooking.price,
      status: 'completed',
      method: 'Load Payout',
      date: new Date().toISOString().split('T')[0],
      customerName: customer?.name || 'Customer',
      driverName: 'Sipho Zuma'
    });
    saveMockData('payments', payments);
  };

  if (!activeBooking || !load || !customer) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
        <div className="inline-flex p-4 bg-emerald-500/10 text-emerald-500 rounded-full">
          <Truck className="h-10 w-10" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">No Active Trips Assigned</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          You are currently off-duty or don't have any cargo loads assigned. Visit the Available Loads dashboard to find contracts.
        </p>
        <button 
          onClick={() => navigate('/driver/dashboard')}
          className="mt-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md"
        >
          Check Available Loads
        </button>
      </div>
    );
  }

  const renderTabs = () => (
    <div className="flex overflow-x-auto gap-2 p-1 bg-slate-100 rounded-xl mb-6">
      {['live', 'details', 'customer', 'documents'].map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex-1 py-2 px-3 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
            activeTab === tab ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
      
      {/* Visual Navigation & Details Display (Left 2 cols) */}
      <div className="lg:col-span-2 space-y-6">
        
        {renderTabs()}

        {activeTab === 'live' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
            
            <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-emerald-500 animate-spin" />
                <span className="font-bold text-sm">Trip Progress Stream</span>
              </div>
              
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                ['completed', 'credited'].includes(tripState) ? 'bg-slate-800 text-slate-400 border-slate-700' :
                tripState === 'in_transit' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20 animate-pulse' :
                'bg-amber-500/20 text-amber-400 border-amber-500/20'
              }`}>
                {tripState.replace('_', ' ')}
              </span>
            </div>

            {/* Interactive Simulated Map */}
            <div className="flex-1 bg-slate-950 relative flex items-center justify-center p-6 overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.02)_1px,_transparent_1px)] bg-[size:30px_30px]" />
              
              {['completed', 'credited'].includes(tripState) ? (
                <div className="relative z-10 text-center space-y-3 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 max-w-sm backdrop-blur">
                  <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto" />
                  <h4 className="font-bold text-white text-base">Delivery Successful!</h4>
                  {tripState === 'completed' ? (
                    <p className="text-xs text-amber-400 font-bold animate-pulse">Payment Pending... Processing Payout</p>
                  ) : (
                    <>
                      <p className="text-xs text-emerald-400 font-bold">Payment Credited: R{activeBooking.price}</p>
                      <button 
                        onClick={() => navigate('/driver/dashboard')}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl mt-4"
                      >
                        Return to Dashboard
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <svg className="w-full h-full relative z-10" viewBox="0 0 500 300">
                  {/* Route Vector line */}
                  <circle cx="100" cy="150" r="8" className="fill-amber-500 stroke-amber-500/40 stroke-[6px]" />
                  <circle cx="400" cy="150" r="8" className="fill-indigo-500 stroke-indigo-500/40 stroke-[6px]" />
                  <path d="M 100 150 Q 250 80 400 150" fill="none" stroke="#1e293b" strokeWidth="4" />
                  
                  {['in_transit', 'arrived_delivery'].includes(tripState) && (
                    <>
                      <path 
                        d="M 100 150 Q 250 80 400 150" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="4" 
                        strokeDasharray="500" 
                        strokeDashoffset={500 - (500 * (simProgress / 100))}
                      />
                      {(() => {
                        const t = simProgress / 100;
                        const x = (1 - t) * (1 - t) * 100 + 2 * (1 - t) * t * 250 + t * t * 400;
                        const y = (1 - t) * (1 - t) * 150 + 2 * (1 - t) * t * 80 + t * t * 150;
                        return (
                          <g transform={`translate(${x - 12}, ${y - 12})`}>
                            <circle cx="12" cy="12" r="14" className="fill-emerald-500/25 stroke-emerald-500/40 animate-ping" />
                            <rect x="5" y="7" width="14" height="10" rx="1.5" className="fill-emerald-500" />
                          </g>
                        );
                      })()}
                    </>
                  )}
                </svg>
              )}

              {/* GPS Telemetry reading */}
              {tripState === 'in_transit' && (
                <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl text-[10px] text-slate-300 font-mono space-y-1 backdrop-blur z-20">
                  <p className="font-semibold text-white">CORRIDOR COORDINATES</p>
                  <div className="grid grid-cols-2 gap-x-3">
                    <span>HEADING:</span>
                    <span className="text-emerald-400">North-East</span>
                    <span>VELOCITY:</span>
                    <span className="text-white">65 km/h</span>
                    <span>DISTANCE:</span>
                    <span className="text-amber-400">{load.distance}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Load Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Booking ID</span>
                  <p className="font-bold text-slate-800 text-sm">{activeBooking.id}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Cargo Info</span>
                  <p className="font-bold text-slate-800 text-sm">{load.title} ({load.weight})</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Vehicle Type Required</span>
                  <p className="font-bold text-slate-800 text-sm">{load.vehicle}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Pickup Location</span>
                  <p className="font-bold text-slate-800 text-sm">{load.pickup}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{load.pickupDate}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Delivery Location</span>
                  <p className="font-bold text-slate-800 text-sm">{load.dropoff}</p>
                </div>
                {load.instructions && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Special Instructions</span>
                    <p className="font-medium text-amber-700 bg-amber-50 p-2 rounded text-xs">{load.instructions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customer' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Customer Details</h3>
            <div className="flex items-center gap-4">
              <img src={customer.avatar || null} alt={customer.name} className="h-16 w-16 rounded-full border border-slate-200" />
              <div>
                <h4 className="font-bold text-slate-800">{customer.name}</h4>
                <p className="text-xs text-slate-500">{customer.company}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Main Phone</span>
                <p className="font-bold text-emerald-600 text-sm flex items-center gap-2"><Phone className="h-4 w-4" /> {customer.phone}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Pickup Contact</span>
                  <p className="font-bold text-slate-800 text-sm">Site Manager</p>
                  <p className="text-xs text-slate-500">Call upon arrival at gate</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Delivery Contact</span>
                  <p className="font-bold text-slate-800 text-sm">Receiving Bay</p>
                  <p className="text-xs text-slate-500">Requires OTP to offload</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Trip Documents</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                {pickupPhoto ? (
                  <div className="space-y-2">
                    <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto" />
                    <p className="text-xs font-bold text-emerald-700">Pickup Photo Uploaded</p>
                  </div>
                ) : (
                  <div className="space-y-2 text-slate-400">
                    <Camera className="h-8 w-8 mx-auto opacity-50" />
                    <p className="text-xs font-medium">Pickup Photo (Optional)</p>
                  </div>
                )}
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                {podPhoto ? (
                  <div className="space-y-2">
                    <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto" />
                    <p className="text-xs font-bold text-emerald-700">POD Uploaded</p>
                  </div>
                ) : (
                  <div className="space-y-2 text-slate-400">
                    <FileText className="h-8 w-8 mx-auto opacity-50" />
                    <p className="text-xs font-medium">Proof of Delivery (POD)</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Control Actions Panel (Right 1 col) */}
      <div className="space-y-6">
        
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <h3 className="text-lg font-bold text-slate-800">Trip Actions</h3>

          {/* STAGE 1: Assigned */}
          {tripState === 'assigned' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl text-xs text-slate-500 leading-relaxed text-left">
                Load accepted. Review load details and navigate to the pickup location.
              </div>
              <button 
                onClick={() => handleAction('arrived_pickup')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                {loading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Navigate to Pickup'}
              </button>
            </div>
          )}

          {/* STAGE 2: Arrived at Pickup */}
          {tripState === 'arrived_pickup' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-xs text-slate-600 leading-relaxed text-left">
                You have arrived at the pickup location. Confirm cargo loading to proceed.
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50" onClick={() => setPickupPhoto('mock_pickup.jpg')}>
                <Camera className="h-5 w-5 text-slate-400 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">{pickupPhoto ? 'Change Photo' : 'Upload Pickup Photo (Mock)'}</span>
              </div>
              <button 
                onClick={() => handleAction('in_transit')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                {loading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Confirm Cargo Loaded'}
              </button>
            </div>
          )}

          {/* STAGE 3: In Transit */}
          {tripState === 'in_transit' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs text-slate-600 leading-relaxed text-left">
                Cargo is in transit. Drive safely. Upon reaching destination, confirm arrival.
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleAction('arrived_delivery')}
                  disabled={loading}
                  className="col-span-2 flex items-center justify-center gap-2 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  {loading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Arrived at Delivery'}
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-bold transition-all">
                  <Navigation className="h-3 w-3" /> Navigation
                </button>
                <button onClick={() => setIssueModal(true)} className="flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-[10px] font-bold transition-all">
                  <AlertCircle className="h-3 w-3" /> Report Issue
                </button>
              </div>
            </div>
          )}

          {/* STAGE 4: Arrived at Delivery */}
          {tripState === 'arrived_delivery' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-xs text-amber-800 font-medium text-left">
                You have arrived. Obtain the OTP from the receiver and upload the signed POD.
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Receiver OTP Code</label>
                <Input 
                  placeholder="Enter 1234 to simulate" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                />
                {otpError && <p className="text-[10px] text-red-500 font-bold">{otpError}</p>}
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50" onClick={() => setPodPhoto('mock_pod.jpg')}>
                <FileText className="h-5 w-5 text-slate-400 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">{podPhoto ? 'POD Document Ready' : 'Upload POD Photo (Mock)'}</span>
              </div>

              <button 
                onClick={handleVerifyOTP}
                disabled={loading || !podPhoto}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                  !podPhoto ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {loading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Verify & Complete Delivery'}
              </button>
            </div>
          )}

          {/* STAGE 5: Completed */}
          {['completed', 'credited'].includes(tripState) && (
            <div className="p-4 bg-slate-50 text-slate-500 text-xs rounded-xl border border-slate-100 text-center font-bold">
              Workflow Complete. Payment Handled.
            </div>
          )}
        </div>

        {/* Payout Summary Widget */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Trip Value</h3>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-black text-emerald-600">R{activeBooking.price}</span>
            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${tripState === 'credited' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {tripState === 'credited' ? 'Paid to Wallet' : 'Pending Delivery'}
            </span>
          </div>
        </div>

      </div>

      {/* Report Issue Modal */}
      <Modal open={issueModal} onClose={() => setIssueModal(false)} title="Report Trip Issue">
        <div className="space-y-4">
          <p className="text-xs text-slate-500">Report delays or incidents. Operations will be notified.</p>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Issue Type</label>
            <select 
              value={issueReason}
              onChange={(e) => setIssueReason(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all"
            >
              <option value="">Select a reason...</option>
              <option value="traffic">Traffic Delay</option>
              <option value="breakdown">Vehicle Breakdown</option>
              <option value="customer">Customer Unavailable</option>
              <option value="damage">Cargo Damage</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">Notes (Optional)</label>
            <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm" rows="3" placeholder="Describe the issue..."></textarea>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIssueModal(false)}>Cancel</Button>
            <Button onClick={() => {
              alert('Issue Reported (Mock)');
              setIssueModal(false);
            }} className="bg-red-600 hover:bg-red-500 text-white border-0">Submit Report</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
