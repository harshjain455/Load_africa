import React, { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, Calendar, CreditCard, ArrowUpRight, 
  ArrowDownLeft, Clock, CheckCircle2, ChevronRight, Check, Download, Building2, AlertCircle
} from 'lucide-react';
import { getMockData, saveMockData } from '../../data/mockData';
import { Modal, Button, Input } from '../../components/ui';

export default function EarningsWallet() {
  const [driver, setDriver] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('FNB Account');
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawState, setWithdrawState] = useState('idle'); // idle, processing, success
  
  // Bank Details State
  const [bankDetailsOpen, setBankDetailsOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    bankName: 'First National Bank (FNB)',
    accountHolder: 'Sipho Zuma',
    accountNumber: '6284 9812 345',
    branchCode: '250655'
  });

  useEffect(() => {
    const drivers = getMockData('drivers') || [];
    setDriver(drivers[0]); // Sipho Zuma

    const payments = getMockData('payments') || [];
    const kofiTx = payments.filter(p => p.driverName === 'Sipho Zuma');
    setTransactions(kofiTx);
  }, []);

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    if (!withdrawAmount || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > driver.walletBalance) {
      alert('Invalid withdrawal amount');
      return;
    }

    setWithdrawState('processing');

    setTimeout(() => {
      const amt = Number(withdrawAmount);
      
      const drivers = getMockData('drivers') || [];
      const idx = drivers.findIndex(d => d.id === 'drv-1');
      if (idx > -1) {
        drivers[idx].walletBalance -= amt;
        saveMockData('drivers', drivers);
        setDriver(drivers[idx]);
      }

      const payments = getMockData('payments') || [];
      const newTx = {
        id: `tx-${Math.floor(8000 + Math.random() * 2000)}`,
        bookingId: 'withdrawal',
        amount: amt,
        status: 'processing',
        method: withdrawMethod,
        date: new Date().toISOString().split('T')[0],
        customerName: 'Bank Transfer (Processing)',
        driverName: 'Sipho Zuma'
      };
      payments.unshift(newTx);
      saveMockData('payments', payments);
      setTransactions(payments.filter(p => p.driverName === 'Sipho Zuma'));

      setWithdrawState('success');
      setWithdrawAmount('');
      
      setTimeout(() => {
        // Mock completing the withdrawal
        const updatedPayments = getMockData('payments') || [];
        const txIdx = updatedPayments.findIndex(p => p.id === newTx.id);
        if (txIdx > -1) {
          updatedPayments[txIdx].status = 'completed';
          updatedPayments[txIdx].customerName = 'Bank Transfer (Cleared)';
          saveMockData('payments', updatedPayments);
          setTransactions(updatedPayments.filter(p => p.driverName === 'Sipho Zuma'));
        }
        setWithdrawState('idle');
        setWithdrawOpen(false);
      }, 2000);
    }, 1500);
  };

  const handleSaveBankDetails = (e) => {
    e.preventDefault();
    setBankDetailsOpen(false);
  };

  if (!driver) return null;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Earnings & Wallet</h2>
          <p className="text-xs text-slate-400">Track your payouts and manage your bank details.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setBankDetailsOpen(true)} className="gap-2">
            <Building2 className="h-4 w-4" /> Bank Details
          </Button>
          <Button variant="outline" onClick={() => alert('Downloading statement...')} className="gap-2">
            <Download className="h-4 w-4" /> Download Statement
          </Button>
        </div>
      </div>

      {/* Cards stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Wallet Balance */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow col-span-1 md:col-span-2">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Withdrawable Balance</span>
              <p className="text-4xl font-extrabold text-slate-900">R{driver.walletBalance}</p>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold mt-2">
                <Clock className="h-3 w-3 text-amber-500" /> +R 2,400 Pending Delivery
              </div>
            </div>
            <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
              <CreditCard className="h-6 w-6" />
            </div>
          </div>
          <button 
            onClick={() => setWithdrawOpen(true)}
            className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-500/10"
          >
            Withdraw to Bank
          </button>
        </div>

        {/* Cleared Payments */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-start hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cleared Payments</span>
            <p className="text-2xl font-extrabold text-emerald-600">R 8,200</p>
            <span className="block text-[10px] text-slate-400 mt-2">This month</span>
          </div>
          <div className="bg-emerald-50 p-2 rounded-xl text-emerald-500">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        {/* Life-time Earnings stats */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-start hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Earnings</span>
            <p className="text-2xl font-extrabold text-slate-900">R{driver.earnings}</p>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 mt-2 font-bold">
              <TrendingUp className="h-3 w-3" />
              <span>+12.4%</span>
            </div>
          </div>
          <div className="bg-slate-50 p-2 rounded-xl text-slate-600">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
        <h3 className="text-lg font-bold text-slate-800">Transaction History</h3>

        <div className="divide-y divide-slate-100">
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No transactions recorded yet.</div>
          ) : (
            transactions.map((tx) => {
              const isWithdrawal = tx.bookingId === 'withdrawal';
              const isProcessing = tx.status === 'processing';
              return (
                <div key={tx.id} className="py-4.5 flex items-center justify-between gap-4 first:pt-0">
                  <div className="flex items-center gap-3 text-left">
                    <div className={`p-2.5 rounded-xl shrink-0 ${
                      isWithdrawal 
                        ? (isProcessing ? 'bg-amber-50 text-amber-500' : 'bg-slate-100 text-slate-600') 
                        : 'bg-emerald-50 text-emerald-500'
                    }`}>
                      {isWithdrawal ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">
                        {isWithdrawal ? (isProcessing ? 'Withdrawal Processing...' : 'Withdrawal Cleared') : 'Load Payout Credited'}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                        <span className="font-mono uppercase">{tx.id}</span>
                        <span>•</span>
                        <span>{tx.method}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-extrabold text-sm ${
                      isWithdrawal 
                        ? (isProcessing ? 'text-amber-600' : 'text-slate-800')
                        : 'text-emerald-600'
                    }`}>
                      {isWithdrawal ? '-' : '+'}R{tx.amount}
                    </p>
                    <span className="text-[10px] text-slate-400 font-bold">{tx.date}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Withdrawal Form Modal */}
      <Modal open={withdrawOpen} onClose={() => withdrawState === 'idle' && setWithdrawOpen(false)} title="Request Payout">
        {withdrawState === 'success' ? (
          <div className="p-8 text-center space-y-3">
            <div className="inline-flex p-3 bg-emerald-100 text-emerald-600 rounded-full">
              <Check className="h-8 w-8" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Withdrawal Dispatched!</h4>
            <p className="text-xs text-slate-400">Funds are being transferred to your registered bank account.</p>
          </div>
        ) : withdrawState === 'processing' ? (
          <div className="p-8 text-center space-y-4">
            <div className="h-10 w-10 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto" />
            <h4 className="font-bold text-slate-900 text-base">Processing Request...</h4>
            <p className="text-xs text-slate-400">Connecting to banking network.</p>
          </div>
        ) : (
          <form onSubmit={handleWithdrawSubmit} className="space-y-6">
            <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">AVAILABLE FOR PAYOUT</span>
              <p className="text-3xl font-black text-slate-800 mt-1">R{driver.walletBalance}</p>
            </div>

            <div className="space-y-4">
              <Input 
                label="Withdrawal Amount (R)" 
                type="number" 
                placeholder="e.g. 1500" 
                value={withdrawAmount} 
                onChange={(e) => setWithdrawAmount(e.target.value)} 
                max={driver.walletBalance}
                min="1"
                required 
              />
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Destination Account</label>
                <div className="p-3 border border-emerald-200 bg-emerald-50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{bankDetails.bankName}</p>
                      <p className="text-[10px] font-mono text-slate-500">Acc: {bankDetails.accountNumber}</p>
                    </div>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setWithdrawOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white border-0">Initiate Transfer</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Bank Details Modal */}
      <Modal open={bankDetailsOpen} onClose={() => setBankDetailsOpen(false)} title="Update Bank Details">
        <form onSubmit={handleSaveBankDetails} className="space-y-4">
          <Input 
            label="Bank Name" 
            value={bankDetails.bankName} 
            onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})} 
            required 
          />
          <Input 
            label="Account Holder Name" 
            value={bankDetails.accountHolder} 
            onChange={(e) => setBankDetails({...bankDetails, accountHolder: e.target.value})} 
            required 
          />
          <Input 
            label="Account Number" 
            value={bankDetails.accountNumber} 
            onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})} 
            required 
          />
          <Input 
            label="Branch Code" 
            value={bankDetails.branchCode} 
            onChange={(e) => setBankDetails({...bankDetails, branchCode: e.target.value})} 
            required 
          />
          
          <div className="p-3 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-xl flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>Ensure these details match your ID document exactly to avoid payout delays.</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setBankDetailsOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white">Save Bank Details</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
