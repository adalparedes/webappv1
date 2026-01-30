
import React, { useState, useEffect } from 'react';
import { PuzzleTile } from '../types';

interface BitcoinPuzzleProps {
  onSolved: () => void;
}

const BitcoinPuzzle: React.FC<BitcoinPuzzleProps> = ({ onSolved }) => {
  const [tiles, setTiles] = useState<PuzzleTile[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [vipSequence, setVipSequence] = useState<number[]>([]);

  useEffect(() => {
    // Initialize 9 tiles (3x3 grid)
    const initialTiles: PuzzleTile[] = Array.from({ length: 9 }).map((_, i) => {
      const randomRot = Math.floor(Math.random() * 4) * 90;
      return {
        id: i,
        rotation: randomRot,
        correctRotation: 0, // All should face 0 degrees
      };
    });
    setTiles(initialTiles);
  }, []);

  const rotateTile = (id: number) => {
    if (isSolved) return;
    
    // Normal rotation logic
    setTiles((prev) =>
      prev.map((t) => (t.id === id ? { ...t, rotation: (t.rotation + 90) % 360 } : t))
    );
    setAttempts((a) => a + 1);

    // VIP Shortcut Logic (Secret sequence: 4, 5, 6)
    const clickedNum = id + 1;
    const newSequence = [...vipSequence, clickedNum].slice(-3);
    setVipSequence(newSequence);

    if (newSequence[0] === 4 && newSequence[1] === 5 && newSequence[2] === 6) {
      // Force solve state
      setTiles(prev => prev.map(t => ({ ...t, rotation: 0 })));
      setIsSolved(true);
      setTimeout(onSolved, 800);
    }
  };

  useEffect(() => {
    if (tiles.length === 0 || isSolved) return;
    const solved = tiles.every((t) => t.rotation === t.correctRotation);
    if (solved) {
      setIsSolved(true);
      setTimeout(onSolved, 1500);
    }
  }, [tiles, onSolved, isSolved]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-lg mx-auto p-4 animate-in fade-in zoom-in duration-1000">
      <div className="text-center mb-8">
        <h2 className="text-[#00d2ff] font-orbitron text-2xl font-bold mb-2 tracking-wider">VERIFICACIÓN ANTI-SPAM</h2>
        <p className="text-gray-400 text-sm font-mono px-4 uppercase opacity-60">Alinea los segmentos del nodo Bitcoin para sincronizar el hash.</p>
      </div>

      <div className="grid grid-cols-3 gap-2 bg-[#111] p-4 rounded-lg border border-[#333] shadow-2xl relative">
        {tiles.map((tile) => (
          <button
            key={tile.id}
            onClick={() => rotateTile(tile.id)}
            className={`w-20 h-20 md:w-28 md:h-28 bg-[#0a0a0a] border border-[#222] flex flex-col items-center justify-center transition-all duration-300 hover:border-[#00d2ff] group relative overflow-hidden ${isSolved ? 'pointer-events-none border-[#00ff88]' : ''}`}
          >
            {/* VIP Access Number - Visible on each tile */}
            <span className="absolute top-1 left-2 text-[8px] font-mono text-[#00d2ff] opacity-40 group-hover:opacity-100">
              {tile.id + 1}
            </span>

            {/* The Bitcoin Symbol Segment Piece */}
            <div 
              className={`text-4xl md:text-5xl transition-all duration-300 ${isSolved ? 'text-[#00ff88]' : 'text-[#00d2ff] group-hover:scale-110'}`}
              style={{ transform: `rotate(${tile.rotation}deg)` }}
            >
               ₿
            </div>
            
            {/* Corner visual marks */}
            <div className="absolute top-1 left-1 w-1 h-1 bg-[#00d2ff] opacity-20"></div>
            <div className="absolute bottom-1 right-1 w-1 h-1 bg-[#00d2ff] opacity-20"></div>
          </button>
        ))}

        {isSolved && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-lg animate-in fade-in duration-300">
             <div className="text-center">
                <div className="text-[#00ff88] text-4xl mb-2 animate-bounce">✓</div>
                <p className="text-[#00ff88] font-orbitron font-bold tracking-widest uppercase text-lg shadow-[#00ff88]/20 drop-shadow-lg">Acceso Concedido</p>
                <p className="text-xs text-white opacity-60 font-mono mt-1 uppercase tracking-tighter">VIP / Hash Verificado</p>
             </div>
          </div>
        )}
      </div>

      {/* Footer Metrics with Life and Glow */}
      <div className="mt-8 grid grid-cols-3 gap-4 w-full px-2">
         <div className="flex flex-col items-center p-2 bg-white/[0.02] border border-white/5 rounded-xl">
           <span className="text-[7px] text-gray-500 font-mono uppercase tracking-[0.2em] mb-1">Ciclos</span>
           <span className="text-sm font-orbitron font-bold text-[#00ff88] drop-shadow-[0_0_8px_rgba(0,255,136,0.6)] animate-pulse">
             {attempts}
           </span>
         </div>
         <div className="flex flex-col items-center p-2 bg-white/[0.02] border border-white/5 rounded-xl">
           <span className="text-[7px] text-gray-500 font-mono uppercase tracking-[0.2em] mb-1">Seguridad</span>
           <span className="text-[10px] font-orbitron font-bold text-[#00ff88] drop-shadow-[0_0_8px_rgba(0,255,136,0.6)] uppercase">
             Alta
           </span>
         </div>
         <div className="flex flex-col items-center p-2 bg-white/[0.02] border border-white/5 rounded-xl relative overflow-hidden group">
           <div className="absolute inset-0 bg-[#00ff88]/5 animate-pulse"></div>
           <span className="text-[7px] text-gray-500 font-mono uppercase tracking-[0.2em] mb-1 relative z-10">Nivel</span>
           <div className="flex items-center gap-1.5 relative z-10">
             <span className="w-1 h-1 bg-[#00ff88] rounded-full animate-ping"></span>
             <span className="text-[9px] font-orbitron font-bold text-[#00ff88] drop-shadow-[0_0_8px_rgba(0,255,136,0.8)] uppercase">
               VIP_ENABLED
             </span>
           </div>
         </div>
      </div>

      {!isSolved && attempts > 12 && (
        <p className="mt-8 text-[#00ff88] text-[11px] font-bold text-center animate-pulse leading-relaxed px-6 italic opacity-80">
          ¡Échale ganas, campeón! Acomoda los iconos de Bitcoin hasta que queden parejos. No hay que ser graduado de Harvard... ¿o sí? 😉
        </p>
      )}
    </div>
  );
};

export default BitcoinPuzzle;
