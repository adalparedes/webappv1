
import React, { useState, useEffect, useMemo } from 'react';

interface FuturisticLoaderProps {
  /** Tiempo total aproximado en milisegundos (default: 4000ms) */
  duration?: number;
  /** Callback ejecutado al finalizar la animación de salida */
  onComplete: () => void;
}

/**
 * FuturisticLoader: Un componente de intro cinemática estilo HUD con fondo Grid 3D sutil.
 * El grid se mantiene en la periferia mediante una máscara radial para no tocar el centro.
 */
const FuturisticLoader: React.FC<FuturisticLoaderProps> = ({ 
  duration = 4200, 
  onComplete 
}) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);

  const bootLogs = useMemo(() => [
    "ESTABLISHING_ENCRYPTED_TUNNEL...",
    "SYNCING_BITCOIN_NODE_#B842189",
    "LOADING_NEURAL_MODELS_V3.5",
    "BYPASSING_LEGACY_PROTOCOLS",
    "INJECTING_ADAL_CORE_KERNEL",
    "SYSTEM_INTEGRITY_CHECK: OK",
    "INITIALIZING_INTERFACE..."
  ], []);

  useEffect(() => {
    const startTime = Date.now();
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(rawProgress);

      const currentLog = Math.floor((rawProgress / 100) * bootLogs.length);
      if (currentLog < bootLogs.length) setStatusIndex(currentLog);

      if (rawProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setIsDone(true);
        setTimeout(onComplete, 800);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [duration, onComplete, bootLogs]);

  return (
    <div className={`ap-loader-overlay fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#000000] text-[#00f5ff] font-mono select-none overflow-hidden transition-all duration-700 ${isDone ? 'opacity-0 scale-110' : 'opacity-100'}`}>
      
      {/* 3D Animated Grid Background - Ajustado para ser sutil y periférico */}
      <div className="absolute inset-0 perspective-[1200px] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 origin-center rotate-x-[65deg] animate-ap-grid-travel opacity-[0.12]"
             style={{
               backgroundImage: `linear-gradient(to right, #00f5ff 1px, transparent 1px), linear-gradient(to bottom, #00f5ff 1px, transparent 1px)`,
               backgroundSize: '80px 80px',
               width: '200%',
               height: '200%',
               left: '-50%',
               top: '-50%',
               /* Máscara radial para despejar el centro totalmente */
               maskImage: 'radial-gradient(circle at center, transparent 20%, black 70%)',
               WebkitMaskImage: 'radial-gradient(circle at center, transparent 20%, black 70%)'
             }}>
        </div>
        
        {/* Capa de profundidad adicional (Vignette) */}
        <div className="absolute inset-0 bg-radial-vignette"></div>
      </div>

      {/* HUD Circular Container - Central y despejado */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mb-12 z-10">
        
        {/* Anillo Exterior - Rotación lenta inversa */}
        <div className="absolute inset-0 border border-[#00f5ff]/20 rounded-full animate-ap-spin-slow-reverse shadow-[inset_0_0_30px_rgba(0,245,255,0.05)]"></div>
        
        {/* Anillo Medio - Arcos segmentados */}
        <div className="absolute inset-4 border-2 border-t-[#00f5ff] border-b-[#00f5ff] border-l-transparent border-r-transparent rounded-full animate-ap-spin-fast opacity-60"></div>
        
        {/* Anillo Interno - Punteado */}
        <div className="absolute inset-10 border border-dashed border-[#00f5ff]/40 rounded-full animate-ap-spin-slow"></div>
        
        {/* Core - Núcleo pulsante */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-20 h-20 bg-[#00f5ff]/10 rounded-full blur-2xl animate-ap-pulse-glow"></div>
          <div className="w-5 h-5 bg-[#00f5ff] rounded-full shadow-[0_0_20px_#00f5ff] z-10"></div>
          
          {/* Scanline Vertical - Efecto de barrido */}
          <div className="absolute top-[-50px] left-1/2 w-[1px] h-24 bg-gradient-to-b from-transparent via-white to-transparent opacity-40 animate-ap-scan-v"></div>
        </div>

        {/* Coordenadas Decorativas HUD */}
        <div className="absolute top-4 left-4 text-[8px] opacity-40 tracking-tighter uppercase">COORD_X: 092<br/>COORD_Y: 882</div>
        <div className="absolute bottom-4 right-4 text-[8px] opacity-40 tracking-tighter uppercase">PORTAL_V3<br/>STATUS: OK</div>
      </div>

      {/* Progress Section */}
      <div className="w-full max-w-sm px-8 z-10">
        <div className="flex justify-between items-end mb-2">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase animate-pulse">Sincronizando Protocolo</span>
            <span className="text-[9px] text-[#00f5ff]/50 h-3 font-mono">{bootLogs[statusIndex]}</span>
          </div>
          <span className="text-xl font-bold tabular-nums tracking-tighter shadow-sm">{Math.floor(progress)}%</span>
        </div>

        {/* Progress Bar Container */}
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
          <div 
            className="h-full bg-gradient-to-r from-[#00d2ff] via-[#00f5ff] to-white transition-all duration-100 ease-out shadow-[0_0_10px_#00f5ff]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Footer Binary Code */}
        <div className="mt-8 flex justify-center gap-4 opacity-10 text-[7px] tracking-[0.5em] overflow-hidden whitespace-nowrap font-mono">
          <span>01100001 01100100 01100001 01101100</span>
          <span className="hidden md:inline">01110000 01100001 01110010 01100101 01100100</span>
        </div>
      </div>

      <style>{`
        .perspective-1200 { perspective: 1200px; }
        .rotate-x-65 { transform: rotateX(65deg); }
        .bg-radial-vignette {
          background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,1) 90%);
        }

        @keyframes ap-grid-travel {
          from { transform: rotateX(65deg) translateY(0); }
          to { transform: rotateX(65deg) translateY(80px); }
        }
        @keyframes ap-spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ap-spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes ap-spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(720deg); }
        }
        @keyframes ap-pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.4); opacity: 0.4; }
        }
        @keyframes ap-scan-v {
          0% { transform: translateY(-50px) translateX(-50%); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.6; }
          100% { transform: translateY(140px) translateX(-50%); opacity: 0; }
        }

        .animate-ap-grid-travel { animation: ap-grid-travel 3s linear infinite; }
        .animate-ap-spin-slow { animation: ap-spin-slow 12s linear infinite; }
        .animate-ap-spin-slow-reverse { animation: ap-spin-slow-reverse 15s linear infinite; }
        .animate-ap-spin-fast { animation: ap-spin-fast 4s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-ap-pulse-glow { animation: ap-pulse-glow 3s ease-in-out infinite; }
        .animate-ap-scan-v { animation: ap-scan-v 2.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default FuturisticLoader;
