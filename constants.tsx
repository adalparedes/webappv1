
import React from 'react';

export const BRAND_COLORS = {
  primary: '#00d2ff', // Tech Cyan/Blue
  secondary: '#005f73',
  background: '#050505',
  surface: '#121212',
  text: '#e0e0e0',
};

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`flex items-center gap-4 ${className}`}>
    <div className="relative group">
      {/* Dynamic Glow Background */}
      <div className="absolute inset-0 bg-[#00d2ff] rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>
      
      {/* Animated Ping Ring */}
      <div className="absolute -inset-1 border border-[#00d2ff]/30 rounded-full animate-ping opacity-20 pointer-events-none"></div>

      {/* Main Image Container with Float Animation */}
      <div className="relative w-12 h-12 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-full border border-white/10 shadow-[0_0_15px_rgba(0,210,255,0.3)] overflow-hidden animate-float-small">
        <img 
          src="https://res.cloudinary.com/dv1yofc8f/image/upload/v1767857953/ap_dp_1_cnobg3.png" 
          alt="AP Logo" 
          className="w-full h-full object-contain p-1.5 transition-transform duration-500 group-hover:scale-110"
        />
      </div>
    </div>

    <div className="flex flex-col">
      <span className="font-orbitron font-bold tracking-widest text-lg text-white leading-none mb-1">ADAL PAREDES</span>
      <span className="text-[9px] tracking-[0.2em] text-[#00d2ff] font-bold uppercase opacity-80">TECH ASSISTANT</span>
    </div>

    <style>{`
      @keyframes float-small {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-3px); }
      }
      .animate-float-small {
        animation: float-small 3s ease-in-out infinite;
      }
    `}</style>
  </div>
);
