import React, { useState } from 'react';
import { Search, Filter, Eye, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Bookings() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const navigate = useNavigate();

  // Mock Data for Bookings
  const bookings = [
    { id: 'BKG-6001', customer: 'Patrice Motsepe', origin: 'Johannesburg', dest: 'Cape Town', provider: 'John Doe (Driver)', status: 'Live', date: '2023-10-15' },
    { id: 'BKG-6002', customer: 'Aliko Dangote', origin: 'Durban', dest: 'Pretoria', provider: 'TransAfrica Haulage (Fleet)', status: 'Pending', date: '2023-10-16' },
    { id: 'BKG-6003', customer: 'Strive Masiyiwa', origin: 'Port Elizabeth', dest: 'Bloemfontein', provider: 'Michael Smith (Driver)', status: 'Accepted', date: '2023-10-17' },
    { id: 'BKG-6004', customer: 'Johann Rupert', origin: 'Cape Town', dest: 'George', provider: 'City Freight (Fleet)', status: 'Completed', date: '2023-10-10' },
    { id: 'BKG-6005', customer: 'Nassef Sawiris', origin: 'Rustenburg', dest: 'Johannesburg', provider: 'Unassigned', status: 'Cancelled', date: '2023-10-11' },
  ];

  const filteredBookings = bookings.filter(b => {
    if (activeTab !== 'All' && b.status !== activeTab) return false;
    if (search && !b.customer.toLowerCase().includes(search.toLowerCase()) && !b.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const tabs = ['All', 'Live', 'Pending', 'Accepted', 'Completed', 'Cancelled'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Bookings</h1>
          <p className="text-sm text-slate-500 font-medium">Monitor all platform bookings across all statuses</p>
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
              placeholder="Search by ID or customer..." 
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
                <th className="px-6 py-3 font-bold text-slate-700">Booking ID</th>
                <th className="px-6 py-3 font-bold text-slate-700">Customer</th>
                <th className="px-6 py-3 font-bold text-slate-700">Route</th>
                <th className="px-6 py-3 font-bold text-slate-700">Assigned Provider</th>
                <th className="px-6 py-3 font-bold text-slate-700">Status</th>
                <th className="px-6 py-3 font-bold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{booking.id}</p>
                    <p className="text-xs text-slate-500">{booking.date}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{booking.customer}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {booking.origin}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                        <MapPin className="h-3 w-3 text-amber-500" />
                        {booking.dest}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {booking.provider}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      booking.status === 'Live' ? 'bg-sky-100 text-sky-700' :
                      booking.status === 'Accepted' ? 'bg-indigo-100 text-indigo-700' :
                      booking.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-700' // Pending
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => navigate(`/admin-portal/bookings/${booking.id}`)}
                        className="p-1.5 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-colors" 
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-400 font-medium text-sm">
                    No bookings found matching criteria.
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
