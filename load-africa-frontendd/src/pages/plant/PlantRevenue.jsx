import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Modal } from '../../components/ui';
import { DollarSign, ArrowUpRight, ArrowDownRight, Clock, Building, CheckCircle, Wallet } from 'lucide-react';
import { plantService } from '../../services/plantService';

export default function PlantRevenue() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await plantService.getWallet();
      if (res.success) {
        setWallet(res.data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (parseFloat(withdrawAmount) > wallet?.balance) {
      showToast('Amount exceeds available balance', 'error');
      return;
    }
    try {
      const res = await plantService.withdrawEarnings(withdrawAmount);
      if (res.success) {
        showToast('Withdrawal request submitted successfully');
        setWithdrawModal(false);
        setWithdrawAmount('');
        fetchWallet();
      } else {
        showToast(res.message || 'Failed to withdraw', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to withdraw', 'error');
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500 font-medium">Loading wallet data...</div>;

  const totalEarnings = wallet?.transactions
    ?.filter(t => t.type === 'CREDIT' && t.status === 'COMPLETED')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

  return (
    <div className="space-y-6 relative">
      {toast.show && (
        <div className={`absolute top-0 right-0 p-3 rounded shadow-md text-sm font-bold z-50 ${toast.type === 'error' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
          {toast.message}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-black text-slate-900">Revenue & Wallet</h1>
        <p className="text-sm text-slate-500 font-medium">Track your plant hire earnings and request withdrawals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-slate-900 text-white relative overflow-hidden md:col-span-2">
          <div className="absolute right-0 top-0 opacity-10">
            <Wallet className="h-48 w-48 -mr-10 -mt-10" />
          </div>
          <div className="relative z-10">
            <p className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-2">Available Balance</p>
            <h2 className="text-4xl font-black text-yellow-500 mb-6">${parseFloat(wallet?.balance || 0).toFixed(2)}</h2>
            <div className="flex gap-4">
              <Button onClick={() => setWithdrawModal(true)} className="bg-yellow-500 text-slate-900 hover:bg-yellow-400 font-bold border-none">
                Withdraw Funds
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Lifetime Earnings</p>
            <h3 className="text-xl font-black text-emerald-600">${totalEarnings.toFixed(2)}</h3>
          </Card>
          <Card className="p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Withdrawals</p>
            <h3 className="text-xl font-black text-amber-600">${parseFloat(wallet?.pending_balance || 0).toFixed(2)}</h3>
          </Card>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-800">Transaction History</h3>
        </div>
        
        {wallet?.transactions?.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {wallet.transactions.map((txn) => (
              <div key={txn.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${txn.type === 'CREDIT' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    {txn.type === 'CREDIT' ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">
                      {txn.type === 'CREDIT' ? 'Hire Earnings' : 'Withdrawal Request'}
                    </p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      {new Date(txn.created_at).toLocaleDateString()} at {new Date(txn.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black ${txn.type === 'CREDIT' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {txn.type === 'CREDIT' ? '+' : '-'}${parseFloat(txn.amount).toFixed(2)}
                  </p>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded mt-1 uppercase
                    ${txn.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 
                      txn.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 
                      'bg-rose-100 text-rose-700'}`}
                  >
                    {txn.status === 'COMPLETED' && <CheckCircle className="h-3 w-3" />}
                    {txn.status === 'PENDING' && <Clock className="h-3 w-3" />}
                    {txn.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center">
            <Building className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-500">No transactions found in your wallet.</p>
          </div>
        )}
      </Card>

      <Modal open={withdrawModal} onClose={() => setWithdrawModal(false)} title="Withdraw Funds">
        <form onSubmit={handleWithdraw} className="space-y-5">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
            <span className="text-sm font-bold text-slate-500">Available Balance:</span>
            <span className="font-black text-lg text-slate-800">${parseFloat(wallet?.balance || 0).toFixed(2)}</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Amount to Withdraw</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                type="number"
                step="0.01"
                min="10"
                max={wallet?.balance || 0}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="pl-10 text-lg font-bold"
                placeholder="0.00"
                required
              />
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">Minimum withdrawal amount is $10.00</p>
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold" disabled={!withdrawAmount || parseFloat(withdrawAmount) > wallet?.balance}>
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
