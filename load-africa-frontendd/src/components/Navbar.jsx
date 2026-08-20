import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Truck, Menu, X, LogIn } from 'lucide-react';
import { authService } from '../services/authService';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(authService.getCurrentUser());

  const { scrollY } = useScroll();
  const headerBg = useTransform(scrollY, [0, 100], ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.9)']);
  const headerBorder = useTransform(scrollY, [0, 100], ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.05)']);
  const headerBackdrop = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(20px)']);
  
  // For pages that are not the home page, we want a solid light header
  const isHome = location.pathname === '/';
  
  const currentHeaderBg = isHome ? headerBg : 'rgba(255, 255, 255, 0.95)';
  const currentHeaderBorder = isHome ? headerBorder : 'rgba(0, 0, 0, 0.05)';
  const currentHeaderBackdrop = isHome ? headerBackdrop : 'blur(20px)';

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
    navTo('/');
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

  const handleScrollTo = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const links = [
    { label: 'Ecosystem', path: '/#roles-matrix', action: () => handleScrollTo('roles-matrix') },
    { label: 'Network', path: '/#features', action: () => handleScrollTo('features') },
    { label: 'Support', path: '/#faqs', action: () => handleScrollTo('faqs') },
    { label: 'Contact', path: '/contact', action: () => navTo('/contact') },
  ];

  return (
    <>
      <motion.header 
        style={{ 
          backgroundColor: currentHeaderBg, 
          borderColor: currentHeaderBorder,
          backdropFilter: currentHeaderBackdrop,
          WebkitBackdropFilter: currentHeaderBackdrop
        }}
        className="fixed top-0 left-0 right-0 z-[100] w-full border-b transition-colors duration-500"
      >
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-6 lg:px-10 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer select-none group" onClick={() => navTo('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f99c00] to-[#ffb84d] flex items-center justify-center shadow-lg shadow-[#f99c00]/30 group-hover:shadow-[#f99c00]/50 group-hover:scale-105 transition-all duration-500">
              <Truck className="h-5 w-5 text-white stroke-[2.5]" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase group-hover:text-[#f99c00] transition-colors duration-300">LOADAFRICA</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
            {links.map(({ label, action }) => (
              <motion.button 
                key={label} 
                onClick={action}
                whileHover={{ y: -2, color: '#0f172a' }}
                className="transition-colors relative group py-2 cursor-pointer"
              >
                {label}
                <span className="absolute -bottom-0 left-0 w-full h-[2px] bg-[#f99c00] transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100 rounded-full" />
              </motion.button>
            ))}

            <div className="w-px h-6 bg-slate-200 mx-2" />

            {user ? (
              <div className="flex items-center gap-4">
                <motion.button 
                  onClick={handleDashboardClick} 
                  whileHover={{ y: -2, color: '#0f172a' }}
                  className="transition-colors font-bold cursor-pointer"
                >
                  Dashboard
                </motion.button>
                <motion.button 
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm tracking-wide transition-all shadow-sm border border-slate-200 cursor-pointer"
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              <motion.button 
                onClick={() => navTo('/login')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-7 py-3 relative group overflow-hidden rounded-xl font-black text-sm tracking-wide shadow-md shadow-[#f99c00]/20 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#f99c00] to-[#ffb84d] group-hover:from-[#e08b00] group-hover:to-[#f99c00] transition-colors duration-300" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-shimmer" />
                <span className="relative z-10 text-white flex items-center gap-2">
                  <LogIn className="h-4 w-4" /> Sign In
                </span>
              </motion.button>
            )}
          </nav>

          {/* Mobile Toggle */}
          <motion.button 
            className="lg:hidden p-2 text-slate-700 hover:text-[#f99c00] transition-colors cursor-pointer" 
            onClick={() => setMobileOpen(!mobileOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {mobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200 overflow-hidden shadow-xl"
            >
              <div className="px-6 py-6 space-y-2">
                {links.map(({ label, action }) => (
                  <button key={label} onClick={() => { action(); setMobileOpen(false); }}
                    className="block w-full text-left px-4 py-3 text-lg font-bold rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer">
                    {label}
                  </button>
                ))}
                <div className="w-full h-px bg-slate-100 my-4" />
                {user ? (
                  <>
                    <button onClick={() => { handleDashboardClick(); setMobileOpen(false); }}
                      className="block w-full text-left px-4 py-3 text-lg font-bold rounded-xl text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer">
                      Dashboard
                    </button>
                    <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                      className="w-full mt-4 px-6 py-4 bg-slate-100 border border-slate-200 text-slate-700 font-black rounded-xl text-lg tracking-wide hover:bg-slate-200 transition-all cursor-pointer">
                      Logout
                    </button>
                  </>
                ) : (
                  <button onClick={() => { navTo('/login'); setMobileOpen(false); }}
                    className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-[#f99c00] to-[#ffb84d] text-white font-black rounded-xl text-lg tracking-wide hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#f99c00]/20">
                    <LogIn className="h-5 w-5" /> Sign In
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite linear;
        }
      `}} />
    </>
  );
}
