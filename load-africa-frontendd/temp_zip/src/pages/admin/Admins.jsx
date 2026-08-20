import React, { useState } from 'react';
import { Search, Filter, ShieldCheck, Trash2, Edit, Plus, UserPlus } from 'lucide-react';

export default function Admins() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Mock Data for Admin Users
  const [admins, setAdmins] = useState([
    { id: 'ADM-001', name: 'System Admin', email: 'admin@loadafrica.com', role: 'System Admin', permissions: 'Full Access', lastLogin: '2023-10-20 09:00' },
    { id: 'ADM-002', name: 'Sarah Manager', email: 'sarah@loadafrica.com', role: 'Operations Manager', permissions: 'Drivers, Bookings', lastLogin: '2023-10-19 14:30' },
    { id: 'ADM-003', name: 'David Tech', email: 'david@loadafrica.com', role: 'Support Agent', permissions: 'Customers, Read-Only', lastLogin: '2023-10-18 10:15' },
  ]);

  const handleDelete = () => {
    if (deleteConfirmId) {
      setAdmins(prev => prev.filter(a => a.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const filteredAdmins = admins.filter(a => {
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admins</h1>
          <p className="text-sm text-slate-500 font-medium">Manage platform administrators and roles</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Add Admin
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search admins..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-sm font-medium"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-bold text-slate-700">Admin Details</th>
                <th className="px-6 py-3 font-bold text-slate-700">Role</th>
                <th className="px-6 py-3 font-bold text-slate-700">Permissions</th>
                <th className="px-6 py-3 font-bold text-slate-700">Last Login</th>
                <th className="px-6 py-3 font-bold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold">
                        {admin.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{admin.name}</p>
                        <p className="text-xs text-slate-500">{admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold flex w-max items-center gap-1.5">
                      <ShieldCheck className="h-3 w-3 text-slate-400" />
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium text-xs">
                    {admin.permissions}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {admin.lastLogin}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-colors" title="Edit Role">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirmId(admin.id)}
                        className={`p-1.5 rounded-lg transition-colors ${admin.role === 'System Admin' ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`} 
                        title="Delete Admin"
                        disabled={admin.role === 'System Admin'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAdmins.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400 font-medium text-sm">
                    No administrators found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md relative z-10 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-900">Create New Admin</h2>
              <p className="text-sm text-slate-500">Add a new administrator to the platform</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Full Name</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 text-sm" placeholder="John Doe" />
              </div>
              
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Email Address</label>
                <input type="email" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 text-sm" placeholder="john@loadafrica.com" />
              </div>
              
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Role</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 text-sm bg-white">
                  <option>Operations Manager</option>
                  <option>Support Agent</option>
                  <option>System Admin</option>
                </select>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-700">Permissions (Mock)</label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <label className="flex items-center gap-2"><input type="checkbox" className="accent-amber-500" defaultChecked /> Drivers</label>
                  <label className="flex items-center gap-2"><input type="checkbox" className="accent-amber-500" defaultChecked /> Bookings</label>
                  <label className="flex items-center gap-2"><input type="checkbox" className="accent-amber-500" /> Settings</label>
                  <label className="flex items-center gap-2"><input type="checkbox" className="accent-amber-500" /> Fleet</label>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors">
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm relative z-10 overflow-hidden">
            <div className="p-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-2">
                <Trash2 className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-black text-slate-900">Delete Admin?</h2>
              <p className="text-sm text-slate-500">
                Are you sure you want to delete this administrator? This action cannot be undone.
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
