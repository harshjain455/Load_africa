import React, { useState, useEffect } from 'react';
import { Search, Filter, History, Download, Calendar, Loader2 } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAuditLogs({ page, search });
      if (res.success) {
        setLogs(res.data);
        setTotalPages(res.meta.totalPages);
        setTotalLogs(res.meta.total);
      }
    } catch (error) {
      console.error('Error fetching audit logs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchLogs();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Audit Logs</h1>
          <p className="text-sm text-slate-500 font-medium">Track all administrative actions across the platform. Total: {totalLogs}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        
        {/* Advanced Filters Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">Event Type</label>
            <select className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-sm font-medium bg-white">
              <option>All Events</option>
              <option>Login / Logout</option>
              <option>Data Modification</option>
              <option>Approvals</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">User Email</label>
            <input 
              type="text" 
              placeholder="Filter by email..." 
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-sm font-medium"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">Date Range</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Select date range" 
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-sm font-medium"
              />
            </div>
          </div>
          <div className="flex items-end">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
              <Filter className="h-4 w-4" />
              Apply Filters
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search logs by action or description..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-sm font-medium"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto relative min-h-[300px]">
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
          )}
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-bold text-slate-700">Timestamp</th>
                <th className="px-6 py-3 font-bold text-slate-700">User Email</th>
                <th className="px-6 py-3 font-bold text-slate-700">Action Type</th>
                <th className="px-6 py-3 font-bold text-slate-700">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!loading && logs.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500 font-medium">No audit logs found.</td>
                </tr>
              )}
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{new Date(log.created_at).toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {log.user ? `${log.user.first_name || ''} ${log.user.last_name || ''} (${log.user.email})` : 'System / Unknown'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      log.action.includes('LOGIN') || log.action.includes('LOGOUT') ? 'bg-sky-100 text-sky-700' :
                      log.action.includes('APPROVED') || log.action.includes('VERIFIED') ? 'bg-green-100 text-green-700' :
                      log.action.includes('REJECTED') || log.action.includes('DELETED') || log.action.includes('FAILED') ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {log.description || 'No additional details'}
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
