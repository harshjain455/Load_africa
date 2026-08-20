import React from 'react';
import { Users, Truck, Briefcase, MapPin, CheckCircle2, AlertCircle, CreditCard, Box } from 'lucide-react';

export default function AdminDashboard() {
  
  const stats = [
    { label: 'Total Customers', value: '4,521', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Drivers', value: '1,204', icon: Truck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Fleet Accounts', value: '89', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Plant Owners', value: '42', icon: Box, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'Pending Approvals', value: '28', icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Today\'s Bookings', value: '1,432', icon: CheckCircle2, color: 'text-sky-500', bg: 'bg-sky-50' },
    { label: 'Active Trips', value: '234', icon: MapPin, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Revenue Summary', value: 'R1.2M', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-sm font-semibold text-slate-500">Platform operational overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className={`p-3 rounded-xl inline-flex mb-4 ${stat.bg}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
