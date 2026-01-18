
import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, Sparkles, ShoppingBag, Terminal, ArrowLeft, Delete, Lock, Ghost, Smartphone, Share2 } from 'lucide-react';
import { UserRole } from '../types';

interface AuthProps {
  onLogin: (role) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'CHOICE' | 'ADMIN_PIN'>('CHOICE');
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const ADMIN_PIN = '1234';

  const handlePinClick = (num: string) => {
    if (pin.length < 4) {
      setError(false);
      setPin(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  useEffect(() => {
    if (pin.length === 4) {
      setIsVerifying(true);
      setTimeout(() => {
        if (pin === ADMIN_PIN) {
          onLogin(UserRole.ADMIN);
        } else {
          setError(true);
          setIsVerifying(false);
          setTimeout(() => setPin(''), 500);
        }
      }, 600);
    }
  }, [pin, onLogin]);

  if (mode === 'ADMIN_PIN') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 font-sans overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        </div>

        <div className="w-full max-w-sm relative z-10 flex flex-col items-center">
          <button 
            onClick={() => setMode('CHOICE')}
            className="self-start text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] mb-12 flex items-center gap-2 transition-all group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Hub
          </button>

          <div className="mb-10 text-center space-y-3">
             <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <Lock className={error ? "text-rose-500 animate-bounce" : "text-indigo-400"} size={28} />
             </div>
             <h2 className="text-2xl font-black text-white tracking-tight">Staff Access</h2>
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Enter 4-Digit Security Pin</p>
          </div>

          <div className={`flex gap-6 mb-16 ${error ? 'animate-shake' : ''}`}>
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                  pin.length > i 
                    ? 'bg-indigo-500 border-indigo-500 scale-125 shadow-[0_0_15px_rgba(99,102,241,0.5)]' 
                    : 'border-white/20'
                } ${error ? 'bg-rose-500 border-rose-500' : ''}`} 
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6 w-full max-w-[280px]">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button
                key={num}
                disabled={isVerifying}
                onClick={() => handlePinClick(num)}
                className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-white font-black text-2xl transition-all active:scale-90 flex items-center justify-center shadow-lg active:bg-indigo-600 active:border-indigo-400"
              >
                {num}
              </button>
            ))}
            <div />
            <button
              disabled={isVerifying}
              onClick={() => handlePinClick('0')}
              className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-white font-black text-2xl transition-all active:scale-90 flex items-center justify-center shadow-lg"
            >
              0
            </button>
            <button
              disabled={isVerifying}
              onClick={handleBackspace}
              className="w-16 h-16 rounded-full bg-white/5 hover:bg-rose-500/20 border border-white/5 text-slate-400 hover:text-rose-400 transition-all active:scale-90 flex items-center justify-center"
            >
              <Delete size={24} />
            </button>
          </div>

          {error && (
            <p className="mt-12 text-rose-500 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2">
              Access Denied • Try Again
            </p>
          )}

          <div className="mt-16 flex flex-col items-center gap-4">
             <button 
               onClick={() => onLogin(UserRole.CUSTOMER)}
               className="text-slate-500 hover:text-indigo-400 text-[9px] font-black uppercase tracking-widest transition-colors flex items-center gap-2"
             >
               <ShoppingBag size={12} /> Exit to Customer Store
             </button>
             <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
                <p className="text-[8px] text-white/20 font-mono tracking-widest uppercase">System Hint: 1 2 3 4</p>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(99,102,241,0.03)_0%,_rgba(255,255,255,0)_100%)]" />
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="space-y-8 text-center lg:text-left animate-in slide-in-from-left-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full shadow-sm border border-slate-100 mb-4">
             <Sparkles className="text-indigo-600" size={16} />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Intelligent Retail OS</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.85]">
            Nova Hub <br />
            <span className="text-indigo-600">Dynamics.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
            Experience commerce without friction. One ecosystem for administrators and customers.
          </p>
          
          {/* Install Tip for Mobile */}
          <div className="p-5 bg-indigo-50/50 rounded-3xl border border-indigo-100/50 max-w-sm mx-auto lg:mx-0 flex items-start gap-4 animate-in slide-in-from-bottom-4 delay-300">
             <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg">
                <Smartphone size={18} />
             </div>
             <div className="text-left">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1">Mobile Install</h4>
                <p className="text-[11px] text-slate-500 font-bold leading-normal">
                   To get this app on your phone, tap <Share2 size={10} className="inline inline-block mx-0.5" /> then <b>'Add to Home Screen'</b>.
                </p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in slide-in-from-right-8 duration-700">
          <button 
            onClick={() => onLogin(UserRole.CUSTOMER)}
            className="group bg-white p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] shadow-2xl shadow-indigo-100/30 border border-slate-50 hover:border-indigo-600 text-left transition-all hover:-translate-y-3 flex flex-col items-center sm:items-start"
          >
            <div className="bg-indigo-50 p-7 rounded-[2rem] text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all mb-10 shadow-inner">
              <ShoppingBag size={44} />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 tracking-tight">Public Hub</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8">Browse the collection, use discounts, and shop securely.</p>
            <div className="mt-auto flex items-center gap-2 text-indigo-600 font-black text-[11px] uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
              Go Shopping <ArrowRight size={18} />
            </div>
          </button>

          <button 
            onClick={() => setMode('ADMIN_PIN')}
            className="group bg-slate-900 p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] shadow-2xl shadow-slate-900/10 border border-slate-800 hover:border-indigo-500 text-left transition-all hover:-translate-y-3 flex flex-col items-center sm:items-start"
          >
            <div className="bg-white/5 p-7 rounded-[2rem] text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all mb-10 border border-white/5">
              <ShieldCheck size={44} />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">Staff Only</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">Access restricted admin controls and system management.</p>
            <div className="mt-auto flex items-center gap-2 text-indigo-400 font-black text-[11px] uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
              Security Login <ArrowRight size={18} />
            </div>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both;
          animation-iteration-count: 2;
        }
      `}</style>
    </div>
  );
};

export default Auth;
