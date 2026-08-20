import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Truck, FileText } from 'lucide-react';

export default function FleetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Fleet Details: {id}</h1>
          <p className="text-sm text-slate-500 font-medium">View fleet owner profile and fleet statistics</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-400" /> Company Information
              </h3>
              <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">Company:</span> TransAfrica Haulage</p>
                <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">Contact:</span> Mark Johnson</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
