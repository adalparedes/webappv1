
import React from 'react';
import { useAuth } from '../context/AuthContext';

interface AccessPortalProps {
  onEnter: () => void;
}

const AccessPortal: React.FC<AccessPortalProps> = ({ onEnter }) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-in zoom-in slide-in-from-bottom duration-1000">
      
      {/* Animated Logo Container */}
      <div className="relative mb-8 group">
        <div className="absolute inset-0 bg-[#00ff88] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>
        <div className="absolute -inset-4 border-2 border-[#00ff88]/30 rounded-full animate-ping opacity-20"></div>
        
        <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-full border border-white/10 shadow-[0_0_30px_rgba(0,255,136,0.2)] overflow-hidden animate-float">
          <img 
            src="https://res.cloudinary.com/dv1yofc8f/image/upload/v1767857953/ap_dp_1_cnobg3.png" 
            alt="Adal Paredes Logo" 
            className="w-full h-full object-contain scale-90 group-hover:scale-100 transition-transform duration-700"
          />
        </div>
      </div>
      
      <h1 className="text-2xl md:text-4xl font-orbitron font-bold text-white mb-3 tracking-tight uppercase">
        {user ? `¡HOLA DE NUEVO, ${user.username}!` : '¡PUM! ERES HUMANO ✨'}
      </h1>
      
      <div className="max-w-2xl mb-12">
        <p className="text-[#00ff88] font-orbitron text-base md:text-lg font-bold mb-6 uppercase drop-shadow-[0_0_8px_rgba(0,255,136,0.3)] tracking-widest">
          {user ? 'TU NODO SIGUE ACTIVO Y SINCRONIZADO.' : 'TU NUEVO COPILOTO IT DE CONFIANZA.'}
        </p>
        
        {/* Mensaje con más vida y color */}
        <div className="relative p-6 md:p-8 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden group/box">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent opacity-50"></div>
          
          <p className="text-gray-100 font-mono text-sm md:text-base leading-relaxed uppercase tracking-wide">
            {user ? (
              <>Haz clic abajo para <span className="text-[#00ff88] font-bold">reanudar tus operaciones</span> de inmediato sin volver a registrar tus credenciales.</>
            ) : (
              <>
                Migramos de un simple blog a ser el <span className="text-[#00ff88] font-bold underline decoration-2 underline-offset-4">copiloto de tu día a día</span>. 
                <br className="hidden md:block" />
                Dudas <span className="text-[#00d2ff] font-bold">#tech</span>, código que <span className="text-red-400 font-bold">no compila</span> o cualquier otro 
                <span className="text-white font-bold px-2 bg-white/10 rounded mx-1 italic">drama digital</span>... aquí te ayudo.
              </>
            )}
          </p>
          
          {/* Decorative Corner Elements */}
          <div className="absolute bottom-2 right-4 text-[10px] text-[#00ff88] opacity-20 font-mono hidden md:block tracking-widest">
            ADAL_CORE_V3_ONLINE
          </div>
        </div>
      </div>

      {/* Botón Verde con Glow Animado */}
      <button 
        onClick={onEnter}
        className="group relative px-12 py-5 font-orbitron font-bold text-base tracking-widest overflow-hidden transition-all duration-300 active:scale-95 shadow-[0_0_30px_rgba(0,255,136,0.4)] bg-[#00ff88] text-black hover:bg-white hover:shadow-[0_0_50px_rgba(0,255,136,0.6)] rounded-sm"
      >
        <span className="relative z-10 uppercase">
          {user ? 'Reanudar Sesión' : 'Entrar al Portal'}
        </span>
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
        {/* Glow pulsing layer */}
        <div className="absolute inset-0 bg-white/20 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </button>

      {/* Footer Metrics - Verde para etiquetas, Blanco para valores */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-90">
        <div className="flex flex-col items-center md:items-start">
          <span className="text-[10px] text-[#00ff88] font-mono font-bold tracking-[0.2em] mb-1">BLOCKS</span>
          <span className="text-xs font-bold font-mono text-white">#842,109</span>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <span className="text-[10px] text-[#00ff88] font-mono font-bold tracking-[0.2em] mb-1">SESSION</span>
          <span className="text-xs font-bold font-mono text-white uppercase">{user ? 'RESTORED' : 'NEW'}</span>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <span className="text-[10px] text-[#00ff88] font-mono font-bold tracking-[0.2em] mb-1">CORE_REV</span>
          <span className="text-xs font-bold font-mono text-white uppercase">V3.1.2</span>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <span className="text-[10px] text-[#00ff88] font-mono font-bold tracking-[0.2em] mb-1">AUTH_MODE</span>
          <span className="text-xs font-bold font-mono text-white uppercase">{user ? 'BYPASS_ON' : 'NORMAL'}</span>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AccessPortal;
