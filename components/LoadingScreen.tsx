
import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  "SYSTEM_CHECK: OK",
  "DECRYPTING_NEURAL_LAYERS...",
  "SYNCING_BITCOIN_NODE_#842109",
  "ESTABLISHING_TLS_1.3_TUNNEL",
  "BYPASSING_LEGACY_FIREWALLS",
  "CORE_KERNEL_LOADED",
  "INTERFACE_RENDER_INIT",
  "ADAL_PAREDES_V3_ONLINE",
];

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 1;
      });
    }, 35);
    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const logTimer = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % BOOT_LOGS.length);
    }, 600);
    return () => clearInterval(logTimer);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#020202] z-[100] flex flex-col items-center justify-center p-6 select-none overflow-hidden font-mono text-white">
      {/* Scanline / CRT Effect Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

      {/* Background Decor: Data Bits in Mixed Colors */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        {Array.from({ length: 25 }).map((_, i) => (
          <div 
            key={i}
            className={`absolute text-[8px] animate-float-slow ${i % 2 === 0 ? 'text-[#00d2ff]' : 'text-[#00ff88]'}`}
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random()
            }}
          >
            {Math.random() > 0.5 ? '10' : '0x' + Math.floor(Math.random()*16).toString(16)}
          </div>
        ))}
      </div>

      {/* Side Logs - Left (Cian) */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2 opacity-30 text-[9px] text-[#00d2ff]">
        {BOOT_LOGS.map((log, i) => (
          <div key={i} className={i === logIndex ? "opacity-100 font-bold" : "opacity-40"}>
            {`> ${log}`}
          </div>
        ))}
      </div>

      {/* Main AI CORE Visual (Balanced Palette) */}
      <div className="relative mb-16 scale-110">
        <div className="w-56 h-56 md:w-72 md:h-72 flex items-center justify-center relative">
          
          {/* Orbital Rings - Mix of Cian and White */}
          <div className="absolute inset-0 border border-[#00d2ff]/20 rounded-full animate-spin-slow"></div>
          <div className="absolute inset-4 border border-white/10 rounded-full animate-reverse-spin opacity-40"></div>
          <div className="absolute inset-8 border-t-2 border-b-2 border-[#00ff88]/40 rounded-full animate-spin-fast"></div>
          <div className="absolute inset-12 border-l border-r border-[#00d2ff]/30 rounded-full animate-reverse-spin"></div>

          {/* Central Neural Node */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
             {/* Pulsing Core - Cian Glow */}
             <div className="absolute inset-0 bg-[#00d2ff]/10 rounded-full blur-3xl animate-pulse"></div>
             
             {/* Grid Sphere Simulation - Emerald Green */}
             <div className="absolute inset-0 rounded-full border border-[#00ff88]/20 overflow-hidden opacity-40">
                <div className="w-full h-full bg-[radial-gradient(#00ff88_1px,transparent_1px)] bg-[size:12px_12px] animate-pulse"></div>
             </div>

             {/* The "Eye" of AI - Black, White & Cian */}
             <div className="w-16 h-16 md:w-20 md:h-20 bg-black rounded-full border-2 border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(0,210,255,0.4)] z-10 relative">
                {/* Core Pupil - Pulsing Cian */}
                <div className="w-6 h-6 md:w-8 md:h-8 bg-[#00d2ff] rounded-full animate-inner-pulse shadow-[0_0_20px_#00d2ff]"></div>
                
                {/* Crosshairs - White/Cian */}
                <div className="absolute w-[140%] h-[0.5px] bg-[#00d2ff]/40 rotate-45"></div>
                <div className="absolute w-[140%] h-[0.5px] bg-[#00d2ff]/40 -rotate-45"></div>
                <div className="absolute inset-0 border border-[#00ff88]/30 rounded-full scale-125 animate-ping opacity-20"></div>
             </div>

             {/* Scanner Laser Beam - White/Cian Hybrid */}
             <div className="absolute top-0 left-0 w-full h-[1px] bg-white shadow-[0_0_12px_#00d2ff,0_0_4px_white] animate-scan-y z-20"></div>
          </div>

          {/* HUD Corner Brackets - White/Cian */}
          <div className="absolute -top-4 -left-4 w-6 h-6 border-t-2 border-l-2 border-white/30"></div>
          <div className="absolute -top-4 -right-4 w-6 h-6 border-t-2 border-r-2 border-[#00d2ff]/40"></div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 border-b-2 border-l-2 border-[#00d2ff]/40"></div>
          <div className="absolute -bottom-4 -right-4 w-6 h-6 border-b-2 border-r-2 border-white/30"></div>
        </div>
      </div>

      {/* Progress Section - Balanced Colors */}
      <div className="w-full max-w-sm relative z-10">
        <div className="flex justify-between items-end mb-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#00d2ff] font-bold tracking-[0.4em] uppercase mb-1">Sincronizando Protocolo</span>
            <span className="text-[9px] text-white/40 uppercase font-mono">{BOOT_LOGS[logIndex]}</span>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[#00ff88] font-bold text-xl tabular-nums tracking-tighter shadow-sm">{progress}%</span>
          </div>
        </div>

        {/* Progress Bar - Cian with Green Accent */}
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[0.5px]">
          <div 
            className="h-full bg-gradient-to-r from-[#00d2ff] to-[#00ff88] transition-all duration-300 relative shadow-[0_0_15px_rgba(0,210,255,0.5)]"
            style={{ width: `${progress}%` }}
          >
            {/* White Glow Head for the progress bar */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/40 blur-md"></div>
          </div>
        </div>

        {/* Binary Footer - Subtle White/Cian */}
        <div className="mt-8 text-center opacity-30">
          <p className="text-[7px] text-white tracking-[0.6em] truncate">
            01010111 01000001 01010100 01000011 01001000 01001001 01001110 01000111
          </p>
        </div>
      </div>

      <style>{`
        @keyframes scan-y {
          0%, 100% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          50% { top: 100%; }
          90% { opacity: 1; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(8px); }
        }
        @keyframes inner-pulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        .animate-scan-y {
          animation: scan-y 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        .animate-reverse-spin {
          animation: reverse-spin 7s linear infinite;
        }
        .animate-spin-fast {
          animation: spin-fast 4s linear infinite;
        }
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
        .animate-inner-pulse {
          animation: inner-pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
