import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserCheck, Truck, Briefcase, ShieldAlert, BarChart3, Zap } from 'lucide-react';

export default function QuickLoginSelector({ setEmail, setPassword, setSecretKey, stayOnPage = false, setDashboard }) {
  const navigate = useNavigate();
  const location = useLocation();

  const panels = [
    {
      role: 'Customer',
      path: '/customer/login',
      dashboard: '/customer/dashboard',
      email: 'patrice@arm.co.za',
      password: 'password123',
      icon: UserCheck,
      color: 'text-blue-600',
      bg: 'bg-blue-50 hover:bg-blue-100',
      border: 'border-blue-100 hover:border-blue-200',
      subtitle: 'Shipper'
    },
    {
      role: 'Driver',
      path: '/driver/login',
      dashboard: '/driver/dashboard',
      email: 'sipho.zuma@load-driver.co.za',
      password: 'password123',
      icon: Truck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 hover:bg-emerald-100',
      border: 'border-emerald-100 hover:border-emerald-200',
      subtitle: 'Transporter'
    },
    {
      role: 'Fleet',
      path: '/fleet/login',
      dashboard: '/fleet-portal/dashboard',
      email: 'fleet@loadafrica.co.za',
      password: 'password123',
      icon: Briefcase,
      color: 'text-amber-600',
      bg: 'bg-amber-50 hover:bg-amber-100',
      border: 'border-amber-100 hover:border-amber-200',
      subtitle: 'Fleet Owner'
    },
    {
      role: 'Admin',
      path: '/admin/login',
      dashboard: '/admin-portal/dashboard',
      email: 'admin@loadafrica.com',
      password: 'admin123',
      icon: ShieldAlert,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 hover:bg-indigo-100',
      border: 'border-indigo-100 hover:border-indigo-200',
      subtitle: 'Administrator'
    },
    {
      role: 'Broker',
      path: '/broker/login',
      dashboard: '/broker/dashboard',
      email: 'lwazi.dlamini@loadafrica-broker.co.za',
      password: 'password123',
      icon: BarChart3,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50 hover:bg-cyan-100',
      border: 'border-cyan-100 hover:border-cyan-200',
      subtitle: 'Freight Broker'
    },
    {
      role: 'Plant',
      path: '/plant/login',
      dashboard: '/plant-portal/dashboard',
      email: 'plant@loadafrica.co.za',
      password: 'password123',
      icon: Zap,
      color: 'text-rose-600',
      bg: 'bg-rose-50 hover:bg-rose-100',
      border: 'border-rose-100 hover:border-rose-200',
      subtitle: 'Plant Owner'
    }
  ];

  const handleClick = (panel) => {
    if (stayOnPage || (location && location.pathname === panel.path)) {
      setEmail(panel.email);
      setPassword(panel.password);
      if (panel.role === 'Admin' && setSecretKey) {
        setSecretKey('AFRICA_ADMIN_2026');
      }
      if (setDashboard) setDashboard(panel.dashboard);
    } else {
      navigate(panel.path, { 
        state: { 
          email: panel.email, 
          password: panel.password,
          secretKey: panel.role === 'Admin' ? 'AFRICA_ADMIN_2026' : undefined
        } 
      });
    }
  };

  return (
    <div className="mt-4">
      <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
        Quick Demo Login
      </p>
      <div className="grid grid-cols-2 gap-3">
        {panels.map((panel) => {
          return (
            <button
              key={panel.role}
              type="button"
              onClick={() => handleClick(panel)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm group ${panel.bg} ${panel.border}`}
            >
              <panel.icon className={`h-5 w-5 mb-1.5 ${panel.color} group-hover:scale-110 transition-transform`} />
              <span className={`text-[11px] font-extrabold uppercase tracking-wide text-slate-700 group-hover:text-slate-900 transition-colors`}>
                {panel.role} Panel
              </span>
              <span className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-wider font-semibold">
                {panel.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
