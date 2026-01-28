import React, { memo } from 'react';
import { User } from '../../types';
import NotificationBell from './NotificationBell';

interface BottomNavProps {
  user: User;
  onOpenHistory: () => void;
  onOpenModal: (type: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ user, onOpenHistory, onOpenModal }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-[90] flex flex-col bg-black/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] pb-safe transition-all duration-300">
      {/* Barra de Navegación */}
      <nav className="flex justify-between items-center px-6 py-3">
        {/* HISTORIAL */}
        <button 
          onClick={onOpenHistory}
          className="flex flex-col items-center gap-1.5 min-w-[50px] group active:scale-95 transition-all"
        >
          <div className="text-gray-500 group-active:text-[#00d2ff] transition-colors">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest group-active:text-[#00d2ff]">Historial</span>
        </button>

        {/* NOTIFICACIONES (HUB DE ALERTAS) */}
        <div className="flex flex-col items-center min-w-[50px]">
          <NotificationBell />
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Alertas</span>
        </div>

        {/* BOTÓN RAYO CENTRAL (CORE HUB) */}
        <div className="relative -mt-10">
          <button 
            onClick={() => onOpenModal('core_hub')}
            className="bg-[#00ff88] text-black p-4 rounded-full shadow-[0_0_25px_rgba(0,255,136,0.5)] active:scale-90 transition-all border-[6px] border-[#050505] relative group z-10"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div className="absolute inset-0 bg-white/30 rounded-full animate-ping opacity-20 pointer-events-none"></div>
          </button>
        </div>

        {/* TIENDA */}
        <button 
          onClick={() => onOpenModal('store')}
          className="flex flex-col items-center gap-1.5 min-w-[50px] group active:scale-95 transition-all"
        >
          <div className="text-gray-500 group-active:text-[#00d2ff] transition-colors">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest group-active:text-[#00d2ff]">Tienda</span>
        </button>

        {/* PERFIL */}
        <button 
          onClick={() => onOpenModal('profile')}
          className="flex flex-col items-center gap-1.5 min-w-[50px] group active:scale-95 transition-all"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#00d2ff] to-[#005f73] flex items-center justify-center text-[8px] font-bold text-black font-orbitron shadow-lg group-active:shadow-[#00d2ff]/50">
             {user.username.substring(0,2).toUpperCase()}
          </div>
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest group-active:text-[#00d2ff]">Perfil</span>
        </button>
      </nav>
      <style>{`
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 20px); }
      `}</style>
    </div>
  );
};

export default memo(BottomNav);