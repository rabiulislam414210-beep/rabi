
import React, { useMemo, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { TrendingUp, DollarSign, ShoppingBasket, Users, Sparkles, BrainCircuit, Clock, CheckCircle2, ChevronRight, AlertCircle, X, ExternalLink } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { analyzeSalesTrends } from '../services/geminiService';

interface DashboardProps {
  orders: Order[];
}

const Dashboard: React.FC<DashboardProps> = ({ orders }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);

  const pendingOrders = useMemo(() => 
    orders.filter(o => o.status === OrderStatus.PENDING),
    [orders]
  );

  const pendingConfirmation = useMemo(() => 
    pendingOrders.slice(0, 5),
    [pendingOrders]
  );

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const pendingOrdersCount = pendingOrders.length;

    return [
      { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: 'Total Orders', value: totalOrders, icon: ShoppingBasket, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { label: 'Avg Value', value: `$${avgOrderValue.toFixed(2)}`, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'Awaiting Confirm', value: pendingOrdersCount, icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50' },
    ];
  }, [orders, pendingOrders]);

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    });

    return last7Days.map(day => ({
      name: day,
      revenue: Math.floor(Math.random() * 5000) + 1000,
      orders: Math.floor(Math.random() * 50) + 5,
    }));
  }, []);

  const handleAiAnalyze = async () => {
    setIsAnalyzing(true);
    const analysis = await analyzeSalesTrends(orders);
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800">Business Overview</h2>
          <p className="text-slate-500">Real-time performance analytics and insights</p>
        </div>
        <button 
          onClick={handleAiAnalyze}
          disabled={isAnalyzing}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-50 active:scale-95"
        >
          {isAnalyzing ? <Sparkles size={18} className="animate-spin" /> : <BrainCircuit size={18} />}
          {isAnalyzing ? 'Analyzing...' : 'AI Insights'}
        </button>
      </div>

      {aiAnalysis && (
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold">
            <Sparkles size={18} />
            <span>AI Strategy Suggestion</span>
          </div>
          <p className="text-slate-700 leading-relaxed italic">{aiAnalysis}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`${stat.bg} ${stat.color} p-4 rounded-xl`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue Growth</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, fill: '#6366f1' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Pending Confirmation Queue */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <AlertCircle className="text-rose-500" size={20} />
              Confirm Orders
            </h3>
            <span className="bg-rose-100 text-rose-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
              Action Required
            </span>
          </div>

          <div className="space-y-4 flex-1">
            {pendingConfirmation.length > 0 ? (
              pendingConfirmation.map(order => (
                <div key={order.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-slate-800 text-sm">#{order.id}</span>
                    <span className="font-black text-indigo-600 text-sm">${order.total.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium line-clamp-1">{order.customerName}</p>
                  <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="flex-1 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-emerald-100 hover:bg-emerald-700">
                       Confirm
                     </button>
                     <button className="px-3 py-2 bg-white text-slate-400 border border-slate-200 rounded-lg hover:text-rose-500 transition-colors">
                        <ChevronRight size={14} />
                     </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-300">
                <CheckCircle2 size={48} className="mb-2 opacity-20" />
                <p className="text-sm font-bold">All caught up!</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setShowPendingModal(true)}
            className="w-full mt-6 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-black uppercase tracking-widest hover:border-indigo-200 hover:text-indigo-400 transition-all"
          >
            View All Pending ({pendingOrders.length})
          </button>
        </div>
      </div>

      {/* Pending Summary Modal */}
      {showPendingModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Pending Orders Summary</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Full backlog requiring administrative confirmation</p>
              </div>
              <button 
                onClick={() => setShowPendingModal(false)}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all shadow-sm"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 max-h-[60vh] overflow-y-auto space-y-4 scrollbar-hide">
              {pendingOrders.length > 0 ? (
                pendingOrders.map(order => (
                  <div key={order.id} className="p-6 bg-white border border-slate-100 rounded-[1.8rem] flex items-center justify-between hover:border-indigo-200 transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <ShoppingBasket size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-black text-slate-900">#{order.id}</span>
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-500">{order.customerName}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">{order.items.length} items • Cash on Delivery</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-6">
                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-black text-slate-900 tracking-tighter">${order.total.toFixed(2)}</span>
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md mt-1">Pending</span>
                      </div>
                      <button className="p-3 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200">
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center text-slate-300">
                  <CheckCircle2 size={64} className="mx-auto mb-4 opacity-10" />
                  <p className="font-black text-xl">No pending orders currently</p>
                </div>
              )}
            </div>

            <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
               <button 
                 onClick={() => setShowPendingModal(false)}
                 className="px-8 py-4 bg-white text-slate-400 font-black text-xs uppercase tracking-widest rounded-2xl border border-slate-200 hover:text-slate-900 transition-all"
               >
                 Close Summary
               </button>
               <button className="px-8 py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                 Process All Batch
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
