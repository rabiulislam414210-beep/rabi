
import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  ShoppingCart, 
  Ticket, 
  Settings,
  Users,
  LogOut,
  UserPlus,
  Users2,
  X
} from 'lucide-react';
import { View, UserRole } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  role: UserRole;
  onLogout: () => void;
  cartCount: number;
  sidebarOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, role, onLogout, cartCount, sidebarOpen }) => {
  const menuItems = [
    { id: 'DASHBOARD', icon: LayoutDashboard, label: 'Dashboard', roles: [UserRole.ADMIN] },
    { id: 'STORE', icon: ShoppingBag, label: 'Store', roles: [UserRole.CUSTOMER, UserRole.ADMIN] },
    { id: 'CART', icon: ShoppingCart, label: 'Cart', roles: [UserRole.CUSTOMER], badge: cartCount },
    { id: 'PRODUCTS', icon: Package, label: 'Manage Products', roles: [UserRole.ADMIN] },
    { id: 'ORDERS', icon: Settings, label: 'Manage Orders', roles: [UserRole.ADMIN, UserRole.CUSTOMER] },
    { id: 'CUSTOMERS', icon: Users2, label: 'Manage Customers', roles: [UserRole.ADMIN] },
    { id: 'DISCOUNTS', icon: Ticket, label: 'Discounts', roles: [UserRole.ADMIN] },
    { id: 'JOIN', icon: UserPlus, label: 'Join Nova Hub', roles: [UserRole.CUSTOMER] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <div className={`w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-40 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            NovaCommerce
          </h1>
          <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-widest font-black">Digital Business Hub</p>
        </div>
      </div>

      <nav className="flex-1 mt-4 px-4 space-y-2 overflow-y-auto scrollbar-hide">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as View)}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 group ${
              currentView === item.id 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                : 'text-slate-500 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} className={currentView === item.id ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </div>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-2.5 py-1 rounded-full font-black">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800 space-y-4">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 w-full p-4 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all text-xs font-black uppercase tracking-widest"
        >
          <LogOut size={18} />
          <span>Exit Session</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
