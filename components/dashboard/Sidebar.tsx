import React, { useState, useRef, memo } from 'react';
import { User, Conversation } from '../../types';
import { Logo } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../lib/hooks/useNotifications';
import { chatService } from '../../lib/chatService';

interface SidebarProps {
  user: User;
  conversations: Conversation[];
  activeId: string | null;
  onSelectConv: (id: string) => void;
  onOpenModal: (type: string) => void;
  onSignOutRequest?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  onConversationDeleted?: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  conversations, 
  activeId, 
  onSelectConv, 
  onOpenModal,
  onSignOutRequest,
  isOpen = false,
  onClose,
  onConversationDeleted
}) => {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { session, isAdmin } = useAuth();
  const { unreadCount } = useNotifications();
  const deleteCooldown = useRef(0);
  const DELETE_COOLDOWN_MS = 3000; // 3 segundos

  const isVipLevel = ['JEFE', 'PATRONA', 'REY', 'REINA', 'ADMIN'].includes(user.membership?.toUpperCase());
  const isProLevel = isVipLevel || ['NOVATO', 'NOVATA', 'PREMIUM'].includes(user.membership?.toUpperCase());

  const handleAction = (modalType: string) => {
    onOpenModal(modalType);
    if (window.innerWidth < 1024) onClose?.(); 
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    const now = Date.now();
    if (now - deleteCooldown.current < DELETE_COOLDOWN_MS) {
        alert("Comandos de purga demasiado rápidos.");
        return;
    }

    if (!session?.user?.id || deletingId) return;

    if (window.confirm("¿Estás seguro de que quieres eliminar esta conversación? Esta acción no se puede deshacer.")) {
      deleteCooldown.current = now;
      setDeletingId(id);
      try {
        await chatService.deleteConversation(session.user.id, id);
        onConversationDeleted?.(id);
      } catch (err) {
        alert("Fallo en la purga del nodo.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] lg:hidden" onClick={onClose} />}

      <div className={`fixed lg:relative inset-y-0 left-0 z-[110] lg:z-50 w-72 bg-[#050505] border-r border-white/5 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40">
          <Logo className="scale-90" />
          <button onClick={onClose} className="lg:hidden p-2 text-gray-500 hover:text-white transition-colors">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col p-4 space-y-6">
          
          <div className="space-y-2">
            <button onClick={() => handleAction('notifications')} className="w-full flex items-center justify-between p-3.5 bg-white/5 border border-white/10 rounded-xl group hover:border-[#00d2ff]/40 transition-all">
              <div className="flex items-center gap-3">
                <span className="text-lg group-hover:scale-110 transition-transform">🔔</span>
                <span className="text-[10px] font-orbitron font-bold text-white tracking-widest uppercase">Alertas</span>
              </div>
              {unreadCount > 0 && <span className="bg-[#ff3131] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md animate-pulse">{unreadCount}</span>}
            </button>

            <button onClick={() => handleAction('balance')} className="w-full flex items-center justify-between p-3 bg-[#00d2ff]/10 border border-[#00d2ff]/20 rounded-xl group hover:bg-[#00d2ff]/20 transition-all">
              <div className="flex items-center gap-3">
                <span className="text-lg">💎</span>
                <span className="text-[10px] font-orbitron font-bold text-[#00d2ff] tracking-widest uppercase">Créditos</span>
              </div>
              <span className="text-[10px] text-white font-mono opacity-50">{user.balance.toFixed(0)}</span>
            </button>
          </div>

          <div className="space-y-1">
            <p className="px-2 text-[8px] font-mono text-gray-600 uppercase tracking-[0.2em] mb-2">Intel & Core</p>
            {['news', 'crypto', 'tutorials', 'humor'].map(type => (
              <button key={type} onClick={() => handleAction(type)} className="w-full flex items-center gap-3 p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all text-left group">
                <span className="group-hover:rotate-12 transition-transform">{type === 'news' ? '🌐' : type === 'crypto' ? '₿' : type === 'tutorials' ? '📚' : '🎬'}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">{type === 'news' ? 'Noticias Tech' : type === 'crypto' ? 'Cripto Intel' : type === 'tutorials' ? 'Tutoriales' : 'Humor'}</span>
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <p className="px-2 text-[8px] font-mono text-gray-600 uppercase tracking-[0.2em] mb-2">Ecosistema A P</p>
            <button onClick={() => handleAction('store')} className="w-full flex items-center gap-3 p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all text-left group">
              <span>🛒</span><span className="text-[10px] font-bold uppercase tracking-wider">Tienda Online</span>
            </button>
            <button onClick={() => handleAction('services')} className="w-full flex items-center gap-3 p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all text-left group">
              <span>🛠️</span><span className="text-[10px] font-bold uppercase tracking-wider">Servicios Pro</span>
            </button>
            <button onClick={() => handleAction('tools')} disabled={!isProLevel} className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all text-left group ${isProLevel ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-700 cursor-not-allowed opacity-40'}`}>
              <div className="flex items-center gap-3">
                <span>🛡️</span><span className="text-[10px] font-bold uppercase tracking-wider">Cyber Tools</span>
              </div>
              {!isProLevel && <span className="text-[7px] border border-red-500/30 text-red-500 px-1 rounded">VIP</span>}
            </button>
          </div>

          <div className="flex-1 flex flex-col min-h-[200px]">
            <p className="px-2 text-[8px] font-mono text-gray-600 uppercase tracking-[0.2em] mb-2">Memoria de Conversaciones</p>
            <div className="space-y-1 overflow-y-auto custom-scrollbar flex-1 pr-1">
              {conversations.map(conv => (
                <div key={conv.id} className="group/item relative">
                  <button onClick={() => { onSelectConv(conv.id); if (window.innerWidth < 1024) onClose?.(); }} className={`w-full text-left p-2.5 pr-10 rounded-lg flex items-center gap-3 transition-all ${activeId === conv.id ? 'bg-[#00d2ff]/10 text-[#00d2ff]' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}>
                    <div className={`w-1 h-1 rounded-full ${activeId === conv.id ? 'bg-[#00d2ff]' : 'bg-gray-700'}`}></div>
                    <span className="text-[10px] font-bold truncate uppercase">{conv.title || 'Comando AI'}</span>
                  </button>
                  <button onClick={(e) => handleDelete(e, conv.id)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover/item:opacity-100 text-gray-600 hover:text-red-500 transition-all">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/5 bg-black/60 backdrop-blur-xl">
          <button onClick={() => setShowAccountMenu(!showAccountMenu)} className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all">
             <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00d2ff] to-[#005f73] flex items-center justify-center text-[11px] font-bold text-black font-orbitron shadow-[0_0_15px_rgba(0,210,255,0.2)]">
               {user.username.substring(0,2).toUpperCase()}
             </div>
             <div className="flex-1 text-left min-w-0">
               <span className="text-xs font-bold text-white block truncate">{user.username}</span>
               <span className={`text-[8px] uppercase font-mono tracking-tighter ${isAdmin ? 'text-red-500 font-black' : 'text-gray-500'}`}>{isAdmin ? 'GOD_MODE' : `${user.membership} Node`}</span>
             </div>
             <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className={showAccountMenu ? 'rotate-180' : ''}><path d="M5 15l7-7 7 7"/></svg>
          </button>
          
          {showAccountMenu && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#0a0a0a] border border-white/10 rounded-2xl p-2 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
              <button onClick={() => handleAction('profile')} className="w-full flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-xl transition-all text-left">
                <span>👤</span><span className="text-[10px] font-bold uppercase text-gray-300">Perfil de Nodo</span>
              </button>
              <button onClick={() => handleAction('personalization')} className="w-full flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-xl transition-all text-left">
                <span>🎨</span><span className="text-[10px] font-bold uppercase text-gray-300">Personalizar</span>
              </button>
              <button onClick={() => handleAction('membership')} className="w-full flex items-center gap-3 p-2.5 hover:bg-[#00ff88]/10 rounded-xl transition-all text-left group">
                <span className="group-hover:animate-bounce">⚡</span><span className="text-[10px] font-bold uppercase text-[#00ff88]">Membresía</span>
              </button>
              <div className="h-[1px] bg-white/5 my-1" />
              <button onClick={onSignOutRequest} className="w-full flex items-center gap-3 p-2.5 hover:bg-red-500/10 rounded-xl transition-all text-left text-red-500">
                <span>🔌</span><span className="text-[10px] font-bold uppercase">Desconectar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default memo(Sidebar);