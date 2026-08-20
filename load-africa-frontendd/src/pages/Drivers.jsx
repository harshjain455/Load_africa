import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck, ShieldCheck, Mail, MessageSquare, Phone, Wallet, Calendar, Shield, User, Wrench, Building, MapPin, ArrowRight, Upload, CheckCircle2, ChevronDown, AlertCircle, ArrowLeft, X
} from 'lucide-react';
import { Card, Input, Select, GooglePlacesInput } from '../components/ui';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { authService } from '../services/authService';

const VEHICLE_TYPES = [
  'LDV',
  'Bakkie',
  'Coldroom Bakkie',
  '1-3 Ton Truck',
  'Furniture Truck',
  '4-8 Ton Truck',
  'Box Truck',
  'Flatbed Truck',
  'Dropside Truck',
  'Curtain-Side Truck',
  'Crane Truck',
  'Tipper Truck',
  'Side Tipper',
  'Water Tanker',
  'Fuel Tanker',
];

export default function Drivers() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Personal & Vehicle, 2: Documents, 3: Complete
  const [createdAccount, setCreatedAccount] = useState(false);
  const [authMode, setAuthMode] = useState('signup'); // 'signup' or 'signin'

  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const [vehicleDropdownOpen, setVehicleDropdownOpen] = useState(false);
  const vehicleDropdownRef = useRef(null);

  useEffect(() => {
    if (window.location.hash === '#onboarding-wizard') {
      setIsWizardOpen(true);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (vehicleDropdownRef.current && !vehicleDropdownRef.current.contains(event.target)) {
        setVehicleDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Step 1: Personal Details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');

  // Step 2: Driver Details
    const [fleetOwnerId, setFleetOwnerId] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');

  // Step 3: Vehicle Details
  const [vehicleType, setVehicleType] = useState('Bakkie');
  const [vehicleReg, setVehicleReg] = useState('');
  const [vin, setVin] = useState('');
  const [capacity, setCapacity] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');

  // Step 4: Documents
  const [docs, setDocs] = useState({
    profilePhoto: '', selfie: '', govtId: '', licenseFront: '', licenseBack: '', 
    policeClearance: '', medicalCertificate: '', proofOfAddress: '', 
    vehicleRegistration: '', insuranceDoc: '', roadworthyDoc: ''
  });
  const [uploading, setUploading] = useState({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleFileUpload = async (e, docKey) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('files', file);

    setUploading(prev => ({ ...prev, [docKey]: true }));
    try {
      const res = await authService.uploadFile(formData);
      if (res.success && res.data?.urls?.[0]) {
        setDocs(prev => ({ ...prev, [docKey]: res.data.urls[0] }));
      } else {
        alert('File upload failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Upload error.');
    } finally {
      setUploading(prev => ({ ...prev, [docKey]: false }));
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setSubmitError('');

      const res = await authService.registerDriver({
        email,
        password,
        fullName,
        phone,
        profile: {
          dob: dob || null,
          gender: gender || null,
          emergencyContactName: emergencyContactName || null,
          emergencyContactPhone: emergencyContactPhone || null,
          address: address || null,
          province: province || null,
          city: city || null
        },
        kyc: {
          nationalId: nationalId || null,
          licenseNumber: licenseNumber || null,
          licenseExpiry: licenseExpiry || null
        },
        vehicle: {
          driverType,
          fleetOwnerId: fleetOwnerId || null,
          vehicleType: vehicleType || null,
          registrationNumber: vehicleReg || null,
          vin: vin || null,
          capacity: capacity ? parseFloat(capacity) : null,
          manufacturer: manufacturer || null,
          model: model || null,
          year: year ? parseInt(year) : null
        },
        documents: docs
      });

      if (res.success) {
        setStep(6); // Success Step
      } else {
        setSubmitError(res.message || 'Failed to submit application');
      }
    } catch (err) {
      console.error(err);
      setSubmitError(err.response?.data?.message || err.message || 'Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden relative selection:bg-amber-500 selection:text-slate-955">

      <Navbar />

      {/* Hero Header Area */}
      <div className="relative z-10 w-full overflow-hidden bg-slate-900 text-white border-b border-slate-800 py-12 lg:py-20 mt-16">
        <main className="relative z-10 max-w-7xl mx-auto px-6 text-left space-y-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          
          <div className="space-y-4">
            <span className="text-[#f99c00] font-bold text-xs uppercase tracking-wider block">
              FOR DRIVERS
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight uppercase max-w-4xl tracking-tight">
              DRIVE WITH LOADAFRICA
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-3xl">
              Own a bakkie, truck, tipper or tanker? Get on South Africa's logistics load board and start earning.
            </p>
            <div className="pt-4">
              <button
                onClick={() => setIsWizardOpen(true)}
                className="inline-block px-6 py-3.5 bg-[#f99c00] hover:bg-[#e08b00] text-slate-950 font-black rounded-lg text-xs uppercase tracking-wider"
              >
                REGISTER AS DRIVER
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-16 text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white border border-slate-200/80 p-8 text-left space-y-4 shadow-xs rounded-2xl">
            <div className="h-10 w-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0"><Wallet className="h-5 w-5" /></div>
            <div className="space-y-1"><h4 className="font-extrabold text-sm text-slate-950">Get Paid Fast</h4><p className="text-xs text-slate-550 leading-relaxed font-normal">Trip earnings settle quickly after delivery confirmation.</p></div>
          </Card>
          <Card className="bg-white border border-slate-200/80 p-8 text-left space-y-4 shadow-xs rounded-2xl">
            <div className="h-10 w-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0"><Calendar className="h-5 w-5" /></div>
            <div className="space-y-1"><h4 className="font-extrabold text-sm text-slate-955">Flexible Loads</h4><p className="text-xs text-slate-555 leading-relaxed font-normal">Pick the loads that suit your schedule and routes.</p></div>
          </Card>
          <Card className="bg-white border border-slate-200/80 p-8 text-left space-y-4 shadow-xs rounded-2xl">
            <div className="h-10 w-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0"><Shield className="h-5 w-5" /></div>
            <div className="space-y-1"><h4 className="font-extrabold text-sm text-slate-950">Verified Platform</h4><p className="text-xs text-slate-550 leading-relaxed font-normal">Real customers, ID-verified bookings, transparent ratings.</p></div>
          </Card>
        </div>
      </main>

      {/* Onboarding Wizard Modal */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200 pt-8 pb-6 px-6 sm:px-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsWizardOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <section id="onboarding-wizard" className="w-full text-center space-y-6">
        
        {/* Wizard Progress Tracker */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-bold text-slate-400 overflow-x-auto pb-2">
          {[1,2,3,4,5].map(s => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <span className={`h-6 w-6 sm:h-7 sm:w-7 rounded-full flex items-center justify-center transition-colors ${step >= s ? 'bg-[#f99c00] text-white' : 'bg-slate-200 text-slate-600'}`}>{s}</span>
                <span className={step >= s ? 'text-slate-955 font-black hidden sm:inline' : 'hidden sm:inline'}>
                  {s===1?'Personal':s===2?'Driver':s===3?'Vehicle':s===4?'Documents':'Review'}
                </span>
              </div>
              {s < 5 && <span className={`h-px w-4 sm:w-8 ${step > s ? 'bg-[#f99c00]' : 'bg-slate-200'}`}></span>}
            </React.Fragment>
          ))}
        </div>

        <div className="text-left w-full">
          
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-4 animate-fadeIn">
              <h3 className="font-black text-lg text-slate-900 border-b border-slate-100 pb-2">Step 1: Account & Personal Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name *" value={fullName} onChange={e => setFullName(e.target.value)} required />
                <Input label="Email Address *" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                <Input label="Phone Number *" value={phone} onChange={e => setPhone(e.target.value)} required />
                <Input label="Password *" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <Input label="Residential Address" value={address} onChange={e => setAddress(e.target.value)} />
              </div>
              
              <button type="submit" className="w-full py-3 bg-[#f99c00] hover:bg-[#e08b00] text-slate-950 font-black rounded-lg text-xs tracking-wider uppercase mt-4">
                Next: Driver Details
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleNext} className="space-y-4 animate-fadeIn">
              <h3 className="font-black text-lg text-slate-900 border-b border-slate-100 pb-2">Step 2: Driver Details</h3>
              
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Driver Type *</label>
                <select value={driverType} onChange={e => setDriverType(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                                    <option value="FLEET">Working for a Fleet Owner</option>
                </select>
              </div>

              {/* Fleet field */}
<div className="space-y-4">
  <div>
    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Fleet Owner Code / ID *</label>
    <Input value={fleetOwnerId} onChange={(e) => setFleetOwnerId(e.target.value)} placeholder="Enter your fleet owner's unique code" required />
  </div>
</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="National ID Number *" value={nationalId} onChange={e => setNationalId(e.target.value)} required />
                <Input label="License Number *" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="License Expiry Date *" type="date" value={licenseExpiry} onChange={e => setLicenseExpiry(e.target.value)} required />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={handleBack} className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-lg text-xs uppercase">Back</button>
                <button type="submit" className="flex-1 py-3 bg-[#f99c00] hover:bg-[#e08b00] text-slate-950 font-black rounded-lg text-xs uppercase">Next: Vehicle</button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleNext} className="space-y-4 animate-fadeIn">
              <h3 className="font-black text-lg text-slate-900 border-b border-slate-100 pb-2">Step 3: Vehicle Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Vehicle Type *</label>
                  <select value={vehicleType} onChange={e => setVehicleType(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                    {VEHICLE_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <Input label="Registration Number *" value={vehicleReg} onChange={e => setVehicleReg(e.target.value)} required />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="VIN Number" value={vin} onChange={e => setVin(e.target.value)} />
                <Input label="Capacity (kg/tons)" type="number" value={capacity} onChange={e => setCapacity(e.target.value)} />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input label="Make/Manufacturer" value={manufacturer} onChange={e => setManufacturer(e.target.value)} />
                <Input label="Model" value={model} onChange={e => setModel(e.target.value)} />
                <Input label="Year" type="number" value={year} onChange={e => setYear(e.target.value)} />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={handleBack} className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-lg text-xs uppercase">Back</button>
                <button type="submit" className="flex-1 py-3 bg-[#f99c00] hover:bg-[#e08b00] text-slate-950 font-black rounded-lg text-xs uppercase">Next: Documents</button>
              </div>
            </form>
          )}

          {step === 4 && (
            <form onSubmit={handleNext} className="space-y-4 animate-fadeIn">
              <h3 className="font-black text-lg text-slate-900 border-b border-slate-100 pb-2">Step 4: Upload Documents</h3>
              <p className="text-xs text-slate-500 font-medium">Please provide clear photos or scans. Mandatory documents are marked with (*).</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'govtId', label: 'National ID/Passport *', req: true },
                  { key: 'licenseFront', label: "Driver's License (Front) *", req: true },
                  { key: 'vehicleRegistration', label: 'Vehicle Registration *', req: true },
                  { key: 'proofOfAddress', label: 'Proof of Address', req: false },
                  { key: 'insuranceDoc', label: 'Vehicle Insurance', req: false },
                  { key: 'policeClearance', label: 'Police Clearance', req: false },
                ].map(doc => (
                  <div key={doc.key} className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col justify-between">
                    <div className="mb-2">
                      <h5 className="font-bold text-xs text-slate-900">{doc.label}</h5>
                    </div>
                    <input type="file" id={`file_${doc.key}`} className="hidden" accept="image/*,application/pdf" onChange={e => handleFileUpload(e, doc.key)} />
                    <button type="button" onClick={() => document.getElementById(`file_${doc.key}`).click()} disabled={uploading[doc.key]}
                      className={`w-full py-2 text-[10px] font-bold rounded-lg transition-colors border ${docs[doc.key] ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      {uploading[doc.key] ? 'Uploading...' : docs[doc.key] ? 'Uploaded ✔' : 'Upload File'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={handleBack} className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-lg text-xs uppercase">Back</button>
                <button type="submit" disabled={!docs.govtId || !docs.licenseFront || !docs.vehicleRegistration} 
                  className="flex-1 py-3 bg-[#f99c00] hover:bg-[#e08b00] disabled:bg-slate-300 disabled:text-slate-500 text-slate-950 font-black rounded-lg text-xs uppercase">
                  Next: Review
                </button>
              </div>
            </form>
          )}

          {step === 5 && (
            <form onSubmit={handleSubmit} className="space-y-5 animate-fadeIn">
              <h3 className="font-black text-lg text-slate-900 border-b border-slate-100 pb-2">Step 5: Review & Submit</h3>
              
              <div className="space-y-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <h4 className="font-black text-slate-400 uppercase tracking-wider mb-1 text-[10px]">Personal Info</h4>
                  <p className="font-semibold text-slate-800">{fullName} • {email} • {phone}</p>
                  <p className="text-slate-600 mt-1">{address}, {city}, {province}</p>
                </div>
                <div className="border-t border-slate-200 pt-3">
                  <h4 className="font-black text-slate-400 uppercase tracking-wider mb-1 text-[10px]">Driver Profile</h4>
                  <p className="font-semibold text-slate-800">Type: {driverType} • ID: {nationalId}</p>
                  <p className="text-slate-600 mt-1">License: {licenseNumber} (Exp: {licenseExpiry})</p>
                </div>
                <div className="border-t border-slate-200 pt-3">
                  <h4 className="font-black text-slate-400 uppercase tracking-wider mb-1 text-[10px]">Vehicle</h4>
                  <p className="font-semibold text-slate-800">{vehicleType} • {vehicleReg}</p>
                  <p className="text-slate-600 mt-1">{manufacturer} {model} {year ? `(${year})` : ''}</p>
                </div>
              </div>

              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                  <span className="font-semibold">{submitError}</span>
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <button type="button" onClick={handleBack} disabled={submitting} className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-lg text-xs uppercase">Back</button>
                <button type="submit" disabled={submitting} className="flex-[2] py-3 bg-[#f99c00] hover:bg-[#e08b00] text-slate-950 font-black rounded-lg text-xs uppercase disabled:opacity-50">
                  {submitting ? 'SUBMITTING FOR VERIFICATION...' : 'SUBMIT FOR VERIFICATION'}
                </button>
              </div>
            </form>
          )}

          {step === 6 && (
            <div className="space-y-6 text-center py-6 animate-scaleIn">
              <div className="mx-auto h-16 w-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-200">
                <ShieldCheck className="h-8 w-8 text-amber-500" />
              </div>

              <div className="space-y-2">
                <h3 className="font-black text-lg text-amber-600 uppercase tracking-tight">Verification Pending</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-bold max-w-sm mx-auto">
                  Your profile, vehicle registrations, and licensing details have been submitted. Our compliance team will review your application before you can start receiving load offers.
                </p>
              </div>

              <button 
                onClick={() => { setIsWizardOpen(false); navigate('/login'); }}
                className="w-full sm:w-auto px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-lg text-xs tracking-wider uppercase transition-colors mx-auto block"
              >
                RETURN TO LOGIN
              </button>
            </div>
          )}

        </div>
      </section>
      </div>
    </div>
  )}

      <Footer light />
    </div>
  );
}
