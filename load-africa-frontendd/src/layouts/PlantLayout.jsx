import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Truck, DollarSign, Menu, X, LogOut, User, FileText, Users
} from 'lucide-react';
import { plantService } from '../services/plantService';
import { authService } from '../services/authService';

export default function PlantLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getCurrentUser());
  
  useEffect(() => {
    const handleUpdate = () => setUser(authService.getCurrentUser());
    window.addEventListener('user-updated', handleUpdate);
    return () => window.removeEventListener('user-updated', handleUpdate);
  }, []);

  const userDisplayName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Plant Owner';
  const companyName = user?.email || 'Registered Plant Owner';

  const navItems = [
    { name: 'Dashboard', path: '/plant-portal/dashboard', icon: LayoutDashboard },
    { name: 'My Machines', path: '/plant-portal/machines', icon: Truck },
    { name: 'Operators', path: '/plant-portal/operators', icon: Users },
    { name: 'Hire Requests', path: '/plant-portal/requests', icon: FileText },
    { name: 'Revenue', path: '/plant-portal/revenue', icon: DollarSign },
  ];

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };
  
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-2">
        <Truck className="h-8 w-8 text-yellow-500" />
        <span className="font-extrabold text-xl tracking-tight text-white">
          Load<span className="text-yellow-500">Africa</span>
        </span>
        <span className="text-[10px] bg-yellow-500/20 text-yellow-400 font-semibold px-1.5 py-0.5 rounded border border-yellow-500/30">PLANT</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                active
                  ? 'bg-yellow-500 text-slate-950 shadow-lg shadow-yellow-500/20 font-semibold'
                  : 'hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Icon className={`h-5 w-5 mr-3 ${active ? 'text-slate-950' : 'text-slate-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 py-3 rounded-xl bg-slate-800/40 border border-slate-800">
          <div className="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center font-black text-slate-950 text-sm shrink-0 shadow-md shadow-yellow-500/10">
            {userDisplayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'PL'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">{userDisplayName}</p>
            <p className="text-xs text-slate-400 truncate">{companyName}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-3 flex w-full items-center justify-center px-4 py-2.5 text-sm font-medium border border-slate-800 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 rounded-xl text-slate-400 transition-all duration-200"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-800 flex font-sans">
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-300 shrink-0">
        <SidebarContent />
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute top-3 right-3">
          <button onClick={() => setIsMobileOpen(false)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="relative h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-50 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileOpen(true)} className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100">
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-lg font-black text-slate-900 tracking-tight">Plant Owner Portal</h1>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/50">
          <div className="max-w-7xl mx-auto pb-20">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
