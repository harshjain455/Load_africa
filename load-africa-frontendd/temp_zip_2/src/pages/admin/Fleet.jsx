import React, { useState } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Fleet() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Mock Data for Fleet Applications
  const [fleets, setFleets] = useState([
    { id: 'FLT-3001', company: 'TransAfrica Haulage', contact: 'Mark Johnson', tier: 'Enterprise', vehicles: 45, status: 'Pending' },
    { id: 'FLT-3002', company: 'City Freight Logistics', contact: 'Sarah Williams', tier: 'Professional', vehicles: 12, status: 'Approved' },
    { id: 'FLT-3003', company: 'Cape Transport Co.', contact: 'David Smith', tier: 'Starter', vehicles: 3, status: 'Pending' },
    { id: 'FLT-3004', company: 'Sunrise Logistics', contact: 'Peter Ndlovu', tier: 'Enterprise', vehicles: 120, status: 'Rejected' },
    { id: 'FLT-3005', company: 'Gauteng Express', contact: 'Alice Mokoena', tier: 'Professional', vehicles: 18, status: 'Approved' },
  ]);

  const handleAction = (id, newStatus) => {
    setFleets(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Fleet Accounts</h1>
          <p className="text-sm text-slate-500 font-medium">Manage fleet owner applications and accounts</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search fleets..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-sm font-medium"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors w-full sm:w-auto justify-center">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-bold text-slate-700">Company</th>
                <th className="px-6 py-3 font-bold text-slate-700">Contact Person</th>
                <th className="px-6 py-3 font-bold text-slate-700 text-center">Tier</th>
                <th className="px-6 py-3 font-bold text-slate-700 text-center">Vehicle Count</th>
                <th className="px-6 py-3 font-bold text-slate-700">Status</th>
                <th className="px-6 py-3 font-bold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fleets.filter(f => !search || f.company.toLowerCase().includes(search.toLowerCase()) || f.id.toLowerCase().includes(search.toLowerCase())).map((fleet) => (
                <tr key={fleet.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{fleet.company}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{fleet.contact}</td>
                  <td className="px-6 py-4 text-center text-slate-500">{fleet.tier}</td>
                  <td className="px-6 py-4 text-center font-bold text-slate-700">{fleet.vehicles}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      fleet.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      fleet.status === 'Pending' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {fleet.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => navigate(`/admin-portal/fleet/${fleet.id}`)} className="p-1.5 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-colors" title="View Details">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleAction(fleet.id, 'Approved')} className="p-1.5 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleAction(fleet.id, 'Rejected')} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
