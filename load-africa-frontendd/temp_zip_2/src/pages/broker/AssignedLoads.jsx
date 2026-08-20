import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Navigation, Package, Calendar, MapPin, Search, 
  ExternalLink, ChevronRight, CheckCircle2, X
} from 'lucide-react';
import { getMockData } from '../../data/mockData';
import { Badge, Table, StatCard } from '../../components/ui';

export default function AssignedLoads() {
  const navigate = useNavigate();
  const [assignedLoads, setAssignedLoads] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState(null);

  const handleViewClick = (load) => {
    setSelectedLoad(load);
    setViewModalOpen(true);
  };

  useEffect(() => {
    const allLoads = getMockData('loads') || [];
    // Broker Lwazi Dlamini assigned loads (brokerId brk-1)
    const brokerLoads = allLoads.filter(l => l.brokerId === 'brk-1');
    setAssignedLoads(brokerLoads);

    const allDrivers = getMockData('drivers') || [];
    setDrivers(allDrivers);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return <Badge status="available" />;
      case 'assigned':
        return <Badge status="assigned" />;
      case 'in_transit':
        return <Badge status="in_transit" />;
      case 'completed':
        return <Badge status="completed" />;
      default:
        return <Badge status={status} />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-left">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Assigned Bookings</h2>
        <p className="text-xs text-slate-400">Track current logistics transits and delivery status for loads matches by you.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="In Transit" value={assignedLoads.filter(l => l.status === 'in_transit').length} icon={Navigation} color="amber" />
        <StatCard title="Completed Deliveries" value={assignedLoads.filter(l => l.status === 'completed').length} icon={CheckCircle2} color="emerald" />
        <StatCard title="Total Allocations" value={assignedLoads.length} icon={Package} color="indigo" />
      </div>

      {/* Grid list table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        {assignedLoads.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-medium">You haven't allocated any loads yet.</div>
        ) : (
          <Table headers={['Load Details', 'Assigned Transporter', 'Payout / Commission', 'Transit State', 'Dispatch Date', 'Action']}>
            {assignedLoads.map((load) => {
              const drv = drivers.find(d => d.id === load.driverId);
              return (
                <tr key={load.id} className="hover:bg-slate-50/30">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{load.title}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{load.id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-850">
                    <p>{drv ? drv.name : 'Unassigned'}</p>
                    {drv && <span className="text-[10px] text-slate-400 font-mono font-medium">{drv.phone}</span>}
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-slate-800 font-bold">R{load.budget}</p>
                    <span className="text-emerald-600 font-bold">Comm: R{Math.round(load.budget * 0.05)}</span>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(load.status)}
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-400">{load.date}</td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => handleViewClick(load)}
                      className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors" 
                      title="View Details"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </Table>
        )}
      </div>

      {/* View Details Modal */}
      {viewModalOpen && selectedLoad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewModalOpen(false)} />
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg relative z-10 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-black text-slate-900">Booking Details</h2>
                <p className="text-sm text-slate-500">View complete logistics information</p>
              </div>
              <button onClick={() => setViewModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Header Info */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedLoad.title}</h3>
                  <p className="text-xs font-mono text-slate-400 mt-1">ID: {selectedLoad.id}</p>
                </div>
                {getStatusBadge(selectedLoad.status)}
              </div>

              {/* Route */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                <div className="h-10 w-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transit Route</p>
                  <p className="text-sm font-semibold text-slate-900">Johannesburg <span className="text-slate-400 mx-1">→</span> Pretoria</p>
                </div>
              </div>

              {/* Assignment Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase">Dispatch Date</p>
                  <p className="text-sm font-semibold text-slate-900 flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-400" /> {selectedLoad.date}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase">Assigned Transporter</p>
                  <p className="text-sm font-semibold text-slate-900">{drivers.find(d => d.id === selectedLoad.driverId)?.name || 'Unassigned'}</p>
                </div>
              </div>

              {/* Financials */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-emerald-600 uppercase">Total Payout</p>
                    <p className="text-lg font-black text-emerald-700">R{selectedLoad.budget}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-emerald-600 uppercase">Broker Commission</p>
                    <p className="text-lg font-black text-emerald-700">R{Math.round(selectedLoad.budget * 0.05)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setViewModalOpen(false)} className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
