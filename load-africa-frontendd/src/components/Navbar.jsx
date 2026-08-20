import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Truck, Menu, X } from 'lucide-react';
import { authService } from '../services/authService';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(authService.getCurrentUser());

  useEffect(() => {
    const handleUserUpdate = () => {
      setUser(authService.getCurrentUser());
    };
    window.addEventListener('user-updated', handleUserUpdate);
    return () => window.removeEventListener('user-updated', handleUserUpdate);
  }, []);

  const navTo = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleLogout = () => {
    authService.logout();
  };

  const handleDashboardClick = () => {
    if (!user) return navigate('/login');
    switch (user.role) {
      case 'CUSTOMER': navigate('/customer/dashboard'); break;
      case 'DRIVER': navigate('/driver/dashboard'); break;
      case 'FLEET_OWNER': navigate('/fleet-portal/dashboard'); break;
      case 'BROKER': navigate('/broker/dashboard'); break;
      case 'ADMIN': 
      case 'SUPER_ADMIN': 
        navigate('/admin-portal/dashboard'); break;
      default: navigate('/login');
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const links = [
    { label: 'Customers', path: '/customers' },
    { label: 'Drivers', path: '/drivers' },
    { label: 'Fleet', path: '/fleet' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 lg:px-8 w-full">
          <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => navTo('/')}>
            <Truck className="h-6 w-6 text-[#f99c00] stroke-[1.8]" />
            <span className="font-extrabold text-xl tracking-tight text-slate-950 uppercase">LOADAFRICA</span>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600">
            {links.map(({ label, path }) => (
              <button key={path} onClick={() => navTo(path)}
                className={`hover:text-[#f99c00] transition-colors ${isActive(path) ? 'text-[#f99c00]' : ''}`}>
                {label}
              </button>
            ))}
            {user ? (
              <>
                <button onClick={handleDashboardClick} className="hover:text-[#f99c00] transition-colors">Dashboard</button>
                <button onClick={handleLogout}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded text-xs tracking-wider transition-all">
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navTo('/register')} className={`hover:text-[#f99c00] transition-colors ${isActive('/register') ? 'text-[#f99c00]' : ''}`}>Register</button>
                <button onClick={() => navTo('/login')}
                  className="px-5 py-2 bg-[#f99c00] hover:bg-[#e08b00] text-slate-950 font-bold rounded text-xs tracking-wider transition-all">
                  SIGN IN
                </button>
              </>
            )}
          </nav>

          <button className="lg:hidden p-2 text-slate-600 hover:text-slate-900" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 px-4 pb-4 pt-2 space-y-1">
            {links.map(({ label, path }) => (
              <button key={path} onClick={() => { navTo(path); setMobileOpen(false); }}
                className={`block w-full text-left px-3 py-2.5 text-sm font-bold rounded hover:bg-slate-50 transition-colors ${isActive(path) ? 'text-[#f99c00]' : 'text-slate-700'}`}>
                {label}
              </button>
            ))}
            {user ? (
              <>
                <button onClick={() => { handleDashboardClick(); setMobileOpen(false); }}
                  className="block w-full text-left px-3 py-2.5 text-sm font-bold rounded hover:bg-slate-50 transition-colors text-slate-700">Dashboard</button>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="w-full mt-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded text-sm tracking-wider transition-all">
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { navTo('/register'); setMobileOpen(false); }}
                  className={`block w-full text-left px-3 py-2.5 text-sm font-bold rounded hover:bg-slate-50 transition-colors ${isActive('/register') ? 'text-[#f99c00]' : 'text-slate-700'}`}>Register</button>
                <button onClick={() => { navTo('/login'); setMobileOpen(false); }}
                  className="w-full mt-2 px-5 py-2.5 bg-[#f99c00] hover:bg-[#e08b00] text-slate-950 font-bold rounded text-sm tracking-wider transition-all">
                  SIGN IN
                </button>
              </>
            )}
          </div>
        )}
      </header>
    </>
  );
}
