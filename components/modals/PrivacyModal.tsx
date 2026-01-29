
import React from 'react';

interface PrivacyModalProps {
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-[#050505] border border-white/10 rounded-3xl shadow-[0_0_80px_rgba(255,255,255,0.05)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00d2ff] to-transparent"></div>
        
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
            <h2 className="text-sm font-orbitron font-bold text-white tracking-widest uppercase">Políticas de Privacidad</h2>
            <p className="text-[9px] font-mono text-[#00d2ff] uppercase tracking-tighter mt-1">adalparedes.com – Protocolo de Datos v3.0</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 font-sans text-sm text-gray-300 space-y-6 custom-scrollbar leading-relaxed">
          <div className="bg-[#00d2ff]/5 border border-[#00d2ff]/20 p-4 rounded-xl flex items-center gap-4">
             <span className="text-2xl">🛡️</span>
             <p className="text-[10px] font-mono text-white uppercase tracking-wider leading-tight">
               Última actualización: Enero 2026<br/>
               <span className="text-[#00d2ff]">Contacto oficial: contacto@adalparedes.com</span>
             </p>
          </div>

          <section className="space-y-3">
            <h3 className="text-white font-orbitron font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#00d2ff] rounded-full"></span> 1. Información que recopilamos
            </h3>
            <p className="text-gray-400">Podemos solicitar o recopilar:</p>
            <ul className="grid grid-cols-2 gap-2 text-[11px] font-mono text-gray-300 ml-4">
              <li>• Nombre</li>
              <li>• Correo electrónico</li>
              <li>• Teléfono (opcional)</li>
              <li>• País o zona aproximada</li>
              <li>• Historial básico de uso</li>
              <li>• Datos de transacciones</li>
            </ul>
            <p className="text-xs italic bg-white/5 p-2 rounded">Nota: No recopilamos domicilio físico del usuario.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-orbitron font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#00d2ff] rounded-full"></span> 2. Cómo usamos la información
            </h3>
            <p className="text-gray-400">Utilizamos los datos exclusivamente para:</p>
            <ul className="space-y-1 text-gray-400 list-disc ml-6">
              <li>Administrar cuentas de usuario.</li>
              <li>Procesar pagos o recargas.</li>
              <li>Verificar identidad cuando sea necesario.</li>
              <li>Mejorar la app y experiencia del usuario.</li>
              <li>Prevenir abusos, spam o actividades sospechosas.</li>
            </ul>
            <p className="text-[#00ff88] font-bold text-[10px] uppercase tracking-widest">No vendemos datos a terceros bajo ningún concepto.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-orbitron font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#00d2ff] rounded-full"></span> 3. Almacenamiento y seguridad
            </h3>
            <p className="text-gray-400">Los datos se almacenan con medidas razonables de seguridad digital (encriptación SHA-256). Sin embargo, el usuario reconoce que no existe la seguridad absoluta en entornos digitales contra incidentes de terceros.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-orbitron font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#00d2ff] rounded-full"></span> 4. Terceros y proveedores
            </h3>
            <p className="text-gray-400">Podemos usar servicios externos como: Procesadores de pago (Stripe/NOWPayments), Plataformas de IA (Google/OpenAI), Proveedores de hosting y Herramientas analíticas. Cada proveedor maneja su propia política de privacidad.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-orbitron font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#00d2ff] rounded-full"></span> 5. Correos y notificaciones
            </h3>
            <p className="text-gray-400">El usuario acepta recibir correos de verificación, confirmaciones de pago y avisos importantes de la cuenta. <span className="text-white">No enviamos spam ni publicidad invasiva.</span></p>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-orbitron font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#00d2ff] rounded-full"></span> 6. Conservación de datos
            </h3>
            <p className="text-gray-400">Podemos conservar información incluso después de cerrar una cuenta para cumplir con obligaciones legales, prevenir fraudes o resolver disputas técnicas.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-orbitron font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#00d2ff] rounded-full"></span> 7. Cambios en estas Políticas
            </h3>
            <p className="text-gray-400">Estas políticas pueden actualizarse en cualquier momento. El uso continuo de los servicios de Adal Paredes implica la aceptación automática de las actualizaciones.</p>
          </section>
        </div>

        <div className="p-6 bg-black border-t border-white/5 flex justify-center">
          <button 
            onClick={onClose}
            className="px-12 py-4 bg-[#00d2ff] text-black font-orbitron font-bold text-xs tracking-widest rounded-xl hover:scale-105 transition-all uppercase"
          >
            Confirmar Lectura
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
