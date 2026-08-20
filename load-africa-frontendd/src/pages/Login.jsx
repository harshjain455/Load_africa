import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, ArrowRight, UserCheck, HardHat, Briefcase, Zap, ChevronDown, Eye, EyeOff } from 'lucide-react';
import QuickLoginSelector from '../components/QuickLoginSelector';
import { authService } from '../services/authService';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegisterOptions, setShowRegisterOptions] = useState(false);
  const [showDemoLogins, setShowDemoLogins] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [targetDashboard, setTargetDashboard] = useState('/customer/dashboard');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      setLoading(false);
      
      const userRole = response.data.user.role;
      switch(userRole) {
        case 'CUSTOMER': navigate('/customer/dashboard'); break;
        case 'DRIVER': 
        case 'OPERATOR': navigate('/driver/dashboard'); break;
        case 'FLEET_OWNER': navigate('/fleet-portal/dashboard'); break;
        case 'BROKER': navigate('/broker/dashboard'); break;
        case 'PLANT_OWNER': navigate('/plant-portal/dashboard'); break;
        case 'ADMIN': 
        case 'SUPER_ADMIN': 
          navigate('/admin-portal/dashboard'); break;
        default: navigate('/');
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  const registerOptions = [
    { label: 'Customer', path: '/customer/register', icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-50 hover:bg-blue-100', border: 'border-blue-100 hover:border-blue-200' },
    { label: 'Driver', path: '/driver/register', icon: Truck, color: 'text-emerald-600', bg: 'bg-emerald-50 hover:bg-emerald-100', border: 'border-emerald-100 hover:border-emerald-200' },
    { label: 'Fleet Owner', path: '/fleet/register', icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50 hover:bg-amber-100', border: 'border-amber-100 hover:border-amber-200' },
    { label: 'Plant Owner', path: '/plant/register', icon: Zap, color: 'text-rose-600', bg: 'bg-rose-50 hover:bg-rose-100', border: 'border-rose-100 hover:border-rose-200' },
  ];

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-slate-50 selection:bg-amber-500 selection:text-slate-950 font-sans">
      
      {/* Left Side - Image/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-slate-200 bg-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" 
            alt="Modern Logistics Software" 
            className="w-full h-full object-cover opacity-90 object-center"
          />
          {/* Light gradient overlay to make text readable but keep image bright */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/80" />
        </div>

        <button
          onClick={() => navigate('/')}
          className="relative z-10 text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-2 cursor-pointer w-fit bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 shadow-sm"
        >
          <ArrowRight className="h-4 w-4 rotate-180" /> Back to Home
        </button>

        <div className="relative z-10 max-w-lg mb-10 bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 mb-6 shadow-md">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Enterprise Platform</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tighter mb-4">
            Africa's Logistics <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">
              Nerve Center.
            </span>
          </h1>
          <p className="text-slate-600 font-medium text-base leading-relaxed">
            Manage your fleet, book loads instantly, and track every movement with absolute transparency and enterprise-grade security.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 h-screen overflow-y-auto custom-scrollbar relative bg-slate-50">
        
        {/* Soft light glows behind form */}
        <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-amber-400/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] bg-blue-400/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="w-full max-w-[420px] relative z-10 flex flex-col justify-center min-h-full py-8">
          
          <button
            onClick={() => navigate('/')}
            className="lg:hidden absolute top-0 left-0 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm"
          >
            <ArrowRight className="h-4 w-4 rotate-180" /> Home
          </button>

          {/* Header */}
          <div className="mb-8 mt-10 lg:mt-0 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Truck className="h-5 w-5 text-white stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 uppercase">
                LOADAFRICA
              </span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              Welcome back
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-bold flex items-center gap-2 shadow-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-sm font-semibold transition-all shadow-sm"
              />
            </div>

            <div className="space-y-1.5 relative">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest flex justify-between">
                <span>Password</span>
                <span className="text-amber-600 hover:text-amber-700 cursor-pointer normal-case tracking-normal transition-colors">Forgot?</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-sm font-semibold transition-all shadow-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#f99c00] hover:bg-[#e08b00] text-white font-black rounded-xl text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 cursor-pointer mt-2 flex justify-center items-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In securely'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Registration Options */}
          <div className="mt-8 border-t border-slate-200 pt-6">
            <button 
              onClick={() => setShowRegisterOptions(!showRegisterOptions)}
              className="w-full text-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              New to LoadAfrica? <span className="text-amber-600">Join the Network</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showRegisterOptions ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showRegisterOptions && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0, marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, y: -10, marginTop: 0 }}
                  className="grid grid-cols-2 gap-2 overflow-hidden"
                >
                  {registerOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => navigate(opt.path)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${opt.bg} ${opt.border} shadow-sm group`}
                    >
                      <opt.icon className={`h-5 w-5 mb-1.5 ${opt.color} group-hover:scale-110 transition-transform`} />
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide group-hover:text-slate-900 transition-colors">{opt.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Demo Logins */}
          <div className="mt-6 border-t border-slate-200 pt-6">
            <button 
              onClick={() => setShowDemoLogins(!showDemoLogins)}
              className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              Development: Show Demo Logins
              <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${showDemoLogins ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {showDemoLogins && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0, marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, y: -10, marginTop: 0 }}
                  className="overflow-hidden bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
                >
                  <QuickLoginSelector
                    setEmail={setEmail}
                    setPassword={setPassword}
                    stayOnPage={true}
                    setDashboard={setTargetDashboard}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
      
      {/* Global Style for scrollbar in right panel */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
      `}} />
    </div>
  );
}
