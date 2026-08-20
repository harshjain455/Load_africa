import React from 'react';
import { FileText, MapPin, Users, CreditCard, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BrokerDashboard() {
  const stats = [
    { label: 'Pending Quotes', value: '12', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Assigned Bookings', value: '34', icon: MapPin, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'My Customers', value: '89', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Commission Earned', value: 'R18,200', icon: CreditCard, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  const recentQuotes = [
    { id: 'QT-001', customer: 'Patrice Motsepe', pickup: 'Johannesburg', destination: 'Pretoria', vehicle: '1-3 Ton Truck', status: 'Pending' },
    { id: 'QT-002', customer: 'Wendy Appelbaum', pickup: 'Durban Port', destination: 'Centurion', vehicle: 'Flatbed', status: 'Pending' },
    { id: 'QT-003', customer: 'Stephen Saad', pickup: 'Cape Town', destination: 'Port Elizabeth', vehicle: 'Refrigerated', status: 'Pending' },
  ];

  const assignedBookings = [
    { id: 'BK-101', status: 'In Transit', driver: 'Sipho Zuma', fleet: '-', eta: '2 hrs' },
    { id: 'BK-102', status: 'Pickup Arrived', driver: 'Kagiso Sibanyoni', fleet: 'Global Transport', eta: '30 mins' },
    { id: 'BK-103', status: 'Assigned', driver: 'Mzwandile Reginald', fleet: 'Swift Movers', eta: 'Tomorrow 08:00' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-sm font-semibold text-slate-500">Monitor your quotes, bookings, and commissions.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className={`p-3 rounded-xl inline-flex mb-4 ${stat.bg}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Quote Requests */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-base font-black text-slate-900 tracking-tight">Recent Quote Requests</h2>
            <Link to="/broker/quote-requests" className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider">Customer</th>
                  <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider">Route</th>
                  <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider">Vehicle</th>
                  <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentQuotes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-900">{q.customer}</td>
                    <td className="px-5 py-3 text-slate-600">
                      <span className="block text-xs">{q.pickup}</span>
                      <span className="block text-xs text-slate-400">to {q.destination}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-600 text-xs">{q.vehicle}</td>
                    <td className="px-5 py-3 text-right">
                      <button className="text-xs font-bold bg-amber-500 text-slate-950 px-3 py-1.5 rounded-lg hover:bg-amber-400 transition-colors">
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Assigned Bookings */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-base font-black text-slate-900 tracking-tight">Recent Assigned Bookings</h2>
            <Link to="/broker/assigned-loads" className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider">ID</th>
                  <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider">Assigned To</th>
                  <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider">ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignedBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-900">{b.id}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider rounded-md border border-emerald-100">
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      <span className="block text-xs font-semibold">{b.driver}</span>
                      <span className="block text-[10px] text-slate-400">{b.fleet}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-500 font-medium text-xs">{b.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
