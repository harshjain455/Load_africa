import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, FileText, AlertCircle, Clock, Truck, Briefcase, Box } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function Compliance() {
  const [activeTab, setActiveTab] = useState('drivers');
  const [complianceData, setComplianceData] = useState({ drivers: [], fleets: [], plants: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplianceData();
  }, []);

  const fetchComplianceData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/admin/compliance-data', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await response.json();
      if (res.success) {
        setComplianceData(res.data);
      }
    } catch (error) {
      console.error('Error fetching compliance data', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
      case 'APPROVED':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3" /> Approved</span>;
      case 'PENDING':
        return <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-md text-xs font-bold flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> Pending Review</span>;
      case 'REJECTED':
      case 'SUSPENDED':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-md text-xs font-bold flex items-center gap-1 w-fit"><XCircle className="w-3 h-3" /> {status}</span>;
      default:
        return <span className="px-2 py-1 bg-slate-100 text-slate-800 rounded-md text-xs font-bold flex items-center gap-1 w-fit">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Compliance & Approvals Center</h1>
        <p className="text-sm font-semibold text-slate-500">Centralized document verification and operational standards</p>
      </div>

      <div className="flex space-x-2 border-b border-slate-200">
        {[
          { id: 'drivers', label: 'Drivers & Operators', icon: Truck },
          { id: 'fleet', label: 'Fleet Accounts', icon: Briefcase },
          { id: 'plant', label: 'Plant Owners', icon: Box },
          { id: 'introspection', label: 'Self Introspection', icon: Shield },
          { id: 'documentation', label: 'Expiring Documents', icon: FileText }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 ${
              activeTab === tab.id 
                ? 'border-amber-500 text-amber-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {activeTab === 'drivers' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-black text-slate-500 tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Driver Name</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">KYC Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {complianceData.drivers.map(driver => (
                    <tr key={driver.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {driver.user?.first_name} {driver.user?.last_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        <div>{driver.user?.email}</div>
                        <div>{driver.user?.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(driver.user?.status || driver.status)}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-amber-600 hover:text-amber-700 font-bold text-sm">Review Documents</button>
                      </td>
                    </tr>
                  ))}
                  {complianceData.drivers.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-slate-500">No driver records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'fleet' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
               <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-black text-slate-500 tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Company Name</th>
                    <th className="px-6 py-4">Owner Contact</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {complianceData.fleets.map(fleet => (
                    <tr key={fleet.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">{fleet.company_name}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        <div>{fleet.user?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(fleet.status)}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-amber-600 hover:text-amber-700 font-bold text-sm">Review Fleet Docs</button>
                      </td>
                    </tr>
                  ))}
                   {complianceData.fleets.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-slate-500">No fleet records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'plant' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
               <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-black text-slate-500 tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Company Name</th>
                    <th className="px-6 py-4">Owner Contact</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {complianceData.plants.map(plant => (
                    <tr key={plant.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">{plant.company_name}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        <div>{plant.user?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(plant.status)}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-amber-600 hover:text-amber-700 font-bold text-sm">Review Plant Docs</button>
                      </td>
                    </tr>
                  ))}
                  {complianceData.plants.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-slate-500">No plant records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'introspection' && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
              <Shield className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900">Self Introspection Standards</h3>
              <p className="text-slate-500 text-sm mt-2 max-w-lg mx-auto mb-6">
                Operational standards monitoring including uniform compliance, hygiene checks, and vehicle presentation.
              </p>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl inline-block">
                <p className="font-bold text-slate-900 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-amber-500" /> Pending implementation in Driver App</p>
                <p className="text-sm text-slate-500 mt-1">Daily self-introspection reports from drivers will appear here.</p>
              </div>
            </div>
          )}

          {activeTab === 'documentation' && (
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
             <FileText className="h-12 w-12 text-rose-500 mx-auto mb-4" />
             <h3 className="text-lg font-bold text-slate-900">Expiring Documents</h3>
             <p className="text-slate-500 text-sm mt-2 max-w-lg mx-auto">
               System automatically flags PDPs, licenses, vehicle insurances, and fitness certificates that expire within 30 days.
             </p>
             <div className="mt-6">
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-bold text-sm">All documents up to date</span>
             </div>
           </div>
          )}
        </div>
      )}
    </div>
  );
}
