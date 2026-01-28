import React, { useState } from 'react';
import ModalContainer from './ModalContainer';
import { User } from '../../types';

interface CoreHubModalProps {
  user: User;
  onClose: () => void;
  onOpenModal: (type: string) => void;
  lastMessage?: string;
}

const CoreHubModal: React.FC<CoreHubModalProps> = ({ user, onClose, onOpenModal, lastMessage }) => {
  const [copyFeedback, setCopyFeedback] = useState(false);

  const shareResult = async () => {
    const rawUrl = window.location.origin;
    const shareUrl = rawUrl.startsWith('http') ? rawUrl : `https://${window.location.hostname}`;
    const shareText = lastMessage 
      ? `Mira esta respuesta del Core de Adal AI: "${lastMessage.substring(0, 100)}..."` 
      : "¡Únete al Core de Adal Paredes AI!";

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Adal AI Core',
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        console.error("Error en Share API:", err);
      }
    }

    try {
      const fullContent = `${shareText} \n\nAccede aquí: ${shareUrl}`;
      await navigator.clipboard.writeText(fullContent);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 3000);
      window.open(`https://wa.me/?text=${encodeURIComponent(fullContent)}`, '_blank');
    } catch (clipboardErr) {
      console.error("Error al copiar:", clipboardErr);
    }
  };

  const communityLogs = [
    { id: 1, tag: 'UPDATE', text: 'Plan Novato v2.1 inyectado con nuevos módulos.', time: '2h' },
    { id: 2, tag: 'CORE', text: 'Sincronización con DeepSeek V3 completada.', time: '5h' },
    { id: 3, tag: 'COMM', text: 'Próximo sorteo de créditos en Discord VIP.', time: '1d' },
  ];

  return (
    <ModalContainer title="Centro de Control" onClose={onClose}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in zoom-in duration-500">
        
        {/* COLUMNA 1: PIZARRÓN Y COMUNIDAD */}
        <div className="flex flex-col space-y-4 bg-white/5 border border-white/10 rounded-[2rem] p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#00ff88]">📢</span>
            <h3 className="text-[10px] font-orbitron font-bold text-white uppercase tracking-widest">Noticias de la Comunidad</h3>
          </div>
          
          <div className="flex-1 space-y-3">
            {communityLogs.map(log => (
              <div key={log.id} className="p-3 bg-black/40 border border-white/5 rounded-xl hover:border-[#00ff88]/20 transition-all group">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[8px] font-mono text-[#00ff88] font-bold px-1.5 py-0.5 bg-[#00ff88]/10 rounded">{log.tag}</span>
                  <span className="text-[7px] text-gray-600 font-mono">{log.time} ago</span>
                </div>
                <p className="text-[10px] text-gray-400 font-mono leading-tight group-hover:text-white transition-colors uppercase">{log.text}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 space-y-2 border-t border-white/5">
            <button onClick={() => window.open('https://discord.gg/adalai', '_blank')} className="w-full py-3 bg-[#5865F2] text-white text-[9px] font-bold rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_15px_rgba(88,101,242,0.3)]">
              <span>Discord VIP</span>
            </button>
            <div className="flex justify-between gap-2">
              <button onClick={() => window.open('https://x.com/adalparedes', '_blank')} className="flex-1 py-2 bg-white/5 border border-white/10 text-white text-[8px] rounded-lg uppercase hover:bg-white/10 transition-colors">𝕏 Twitter</button>
              <button onClick={() => window.open('https://instagram.com/adal.ai', '_blank')} className="flex-1 py-2 bg-white/5 border border-white/10 text-white text-[8px] rounded-lg uppercase hover:bg-white/10 transition-colors">Instagram</button>
            </div>
          </div>
        </div>

        {/* COLUMNA 2: GESTIÓN DE MEMBRESÍA */}
        <div className="flex flex-col space-y-4 bg-gradient-to-br from-[#00ff88]/10 to-transparent border border-[#00ff88]/30 rounded-[2rem] p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 text-4xl group-hover:opacity-20 transition-opacity">🎖️</div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#00ff88]">⚡</span>
            <h3 className="text-[10px] font-orbitron font-bold text-white uppercase tracking-widest">Gestión de Rango</h3>
          </div>

          <div className="space-y-4 flex-1">
             <div className="p-4 bg-black/60 rounded-2xl border border-[#00ff88]/20">
                <span className="text-[8px] text-gray-500 uppercase font-mono block mb-1">Estatus Actual:</span>
                <span className="text-xl font-orbitron font-bold text-[#00ff88] uppercase tracking-tighter shadow-[#00ff88]/20 drop-shadow-sm">{user.membership} NODE</span>
             </div>
             
             <div className="space-y-2">
                <p className="text-[9px] text-gray-400 font-mono uppercase leading-relaxed italic">Eleva tu nivel de enlace para desbloquear módulos de trading, hacking y análisis ilimitado.</p>
                <div className="grid grid-cols-2 gap-2">
                   <div className="text-[8px] text-[#00ff88] bg-[#00ff88]/5 p-2 rounded border border-[#00ff88]/10 text-center uppercase font-bold">Sin Anuncios</div>
                   <div className="text-[8px] text-[#00d2ff] bg-[#00d2ff]/5 p-2 rounded border border-[#00d2ff]/10 text-center uppercase font-bold">IA Pro</div>
                </div>
             </div>
          </div>

          {/* BOTÓN UPGRADEAR VERDE GLOW ANIMADO */}
          <button 
            onClick={() => onOpenModal('membership')}
            className="group/btn w-full py-4 bg-[#00ff88] text-black font-orbitron font-bold text-[10px] rounded-xl uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(0,255,136,0.5)] hover:bg-white hover:scale-105 transition-all relative overflow-hidden animate-pulse-glow"
          >
            <div className="flex items-center justify-center gap-3 relative z-10">
              <span className="text-sm group-hover/btn:rotate-45 transition-transform duration-300">🚀</span>
              Upgradear Membresía
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
          </button>
        </div>

        {/* COLUMNA 3: COMPARTIR Y RESULTADOS */}
        <div className="flex flex-col space-y-4 bg-white/5 border border-white/10 rounded-[2rem] p-6 relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-purple-400">🔗</span>
            <h3 className="text-[10px] font-orbitron font-bold text-white uppercase tracking-widest">Exportar & Compartir</h3>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-3xl mb-2">
               📤
             </div>
             <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest leading-relaxed">
               ¿Obtuviste una respuesta épica del Core? Compártela con tu equipo o comunidad.
             </p>
             {copyFeedback && (
               <span className="text-[8px] text-[#00ff88] font-bold animate-bounce uppercase">¡Link & Texto Copiados!</span>
             )}
          </div>

          <div className="space-y-3">
             <button 
              onClick={shareResult}
              className="w-full py-4 bg-white text-black font-orbitron font-bold text-[10px] rounded-xl flex items-center justify-center gap-3 uppercase tracking-widest hover:bg-[#00ff88] transition-all"
             >
               <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                 <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
               </svg>
               {copyFeedback ? 'COPIADO AL NODO' : 'Compartir Respuestas Chat'}
             </button>
             
             <button 
              onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Unete al portal de IA de Adal Paredes: ' + window.location.origin)}`, '_blank')}
              className="w-full py-3 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-[10px] font-bold rounded-xl flex items-center justify-center gap-2 uppercase tracking-tight hover:bg-[#25D366] hover:text-white transition-all"
             >
               Invitar vía WhatsApp
             </button>
          </div>
        </div>

      </div>
      
      <div className="mt-8 flex justify-center">
        <p className="text-[8px] font-mono text-gray-700 uppercase tracking-[0.4em]">Integrated Hub Control v3.5 // AP Core</p>
      </div>

      <style>{`
        @keyframes pulse-glow-green {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 136, 0.4); }
          50% { box-shadow: 0 0 40px rgba(0, 255, 136, 0.7); }
        }
        .animate-pulse-glow {
          animation: pulse-glow-green 2s infinite ease-in-out;
        }
      `}</style>
    </ModalContainer>
  );
};

export default CoreHubModal;