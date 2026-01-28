import React, { useState, useEffect } from 'react';
import ModalContainer from './ModalContainer';
import { useAuth } from '../../context/AuthContext';
import { CreditPack, applyCreditPack } from '../../lib/credits';
import { supabase } from '../../lib/supabaseClient';
import { createNowPaymentsInvoice } from '../../lib/nowpayments';
import { initiateStripeCheckout } from '../../lib/stripe';

const LoadBalance: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user: authUser, refreshProfile, session } = useAuth();
  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [packs, setPacks] = useState<CreditPack[]>([]);
  const [loadingPacks, setLoadingPacks] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const { data } = await supabase
          .from('credit_packs')
          .select('*')
          .eq('is_active', true) // FIX: Only fetch active packs to prevent purchase errors.
          .order('price_usd', { ascending: true });
        if (data) setPacks(data);
      } finally { 
        setTimeout(() => setLoadingPacks(false), 500); 
      }
    };
    fetchPacks();
  }, []);

  const selectedPack = packs.find(p => p.code === selectedPackId);

  const handleProcessPayment = async () => {
    if (!selectedPackId || !selectedMethod || !termsAccepted || !session?.user?.id || !selectedPack) return;
    setIsProcessing(true);
    setErrorMessage(null);
    
    try {
      if (selectedMethod === 'card') {
        await initiateStripeCheckout({
          userId: session.user.id,
          userEmail: session.user.email || '',
          items: [{ 
            id: selectedPack.code, 
            type: 'credit_pack', 
            quantity: 1,
            name: selectedPack.name,
            price: selectedPack.price_usd
          }]
        });
      } 
      else if (selectedMethod === 'crypto') {
        await createNowPaymentsInvoice({ 
          userId: session.user.id, 
          amount: selectedPack.price_usd, 
          orderId: selectedPack.code, 
          orderDescription: `Recarga ${selectedPack.credits} CR`, 
          category: 'credits' 
        });
      } else {
        await applyCreditPack(session.user.id, selectedPackId, selectedMethod, `TOPUP_${Date.now()}`);
        setPaymentSuccess(true);
      }
    } catch (e: any) {
      setErrorMessage(e.message?.toUpperCase() || "ERROR EN LA TRANSACCIÓN");
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ''));
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (paymentSuccess) {
    return (
      <ModalContainer title="Operación Registrada" onClose={onClose}>
        <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in">
          <div className="w-20 h-20 bg-[#00ff88]/10 border-2 border-[#00ff88] rounded-full flex items-center justify-center text-4xl mb-6 shadow-[0_0_20px_#00ff8844]">✓</div>
          <h3 className="text-xl font-orbitron font-bold text-white uppercase mb-2">Señal Recibida</h3>
          <p className="text-xs text-gray-500 font-mono mb-8 uppercase">Envía tu comprobante a ap@adalparedes.com para validar la inyección de créditos.</p>
          <button onClick={onClose} className="px-10 py-4 bg-[#00ff88] text-black font-bold rounded-xl uppercase font-orbitron hover:scale-105 transition-all">Finalizar Protocolo</button>
        </div>
      </ModalContainer>
    );
  }

  return (
    <ModalContainer title="CARGA DE CRÉDITOS" onClose={onClose}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2 px-1">
             <span className="w-1.5 h-1.5 bg-[#00d2ff] rounded-full animate-pulse"></span>
             <h3 className="text-[10px] font-mono text-gray-500 tracking-widest uppercase font-bold">1. Seleccionar Paquete de Datos</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 relative min-h-[120px]">
            {loadingPacks ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-white/5 border border-white/5 rounded-[2rem] animate-pulse"></div>
              ))
            ) : (
              packs.map((p) => (
                <button 
                  key={p.code} 
                  disabled={isProcessing}
                  onClick={() => setSelectedPackId(p.code)}
                  className={`group border rounded-[2rem] p-6 text-center transition-all ${selectedPackId === p.code ? 'bg-[#00d2ff]/10 border-[#00d2ff] scale-105 shadow-[0_0_25px_rgba(0,210,255,0.2)]' : 'bg-black/20 border-white/5 hover:border-white/20'} ${isProcessing ? 'opacity-50 grayscale' : ''}`}
                >
                  <div className={`text-[9px] font-orbitron font-bold mb-1 uppercase tracking-widest ${selectedPackId === p.code ? 'text-[#00d2ff]' : 'text-gray-500'}`}>{p.name}</div>
                  <div className="text-2xl font-orbitron font-bold text-white tracking-tighter mb-1">${p.price_usd}</div>
                  <div className="text-[10px] font-mono text-[#00ff88] font-bold">+{p.credits} CRED</div>
                </button>
              ))
            )}
          </div>
          <div className="p-6 bg-black/40 border border-white/10 rounded-[2rem] flex items-center justify-between">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Orden actual:</span>
            <span className="text-2xl font-orbitron font-bold text-white tracking-tighter">{selectedPack ? `$${selectedPack.price_usd}` : '$0.00'}</span>
          </div>

          <div className="p-5 bg-red-500/5 border border-red-500/20 rounded-2xl flex gap-4 items-start relative overflow-hidden group">
             <div className="text-2xl animate-pulse shrink-0">⚠️</div>
             <div className="flex flex-col gap-1 z-10">
               <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Aviso para Clientes USA / Internacional:</span>
               <p className="text-[10px] text-gray-300 font-mono leading-relaxed uppercase italic">
                 Se recomienda pagar con <span className="text-white font-bold">Tarjeta o Cripto</span>. Las transferencias internacionales (Wire/ACH) pueden tardar de 1 a 3 días hábiles en reflejarse.
               </p>
             </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 px-1">
             <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse"></span>
             <h3 className="text-[10px] font-mono text-gray-500 tracking-widest uppercase font-bold">2. Pasarela de Pago Seguro</h3>
          </div>
          
          <div className="space-y-3">
            <button 
              disabled={isProcessing}
              onClick={() => setSelectedMethod('card')}
              className={`w-full p-4 border rounded-2xl text-left transition-all flex items-center justify-between group ${selectedMethod === 'card' ? 'border-[#00d2ff] bg-[#00d2ff]/10' : 'border-white/5 bg-black/40 hover:border-white/20'}`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">💳</span>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-white uppercase tracking-tight">Tarjeta Crédito / Débito</span>
                  <span className="text-[8px] text-gray-500 font-mono uppercase tracking-tighter">Vía Stripe SSL / 256-bit Encryption</span>
                </div>
              </div>
            </button>

            <button 
              disabled={isProcessing}
              onClick={() => setSelectedMethod('crypto')}
              className={`w-full p-4 border rounded-2xl text-left transition-all flex items-center justify-between group ${selectedMethod === 'crypto' ? 'border-[#f7931a] bg-[#f7931a]/10' : 'border-white/5 bg-black/40 hover:border-white/20'}`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">₿</span>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-white uppercase tracking-tight">Criptomonedas (Blockchain) <span className="text-[8px] bg-[#f7931a] text-black px-1.5 py-0.5 rounded font-bold animate-pulse">-15% REWARD</span></span>
                  <span className="text-[8px] text-gray-500 font-mono uppercase">NOWPayments / Transacción Anónima</span>
                </div>
              </div>
            </button>

            <div className="space-y-2">
              <button disabled={isProcessing} onClick={() => setSelectedMethod('bank_usa')} className={`w-full p-4 border rounded-2xl text-left transition-all flex items-center justify-between group ${selectedMethod === 'bank_usa' ? 'border-[#00d2ff] bg-[#00d2ff]/10' : 'border-white/5 bg-black/40 hover:border-white/20'}`}>
                <div className="flex items-center gap-4">
                  <span className="text-2xl">🏦</span>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-white uppercase tracking-tight">USD USA Wire / ACH</span>
                    <span className="text-[8px] text-gray-500 font-mono uppercase">Lead Bank Protocol</span>
                  </div>
                </div>
              </button>
              {selectedMethod === 'bank_usa' && (
                <div className="p-5 bg-black/60 border border-[#00d2ff]/30 rounded-2xl space-y-3 animate-in slide-in-from-top-2">
                   {[
                     { l: 'Titular', v: 'Adalberto Paredes Gutierrez' },
                     { l: 'Banco', v: 'Lead Bank' },
                     { l: 'Cuenta', v: '214595020057' },
                     { l: 'ACH', v: '101019644' }
                   ].map(i => (
                     <div key={i.l} className="flex flex-col text-[10px] font-mono">
                       <span className="text-gray-500 uppercase text-[8px]">{i.l}:</span>
                       <button onClick={() => copyToClipboard(i.v, i.l)} className="text-white hover:text-[#00d2ff] font-bold text-left">{copiedField === i.l ? 'COPIADO' : i.v}</button>
                     </div>
                   ))}
                   <p className="text-[8px] text-[#00ff88] font-bold uppercase pt-2 border-t border-white/10">Envío de comprobante: ap@adalparedes.com</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <button disabled={isProcessing} onClick={() => setSelectedMethod('bank_mxn')} className={`w-full p-4 border rounded-2xl text-left transition-all flex items-center justify-between group ${selectedMethod === 'bank_mxn' ? 'border-[#00ff88] bg-[#00ff88]/10' : 'border-white/5 bg-black/40 hover:border-white/20'}`}>
                <div className="flex items-center gap-4">
                   <span className="text-xl font-bold text-white">MX</span>
                   <div className="flex flex-col">
                     <span className="text-[11px] font-bold text-white uppercase tracking-tight">SPEI México (MXN)</span>
                     <span className="text-[8px] text-gray-500 font-mono uppercase">NU Bank Sincronización</span>
                   </div>
                </div>
              </button>
              {selectedMethod === 'bank_mxn' && (
                <div className="p-5 bg-black/60 border border-[#00ff88]/30 rounded-2xl space-y-3 animate-in slide-in-from-top-2">
                   {[
                     { l: 'Beneficiario', v: 'Adalberto Paredes Gutierrez' },
                     { l: 'CLABE', v: '6381 8000 0113 7662 19' },
                     { l: 'Banco', v: 'NU MÉXICO' }
                   ].map(i => (
                     <div key={i.l} className="flex flex-col text-[10px] font-mono">
                       <span className="text-gray-500 uppercase text-[8px]">{i.l}:</span>
                       <button onClick={() => copyToClipboard(i.v, i.l)} className="text-white hover:text-[#00ff88] font-bold text-left">{copiedField === i.l ? 'COPIADO' : i.v}</button>
                     </div>
                   ))}
                   <p className="text-[8px] text-[#00ff88] font-bold uppercase pt-2 border-t border-white/10">Envío de comprobante: ap@adalparedes.com</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-4 space-y-4">
            {errorMessage && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-mono uppercase rounded text-center animate-shake">{errorMessage}</div>}
            <div className="flex items-start gap-3 cursor-pointer group" onClick={() => setTermsAccepted(!termsAccepted)}>
              <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all ${termsAccepted ? 'bg-[#00ff88] border-[#00ff88]' : 'border-white/20 bg-black group-hover:border-[#00ff88]/50'}`}>
                {termsAccepted && <span className="text-black text-[10px] font-bold">✓</span>}
              </div>
              <span className="text-[9px] text-gray-500 uppercase font-mono leading-tight select-none">Acepto los protocolos de seguridad y tiempos de sincronización bancaria.</span>
            </div>

            <button 
              disabled={!selectedPackId || !selectedMethod || !termsAccepted || isProcessing}
              onClick={handleProcessPayment} 
              className={`w-full py-5 font-orbitron font-bold text-xs rounded-2xl uppercase transition-all tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 ${(!selectedPackId || !selectedMethod || !termsAccepted || isProcessing) ? 'bg-gray-800 text-gray-600' : 'bg-[#00ff88] text-black hover:bg-white shadow-[0_0_30px_rgba(0,255,136,0.4)]'}`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Sincronizando...
                </>
              ) : 'CONFIRMAR CARGA'}
            </button>
            <p className="text-[7px] text-gray-500 font-mono uppercase tracking-[0.3em] text-center opacity-40">AES-256 BIT ENCRYPTION ACTIVE</p>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default LoadBalance;