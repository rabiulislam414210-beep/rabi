
import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Tag, Hash, Sparkles, Building2, ShieldAlert, Zap, CheckCircle2, PackagePlus } from 'lucide-react';
import { Product, CartItem, Discount, Customer, View } from '../types';

interface StoreProps {
  products: Product[];
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  discounts?: Discount[];
  currentCustomer: Customer;
  setView: (view: View) => void;
}

const Store: React.FC<StoreProps> = ({ products, cart, setCart, discounts = [], currentCustomer, setView }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const isVIP = currentCustomer.type === 'VIP';

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleBulkAddToCart = () => {
    const selectedProducts = products.filter(p => selectedIds.includes(p.id));
    selectedProducts.forEach(p => {
      setCart(prev => {
        const existing = prev.find(item => item.id === p.id);
        if (existing) return prev; // Don't increment if already there, just add new ones
        return [...prev, { ...p, quantity: 1 }];
      });
    });
    setSelectedIds([]);
    setView('CART');
  };

  const handleBuyNow = (product: Product) => {
    addToCart(product);
    setView('CART');
  };

  const getCartQuantity = (id: string) => {
    return cart.find(item => item.id === id)?.quantity || 0;
  };

  const getProductDiscount = (productId: string) => {
    return discounts
      .filter(d => d.isActive && d.targetProductId === productId)
      .sort((a, b) => b.percentage - a.percentage)[0];
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800">Premium Marketplace</h2>
          <p className="text-slate-500">Curated products with real-time inventory and pricing</p>
        </div>
        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-2xl flex items-center gap-2 border border-emerald-200 animate-in zoom-in">
              <CheckCircle2 size={16} />
              <span className="text-xs font-black uppercase tracking-widest">{selectedIds.length} Marked</span>
            </div>
          )}
          {isVIP && (
            <div className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-xl">
              <Sparkles size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">VIP Mode</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map(product => {
          const inCart = getCartQuantity(product.id);
          const isSelected = selectedIds.includes(product.id);
          const productDiscount = getProductDiscount(product.id);
          const isEligibleForDiscount = !isVIP && productDiscount;
          const discountedPrice = isEligibleForDiscount 
            ? product.price * (1 - productDiscount!.percentage / 100) 
            : product.price;

          return (
            <div 
              key={product.id} 
              className={`group bg-white rounded-3xl shadow-sm hover:shadow-xl border transition-all duration-300 overflow-hidden flex flex-col relative ${isSelected ? 'ring-4 ring-indigo-500/20 border-indigo-500' : 'border-slate-100'}`}
            >
              <div className="relative aspect-square overflow-hidden bg-slate-50">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                
                {/* Multi-select Checkbox */}
                <div className="absolute top-4 left-4 z-20">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleSelection(product.id); }}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all border-2 shadow-lg ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/80 backdrop-blur border-white text-transparent hover:text-slate-300'}`}
                  >
                    <CheckCircle2 size={20} />
                  </button>
                </div>

                <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-indigo-600 shadow-sm self-end">
                    {product.category}
                  </span>
                  {productDiscount && (
                    <div className={`${isEligibleForDiscount ? 'bg-rose-500 ring-rose-500/10' : 'bg-slate-800 ring-slate-800/10'} text-white px-3 py-2 rounded-2xl text-[12px] font-black shadow-lg flex items-center gap-1.5 ring-4 self-end animate-in zoom-in`}>
                      <Sparkles size={12} />
                      {productDiscount.percentage}%
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-1 flex items-center gap-1.5 text-indigo-600">
                   <Building2 size={12} />
                   <span className="text-[10px] font-black uppercase tracking-widest">{product.companyName}</span>
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">{product.name}</h3>
                  <div className="flex flex-col items-end">
                    {isEligibleForDiscount ? (
                      <>
                        <span className="font-black text-rose-600 text-lg leading-none">${discountedPrice.toFixed(2)}</span>
                        <span className="text-[10px] font-bold text-slate-400 line-through mt-0.5">${product.price.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="font-mono font-black text-indigo-600 text-lg">${product.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                <p className="text-slate-500 text-sm mb-6 line-clamp-2 flex-1">{product.description}</p>
                
                <div className="flex items-center gap-2 mt-auto">
                  {inCart > 0 ? (
                    <div className="flex items-center justify-between w-full bg-slate-100 rounded-2xl p-1">
                      <button 
                        onClick={() => setCart(prev => prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0))}
                        className="bg-white p-2 rounded-xl text-slate-600 hover:text-indigo-600 shadow-sm transition-all"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="font-black text-slate-800">{inCart}</span>
                      <button 
                        onClick={() => addToCart(product)}
                        className="bg-white p-2 rounded-xl text-slate-600 hover:text-indigo-600 shadow-sm transition-all"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleBuyNow(product)}
                      className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-slate-100"
                    >
                      <Zap size={18} />
                      Buy Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Selection Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[40] animate-in slide-in-from-bottom-10">
          <div className="bg-slate-900 text-white px-8 py-5 rounded-[2.5rem] shadow-2xl flex items-center gap-8 border border-white/10 ring-8 ring-indigo-500/10 backdrop-blur-md">
            <div className="flex items-center gap-4 border-r border-white/10 pr-8">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-xl font-black leading-none">{selectedIds.length}</p>
                <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mt-1">Products Marked</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedIds([])}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Clear All
              </button>
              <button 
                onClick={handleBulkAddToCart}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
              >
                <PackagePlus size={16} />
                Add & Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
