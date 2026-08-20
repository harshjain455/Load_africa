import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Truck, User, Calendar, DollarSign } from 'lucide-react';

export default function BookingDetails() {
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Booking Details: {id}</h1>
          <p className="text-sm text-slate-500 font-medium">View full information for this booking</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" /> Customer Information
              </h3>
              <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">Name:</span> Patrice Motsepe</p>
                <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">Contact:</span> +27 82 123 4567</p>
                <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">Email:</span> patrice@example.com</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400" /> Route Details
              </h3>
              <div className="p-4 bg-slate-50 rounded-xl space-y-4">
                <div className="flex gap-3">
                  <div className="mt-1"><MapPin className="h-4 w-4 text-slate-400" /></div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Pickup Location</p>
                    <p className="text-sm font-medium text-slate-900">Johannesburg, Gauteng</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="mt-1"><MapPin className="h-4 w-4 text-amber-500" /></div>
                  <div>
                    <p className="text-xs font-bold text-amber-600 uppercase">Delivery Location</p>
                    <p className="text-sm font-medium text-slate-900">Cape Town, Western Cape</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Truck className="h-4 w-4 text-slate-400" /> Assignment Details
              </h3>
              <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">Status:</span> <span className="text-sky-600 font-bold bg-sky-100 px-2 py-0.5 rounded ml-2">Live</span></p>
                <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">Provider:</span> John Doe (Driver)</p>
                <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">Vehicle:</span> 1-3 Ton Truck</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-slate-400" /> Pricing & Schedule
              </h3>
              <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">Date:</span> 2023-10-15</p>
                <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">Estimated Cost:</span> R 15,000</p>
                <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">Payment:</span> Pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
