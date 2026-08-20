import React, { useState } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PlantOwners() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Pending');

  const [plantOwners, setPlantOwners] = useState([
    { id: 'PLT-4001', company: 'EarthMovers SA', contact: 'John Carter', machines: 12, type: 'Excavators', status: 'Pending' },
    { id: 'PLT-4002', company: 'Heavy Lift Co.', contact: 'Sarah Jenkins', machines: 5, type: 'Cranes', status: 'Approved' },
    { id: 'PLT-4003', company: 'BuildRite Plant', contact: 'Michael Doe', machines: 8, type: 'TLB', status: 'Pending' },
    { id: 'PLT-4004', company: 'Mining Plant Solutions', contact: 'Anna Venter', machines: 25, type: 'Dump Trucks', status: 'Rejected' },
    { id: 'PLT-4005', company: 'Gauteng Hire', contact: 'David Botha', machines: 15, type: 'Graders', status: 'Approved' },
  ]);

  const handleAction = (id, newStatus) => {
    setPlantOwners(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const filteredOwners = plantOwners.filter(p => {
    if (activeTab !== 'All' && p.status !== activeTab) return false;
    if (search && !p.company.toLowerCase().includes(search.toLowerCase()) && !p.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const tabs = ['All', 'Pending', 'Approved', 'Rejected'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Plant Owners</h1>
          <p className="text-sm text-slate-500 font-medium">Manage Yellow Plant equipment owner applications</p>
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
              placeholder="Search plant owners..." 
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
                <th className="px-6 py-3 font-bold text-slate-700">ID</th>
                <th className="px-6 py-3 font-bold text-slate-700">Company</th>
                <th className="px-6 py-3 font-bold text-slate-700 text-center">Machines</th>
                <th className="px-6 py-3 font-bold text-slate-700 text-center">Type</th>
                <th className="px-6 py-3 font-bold text-slate-700">Status</th>
                <th className="px-6 py-3 font-bold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {plantOwners.filter(p => (!search || p.company.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())) && (activeTab === 'All' || p.status === activeTab)).map((owner) => (
                <tr key={owner.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{owner.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{owner.company}</p>
                    <p className="text-xs text-slate-500">{owner.contact}</p>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-slate-700">{owner.machines}</td>
                  <td className="px-6 py-4 text-center text-slate-600">{owner.type}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      owner.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      owner.status === 'Pending' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {owner.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => navigate(`/admin-portal/plant-owners/${owner.id}`)} className="p-1.5 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-colors" title="View Details">
                        <Eye className="h-4 w-4" />
                      </button>
                      {owner.status === 'Pending' && (
                        <>
                          <button onClick={() => handleAction(owner.id, 'Approved')} className="p-1.5 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleAction(owner.id, 'Rejected')} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOwners.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-400 font-medium text-sm">
                    No plant owners found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
