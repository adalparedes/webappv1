
import React from 'react';
import { useCart } from '../../context/CartContext';

interface CartDrawerProps {
  onClose: () => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ onClose, onCheckout }) => {
  const { items, removeItem, total, itemCount } = useCart();

  return (
    <div className="fixed inset-0 z-[150] flex justify-end animate-in fade-in duration-300">
      {/* Overlay con desenfoque */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Panel Lateral */}
      <div className="relative w-full max-w-md bg-[#080808] border-l border-white/10 shadow-[-10px_0_50px_rgba(0,0,0,0.5)] flex flex-col animate-in slide-in-from-right duration-500">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00ff88] via-transparent to-[#00d2ff]"></div>
        
        {/* Header del Carrito */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛒</span>
            <div>
              <h2 className="text-sm font-orbitron font-bold text-white uppercase tracking-widest">Tu Inventario</h2>
              <p className="text-[9px] font-mono text-[#00ff88] uppercase tracking-tighter">{itemCount} ARTÍCULOS DETECTADOS</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Lista de Productos */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
              <span className="text-6xl mb-4">📭</span>
              <p className="text-xs font-mono uppercase tracking-widest">El carrito está vacío</p>
              <button onClick={onClose} className="mt-4 text-[10px] text-[#00d2ff] underline">VOLVER A LA TIENDA</button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 bg-white/5 border border-white/5 rounded-2xl group hover:border-[#00ff88]/30 transition-all">
                <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center text-3xl border border-white/5">
                  {item.image}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white uppercase truncate">{item.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-mono text-[#00ff88]">${item.price.toFixed(2)}</span>
                    <span className="text-[9px] text-gray-600 font-mono">x{item.quantity}</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-gray-700 hover:text-red-500 transition-colors"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer con Resumen y Checkout */}
        {items.length > 0 && (
          <div className="p-6 bg-black border-t border-white/10 space-y-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono text-gray-500 uppercase">
                <span>Subtotal:</span>
                <span className="text-white font-bold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-gray-500 uppercase">
                <span>Envío (Sincronización):</span>
                <span className="text-[#00ff88]">GRATIS</span>
              </div>
              <div className="pt-2 border-t border-white/5 flex justify-between items-end">
                <span className="text-xs font-orbitron font-bold text-white tracking-widest uppercase">Total Final</span>
                <span className="text-3xl font-orbitron font-bold text-[#00ff88] animate-pulse">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <button 
              onClick={onCheckout}
              className="w-full py-5 bg-[#00ff88] text-black font-orbitron font-bold text-xs tracking-[0.2em] rounded-2xl hover:bg-white hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(0,255,136,0.3)] uppercase"
            >
              Iniciar Pago Seguro
            </button>
            <p className="text-[8px] text-gray-600 font-mono uppercase text-center tracking-widest">
              SHA-512 SECURE TRANSACTION NODE
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
