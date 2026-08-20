import React, { useState, useEffect } from 'react';
import { Search, FileText, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { brokerService } from '../../services/brokerService';
import api from '../../services/api';

export default function QuoteRequests() {
  const [activeTab, setActiveTab] = useState('REQUESTS'); // REQUESTS, QUOTATIONS
  
  // Requests State
  const [requests, setRequests] = useState([]);
  const [loadingReqs, setLoadingReqs] = useState(true);
  
  // Quotes State
  const [quotes, setQuotes] = useState([]);
  const [loadingQuotes, setLoadingQuotes] = useState(true);
  
  const [search, setSearch] = useState('');
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [quoteForm, setQuoteForm] = useState({ vehicle_rate: '', fuel_charges: '', discount: '' });

  useEffect(() => {
    if (activeTab === 'REQUESTS') fetchRequests();
    else fetchQuotations();
  }, [activeTab]);

  const fetchRequests = async () => {
    try {
      setLoadingReqs(true);
      const res = await brokerService.getQuoteRequests();
      if (res.success) setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReqs(false);
    }
  };

  const fetchQuotations = async () => {
    try {
      setLoadingQuotes(true);
      const res = await api.get('/broker/quotes');
      if (res.data.success) setQuotes(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuotes(false);
    }
  };

  const handleCreateQuoteClick = (req) => {
    setSelectedBooking(req);
    setQuoteForm({ vehicle_rate: '', fuel_charges: '', discount: '' });
    setQuoteModalOpen(true);
  };

  const handleQuoteChange = (e) => {
    setQuoteForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitQuote = async () => {
    const subtotal = Number(quoteForm.vehicle_rate || 0) + Number(quoteForm.fuel_charges || 0) - Number(quoteForm.discount || 0);
    if (subtotal <= 0) {
      alert('Pricing is mandatory. Base rate and total quote value must be greater than 0.');
      return;
    }
    
    try {
      const res = await brokerService.submitQuote(selectedBooking.id, {
        ...quoteForm,
        vehicle_rate: Number(quoteForm.vehicle_rate) || 0,
        fuel_charges: Number(quoteForm.fuel_charges) || 0,
        discount: Number(quoteForm.discount) || 0,
      });
      if (res.success) {
        setQuoteModalOpen(false);
        fetchRequests(); 
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit quote');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED': return <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1 w-max"><CheckCircle2 className="h-3 w-3" /> Accepted</span>;
      case 'REJECTED': return <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-100 flex items-center gap-1 w-max"><XCircle className="h-3 w-3" /> Rejected</span>;
      case 'SENT': return <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 border border-amber-100 flex items-center gap-1 w-max"><Clock className="h-3 w-3" /> Awaiting Decision</span>;
      default: return <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 w-max">{status}</span>;
    }
  };

  const filteredRequests = requests.filter(req => 
    req.id.toLowerCase().includes(search.toLowerCase()) || 
    (req.customer?.company_name && req.customer.company_name.toLowerCase().includes(search.toLowerCase())) ||
    (req.customer?.user?.first_name && req.customer.user.first_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quote Requests</h1>
          <p className="text-sm text-slate-500 font-medium">Review customer booking requests and submit official quotations</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl max-w-xs border border-slate-200 shadow-sm shrink-0">
          <button
            onClick={() => setActiveTab('REQUESTS')}
            className={`flex-1 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'REQUESTS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Pending Requests
          </button>
          <button
            onClick={() => setActiveTab('QUOTATIONS')}
            className={`flex-1 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'QUOTATIONS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sent Quotes
          </button>
        </div>
      </div>

      {activeTab === 'REQUESTS' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loadingReqs ? (
            <div className="p-16 text-center text-slate-500 font-medium">Loading requests...</div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-16 text-center text-slate-500 font-medium">No pending requests found.</div>
          ) : (
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 font-black uppercase tracking-wider">Booking Info</th>
                  <th className="px-5 py-3 font-black uppercase tracking-wider">Route</th>
                  <th className="px-5 py-3 font-black uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900">ID: {req.id.substring(0,8)}</p>
                      <p className="text-slate-500 mt-0.5">{req.customer?.company_name || req.customer?.user?.first_name || 'Guest'}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-700 truncate max-w-[200px]">{req.pickup_address}</p>
                      <p className="text-slate-400 mt-0.5 truncate max-w-[200px]">to {req.delivery_address}</p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button 
                        onClick={() => handleCreateQuoteClick(req)}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black uppercase tracking-wider rounded-xl transition-colors"
                      >
                        Create Quote
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loadingQuotes ? (
            <div className="p-16 text-center text-slate-500 font-medium">Loading quotations...</div>
          ) : quotes.length === 0 ? (
            <div className="p-16 text-center text-slate-500 font-medium">No prepared quotations yet.</div>
          ) : (
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 font-black uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3 font-black uppercase tracking-wider">Booking ID</th>
                  <th className="px-5 py-3 font-black uppercase tracking-wider">Customer</th>
                  <th className="px-5 py-3 font-black uppercase tracking-wider">Total Amount</th>
                  <th className="px-5 py-3 font-black uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 text-slate-600 font-semibold">{new Date(quote.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-4 font-black text-slate-900">{quote.booking_id.substring(0,8)}</td>
                    <td className="px-5 py-4 text-slate-700 font-bold">{quote.booking?.customer?.user?.first_name}</td>
                    <td className="px-5 py-4 text-amber-600 font-black">R{Number(quote.grand_total).toFixed(2)}</td>
                    <td className="px-5 py-4">{getStatusBadge(quote.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Quote Modal */}
      {quoteModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">Prepare Quotation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Vehicle Rate (R)</label>
                <input type="number" name="vehicle_rate" value={quoteForm.vehicle_rate} onChange={handleQuoteChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm font-semibold transition-all outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Fuel Charges (R)</label>
                  <input type="number" name="fuel_charges" value={quoteForm.fuel_charges} onChange={handleQuoteChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm font-semibold transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Discount (R)</label>
                  <input type="number" name="discount" value={quoteForm.discount} onChange={handleQuoteChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm font-semibold transition-all outline-none" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setQuoteModalOpen(false)} className="px-5 py-2.5 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleSubmitQuote} className="px-5 py-2.5 text-xs font-black uppercase tracking-wider bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-all shadow-md shadow-slate-900/10">Submit Quote</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
