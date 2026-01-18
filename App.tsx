
import React, { useState, useEffect } from 'react';
import { View, UserRole, Product, Order, CartItem, Discount, Customer } from './types';
import { INITIAL_PRODUCTS, INITIAL_DISCOUNTS, MOCK_CUSTOMERS } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Store from './components/Store';
import ProductManagement from './components/ProductManagement';
import OrderManagement from './components/OrderManagement';
import Cart from './components/Cart';
import DiscountManagement from './components/DiscountManagement';
import CustomerRegistration from './components/CustomerRegistration';
import CustomerManagement from './components/CustomerManagement';
import Auth from './components/Auth';
import { ShoppingBag, Bell, User, CheckCircle2, RefreshCcw, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [currentView, setView] = useState<View>('STORE');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Persistence logic
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('nova_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('nova_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>(() => {
    const saved = localStorage.getItem('nova_discounts');
    return saved ? JSON.parse(saved) : INITIAL_DISCOUNTS;
  });
  const [allCustomers, setAllCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('nova_customers');
    return saved ? JSON.parse(saved) : MOCK_CUSTOMERS;
  });
  const [currentCustomer, setCurrentCustomer] = useState<Customer>(MOCK_CUSTOMERS[0]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', desc: '' });

  useEffect(() => {
    localStorage.setItem('nova_products', JSON.stringify(products));
    localStorage.setItem('nova_orders', JSON.stringify(orders));
    localStorage.setItem('nova_discounts', JSON.stringify(discounts));
    localStorage.setItem('nova_customers', JSON.stringify(allCustomers));
  }, [products, orders, discounts, allCustomers]);

  useEffect(() => {
    if (role === UserRole.ADMIN) {
      if (['CART', 'JOIN'].includes(currentView)) setView('DASHBOARD');
    } else {
      if (['DASHBOARD', 'PRODUCTS', 'DISCOUNTS', 'CUSTOMERS'].includes(currentView)) setView('STORE');
    }
  }, [role, currentView]);

  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setIsAuthenticated(true);
    setView(selectedRole === UserRole.ADMIN ? 'DASHBOARD' : 'STORE');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCart([]);
  };

  const handleOrderSuccess = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setToastMessage({ title: 'Order Placed!', desc: `Order ID: ${newOrder.id}` });
    setShowSuccessToast(true);
    setView('ORDERS');
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  const handleRegisterSuccess = (newCustomer: Customer) => {
    setAllCustomers(prev => [...prev, newCustomer]);
    setCurrentCustomer(newCustomer);
    setRole(UserRole.CUSTOMER);
    setView('STORE');
    setToastMessage({ title: 'Welcome!', desc: `Hello, ${newCustomer.name}` });
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  const switchCustomer = () => {
    const currentIndex = allCustomers.findIndex(c => c.id === currentCustomer.id);
    const nextIndex = (currentIndex + 1) % allCustomers.length;
    setCurrentCustomer(allCustomers[nextIndex]);
    setCart([]);
    if (currentView === 'CART' || currentView === 'JOIN') setView('STORE');
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    const props = { setView, sidebarOpen, setSidebarOpen };
    switch (currentView) {
      case 'DASHBOARD': return <Dashboard orders={orders} />;
      case 'STORE': return <Store products={products} cart={cart} setCart={setCart} discounts={discounts} currentCustomer={currentCustomer} setView={setView} />;
      case 'PRODUCTS': return <ProductManagement products={products} setProducts={setProducts} discounts={discounts} setDiscounts={setDiscounts} />;
      case 'ORDERS': return <OrderManagement orders={orders} setOrders={setOrders} role={role} currentCustomer={currentCustomer} />;
      case 'CART': return <Cart cart={cart} setCart={setCart} discounts={discounts} currentCustomer={currentCustomer} onOrderSuccess={handleOrderSuccess} />;
      case 'DISCOUNTS': return <DiscountManagement discounts={discounts} setDiscounts={setDiscounts} products={products} />;
      case 'CUSTOMERS': return <CustomerManagement customers={allCustomers} setCustomers={setAllCustomers} />;
      case 'JOIN': return <CustomerRegistration onRegister={handleRegisterSuccess} />;
      default: return <Dashboard orders={orders} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar 
        currentView={currentView} 
        setView={(v) => { setView(v); setSidebarOpen(false); }} 
        role={role} 
        onLogout={handleLogout}
        cartCount={cart.reduce((acc, curr) => acc + curr.quantity, 0)}
        sidebarOpen={sidebarOpen}
      />

      <main className="flex-1 w-full lg:ml-64 p-4 md:p-8 no-print transition-all duration-300">
        <header className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-600"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:block bg-white p-2 rounded-xl shadow-sm border border-slate-100">
               <ShoppingBag className="text-indigo-600" size={24} />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
                {currentView.charAt(0) + currentView.slice(1).toLowerCase()}
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden md:block">Nova Hub / {role === UserRole.ADMIN ? 'Admin' : 'Customer'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {role === UserRole.CUSTOMER && (
              <button 
                onClick={switchCustomer}
                className="hidden md:flex flex-col items-end gap-0.5 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95 border border-slate-700"
              >
                <div className="flex items-center gap-2">
                  <RefreshCcw size={10} className="animate-spin-slow" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-indigo-400">Switch</span>
                </div>
                <span className="text-xs font-bold">{currentCustomer.name}</span>
              </button>
            )}
            
            <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all relative shadow-sm bg-white border border-slate-100">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 leading-none truncate max-w-[120px]">
                  {role === UserRole.ADMIN ? 'Administrator' : currentCustomer.name}
                </p>
                <p className="text-[9px] text-indigo-500 font-bold uppercase tracking-widest mt-1">Level: {role}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg border-2 border-white">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {showSuccessToast && (
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 animate-in slide-in-from-right-8 duration-300">
          <div className="bg-slate-900 text-white p-4 md:p-5 rounded-3xl shadow-2xl flex items-center gap-4 border border-slate-700 ring-8 ring-indigo-500/10">
            <div className="bg-emerald-500 p-2.5 rounded-xl shadow-lg shadow-emerald-500/20">
               <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-sm font-black tracking-tight">{toastMessage.title}</p>
              <p className="text-[10px] text-slate-400 font-medium">{toastMessage.desc}</p>
            </div>
            <button onClick={() => setShowSuccessToast(false)} className="ml-2 p-1 text-slate-500 hover:text-white transition-colors text-lg">✕</button>
          </div>
        </div>
      )}
      
      <style>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        ::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        ::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default App;
