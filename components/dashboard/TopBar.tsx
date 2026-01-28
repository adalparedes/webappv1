import React, { useState, useEffect, memo, useRef } from 'react';
import { User } from '../../types';
import { useCart } from '../../context/CartContext';

interface TopBarProps {
  user: User;
  onOpenProfile: () => void;
  onOpenBalance: () => void;
  onOpenProductPayment: () => void;
  onToggleSidebar?: () => void;
  timezone?: string;
}

const TopBar: React.FC<TopBarProps> = ({ 
  user, 
  onOpenProfile, 
  onOpenBalance,
  onOpenProductPayment,
  onToggleSidebar,
  timezone = 'America/Mexico_City'
}) => {
  const { itemCount } = useCart();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const timeFormatter = new Intl.DateTimeFormat('en-GB', {
          timeZone: timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        const dateFormatter = new Intl.DateTimeFormat('es-MX', {
          timeZone: timezone,
          day: '2-digit',
          month: 'short',
        });
        setCurrentTime(timeFormatter.format(now));
        setCurrentDate(dateFormatter.format(now).toUpperCase());
      } catch (e) {
        setCurrentTime(new Date().toLocaleTimeString());
        setCurrentDate(new Date().toLocaleDateString());
      }
    };
    
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [timezone]);

  return (
    <div className="flex flex-col z-[60] sticky top-0">
      <div className="h-20 md:h-24 border-b border-white/10 bg-black/90 backdrop-blur-3xl px-3 md:px-8 flex items-center justify-between relative overflow-hidden">
        
        {/* LADO IZQUIERDO: ACCIONES (MENÚ) */}
        <div className="flex items-center z-10 min-w-[40px] gap-4">
          <button 
            onClick={onToggleSidebar} 
            className="p-2.5 md:p-3 text-[#00d2ff] bg-white/5 border border-white/10 rounded-xl md:rounded-2xl hover:bg-[#00d2ff]/10 transition-all active:scale-90 shadow-lg lg:hidden"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="md:w-6 md:h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h12M4 18h16" />
            </svg>
          </button>
        </div>

        {/* CENTRO: SYSTEM HUD TIME (Optimizado para Tablet/Desktop) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center pointer-events-none select-none max-w-[120px] md:max-w-none transition-all duration-300">
             <div className="flex items-center gap-1.5 md:gap-2 mb-0.5">
               <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-[#00ff88] rounded-full animate-pulse shadow-[0_0_8px_#00ff88]"></span>
               <span className="text-[13px] md:text-lg font-orbitron font-bold text-white tracking-tighter tabular-nums">
                 {currentTime}
               </span>
             </div>
             <div className="hidden md:flex items-center gap-1.5">
               <span className="text-[7px] md:text-[8px] text-[#00d2ff] font-mono font-bold uppercase tracking-[0.15em] opacity-80">
                 {currentDate}
               </span>
               <span className="text-[7px] text-gray-600 font-mono uppercase tracking-tighter">[{timezone.split('/').pop()}]</span>
             </div>
             <div className="md:hidden text-[7px] text-[#00d2ff] font-mono font-bold tracking-widest opacity-60">
               {currentDate}
             </div>
        </div>

        {/* DERECHA: BALANCE / CARRITO / PERFIL */}
        <div className="flex items-center gap-1.5 md:gap-3 z-10">
          <button 
            onClick={onOpenBalance}
            className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1.5 md:py-2 bg-black/40 border border-[#00d2ff]/30 rounded-lg md:rounded-xl hover:bg-[#00d2ff]/10 transition-all group active:scale-95 shadow-[0_0_15px_rgba(0,210,255,0.05)]"
          >
            <span className="text-[10px] md:text-base">💎</span>
            <div className="flex flex-col items-start leading-none">
              <span className="hidden md:block text-[6px] text-[#00d2ff] font-mono font-bold uppercase tracking-widest opacity-60">Balance</span>
              <span className="text-[9px] md:text-[10px] font-orbitron font-bold text-white tracking-tight">
                {user.balance.toFixed(0)}<span className="md:hidden ml-0.5 opacity-40 text-[7px]">c</span><span className="hidden md:inline ml-0.5 opacity-40">CR</span>
              </span>
            </div>
          </button>

          <button 
            onClick={onOpenProductPayment} 
            className={`relative p-2 md:p-3 rounded-lg md:rounded-2xl transition-all border ${itemCount > 0 ? 'border-[#00ff88]/50 bg-[#00ff88]/10 text-[#00ff88]' : 'border-white/10 bg-white/5 text-gray-500 hover:text-white'}`}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="md:w-5 md:h-5">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#ff3131] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center border border-black animate-bounce">
                {itemCount}
              </span>
            )}
          </button>

          <button onClick={onOpenProfile} className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-[#00d2ff] to-[#005f73] border border-white/20 p-0.5 shadow-[0_0_20px_rgba(0,210,255,0.2)] hover:scale-105 active:scale-95 transition-all">
            <div className="w-full h-full bg-black/40 rounded-[6px] md:rounded-[10px] flex items-center justify-center text-[8px] md:text-xs font-bold text-white font-orbitron">
              {user.username.substring(0,2).toUpperCase()}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(TopBar);