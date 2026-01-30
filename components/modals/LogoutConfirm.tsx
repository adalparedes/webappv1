
import React from 'react';

interface LogoutConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutConfirm: React.FC<LogoutConfirmProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm bg-[#0a0a0a] border border-red-500/30 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.15)] overflow-hidden animate-in zoom-in duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
        
        <div className="p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-3xl animate-pulse">
            ⚠️
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-orbitron font-bold text-white uppercase tracking-tighter">¿Cerrar Sesión?</h3>
            <p className="text-[10px] font-mono text-gray-500 uppercase leading-relaxed tracking-widest">
              Advertencia de desconexión
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <button 
              onClick={onConfirm}
              className="py-4 bg-red-600 text-white font-orbitron font-bold text-[10px] rounded-xl hover:bg-white hover:text-black transition-all shadow-xl uppercase tracking-widest"
            >
              SÍ, SALIR
            </button>
            <button 
              onClick={onCancel}
              className="py-4 bg-white/5 border border-white/10 text-gray-400 font-orbitron font-bold text-[10px] rounded-xl hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest"
            >
              CANCELAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirm;
