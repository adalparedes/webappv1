
import React, { useState } from 'react';
import ModalContainer from './ModalContainer';

interface SettingsModalProps {
  config: any;
  onClose: () => void;
  onSave: (config: any) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ config, onClose, onSave }) => {
  const [localConfig, setLocalConfig] = useState(config);
  const [isSaving, setIsSaving] = useState(false);

  const timezones = [
    { id: 'America/Mexico_City', name: 'México (CDMX)' },
    { id: 'America/Phoenix', name: 'Arizona (MST)' },
    { id: 'America/New_York', name: 'Nueva York (EST)' },
    { id: 'America/Los_Angeles', name: 'Los Angeles (PST)' },
    { id: 'Europe/Madrid', name: 'España (Madrid)' },
    { id: 'UTC', name: 'Universal (UTC)' }
  ];

  const models = [
    { id: 'gemini', name: 'Gemini 3 Flash (Core)', icon: '🌐' },
    { id: 'openai', name: 'GPT-4o (Assistant)', icon: '🤖' },
    { id: 'deepseek', name: 'DeepSeek V3 (Coder)', icon: '🧠' }
  ];

  const toggleModel = (modelId: string) => {
    const isEnabled = localConfig.enabledModels.includes(modelId);
    let newEnabledModels;
    if (isEnabled) {
      if (localConfig.enabledModels.length <= 1) return;
      newEnabledModels = localConfig.enabledModels.filter((id: string) => id !== modelId);
    } else {
      newEnabledModels = [...localConfig.enabledModels, modelId];
    }
    setLocalConfig({ ...localConfig, enabledModels: newEnabledModels });
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simular latencia de red para feedback visual
    await new Promise(resolve => setTimeout(resolve, 800));
    onSave(localConfig);
    setIsSaving(false);
    onClose();
  };

  return (
    <ModalContainer title="Configuración de Sistema" onClose={onClose}>
      <div className="space-y-10 animate-in fade-in zoom-in duration-300">
        
        {/* Timezone Selection */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[#00d2ff]">🕒</span>
            <h3 className="text-xs font-orbitron font-bold text-[#00d2ff] uppercase tracking-widest">Huso Horario del Nodo</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {timezones.map(tz => (
              <button 
                key={tz.id}
                onClick={() => setLocalConfig({...localConfig, timezone: tz.id})}
                className={`p-4 rounded-xl border text-[11px] font-bold uppercase transition-all flex justify-between items-center ${localConfig.timezone === tz.id ? 'bg-[#00d2ff]/20 border-[#00d2ff] text-white shadow-[0_0_15px_rgba(0,210,255,0.1)]' : 'bg-black/20 border-white/5 text-gray-500 hover:border-white/20'}`}
              >
                <span>{tz.name}</span>
                {localConfig.timezone === tz.id && <span className="w-1.5 h-1.5 bg-[#00d2ff] rounded-full animate-pulse shadow-[0_0_8px_#00d2ff]"></span>}
              </button>
            ))}
          </div>
        </section>

        {/* Model Management */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[#00ff88]">🧠</span>
            <h3 className="text-xs font-orbitron font-bold text-[#00ff88] uppercase tracking-widest">Módulos de IA</h3>
          </div>
          <div className="space-y-2">
            {models.map(model => {
              const isEnabled = localConfig.enabledModels.includes(model.id);
              return (
                <div 
                  key={model.id}
                  className={`flex items-center justify-between p-4 bg-white/5 border rounded-2xl transition-all ${isEnabled ? 'border-[#00ff88]/30 bg-[#00ff88]/5' : 'border-white/5 opacity-40 grayscale'}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl">{model.icon}</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white uppercase">{model.name}</span>
                      <span className={`text-[8px] font-mono uppercase font-bold ${isEnabled ? 'text-[#00ff88]' : 'text-gray-600'}`}>
                        {isEnabled ? 'Activo' : 'Desactivado'}
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => toggleModel(model.id)}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${isEnabled ? 'bg-[#00ff88]' : 'bg-gray-800'}`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${isEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <div className="pt-6">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full py-5 font-orbitron font-bold text-xs tracking-[0.2em] rounded-2xl transition-all shadow-xl uppercase flex items-center justify-center gap-3 ${isSaving ? 'bg-gray-800 text-gray-500 cursor-wait' : 'bg-[#00d2ff] text-black hover:bg-white hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(0,210,255,0.3)]'}`}
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></span>
                SINCRONIZANDO...
              </>
            ) : 'GUARDAR CAMBIOS'}
          </button>
        </div>
      </div>
    </ModalContainer>
  );
};

export default SettingsModal;
