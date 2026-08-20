import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, CheckCircle2, Clock, MapPin, AlertCircle, User, ShieldCheck, FileText, TrendingUp, RefreshCw, XCircle } from 'lucide-react';
import { Card, StatCard, Table, Badge } from '../../components/ui';
import { fleetService } from '../../services/fleetService';

export default function FleetDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [availabilityHistory, setAvailabilityHistory] = useState([]);
  const [fleet, setFleet] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fleetService.getDashboard();
      if (res.success && res.data) {
        setStats(res.stats);
        setAvailabilityHistory(res.stats?.availabilityHistory || []);
        setFleet(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-ZA', { 
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <RefreshCw className="h-8 w-8 animate-spin text-amber-500 mb-4" />
        <p className="text-sm text-slate-500 font-medium">Loading command center...</p>
      </div>
    );
  }

  const { fleet: fStats, compliance: cStats, performance: pStats } = stats || {};

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Fleet Command Center</h1>
        <p className="text-xs text-slate-500 mt-1">Real-time overview of your operations, compliance, and performance.</p>
      </div>

      {/* 1. FLEET KPIs */}
      <section>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Fleet Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard title="Total Drivers" value={fStats?.totalDrivers || 0} icon={User} color="slate" />
          <StatCard title="Available Drivers" value={fStats?.availableDrivers || 0} icon={CheckCircle2} color="emerald" />
          <StatCard title="Drivers On Trip" value={fStats?.driversOnTrip || 0} icon={MapPin} color="blue" />
          <StatCard title="Unavailable" value={fStats?.inactiveDrivers || 0} icon={XCircle} color="red" />
          <StatCard title="Vehicles Available" value={fStats?.availableVehicles || 0} icon={Truck} color="amber" />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 2. COMPLIANCE SECTION */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Compliance Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <p className="text-2xl font-black text-slate-900">{cStats?.uniformCompliancePct || 0}%</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Uniform & Hygiene</p>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
                <FileText className="h-6 w-6" />
              </div>
              <p className="text-2xl font-black text-slate-900">{cStats?.docCompliancePct || 0}%</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Documentation</p>
              {cStats?.expiredDocuments > 0 && (
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full mt-2">
                  {cStats.expiredDocuments} Expired Docs
                </span>
              )}
            </div>
          </div>
        </section>

        {/* 3. PERFORMANCE SECTION */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Performance Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2 text-slate-500">
                <TrendingUp className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase">Delivered On Time (DOT)</span>
              </div>
              <p className="text-xl font-black text-slate-900">{pStats?.dotPct || 0}%</p>
            </div>
            
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2 text-slate-500">
                <MapPin className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase">Avg Load Weight</span>
              </div>
              <p className="text-xl font-black text-slate-900">{pStats?.averageWeight || 0} kg</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm col-span-2">
              <div className="flex items-center gap-2 mb-3 text-slate-500">
                <Clock className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase">Time Averages (Beta)</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center divide-x divide-slate-200">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Arrive</p>
                  <p className="text-xs font-bold text-slate-800 mt-1">—</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Collect</p>
                  <p className="text-xs font-bold text-slate-800 mt-1">—</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Depart</p>
                  <p className="text-xs font-bold text-slate-800 mt-1">—</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Dest. Arrive</p>
                  <p className="text-xs font-bold text-slate-800 mt-1">—</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 4. AVAILABILITY STATUS HISTORY */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Availability Status History</h2>
        
        {availabilityHistory.length === 0 ? (
          <div className="py-10 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
            <Clock className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500 font-medium">No transitions to Unavailable recorded yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-sm">
            <Table headers={['Driver', 'Status Change', 'Trigger / Reason', 'Timestamp', 'Trip Ref']}>
              {availabilityHistory.map((h, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-4">
                    <p className="font-bold text-slate-800 text-xs">{h.driverName}</p>
                    <p className="text-[10px] text-slate-500">{h.driverId.slice(0, 8)}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{h.oldStatus || 'AVAILABLE'}</span>
                      <span className="text-slate-400">→</span>
                      <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-md">{h.newStatus}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {h.trigger}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-500">{formatDate(h.timestamp)}</td>
                  <td className="p-4 text-xs font-mono text-slate-400">—</td>
                </tr>
              ))}
            </Table>
          </div>
        )}
      </section>

    </div>
  );
}
