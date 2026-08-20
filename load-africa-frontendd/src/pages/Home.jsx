import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck, ArrowRight, Star, ChevronDown, CheckCircle2, ShieldCheck,
  MapPin, Scale, MessageSquare, Phone, Mail, Building, Plus, UserCheck, Users,
  Play, Zap, Shield, FileText, Bike, Car, HardHat, Hammer, Trash, Sofa, Milestone, Droplet, Compass, X
} from 'lucide-react';
import { Button, Input, Select, Card, GooglePlacesInput } from '../components/ui';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { authService } from '../services/authService';

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
      case 'ADMIN': 
      case 'SUPER_ADMIN': 
        navigate('/admin-portal/dashboard'); break;
      default: navigate('/login');
    }
  };

  // FAQ accordion states
  const [faqOpen, setFaqOpen] = useState({});

  const toggleFaq = (index) => {
    setFaqOpen(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const servicesList = [
    {
      title: 'Courier & Same-Day',
      desc: 'Bakkies for parcels, e-commerce and small business deliveries.',
      icon: Bike
    },
    {
      title: 'Furniture Removals',
      desc: 'Home and office moves with furniture trucks and trained crews.',
      icon: Sofa
    },
    {
      title: 'Sand & Rubble Removal',
      desc: 'Site clearing, rubble removal and sand delivery with tippers and skips.',
      icon: Trash
    },
    {
      title: 'Construction Loads',
      desc: 'Stone, cement and building material with tippers and flatbeds.',
      icon: Hammer
    },
    {
      title: '4-Ton & 8-Ton Trucks',
      desc: 'Pallet loads, retail distribution and heavier business cargo.',
      icon: Truck
    },
    {
      title: 'Side Tippers',
      desc: 'Bulk mining and aggregate haulage across SA.',
      icon: Milestone
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden relative selection:bg-amber-500 selection:text-slate-950">

      <Navbar />

      {/* Hero Section */}
      <div 
        className="relative z-10 text-white w-full overflow-hidden border-b border-slate-900 bg-cover bg-center py-12 lg:py-16 mt-20"
        style={{ 
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.85)), url('https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?w=1600&q=80')`
        }}
      >
        <section className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left info column */}
          <div className="text-left space-y-6 lg:col-span-6">
            <span className="text-[#EF9A30] font-bold text-xs uppercase tracking-wider block">
              LOADAFRICA LOGISTICS — SOUTH AFRICA
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black text-white leading-tight tracking-tight max-w-2xl">
              Book Bakkies, Trucks & Transport Across South Africa
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-xl">
              Bakkie hire, truck hire, load board, furniture removal and business deliveries in Gauteng, North West (Rustenburg) and Northern Cape — instant quotes, verified drivers, insured loads.
            </p>

            {/* Grid of four actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 max-w-lg">
              {user ? (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDashboardClick();
                    }}
                    className="px-4 py-3 bg-[#EF9A30] hover:bg-[#e08b00] text-slate-900 font-bold rounded-lg text-center text-xs tracking-wider transition-colors uppercase shadow-sm"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-3 bg-slate-900/70 hover:bg-slate-800 border border-slate-600 text-white font-bold rounded-lg text-center text-xs tracking-wider transition-colors uppercase shadow-sm"
                  >
                    View Services
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/customer/register');
                    }}
                    className="px-4 py-3 bg-[#EF9A30] hover:bg-[#e08b00] text-slate-900 font-bold rounded-lg text-center text-xs tracking-wider transition-colors uppercase shadow-sm"
                  >
                    Book a Load
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/register');
                    }}
                    className="px-4 py-3 bg-slate-900/70 hover:bg-slate-800 border border-slate-600 text-white font-bold rounded-lg text-center text-xs tracking-wider transition-colors uppercase shadow-sm"
                  >
                    Register as Transporter
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/login');
                    }}
                    className="px-4 py-3 bg-slate-900/70 hover:bg-slate-800 border border-slate-600 text-white font-bold rounded-lg text-center text-xs tracking-wider transition-colors uppercase shadow-sm"
                  >
                    Login
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-3 bg-slate-900/70 hover:bg-slate-800 border border-slate-600 text-white font-bold rounded-lg text-center text-xs tracking-wider transition-colors uppercase shadow-sm"
                  >
                    View Services
                  </button>
                </>
              )}
            </div>
          </div>


          {/* Right Image column */}
          <div className="lg:col-span-6 relative hidden lg:block cursor-pointer transition-transform hover:scale-[1.02]" onClick={handleDashboardClick}>
            <img 
              src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80" 
              alt="Logistics Truck" 
              className="rounded-3xl shadow-2xl border border-white/20 w-full h-[520px] object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent rounded-3xl flex flex-col justify-end p-10">
               <h3 className="text-white text-3xl font-black uppercase mb-2 drop-shadow-lg">Ready to move?</h3>
               <p className="text-slate-200 font-medium text-sm max-w-sm drop-shadow">{user ? "Go to your dashboard to manage your transport needs." : "Log in to get a quote and book verified transport across South Africa."}</p>
            </div>
          </div>
        </section>
      </div>

      {/* Services Showcase */}
      <section id="services" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-[#EF9A30] font-bold text-sm uppercase tracking-wider block mb-2">Capabilities</span>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Our Transport Solutions</h2>
            <p className="text-slate-500 mt-4 font-medium text-sm">
              From small parcel courier bikes to 34-ton side tippers, our transporter network is equipped for any logistics challenge.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesList.map((service, i) => {
              const Icon = service.icon;
              return (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-xl hover:border-slate-300 transition-all group flex flex-col text-left">
                  <div className="h-14 w-14 rounded-xl bg-slate-100 flex items-center justify-center mb-6 group-hover:bg-[#EF9A30] transition-colors">
                    <Icon className="h-7 w-7 text-slate-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{service.title}</h3>
                  <p className="text-sm text-slate-500 font-medium mt-3 leading-relaxed flex-1">{service.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-[#EF9A30] font-bold text-sm uppercase tracking-wider block mb-2">The LoadAfrica Difference</span>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Why Book With Us?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            <div className="flex gap-5 text-left items-start">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 uppercase mb-2">Verified Transporters Only</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Every fleet owner and driver is strictly vetted by our compliance team. We verify IDs, vehicle registrations, and roadworthiness before they can accept loads.
                </p>
              </div>
            </div>
            <div className="flex gap-5 text-left items-start">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 uppercase mb-2">Live GPS Tracking</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Once your driver is en route, track their progress in real-time through the LoadAfrica portal. You'll never have to guess where your cargo is.
                </p>
              </div>
            </div>
            <div className="flex gap-5 text-left items-start">
              <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 uppercase mb-2">Instant Quoting</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  No waiting around for emails. Our automated system calculates baseline estimates instantly, which our brokers finalize rapidly.
                </p>
              </div>
            </div>
            <div className="flex gap-5 text-left items-start">
              <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 uppercase mb-2">Broker Managed</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Every load is overseen by a dedicated LoadAfrica broker who ensures the assignment goes smoothly from pickup to delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-950 text-white border-y border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500 via-slate-900 to-slate-950"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-black uppercase tracking-tight mb-6 text-white drop-shadow-md">
            Ready to transport your load?
          </h2>
          <p className="text-slate-400 font-medium text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of businesses and individuals trusting LoadAfrica for secure, transparent logistics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <button
                onClick={handleDashboardClick}
                className="px-8 py-4 bg-[#EF9A30] hover:bg-[#e08b00] text-slate-950 font-black rounded-xl uppercase tracking-wider transition-all shadow-lg shadow-[#EF9A30]/20 flex items-center justify-center gap-3"
              >
                Go to Dashboard
                <ArrowRight className="h-5 w-5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/customer/register')}
                  className="px-8 py-4 bg-[#EF9A30] hover:bg-[#e08b00] text-slate-950 font-black rounded-xl uppercase tracking-wider transition-all shadow-lg shadow-[#EF9A30]/20 flex items-center justify-center gap-3"
                >
                  Book a Load Now
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-xl uppercase tracking-wider transition-all border border-slate-700 flex items-center justify-center gap-3"
                >
                  Partner with Us
                </button>
              </>
            )}
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
