
import React from 'react';

interface ModalContainerProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalContainer: React.FC<ModalContainerProps> = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-4xl bg-gray-900/90 border border-[#00d2ff]/30 rounded-2xl shadow-[0_0_100px_rgba(0,210,255,0.1)] overflow-hidden animate-in zoom-in slide-in-from-bottom duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00d2ff] via-transparent to-[#00d2ff]"></div>
        
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="font-orbitron font-bold text-[#00d2ff] tracking-[0.2em] uppercase">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white transition-colors"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto custom-scrollbar p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalContainer;
