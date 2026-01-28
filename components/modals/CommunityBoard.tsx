
import React, { useState } from 'react';
import ModalContainer from './ModalContainer';

const CommunityBoard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, user: 'cyber_wolf', text: 'Alguien sabe cómo arreglar el bug de CORS?', time: '2m ago' },
    { id: 2, user: 'adal_admin', text: '¡Bienvenidos al portal Layer 2! Tengan un gran día hackeando.', time: '10m ago' },
    { id: 3, user: 'bit_fan', text: 'El puzzle de Bitcoin estuvo increíble 🚀', time: '1h ago' },
  ]);
  const [newMsg, setNewMsg] = useState('');

  const handlePost = () => {
    if (!newMsg.trim()) return;
    setMessages([{ id: Date.now(), user: 'Anon', text: newMsg, time: 'Just now' }, ...messages]);
    setNewMsg('');
  };

  return (
    <ModalContainer title="Pizarrón de la Comunidad" onClose={onClose}>
      <div className="flex flex-col gap-8">
        <div className="bg-black/60 border border-[#00ff88]/30 rounded-xl p-4 animate-pulse">
          <p className="text-[10px] font-mono text-[#00ff88] uppercase tracking-[0.3em] text-center">
            &lt;&lt; CANAL ABIERTO // HUMOR // SOPORTE // TECH TIPS &gt;&gt;
          </p>
        </div>

        <div className="flex gap-4">
          <input 
            type="text" 
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Escribe algo positivo para la comunidad..." 
            className="flex-1 bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:border-[#00ff88] outline-none"
          />
          <button 
            onClick={handlePost}
            className="px-6 py-3 bg-[#00ff88] text-black font-orbitron font-bold text-xs tracking-widest rounded-lg hover:bg-white transition-all"
          >
            PUBLICAR
          </button>
        </div>

        <div className="space-y-4">
          {messages.map(m => (
            <div key={m.id} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-[#00ff88] font-mono">@{m.user}</span>
                <span className="text-[9px] text-gray-600 font-mono">{m.time}</span>
              </div>
              <p className="text-sm text-gray-300">{m.text}</p>
            </div>
          ))}
        </div>
      </div>
    </ModalContainer>
  );
};

export default CommunityBoard;
