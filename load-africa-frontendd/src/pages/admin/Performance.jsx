import React, { useState, useEffect } from 'react';
import { Activity, Clock, BarChart3, TrendingUp, AlertCircle } from 'lucide-react';

export default function Performance() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/admin/performance-metrics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await response.json();
      if (res.success) {
        setMetrics(res.data);
      }
    } catch (error) {
      console.error('Error fetching performance metrics', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Performance & Metrics</h1>
        <p className="text-sm font-semibold text-slate-500">Live operational data and DOT tracking</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg DOT', value: metrics?.avgDot || '--', icon: Activity },
          { label: 'Avg Arrive Time', value: metrics?.avgArriveTime || '--', icon: Clock },
          { label: 'Avg Collection Time', value: metrics?.avgCollectionTime || '--', icon: Clock },
          { label: 'Total Weight Delivered', value: metrics?.totalWeight ? `${metrics.totalWeight} kg` : '--', icon: TrendingUp },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className={`p-3 rounded-xl inline-flex mb-4 bg-slate-50`}>
              <stat.icon className={`h-6 w-6 text-slate-500`} />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{loading ? '-' : stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center mt-6 min-h-[400px] flex flex-col justify-center items-center">
        <BarChart3 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900">Advanced Analytics Hub</h3>
        <p className="text-slate-500 text-sm mt-2 max-w-lg mx-auto mb-6">
          System is currently accumulating driver and fleet-wise performance metrics. DOT (Distance On Time) and efficiency graphs will render once enough TripPerformance models are populated.
        </p>
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl inline-block text-amber-800 text-sm">
          <p className="font-bold flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Data Collection Phase</p>
        </div>
      </div>
    </div>
  );
}
