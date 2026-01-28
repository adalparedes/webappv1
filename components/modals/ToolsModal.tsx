
import React, { useState } from 'react';
import ModalContainer from './ModalContainer';
import { User } from '../../types';

interface ToolsModalProps {
  user: User;
  onClose: () => void;
  onUpgrade: () => void;
}

const TOOL_ITEMS = [
  {
    id: 'virus_scan',
    title: 'VirusTotal Node',
    description: 'Analiza archivos sospechosos en busca de malware y troyanos usando el motor central de VirusTotal API.',
    icon: '🛡️',
    status: 'BETA_ACTIVE',
    color: '#ef4444',
    action: 'Subir Archivo para Análisis'
  },
  {
    id: 'ip_lookup',
    title: 'Spamhaus IP Intel',
    description: 'Verifica si una IP está reportada por actividades de spam, botnet o phishing en bases globales.',
    icon: '🌐',
    status: 'READY',
    color: '#3b82f6',
    action: 'Verificar Reputación IP'
  },
  {
    id: 'tel_spam',
    title: 'Tel-Spam Registry',
    description: 'Consulta y reporta números telefónicos asociados a estafas, extorsión o telemarketing agresivo.',
    icon: '📞',
    status: 'COMMUNITY_DRIVEN',
    color: '#f59e0b',
    action: 'Consultar Número de Abuso'
  }
];

const ToolsModal: React.FC<ToolsModalProps> = ({ user, onClose, onUpgrade }) => {
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const isAccessDenied = user.membership === 'FREE';

  const handleToolAction = () => {
    if (!inputValue && selectedToolId !== 'virus_scan') return;
    
    setIsProcessing(true);
    setResult(null);
    
    // Simulación de interacción con API (Demo Content)
    setTimeout(() => {
      setIsProcessing(false);
      const randomScore = (Math.random() * 10).toFixed(1);
      const isDangerous = parseFloat(randomScore) > 7;
      
      let report = "";
      if (selectedToolId === 'virus_scan') {
        report = `REPORTE: Archivo analizado por 64 motores. 0 detecciones encontradas. El archivo parece seguro para ejecución en entorno local.`;
      } else if (selectedToolId === 'ip_lookup') {
        report = `INTEL: La IP ${inputValue} no figura en las listas negras actuales de Spamhaus (SBL/XBL). Reputación: EXCELENTE.`;
      } else {
        report = `REGISTRO: El número ${inputValue} tiene 12 reportes previos de "Telemarketing Agresivo". Se recomienda precaución al contestar.`;
      }
      
      setResult(report);
    }, 2000);
  };

  if (isAccessDenied) {
    return (
      <ModalContainer title="Acceso Restringido" onClose={onClose}>
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-8 animate-in fade-in zoom-in duration-500">
           <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative w-24 h-24 bg-red-500/10 border-2 border-red-500/30 rounded-full flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(239,68,68,0.2)]">
                🚫
              </div>
           </div>
           <div className="max-w-md space-y-4">
              <h3 className="text-2xl font-orbitron font-bold text-white uppercase tracking-tight">Privilegios Insuficientes</h3>
              <p className="text-sm text-gray-500 font-mono leading-relaxed uppercase">
                La sección de <span className="text-red-500 font-bold">Cyber-Tools</span> está reservada para usuarios con Plan Novato, Jefe o Rey.
              </p>
           </div>
           <button 
            onClick={onUpgrade}
            className="px-10 py-4 bg-white text-black font-orbitron font-bold text-xs rounded-xl hover:bg-[#00d2ff] transition-all shadow-2xl uppercase tracking-widest"
           >
             Elevar Rango de Miembro
           </button>
           <p className="text-[9px] text-gray-700 font-mono uppercase">Protocolo de seguridad activo para nivel: {user.membership}</p>
        </div>
      </ModalContainer>
    );
  }

  const selectedTool = TOOL_ITEMS.find(t => t.id === selectedToolId);

  return (
    <ModalContainer title="Cyber-Toolbox // Diagnóstico IT" onClose={onClose}>
      {!selectedToolId ? (
        <div className="space-y-8">
          <div className="p-4 bg-[#00d2ff]/5 border border-[#00d2ff]/20 rounded-2xl">
            <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest text-center">
              Herramientas de diagnóstico profesional para seguridad y redes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {TOOL_ITEMS.map((tool) => (
              <div 
                key={tool.id}
                onClick={() => setSelectedToolId(tool.id)}
                className="group bg-black/40 border border-white/5 rounded-3xl p-6 hover:border-[#00d2ff]/40 transition-all cursor-pointer flex flex-col h-full relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-3 bg-white/5 text-[8px] font-mono text-gray-500 uppercase tracking-widest">
                  {tool.status}
                </div>
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{tool.icon}</div>
                <h4 className="text-sm font-orbitron font-bold text-white mb-2 uppercase tracking-tight">{tool.title}</h4>
                <p className="text-[10px] text-gray-500 font-mono mb-8 leading-relaxed flex-1 uppercase">{tool.description}</p>
                <button 
                  className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono text-white hover:bg-white hover:text-black transition-all uppercase tracking-widest"
                >
                  Ejecutar Nodo
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="animate-in slide-in-from-right duration-300 space-y-8">
           <button 
             onClick={() => { setSelectedToolId(null); setResult(null); setInputValue(''); }} 
             className="text-[10px] font-mono text-gray-500 hover:text-white uppercase tracking-widest flex items-center gap-2 mb-4"
           >
             ← Volver al Toolbox de Seguridad
           </button>

           <div className="bg-black/60 border border-white/10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-5 text-9xl pointer-events-none">{selectedTool?.icon}</div>
              <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto space-y-8">
                 <div className="space-y-2">
                    <h3 className="text-2xl font-orbitron font-bold text-white uppercase tracking-tighter">{selectedTool?.title}</h3>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-tight">{selectedTool?.description}</p>
                 </div>

                 <div className="w-full space-y-4">
                    {selectedTool?.id === 'virus_scan' ? (
                      <div className="w-full h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-[#00d2ff]/40 cursor-pointer transition-all bg-white/5">
                        <span className="text-2xl">📁</span>
                        <span className="text-[10px] font-mono text-gray-500 uppercase">Seleccionar archivo sospechoso</span>
                      </div>
                    ) : (
                      <input 
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={selectedTool?.id === 'ip_lookup' ? 'Ingrese IP (Ej: 185.23.102.1)' : 'Ingrese Número (Ej: +52 ...)'}
                        className="w-full bg-black border border-white/10 rounded-2xl p-5 text-sm text-white focus:border-[#00d2ff] outline-none font-mono placeholder:text-gray-700"
                      />
                    )}
                    
                    <button 
                      onClick={handleToolAction}
                      disabled={isProcessing}
                      className="w-full py-5 bg-[#00d2ff] text-black font-orbitron font-bold text-xs rounded-2xl hover:bg-white transition-all shadow-[0_0_30px_rgba(0,210,255,0.3)] uppercase tracking-[0.2em] disabled:opacity-20"
                    >
                      {isProcessing ? 'Sincronizando con Servidores...' : selectedTool?.action}
                    </button>
                 </div>

                 {result && (
                   <div className="w-full p-6 bg-[#00ff88]/5 border border-[#00ff88]/20 rounded-2xl text-[11px] font-mono text-[#00ff88] animate-in zoom-in duration-300 text-left">
                     <div className="flex items-center gap-2 mb-3 font-bold uppercase tracking-widest text-[9px]">
                       <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-ping"></span> Reporte de Diagnóstico v1.0
                     </div>
                     <p className="leading-relaxed opacity-90 uppercase tracking-tighter">{result}</p>
                     <div className="mt-4 pt-4 border-t border-[#00ff88]/10 text-[8px] text-gray-600 flex justify-between">
                       <span>REF: AP_CORE_SEC</span>
                       <span>STATUS: VERIFIED</span>
                     </div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </ModalContainer>
  );
};

export default ToolsModal;
