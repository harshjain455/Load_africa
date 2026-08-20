import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, Input } from '../components/ui';
import { User } from 'lucide-react';
import { authService } from '../services/authService';

export default function CustomerRegister() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !phone) {
      setError('Please fill all required fields');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await authService.register({
        email,
        password,
        role: 'CUSTOMER',
        firstName: fullName.split(' ')[0],
        lastName: fullName.split(' ').slice(1).join(' '),
        phone,
      });
      
      // Auto login and redirect to dashboard
      const loginRes = await authService.login(email, password);
      if (loginRes.success) {
        navigate('/customer-portal/dashboard');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 pt-24 pb-12">
        <div className="w-full max-w-[480px] mx-auto animate-fadeIn">
          
          {/* Header Section */}
          <div className="text-center space-y-2 mb-5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Create Customer Account
            </h1>
            <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto">
              Sign up to manage your transport bookings.
            </p>
          </div>

          {/* Form Card */}
          <Card className="bg-white border border-slate-200 rounded-xl shadow-lg p-5 sm:p-6 text-left transition-all duration-300">
            {error && (
              <div className="mb-3 p-2.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-200">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Card Header */}
              <div className="space-y-1 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#f99c00]" />
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Create your customer account
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                  Enter your details to get started.
                </p>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input 
                  label="Full Name"
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  className="bg-white border-slate-200 focus:border-amber-500 py-2 text-[11px] font-semibold shadow-sm h-9"
                />
                <Input 
                  label="Phone Number"
                  placeholder="+27..."
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                  className="bg-white border-slate-200 focus:border-amber-500 py-2 text-[11px] font-semibold shadow-sm h-9"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input 
                  label="Email Address"
                  placeholder="john@example.com"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="bg-white border-slate-200 focus:border-amber-500 py-2 text-[11px] font-semibold shadow-sm h-9"
                />
                <Input 
                  label="Password"
                  placeholder="Enter secure password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="bg-white border-slate-200 focus:border-amber-500 py-2 text-[11px] font-semibold shadow-sm h-9"
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-2.5 mt-2 bg-[#f99c00] hover:bg-[#e08b00] text-slate-955 font-black rounded-lg text-[11px] tracking-widest uppercase transition-colors shadow-sm cursor-pointer"
              >
                {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
              </button>

              {/* Link to Login */}
              <div className="pt-1 text-center">
                <p className="text-[11px] font-bold text-slate-500">
                  Already registered? <button type="button" onClick={() => navigate('/login')} className="text-[#f99c00] hover:text-[#e08b00] font-black cursor-pointer">Sign in</button>
                </p>
              </div>

            </form>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
