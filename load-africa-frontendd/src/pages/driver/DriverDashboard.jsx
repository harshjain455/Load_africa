import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck, MapPin, DollarSign, Clock, ArrowRight, Star, ToggleLeft, ToggleRight,
  ChevronRight, AlertCircle, Shield, CheckCircle2, User, Phone, Clipboard, Video, Info, Lock, RefreshCw, X, History, ClipboardCheck,
  Package
} from 'lucide-react';
import { driverService } from '../../services/driverService';

export default function DriverDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTrip, setActiveTrip] = useState(null);
  const [pendingOffers, setPendingOffers] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [statusToggling, setStatusToggling] = useState(false);
  const [complianceData, setComplianceData] = useState({
    uniform_standards: false,
    hygiene: false,
    documentation: false
  });
  const [updatingCompliance, setUpdatingCompliance] = useState(false);

  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [dashRes, tripRes, offersRes] = await Promise.all([
        driverService.getDriverDashboard(),
        driverService.getActiveTrip(),
        driverService.getPendingOffers().catch(() => ({ success: false, data: [] }))
      ]);

      if (dashRes.success) {
        setDashboardData(dashRes.data);
        setIsOnline(dashRes.data.currentStatus === 'AVAILABLE');
        if (dashRes.data.compliance) {
          setComplianceData({
            uniform_standards: dashRes.data.compliance.uniform_standards || false,
            hygiene: dashRes.data.compliance.hygiene || false,
            documentation: dashRes.data.compliance.documentation || false
          });
        }
      }
      
      if (tripRes?.success) {
        setActiveTrip(tripRes.data);
      }
      
      if (offersRes?.success) {
        setPendingOffers(offersRes.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleStatus = async () => {
    if (statusToggling) return;
    try {
      setStatusToggling(true);
      const newStatus = !isOnline;
      
      let lat = null, lng = null;
      if (newStatus && navigator.geolocation) {
        try {
          const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        } catch (e) {
          console.warn("Could not get GPS coordinates");
        }
      }
      
      const res = await driverService.toggleOnline(newStatus, lat, lng);
      if (res.success) {
        setIsOnline(newStatus);
        setDashboardData(prev => ({
          ...prev,
          currentStatus: newStatus ? 'AVAILABLE' : 'INACTIVE'
        }));
      }
    } catch (err) {
      console.error("Failed to toggle status", err);
      alert("Failed to update availability status.");
    } finally {
      setStatusToggling(false);
    }
  };

  const handleUpdateCompliance = async () => {
    try {
      setUpdatingCompliance(true);
      const res = await driverService.submitCompliance(complianceData);
      if (res.success) {
        alert("Compliance updated successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update compliance.");
    } finally {
      setUpdatingCompliance(false);
    }
  };

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  const isEligible = dashboardData?.kycStatus === 'APPROVED';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Bar: Online/Offline Control */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Driver Command Center</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">Manage your availability and monitor operations.</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Control</span>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold ${isOnline ? 'text-emerald-600' : 'text-slate-500'}`}>
                {statusToggling ? 'Updating...' : (isOnline ? 'ONLINE - Eligible for load offers' : 'OFFLINE - Not receiving offers')}
              </span>
              <button 
                onClick={handleToggleStatus}
                disabled={statusToggling || !isEligible}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors disabled:opacity-50 ${isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isOnline ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
            {dashboardData?.kycStatus === 'NOT_STARTED' && (
              <p className="text-xs text-red-500 font-bold mt-1">Complete KYC to become eligible.</p>
            )}
            {dashboardData?.kycStatus === 'PENDING' && (
              <p className="text-xs text-amber-500 font-bold mt-1">Verification pending. You cannot go online until approval.</p>
            )}
            {dashboardData?.kycStatus === 'REJECTED' && (
              <p className="text-xs text-red-500 font-bold mt-1">Verification rejected. Review and resubmit the required documents.</p>
            )}
            {isEligible && !isOnline && (
              <p className="text-xs text-emerald-600 font-bold mt-1">You are verified. Go online to receive load offers.</p>
            )}
            {isEligible && isOnline && (
              <p className="text-xs text-emerald-600 font-bold mt-1">You are online and eligible for automatic matching.</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Trip', value: activeTrip ? '1' : '0', icon: Truck, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Pending Offers', value: pendingOffers.length.toString(), icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Completed Loads', value: (dashboardData?.completedLoads || 0).toString(), icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Driver Rating', value: dashboardData?.rating ? Number(dashboardData.rating).toFixed(1) : 'New', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Trip Panel */}
          {activeTrip && (
            <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-blue-700">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-widest">Active Trip In Progress</span>
                </div>
                <button 
                  onClick={() => navigate('/driver/active-trip')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                >
                  Manage Trip
                </button>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-blue-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">{activeTrip.pickup_address} → {activeTrip.delivery_address}</p>
                  <p className="text-xs text-slate-500 mt-1">Status: <span className="font-bold text-blue-600">{activeTrip.status.replace(/_/g, ' ')}</span></p>
                </div>
                <Truck className="h-8 w-8 text-blue-300" />
              </div>
            </div>
          )}

          {/* Pending Load Offers */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Package className="h-5 w-5 text-amber-500" />
                New Load Offers
              </h2>
              {pendingOffers.length > 0 && (
                <button 
                  onClick={() => navigate('/driver/load-offers')}
                  className="text-amber-600 hover:text-amber-700 text-sm font-bold flex items-center gap-1"
                >
                  View All Offers <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="p-6">
              {pendingOffers.length === 0 ? (
                <div className="text-center py-10">
                  <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">You're all caught up!</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                    {isOnline ? "No matching load offers are currently available. We will notify you when a load matches your vehicle." : "You are offline. Go online to receive load offers from the automated matching engine."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingOffers.slice(0, 3).map((offer) => (
                    <div key={offer.id} className="p-4 border border-slate-100 rounded-2xl hover:border-amber-200 hover:bg-amber-50/30 transition-colors flex flex-col sm:flex-row gap-4 items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            New Match
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {new Date(offer.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs mb-1">
                          {offer.booking.pickup_address}
                        </p>
                        <p className="text-xs text-slate-500 truncate max-w-[200px] sm:max-w-xs">
                          To: {offer.booking.delivery_address}
                        </p>
                      </div>
                      <button 
                        onClick={() => navigate('/driver/load-offers')}
                        className="w-full sm:w-auto px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                      >
                        Review Offer
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-sm border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 bg-emerald-500/20 rounded-full blur-2xl" />
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-400" /> Wallet Balance
            </h3>
            <p className="text-4xl font-black tracking-tight mb-1">
              R {(dashboardData?.earnings || 0).toFixed(2)}
            </p>
            <p className="text-xs text-slate-400 font-medium mb-6">Available to withdraw</p>
            <button 
              onClick={() => navigate('/driver/earnings')}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm font-black rounded-xl transition-colors shadow-sm"
            >
              Withdraw Earnings
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-amber-500" /> Active Vehicle
            </h3>
            {dashboardData?.vehicle ? (
              <div>
                <p className="text-lg font-black text-slate-900">{`${dashboardData.vehicle.manufacturer || ''} ${dashboardData.vehicle.model || ''}`.trim() || 'Assigned Vehicle'}</p>
                <p className="text-sm font-bold text-slate-500 mt-1">{dashboardData.vehicle.reg || 'No Reg Info'}</p>
                <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Verified & Eligible
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm font-bold text-slate-600">No verified vehicle assigned.</p>
                <p className="text-xs text-slate-500 mt-2">Contact admin or fleet owner.</p>
              </div>
            )}
          </div>

          {/* Compliance Introspection Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-purple-500" /> Daily Compliance
            </h3>
            <div className="space-y-4">
              {[
                { key: 'uniform_standards', label: 'Uniform Standards' },
                { key: 'hygiene', label: 'Hygiene & Cleanliness' },
                { key: 'documentation', label: 'Documentation Up-to-date' }
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">{item.label}</span>
                  <button
                    onClick={() => setComplianceData(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${complianceData[item.key] ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${complianceData[item.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
              <button 
                onClick={handleUpdateCompliance}
                disabled={updatingCompliance}
                className="w-full mt-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50"
              >
                {updatingCompliance ? 'Saving...' : 'Save Compliance'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
