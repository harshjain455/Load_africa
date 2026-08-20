import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Truck, Users, ShieldCheck, TrendingUp, BellRing, Route
} from 'lucide-react';

export default function Fleet() {
  const navigate = useNavigate();

  const workflowSteps = [
    { 
      title: 'Manage Your Fleet', 
      desc: 'Add and manage all your transport vehicles and drivers under one centralized company profile.', 
      icon: Truck 
    },
    { 
      title: 'Control Availability', 
      desc: 'Keep vehicle and driver availability up-to-date to ensure you only receive offers when you are ready to haul.', 
      icon: Users 
    },
    { 
      title: 'Receive Load Offers', 
      desc: 'Receive premium, broker-assigned load offers automatically matched to your fleet capabilities and location.', 
      icon: BellRing 
    },
    { 
      title: 'Accept & Dispatch', 
      desc: 'Review offers, accept loads, and dispatch an available vehicle and driver instantly from your dashboard.', 
      icon: ShieldCheck 
    },
    { 
      title: 'Monitor Active Trips', 
      desc: 'Track your drivers\' live trip status from pickup to destination arrival and POD upload.', 
      icon: Route 
    },
    { 
      title: 'Track Performance', 
      desc: 'Manage your hygiene, uniform standards, and documentation compliance scores to secure more loads.', 
      icon: TrendingUp 
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden relative selection:bg-amber-500 selection:text-slate-950">
      
      <Navbar />

      {/* Hero Header Area */}
      <div className="relative z-10 w-full overflow-hidden bg-slate-900 text-white border-b border-slate-800 py-12 lg:py-24 mt-16">
        <main className="relative z-10 max-w-7xl mx-auto px-6 text-left space-y-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          
          <div className="space-y-4">
            <span className="text-[#f99c00] font-bold text-xs uppercase tracking-wider block">
              PARTNER WITH LOADAFRICA
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight uppercase max-w-4xl tracking-tight">
              GROW YOUR TRANSPORT BUSINESS WITH PREMIUM FREIGHT
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-3xl">
              LoadAfrica connects verified Fleet Owners with consistent, high-quality broker-quoted loads. Manage your vehicles, dispatch drivers, and monitor compliance all in one powerful portal.
            </p>
            <div className="flex flex-wrap gap-4 pt-6">
              <button
                onClick={() => navigate('/fleet/register')}
                className="px-6 py-3.5 bg-[#f99c00] hover:bg-[#e08b00] text-slate-950 font-black rounded-lg text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
              >
                REGISTER AS FLEET OWNER
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-lg text-xs tracking-wider uppercase border border-slate-600 shadow-md"
              >
                SIGN IN TO PORTAL
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Fleet Owner Workflow Section */}
      <section className="bg-[#F0F2F6] w-full border-t border-b border-slate-200/60 pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {/* Section Heading */}
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 uppercase">
              HOW IT WORKS FOR FLEET OWNERS
            </h2>
            <p className="text-sm text-slate-500 font-semibold tracking-wide">
              A streamlined dispatch and management platform built for transport companies.
            </p>
          </div>

          {/* Workflow Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="bg-white border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-[#f99c00] rounded-2xl p-8 flex flex-col items-start transition-all duration-300 ease-out transform">
                  <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center mb-6 border border-amber-100">
                    <Icon className="h-6 w-6 text-[#f99c00] stroke-[2]" />
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-black text-lg text-slate-900 uppercase tracking-tight">{step.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust/Footer Banner */}
      <section className="bg-white py-16 text-center border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <h3 className="text-2xl font-black text-slate-900 uppercase">Ready to optimize your fleet operations?</h3>
          <p className="text-slate-500 font-medium">Join Africa's fastest-growing logistics network today.</p>
          <button
            onClick={() => navigate('/fleet/register')}
            className="mt-4 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-lg text-sm uppercase tracking-widest shadow-xl transition-colors"
          >
            BECOME A PARTNER
          </button>
        </div>
      </section>

      <Footer light />

    </div>
  );
}
