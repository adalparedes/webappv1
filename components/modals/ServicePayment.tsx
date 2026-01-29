import React, { useState } from 'react';
import ModalContainer from './ModalContainer';
import { useAuth } from '../../context/AuthContext';
import { initiateStripeCheckout } from '../../lib/stripe';
import { createNowPaymentsInvoice } from '../../lib/nowpayments';

interface ServicePaymentProps {
  onClose: () => void;
  serviceName: string;
  basePrice: string;
  numericPrice: number;
}

const ServicePayment: React.FC<ServicePaymentProps> = ({ onClose, serviceName, basePrice, numericPrice }) => {
  const { user, session } = useAuth();
  const [method, setMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [step, setStep] = useState<'payment' | 'success'>('payment');

  const discount = 0.10; // 10% por pago de contado
  const finalPrice = numericPrice * (1 - discount);

  const handleProcess = async () => {
    if (!termsAccepted || !method || !session?.user) return;
    setIsProcessing(true);

    const serviceSKU = `SVC_${serviceName.replace(/\s+/g, '_').toUpperCase()}`;

    try {
      if (method === 'card') {
        await initiateStripeCheckout({
          userId: session.user.id,
          userEmail: session.user.email || user?.email || '',
          items: [{ 
            id: serviceSKU,
            type: 'service',
            quantity: 1,
            name: serviceName,
            price: finalPrice
          }]
        });
      } else if (method === 'crypto') {
        await createNowPaymentsInvoice({
          userId: session.user.id,
          amount: finalPrice,
          orderId: `SVC_${Date.now()}`,
          orderDescription: `Contratación: ${serviceName}`,
          category: 'service'
        });
      } else {
        setTimeout(() => {
          setIsProcessing(false);
          setStep('success');
        }, 1500);
      }
    } catch (err) {
      console.error("Payment Error:", err);
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ''));
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (step === 'success') {
    return (
      <ModalContainer title="Operación Registrada" onClose={onClose}>
        <div className="flex flex-col items-center text-center space-y-8 py-10 animate-in zoom-in">
          <div className="w-20 h-20 bg-[#00ff88]/10 border-2 border-[#00ff88] rounded-full flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(0,255,136,0.3)]">✓</div>
          <div className="space-y-2">
            <h3 className="text-xl font-orbitron font-bold text-white uppercase tracking-tighter">Señal de Contrato Recibida</h3>
            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest max-w-sm">
              Tu solicitud de {serviceName} está en búfer. El proceso iniciará tras validar tu comprobante en ap@adalparedes.com.
            </p>
          </div>
          <button onClick={onClose} className="px-10 py-4 bg-[#00ff88] text-black font-bold rounded-xl uppercase font-orbitron">Finalizar</button>
        </div>
      </ModalContainer>
    );
  }

  return (
    <ModalContainer title={`CONTRATACIÓN: ${serviceName.toUpperCase()}`} onClose={onClose}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        
        {/* LADO IZQUIERDO: RESUMEN DE CONTRATO */}
        <div className="space-y-6">
          <div className="bg-black/40 border border-[#00d2ff]/20 p-8 rounded-[2rem] relative overflow-hidden group shadow-[inset_0_0_30px_rgba(0,210,255,0.05)]">
            <div className="absolute top-0 right-0 p-3 bg-[#00ff88] text-black text-[8px] font-bold uppercase z-10">Nodo de Pago Seguro</div>
            
            <div className="flex items-center gap-2 mb-6">
               <span className="w-2 h-2 bg-[#00d2ff] rounded-full animate-pulse"></span>
               <h4 className="text-[10px] font-mono text-[#00d2ff] uppercase tracking-widest font-bold">Configuración de Contrato</h4>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-gray-500 uppercase font-mono">Servicio Seleccionado:</span>
                <span className="text-xl font-orbitron font-bold text-white uppercase tracking-tight">{serviceName}</span>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-bold text-white uppercase">Pago Único (Contado)</span>
                   <span className="text-[9px] bg-[#00ff88] text-black px-2 py-0.5 rounded font-bold">-10% OFF</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                 <span className="text-[10px] font-mono text-gray-400 uppercase">Inversión Final:</span>
                 <div className="text-right">
                    <span className="text-4xl font-orbitron font-bold text-white tracking-tighter shadow-sm">${finalPrice.toFixed(2)}</span>
                    <p className="text-[8px] text-[#00ff88] font-mono uppercase font-bold">USD NETO / ENCRIPTACIÓN AES-256</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="p-5 bg-red-500/5 border border-red-500/20 rounded-2xl flex gap-4 items-start relative overflow-hidden group">
             <div className="text-2xl animate-pulse shrink-0">⚠️</div>
             <div className="flex flex-col gap-1 z-10">
               <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Protocolo Bancario:</span>
               <p className="text-[10px] text-gray-300 font-mono leading-relaxed uppercase italic">
                 Las transferencias internacionales (USD) pueden tardar de 1 a 3 días hábiles en sincronizarse con el Nodo Central.
               </p>
             </div>
          </div>
        </div>

        {/* LADO DERECHO: PASARELA E INSTRUCCIONES */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest px-1">Seleccionar Pasarela</h4>
          
          <div className="grid gap-3">
            {/* TARJETA */}
            <div className="space-y-2">
              <button 
                onClick={() => setMethod('card')}
                className={`w-full p-4 border rounded-2xl text-left transition-all flex items-center justify-between group ${method === 'card' ? 'border-[#00d2ff] bg-[#00d2ff]/10' : 'border-white/5 bg-black/40 hover:border-white/20'}`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">💳</span>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-white uppercase tracking-tight">Tarjeta Crédito / Débito</span>
                    <span className="text-[8px] text-gray-500 font-mono uppercase">Stripe Core Sync</span>
                  </div>
                </div>
              </button>
            </div>

            {/* CRYPTO */}
            <div className="space-y-2">
              <button 
                onClick={() => setMethod('crypto')}
                className={`w-full p-4 border rounded-2xl text-left transition-all flex items-center justify-between group ${method === 'crypto' ? 'border-[#f7931a] bg-[#f7931a]/10' : 'border-white/5 bg-black/40 hover:border-white/20'}`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">₿</span>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-white uppercase tracking-tight">Criptomonedas <span className="text-[8px] bg-[#f7931a] text-black px-1.5 py-0.5 rounded font-bold animate-pulse">-15% REWARD</span></span>
                    <span className="text-[8px] text-gray-500 font-mono uppercase">Red NOWPayments</span>
                  </div>
                </div>
              </button>
            </div>

            {/* USA BANK */}
            <div className="space-y-2">
              <button 
                onClick={() => setMethod('bank_usa')}
                className={`w-full p-4 border rounded-2xl text-left transition-all flex items-center justify-between group ${method === 'bank_usa' ? 'border-[#00d2ff] bg-[#00d2ff]/10' : 'border-white/5 bg-black/40 hover:border-white/20'}`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">🏦</span>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-white uppercase tracking-tight">Transferencia USA (USD)</span>
                    <span className="text-[8px] text-gray-500 font-mono uppercase">Lead Bank ACH / Wire</span>
                  </div>
                </div>
              </button>
              {method === 'bank_usa' && (
                <div className="p-4 bg-black border border-[#00d2ff]/30 rounded-xl space-y-3 animate-in slide-in-from-top-2">
                   {[
                     { label: 'Titular', value: 'Adalberto Paredes Gutierrez' },
                     { label: 'Banco', value: 'Lead Bank' },
                     { label: 'Cuenta', value: '214595020057' },
                     { label: 'Ruta ACH', value: '101019644' }
                   ].map(info => (
                     <div key={info.label} className="flex flex-col text-[9px] font-mono">
                       <span className="text-gray-500 uppercase">{info.label}:</span>
                       <button onClick={() => copyToClipboard(info.value, info.label)} className="text-white hover:text-[#00d2ff] font-bold text-left">
                         {copiedField === info.label ? 'COPIADO' : info.value}
                       </button>
                     </div>
                   ))}
                </div>
              )}
            </div>

            {/* MEXICO BANK */}
            <div className="space-y-2">
              <button 
                onClick={() => setMethod('bank_mxn')}
                className={`w-full p-4 border rounded-2xl text-left transition-all flex items-center justify-between group ${method === 'bank_mxn' ? 'border-[#00ff88] bg-[#00ff88]/10' : 'border-white/5 bg-black/40 hover:border-white/20'}`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">🇲🇽</span>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-white uppercase tracking-tight">Transferencia México (MXN)</span>
                    <span className="text-[8px] text-gray-500 font-mono uppercase">SPEI / Depósito NU</span>
                  </div>
                </div>
              </button>
              {method === 'bank_mxn' && (
                <div className="p-4 bg-black border border-[#00ff88]/30 rounded-xl space-y-3 animate-in slide-in-from-top-2">
                   {[
                     { label: 'Beneficiario', value: 'Adalberto Paredes Gutierrez' },
                     { label: 'CLABE', value: '6381 8000 0113 7662 19' },
                     { label: 'Banco', value: 'NU MÉXICO' }
                   ].map(info => (
                     <div key={info.label} className="flex justify-between items-center text-[9px] font-mono">
                       <span className="text-gray-500 uppercase">{info.label}:</span>
                       <button onClick={() => copyToClipboard(info.value, info.label)} className="text-white hover:text-[#00ff88] font-bold">
                         {copiedField === info.label ? 'COPIADO' : info.value}
                       </button>
                     </div>
                   ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-4 space-y-4">
            <div className="flex items-start gap-3 cursor-pointer group" onClick={() => setTermsAccepted(!termsAccepted)}>
              <div className={`mt-0.5 w-4 h-4 rounded border transition-all flex items-center justify-center ${termsAccepted ? 'bg-[#00ff88] border-[#00ff88]' : 'border-white/20 bg-black'}`}>
                {termsAccepted && <span className="text-black text-[10px] font-bold">✓</span>}
              </div>
              <span className="text-[9px] text-gray-500 uppercase font-mono leading-tight select-none">Acepto los términos y condiciones de contratación.</span>
            </div>
            <button 
              disabled={!method || !termsAccepted || isProcessing}
              onClick={handleProcess}
              className={`w-full py-5 font-orbitron font-bold text-xs rounded-2xl uppercase transition-all tracking-[0.2em] shadow-xl ${(!method || !termsAccepted || isProcessing) ? 'bg-gray-800 text-gray-600' : 'bg-[#00ff88] text-black hover:bg-white shadow-[0_0_30px_rgba(0,255,136,0.3)]'}`}
            >
              {isProcessing ? 'CONECTANDO NODOS...' : 'CONFIRMAR OPERACIÓN'}
            </button>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default ServicePayment;