import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Scale, Calendar, FileText, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { createLoad } from '../../data/mockData';
import { Button, Input, Select, Card, GooglePlacesInput } from '../../components/ui';

export default function CreateBooking() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);

  // Step 1 Form Data
  const [formData, setFormData] = useState({
    title: '',
    category: 'Building Materials',
    description: '',
    weight: '',
    quantity: '',
    vehicleType: '4-Ton & 8-Ton closed trucks',
    pickup: '',
    dropoff: '',
    pickupDate: '',
    deliveryDate: '',
    instructions: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNextStep1 = (e) => {
    e.preventDefault();
    setError('');

    // Date Validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pDate = new Date(formData.pickupDate);
    const dDate = new Date(formData.deliveryDate);

    if (pDate < today) {
      return setError('Pickup date cannot be in the past.');
    }
    if (dDate < pDate) {
      return setError('Delivery date must be after or on the pickup date.');
    }

    // Number validation
    if (Number(formData.weight) <= 0) {
      return setError('Weight must be greater than 0.');
    }
    if (formData.quantity && Number(formData.quantity) <= 0) {
      return setError('Quantity must be greater than 0.');
    }

    if (!formData.pickup || !formData.dropoff) {
      return setError('Pickup and Delivery locations are required.');
    }

    setStep(2);
  };

  const handleCreate = () => {
    setLoading(true);
    const newLoad = {
      title: formData.title,
      category: formData.category,
      weight: `${formData.weight} Tons`,
      pickup: formData.pickup,
      dropoff: formData.dropoff,
      budget: 12000,
      customerName: 'Patrice Motsepe',
      customerId: 'usr-1',
      vehicleType: formData.vehicleType,
      status: 'Quote Requested'
    };

    setTimeout(() => {
      const created = createLoad(newLoad);
      setLoading(false);
      setStep(3);
      
      setTimeout(() => {
        navigate(`/customer/booking-details/${created.id}`);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 text-left animate-fadeIn">
      
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans">Create a Booking</h2>
        <p className="text-xs text-slate-400">Follow the steps below to request a logistics quotation.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-6">
        <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-amber-500' : 'bg-slate-100'}`} />
        <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-amber-500' : 'bg-slate-100'}`} />
        <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-emerald-500' : 'bg-slate-100'}`} />
      </div>

      {step === 1 && (
        <Card className="p-5 sm:p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Step 1: Cargo & Route Details</h3>
          
          <form onSubmit={handleNextStep1} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Cargo Name" name="title" placeholder="e.g. 500 Bags of Cement" value={formData.title} onChange={handleChange} required />
              
              <Select label="Cargo Category" name="category" value={formData.category} onChange={handleChange}>
                <option>Building Materials</option>
                <option>Heavy Equipment</option>
                <option>Food & Beverage</option>
                <option>Agriculture</option>
                <option>Consumer Goods</option>
              </Select>

              <div className="md:col-span-2">
                <Input label="Description" name="description" placeholder="Briefly describe the goods" value={formData.description} onChange={handleChange} />
              </div>

              <Input label="Total Weight (Tons)" name="weight" type="number" min="0.1" step="0.1" placeholder="e.g. 25" value={formData.weight} onChange={handleChange} icon={Scale} required />
              <Input label="Quantity (Items/Pallets)" name="quantity" type="number" min="1" placeholder="e.g. 10" value={formData.quantity} onChange={handleChange} />

              <Select label="Required Vehicle Type" name="vehicleType" value={formData.vehicleType} onChange={handleChange}>
                <option>Bakkie</option>
                <option>4-Ton & 8-Ton closed trucks</option>
                <option>Side Tipper</option>
                <option>Tanker</option>
                <option>Yellow Plant (TLB, Excavator)</option>
              </Select>
              
              <div className="hidden md:block"></div>

              <div className="md:col-span-2">
                <GooglePlacesInput 
                  label="Pickup Address" 
                  placeholder="Search pickup point" 
                  value={formData.pickup} 
                  onChange={e => setFormData(prev => ({ ...prev, pickup: e.target.value }))} 
                  onPlaceSelect={place => setFormData(prev => ({ ...prev, pickup: place.address }))} 
                  icon={MapPin} 
                  required 
                />
              </div>

              <div className="md:col-span-2">
                <GooglePlacesInput 
                  label="Delivery Address" 
                  placeholder="Search destination" 
                  value={formData.dropoff} 
                  onChange={e => setFormData(prev => ({ ...prev, dropoff: e.target.value }))} 
                  onPlaceSelect={place => setFormData(prev => ({ ...prev, dropoff: place.address }))} 
                  icon={MapPin} 
                  required 
                />
              </div>

              <Input label="Pickup Date" name="pickupDate" type="date" value={formData.pickupDate} onChange={handleChange} icon={Calendar} required />
              <Input label="Delivery Date" name="deliveryDate" type="date" value={formData.deliveryDate} onChange={handleChange} icon={Calendar} required />

              <div className="md:col-span-2">
                <Input label="Special Instructions" name="instructions" placeholder="Any special handling required?" value={formData.instructions} onChange={handleChange} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Upload Supporting Documents</label>
                <div 
                  className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors relative"
                >
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    accept=".pdf,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  {file ? (
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      <span className="text-xs font-bold text-slate-800">{file.name}</span>
                    </div>
                  ) : (
                    <>
                      <FileText className="h-5 w-5 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs font-semibold text-slate-600">Click to upload packing lists or manifests</p>
                      <p className="text-[10px] text-slate-400 mt-1">Supported formats: PDF, DOCX, JPG, PNG</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button type="submit">
                View Quotation Summary
                <ArrowRight className="h-4.5 w-4.5 ml-2" />
              </Button>
            </div>
          </form>
        </Card>
      )}

      {step === 2 && (
        <Card className="p-5 sm:p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Step 2: Quote Summary</h3>
          
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Estimated Price</p>
                <p className="text-3xl font-black text-emerald-600">R 12,000</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase">Status</p>
                <p className="text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full inline-block mt-1">Pending Approval</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Route Distance</p>
                <p className="text-sm font-semibold text-slate-900">450 km</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Est. Delivery Time</p>
                <p className="text-sm font-semibold text-slate-900">6 - 8 Hours</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Vehicle Category</p>
                <p className="text-sm font-semibold text-slate-900">{formData.vehicleType}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Cargo Weight</p>
                <p className="text-sm font-semibold text-slate-900">{formData.weight} Tons</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <button type="button" onClick={() => setStep(1)} className="text-xs font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Edit Cargo Details
            </button>
            <Button onClick={handleCreate} disabled={loading}>
              {loading ? (
                <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Submit Booking</>
              )}
            </Button>
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card className="p-12 text-center space-y-4">
          <div className="h-16 w-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">Booking Submitted!</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">Your load has been successfully submitted. Our brokers are reviewing your request and will assign a transporter shortly.</p>
          <p className="text-xs font-bold text-amber-500 pt-4">Redirecting to booking details...</p>
        </Card>
      )}

    </div>
  );
}
