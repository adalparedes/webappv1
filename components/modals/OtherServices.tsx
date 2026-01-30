
import React, { useState } from 'react';
import ModalContainer from './ModalContainer';
import ServicePayment from './ServicePayment';

interface OtherServicesProps {
  onClose: () => void;
  onOpenContact?: () => void;
}

const services = [
  { 
    id: 'web_dev',
    title: 'Web/App Development', 
    price: 'Desde $1,500 USD', 
    numericPrice: 1500,
    icon: '💻',
    tag: 'MÁS POPULAR',
    features: ['React & TS Expert', 'UI/UX Premium', 'Escalabilidad Cloud'] 
  },
  { 
    id: 'consultation',
    title: 'Tech Consultation', 
    price: '$150 USD / Hora', 
    numericPrice: 150,
    icon: '🧠',
    features: ['Optimización de Código', 'Arquitectura de Sistemas', 'Auditoría Técnica'] 
  },
  { 
    id: 'cyber',
    title: 'Cybersecurity Advisory', 
    price: 'A Cotizar', 
    numericPrice: 1200, // Precio base para auditoría
    icon: '🛡️',
    features: ['Pentesting Básico', 'Seguridad en Blockchain', 'Protocolos de Privacidad'] 
  },
];

const OtherServices: React.FC<OtherServicesProps> = ({ onClose, onOpenContact }) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const activeService = services.find(s => s.id === selectedServiceId);

  const handleRequest = () => {
    if (onOpenContact) onOpenContact();
  };

  const handleContratar = () => {
    setShowPayment(true);
  };

  if (showPayment && activeService) {
    return (
      <ServicePayment 
        onClose={() => setShowPayment(false)}
        serviceName={activeService.title}
        basePrice={activeService.price}
        numericPrice={activeService.numericPrice}
      />
    );
  }

  const WebDevDetail = () => (
    <div className="animate-in fade-in zoom-in duration-500 space-y-8">
      <div className="relative p-6 md:p-10 bg-gradient-to-br from-black to-[#00151a] border border-[#00d2ff]/30 rounded-3xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d2ff]/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-block px-3 py-1 bg-[#00d2ff]/10 border border-[#00d2ff]/30 rounded-full text-[9px] font-bold text-[#00d2ff] uppercase tracking-widest mb-4">Arquitectura Digital Premium</div>
            <h3 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-4 uppercase leading-tight">WEB / APP <span className="text-[#00ff88]">DEVELOPMENT</span></h3>
            <p className="text-sm text-gray-400 font-sans leading-relaxed">Desarrollo web y web-apps profesionales en <span className="text-white font-bold">React + TypeScript</span>, optimizadas para velocidad, SEO, seguridad y escalabilidad. Construyo interfaces premium, limpias y modernas enfocadas en convertir visitantes en clientes.</p>
            <p className="text-sm text-gray-400 font-sans leading-relaxed mt-4">Tu proyecto se entrega con código limpio, documentación técnica y soporte post-entrega garantizado.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-2xl">
            <div className="text-[10px] font-mono text-gray-500 uppercase mb-2">Inversión Base</div>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl font-orbitron font-bold text-[#00ff88]">$1,500</span>
              <span className="text-lg font-orbitron text-gray-400 mb-1">— $8,500 USD</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#00d2ff]"><span className="w-1.5 h-1.5 bg-[#00d2ff] rounded-full animate-pulse"></span>FINANCIAMIENTO: 3 Y 6 MESES SIN INTERESES</div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
        <div className="space-y-4">
          <h4 className="text-sm font-orbitron font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">Beneficios de Élite</h4>
          <div className="space-y-4 text-xs">
            <div className="flex gap-3"><span>⚡</span> <span>Velocidad extrema y SEO optimizado.</span></div>
            <div className="flex gap-3"><span>🔗</span> <span>Integraciones avanzadas: pagos, APIs, dashboards.</span></div>
            <div className="flex gap-3"><span>🛡️</span> <span>Seguridad y rendimiento garantizados.</span></div>
            <div className="flex gap-3"><span>📱</span> <span>Versiones móviles perfectas.</span></div>
          </div>
        </div>
        <div className="bg-[#00ff88]/5 border border-[#00ff88]/20 rounded-2xl p-6 relative group/box">
          <h4 className="text-sm font-orbitron font-bold text-[#00ff88] uppercase tracking-widest mb-6">Planes de Financiamiento</h4>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center text-xs text-white"><span>Pago Único (Contado)</span> <span className="text-[#00ff88] font-bold">10% DESCUENTO</span></div>
            <div className="flex justify-between items-center text-xs text-white"><span>3 Meses (33%/33%/34%)</span> <span className="text-[#00d2ff] font-bold">VÍA STRIPE</span></div>
            <div className="flex justify-between items-center text-xs text-white"><span>6 Meses</span> <span className="text-gray-500 uppercase">CONTRATO + HOSTING</span></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleContratar} 
              className="relative py-4 bg-[#00ff88] text-black font-orbitron font-bold text-[10px] tracking-widest uppercase rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)] animate-glow-pulse"
            >
              Contratar Ya
            </button>
            <button onClick={handleRequest} className="py-4 bg-transparent border border-white/20 text-white font-orbitron font-bold text-[10px] tracking-widest uppercase rounded-xl hover:bg-white/5 transition-all">Agendar Consulta</button>
          </div>
        </div>
      </div>
    </div>
  );

  const ConsultationDetail = () => (
    <div className="animate-in fade-in zoom-in duration-500 space-y-8">
      <div className="relative p-6 md:p-10 bg-gradient-to-br from-[#050505] to-[#001015] border border-[#00d2ff]/30 rounded-3xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d2ff]/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-block px-3 py-1 bg-[#00d2ff]/10 border border-[#00d2ff]/30 rounded-full text-[9px] font-bold text-[#00d2ff] uppercase tracking-widest mb-4">Estrategia & Dirección Técnica</div>
            <h3 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-4 uppercase leading-tight">TECH <span className="text-[#00d2ff]">CONSULTATION</span></h3>
            <p className="text-sm text-gray-400 font-sans leading-relaxed">Consultoría técnica especializada para optimizar sistemas, arquitectura, código, infraestructura cloud y automatización. Ideal para negocios que necesitan dirección técnica sin contratar un CTO completo.</p>
            <p className="text-sm text-gray-400 font-sans leading-relaxed mt-4">Análisis, diagnóstico, roadmap de mejoras y acompañamiento estratégico para implementar soluciones reales y medibles.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-2xl">
            <div className="text-[10px] font-mono text-gray-500 uppercase mb-2">Inversión Profesional</div>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl font-orbitron font-bold text-[#00d2ff]">$150</span>
              <span className="text-lg font-orbitron text-gray-400 mb-1">USD / HORA</span>
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-[#00ff88] uppercase tracking-widest">Paquetes Disponibles:</div>
              <div className="flex justify-between text-xs text-gray-300"><span>Pack 5 Horas:</span> <span className="text-white font-bold">$600 USD</span></div>
              <div className="flex justify-between text-xs text-gray-300"><span>Pack 10 Horas:</span> <span className="text-white font-bold">$1,100 USD</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
        <div className="space-y-4">
          <h4 className="text-sm font-orbitron font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">Beneficios del Consultor</h4>
          <div className="space-y-4 text-xs">
            <div className="flex gap-3"><span>📉</span> <span>Reducción de costos operativos y cloud.</span></div>
            <div className="flex gap-3"><span>📈</span> <span>Mejor rendimiento, seguridad y estabilidad.</span></div>
            <div className="flex gap-3"><span>📋</span> <span>Revisión técnica profesional y recomendaciones de alto impacto.</span></div>
          </div>
        </div>
        <div className="bg-[#00d2ff]/5 border border-[#00d2ff]/20 rounded-2xl p-6">
          <h4 className="text-sm font-orbitron font-bold text-[#00d2ff] uppercase tracking-widest mb-6">Planes de Financiamiento</h4>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center text-xs text-white"><span>Hora Individual</span> <span className="text-gray-500 font-bold uppercase">PAGO AL SOLICITAR</span></div>
            <div className="flex justify-between items-center text-xs text-white"><span>Paquetes 5/10 Horas</span> <span className="text-[#00ff88] font-bold">2 O 3 MENSUALIDADES</span></div>
            <div className="flex justify-between items-center text-xs text-white"><span>Financiamiento MSI</span> <span className="text-[#00d2ff] font-bold">HASTA 3 MESES</span></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleContratar} 
              className="py-4 bg-[#00d2ff] text-black font-orbitron font-bold text-[10px] tracking-widest uppercase rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,210,255,0.3)] animate-glow-pulse"
            >
              Contratar Ya
            </button>
            <button onClick={handleRequest} className="py-4 bg-transparent border border-white/20 text-white font-orbitron font-bold text-[10px] tracking-widest uppercase rounded-xl hover:bg-white/5 transition-all">Agendar Sesión</button>
          </div>
        </div>
      </div>
    </div>
  );

  const CyberDetail = () => (
    <div className="animate-in fade-in zoom-in duration-500 space-y-8">
      {/* Rediseño de cabecera: Se cambia el fondo rojo por un elegante Black-Onyx/Cyan con estética de seguridad premium */}
      <div className="relative p-6 md:p-10 bg-gradient-to-br from-[#020617] via-[#0f172a] to-black border border-[#00d2ff]/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,210,255,0.1)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d2ff]/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-block px-3 py-1 bg-red-950/20 border border-red-900/40 rounded-full text-[9px] font-bold text-red-500 uppercase tracking-widest mb-4 animate-pulse">Defensa de Perímetro & Auditoría</div>
            <h3 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-4 uppercase leading-tight">CYBERSECURITY <span className="text-[#00d2ff]">ADVISORY</span></h3>
            <p className="text-sm text-gray-400 font-sans leading-relaxed">Asesoría profesional en ciberseguridad para empresas y plataformas digitales. Evalúo vulnerabilidades, configuraciones críticas y seguridad en servidores, blockchain y aplicaciones.</p>
            <p className="text-sm text-gray-400 font-sans leading-relaxed mt-4">Reporte claro, recomendaciones accionables y acompañamiento para corregir fallos reales antes de ser atacado.</p>
          </div>
          <div className="bg-black/60 backdrop-blur-md border border-white/5 p-6 rounded-2xl shadow-2xl">
            <div className="text-[10px] font-mono text-gray-500 uppercase mb-2">Inversión en Seguridad</div>
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-gray-300"><span>Pentesting Básico:</span> <span className="text-white font-bold">Desde $350 USD</span></div>
              <div className="flex justify-between text-xs text-gray-300"><span>Auditoría Completa:</span> <span className="text-white font-bold">Desde $1,200 USD</span></div>
              <div className="flex justify-between text-xs text-gray-300"><span>Monitoreo Mensual:</span> <span className="text-[#00ff88] font-bold">$150 - $300 USD</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
        <div className="space-y-4">
          <h4 className="text-sm font-orbitron font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">Protección de Datos</h4>
          <div className="space-y-4 text-xs">
            <div className="flex gap-3"><span className="text-red-500">🛡️</span> <span className="text-gray-300">Protección real contra hackeos y filtraciones.</span></div>
            <div className="flex gap-3"><span className="text-red-500">🕵️</span> <span className="text-gray-300">Pruebas de penetración profesionales y éticas.</span></div>
            <div className="flex gap-3"><span className="text-red-500">📊</span> <span className="text-gray-300">Protocolos de privacidad y seguridad de datos.</span></div>
            <div className="flex gap-3"><span className="text-red-500">🆘</span> <span className="text-gray-300">Asistencia premium para incidentes.</span></div>
          </div>
        </div>
        
        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 group">
          <h4 className="text-sm font-orbitron font-bold text-white uppercase tracking-widest mb-6">Planes de Financiamiento</h4>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center text-xs text-white"><span>Proyectos Únicos</span> <span className="text-white/60 font-bold">30% ANTICIPO + 3 PAGOS</span></div>
            <div className="flex justify-between items-center text-xs text-white"><span>Auditorías Grandes</span> <span className="text-[#00ff88] font-bold">HASTA 6 MESES</span></div>
            <div className="flex justify-between items-center text-xs text-white"><span>Soporte Continuo</span> <span className="text-gray-500 font-bold uppercase">MENSUALIDAD FIJA</span></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleContratar} 
              className="relative py-4 bg-[#00ff88] text-black font-orbitron font-bold text-[10px] tracking-widest uppercase rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(0,255,136,0.3)] animate-glow-pulse"
            >
              Contratar Ya
            </button>
            <button onClick={handleRequest} className="py-4 bg-transparent border border-white/10 text-white font-orbitron font-bold text-[10px] tracking-widest uppercase rounded-xl hover:bg-white/5 transition-all">Reportar Incidente</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ModalContainer 
      title={selectedServiceId ? `Servicio: ${services.find(s => s.id === selectedServiceId)?.title}` : "Servicios Profesionales"} 
      onClose={onClose}
    >
      {!selectedServiceId ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((s) => (
              <div 
                key={s.id} 
                onClick={() => setSelectedServiceId(s.id)}
                className={`flex flex-col h-full bg-black/40 border border-white/10 rounded-2xl p-8 hover:border-[#00ff88]/50 transition-all relative overflow-hidden group cursor-pointer ${s.id === 'web_dev' ? 'ring-1 ring-[#00ff88]/20' : ''}`}
              >
                {s.tag && (
                  <div className="absolute top-0 right-0 bg-[#00ff88] text-black text-[8px] font-bold px-3 py-1 uppercase tracking-tighter">
                    {s.tag}
                  </div>
                )}
                
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                  <span className="text-6xl">{s.icon}</span>
                </div>
                
                <h4 className="text-lg font-orbitron font-bold text-[#00d2ff] mb-2">{s.title}</h4>
                <div className="text-white font-mono text-xs mb-6 opacity-60">{s.price}</div>
                
                <ul className="space-y-3 mb-8 flex-1">
                  {s.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-[11px] text-gray-300">
                      <span className="text-[#00ff88]">▸</span> {f}
                    </li>
                  ))}
                </ul>
                
                <button 
                  className="relative w-full py-4 bg-[#00ff88] text-black font-orbitron font-bold text-[10px] tracking-widest uppercase transition-all duration-300 hover:scale-[1.05] active:scale-95 shadow-[0_0_20px_rgba(0,255,136,0.5)] animate-glow-pulse rounded-md z-10"
                >
                  Ver Detalles Premium
                </button>
              </div>
            ))}
          </div>
          
          <div className="pt-8 border-t border-white/5">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-ping"></span>
                <span className="text-xs font-orbitron font-bold text-[#00ff88] uppercase tracking-[0.2em] shadow-[#00ff88]/50 drop-shadow-lg">Slots Limitados Mensuales</span>
              </div>
              <p className="text-[11px] md:text-xs font-mono text-white/80 font-bold uppercase text-center tracking-wider max-w-xl leading-relaxed">
                Para garantizar <span className="text-[#00d2ff]">calidad, satisfacción</span> y <span className="text-[#00ff88]">buenos resultados</span> a todos nuestros clientes.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <button 
            onClick={() => setSelectedServiceId(null)}
            className="absolute -top-12 left-0 text-[10px] font-mono text-gray-500 hover:text-[#00d2ff] transition-colors uppercase tracking-[0.2em] flex items-center gap-2"
          >
            ← Volver a servicios
          </button>
          {selectedServiceId === 'web_dev' && <WebDevDetail />}
          {selectedServiceId === 'consultation' && <ConsultationDetail />}
          {selectedServiceId === 'cyber' && <CyberDetail />}
        </div>
      )}

      <style>{`
        @keyframes glow-pulse {
          0% { box-shadow: 0 0 15px rgba(0, 255, 136, 0.4); transform: scale(1); }
          50% { box-shadow: 0 0 35px rgba(0, 255, 136, 0.8); transform: scale(1.02); }
          100% { box-shadow: 0 0 15px rgba(0, 255, 136, 0.4); transform: scale(1); }
        }
        .animate-glow-pulse {
          animation: glow-pulse 2s infinite ease-in-out;
        }
      `}</style>
    </ModalContainer>
  );
};

export default OtherServices;
