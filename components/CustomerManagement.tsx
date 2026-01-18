
import React from 'react';
import { Mail, Phone, Shield, Trash2, User, Search, MapPin, Calendar, Star } from 'lucide-react';
import { Customer } from '../types';

interface CustomerManagementProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

const CustomerManagement: React.FC<CustomerManagementProps> = ({ customers, setCustomers }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const deleteCustomer = (id: string) => {
    if (confirm("Are you sure you want to remove this customer account? This will revoke their access.")) {
      setCustomers(prev => prev.filter(c => c.id !== id));
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const typeStyles = {
    REGULAR: 'bg-slate-100 text-slate-600',
    PREMIUM: 'bg-indigo-100 text-indigo-700',
    VIP: 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800">Customer Base</h2>
          <p className="text-slate-500">Manage verified accounts and user levels</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {customer.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-slate-800 text-lg leading-tight">{customer.name}</h3>
                  <button 
                    onClick={() => deleteCustomer(customer.id)}
                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest mt-1 inline-block ${typeStyles[customer.type]}`}>
                  {customer.type} Member
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100 hover:bg-white transition-colors">
                <div className="p-2 bg-white rounded-xl shadow-sm"><Mail size={14} /></div>
                <span className="text-xs font-bold truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100 hover:bg-white transition-colors">
                <div className="p-2 bg-white rounded-xl shadow-sm"><Phone size={14} /></div>
                <span className="text-xs font-bold">{customer.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100 hover:bg-white transition-colors">
                <div className="p-2 bg-white rounded-xl shadow-sm"><Shield size={14} /></div>
                <span className="text-xs font-bold uppercase tracking-tighter">ID: {customer.id}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
               <div className="flex items-center gap-1.5 text-amber-500">
                  <Star size={12} fill="currentColor" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Active User</span>
               </div>
               <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-all">
                 View History
               </button>
            </div>
          </div>
        ))}

        {filteredCustomers.length === 0 && (
          <div className="col-span-full py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300">
            <User size={64} className="mb-4 opacity-10" />
            <p className="font-black text-xl">No customers found</p>
            <p className="text-sm font-medium">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;
