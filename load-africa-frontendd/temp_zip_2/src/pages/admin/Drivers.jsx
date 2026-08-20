import React, { useState } from 'react';
import { Users, AlertCircle, CheckCircle2, XCircle, Eye, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Drivers() {
  const navigate = useNavigate();
  const [driverApplications, setDriverApplications] = useState([
    { id: 1, name: 'Samson Mamogobo', email: 'samson.mamogobo@gmail.com', vehicle: '1-3 Ton Truck', status: 'rejected' },
    { id: 2, name: 'MZWANDILE REGINALD QWADIKAZI', email: 'klornaq@gmail.com', vehicle: 'Furniture Truck', status: 'pending' },
    { id: 3, name: 'Mogomotsi Msumba', email: 'mmmsumba@gmail.com', vehicle: 'Bakkie', status: 'rejected' },
    { id: 4, name: 'Meluxolo Jara', email: 'melujara77@gmail.com', vehicle: '1-3 Ton Truck', status: 'rejected' },
    { id: 5, name: 'Lesiba Sydney Chukudu', email: 'sylktech@yahoo.com', vehicle: 'Bakkie', status: 'rejected' },
    { id: 6, name: 'Kamogelo', email: 'mailasamkelo5@gmail.com', vehicle: '1-3 Ton Truck', status: 'rejected' },
    { id: 7, name: 'Khumo Mosathupa', email: 'khumo@blutrans.co.za', vehicle: 'Bakkie', status: 'rejected' },
    { id: 8, name: 'Sinethemba Sobashe', email: 'sinethembasobashe@gmai.com', vehicle: 'Bakkie', status: 'approved' },
    { id: 9, name: 'mining', email: 'miningsharesforyou@gmail.com', vehicle: '4-8 Ton Truck', status: 'pending' },
    { id: 10, name: 'Gaolekwe herries Mohitshane', email: 'gaolekweherries@gmail.com', vehicle: 'Bakkie', status: 'approved' },
    { id: 11, name: 'Mzwa', email: 'enjoytheworld75@gmail.com', vehicle: 'Side Tipper', status: 'approved' },
    { id: 12, name: 'Sizwe Mnkomo', email: 'sizwemagagula77@gmail.com', vehicle: 'Bakkie', status: 'approved' },
    { id: 13, name: 'Kagiso Sibanyoni', email: 'sibanyonikagiso@gmail.com', vehicle: '1-3 Ton Truck', status: 'approved' },
    { id: 14, name: 'Reginald', email: 'qwadikaziz@gmail.com', vehicle: 'Tautliner / Side-curtain', status: 'approved' },
  ]);

  const handleAction = (id, newStatus) => {
    setDriverApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
  };

  const driverStats = [
    { value: driverApplications.length.toString(), label: 'Total Drivers', icon: Users, iconColor: 'text-slate-500' },
    { value: driverApplications.filter(d => d.status === 'pending').length.toString(), label: 'Pending', icon: AlertCircle, iconColor: 'text-amber-500' },
    { value: driverApplications.filter(d => d.status === 'approved').length.toString(), label: 'Approved', icon: CheckCircle2, iconColor: 'text-green-500' },
    { value: driverApplications.filter(d => d.status === 'rejected').length.toString(), label: 'Rejected', icon: XCircle, iconColor: 'text-red-500' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Driver Applications</h1>
        <p className="text-sm font-semibold text-slate-500">Manage and review all driver signups.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {driverStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
              <Icon className={`h-6 w-6 mb-2 ${stat.iconColor}`} />
              <span className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</span>
            </div>
          );
        })}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-4 font-bold text-slate-500">Name</th>
                <th className="px-5 py-4 font-bold text-slate-500">Email</th>
                <th className="px-5 py-4 font-bold text-slate-500">Vehicle</th>
                <th className="px-5 py-4 font-bold text-slate-500">Status</th>
                <th className="px-5 py-4 font-bold text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {driverApplications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-slate-900 whitespace-nowrap">{app.name}</td>
                  <td className="px-5 py-4 text-slate-600 whitespace-nowrap">{app.email}</td>
                  <td className="px-5 py-4 text-slate-600 whitespace-nowrap">{app.vehicle}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-3 py-1 text-[10px] font-bold rounded-full lowercase tracking-wider ${
                      app.status === 'rejected' ? 'bg-[#d32f2f] text-white' :
                      app.status === 'pending' ? 'bg-slate-200 text-slate-700' :
                      'bg-slate-900 text-white' // approved
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {app.status === 'pending' && (
                        <>
                          <button onClick={() => handleAction(app.id, 'approved')} className="text-green-500 hover:text-green-600 transition-colors" title="Approve">
                            <Check className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleAction(app.id, 'rejected')} className="text-red-500 hover:text-red-600 transition-colors" title="Reject">
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button onClick={() => navigate(`/admin-portal/drivers/${app.id}`)} className="text-slate-600 hover:text-slate-900 transition-colors" title="View">
                        <Eye className="h-4 w-4" />
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
