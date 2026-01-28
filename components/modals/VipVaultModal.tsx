
import React from 'react';
import ModalContainer from './ModalContainer';
import { User } from '../../types';

interface VipVaultModalProps {
  user: User;
  onClose: () => void;
  onUpgrade: () => void;
}

const VAULTS = [
  {
    id: 'code_treasure',
    title: 'Tesoro de Código',
    description: 'Acceso a scripts privados, templates premium y snippets de nivel producción exclusivos.',
    icon: '📦',
    reward: 'Sourcing_V1'
  },
  {
    id: 'investment_relic',
    title: 'Reliquia de Inversión',
    description: 'Alertas tempranas, análisis de portafolio avanzado y reportes de mercado Alpha.',
    icon: '💰',
    reward: 'Market_Alpha'
  },
  {
    id: 'core_secrets',
    title: 'Secreto del Core',
    description: 'Funciones experimentales de IA y acceso directo al backend de desarrollo de Adal.',
    icon: '🧬',
    reward: 'Kernel_Access'
  }
];

const VipVaultModal: React.FC<VipVaultModalProps> = ({ user, onClose, onUpgrade }) => {
  const isAccessDenied = user.membership === 'FREE' || user.membership === 'NOVATO';

  if (isAccessDenied) {
    return (
      <ModalContainer title="Bóveda Real Bloqueada" onClose={onClose}>
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-8 animate-in fade-in zoom-in duration-500">
           <div className="relative">
              <div className="absolute inset-0 bg-[#ffcc00]/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative w-32 h-32 bg-black border-4 border-[#ffcc00]/40 rounded-full flex items-center justify-center text-6xl shadow-[0_0_60px_rgba(255,204,0,0.2)]">
                👑
              </div>
           </div>
           <div className="max-w-md space-y-4">
              <h3 className="text-3xl font-orbitron font-bold text-white uppercase tracking-tighter">Acceso Denegado al Trono</h3>
              <p className="text-sm text-gray-500 font-mono leading-relaxed uppercase">
                Esta sección está reservada para los rangos <span className="text-[#ffcc00] font-bold">Jefe/Patrona</span> y <span className="text-[#ffcc00] font-bold">Rey/Reina</span>.
              </p>
           </div>
           <button 
            onClick={onUpgrade}
            className="px-12 py-5 bg-[#ffcc00] text-black font-orbitron font-bold text-xs rounded-2xl hover:bg-white transition-all shadow-2xl uppercase tracking-widest"
           >
             Reclamar tu Rango
           </button>
           <p className="text-[10px] text-gray-700 font-mono uppercase">Estado actual: Plebeyo Digital ({user.membership})</p>
        </div>
      </ModalContainer>
    );
  }

  return (
    <ModalContainer title="Bóveda de Reliquias VIP" onClose={onClose}>
      <div className="space-y-12">
        <div className="text-center space-y-2">
          <p className="text-[10px] font-mono text-[#ffcc00] uppercase tracking-[0.5em] animate-pulse">--- CANAL DE RECOMPENSAS EXCLUSIVAS ---</p>
          <p className="text-xs text-gray-600 font-mono uppercase">Los baúles se abrirán próximamente para los usuarios de élite.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
          {VAULTS.map((vault) => (
            <div 
              key={vault.id}
              className="relative group bg-gradient-to-b from-[#1a1a1a] to-black border border-white/5 rounded-[2.5rem] p-8 overflow-hidden"
            >
              {/* Overlay de Candado/Bloqueo */}
              <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center gap-4">
                 <div className="text-5xl drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">🔒</div>
                 <div className="bg-black/80 px-4 py-1.5 rounded-full border border-white/10">
                    <span className="text-[8px] font-mono text-gray-400 uppercase tracking-widest">SELLADO POR EL CORE</span>
                 </div>
              </div>

              {/* Decoración Medieval de Cadenas */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-12 bg-gray-800/50 z-10"></div>
              
              <div className="relative z-10 opacity-40 group-hover:opacity-60 transition-opacity">
                <div className="w-20 h-20 bg-[#ffcc00]/10 border border-[#ffcc00]/20 rounded-3xl flex items-center justify-center text-4xl mb-6 mx-auto shadow-[0_0_30px_rgba(255,204,0,0.1)]">
                   {vault.icon}
                </div>
                <h4 className="text-sm font-orbitron font-bold text-white text-center mb-4 uppercase tracking-tight">{vault.title}</h4>
                <p className="text-[10px] text-gray-600 font-mono text-center leading-relaxed uppercase mb-8">
                  {vault.description}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-[1px] flex-1 bg-white/5"></div>
                  <span className="text-[9px] font-mono text-gray-700 uppercase">BLOQUEADO</span>
                  <div className="h-[1px] flex-1 bg-white/5"></div>
                </div>
              </div>

              {/* Efecto de Brillo de "Oro" de fondo */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#ffcc00]/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-[#ffcc00]/10 transition-all"></div>
            </div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#ffcc00]/10 flex items-center justify-center text-2xl">⚡</div>
              <div className="flex flex-col">
                 <span className="text-xs font-bold text-white uppercase">¿Cómo desbloquear?</span>
                 <span className="text-[10px] text-gray-500 font-mono uppercase">Los baúles se liberan mediante eventos especiales en el Discord VIP.</span>
              </div>
           </div>
           <button className="px-6 py-3 bg-white/5 border border-white/10 text-white font-mono text-[10px] rounded-lg hover:bg-white hover:text-black transition-all uppercase tracking-widest">
             Unirse al Discord VIP
           </button>
        </div>
      </div>
    </ModalContainer>
  );
};

export default VipVaultModal;
