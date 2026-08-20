import React, { useState } from 'react';
import { Search, Filter, CreditCard, ArrowUpRight, Calendar } from 'lucide-react';

export default function Commission() {
  const [search, setSearch] = useState('');

  const commissionLogs = [
    { id: 'CM-1001', bookingId: 'BK-101', customer: 'Patrice Motsepe', amount: 'R1,200', date: '2026-06-25', status: 'Paid' },
    { id: 'CM-1002', bookingId: 'BK-103', customer: 'Wendy Appelbaum', amount: 'R3,800', date: '2026-06-24', status: 'Paid' },
    { id: 'CM-1003', bookingId: 'BK-105', customer: 'Stephen Saad', amount: 'R950', date: '2026-06-22', status: 'Paid' },
    { id: 'CM-1004', bookingId: 'BK-107', customer: 'Patrice Motsepe', amount: 'R4,500', date: '2026-06-20', status: 'Paid' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Commission</h1>
          <p className="text-sm text-slate-500 font-medium">Track your earned commissions from assigned bookings</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="p-3 rounded-xl inline-flex mb-4 bg-green-50">
            <CreditCard className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Earned</p>
          <p className="text-3xl font-black text-slate-900 tracking-tight">R10,450</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="p-3 rounded-xl inline-flex mb-4 bg-amber-50">
            <Calendar className="h-6 w-6 text-amber-600" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">This Month</p>
          <p className="text-3xl font-black text-slate-900 tracking-tight">R4,500</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="p-3 rounded-xl inline-flex mb-4 bg-blue-50">
            <ArrowUpRight className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pending Payout</p>
          <p className="text-3xl font-black text-slate-900 tracking-tight">R0</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search commissions..."
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
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-right">Amount</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {commissionLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{log.id}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{log.bookingId}</td>
                  <td className="px-6 py-4 text-slate-600">{log.customer}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs font-medium">{log.date}</td>
                  <td className="px-6 py-4 font-black text-slate-900 text-right">{log.amount}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider rounded-md border border-green-100">
                      {log.status}
                    </span>
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
