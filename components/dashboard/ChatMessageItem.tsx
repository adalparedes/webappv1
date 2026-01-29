import React, { memo } from 'react';
import { ChatMessage } from '../../types';

interface ChatMessageItemProps {
  msg: ChatMessage;
  isLastMessage: boolean;
  isTyping: boolean;
  onSpeakToggle: (text: string, msgId: string) => void;
  playingMessageId: string | null;
}

const getModelStyle = (modelName?: string) => {
    const m = modelName?.toLowerCase() || '';
    if (m.includes('gemini')) return { color: '#00d2ff', shadow: 'rgba(0, 210, 255, 0.5)' };
    if (m.includes('openai')) return { color: '#10a37f', shadow: 'rgba(16, 163, 127, 0.5)' };
    if (m.includes('deepseek')) return { color: '#a855f7', shadow: 'rgba(168, 85, 247, 0.5)' };
    return { color: '#ffffff', shadow: 'rgba(255, 255, 255, 0.2)' };
};

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ msg, isLastMessage, isTyping, onSpeakToggle, playingMessageId }) => {
    const isUser = msg.role === 'user';
    const isError = msg.isError === true;
    const msgStyle = getModelStyle(msg.model);
    const isPlaying = playingMessageId === msg.id;

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            <div className={`max-w-[90%] md:max-w-[80%] p-4 md:p-6 rounded-[1.5rem] transition-all relative group ${isUser ? 'bg-[#00d2ff] text-black font-bold shadow-2xl rounded-tr-none' : isError ? 'bg-red-950/50 border border-red-500/30 text-white rounded-tl-none' : 'bg-black border border-white/10 text-white rounded-tl-none'}`} style={!isUser && !isError ? { boxShadow: `0 0 30px ${msgStyle.shadow}`, borderColor: `${msgStyle.color}44` } : {}}>
                {isError && (
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-red-500/20">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-red-400 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <h4 className="text-[10px] font-orbitron font-bold text-red-400 uppercase tracking-widest">Fallo de Sincronización</h4>
                    </div>
                )}
                
                <div className={`text-sm md:text-base whitespace-pre-wrap leading-relaxed ${isError ? 'text-red-300 font-mono' : isUser ? '' : 'font-ubuntu'}`}>
                    {msg.content || "Sincronizando..."}
                    {isTyping && isLastMessage && msg.role === 'assistant' && (
                        <span className="inline-block w-2 h-5 ml-1 animate-pulse align-middle" style={{ backgroundColor: msgStyle.color }}></span>
                    )}
                </div>

                {!isUser && !isError && msg.content && (
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between gap-4">
                        <div className="text-[8px] font-mono tracking-widest uppercase font-black opacity-60" style={{ color: msgStyle.color }}>● NODO_{msg.model || 'GEMINI'}</div>
                        <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => onSpeakToggle(msg.content, msg.id)} className={`p-1.5 rounded-lg transition-all active:scale-90 flex items-center gap-1.5 ${isPlaying ? 'bg-[#00ff88]/20 text-[#00ff88]' : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`} title={isPlaying ? "Detener lectura" : "Leer respuesta"}>
                                {isPlaying ? (<><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff88]"></span></span><span className="text-[9px] font-bold">STOP</span></>) : (<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>)}
                            </button>
                            <button onClick={() => { navigator.clipboard.writeText(msg.content); alert("Copiado al portapapeles"); }} className="p-1.5 rounded-lg bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all active:scale-90" title="Copiar texto">
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(ChatMessageItem);