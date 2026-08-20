import React, { useState } from 'react';
import { Search, Filter, Truck, X, User, MapPin, CheckCircle2 } from 'lucide-react';

export default function QuoteRequests() {
  const [search, setSearch] = useState('');
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAssignClick = (req) => {
    setSelectedQuote(req);
    setAssignModalOpen(true);
  };

  const quoteRequests = [
    { id: 'QT-001', customer: 'Patrice Motsepe', pickup: 'Johannesburg', destination: 'Pretoria', vehicle: '1-3 Ton Truck', date: '2026-06-25', status: 'Pending' },
    { id: 'QT-002', customer: 'Wendy Appelbaum', pickup: 'Durban Port', destination: 'Centurion', vehicle: 'Flatbed', date: '2026-06-26', status: 'Pending' },
    { id: 'QT-003', customer: 'Stephen Saad', pickup: 'Cape Town', destination: 'Port Elizabeth', vehicle: 'Refrigerated', date: '2026-06-24', status: 'Pending' },
    { id: 'QT-004', customer: 'Patrice Motsepe', pickup: 'Rustenburg', destination: 'Coega Port', vehicle: 'Side Tipper', date: '2026-06-22', status: 'Assigned' },
    { id: 'QT-005', customer: 'Stephen Saad', pickup: 'Durban', destination: 'Johannesburg', vehicle: 'Tautliner', date: '2026-06-27', status: 'Pending' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quote Requests</h1>
          <p className="text-sm text-slate-500 font-medium">Manage and assign incoming customer quotation requests</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search customers or routes..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 bg-white rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Route</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Vehicle Req.</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quoteRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{req.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{req.customer}</td>
                  <td className="px-6 py-4 text-slate-600">
                    <span className="block text-xs font-semibold">{req.pickup}</span>
                    <span className="block text-[10px] text-slate-400">to {req.destination}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-slate-400" />
                      {req.vehicle}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs font-medium">{req.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border ${
                      req.status === 'Assigned' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {req.status === 'Pending' ? (
                      <button 
                        onClick={() => handleAssignClick(req)}
                        className="text-xs font-bold bg-amber-500 text-slate-950 px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors shadow-sm"
                      >
                        Assign Driver
                      </button>
                    ) : (
                      <button className="text-xs font-bold border border-slate-200 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                        View Assignment
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Driver Modal */}
      {assignModalOpen && selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setAssignModalOpen(false)} />
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg relative z-10 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-black text-slate-900">Assign Transporter</h2>
                <p className="text-sm text-slate-500">Allocate a driver for {selectedQuote.id}</p>
              </div>
              <button onClick={() => setAssignModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Load Info Summary */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Route</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedQuote.pickup} → {selectedQuote.destination}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase">Vehicle</p>
                  <p className="text-sm font-semibold text-slate-900 flex items-center gap-1 justify-end"><Truck className="h-3 w-3" /> {selectedQuote.vehicle}</p>
                </div>
              </div>

              {/* Driver Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Select Available Driver / Fleet</label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                  {/* Mock Drivers */}
                  {[
                    { id: 'DRV-1', name: 'Sipho Zuma', type: 'Independent Driver', location: selectedQuote.pickup, rating: 4.8 },
                    { id: 'DRV-2', name: 'Global Transport', type: 'Fleet Operator', location: selectedQuote.pickup, rating: 4.9 },
                    { id: 'DRV-3', name: 'Kagiso Sibanyoni', type: 'Independent Driver', location: 'Nearby', rating: 4.6 }
                  ].map(drv => (
                    <label key={drv.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:border-amber-500 hover:bg-amber-50/30 cursor-pointer transition-colors group">
                      <input type="radio" name="driverSelection" className="accent-amber-500" />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-bold text-slate-900 group-hover:text-amber-700">{drv.name}</p>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{drv.rating} ★</span>
                        </div>
                        <div className="flex gap-3 mt-1 text-[10px] font-semibold text-slate-500">
                          <span className="flex items-center gap-1"><User className="h-3 w-3" /> {drv.type}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {drv.location}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Commission/Rate Input */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Agreed Rate (R)</label>
                  <input type="number" defaultValue="4500" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 text-sm font-semibold" />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Broker Commission (%)</label>
                  <input type="number" defaultValue="10" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 text-sm font-semibold bg-slate-50" readOnly />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setAssignModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
                Cancel
              </button>
              <button 
                onClick={() => {
                  setAssignModalOpen(false);
                  setShowSuccess(true);
                  setTimeout(() => setShowSuccess(false), 3000);
                }} 
                className="px-6 py-2 bg-amber-500 text-slate-950 text-sm font-black rounded-xl hover:bg-amber-400 transition-colors shadow-sm"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast Popup */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
            <div className="bg-white/20 p-1.5 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-black text-sm">Assignment Successful!</p>
              <p className="text-xs font-semibold text-emerald-100">Transporter has been notified.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
