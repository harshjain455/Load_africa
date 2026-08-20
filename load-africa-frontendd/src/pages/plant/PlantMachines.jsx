import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Modal } from '../../components/ui';
import { Truck, Plus } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { plantService } from '../../services/plantService';
import machineData from '../../data/machineData.json';

export default function PlantMachines() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [formData, setFormData] = useState({
    type: '',
    category: '',
    make: '',
    model_name: '',
    year: '',
    capacity: '',
    registration_number: '',
    hourly_rate: '',
    min_hire_hours: ''
  });
  const [errors, setErrors] = useState({});

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      const res = await plantService.getMachines();
      if (res.success) {
        setMachines(res.data || []);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.registration_number) newErrors.registration_number = 'Registration number is required';
    if (!formData.registration_number) newErrors.registration_number = 'Registration number is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await plantService.addMachine({
        ...formData,
        capacity: formData.capacity ? parseFloat(formData.capacity) : undefined,
        year: formData.year ? parseInt(formData.year) : undefined,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : undefined,
        min_hire_hours: formData.min_hire_hours ? parseInt(formData.min_hire_hours) : undefined,
      });
      if (res.success) {
        showToast('Machine added successfully');
        setShowAddModal(false);
        setFormData({ type: '', category: '', make: '', model_name: '', year: '', capacity: '', registration_number: '', hourly_rate: '', min_hire_hours: '' });
        setErrors({});
        fetchMachines();
      } else {
        showToast(res.message || 'Failed to add machine', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add machine', 'error');
    }
  };
  const handleTypeChange = (selectedName) => {
    const selectedMachine = machineData.find(m => m.name === selectedName);
    if (selectedMachine) {
      setFormData({
        ...formData,
        type: selectedMachine.name,
        category: selectedMachine.category,
        hourly_rate: selectedMachine.hourlyRate,
        min_hire_hours: selectedMachine.minHireHours
      });
    } else {
      setFormData({
        ...formData,
        type: selectedName
      });
    }
  };
  if (loading) return <div className="p-10 text-center text-slate-500">Loading machines...</div>;

  return (
    <div className="space-y-6 relative">
      {toast.show && (
        <div className={`absolute top-0 right-0 p-3 rounded shadow-md text-sm font-bold z-50 ${toast.type === 'error' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
          {toast.message}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Machines</h1>
          <p className="text-sm text-slate-500 font-medium">Manage your heavy equipment inventory.</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-yellow-500 text-slate-900 hover:bg-yellow-400">
          <Plus className="h-4 w-4 mr-2" /> Add Machine
        </Button>
      </div>

      {machines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map((machine) => (
            <Card key={machine.id} className="overflow-hidden flex flex-col">
              <div className="h-32 bg-slate-100 flex items-center justify-center border-b border-slate-200">
                <Truck className="h-12 w-12 text-slate-300" />
              </div>
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-800">{machine.type}</h3>
                    <p className="text-xs text-slate-500 font-mono">{machine.registration_number}</p>
                    {(machine.make || machine.model_name) && (
                      <p className="text-xs text-slate-600 font-medium mt-1">
                        {machine.make} {machine.model_name} {machine.year ? `(${machine.year})` : ''}
                      </p>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${
                    machine.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {machine.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {machine.capacity > 0 && (
                    <div className="bg-slate-50 p-2 rounded border border-slate-100">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase mb-0.5">Capacity</span>
                      <span className="font-semibold text-slate-700">{machine.capacity} Tons</span>
                    </div>
                  )}
                  {machine.hourly_rate > 0 && (
                    <div className="bg-slate-50 p-2 rounded border border-slate-100">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase mb-0.5">Hourly Rate</span>
                      <span className="font-semibold text-slate-700">R {machine.hourly_rate}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white border border-slate-200 rounded-3xl">
          <Truck className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No Machines Yet</h3>
          <p className="text-sm text-slate-500 mt-2 mb-6">You haven't added any heavy equipment to your fleet.</p>
          <Button onClick={() => setShowAddModal(true)} className="bg-yellow-500 text-slate-900 hover:bg-yellow-400">
            <Plus className="h-4 w-4 mr-2" /> Add Your First Machine
          </Button>
        </div>
      )}

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Machine">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Machine Type</label>
            <select
              value={formData.type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select a Machine Type</option>
              {machineData.map(m => (
                <option key={m.id} value={m.name}>{m.name} ({m.category})</option>
              ))}
            </select>
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Make (Optional)</label>
              <Input value={formData.make} onChange={(e) => setFormData({...formData, make: e.target.value})} placeholder="e.g. Caterpillar" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Model (Optional)</label>
              <Input value={formData.model_name} onChange={(e) => setFormData({...formData, model_name: e.target.value})} placeholder="e.g. 428F" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Year (Optional)</label>
              <Input type="number" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} placeholder="e.g. 2018" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Capacity (Tons) (Optional)</label>
              <Input type="number" step="0.1" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} placeholder="e.g. 10" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hourly Rate (R)</label>
              <Input type="number" step="0.1" value={formData.hourly_rate} onChange={(e) => setFormData({...formData, hourly_rate: e.target.value})} placeholder="e.g. 500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Min Hire Hours</label>
              <Input type="number" value={formData.min_hire_hours} onChange={(e) => setFormData({...formData, min_hire_hours: e.target.value})} placeholder="e.g. 4" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Registration / Serial Number</label>
            <Input value={formData.registration_number} onChange={(e) => setFormData({...formData, registration_number: e.target.value})} placeholder="e.g. XYZ 123 GP" />
            {errors.registration_number && <p className="text-red-500 text-xs mt-1">{errors.registration_number}</p>}
          </div>
          <div className="pt-4">
            <Button type="submit" className="w-full bg-yellow-500 text-slate-900 hover:bg-yellow-400">Save Machine</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
