import React, { useState } from 'react';
import { Search, Filter, Trash2, PauseCircle, CheckCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Customers() {
  const [search, setSearch] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const navigate = useNavigate();

  // Mock Data for Customers
  const [customers, setCustomers] = useState([
    { id: 'CST-5001', name: 'Patrice Motsepe', email: 'patrice@arm.co.za', bookings: 142, status: 'Active', joined: '2023-01-15' },
    { id: 'CST-5002', name: 'Aliko Dangote', email: 'aliko@dangote.com', bookings: 89, status: 'Active', joined: '2023-03-22' },
    { id: 'CST-5003', name: 'Strive Masiyiwa', email: 'strive@econet.com', bookings: 21, status: 'Suspended', joined: '2023-05-10' },
    { id: 'CST-5004', name: 'Nassef Sawiris', email: 'nassef@oci.com', bookings: 0, status: 'Active', joined: '2023-08-01' },
    { id: 'CST-5005', name: 'Johann Rupert', email: 'johann@remgro.com', bookings: 56, status: 'Active', joined: '2022-11-30' },
  ]);

  const handleStatusChange = (id, newStatus) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleDelete = () => {
    if (deleteConfirmId) {
      setCustomers(prev => prev.filter(c => c.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const filteredCustomers = customers.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customers</h1>
          <p className="text-sm text-slate-500 font-medium">Manage platform customers and their booking history</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
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
                <th className="px-6 py-3 font-bold text-slate-700">Customer Details</th>
                <th className="px-6 py-3 font-bold text-slate-700 text-center">Total Bookings</th>
                <th className="px-6 py-3 font-bold text-slate-700 text-center">Joined Date</th>
                <th className="px-6 py-3 font-bold text-slate-700">Status</th>
                <th className="px-6 py-3 font-bold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase())).map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{customer.name}</p>
                    <p className="text-xs text-slate-500">{customer.email}</p>
                    <p className="text-xs text-slate-400 mt-0.5">ID: {customer.id}</p>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-slate-700">{customer.bookings}</td>
                  <td className="px-6 py-4 text-center text-slate-500">{customer.joined}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => navigate(`/admin-portal/customers/${customer.id}`)} className="p-1.5 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-colors" title="View History">
                        <Eye className="h-4 w-4" />
                      </button>
                      {customer.status === 'Suspended' ? (
                        <button onClick={() => handleStatusChange(customer.id, 'Active')} className="p-1.5 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors" title="Reactivate">
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      ) : (
                        <button onClick={() => handleStatusChange(customer.id, 'Suspended')} className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors" title="Suspend">
                          <PauseCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button onClick={() => setDeleteConfirmId(customer.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400 font-medium text-sm">
                    No customers found.
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
              <h2 className="text-xl font-black text-slate-900">Delete Customer?</h2>
              <p className="text-sm text-slate-500">
                Are you sure you want to delete this customer? This action cannot be undone.
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
