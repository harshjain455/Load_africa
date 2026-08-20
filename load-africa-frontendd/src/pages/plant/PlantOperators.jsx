import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from '../../components/ui';
import { Users, UserPlus, Trash2 } from 'lucide-react';
import { plantService } from '../../services/plantService';

export default function PlantOperators() {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    license: ''
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    fetchOperators();
  }, []);

  const fetchOperators = async () => {
    try {
      const res = await plantService.getOperators();
      if (res.success) {
        setOperators(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch operators', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await plantService.addOperator(formData);
      if (res.success) {
        showToast('Operator added successfully! They can now log in to the Driver Portal.');
        setIsModalOpen(false);
        setFormData({ first_name: '', last_name: '', email: '', password: '', license: '' });
        fetchOperators();
      } else {
        showToast(res.message || 'Failed to add operator', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error adding operator', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this operator?')) return;
    try {
      const res = await plantService.deleteOperator(id);
      if (res.success) {
        showToast('Operator deleted');
        fetchOperators();
      } else {
        showToast(res.message || 'Failed to delete operator', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error deleting operator', 'error');
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Loading operators...</div>;

  return (
    <div className="space-y-6 relative">
      {toast.show && (
        <div className="\bsolute top-0 right-0 p-3 rounded shadow-md text-sm font-bold z-50 \\">
          {toast.message}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-yellow-500" />
            Machine Operators
          </h1>
          <p className="text-xs text-slate-500 font-medium">Manage the operators who will drive your machines.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-yellow-500 text-slate-900 hover:bg-yellow-400 font-bold flex items-center gap-2">
          <UserPlus className="h-4 w-4" /> Add Operator
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {operators.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">License</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {operators.map((op) => (
                  <tr key={op.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-sm text-slate-800">{op.name}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{op.user?.email || 'N/A'}</td>
                    <td className="p-4 text-sm text-slate-600 font-mono">{op.license}</td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-700 uppercase">
                        {op.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(op.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center">
            <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-medium">No operators found.</p>
            <p className="text-xs text-slate-400 mt-1">Add an operator so they can log in and start tracking jobs.</p>
          </div>
        )}
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Machine Operator">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-yellow-50 text-yellow-800 text-xs font-medium rounded-lg border border-yellow-100">
            This will create a user account for the operator. They will log in via the main Login page and be directed to the Tracking Dashboard.
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">First Name</label>
              <input required type="text" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-yellow-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Last Name</label>
              <input required type="text" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-yellow-500 outline-none" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email (Login ID)</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-yellow-500 outline-none" />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
            <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-yellow-500 outline-none" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">License Number</label>
            <input required type="text" value={formData.license} onChange={e => setFormData({...formData, license: e.target.value})} className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-yellow-500 outline-none" />
          </div>

          <div className="pt-4 flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1 bg-yellow-500 text-slate-900 hover:bg-yellow-400">Create Operator</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
