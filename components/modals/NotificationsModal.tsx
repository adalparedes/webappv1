
import React, { useEffect } from 'react';
import ModalContainer from './ModalContainer';
import { useNotifications } from '../../lib/hooks/useNotifications';
import { NotificationType } from '../../types';

const NotificationsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { notifications, loading, error, markAsRead, reload } = useNotifications();

  useEffect(() => {
    // Marcar como leídas al abrir el modal después de 2 segundos
    const timer = setTimeout(() => markAsRead(), 2500);
    return () => clearTimeout(timer);
  }, [markAsRead]);

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

  return (
    <ModalContainer title="Búfer de Alertas del Sistema" onClose={onClose}>
      <div className="max-h-[50vh] overflow-y-auto custom-scrollbar pr-2 min-h-[300px]">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#00d2ff]/20 border-t-[#00d2ff] rounded-full animate-spin"></div>
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Sincronizando flujo...</span>
          </div>
        ) : error ? (
          <div className="py-20 text-center space-y-4">
            <span className="text-4xl block">⚠️</span>
            <p className="text-[10px] font-mono text-red-400 uppercase tracking-widest">{error}</p>
            <button onClick={reload} className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold uppercase hover:bg-white/10">Reintentar</button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-32 text-center space-y-4 opacity-30 grayscale">
            <span className="text-6xl block">🛰️</span>
            <p className="text-[10px] font-mono uppercase tracking-[0.4em]">Sin transmisiones activas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-5 rounded-2xl border transition-all relative overflow-hidden group ${!notif.is_read ? 'bg-[#00d2ff]/5 border-[#00d2ff]/20 shadow-[0_0_20px_rgba(0,210,255,0.05)]' : 'bg-black/40 border-white/5 opacity-80'}`}
              >
                {!notif.is_read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00d2ff] animate-pulse shadow-[0_0_15px_#00d2ff]"></div>
                )}
                
                <div className="flex gap-5 items-start">
                  <div className="w-14 h-14 bg-black border border-white/5 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className={`text-[11px] font-orbitron font-bold uppercase tracking-tight truncate ${getColor(notif.type)}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[8px] font-mono text-gray-600 uppercase">
                        {new Date(notif.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-sans leading-relaxed line-clamp-2">
                      {notif.body || 'Transmisión de datos sin descripción adicional.'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-8 pt-6 border-t border-white/5 text-center space-y-4">
        <p className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.2em] animate-pulse">
          PROTOCOL: REAL_TIME_SYNC_ACTIVE // V3.5
        </p>
        <button onClick={onClose} className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-orbitron font-bold text-white hover:bg-white hover:text-black transition-all uppercase tracking-widest">
          Cerrar Búfer
        </button>
      </div>
    </ModalContainer>
  );
};

export default NotificationsModal;
