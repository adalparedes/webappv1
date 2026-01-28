import React, { useState } from 'react';
import ModalContainer from './ModalContainer';

interface PersonalizationModalProps {
  config: any;
  onClose: () => void;
  onSave: (config: any) => void;
}

const PersonalizationModal: React.FC<PersonalizationModalProps> = ({ config, onClose, onSave }) => {
  const [localConfig, setLocalConfig] = useState(config);
  
  const roles = [
    { id: 'Estilo Original del Modelo', label: 'CLÁSICO', desc: 'Respuesta original, directa del modelo.' },
    { id: 'Hacker de élite', label: 'ELITE HACKER', desc: 'Estilo cyber-punk y directo.' },
    { id: 'Compañero creativo', label: 'CREATIVO', desc: 'Enfoque en ideas y brainstorming.' },
  ];

  const allLangs = [
    { id: 'Español (México)', label: 'ESPAÑOL', icon: 'MX' },
    { id: 'English (US)', label: 'ENGLISH', icon: 'US' },
    { id: 'French', label: 'FRANCÉS', icon: 'FR' },
    { id: 'German', label: 'ALEMÁN', icon: 'DE' },
    { id: 'Italian', label: 'ITALIANO', icon: 'IT' },
    { id: 'Portuguese', label: 'PORTUGUÉS', icon: 'BR' },
    { id: 'Japanese', label: 'JAPONÉS', icon: 'JP' },
    { id: 'Korean', label: 'COREANO', icon: 'KR' },
    { id: 'Chinese (Simplified)', label: 'CHINO', icon: 'CN' },
    { id: 'Russian', label: 'RUSO', icon: 'RU' },
    { id: 'Arabic', label: 'ÁRABE', icon: 'SA' },
    { id: 'Hindi', label: 'HINDI', icon: 'IN' },
  ];
  
  const handleLanguageSelect = (langId: string) => {
    setLocalConfig({ ...localConfig, language: langId });
  };

  return (
    <ModalContainer title="Personalizar Experiencia" onClose={onClose}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
        
        <section className="space-y-4">
          <h3 className="text-xs font-orbitron font-bold text-[#00d2ff] uppercase tracking-widest">Rol del Asistente AI</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {roles.map(role => (
              <button 
                key={role.id}
                onClick={() => setLocalConfig({...localConfig, role: role.id})}
                className={`p-4 rounded-xl border text-left transition-all ${localConfig.role === role.id ? 'bg-[#00d2ff]/10 border-[#00d2ff]' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
              >
                <div className="text-xs font-bold text-white uppercase">{role.label}</div>
                <div className="text-[10px] text-gray-500 font-mono mt-1">{role.desc}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-orbitron font-bold text-[#00d2ff] uppercase tracking-widest">Idioma de Respuesta</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {allLangs.map(lang => (
              <button 
                key={lang.id}
                onClick={() => handleLanguageSelect(lang.id)}
                className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${localConfig.language === lang.id ? 'bg-[#00d2ff]/10 border-[#00d2ff]' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
              >
                <span className="text-xs font-bold text-gray-500">{lang.icon}</span>
                <span className="text-xs font-bold text-white uppercase">{lang.label}</span>
              </button>
            ))}
            <div className="p-4 rounded-xl border text-left flex items-center gap-3 bg-black/20 border-white/5 opacity-50 cursor-not-allowed">
              <span className="text-xs font-bold text-gray-500">🌐</span>
              <span className="text-xs font-bold text-white uppercase">CUSTOM</span>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white uppercase">Emojis en respuestas</span>
            <span className="text-[10px] text-gray-500 font-mono">Habilita o silencia la expresividad visual.</span>
          </div>
          <button 
            onClick={() => setLocalConfig({...localConfig, emojis: !localConfig.emojis})}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${localConfig.emojis ? 'bg-[#00ff88]' : 'bg-gray-800'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${localConfig.emojis ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-orbitron font-bold text-[#00d2ff] uppercase tracking-widest">¿Cómo debe llamarte el AI?</h3>
          <input 
            type="text"
            value={localConfig.nickname}
            onChange={(e) => setLocalConfig({...localConfig, nickname: e.target.value})}
            placeholder="Ej. Comandante, Admin..."
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-[#00ff88] outline-none"
          />
        </section>

        <div className="pt-6">
          <button 
            onClick={() => { onSave(localConfig); onClose(); }}
            className="w-full py-4 bg-[#00ff88] text-black font-orbitron font-bold text-xs tracking-widest rounded-xl hover:scale-105 transition-all shadow-xl"
          >
            GUARDAR CONFIGURACIÓN
          </button>
        </div>
      </div>
    </ModalContainer>
  );
};

export default PersonalizationModal;