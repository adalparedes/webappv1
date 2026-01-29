
import React from 'react';
import ModalContainer from './ModalContainer';

const CommunityInfoModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <ModalContainer title="Portal de Comunidad" onClose={onClose}>
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Banner Informativo */}
        <section className="bg-gradient-to-br from-[#ff3e8d]/10 to-transparent border border-[#ff3e8d]/30 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 bg-[#ff3e8d] text-black text-[9px] font-bold uppercase tracking-widest">Aviso de Red</div>
          <div className="max-w-xl">
            <h3 className="text-xl font-orbitron font-bold text-white mb-4 uppercase tracking-tighter">Nodo Regional: Latam Online</h3>
            <p className="text-sm text-gray-400 font-sans leading-relaxed mb-6">
              Para optimizar la latencia en un 40% para el sector de habla hispana, hemos inyectado un nuevo pool de servidores locales. El Adal Core ahora es más rápido que nunca en tu región.
            </p>
            <div className="flex gap-4">
              <span className="text-[10px] font-mono text-[#ff3e8d] uppercase font-bold tracking-widest">#Infraestructura</span>
              <span className="text-[10px] font-mono text-[#ff3e8d] uppercase font-bold tracking-widest">#Sincronización</span>
            </div>
          </div>
        </section>

        {/* Canales de Acceso */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a 
            href="https://discord.gg/tu-enlace" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group p-6 bg-black/40 border border-[#5865F2]/30 rounded-2xl hover:bg-[#5865F2]/10 transition-all flex items-center gap-6 shadow-lg hover:shadow-[#5865F2]/10"
          >
            <div className="w-14 h-14 bg-[#5865F2]/20 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">💬</div>
            <div className="flex flex-col">
              <h4 className="text-sm font-bold text-white uppercase mb-1">Discord Oficial</h4>
              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-tighter">Soporte, colaboraciones y chat de hackers.</p>
            </div>
          </a>
          
          <a 
            href="https://x.com/AdalParedes1" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group p-6 bg-black/40 border border-[#1DA1F2]/30 rounded-2xl hover:bg-[#1DA1F2]/10 transition-all flex items-center gap-6 shadow-lg hover:shadow-[#1DA1F2]/10"
          >
            <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">𝕏</div>
            <div className="flex flex-col">
              <h4 className="text-sm font-bold text-white uppercase mb-1">Comunidad en X</h4>
              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-tighter">Actualizaciones críticas y visión tech.</p>
            </div>
          </a>
        </div>

        {/* Métricas del Ecosistema */}
        <div className="grid grid-cols-3 gap-4 py-8 border-y border-white/5">
           <div className="text-center">
             <div className="text-2xl font-orbitron font-bold text-[#00ff88]">5,402</div>
             <div className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">Suscritos</div>
           </div>
           <div className="text-center">
             <div className="text-2xl font-orbitron font-bold text-[#00d2ff]">842</div>
             <div className="text-[9px] text-gray-600 font-mono uppercase tracking-widest">Activos</div>
           </div>
           <div className="text-center">
             <div className="text-2xl font-orbitron font-bold text-[#ff3e8d]">24/7</div>
             <div className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">Uptime</div>
           </div>
        </div>

        {/* Cierre */}
        <div className="flex justify-center">
          <button 
            onClick={onClose} 
            className="px-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-orbitron font-bold text-white hover:bg-white hover:text-black transition-all uppercase tracking-[0.3em]"
          >
            Cerrar Protocolo
          </button>
        </div>
      </div>
    </ModalContainer>
  );
};

export default CommunityInfoModal;
