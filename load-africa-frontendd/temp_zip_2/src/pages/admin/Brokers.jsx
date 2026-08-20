import React, { useState } from 'react';
import { Search, Filter, CheckCircle, XCircle, PauseCircle, Percent, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Brokers() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const navigate = useNavigate();

  // Mock Data
  const [brokers, setBrokers] = useState([
    { id: 'BRK-2001', name: 'Global Logistics Brokers', customers: 45, loads: 120, commission: '8%', status: 'Approved' },
    { id: 'BRK-2002', name: 'Africa Freight Link', customers: 12, loads: 34, commission: '10%', status: 'Pending' },
    { id: 'BRK-2003', name: 'Southern Star Trading', customers: 89, loads: 450, commission: '5%', status: 'Approved' },
    { id: 'BRK-2004', name: 'Quick Move Brokers', customers: 0, loads: 0, commission: '-', status: 'Rejected' },
    { id: 'BRK-2005', name: 'Eagle Eye Transits', customers: 34, loads: 102, commission: '7%', status: 'Suspended' },
  ]);

  const handleAction = (id, newStatus) => {
    setBrokers(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };
  
  const handleDelete = () => {
    if (deleteConfirmId) {
      setBrokers(prev => prev.filter(b => b.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const filteredBrokers = brokers.filter(b => {
    if (activeTab !== 'All' && b.status !== activeTab) return false;
    if (search && !b.name.toLowerCase().includes(search.toLowerCase()) && !b.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const tabs = ['All', 'Approved', 'Pending', 'Suspended', 'Rejected'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Brokers</h1>
          <p className="text-sm text-slate-500 font-medium">Manage freight brokers on the platform</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50 px-4 pt-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? 'border-amber-500 text-amber-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search brokers..." 
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
                <th className="px-6 py-3 font-bold text-slate-700">Broker ID</th>
                <th className="px-6 py-3 font-bold text-slate-700">Company Name</th>
                <th className="px-6 py-3 font-bold text-slate-700 text-center">Customers</th>
                <th className="px-6 py-3 font-bold text-slate-700 text-center">Loads</th>
                <th className="px-6 py-3 font-bold text-slate-700 text-center">Commission</th>
                <th className="px-6 py-3 font-bold text-slate-700">Status</th>
                <th className="px-6 py-3 font-bold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBrokers.map((broker) => (
                <tr key={broker.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{broker.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{broker.name}</td>
                  <td className="px-6 py-4 text-center text-slate-500">{broker.customers}</td>
                  <td className="px-6 py-4 text-center text-slate-500">{broker.loads}</td>
                  <td className="px-6 py-4 text-center font-bold text-slate-700">{broker.commission}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      broker.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      broker.status === 'Pending' ? 'bg-blue-100 text-blue-700' :
                      broker.status === 'Suspended' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {broker.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => navigate(`/admin-portal/brokers/${broker.id}`)} className="p-1.5 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-colors" title="View Profile">
                        <Eye className="h-4 w-4" />
                      </button>
                      {broker.status !== 'Approved' && (
                        <button onClick={() => handleAction(broker.id, 'Approved')} className="p-1.5 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors" title="Activate/Approve">
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      {broker.status !== 'Suspended' && (
                        <button onClick={() => handleAction(broker.id, 'Suspended')} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Suspend">
                          <PauseCircle className="h-4 w-4" />
                        </button>
                      )}
                      {broker.status === 'Pending' && (
                        <button onClick={() => handleAction(broker.id, 'Rejected')} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button onClick={() => setDeleteConfirmId(broker.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBrokers.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-400 font-medium text-sm">
                    No brokers found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm relative z-10 overflow-hidden">
            <div className="p-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-2">
                <Trash2 className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-black text-slate-900">Delete Broker?</h2>
              <p className="text-sm text-slate-500">
                Are you sure you want to delete this broker? This action cannot be undone.
              </p>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
