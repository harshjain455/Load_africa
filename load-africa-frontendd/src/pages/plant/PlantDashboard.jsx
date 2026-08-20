import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui';
import { Truck, Users, FileText, CheckCircle, Clock } from 'lucide-react';
import { plantService } from '../../services/plantService';

export default function PlantDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await plantService.getDashboard();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Loading dashboard...</div>;
  if (!data) return <div className="p-10 text-center text-red-500">Failed to load dashboard data</div>;

  const totalMachines = data.machines?.length || 0;
  const availableMachines = data.machines?.filter(m => m.status === 'AVAILABLE').length || 0;
  const totalOperators = data.operators?.length || 0;
  const pendingRequests = data.hire_requests?.filter(r => r.status === 'PENDING').length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 font-medium">Welcome back, {data.company_name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-l-4 border-yellow-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Machines</p>
              <h3 className="text-2xl font-black text-slate-800">{totalMachines}</h3>
            </div>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Truck className="h-5 w-5 text-yellow-500" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-emerald-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Available</p>
              <h3 className="text-2xl font-black text-slate-800">{availableMachines}</h3>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Operators</p>
              <h3 className="text-2xl font-black text-slate-800">{totalOperators}</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-rose-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Requests</p>
              <h3 className="text-2xl font-black text-slate-800">{pendingRequests}</h3>
            </div>
            <div className="p-2 bg-rose-50 rounded-lg">
              <FileText className="h-5 w-5 text-rose-500" />
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-500" /> Recent Hire Requests
          </h3>
          {data.hire_requests?.length > 0 ? (
            <div className="space-y-3">
              {data.hire_requests.slice(0, 5).map(req => (
                <div key={req.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Booking {req.booking_id.substring(0,8)}</p>
                    <p className="text-[10px] text-slate-500">{new Date(req.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${req.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No recent hire requests.</p>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Truck className="h-4 w-4 text-yellow-500" /> Your Machines
          </h3>
          {data.machines?.length > 0 ? (
            <div className="space-y-3">
              {data.machines.slice(0, 5).map(machine => (
                <div key={machine.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{machine.type}</p>
                    <p className="text-[10px] text-slate-500">{machine.registration_number}</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-1 rounded-md uppercase">
                    {machine.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">You haven't added any machines yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
