
import React, { useState, useMemo } from 'react';
import { ShoppingCart, Trash2, Tag, CreditCard, ChevronRight, AlertCircle, Phone, Box, Hash, MapPin, CheckCircle2, ArrowLeft, Ticket, Zap, Shield, Download, Printer, Home, Clock, Layers, Plus, Minus, Mail } from 'lucide-react';
import { CartItem, Discount, Order, OrderStatus, Customer } from '../types';

interface CartProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  discounts: Discount[];
  currentCustomer: Customer;
  onOrderSuccess: (order: Order) => void;
}

type CheckoutStep = 'ITEMS' | 'SHIPPING' | 'CONFIRM' | 'SUCCESS';

const Cart: React.FC<CartProps> = ({ cart, setCart, discounts, currentCustomer, onOrderSuccess }) => {
  const [step, setStep] = useState<CheckoutStep>('ITEMS');
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState('');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  const incrementQty = (id: string) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const decrementQty = (id: string) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item).filter(i => i.quantity > 0));
  };

  const baseSubtotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  const autoProductDiscounts = useMemo(() => {
    if (currentCustomer.type === 'VIP') {
      return cart.map(item => ({ itemId: item.id, discount: null, saving: 0 }));
    }

    return cart.map(item => {
      const bestAutoDiscount = discounts
        .filter(d => d.isActive && d.isAutomatic && d.targetProductId === item.id)
        .sort((a, b) => b.percentage - a.percentage)[0];
      
      return {
        itemId: item.id,
        discount: bestAutoDiscount,
        saving: bestAutoDiscount ? (item.price * item.quantity * bestAutoDiscount.percentage) / 100 : 0
      };
    });
  }, [cart, discounts, currentCustomer]);

  const totalAutoSavings = autoProductDiscounts.reduce((acc, curr) => acc + curr.saving, 0);

  const calculateManualDiscountAmount = () => {
    if (!appliedDiscount) return 0;
    if (appliedDiscount.targetProductId) {
      const targetItem = cart.find(item => item.id === appliedDiscount.targetProductId);
      if (targetItem) return (targetItem.price * targetItem.quantity * appliedDiscount.percentage) / 100;
      return 0;
    }
    const subtotalAfterAuto = baseSubtotal - totalAutoSavings;
    return (subtotalAfterAuto * appliedDiscount.percentage) / 100;
  };

  const manualDiscountAmount = calculateManualDiscountAmount();
  const totalSavings = totalAutoSavings + manualDiscountAmount;
  const finalTotal = baseSubtotal - totalSavings;

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      const newOrder: Order = {
        id: Math.floor(100000 + Math.random() * 900000).toString(),
        customerId: currentCustomer.id,
        customerName: currentCustomer.name,
        shippingAddress: address,
        items: [...cart],
        total: finalTotal,
        discountApplied: appliedDiscount || (totalAutoSavings > 0 ? { id: 'AUTO', code: 'AUTO-SALE', percentage: 0, isActive: true, isAutomatic: true, description: 'Automatic Product Savings' } : undefined),
        status: OrderStatus.PENDING,
        createdAt: new Date().toISOString(),
        paymentMethod: 'Cash on Delivery'
      };
      setLastPlacedOrder(newOrder);
      setCart([]);
      setIsProcessing(false);
      setStep('SUCCESS');
    }, 1500);
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });
  };

  const handleEmailReceipt = () => {
    if (!lastPlacedOrder) return;
    const itemsList = lastPlacedOrder.items.map(i => `- ${i.name} (${i.quantity}x) : $${(i.price * i.quantity).toFixed(2)}`).join('%0D%0A');
    const subject = `Order Confirmation #${lastPlacedOrder.id} - Nova Hub`;
    const body = `Hello ${lastPlacedOrder.customerName},%0D%0A%0D%0AYour order has been placed successfully!%0D%0A%0D%0AOrder ID: #${lastPlacedOrder.id}%0D%0ADate: ${formatDateTime(lastPlacedOrder.createdAt)}%0D%0A%0D%0AItems:%0D%0A${itemsList}%0D%0A%0D%0ATotal Amount: $${lastPlacedOrder.total.toFixed(2)}%0D%0AShipping Address: ${lastPlacedOrder.shippingAddress}%0D%0A%0D%0AThank you for shopping with Nova Hub!`;
    
    window.location.href = `mailto:${currentCustomer.email}?subject=${subject}&body=${body}`;
  };

  const handleFinishCheckout = () => {
    if (lastPlacedOrder) onOrderSuccess(lastPlacedOrder);
  };

  if (step === 'SUCCESS' && lastPlacedOrder) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-10 animate-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-200 mb-8">
            <CheckCircle2 size={64} />
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Awesome, order confirmed!</h2>
          <div className="mt-4 flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] bg-slate-50 px-4 py-2 rounded-full border border-slate-100 mx-auto">
             <Clock size={12} className="text-indigo-400" /> {formatDateTime(lastPlacedOrder.createdAt)}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleEmailReceipt} 
            className="px-10 py-5 bg-rose-600 text-white rounded-3xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-rose-700 transition-all active:scale-95 shadow-xl shadow-rose-100"
          >
            <Mail size={18} /> Send Receipt to Gmail
          </button>
          
          <button 
            onClick={handleFinishCheckout} 
            className="px-10 py-5 bg-indigo-50 text-indigo-600 rounded-3xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-100 transition-all active:scale-95"
          >
            <Home size={18} /> Back to Dashboard
          </button>
        </div>

        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">A copy of this order has been saved to your local history</p>
      </div>
    );
  }
  
  if (cart.length === 0 && step !== 'SUCCESS') {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in text-center">
        <div className="bg-indigo-50 p-8 rounded-full mb-6 text-indigo-400"><ShoppingCart size={64} /></div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 max-w-xs mx-auto">Start shopping to see items in your cart.</p>
        <button onClick={() => window.location.reload()} className="mt-8 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all">Go to Store</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4">
      <div className="flex items-center justify-center gap-4 mb-8">
        {[
          { id: 'ITEMS', label: 'Cart' },
          { id: 'SHIPPING', label: 'Shipping' },
          { id: 'CONFIRM', label: 'Summary' }
        ].map((s, idx) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                step === s.id ? 'bg-indigo-600 text-white shadow-lg ring-4 ring-indigo-50' : 
                (idx < ['ITEMS', 'SHIPPING', 'CONFIRM'].indexOf(step) ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500')
              }`}>
                {idx < ['ITEMS', 'SHIPPING', 'CONFIRM'].indexOf(step) ? <CheckCircle2 size={18} /> : idx + 1}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${step === s.id ? 'text-indigo-600' : 'text-slate-400'}`}>{s.label}</span>
            </div>
            {idx < 2 && <div className={`w-16 h-0.5 rounded-full ${idx < ['ITEMS', 'SHIPPING', 'CONFIRM'].indexOf(step) ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {step === 'ITEMS' && (
            <div className="space-y-6 animate-in slide-in-from-left-4">
              <div className="flex items-center justify-between"><h2 className="text-2xl font-black text-slate-800">Shopping Bag</h2></div>
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-all group">
                    <img src={item.image} className="w-20 h-20 rounded-2xl object-cover border border-slate-50" />
                    <div className="flex-1">
                      <h3 className="font-black text-slate-800 group-hover:text-indigo-600 transition-colors text-lg leading-none mb-2">{item.name}</h3>
                      <div className="flex items-center gap-4">
                         <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-1 border border-slate-100">
                           <button onClick={() => decrementQty(item.id)} className="p-1.5 bg-white rounded-lg text-slate-400 hover:text-rose-500 transition-all"><Minus size={14} /></button>
                           <span className="w-8 text-center font-black text-sm">{item.quantity}</span>
                           <button onClick={() => incrementQty(item.id)} className="p-1.5 bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-all"><Plus size={14} /></button>
                         </div>
                         <span className="font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                    <button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} className="p-3 text-slate-200 hover:text-rose-500 transition-all"><Trash2 size={20} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'SHIPPING' && (
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 space-y-8 animate-in slide-in-from-right-4">
              <div className="flex items-center gap-3 text-indigo-600"><MapPin size={24} /><h2 className="text-2xl font-black text-slate-800">Where to Send?</h2></div>
              <textarea 
                placeholder="Provide full address for smooth delivery..."
                className="w-full px-7 py-6 bg-slate-50 border border-slate-200 rounded-[2.5rem] focus:ring-8 focus:ring-indigo-50 outline-none h-44 resize-none font-bold text-slate-700 transition-all shadow-inner"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <div className="flex gap-4 pt-4">
                 <button onClick={() => setStep('ITEMS')} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-3xl font-black flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"><ArrowLeft size={18} /> Back</button>
                 <button disabled={!address.trim()} onClick={() => setStep('CONFIRM')} className="flex-[2] py-5 bg-slate-900 text-white rounded-3xl font-black hover:bg-indigo-600 transition-all shadow-xl disabled:opacity-50">Continue to Summary</button>
              </div>
            </div>
          )}

          {step === 'CONFIRM' && (
            <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-10 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-50 pb-8">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                  <div className="bg-indigo-600 text-white p-3 rounded-2xl shadow-lg"><Layers size={32} /></div>
                  Order Summary
                </h2>
              </div>
              
              <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 px-2">Review & Adjust Products</p>
                 {cart.map(item => (
                   <div key={item.id} className="p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 flex items-center justify-between hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
                      <div className="flex items-center gap-5">
                         <img src={item.image} className="w-16 h-16 rounded-[1.2rem] object-cover shadow-sm bg-white" />
                         <div>
                            <h5 className="font-black text-slate-800 text-lg leading-none">{item.name}</h5>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Unit: ${item.price.toFixed(2)}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-6">
                         <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-2xl shadow-sm border border-slate-100">
                            <button onClick={() => decrementQty(item.id)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-all"><Minus size={14} /></button>
                            <span className="font-black text-sm w-6 text-center">{item.quantity}</span>
                            <button onClick={() => incrementQty(item.id)} className="p-1.5 text-slate-400 hover:text-indigo-600 transition-all"><Plus size={14} /></button>
                         </div>
                         <div className="text-right w-24">
                            <p className="text-xl font-black text-slate-900 tracking-tighter">${(item.price * item.quantity).toFixed(2)}</p>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest flex items-center gap-2"><MapPin size={12} /> Shipping to</h4>
                      <p className="font-black text-slate-900 text-xl mb-2">{currentCustomer.name}</p>
                      <p className="text-slate-600 font-bold leading-relaxed mb-6 italic">{address}</p>
                    </div>
                    <button onClick={() => setStep('SHIPPING')} className="text-[10px] font-black uppercase text-indigo-600 tracking-widest hover:underline text-left">Change Address</button>
                 </div>

                 <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <h4 className="text-[11px] font-black uppercase text-slate-400 mb-8 tracking-[0.3em]">Billing Final</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm font-bold text-slate-400"><span>Market Subtotal</span><span className="text-white font-black">${baseSubtotal.toFixed(2)}</span></div>
                      {totalSavings > 0 && <div className="flex justify-between text-sm font-black text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-xl"><span>Total Savings</span><span>-${totalSavings.toFixed(2)}</span></div>}
                      <div className="h-px bg-slate-800 my-4"></div>
                      <div className="flex justify-between items-end pt-4">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Net Payable</span>
                        <span className="text-5xl font-black text-white tracking-tighter">${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                 <button onClick={() => setStep('SHIPPING')} className="flex-1 py-5 bg-slate-50 text-slate-500 rounded-[1.8rem] font-black hover:bg-slate-100 transition-all border border-slate-100">Back</button>
                 <button 
                   disabled={isProcessing || cart.length === 0}
                   onClick={handlePlaceOrder} 
                   className="flex-[2] py-5 bg-indigo-600 text-white rounded-[1.8rem] font-black text-2xl transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                 >
                   {isProcessing ? <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirm & Place Order'}
                 </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 sticky top-24 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 -z-10" />
            <div className="mb-8 flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white font-black text-4xl shadow-xl mb-4">{currentCustomer.name.charAt(0)}</div>
              <h4 className="font-black text-slate-900 text-xl leading-none">{currentCustomer.name}</h4>
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-2">{currentCustomer.type} Tier</p>
            </div>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-400 font-bold text-sm"><span className="uppercase tracking-widest text-[10px]">Subtotal</span><span className="text-slate-800 font-black">${baseSubtotal.toFixed(2)}</span></div>
              {totalSavings > 0 && <div className="flex justify-between items-center bg-emerald-50 px-4 py-2.5 rounded-xl text-[10px] font-black text-emerald-600 border border-emerald-100"><span className="uppercase">Savings</span><span>-${totalSavings.toFixed(2)}</span></div>}
              <div className="h-px bg-slate-50 my-6"></div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Final Total</span>
                <span className="text-4xl font-black text-slate-900 tracking-tighter">${finalTotal.toFixed(2)}</span>
              </div>
            </div>
            {step === 'ITEMS' && (
              <button onClick={() => setStep('SHIPPING')} className="w-full py-5 rounded-[1.8rem] font-black text-lg flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-indigo-600 shadow-xl transition-all">Proceed to Shipping <ChevronRight size={20} /></button>
            )}
            <div className="mt-8 flex flex-col items-center gap-2"><div className="flex items-center gap-2 text-[9px] text-slate-400 font-black uppercase tracking-widest"><Shield size={10} /> Secure Checkout</div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
