import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { authService } from '../services/authService';

import HeroSection from '../components/home/HeroSection';
import RolesMatrix from '../components/home/RolesMatrix';
import Features from '../components/home/Features';
import Faqs from '../components/home/Faqs';

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getCurrentUser());

  useEffect(() => {
    const handleUserUpdate = () => setUser(authService.getCurrentUser());
    window.addEventListener('user-updated', handleUserUpdate);
    return () => window.removeEventListener('user-updated', handleUserUpdate);
  }, []);

  const handleDashboardClick = () => {
    if (!user) return navigate('/login');
    switch (user.role) {
      case 'CUSTOMER': navigate('/customer/dashboard'); break;
      case 'DRIVER': navigate('/driver/dashboard'); break;
      case 'FLEET_OWNER': navigate('/fleet-portal/dashboard'); break;
      case 'BROKER': navigate('/broker/dashboard'); break;
      case 'PLANT_OWNER': navigate('/plant/dashboard'); break;
      case 'MACHINE_OPERATOR': navigate('/driver/dashboard'); break;
      case 'ADMIN': 
      case 'SUPER_ADMIN': 
        navigate('/admin-portal/dashboard'); break;
      default: navigate('/login');
    }
  };

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-slate-50 text-slate-900 font-sans selection:bg-amber-500 selection:text-slate-950">
      <Navbar />
      <HeroSection user={user} handleDashboardClick={handleDashboardClick} />
      <RolesMatrix />
      <Features />
      <Faqs />
      <Footer />
    </div>
  );
}
