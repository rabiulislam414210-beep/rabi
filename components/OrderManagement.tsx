
import React, { useState, useMemo } from 'react';
import { 
  Printer, 
  Eye, 
  ChevronRight, 
  CheckCircle2, 
  Package, 
  Clock, 
  Truck, 
  Hash, 
  CheckSquare, 
  XCircle, 
  AlertCircle, 
  RotateCcw, 
  MapPin, 
  Download, 
  Search, 
  Filter, 
  DollarSign, 
  CreditCard, 
  Layers, 
  User, 
  Phone, 
  X, 
  ShoppingBag,
  ExternalLink,
  // Added Tag import to fix "Cannot find name 'Tag'" error on line 458
  Tag
} from 'lucide-react';
import { Order, OrderStatus, UserRole, Customer } from '../types';

interface OrderManagementProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  role: UserRole;
  currentCustomer: Customer;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ orders, setOrders, role, currentCustomer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const isAdmin = role === UserRole.ADMIN;

  const filteredOrders = useMemo(() => {
    let result = orders;
    
    // Role based filtering
    if (!isAdmin) {
      result = result.filter(o => o.customerId === currentCustomer.id);
    }

    // Status filtering
    if (statusFilter !== 'ALL') {
      result = result.filter(o => o.status === statusFilter);
    }

    // Search filtering
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(o => 
        o.id.toLowerCase().includes(lowerSearch) || 
        o.customerName.toLowerCase().includes(lowerSearch) ||
        o.items.some(item => item.name.toLowerCase().includes(lowerSearch))
      );
    }

    return result;
  }, [orders, isAdmin, currentCustomer.id, statusFilter, searchTerm]);

  const stats = useMemo(() => {
    const relevantOrders = isAdmin ? orders : orders.filter(o => o.customerId === currentCustomer.id);
    const total = relevantOrders.reduce((acc, curr) => acc + curr.total, 0);
    const pending = relevantOrders.filter(o => o.status === OrderStatus.PENDING).length;
    const processing = relevantOrders.filter(o => o.status === OrderStatus.PROCESSING || o.status === OrderStatus.SHIPPED).length;
    const completed = relevantOrders.filter(o => o.status === OrderStatus.DELIVERED).length;

    return [
      { label: isAdmin ? 'Total Revenue' : 'Total Spent', value: `$${total.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: 'Pending Action', value: pending, icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50' },
      { label: 'Active Pipeline', value: processing, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { label: 'Closed Deals', value: completed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];
  }, [orders, isAdmin, currentCustomer.id]);

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleConfirmOrder = (orderId: string) => {
    updateStatus(orderId, OrderStatus.PROCESSING);
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handlePrint = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const formattedConfirmedAt = formatDateTime(order.createdAt);
    const invoiceHtml = `
      <html>
        <head>
          <title>Order #${order.id}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { font-family: 'Inter', sans-serif; }
          </style>
        </head>
        <body class="p-12">
          <div class="max-w-4xl mx-auto border-4 border-slate-900 p-12 bg-white text-slate-900">
            <div class="flex justify-between items-start mb-16">
              <div>
                <h1 class="text-6xl font-black mb-2 tracking-tighter">NOVA HUB</h1>
                <div class="h-1.5 w-32 bg-indigo-600 mb-4"></div>
                <p class="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Official Digital Receipt</p>
              </div>
              <div class="text-right">
                <p class="text-4xl font-black text-slate-900 mb-2">INVOICE</p>
                <p class="font-bold text-indigo-600 text-lg uppercase tracking-widest">Order ID #${order.id}</p>
                <p class="text-slate-500 text-xs font-black mt-2 uppercase tracking-widest">Confirmed At:</p>
                <p class="text-slate-400 text-sm font-bold">${formattedConfirmedAt}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-16 mb-16 pb-16 border-b-2 border-slate-100">
              <div>
                <h3 class="text-slate-400 uppercase text-[10px] font-black tracking-[0.2em] mb-6">Ship To</h3>
                <p class="font-black text-2xl mb-2">${order.customerName}</p>
                <p class="text-slate-600 font-bold text-sm leading-relaxed italic">${order.shippingAddress || 'PICKUP FROM STORE'}</p>
              </div>
              <div>
                <h3 class="text-slate-400 uppercase text-[10px] font-black tracking-[0.2em] mb-6">Payment & Status</h3>
                <div class="space-y-4">
                   <div class="flex justify-between border-b border-slate-50 pb-2">
                     <span class="text-slate-500 font-bold text-xs uppercase tracking-wider">Method</span>
                     <span class="font-black text-slate-900 text-sm">CASH ON DELIVERY</span>
                   </div>
                   <div class="flex justify-between border-b border-slate-50 pb-2">
                     <span class="text-slate-500 font-bold text-xs uppercase tracking-wider">Status</span>
                     <span class="font-black text-sm text-indigo-600 uppercase">${order.status}</span>
                   </div>
                </div>
              </div>
            </div>
            <table class="w-full mb-16">
              <thead>
                <tr class="bg-slate-900 text-white uppercase text-[10px] font-black tracking-widest text-left">
                  <th class="py-5 px-8 rounded-l-2xl">SKU</th>
                  <th class="py-5 px-8">Product Name</th>
                  <th class="py-5 px-8 text-center">Qty</th>
                  <th class="py-5 px-8 text-right">Price</th>
                  <th class="py-5 px-8 text-right rounded-r-2xl">Total</th>
                </tr>
              </thead>
              <tbody class="divide-y-2 divide-slate-50">
                ${order.items.map(item => `
                  <tr>
                    <td class="py-6 px-8 font-mono text-xs text-slate-400">#${item.code}</td>
                    <td class="py-6 px-8 font-black text-slate-800 text-sm">${item.name}</td>
                    <td class="py-6 px-8 text-center font-black">${item.quantity}</td>
                    <td class="py-6 px-8 text-right font-bold">$${item.price.toFixed(2)}</td>
                    <td class="py-6 px-8 text-right font-black">$${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="flex justify-end">
              <div class="w-full max-w-xs space-y-4">
                <div class="flex justify-between text-slate-500 font-bold text-xs uppercase">
                  <span>Items Subtotal</span>
                  <span>$${order.items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0).toFixed(2)}</span>
                </div>
                <div class="flex justify-between pt-6 border-t-4 border-slate-900">
                  <span class="text-2xl font-black text-slate-900">Total Due</span>
                  <span class="text-4xl font-black text-indigo-600">$${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          <script>window.onload = () => { window.print(); window.close(); }</script>
        </body>
      </html>
    `;
    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
  };

  const statusColors = {
    [OrderStatus.PENDING]: 'bg-slate-100 text-slate-600 border-slate-200',
    [OrderStatus.PROCESSING]: 'bg-amber-100 text-amber-700 border-amber-200',
    [OrderStatus.SHIPPED]: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    [OrderStatus.DELIVERED]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    [OrderStatus.CANCELLED]: 'bg-rose-100 text-rose-700 border-rose-200',
  };

  const statusIcons = {
    [OrderStatus.PENDING]: Clock,
    [OrderStatus.PROCESSING]: Package,
    [OrderStatus.SHIPPED]: Truck,
    [OrderStatus.DELIVERED]: CheckCircle2,
    [OrderStatus.CANCELLED]: XCircle,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
            {isAdmin ? 'Orders Central' : 'Purchase History'}
          </h2>
          <p className="text-slate-500 font-medium">
            {isAdmin ? 'Comprehensive administrative order management' : 'Track and manage your active transactions'}
          </p>
        </div>
        
        {isAdmin && orders.some(o => o.status === OrderStatus.PENDING) && (
          <div className="bg-rose-50 border border-rose-100 px-6 py-3 rounded-2xl flex items-center gap-3 animate-pulse shadow-sm shadow-rose-100">
            <AlertCircle className="text-rose-500" size={20} />
            <span className="text-rose-700 font-black text-xs uppercase tracking-widest leading-none">
              Attention Required
            </span>
          </div>
        )}
      </div>

      {/* Stats Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-lg transition-all duration-300">
            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl shadow-inner`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 leading-none">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col xl:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            type="text" 
            placeholder="Search by Order ID, Customer Name, or Product..."
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-8 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all font-bold text-sm text-slate-700 placeholder:text-slate-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full xl:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
              className="w-full pl-12 pr-10 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-8 focus:ring-indigo-50 outline-none appearance-none font-black text-xs uppercase tracking-[0.2em] text-slate-600 cursor-pointer shadow-inner"
            >
              <option value="ALL">All Statuses</option>
              {Object.values(OrderStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}
            className="p-4 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-3xl transition-all border border-transparent hover:border-slate-200 group"
            title="Reset All Filters"
          >
            <RotateCcw size={22} className="group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-white p-24 rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 text-center">
            <div className="bg-slate-50 p-8 rounded-full mb-8 shadow-inner">
              <ShoppingBag size={80} className="opacity-10" />
            </div>
            <p className="font-black text-3xl tracking-tighter text-slate-400">Empty Logs</p>
            <p className="text-sm font-medium mt-2 text-slate-400 max-w-xs">We couldn't find any orders matching your current criteria.</p>
            {(searchTerm || statusFilter !== 'ALL') && (
               <button onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }} className="mt-8 text-indigo-600 font-black text-xs uppercase tracking-widest bg-indigo-50 px-8 py-3 rounded-2xl hover:bg-indigo-100 transition-all">Clear Filters</button>
            )}
          </div>
        ) : (
          filteredOrders.map(order => {
            const StatusIcon = statusIcons[order.status];
            return (
              <div 
                key={order.id} 
                className={`group bg-white p-1 rounded-[3rem] transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 border-2 ${
                  order.status === OrderStatus.PENDING && isAdmin 
                    ? 'border-indigo-400 ring-[12px] ring-indigo-50/50' 
                    : 'border-slate-50'
                }`}
              >
                <div className="bg-white p-8 rounded-[2.9rem] flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className={`p-6 rounded-[2rem] shadow-xl shadow-slate-100 transition-all duration-500 ${statusColors[order.status]} group-hover:scale-110`}>
                      <StatusIcon size={32} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-black text-slate-900 text-2xl tracking-tighter">#{order.id}</span>
                        <span className={`text-[9px] px-4 py-1.5 rounded-full font-black uppercase tracking-[0.2em] border-2 ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                          <User size={12} className="text-slate-300" /> {order.customerName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                          <Clock size={12} className="text-slate-300" /> {formatDateTime(order.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full xl:w-auto">
                    {/* Item Thumbnails Preview */}
                    <div className="hidden lg:flex -space-x-3 items-center mr-4">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="w-10 h-10 rounded-xl border-2 border-white bg-slate-100 shadow-sm overflow-hidden ring-2 ring-slate-50">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-10 h-10 rounded-xl border-2 border-white bg-slate-900 text-white flex items-center justify-center text-[10px] font-black ring-2 ring-slate-50">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end mr-6">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Grand Total</span>
                       <span className="text-3xl font-black text-slate-900 tracking-tighter">${order.total.toFixed(2)}</span>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
                        title="Quick View"
                      >
                        <Eye size={20} />
                      </button>
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-3 px-8 py-4 bg-slate-50 text-slate-500 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white hover:text-indigo-600 border border-transparent hover:border-indigo-100 transition-all active:scale-95"
                      >
                        Manage Details <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Deep-Dive Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${statusColors[selectedOrder.status]}`}>
                  {React.createElement(statusIcons[selectedOrder.status], { size: 32 })}
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-1">
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Order #{selectedOrder.id}</h3>
                    <span className={`text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest border-2 ${statusColors[selectedOrder.status]}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                     <Clock size={12} /> Logged At: {formatDateTime(selectedOrder.createdAt)}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all hover:bg-rose-50 hover:border-rose-100 shadow-sm"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Transaction Details */}
                <div className="lg:col-span-2 space-y-10">
                   <div className="space-y-6">
                      <div className="flex items-center justify-between px-2">
                         <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-2">
                           <Layers size={14} /> Purchased Inventory
                         </h4>
                         <span className="text-xs font-bold text-slate-400">{selectedOrder.items.length} unique SKU items</span>
                      </div>
                      <div className="space-y-4">
                        {selectedOrder.items.map((item, idx) => (
                          <div key={idx} className="p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
                             <div className="flex items-center gap-5">
                                <img src={item.image} className="w-20 h-20 rounded-[1.5rem] object-cover shadow-sm bg-white" />
                                <div>
                                   <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">{item.category} • #{item.code}</p>
                                   <h5 className="font-black text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{item.name}</h5>
                                   <p className="text-xs font-bold text-slate-400 mt-1">{item.companyName}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-sm font-black text-slate-400 mb-1">Qty: {item.quantity}</p>
                                <p className="text-2xl font-black text-slate-900 tracking-tighter">${(item.price * item.quantity).toFixed(2)}</p>
                             </div>
                          </div>
                        ))}
                      </div>
                   </div>

                   {/* Pricing Breakdown */}
                   <div className="bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
                         <CreditCard size={200} />
                      </div>
                      <h4 className="text-[11px] font-black uppercase text-slate-500 mb-10 tracking-[0.3em] relative z-10">Consolidated Billing</h4>
                      <div className="space-y-6 relative z-10">
                         <div className="flex justify-between items-center text-slate-400 font-bold">
                            <span>Manifest Subtotal</span>
                            <span className="text-white font-black text-xl">${selectedOrder.items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0).toFixed(2)}</span>
                         </div>
                         {selectedOrder.discountApplied && (
                           <div className="flex justify-between items-center text-emerald-400 font-black bg-emerald-400/10 px-6 py-3 rounded-2xl border border-emerald-400/20">
                             {/* Added Tag icon import to fix "Cannot find name 'Tag'" error */}
                             <span className="text-[10px] uppercase tracking-widest flex items-center gap-2"><Tag size={14}/> Benefit: {selectedOrder.discountApplied.code}</span>
                             <span>-${(selectedOrder.items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0) - selectedOrder.total).toFixed(2)}</span>
                           </div>
                         )}
                         <div className="flex justify-between items-center text-slate-400 font-bold">
                            <span>Logistics Fee</span>
                            <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Complimentary Delivery</span>
                         </div>
                         <div className="h-px bg-slate-800 my-8"></div>
                         <div className="flex justify-between items-end">
                            <div>
                               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Net Payable Amount</p>
                               <p className="text-6xl font-black text-white tracking-tighter leading-none">${selectedOrder.total.toFixed(2)}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1.5">Payment Method</p>
                               <p className="text-sm font-black text-white uppercase tracking-widest">Cash on Delivery</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Right Column: Customer & Delivery */}
                <div className="space-y-8">
                   <div className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100 shadow-inner">
                      <h4 className="text-[11px] font-black uppercase text-slate-400 mb-8 tracking-[0.3em] flex items-center gap-2">
                        <MapPin size={14} /> Shipping Matrix
                      </h4>
                      <div className="space-y-8">
                         <div className="flex gap-5">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 flex-shrink-0">
                               <User size={24} />
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer</p>
                               <p className="font-black text-slate-900 text-xl leading-none">{selectedOrder.customerName}</p>
                            </div>
                         </div>
                         <div className="flex gap-5">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 flex-shrink-0">
                               <Phone size={24} />
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact Channel</p>
                               <p className="font-black text-slate-900 text-lg leading-none">+880 (Contact Info Protected)</p>
                            </div>
                         </div>
                         <div className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Geographic Address</p>
                            <p className="text-sm font-bold text-slate-700 leading-relaxed italic">{selectedOrder.shippingAddress || 'Nova Store Hub - Self Pickup'}</p>
                         </div>
                      </div>
                   </div>

                   {/* Admin Actions */}
                   {isAdmin && (
                     <div className="bg-white rounded-[3rem] p-10 border-4 border-dashed border-slate-100 space-y-6">
                        <h4 className="text-[11px] font-black uppercase text-indigo-600 mb-2 tracking-[0.3em] flex items-center gap-2">
                          <CheckSquare size={14} /> Workflow Pipeline
                        </h4>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Update Transaction Status</label>
                           <div className="relative">
                              <select 
                                value={selectedOrder.status}
                                onChange={(e) => updateStatus(selectedOrder.id, e.target.value as OrderStatus)}
                                className="w-full bg-slate-900 text-white px-8 py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-widest outline-none appearance-none cursor-pointer hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
                              >
                                {Object.values(OrderStatus).map(status => (
                                  <option key={status} value={status}>{status}</option>
                                ))}
                              </select>
                              <ChevronRight size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 rotate-90 pointer-events-none" />
                           </div>
                           
                           {selectedOrder.status === OrderStatus.PENDING && (
                             <button 
                               onClick={() => handleConfirmOrder(selectedOrder.id)}
                               className="w-full py-5 bg-emerald-600 text-white rounded-[1.8rem] font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-3 animate-pulse"
                             >
                               <CheckSquare size={20} /> Batch Confirm
                             </button>
                           )}

                           <button 
                             onClick={() => { if(confirm("Cancel this transaction?")) updateStatus(selectedOrder.id, OrderStatus.CANCELLED); }}
                             className="w-full py-4 border-2 border-rose-100 text-rose-500 rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                           >
                             <XCircle size={16} /> Mark as Void
                           </button>
                        </div>
                     </div>
                   )}
                </div>
              </div>
            </div>

            <div className="p-10 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
               <div className="flex gap-4">
                  <button 
                    onClick={() => handlePrint(selectedOrder)}
                    className="px-10 py-5 bg-slate-900 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-600 transition-all shadow-2xl active:scale-95"
                  >
                    <Printer size={20} /> Print Formal Receipt
                  </button>
                  <button 
                    onClick={() => handlePrint(selectedOrder)}
                    className="px-8 py-5 bg-white text-slate-400 border border-slate-200 rounded-[1.8rem] font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:text-slate-900 transition-all shadow-sm active:scale-95"
                  >
                    <Download size={20} /> PDF Export
                  </button>
               </div>
               <button 
                 onClick={() => setSelectedOrder(null)}
                 className="px-10 py-5 bg-slate-200 text-slate-500 rounded-[1.8rem] font-black text-xs uppercase tracking-widest hover:bg-slate-300 transition-all active:scale-95"
               >
                 Close Detail View
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Bounce animation for attention */}
      <style>{`
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-short {
          animation: bounce-short 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default OrderManagement;
