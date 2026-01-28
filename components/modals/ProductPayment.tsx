
import React, { useState } from 'react';
import ModalContainer from './ModalContainer';
import { CartItem, useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { initiateStripeCheckout, StripeProductType } from '../../lib/stripe';
import { createNowPaymentsInvoice, PaymentCategory } from '../../lib/nowpayments';

interface ProductPaymentProps {
  onClose: () => void;
  items: CartItem[];
  total: number;
}

const ProductPayment: React.FC<ProductPaymentProps> = ({ onClose, items, total }) => {
  const { user, session } = useAuth();
  const { clearCart } = useCart();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const isPhysicalPurchase = items.some(i => i.type === 'product');

  const handleCheckout = async () => {
    if (!termsAccepted || !selectedMethod || !session?.user) return;
    setIsProcessing(true);

    try {
      if (selectedMethod === 'card') {
        const stripeItems = items.map(item => {
          let itemType: StripeProductType = 'physical_product';
          
          // Lógica de detección de categoría para Stripe
          if (item.id.toString().includes('MEM') || item.name.toLowerCase().includes('plan')) {
            itemType = 'membership';
          } else if (item.id.toString().includes('CRED') || item.id.toString().startsWith('BASE_')) {
            itemType = 'credit_pack';
          } else if (item.id.toString().startsWith('SVC_')) {
            itemType = 'service';
          }

          return {
            id: String(item.id),
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            type: itemType
          };
        });

        await initiateStripeCheckout({ 
          userId: session.user.id, 
          userEmail: session.user.email || '', 
          items: stripeItems 
        });
      } 
      else if (selectedMethod === 'crypto') {
        // Lógica de detección de categoría para NOWPayments
        let category: PaymentCategory = 'merch';
        if (items.some(i => i.id.toString().includes('MEM') || i.name.toLowerCase().includes('plan'))) {
          category = 'membership';
        } else if (items.some(i => i.id.toString().startsWith('SVC_'))) {
          category = 'service';
        } else if (items.some(i => i.type === 'service' || i.id.toString().includes('CRED'))) {
          category = 'credits';
        }

        await createNowPaymentsInvoice({ 
          userId: session.user.id, 
          amount: total, 
          orderId: `TX_${Date.now()}`, 
          orderDescription: items.map(i => i.name).join(', '), 
          category 
        });
      }
      else {
        // Transferencia manual
        setSuccess(true);
        clearCart();
      }
    } catch (e: any) {
      console.error("Checkout Fail:", e);
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ''));
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (success) {
    return (
      <ModalContainer title="Operación Registrada" onClose={onClose}>
        <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in">
          <div className="w-20 h-20 bg-[#00ff88]/10 border-2 border-[#00ff88] rounded-full flex items-center justify-center text-4xl mb-6 shadow-[0_0_30px_rgba(0,255,136,0.3)]">✓</div>
          <h3 className="text-xl font-orbitron font-bold text-white uppercase mb-4 tracking-tighter">Pedido en Búfer de Validación</h3>
          <p className="text-[10px] text-gray-500 font-mono mb-8 uppercase tracking-widest max-w-sm leading-relaxed">
            Tu solicitud de mercancía será validada por el equipo de Adal AI. Envía tu comprobante para iniciar la logística de envío.
          </p>
          <button onClick={onClose} className="px-10 py-4 bg-[#00ff88] text-black font-bold rounded-xl uppercase font-orbitron hover:scale-105 transition-all">Finalizar Protocolo</button>
        </div>
      </ModalContainer>
    );
  }

  return (
    <ModalContainer title={isPhysicalPurchase ? "CHECKOUT MERCANCÍA OFICIAL" : "PASARELA DE PAGO SEGURA"} onClose={onClose}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        
        {/* LADO IZQUIERDO: RESUMEN Y AVISO */}
        <div className="space-y-6">
          <div className="bg-black/40 border border-[#00d2ff]/20 p-8 rounded-[2rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-4xl group-hover:opacity-10 transition-opacity">📦</div>
            <div className="flex items-center gap-2 mb-6">
               <span className="w-2 h-2 bg-[#00d2ff] rounded-full animate-pulse"></span>
               <h4 className="text-[10px] font-mono text-[#00d2ff] uppercase tracking-widest font-bold">Resumen de tu Orden</h4>
            </div>
            
            <div className="space-y-4 max-h-48 overflow-y-auto custom-scrollbar pr-2 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-[11px] border-b border-white/5 pb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.image}</span>
                    <span className="text-gray-400 font-mono uppercase truncate max-w-[140px]">{item.name} x{item.quantity}</span>
                  </div>
                  <span className="text-[#00ff88] font-mono font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-between items-end">
               <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Total a Pagar</span>
               <div className="text-right">
                  <span className="text-4xl font-orbitron font-bold text-white tracking-tighter shadow-sm">${total.toFixed(2)}</span>
                  <p className="text-[8px] text-[#00ff88] font-mono uppercase font-bold mt-1">Sincronización de Pago AES-256</p>
               </div>
            </div>
          </div>

          <div className="p-5 bg-red-500/5 border border-red-500/20 rounded-2xl flex gap-4 items-start relative overflow-hidden group">
             <div className="text-2xl animate-pulse shrink-0">⚠️</div>
             <div className="flex flex-col gap-1 z-10">
               <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Aviso Clientes USA / Internacional:</span>
               <p className="text-[10px] text-gray-300 font-mono leading-relaxed uppercase italic">
                 Para compras de mercancía fuera de México, recomendamos <span className="text-white font-bold">Tarjeta de Crédito</span>. Las transferencias bancarias pueden retrasar la logística de envío de 3 a 5 días hábiles.
               </p>
             </div>
          </div>
        </div>

        {/* LADO DERECHO: OPCIONES DE PAGO */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest px-1">2. Seleccionar Pasarela de Pago</h4>
          
          <div className="grid gap-3">
            <button 
              onClick={() => setSelectedMethod('card')} 
              className={`p-4 border rounded-2xl text-left transition-all flex items-center justify-between group ${selectedMethod === 'card' ? 'border-[#00d2ff] bg-[#00d2ff]/10' : 'border-white/5 bg-black/40 hover:border-white/20'}`}
            >
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-white uppercase">Tarjeta Crédito / Débito</span>
                <span className="text-[8px] text-gray-500 font-mono uppercase">Stripe Global Gateway</span>
              </div>
              <span className="text-2xl group-hover:scale-110 transition-transform">💳</span>
            </button>

            <button 
              onClick={() => setSelectedMethod('crypto')} 
              className={`p-4 border rounded-2xl text-left transition-all flex items-center justify-between group ${selectedMethod === 'crypto' ? 'border-[#f7931a] bg-[#f7931a]/10' : 'border-white/5 bg-black/40 hover:border-white/20'}`}
            >
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-white uppercase">Criptomonedas (Blockchain)</span>
                <span className="text-[8px] text-[#f7931a] font-mono uppercase font-bold animate-pulse">-15% RECOMPENSA</span>
              </div>
              <span className="text-2xl group-hover:scale-110 transition-transform">₿</span>
            </button>

            <div className="space-y-2">
              <button 
                onClick={() => setSelectedMethod('bank_usa')} 
                className={`w-full p-4 border rounded-2xl text-left transition-all flex items-center justify-between group ${selectedMethod === 'bank_usa' ? 'border-[#00d2ff] bg-[#00d2ff]/10' : 'border-white/5 bg-black/40 hover:border-white/20'}`}
              >
                <div className="flex flex-col"><span className="text-[11px] font-bold text-white uppercase">USD USA Wire / ACH</span><span className="text-[8px] text-gray-500 font-mono uppercase">Lead Bank Wire</span></div>
                <span className="text-2xl">🏦</span>
              </button>
              {selectedMethod === 'bank_usa' && (
                <div className="p-5 bg-black/60 border border-[#00d2ff]/30 rounded-2xl space-y-3 animate-in slide-in-from-top-2">
                   {[
                     { l: 'Titular', v: 'Adalberto Paredes Gutierrez' },
                     { l: 'Banco', v: 'Lead Bank' },
                     { l: 'Cuenta', v: '214595020057' },
                     { l: 'ACH', v: '101019644' }
                   ].map(info => (
                     <div key={info.l} className="flex flex-col text-[10px] font-mono">
                       <span className="text-gray-500 uppercase text-[8px]">{info.l}:</span>
                       <button onClick={() => copyToClipboard(info.v, info.l)} className="text-white hover:text-[#00d2ff] font-bold text-left">{copiedField === info.l ? 'COPIADO' : info.v}</button>
                     </div>
                   ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <button 
                onClick={() => setSelectedMethod('bank_mxn')} 
                className={`w-full p-4 border rounded-2xl text-left transition-all flex items-center justify-between group ${selectedMethod === 'bank_mxn' ? 'border-[#00ff88] bg-[#00ff88]/10' : 'border-white/5 bg-black/40 hover:border-white/20'}`}
              >
                <div className="flex flex-col"><span className="text-[11px] font-bold text-white uppercase">Transferencia México (MXN)</span><span className="text-[8px] text-gray-500 font-mono uppercase">SPEI Nu Bank Sync</span></div>
                <span className="text-xl font-bold text-white">MX</span>
              </button>
              {selectedMethod === 'bank_mxn' && (
                <div className="p-5 bg-black/60 border border-[#00ff88]/30 rounded-2xl space-y-3 animate-in slide-in-from-top-2">
                   {[
                     { l: 'Beneficiario', v: 'Adalberto Paredes Gutierrez' },
                     { l: 'CLABE', v: '6381 8000 0113 7662 19' },
                     { l: 'Banco', v: 'NU MÉXICO' }
                   ].map(info => (
                     <div key={info.l} className="flex flex-col text-[10px] font-mono">
                       <span className="text-gray-500 uppercase text-[8px]">{info.l}:</span>
                       <button onClick={() => copyToClipboard(info.v, info.l)} className="text-white hover:text-[#00ff88] font-bold text-left">{copiedField === info.l ? 'COPIADO' : info.v}</button>
                     </div>
                   ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-6 space-y-4">
            <div className="flex items-start gap-3 cursor-pointer group" onClick={() => setTermsAccepted(!termsAccepted)}>
              <div className={`mt-0.5 w-4 h-4 rounded border transition-all flex items-center justify-center ${termsAccepted ? 'bg-[#00ff88] border-[#00ff88]' : 'border-white/20 bg-black'}`}>
                {termsAccepted && <span className="text-black text-[10px] font-bold">✓</span>}
              </div>
              <span className="text-[9px] text-gray-500 uppercase font-mono leading-tight select-none">Acepto los términos de logística y validación de pago.</span>
            </div>
            <button 
              disabled={!selectedMethod || !termsAccepted || isProcessing}
              onClick={handleCheckout}
              className={`w-full py-5 font-orbitron font-bold text-[10px] rounded-2xl uppercase transition-all tracking-[0.2em] shadow-xl ${(!selectedMethod || !termsAccepted || isProcessing) ? 'bg-gray-800 text-gray-600' : 'bg-[#00ff88] text-black hover:bg-white shadow-[0_0_30px_rgba(0,255,136,0.4)]'}`}
            >
              {isProcessing ? 'Sincronizando Orden...' : 'Confirmar Pedido'}
            </button>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default ProductPayment;
