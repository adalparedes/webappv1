
import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../lib/hooks/useNotifications';
import { NotificationType } from '../../types';

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, loading, error, markAsRead, reload } = useNotifications();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const toggleOpen = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState && unreadCount > 0) {
      // Marcamos como leído después de que el usuario haya tenido tiempo de verlas
      setTimeout(() => markAsRead(), 3000);
    }
  };

  const getIcon = (type: NotificationType) => {
    switch(type) {
      case 'payment': return '💰';
      case 'membership': return '🎖️';
      case 'promo': return '🔥';
      default: return '🛰️';
    }
  };

  const getColor = (type: NotificationType) => {
    switch(type) {
      case 'payment': return 'text-[#00ff88]';
      case 'membership': return 'text-[#00d2ff]';
      case 'promo': return 'text-[#ff3131]';
      default: return 'text-gray-400';
    }
  };

  const socialLinks = [
    { name: 'YouTube', url: 'https://www.youtube.com/@adalparedes1', icon: '📺', color: '#ff0000' },
    { name: 'X', url: 'https://x.com/AdalParedes1', icon: '𝕏', color: '#ffffff' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@adalparedes1', icon: '📱', color: '#00f2ea' }
  ];

  return (
    <div className="relative inline-block">
      <button 
        onClick={toggleOpen}
        className={`relative p-2.5 rounded-full transition-all border group active:scale-90 ${isOpen ? 'bg-[#00d2ff]/20 border-[#00d2ff] text-[#00d2ff] shadow-[0_0_20px_rgba(0,210,255,0.4)]' : 'bg-white/5 border-white/10 text-gray-400 hover:text-[#00d2ff] hover:border-[#00d2ff]/30'}`}
        aria-label="Abrir notificaciones"
      >
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff3131] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-[#ff3131] border-2 border-black text-[9px] font-bold text-white items-center justify-center">
              {unreadCount}
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" onClick={() => setIsOpen(false)} />
          
          <div 
            ref={modalRef}
            className="relative w-full max-w-[360px] bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-400"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00d2ff] via-[#00ff88] to-[#ff3131] animate-gradient-x"></div>
            
            <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-[#00ff88] rounded-full animate-pulse shadow-[0_0_10px_#00ff88]"></div>
                <h3 className="text-[11px] font-orbitron font-bold text-white tracking-[0.2em] uppercase">Búfer de Alertas</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2.5 bg-white/5 rounded-2xl text-gray-500 hover:text-white hover:bg-red-500/20 transition-all active:scale-90">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="max-h-[320px] overflow-y-auto custom-scrollbar bg-black/40">
              {loading ? (
                <div className="py-20 flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-[#00d2ff]/20 border-t-[#00d2ff] rounded-full animate-spin"></div>
                  <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Sincronizando...</span>
                </div>
              ) : error ? (
                <div className="py-20 px-8 text-center space-y-4">
                  <span className="text-4xl block">⚠️</span>
                  <p className="text-[10px] font-mono text-red-400 uppercase tracking-widest leading-relaxed">{error}</p>
                  <button onClick={reload} className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold uppercase hover:bg-white/10 transition-all">Reintentar Enlace</button>
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-32 text-center space-y-4 opacity-30">
                  <span className="text-6xl block">🛰️</span>
                  <p className="text-[10px] font-mono uppercase tracking-[0.4em]">Sin transmisiones activas</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`p-6 transition-all hover:bg-white/5 relative group/item ${!notif.is_read ? 'bg-[#00d2ff]/5' : ''}`}>
                      {!notif.is_read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00d2ff] shadow-[0_0_15px_#00d2ff]"></div>}
                      <div className="flex gap-5">
                        <span className="text-4xl shrink-0 transition-transform group-hover/item:scale-110">{getIcon(notif.type)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1 gap-3">
                            <h4 className={`text-[11px] font-bold uppercase tracking-tight truncate ${getColor(notif.type)}`}>{notif.title}</h4>
                            <span className="text-[9px] font-mono text-gray-600 shrink-0">{new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-[11px] text-gray-400 leading-relaxed font-sans line-clamp-2">{notif.body || notif.title}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-8 bg-black/80 border-t border-white/5">
              <div className="flex flex-col items-center gap-6">
                <span className="text-[9px] font-orbitron font-bold text-gray-500 uppercase tracking-[0.4em]">Conexión Core Social</span>
                <div className="flex justify-center gap-5">
                  {socialLinks.map((social) => (
                    <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-2xl transition-all hover:scale-125 hover:border-current group/social active:scale-90 shadow-lg" style={{ color: social.color }} title={social.name}>
                      <span className="group-hover/social:drop-shadow-[0_0_15px_currentColor] transition-all filter grayscale hover:grayscale-0">{social.icon}</span>
                    </a>
                  ))}
                </div>
                <button onClick={() => setIsOpen(false)} className="w-full py-4 mt-2 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-orbitron font-bold text-white hover:bg-white hover:text-black transition-all uppercase tracking-[0.3em]">Cerrar Panel</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes gradient-x { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 5s ease infinite; }
      `}</style>
    </div>
  );
};

export default NotificationBell;
