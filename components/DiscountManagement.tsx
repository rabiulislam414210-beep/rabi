
import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, User, Box, Hash, Zap, Ticket, CheckCircle2, ChevronDown, Percent } from 'lucide-react';
import { Discount, Product } from '../types';
import { MOCK_CUSTOMERS } from '../constants';

interface DiscountManagementProps {
  discounts: Discount[];
  setDiscounts: React.Dispatch<React.SetStateAction<Discount[]>>;
  products: Product[];
}

const DiscountManagement: React.FC<DiscountManagementProps> = ({ discounts, setDiscounts, products }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDiscount, setNewDiscount] = useState<Partial<Discount>>({
    isActive: true,
    isAutomatic: true,
    percentage: 10,
    targetCustomerId: '',
    targetProductId: '',
    code: ''
  });

  useEffect(() => {
    if (newDiscount.targetCustomerId) {
      const customer = MOCK_CUSTOMERS.find(c => c.id === newDiscount.targetCustomerId);
      if (customer) {
        setNewDiscount(prev => ({ ...prev, code: customer.phone }));
      }
    }
  }, [newDiscount.targetCustomerId]);

  const handleAddDiscount = () => {
    if (!newDiscount.isAutomatic && !newDiscount.code) {
      alert("Please provide a promo code!");
      return;
    }
    if (!newDiscount.percentage || newDiscount.percentage <= 0 || newDiscount.percentage > 99) {
      alert("Please provide a valid percentage (1-99)!");
      return;
    }
    
    const targetProduct = products.find(p => p.id === newDiscount.targetProductId);

    const discount: Discount = {
      id: Math.random().toString(36).substr(2, 9),
      code: newDiscount.isAutomatic ? `AUTO-${Math.random().toString(36).substr(2, 4).toUpperCase()}` : (newDiscount.code || '').toUpperCase(),
      percentage: newDiscount.percentage,
      isActive: true,
      isAutomatic: !!newDiscount.isAutomatic,
      description: newDiscount.description || (
        targetProduct 
          ? `Admin Set: ${newDiscount.percentage}% Discount on ${targetProduct.name}`
          : `${newDiscount.percentage}% Shop-wide Discount`
      ),
      targetCustomerId: newDiscount.targetCustomerId === '' ? undefined : newDiscount.targetCustomerId,
      targetProductId: newDiscount.targetProductId === '' ? undefined : newDiscount.targetProductId
    };

    setDiscounts(prev => [...prev, discount]);
    setIsModalOpen(false);
    setNewDiscount({ isActive: true, isAutomatic: true, percentage: 10, targetCustomerId: '', targetProductId: '', code: '' });
  };

  const removeDiscount = (id: string) => {
    setDiscounts(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
             <Percent className="text-indigo-600" /> Administrative Discounts
          </h2>
          <p className="text-slate-500 font-medium italic">Select any product and define its custom discount percentage.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] hover:bg-indigo-600 shadow-xl flex items-center justify-center gap-3 font-black text-sm transition-all active:scale-95 border border-slate-700"
        >
          <Plus size={20} />
          Create New Sale Rule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {discounts.map(discount => {
          const targetCustomer = MOCK_CUSTOMERS.find(c => c.id === discount.targetCustomerId);
          const targetProduct = products.find(p => p.id === discount.targetProductId);
          
          return (
            <div key={discount.id} className={`bg-white p-7 rounded-[2.5rem] shadow-sm border transition-all duration-300 group flex flex-col relative overflow-hidden ${discount.isAutomatic ? 'border-indigo-100 ring-4 ring-indigo-50/50' : 'border-slate-100'}`}>
              {discount.isAutomatic && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white px-5 py-1.5 rounded-bl-[1.5rem] text-[9px] font-black uppercase tracking-widest shadow-sm">
                  Active Sale
                </div>
              )}
              
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl transition-colors ${discount.isAutomatic ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-900 group-hover:text-white'}`}>
                  {discount.isAutomatic ? <Zap size={24} /> : <Ticket size={24} />}
                </div>
                <button onClick={() => removeDiscount(discount.id)} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-black text-slate-800 truncate mb-1">
                    {discount.isAutomatic ? (targetProduct ? 'Product Markdown' : 'General Sale') : discount.code}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold leading-relaxed">{discount.description}</p>
                </div>
                
                <div className="space-y-2">
                   <div className="flex items-center gap-3 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                     <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                       {targetProduct ? <Box size={18} /> : <User size={18} />}
                     </div>
                     <div className="flex flex-col min-w-0">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                         {targetProduct ? 'Target Item' : (targetCustomer ? 'Private Coupon' : 'Universal Code')}
                       </span>
                       <span className="text-sm font-black text-slate-900 truncate">
                         {targetProduct ? targetProduct.name : (targetCustomer ? targetCustomer.name : 'All Products')}
                       </span>
                     </div>
                   </div>
                </div>
              </div>
              
              <div className="flex items-end justify-between mt-8 pt-6 border-t border-slate-50">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Admin Selection</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-4xl font-black text-indigo-600 tracking-tighter">{discount.percentage}%</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase">Discount</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border ${discount.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-300 border-slate-100'}`}>
                    {discount.isActive ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.2)] p-12 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh] border border-slate-100">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Administrative Logic</h3>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Configure Price Reductions</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-300 hover:text-slate-900 rounded-full transition-all hover:bg-slate-100 font-black">✕</button>
            </div>

            <div className="space-y-10">
              {/* Mode Selection */}
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Discount Type</label>
                <div className="flex p-2 bg-slate-100 rounded-[2rem] gap-2">
                  <button 
                    onClick={() => setNewDiscount(prev => ({ ...prev, isAutomatic: true }))}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all ${newDiscount.isAutomatic ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <Zap size={16} /> Direct Markdown
                  </button>
                  <button 
                    onClick={() => setNewDiscount(prev => ({ ...prev, isAutomatic: false }))}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all ${!newDiscount.isAutomatic ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <Ticket size={16} /> Promo Coupon
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 italic px-2">
                  {newDiscount.isAutomatic 
                    ? "Direct markdown applies instantly to the selected product's price in the store." 
                    : "Promo coupons require the customer to enter a code during checkout."}
                </p>
              </div>

              {/* Product Selection */}
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Box size={14} /> Target Individual Product
                </label>
                <div className="relative">
                  <select 
                    className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-8 focus:ring-indigo-50 outline-none appearance-none font-black text-slate-800 cursor-pointer pr-16"
                    value={newDiscount.targetProductId || ''}
                    onChange={e => setNewDiscount(prev => ({ ...prev, targetProductId: e.target.value }))}
                  >
                    <option value="">Apply to Total Shop Cart</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (Code: {p.code})</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                </div>
              </div>

              {!newDiscount.isAutomatic && (
                <div className="space-y-8 animate-in slide-in-from-top-4">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <User size={14} /> Target Customer Identity
                    </label>
                    <div className="relative">
                      <select 
                        className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-8 focus:ring-indigo-50 outline-none appearance-none font-black text-slate-800 cursor-pointer pr-16"
                        value={newDiscount.targetCustomerId || ''}
                        onChange={e => setNewDiscount(prev => ({ ...prev, targetCustomerId: e.target.value }))}
                      >
                        <option value="">Public Use (Everyone)</option>
                        {MOCK_CUSTOMERS.map(c => (
                          <option key={c.id} value={c.id}>{c.name} (Phone: {c.phone})</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Ticket size={14} /> Custom Promo Key
                    </label>
                    <input 
                      type="text" 
                      className={`w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-8 focus:ring-indigo-50 outline-none font-black text-slate-900 uppercase tracking-[0.2em] transition-all ${newDiscount.targetCustomerId ? 'bg-indigo-50/50 text-indigo-600 border-indigo-100 shadow-inner' : ''}`}
                      placeholder="e.g. FLASH30"
                      value={newDiscount.code || ''}
                      readOnly={!!newDiscount.targetCustomerId}
                      onChange={e => setNewDiscount(prev => ({ ...prev, code: e.target.value }))}
                    />
                    {newDiscount.targetCustomerId && (
                      <div className="flex items-center gap-2 text-indigo-500 text-[10px] font-black uppercase tracking-widest px-2">
                        <CheckCircle2 size={12} /> Auto-generated from customer phone
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Percentage Input */}
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                   Discount Magnitude (%)
                </label>
                <div className="relative group">
                  <input 
                    type="number" 
                    min="1"
                    max="99"
                    className="w-full px-8 py-6 bg-slate-900 text-white rounded-[2.5rem] focus:ring-12 focus:ring-indigo-50 outline-none font-black text-5xl tracking-tighter transition-all"
                    value={newDiscount.percentage}
                    onChange={e => setNewDiscount(prev => ({ ...prev, percentage: parseInt(e.target.value) }))}
                  />
                  <span className="absolute right-8 top-1/2 -translate-y-1/2 text-5xl font-black text-indigo-500/50 select-none">%</span>
                </div>
                <div className="flex justify-between px-2">
                  <span className="text-[9px] font-black text-slate-300 uppercase">Minimal Reduction</span>
                  <span className="text-[9px] font-black text-slate-300 uppercase">Maximum Markdown</span>
                </div>
              </div>

              <div className="pt-8 flex flex-col gap-4">
                <button 
                  onClick={handleAddDiscount}
                  className="w-full py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black text-xl shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95"
                >
                  Activate Discount Policy
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-3 text-slate-400 font-black text-xs uppercase tracking-[0.3em] hover:text-slate-900 transition-colors"
                >
                  Cancel Creation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountManagement;
