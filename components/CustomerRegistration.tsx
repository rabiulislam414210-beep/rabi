
import React, { useState } from 'react';
import { UserPlus, Mail, Smartphone, User, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Customer } from '../types';

interface CustomerRegistrationProps {
  onRegister: (customer: Customer) => void;
}

const CustomerRegistration: React.FC<CustomerRegistrationProps> = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;

    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      const newCustomer: Customer = {
        id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        type: 'REGULAR'
      };
      
      setSuccess(true);
      setTimeout(() => {
        onRegister(newCustomer);
        setIsSubmitting(false);
      }, 1500);
    }, 1000);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto py-20 text-center animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-50">
          <CheckCircle2 size={48} className="animate-in slide-in-from-bottom-2" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-2">Welcome to the Hub!</h2>
        <p className="text-slate-500 font-medium">Your account has been created successfully. Redirecting you to the store...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 items-center py-8 animate-in fade-in duration-700">
      <div className="lg:w-1/2 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles size={12} /> Membership
          </div>
          <h2 className="text-5xl font-black text-slate-900 leading-tight tracking-tighter">
            Join the <span className="text-indigo-600">Nova Hub</span> Community
          </h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed mt-4">
            Create an account today to unlock exclusive discounts, track your orders, and enjoy a personalized shopping experience.
          </p>
        </div>

        <div className="space-y-4">
          {[
            { icon: ShieldCheck, title: 'Secure Identity', desc: 'Your data is encrypted and safe with us.' },
            { icon: Sparkles, title: 'Exclusive Rewards', desc: 'Get points on every purchase.' },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <div className="p-3 bg-slate-50 text-indigo-600 rounded-xl">
                <item.icon size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{item.title}</h4>
                <p className="text-sm text-slate-400 font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:w-1/2 w-full max-w-md">
        <form 
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-indigo-100 border border-slate-100 space-y-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-indigo-600 text-white p-3 rounded-2xl">
              <UserPlus size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">Registration</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Create Your Profile</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Abdullah Al Mamun"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Personal Gmail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  required
                  type="email" 
                  placeholder="username@gmail.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  required
                  type="tel" 
                  placeholder="01XXXXXXXXX"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 tracking-widest"
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-100 hover:shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight size={20} />
              </>
            )}
          </button>

          <p className="text-[10px] text-slate-400 text-center font-bold px-4 leading-relaxed">
            By registering, you agree to our <span className="text-indigo-600 underline cursor-pointer">Terms of Service</span> and <span className="text-indigo-600 underline cursor-pointer">Privacy Policy</span>.
          </p>
        </form>
      </div>
    </div>
  );
};

export default CustomerRegistration;
