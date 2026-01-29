import React, { useRef, useEffect, useState, useCallback, memo } from 'react';
import { User, Conversation } from '../../types';
import ChatMessageItem from './ChatMessageItem';

interface ChatWindowProps {
  user: User;
  conversation?: Conversation;
  onSendMessage: (text: string, model: string, attachment?: { data: string, mimeType: string }) => void;
  isTyping: boolean;
  enabledModels: string[];
  isLoadingHistory?: boolean;
  selectedModel: string;
  onSelectModel: (model: string) => void;
  preferredLanguage?: string;
  isBottomNavOpen: boolean;
}

// Security Enhancement: Basic XSS prevention for filenames.
const sanitizeFilename = (name?: string): string => {
  if (!name) return '';
  return name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

const modelTooltips: Record<string, string> = {
  gemini: 'Modelo balanceado y rápido, ideal para tareas generales y creativas.',
  openai: 'Modelo avanzado y potente, excelente para razonamiento complejo y análisis.',
  deepseek: 'Modelo especializado en código, perfecto para programación y tareas técnicas.',
};

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  user, 
  conversation, 
  onSendMessage, 
  isTyping,
  enabledModels,
  isLoadingHistory,
  selectedModel,
  onSelectModel,
  preferredLanguage = 'es-MX',
  isBottomNavOpen
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [inputText, setInputText] = useState("");
  const [attachment, setAttachment] = useState<{ data: string, mimeType: string, name?: string } | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  
  const [placeholder, setPlaceholder] = useState("");
  const fullPlaceholder = "escribe aqui... (Shift+Enter para saltar linea)";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setPlaceholder(fullPlaceholder.slice(0, i));
      i++;
      if (i > fullPlaceholder.length) i = 0;
    }, 120);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation?.messages, isTyping]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tu navegador no soporta dictado por voz.");
      return;
    }
    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = preferredLanguage;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(prev => (prev + " " + transcript).trim());
    };
    recognition.start();
  };

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (re) => {
        const base64 = (re.target?.result as string).split(',')[1];
        setAttachment({ data: base64, mimeType: file.type, name: file.name });
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = '';
  }, []);

  const handleSpeakToggle = useCallback((text: string, msgId: string) => {
    if (playingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setPlayingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = preferredLanguage;
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang === preferredLanguage) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.onend = () => setPlayingMessageId(null);
    utterance.onerror = () => setPlayingMessageId(null);
    setPlayingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  }, [playingMessageId, preferredLanguage]);

  useEffect(() => () => window.speechSynthesis.cancel(), []);

  const handleSend = () => {
    if ((!inputText.trim() && !attachment) || isTyping) return;
    onSendMessage(inputText, selectedModel, attachment || undefined);
    setInputText("");
    setAttachment(null);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    if (isListening) setIsListening(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getModelStyle = (modelName: string) => {
    const m = modelName?.toLowerCase() || '';
    if (m.includes('gemini')) return { color: '#00d2ff', shadow: 'rgba(0, 210, 255, 0.5)' };
    if (m.includes('openai')) return { color: '#10a37f', shadow: 'rgba(16, 163, 127, 0.5)' };
    if (m.includes('deepseek')) return { color: '#a855f7', shadow: 'rgba(168, 85, 247, 0.5)' };
    return { color: '#ffffff', shadow: 'rgba(255, 255, 255, 0.2)' };
  };

  const currentStyle = getModelStyle(selectedModel);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#050505] h-full relative">
      <div ref={scrollRef} className={`flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar scroll-smooth transition-all duration-300 ${isBottomNavOpen ? 'pb-88' : 'pb-64'}`}>
        {isLoadingHistory ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-[#00d2ff]/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#00d2ff] border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 bg-[#00d2ff]/10 rounded-full animate-pulse"></div>
            </div>
            <p className="text-[10px] font-orbitron font-bold text-[#00d2ff] uppercase tracking-[0.3em] animate-pulse">Cargando Memoria...</p>
          </div>
        ) : (
          <>
            {!conversation ? (
              <div className="h-full flex flex-col items-center justify-center relative group">
                <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-[#00d2ff] via-[#a855f7] to-[#00ff88] rounded-full blur-[100px]"></div>
                </div>
                <div className="relative z-10 flex flex-col items-center gap-6 text-center">
                  <div className="w-24 h-24 bg-black/50 border border-white/10 rounded-full flex items-center justify-center text-5xl shadow-[0_0_50px_rgba(0,210,255,0.1)]">🛰️</div>
                  <p className="font-orbitron text-[12px] md:text-sm tracking-[0.6em] uppercase text-white/40 font-bold">NODOS AI ONLINE</p>
                </div>
              </div>
            ) : (
              conversation.messages.map((msg, index) => {
                const isLastMessage = index === conversation.messages.length - 1;
                return (
                  <ChatMessageItem
                    key={msg.id}
                    msg={msg}
                    isLastMessage={isLastMessage}
                    isTyping={isTyping}
                    onSpeakToggle={handleSpeakToggle}
                    playingMessageId={playingMessageId}
                  />
                );
              })
            )}
          </>
        )}
      </div>

      <div className={`absolute left-0 w-full p-4 md:p-6 bg-transparent z-40 md:relative md:bottom-auto transition-all duration-300 ${isBottomNavOpen ? 'bottom-48' : 'bottom-28'}`}>
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-between px-2">
             <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {enabledModels.map(m => {
                  const style = getModelStyle(m);
                  const isActive = selectedModel === m;
                  return (
                    <button 
                      key={m} 
                      onClick={() => onSelectModel(m)}
                      title={modelTooltips[m] || `Seleccionar modelo ${m}`}
                      className={`px-3 py-1.5 rounded-full border text-[8px] font-orbitron font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 ${isActive ? 'bg-black text-white' : 'bg-black/40 border-white/10 text-gray-500 opacity-80 hover:opacity-100 hover:border-white/30'}`} 
                      style={isActive ? { color: style.color, boxShadow: `0 0 10px ${style.shadow}`, borderColor: style.color } : {}}
                    >
                      <span>{m === 'gemini' ? '🌐' : m === 'openai' ? '🤖' : '🧠'}</span> {m}
                    </button>
                  );
                })}
             </div>
             {attachment && (
                <div className="flex items-center gap-2 px-3 py-1 bg-[#00d2ff]/10 border border-[#00d2ff]/30 rounded-full animate-in fade-in slide-in-from-bottom-2">
                  <span className="text-[10px] text-[#00d2ff]">📎</span>
                  <span className="text-[9px] font-mono text-white truncate max-w-[100px]">{sanitizeFilename(attachment.name) || 'Archivo'}</span>
                  <button onClick={() => setAttachment(null)} className="text-[10px] text-red-400 hover:text-white ml-1">×</button>
                </div>
             )}
          </div>

          <div className="relative bg-[#111111] border rounded-[1.5rem] p-2 flex items-end gap-2 shadow-lg transition-all duration-300 focus-within:shadow-[0_0_20px_rgba(0,210,255,0.1)]" style={{ borderColor: `${currentStyle.color}44` }}>
            <button onClick={() => fileInputRef.current?.click()} className="p-3 mb-0.5 text-gray-500 hover:text-[#00d2ff] hover:bg-white/5 rounded-xl transition-all active:scale-90" title="Adjuntar Imagen/Archivo">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.414a6 6 0 108.486 8.486L20.5 13"/></svg>
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*,application/pdf,text/plain" onChange={handleFileChange} />
            
            <button onClick={() => photoInputRef.current?.click()} className="p-3 mb-0.5 text-gray-500 hover:text-[#00d2ff] hover:bg-white/5 rounded-xl transition-all active:scale-90" title="Tomar Foto">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </button>
            <input type="file" ref={photoInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />

            <textarea ref={textareaRef} value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyDown} placeholder={placeholder} rows={1} className="flex-1 bg-transparent border-none outline-none text-white text-sm py-3 px-1 placeholder:text-gray-600 font-medium resize-none max-h-[120px] custom-scrollbar" style={{ minHeight: '44px' }}/>
            {!inputText.trim() && !attachment ? (
                <button onClick={toggleListening} className={`p-3 mb-0.5 rounded-xl transition-all active:scale-90 ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-gray-500 hover:text-white hover:bg-white/5'}`} title="Dictado por Voz">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
                </button>
            ) : null}
            {(inputText.trim() || attachment) && (
                <button onClick={handleSend} disabled={isTyping} className="p-3 mb-0.5 rounded-xl transition-all active:scale-90 bg-white text-black hover:bg-[#00d2ff] hover:scale-105 shadow-lg">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ChatWindow);