
import React from 'react';

interface TermsModalProps {
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-[#00d2ff]/30 rounded-3xl shadow-[0_0_80px_rgba(0,210,255,0.2)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00d2ff] via-white to-[#00d2ff]"></div>
        
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
            <h2 className="text-sm font-orbitron font-bold text-white tracking-widest uppercase">Términos y Condiciones</h2>
            <p className="text-[9px] font-mono text-[#00d2ff] uppercase tracking-tighter mt-1">adalparedes.com – Enero 2026</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 font-sans text-sm text-gray-300 space-y-6 custom-scrollbar leading-relaxed">
          <p className="font-mono text-[11px] text-[#00ff88] uppercase tracking-wide bg-[#00ff88]/5 p-3 border border-[#00ff88]/20 rounded-lg">
            Contacto oficial: contacto@adalparedes.com
          </p>
          
          <p>
            Bienvenido a <strong>adalparedes.com</strong>, una plataforma digital interactiva que permite a los usuarios utilizar diferentes modelos de inteligencia artificial, comparar resultados, adquirir créditos, membresías y/o productos digitales o físicos.
          </p>
          
          <p>Al acceder o utilizar este sitio web y la web-app, usted acepta los presentes Términos y Condiciones. Si no está de acuerdo, le recomendamos no utilizar el servicio.</p>

          <section className="space-y-3">
            <h3 className="text-[#00d2ff] font-orbitron font-bold text-xs uppercase tracking-widest">1. Naturaleza del Servicio</h3>
            <p>adalparedes.com es una plataforma tecnológica que permite: consultar, probar y comparar resultados de distintos modelos de IA; comprar créditos digitales para usar herramientas específicas; adquirir membresías con beneficios adicionales; y comprar mercancía física (merch).</p>
            <p className="italic text-[12px]">El sitio no ofrece asesoría profesional, financiera, médica o legal. El uso es únicamente informativo y recreativo.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-[#00d2ff] font-orbitron font-bold text-xs uppercase tracking-widest">2. Cuentas de Usuario</h3>
            <p>Nos reservamos el derecho de suspender, bloquear o eliminar cuentas que violen estos términos. Los motivos incluyen abuso del sistema, manipulación de la IA, solicitudes ilegales u obscenas, o intentos de mal uso para entrenar modelos externos.</p>
            <p className="text-red-400 font-bold uppercase text-[10px]">Si una cuenta es baneada por abuso, no estamos obligados a reembolsar créditos o membresías.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-[#00d2ff] font-orbitron font-bold text-xs uppercase tracking-widest">3. Créditos y Saldo</h3>
            <p>Tiempo de procesamiento: de 1 a 30 días para que el saldo se refleje. Los créditos no tienen valor monetario fuera del sitio, no son transferibles y no garantizan resultados específicos.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-[#00d2ff] font-orbitron font-bold text-xs uppercase tracking-widest">4. Membresías</h3>
            <p>Los precios pueden cambiar en cualquier momento, pero no afectará a quienes ya hayan comprado un plan previo. Cambios futuros aplicarán únicamente a nuevas compras.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-[#00d2ff] font-orbitron font-bold text-xs uppercase tracking-widest">5. Procesamiento de Pagos</h3>
            <p>Aceptamos tarjetas, transferencias (USA/MX) y Criptomonedas. Los pagos por transferencia pueden tardar 1 a 24 horas; pagos vía crypto o tarjeta usualmente son instantáneos.</p>
          </section>

          <section className="space-y-3 border-l-2 border-red-500/50 pl-4 bg-red-500/5 py-2">
            <h3 className="text-red-500 font-orbitron font-bold text-xs uppercase tracking-widest">6. Reembolsos</h3>
            <p>Los reembolsos NO están garantizados. En caso de solicitarlo, la respuesta puede tardar 50 a 90 días y se evalúa internamente. No se otorgan reembolsos por uso indebido, baneo de cuenta o resultados de IA no deseados.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-[#00d2ff] font-orbitron font-bold text-xs uppercase tracking-widest">7. Merchandising (Productos Físicos)</h3>
            <p>Tiempo de envío: 30 a 60 días. Reembolsos por mercancía: 80 a 120 días, dependiendo del caso. No se garantiza stock constante ni envíos inmediatos.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-[#00d2ff] font-orbitron font-bold text-xs uppercase tracking-widest">8. Cambios en los Términos</h3>
            <p>adalparedes.com puede modificar estos términos en cualquier momento. El uso continuo del sitio implica aceptación automática.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-[#00d2ff] font-orbitron font-bold text-xs uppercase tracking-widest">9. Limitación de Responsabilidad</h3>
            <p>El usuario reconoce que los resultados de IA pueden contener errores. adalparedes.com no se hace responsable por pérdidas económicas, daños indirectos o fallas técnicas de terceros.</p>
          </section>

          <section className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-[10px] text-center font-mono uppercase tracking-tighter">
              Al interactuar con el portal, usted confirma que ha leído y aceptado estos protocolos de operación digital.
            </p>
          </section>
        </div>

        <div className="p-6 bg-black border-t border-white/5 flex justify-center">
          <button 
            onClick={onClose}
            className="px-12 py-4 bg-white text-black font-orbitron font-bold text-xs tracking-widest rounded-xl hover:scale-105 transition-all uppercase"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
