import React, { useState } from 'react';
import { Save, Globe, Mail, ShieldCheck, MapPin, Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 800);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Platform Settings</h1>
          <p className="text-sm text-slate-500 font-medium">Configure global LoadAfrica application settings</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 text-slate-950 rounded-xl text-sm font-bold hover:bg-amber-400 transition-colors shadow-sm"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Localization & Region */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Globe className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Regional Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Operating Country</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 font-medium cursor-not-allowed" disabled>
                  <option>South Africa</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Default Currency</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 font-medium cursor-not-allowed" disabled>
                  <option>ZAR (South African Rand)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">System Timezone</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:border-amber-500 focus:outline-none">
                  <option>Africa/Johannesburg (SAST)</option>
                  <option>Africa/Harare (CAT)</option>
                  <option>UTC</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* API Keys */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <MapPin className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">API Configurations</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Google Maps API Key</label>
                <p className="text-xs text-slate-400 mb-2">Required for route calculation and tracking.</p>
                <input 
                  type="password" 
                  defaultValue="AIzaSyA8_some_fake_key_here_for_demo_99" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 text-sm font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Payment Gateway (PayGate / PayFast)</label>
                <input 
                  type="password" 
                  defaultValue="merchant_key_12345" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 text-sm font-mono"
                />
              </div>
            </div>
          </div>

          {/* Email Settings */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-violet-50 text-violet-600 rounded-lg">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">SMTP & Email Configuration</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">SMTP Server</label>
                <input type="text" defaultValue="smtp.loadafrica.com" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">SMTP Port</label>
                <input type="number" defaultValue="587" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">SMTP Username</label>
                <input type="text" defaultValue="noreply@loadafrica.com" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">SMTP Password</label>
                <input type="password" defaultValue="password123" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 text-sm" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
