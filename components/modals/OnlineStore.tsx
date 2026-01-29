import React, { useState, useEffect } from 'react';
import ModalContainer from './ModalContainer';
import { useCart } from '../../context/CartContext';
import LoadBalance from './LoadBalance';
import { supabase } from '../../lib/supabaseClient';
import { CreditPack } from '../../lib/credits';

const PHYSICAL_PRODUCTS = [
  { id: 'p1', name: 'Hacker Hoodie V2', price: 59.99, originalPrice: 89.99, img: '👕', desc: 'Material premium ultra-soft.', stock: 5, type: 'product' as const },
  { id: 'p2', name: 'AP Tech Cap', price: 24.99, originalPrice: 35.00, img: '🧢', desc: 'Edición limitada bordado cian.', stock: 12, type: 'product' as const },
];

interface OnlineStoreProps {
  onClose: () => void;
  onOpenModal: (type: string) => void;
}

const OnlineStore: React.FC<OnlineStoreProps> = ({ onClose, onOpenModal }) => {
  const { addItem } = useCart();
  const [creditPacks, setCreditPacks] = useState<CreditPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoadBalance, setShowLoadBalance] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const { data, error } = await supabase
          .from('credit_packs')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });
        if (error) throw error;
        if (data) setCreditPacks(data);
      } catch (err) { console.error("Error fetching packs:", err); } 
      finally { setLoading(false); }
    };
    fetchPacks();
  }, []);

  const handleAddProductToCart = (p: any) => {
    addItem({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.img,
      quantity: 1,
      type: 'product'
    });
    setAddedProductId(p.id);
    setTimeout(() => {
        setAddedProductId(null);
    }, 2000);
  };

  if (showLoadBalance) {
    return <LoadBalance onClose={() => setShowLoadBalance(false)} onOpenModal={onOpenModal} />;
  }

  return (
    <ModalContainer title="Tienda Online & Créditos" onClose={onClose}>
      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#00ff88]/10 rounded-xl flex items-center justify-center border border-[#00ff88]/20">
              <span className="text-xl">💎</span>
            </div>
            <h3 className="font-orbitron font-bold text-white uppercase tracking-widest text-sm">Recargas de Crédito Instantáneas</h3>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 bg-white/5 animate-pulse rounded-2xl" />)
            ) : (
              creditPacks.map((pack) => (
                <div key={pack.code} className="bg-gradient-to-br from-[#00ff88]/5 to-transparent border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col hover:border-[#00ff88]/40 transition-all group relative overflow-hidden min-h-[160px] md:min-h-[200px]">
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#00ff88]/5 rounded-full blur-3xl group-hover:bg-[#00ff88]/15 transition-all"></div>
                  
                  <div className="flex justify-between items-start mb-2 md:mb-4 relative z-10">
                    <span className="text-xl md:text-2xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">💎</span>
                    <span className="text-[8px] md:text-[10px] font-mono text-[#00ff88] font-bold bg-[#00ff88]/10 px-2 py-0.5 rounded-full">+{pack.credits}</span>
                  </div>
                  
                  <h4 className="text-[9px] md:text-[10px] font-orbitron font-bold text-gray-400 uppercase mb-1 relative z-10 truncate">{pack.name}</h4>
                  <div className="text-lg md:text-2xl font-orbitron font-bold text-white mb-auto relative z-10">${pack.price_usd}</div>
                  
                  <button 
                    onClick={() => setShowLoadBalance(true)}
                    className="w-full py-3 md:py-4 bg-[#00ff88] text-black text-[9px] md:text-[10px] font-orbitron font-bold rounded-xl transition-all uppercase tracking-[0.1em] md:tracking-[0.2em] shadow-[0_5px_15px_rgba(0,255,136,0.3)] hover:scale-[1.05] active:scale-95 relative z-10 mt-3"
                  >
                    Seleccionar
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 bg-[#00d2ff]/10 rounded-xl flex items-center justify-center border border-[#00d2ff]/20">
              <span className="text-xl">👕</span>
            </div>
            <h3 className="font-orbitron font-bold text-white uppercase tracking-widest text-sm">Merchandising Oficial</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {PHYSICAL_PRODUCTS.map((p) => (
              <div key={p.id} className="bg-black/40 border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-5 flex flex-col hover:border-[#00ff88]/30 transition-all group">
                <div className="w-full aspect-square bg-white/5 rounded-2xl md:rounded-3xl flex items-center justify-center text-4xl md:text-6xl mb-4 md:mb-5 group-hover:scale-105 transition-transform duration-500 shadow-inner overflow-hidden">
                  {p.img}
                </div>
                <h4 className="text-[11px] md:text-sm font-bold text-white mb-1 truncate px-1">{p.name}</h4>
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-5 px-1">
                  <span className="text-sm md:text-xl font-orbitron font-bold text-[#00ff88]">${p.price}</span>
                  <span className="text-[8px] md:text-[10px] text-gray-600 line-through font-mono tracking-tighter">${p.originalPrice}</span>
                </div>
                <button 
                  onClick={() => handleAddProductToCart(p)}
                  className={`w-full py-3 md:py-4 text-[9px] md:text-[10px] font-orbitron font-bold rounded-xl md:rounded-2xl transition-all uppercase tracking-widest ${addedProductId === p.id ? 'bg-[#00ff88] text-black' : 'bg-white/5 border border-white/10 text-white hover:bg-[#00ff88] hover:text-black'}`}
                >
                  {addedProductId === p.id ? '¡Añadido!' : 'Agregar al Carrito'}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ModalContainer>
  );
};
export default OnlineStore;