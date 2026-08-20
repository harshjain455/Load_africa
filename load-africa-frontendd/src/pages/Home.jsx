import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck, ArrowRight, UserCheck, ShieldCheck, MapPin, Search, Users, Shield, HardHat, Briefcase, Zap, CheckCircle2, ChevronDown
} from 'lucide-react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { authService } from '../services/authService';

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [faqOpen, setFaqOpen] = useState({});

  const toggleFaq = (index) => {
    setFaqOpen(prev => ({ ...prev, [index]: !prev[index] }));
  };

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

  const roles = [
    {
      id: 'customer',
      title: 'Customer',
      tagline: 'Book Transport & Plant Hire',
      description: 'Instant quotes, live tracking, and verified transporters. Whether you need a bakkie for a couch or a tipper for construction, we have you covered.',
      icon: Search,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      btnText: 'Book a Load',
      link: '/customer/register'
    },
    {
      id: 'fleet',
      title: 'Fleet Owner',
      tagline: 'Grow Your Logistics Business',
      description: 'Access a massive load board. Dispatch your drivers, track vehicles, and get paid securely upon delivery confirmation.',
      icon: Truck,
      color: 'from-amber-400 to-amber-600',
      bgColor: 'bg-amber-500/10',
      iconColor: 'text-amber-500',
      btnText: 'Register Fleet',
      link: '/fleet/register'
    },
    {
      id: 'driver',
      title: 'Driver',
      tagline: 'Get Dispatched to Premium Loads',
      description: 'Apply to drive for verified fleets. Get dispatch instructions straight to your phone, navigate, and upload PODs effortlessly.',
      icon: MapPin,
      color: 'from-emerald-400 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500',
      btnText: 'Apply as Driver',
      link: '/driver/register'
    },
    {
      id: 'broker',
      title: 'Broker',
      tagline: 'Orchestrate African Logistics',
      description: 'Manage shipments for enterprise clients, negotiate rates with fleet owners, and earn commissions on every successful load.',
      icon: Briefcase,
      color: 'from-purple-500 to-purple-700',
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
      btnText: 'Join as Broker',
      link: '/signup'
    },
    {
      id: 'plant',
      title: 'Plant Owner',
      tagline: 'Monetize Your Yellow Metal',
      description: 'Rent out your heavy machinery and yellow metal equipment. Access high-value construction and mining contracts across SA.',
      icon: Zap,
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-yellow-500/10',
      iconColor: 'text-yellow-500',
      btnText: 'Register Plant',
      link: '/plant/register'
    },
    {
      id: 'operator',
      title: 'Machine Operator',
      tagline: 'Find Operator Jobs',
      description: 'Are you qualified to operate heavy machinery? Find lucrative contracts and jobs with Plant Owners looking for your skills.',
      icon: HardHat,
      color: 'from-slate-600 to-slate-800',
      bgColor: 'bg-slate-500/10',
      iconColor: 'text-slate-600',
      btnText: 'Apply as Operator',
      link: '/signup'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden selection:bg-amber-500 selection:text-slate-950">
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-950/80 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" 
            alt="Logistics Background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-900/40 to-transparent z-10" />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-6">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Role.</span><br />
            Move The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Continent.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 font-medium leading-relaxed">
            LoadAfrica connects customers, fleet owners, drivers, brokers, and plant operators into a single, transparent, and high-performance logistics ecosystem.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {user ? (
               <button
                 onClick={handleDashboardClick}
                 className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
               >
                 Enter Dashboard <ArrowRight className="h-5 w-5" />
               </button>
            ) : (
              <button
                onClick={() => {
                  document.getElementById('roles-matrix')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-white hover:bg-slate-100 text-slate-900 font-black rounded-xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                Explore Roles <ArrowRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Roles Matrix */}
      <section id="roles-matrix" className="py-24 bg-slate-50 relative z-20 -mt-10 rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">The LoadAfrica Ecosystem</h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">Join thousands of verified partners across South Africa. Select the role that best describes your business to get started.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div 
                key={role.id}
                className="group bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-bl-[100%]`} />
                
                <div className={`w-14 h-14 rounded-2xl ${role.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <role.icon className={`h-7 w-7 ${role.iconColor}`} />
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-2">{role.title}</h3>
                <p className={`text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r ${role.color} uppercase tracking-wider mb-4 block`}>
                  {role.tagline}
                </p>
                
                <p className="text-slate-500 font-medium mb-8 leading-relaxed h-24">
                  {role.description}
                </p>
                
                <button
                  onClick={() => navigate(role.link)}
                  className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border-2 
                    ${role.id === 'customer' ? 'border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white' : 
                      role.id === 'fleet' ? 'border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-slate-950' :
                      role.id === 'driver' ? 'border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white' :
                      role.id === 'broker' ? 'border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white' :
                      role.id === 'plant' ? 'border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white' :
                      'border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  {role.btnText} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security Banner */}
      <section className="py-20 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="p-6">
              <ShieldCheck className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
              <h4 className="text-xl font-black mb-2">Verified Network</h4>
              <p className="text-slate-400 text-sm">Every transporter and operator undergoes strict KYC and vehicle verification.</p>
            </div>
            <div className="p-6">
              <Zap className="h-12 w-12 text-amber-400 mx-auto mb-4" />
              <h4 className="text-xl font-black mb-2">Instant Dispatch</h4>
              <p className="text-slate-400 text-sm">Our geographic algorithm finds the closest available drivers automatically.</p>
            </div>
            <div className="p-6">
              <UserCheck className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h4 className="text-xl font-black mb-2">Secure Escrow</h4>
              <p className="text-slate-400 text-sm">Payments are held safely and only released upon valid Proof of Delivery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-slate-50 text-left">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#EF9A30] font-bold text-sm uppercase tracking-wider block mb-2">Support</span>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "How does the pricing work?",
                a: "Pricing is calculated based on total distance, vehicle class, cargo weight, and current market supply. You will receive an official quotation from our brokers before any payment is required."
              },
              {
                q: "Do you offer goods-in-transit insurance?",
                a: "Yes. All verified transporters on our network are required to carry baseline Goods-in-Transit (GIT) insurance. Additional specialized insurance can be arranged for high-value loads via our broker team."
              },
              {
                q: "How do I track my delivery?",
                a: "Once your driver is en route, you can track them via the live map on your customer dashboard. The GPS feed updates in real-time until the load is signed off."
              },
              {
                q: "Can I register as a driver?",
                a: "Drivers must be registered under a verified Fleet Owner company. We do not accept independent drivers without a registered transport business entity."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-sm">
                <button 
                  onClick={() => toggleFaq(i)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="font-bold text-slate-900">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${faqOpen[i] ? 'rotate-180' : ''}`} />
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ${faqOpen[i] ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
