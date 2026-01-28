import React, { useState } from 'react';
import ModalContainer from './ModalContainer';
import { useAuth } from '../../context/AuthContext';
import { initiateStripeCheckout } from '../../lib/stripe';
import { createNowPaymentsInvoice } from '../../lib/nowpayments';

interface MembershipModalProps {
  onClose: () => void;
  currentBalance: number;
}

const MembershipModal: React.FC<MembershipModalProps> = ({ onClose, currentBalance }) => {
  const { user, session, refreshProfile } = useAuth();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [step, setStep] = useState<'selection' | 'success'>('selection');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const plans = [
    { 
      id: 'FREE', 
      name: 'Plan Piojoso', 
      price: 0, 
      icon: '🪳',
      type: 'Gratis',
      includes: [
        '15–20 mensajes mensuales (Modelo económico)',
        'Módulo "Preguntas Básicas" (Tecnología general)',
        '2 consultas Cripto informativas al mes',
        'Acceso limitado a comunidad (Canal público)'
      ],
      excludes: [
        'Módulos Premium (Crypto Pro, Hacking, Código Pro)',
        'Créditos para la tienda',
        'Mensajes prioritarios',
        'Historial de conversación extendido'
      ]
    },
    { 
      id: 'NOVATO', 
      name: 'Plan Novato / Novata', 
      price: 19.99, 
      icon: '🐣',
      type: 'Anual',
      includes: [
        '150–200 mensajes AI/mes (Modelo Estándar)',
        'Badge "NOVATO VERIFIED" en perfil',
        'Historial Extendido (30 conversaciones)',
        'Acceso a Discord (Área Privada Novatos)',
        'Prompts Premium pre-armados',
        'Soporte por email (48–72 horas)'
      ],
      modules: [
        'Crypto Novice: Estrategias y Riesgos',
        'Tech Fix Novice: Reparación y Software',
        'Code Helper: JavaScript/Python Básico'
      ],
      credits: '5 créditos mensuales para análisis especiales.'
    },
    { 
      id: 'JEFE', 
      name: 'Plan Jefe / Patrona', 
      price: 49.99, 
      icon: '💼', 
      type: 'Anual',
      includes: [
        '1000 mensajes AI/mes (Modelo Avanzado GPT-4.1+)',
        'Soporte PRIORITARIO (24-48 horas)',
        '1 Consulta mensual "Deep Analysis AI"',
        'Acceso Completo Servidor VIP Discord',
        'Badge JEFE / PATRONA & Historial Ilimitado',
        'Acceso anticipado a funciones & 10% OFF Tienda'
      ],
      modules: [
        'Crypto Pro: Señales Educativas & Análisis',
        'Hacking Ético / Seguridad: Guías & Auditoría',
        'Emprendimiento, Finanzas & Marketing AI',
        'Code Pro: React, TS, Python Avanzado'
      ],
      credits: '25 créditos mensuales para análisis AI.'
    },
    { 
      id: 'PREMIUM', 
      name: 'Plan Rey / Reina', 
      price: 99.00, 
      icon: '👑', 
      type: 'Anual',
      includes: [
        'Mensajes ILIMITADOS (Fair Use Policy)',
        '25% OFF en toda la Tienda Digital',
        '1 Videollamada anual (20 min) o Análisis Pro',
        'Acceso al canal REY/REINA VIP en Discord',
        'Badge Especial Corona & Prioridad Máxima',
        'Pack Anual Regalo: Prompts Premium & Scripts'
      ],
      modules: [
        'AI Trading Insights (Nivel Educativo)',
        'Hacking Ético Avanzado (Histórico/Educativo)',
        'Empresarial & Startups Elite',
        'Proyectos Privados / Plantillas PRO'
      ],
      credits: '100 créditos mensuales para análisis AI Avanzados.'
    },
  ];

  const selectedPlan = plans.find(p => p.id === selectedPlanId);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ''));
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConfirmUpgrade = async () => {
    if (!selectedPlan || !paymentMethod || !termsAccepted || !session?.user) return;
    setIsProcessing(true);

    try {
      if (paymentMethod === 'card') {
        await initiateStripeCheckout({
          userId: session.user.id,
          userEmail: session.user.email || '',
          items: [{ 
            id: selectedPlan.id, 
            type: 'membership', 
            quantity: 1,
            name: selectedPlan.name,
            price: selectedPlan.price
          }]
        });
      } 
      else if (paymentMethod === 'crypto') {
        await createNowPaymentsInvoice({
          userId: session.user.id,
          amount: selectedPlan.price,
          orderId: `UPGRADE_${selectedPlan.id}`,
          orderDescription: `Membresía ${selectedPlan.name}`,
          category: 'membership'
        });
      }
      else {
        setTimeout(() => {
          setIsProcessing(false);
          setStep('success');
        }, 2000);
      }
    } catch (err: any) {
      alert(err.message?.toUpperCase());
      setIsProcessing(false);
    }
  };

  if (step === 'success') {
    return (
      <ModalContainer title="Operación Registrada" onClose={onClose}>
        <div className="py-16 text-center animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-[#00ff88]/10 border-2 border-[#00ff88] rounded-full flex items-center justify-center text-4xl mb-6 mx-auto shadow-[0_0_30px_rgba(0,255,136,0.3)]">✓</div>
          <h3 className="text-2xl font-orbitron font-bold text-white uppercase mb-4 tracking-tighter">Sincronización de Rango</h3>
          <p className="text-xs text-gray-500 font-mono mb-8 uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
            Tu solicitud de Upgrade ha sido recibida. El rango se activará tras validar tu comprobante en <span className="text-white">ap@adalparedes.com</span>.
          </p>
          <button onClick={onClose} className="px-12 py-4 bg-[#00ff88] text-black font-bold rounded-xl uppercase font-orbitron tracking-widest hover:scale-105 transition-all">Finalizar Protocolo</button>
        </div>
      </ModalContainer>
    );
  }

  return (
    <ModalContainer title="GESTIÓN DE MEMBRESÍA" onClose={onClose}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12">
        {/* Columna Izquierda: Selección de Planes */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-2 px-1">
            <span className="w-1.5 h-1.5 bg-[#00d2ff] rounded-full animate-pulse"></span>
            <h3 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">1. Seleccionar Nivel de Enlace</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plans.map((p) => (
              <button 
                key={p.id}
                onClick={() => setSelectedPlanId(p.id)}
                className={`group p-5 border rounded-[2rem] text-left transition-all relative overflow-hidden ${selectedPlanId === p.id ? (p.id === 'PREMIUM' ? 'bg-[#ffcc00]/10 border-[#ffcc00] shadow-[0_0_30px_rgba(255,204,0,0.15)]' : 'bg-[#00d2ff]/10 border-[#00d2ff] shadow-[0_0_30px_rgba(0,210,255,0.15)]') : 'bg-black/40 border-white/5 hover:border-white/20'}`}
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{p.icon}</div>
                <h4 className={`font-bold uppercase text-[10px] mb-1 ${selectedPlanId === p.id ? (p.id === 'PREMIUM' ? 'text-[#ffcc00]' : 'text-[#00d2ff]') : 'text-white'}`}>{p.name}</h4>
                <div className="text-xl font-orbitron font-bold text-white tracking-tighter">${p.price} <span className="text-[8px] opacity-40">/ {p.id === 'FREE' ? 'Gratis' : 'Año'}</span></div>
                {selectedPlanId === p.id && <div className={`absolute top-2 right-4 w-1.5 h-1.5 rounded-full animate-ping ${p.id === 'PREMIUM' ? 'bg-[#ffcc00]' : 'bg-[#00d2ff]'}`}></div>}
              </button>
            ))}
          </div>

          {/* Detalle Dinámico */}
          {selectedPlan && (
            <div className={`p-6 border rounded-[2.5rem] animate-in slide-in-from-left-4 duration-500 ${selectedPlan.id === 'PREMIUM' ? 'bg-gradient-to-br from-[#ffcc00]/5 to-transparent border-[#ffcc00]/20' : 'bg-white/5 border-white/10'}`}>
               <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">
                  <h4 className={`text-[11px] font-orbitron font-bold uppercase tracking-widest ${selectedPlan.id === 'PREMIUM' ? 'text-[#ffcc00]' : 'text-white'}`}>
                    Expediente: {selectedPlan.name}
                  </h4>
                  <span className={`text-[10px] font-mono font-bold ${selectedPlan.id === 'PREMIUM' ? 'text-[#ffcc00]' : 'text-[#00ff88]'}`}>
                    {selectedPlan.id === 'FREE' ? 'NODO GRATUITO' : `$${selectedPlan.price.toFixed(2)}`}
                  </span>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-4">
                   <div className="space-y-2">
                     <span className={`text-[9px] font-bold uppercase tracking-widest block ${selectedPlan.id === 'PREMIUM' ? 'text-[#ffcc00]' : 'text-[#00ff88]'}`}>Privilegios de Élite:</span>
                     <ul className="space-y-1.5">
                       {selectedPlan.includes?.map(item => (
                         <li key={item} className="text-[9px] text-gray-300 font-mono flex gap-2">
                           <span className={selectedPlan.id === 'PREMIUM' ? 'text-[#ffcc00]' : 'text-[#00ff88]'}>✓</span> {item}
                         </li>
                       ))}
                     </ul>
                   </div>
                   {selectedPlan.credits && (
                     <div className="space-y-2">
                        <span className={`text-[9px] font-bold uppercase tracking-widest block ${selectedPlan.id === 'PREMIUM' ? 'text-[#ffcc00]' : 'text-[#00d2ff]'}`}>Inyección Mensual:</span>
                        <p className="text-[9px] text-gray-400 font-mono italic leading-tight">{selectedPlan.credits}</p>
                     </div>
                   )}
                 </div>

                 <div className="space-y-4">
                   {selectedPlan.id === 'FREE' ? (
                     <div className="space-y-2">
                       <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest block">Restricciones:</span>
                       <ul className="space-y-1.5">
                         {selectedPlan.includes?.map(item => (
                           <li key={item} className="text-[9px] text-gray-600 font-mono flex gap-2 line-through">
                             <span className="text-red-500">×</span> {item}
                           </li>
                         ))}
                       </ul>
                     </div>
                   ) : (selectedPlan.id === 'NOVATO' || selectedPlan.id === 'JEFE' || selectedPlan.id === 'PREMIUM') ? (
                     <div className="space-y-2">
                        <span className={`text-[9px] font-bold uppercase tracking-widest block ${selectedPlan.id === 'PREMIUM' ? 'text-[#ffcc00]' : 'text-[#a855f7]'}`}>Módulos Desbloqueados:</span>
                        <ul className="space-y-1.5">
                          {selectedPlan.modules?.map(mod => (
                            <li key={mod} className="text-[9px] text-gray-300 font-mono flex gap-2">
                              <span className={selectedPlan.id === 'PREMIUM' ? 'text-[#ffcc00]' : 'text-[#a855f7]'}>▸</span> {mod}
                            </li>
                          ))}
                        </ul>
                     </div>
                   ) : null}
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* Columna Derecha: Pasarela */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 px-1">
            <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse"></span>
            <h3 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">2. Pasarela de Pago Seguro</h3>
          </div>

          <div className="bg-black/60 p-5 rounded-[2.5rem] border border-white/10 space-y-3 shadow-2xl">
            <div className="grid gap-2">
              <button onClick={() => setPaymentMethod('card')} className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between group transition-all ${paymentMethod === 'card' ? 'border-[#00d2ff] bg-[#00d2ff]/10' : 'border-white/5 bg-black/40 hover:border-white/20'}`}>
                <div className="flex flex-col"><span className="text-[10px] uppercase font-bold text-white">Tarjeta Débito/Crédito</span><span className="text-[8px] uppercase text-gray-500 font-mono">Stripe Secure SSL</span></div>
                <span className="text-xl">💳</span>
              </button>

              <button onClick={() => setPaymentMethod('crypto')} className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between group transition-all ${paymentMethod === 'crypto' ? 'border-[#f7931a] bg-[#f7931a]/10' : 'border-white/5 bg-black/40 hover:border-white/20'}`}>
                <div className="flex flex-col"><span className="text-[10px] uppercase font-bold text-white">Criptomonedas (Blockchain)</span><span className="text-[8px] uppercase text-[#f7931a] font-mono font-bold animate-pulse">-15% REWARD</span></div>
                <span className="text-xl">₿</span>
              </button>

              <div className="space-y-2">
                <button onClick={() => setPaymentMethod('bank_usa')} className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between group transition-all ${paymentMethod === 'bank_usa' ? 'border-[#00d2ff] bg-[#00d2ff]/10' : 'border-white/5 bg-black/40 hover:border-white/20'}`}>
                  <div className="flex flex-col"><span className="text-[10px] uppercase font-bold text-white">USD USA Wire / ACH</span><span className="text-[8px] uppercase text-gray-500 font-mono">Lead Bank Protocol</span></div>
                  <span className="text-xl">🏦</span>
                </button>
                {paymentMethod === 'bank_usa' && (
                  <div className="p-4 bg-black border border-[#00d2ff]/30 rounded-xl space-y-3 animate-in slide-in-from-top-2">
                     {[ { l: 'Titular', v: 'Adalberto Paredes Gutierrez' }, { l: 'Banco', v: 'Lead Bank' }, { l: 'Cuenta', v: '214595020057' }, { l: 'ACH', v: '101019644' }].map(i => (
                       <div key={i.l} className="flex justify-between items-center text-[9px] font-mono">
                         <span className="text-gray-500 uppercase">{i.l}:</span>
                         <button onClick={() => copyToClipboard(i.v, i.l)} className="text-white hover:text-[#00d2ff] font-bold">{copiedField === i.l ? 'COPIADO' : i.v}</button>
                       </div>
                     ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <button onClick={() => setPaymentMethod('bank_mxn')} className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between group transition-all ${paymentMethod === 'bank_mxn' ? 'border-[#00ff88] bg-[#00ff88]/10' : 'border-white/5 bg-black/40 hover:border-white/20'}`}>
                  <div className="flex flex-col"><span className="text-[10px] uppercase font-bold text-white">SPEI México (MXN)</span><span className="text-[8px] uppercase text-gray-500 font-mono">NU Bank / Local Sync</span></div>
                  <span className="text-[11px] font-bold text-white">MX</span>
                </button>
                {paymentMethod === 'bank_mxn' && (
                  <div className="p-4 bg-black border border-[#00ff88]/30 rounded-xl space-y-3 animate-in slide-in-from-top-2">
                     {[ { l: 'Beneficiario', v: 'Adalberto Paredes Gutierrez' }, { l: 'CLABE', v: '6381 8000 0113 7662 19' }, { l: 'Banco', v: 'NU MÉXICO' } ].map(i => (
                       <div key={i.l} className="flex justify-between items-center text-[9px] font-mono">
                         <span className="text-gray-500 uppercase">{i.l}:</span>
                         <button onClick={() => copyToClipboard(i.v, i.l)} className="text-white hover:text-[#00ff88] font-bold">{copiedField === i.l ? 'COPIADO' : i.v}</button>
                       </div>
                     ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 space-y-4">
              <div className="flex items-start gap-3 cursor-pointer group" onClick={() => setTermsAccepted(!termsAccepted)}>
                <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all ${termsAccepted ? 'bg-[#00ff88] border-[#00ff88]' : 'border-white/20 bg-black group-hover:border-[#00ff88]/50'}`}>
                  {termsAccepted && <span className="text-black text-[10px] font-bold">✓</span>}
                </div>
                <span className="text-[9px] uppercase text-gray-500 font-mono leading-tight select-none">Confirmar upgrade y aceptar protocolos.</span>
              </div>
              
              <button 
                disabled={!selectedPlanId || !paymentMethod || !termsAccepted || isProcessing}
                onClick={handleConfirmUpgrade}
                className={`w-full py-5 font-orbitron font-bold text-[10px] rounded-2xl uppercase shadow-lg transition-all tracking-widest ${(!selectedPlanId || !paymentMethod || !termsAccepted || isProcessing) ? 'bg-gray-800 text-gray-600' : (selectedPlanId === 'PREMIUM' ? 'bg-[#ffcc00] text-black shadow-[0_0_30px_rgba(255,204,0,0.3)]' : 'bg-[#00ff88] text-black shadow-[0_0_30px_rgba(0,255,136,0.3)]')}`}
              >
                {isProcessing ? 'Sincronizando...' : selectedPlanId ? `ADQUIRIR ${selectedPlan.name}` : 'ADQUIRIR RANGO'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default MembershipModal;