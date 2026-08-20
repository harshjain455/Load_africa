import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, Activity, Calendar, Shield } from 'lucide-react';

export default function CustomerDetails() {
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Details: {id}</h1>
          <p className="text-sm text-slate-500 font-medium">View full customer profile and history</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" /> Personal Information
              </h3>
              <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">Full Name:</span> Patrice Motsepe</p>
                <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900 flex items-center gap-1"><Phone className="h-3 w-3" /> Phone:</span> +27 82 123 4567</p>
                <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900 flex items-center gap-1"><Mail className="h-3 w-3" /> Email:</span> patrice@arm.co.za</p>
                <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900 flex items-center gap-1"><Calendar className="h-3 w-3" /> Joined:</span> 2023-01-15</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-slate-400" /> Account Status
              </h3>
              <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">Current Status:</span> <span className="text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded ml-2">Active</span></p>
                <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">Total Bookings:</span> 142</p>
                <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">Account Type:</span> Enterprise Customer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
