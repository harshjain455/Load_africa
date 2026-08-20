import React, { useState, useEffect } from 'react';
import { Users, Truck, Briefcase, MapPin, CheckCircle2, AlertCircle, CreditCard, Box, Target, Clock, ShieldAlert } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AdminDashboard() {
  const [statsData, setStatsData] = useState(null);
  const [complianceData, setComplianceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, compRes] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getComplianceData().catch(() => ({ success: false, data: null }))
        ]);
        if (statsRes.success) {
          setStatsData(statsRes.data);
        }
        if (compRes?.success) {
          setComplianceData(compRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: 'Total Customers', value: statsData?.customers ?? '-', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Total Drivers', value: statsData?.drivers ?? '-', icon: Truck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Drivers Available', value: statsData?.driversAvailable ?? '-', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Fleet Accounts', value: statsData?.fleetAccounts ?? '-', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Plant Owners', value: statsData?.plantOwners ?? '-', icon: Box, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'Pending Approvals', value: statsData?.pendingApprovals ?? '-', icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Today\'s Bookings', value: statsData?.todayBookings ?? '-', icon: Clock, color: 'text-sky-500', bg: 'bg-sky-50' },
    { label: 'Active Trips', value: statsData?.activeTrips ?? '-', icon: MapPin, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Searching Transporter', value: statsData?.transportersSearching ?? '-', icon: Target, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Manual Action Reqd', value: statsData?.manualAssignmentsRequired ?? '-', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Revenue Summary', value: statsData?.revenueSummary ?? '-', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const lifecycle = statsData?.bookingLifecycle || {};

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Control Center</h1>
        <p className="text-sm font-semibold text-slate-500">Live platform operational overview</p>
      </div>

      {/* Top KPIs */}
      <section>
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4">Live KPIs</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className={`p-2.5 rounded-xl inline-flex mb-3 ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{loading ? '-' : stat.value}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Booking Lifecycle Overview */}
      <section>
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4">Booking Lifecycle Overview</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-center">
            {[
              { label: 'Quote Req', val: lifecycle.QUOTE_REQUESTED || 0 },
              { label: 'Quote Prep', val: lifecycle.QUOTE_PREPARED || 0 },
              { label: 'Cust Acc', val: lifecycle.CUSTOMER_ACCEPTED || 0 },
              { label: 'Searching', val: lifecycle.DRIVER_SEARCHING || 0 },
              { label: 'Offer Sent', val: lifecycle.DRIVER_OFFER_SENT || 0 },
              { label: 'Pay Pnding', val: lifecycle.PAYMENT_PENDING || 0 },
              { label: 'In Transit', val: lifecycle.IN_TRANSIT || 0 },
              { label: 'Delivered', val: lifecycle.DELIVERED || 0 }
            ].map((stage, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-2xl font-black text-slate-900">{loading ? '-' : stage.val}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase">{stage.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Split Views */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Target className="h-4 w-4 text-amber-500" />
            Active Matching
          </h2>
          {statsData?.transportersSearching > 0 ? (
             <div className="text-center py-8">
               <Target className="h-10 w-10 text-rose-500 mx-auto animate-pulse mb-3" />
               <p className="font-bold text-slate-900">{statsData.transportersSearching} bookings actively searching</p>
               <p className="text-xs text-slate-500 mt-1">Check Transporter Matching module for details.</p>
             </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
              <p className="font-bold text-slate-900">All matched</p>
              <p className="text-xs text-slate-500 mt-1">No bookings are currently searching for drivers.</p>
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-500" />
            Attention Required
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-red-50 text-red-700 rounded-lg border border-red-100">
              <span className="font-bold text-sm">Manual Assignments Required</span>
              <span className="font-black">{statsData?.manualAssignmentsRequired || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-amber-50 text-amber-700 rounded-lg border border-amber-100">
              <span className="font-bold text-sm">Pending KYC/Approvals</span>
              <span className="font-black">{statsData?.pendingApprovals || 0}</span>
            </div>
          </div>
        </section>
      </div>

      {/* Compliance Overview Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-6">
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-purple-500" />
          Platform Compliance Overview
        </h2>
        {complianceData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
              <span className="font-bold text-sm text-slate-700">Uniform Standards</span>
              <span className="font-black text-lg text-emerald-600">{complianceData.uniformCompliancePct || 0}%</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
              <span className="font-bold text-sm text-slate-700">Hygiene & Cleanliness</span>
              <span className="font-black text-lg text-emerald-600">{complianceData.hygieneCompliancePct || 0}%</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
              <span className="font-bold text-sm text-slate-700">Valid Documentation</span>
              <span className="font-black text-lg text-emerald-600">{complianceData.docCompliancePct || 0}%</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500 text-sm font-medium">
            Loading compliance data...
          </div>
        )}
      </section>

    </div>
  );
}
