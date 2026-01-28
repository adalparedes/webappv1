
import React, { useState, useEffect, useMemo } from 'react';

interface ContactCardProps {
  onClose: () => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ onClose }) => {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    whatsapp: '',
    servicio: 'asesoria_ia'
  });
  
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [spamAnswer, setSpamAnswer] = useState('');
  
  // Generar un reto matemático simple al azar
  const spamChallenge = useMemo(() => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    return { question: `¿Cuánto es ${a} + ${b}?`, answer: (a + b).toString() };
  }, []);

  const isHumanVerified = spamAnswer === spamChallenge.answer;
  const canSubmit = termsAccepted && isHumanVerified && form.nombre && form.email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    
    setStatus('sending');

    try {
      const response = await fetch('https://formspree.io/f/mykkgzgq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...form,
          _subject: `Nueva Solicitud de Servicio: ${form.servicio.toUpperCase()}`,
          consent: "Aceptó compartir datos para ser contactado por Adal Paredes",
          message: `El usuario ${form.nombre} ${form.apellido} ha solicitado el servicio de ${form.servicio}. Contacto: ${form.email} | WhatsApp: ${form.whatsapp || 'No proporcionado'}`
        })
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 4000);
      }
    } catch (err) {
      console.error("Formspree Error:", err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  if (status === 'success') {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
        <div className="bg-gray-900 border border-[#00ff88] p-8 rounded-2xl max-w-sm w-full text-center shadow-[0_0_50px_rgba(0,255,136,0.2)]">
          <div className="text-5xl mb-4">🚀</div>
          <h3 className="text-xl font-orbitron font-bold text-[#00ff88] mb-2 uppercase tracking-tighter">¡Sincronización Exitosa!</h3>
          <p className="text-gray-400 font-mono text-[10px] mb-6 uppercase leading-relaxed">
            Tu solicitud ha sido inyectada en el núcleo de Adal Paredes. Responderé a tu señal en menos de 24 ciclos.
          </p>
          <button 
            onClick={onClose}
            className="w-full py-4 bg-[#00ff88] text-black font-bold font-orbitron text-xs rounded-xl hover:bg-white transition-all uppercase tracking-widest"
          >
            VOLVER AL PORTAL
          </button>
        </div>
      </div>
    );
  }

  const socialLinks = [
    { name: 'X', url: 'https://x.com/AdalParedes1', icon: '𝕏' },
    { name: 'YouTube', url: 'https://www.youtube.com/@adalparedes1', icon: '📺' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@adalparedes1', icon: '📱' },
    { name: 'Instagram', url: '#', icon: '📸' }
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-[#00d2ff]/30 rounded-2xl shadow-[0_0_80px_rgba(0,210,255,0.15)] overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-500">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00ff88] via-[#00d2ff] to-[#00ff88]"></div>
        
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00d2ff]/10 rounded-lg flex items-center justify-center border border-[#00d2ff]/30">
              <span className="text-xl">📩</span>
            </div>
            <div>
              <h2 className="font-orbitron font-bold text-white tracking-widest text-sm uppercase">Canal de Contacto Directo</h2>
              <p className="text-[11px] text-[#00ff88] font-mono font-bold uppercase tracking-tight drop-shadow-[0_0_5px_rgba(0,255,136,0.3)]">
                Portal v3.0 // Anti-Spam Active
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-gray-500 uppercase">Nombre</label>
                <input required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs focus:border-[#00ff88] outline-none text-white transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-gray-500 uppercase">Apellido</label>
                <input required value={form.apellido} onChange={e => setForm({...form, apellido: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs focus:border-[#00ff88] outline-none text-white transition-all" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-mono text-gray-500 uppercase">Email de Contacto</label>
              <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs focus:border-[#00ff88] outline-none text-white transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-mono text-gray-500 uppercase">WhatsApp (Opcional)</label>
              <input value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs focus:border-[#00ff88] outline-none text-white transition-all" placeholder="+52 ..." />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-mono text-gray-500 uppercase">Servicio de Interés</label>
              <select value={form.servicio} onChange={e => setForm({...form, servicio: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs focus:border-[#00ff88] outline-none text-white appearance-none cursor-pointer">
                <option value="asesoria_ia" className="bg-black text-white">Asesoría de IA</option>
                <option value="asesoria_cyber" className="bg-black text-white">Asesoría Ciberseguridad</option>
                <option value="marketing" className="bg-black text-white">Marketing y Social Media</option>
                <option value="dev_web" className="bg-black text-white">Desarrollo Web / App</option>
                <option value="it_soporte" className="bg-black text-white">Soporte Cloud e IT</option>
              </select>
            </div>

            {/* Nueva Sección: Anti-Spam Manual */}
            <div className="p-3 bg-[#00d2ff]/5 border border-[#00d2ff]/20 rounded-xl flex items-center justify-between gap-4">
              <div className="flex-1">
                <label className="text-[8px] font-mono text-[#00d2ff] uppercase block mb-1">Human Verification</label>
                <p className="text-[10px] text-white font-bold">{spamChallenge.question}</p>
              </div>
              <input 
                type="number" 
                value={spamAnswer}
                onChange={e => setSpamAnswer(e.target.value)}
                className={`w-16 bg-black border ${isHumanVerified ? 'border-[#00ff88]' : 'border-white/20'} rounded-lg p-2 text-center text-xs text-white outline-none`}
                placeholder="?"
              />
            </div>

            {/* Nueva Sección: Checkbox de Consentimiento */}
            <div className="flex items-start gap-3 cursor-pointer group" onClick={() => setTermsAccepted(!termsAccepted)}>
              <div className={`mt-1 w-4 h-4 rounded border flex items-center justify-center transition-all ${termsAccepted ? 'bg-[#00ff88] border-[#00ff88]' : 'bg-black border-white/20 group-hover:border-[#00ff88]/50'}`}>
                {termsAccepted && <span className="text-black text-[10px] font-bold">✓</span>}
              </div>
              <p className="text-[8px] text-gray-500 font-mono leading-tight uppercase select-none">
                Confirmo que he leído las <span className="text-[#00ff88]">políticas de privacidad</span> y acepto compartir mis datos con la intención expresa de ser contactado por <span className="text-white">Adal Paredes</span> o su equipo técnico.
              </p>
            </div>

            {status === 'error' && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-mono uppercase rounded animate-pulse">
                Error de conexión. Reintenta en unos segundos.
              </div>
            )}

            <button 
              type="submit" 
              disabled={status === 'sending' || !canSubmit}
              className={`w-full py-4 font-orbitron font-bold text-[10px] tracking-widest uppercase rounded-xl transition-all shadow-[0_0_20px_rgba(0,210,255,0.2)] ${canSubmit ? 'bg-[#00d2ff] text-black hover:bg-[#00ff88]' : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'}`}
            >
              {status === 'sending' ? 'TRANSMITIENDO...' : 'ENVIAR SOLICITUD'}
            </button>
            {!canSubmit && (
              <p className="text-[7px] font-mono text-gray-600 text-center uppercase tracking-tighter">Resuelve el reto matemático y acepta términos para habilitar envío</p>
            )}
          </form>

          <div className="space-y-6">
            <div>
              <h3 className="text-[10px] font-mono text-[#00ff88] uppercase mb-4 tracking-widest border-b border-white/5 pb-2">Canales Alternativos</h3>
              <div className="grid grid-cols-1 gap-2.5">
                <a href="https://wa.me/521234567890" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 bg-[#00ff88]/5 border border-[#00ff88]/20 rounded-xl hover:bg-[#00ff88]/10 transition-all group">
                  <span className="text-xl">💬</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white group-hover:text-[#00ff88]">WhatsApp Business</span>
                    <span className="text-[9px] text-gray-500 font-mono">Respuesta Directa</span>
                  </div>
                </a>
                
                <a href="https://t.me/adalparedes" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 bg-[#00d2ff]/5 border border-[#00d2ff]/20 rounded-xl hover:bg-[#00d2ff]/10 transition-all group">
                  <span className="text-xl">✈️</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white group-hover:text-[#00d2ff]">Telegram Channel</span>
                    <span className="text-[9px] text-gray-500 font-mono">Broadcast & Alerts</span>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-mono text-gray-500 uppercase mb-4 tracking-widest border-b border-white/5 pb-2">Comunidad @adalparedes1</h3>
              <div className="grid grid-cols-2 gap-2">
                {socialLinks.map(social => (
                  <a 
                    key={social.name} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-mono text-gray-400 hover:text-white hover:border-[#00d2ff] hover:bg-[#00d2ff]/5 transition-all uppercase tracking-tight"
                  >
                    <span className="text-xs">{social.icon}</span>
                    {social.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00d2ff]/20 via-[#00ff88]/10 to-transparent opacity-100 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="relative p-5 border border-[#00d2ff]/40 bg-black/60 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse"></span>
                  <span className="text-[8px] font-orbitron font-bold text-[#00ff88] uppercase tracking-[0.2em]">Core Mission</span>
                </div>
                <p className="text-[10px] font-orbitron font-bold text-white leading-relaxed italic uppercase tracking-tighter">
                  "Construyendo el futuro digital con <span className="text-[#00d2ff]">inteligencia</span>, <span className="text-[#00ff88]">seguridad</span> y una arquitectura de vanguardia."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
