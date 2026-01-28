import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

interface AuthModuleProps {
  onAuthSuccess: (user: any) => void;
}

const AuthModule: React.FC<AuthModuleProps> = ({ onAuthSuccess }) => {
  const { signIn, signUp, resetPassword, clearError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Rate Limiting
  const lastAttempt = useRef(0);
  const AUTH_COOLDOWN_MS = 5000; // 5 segundos de cooldown

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
  });

  // Security Hardening: Utility to strip potential HTML tags
  const sanitizeInput = (input: string) => {
    return input.trim().replace(/<[^>]*>?/gm, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Rate Limiting Check (Client-side)
    const now = Date.now();
    if (now - lastAttempt.current < AUTH_COOLDOWN_MS) {
      setLocalError("DEMASIADOS INTENTOS. Espera un momento antes de reintentar.");
      return;
    }
    lastAttempt.current = now;

    setLoading(true);
    setLocalError(null);
    setSuccessMsg(null);
    clearError();
    
    try {
      if (isForgotPassword) {
        await resetPassword(formData.email);
        setSuccessMsg("LINK DE RECUPERACIÓN ENVIADO.");
      } else if (isLogin) {
        await signIn(formData.email, formData.password);
        onAuthSuccess({});
      } else {
        // 2. Security Hardening: Sanitize and validate inputs before processing
        const sanitizedUsername = sanitizeInput(formData.username).toLowerCase();
        const sanitizedFullName = sanitizeInput(formData.fullName);
        
        if (sanitizedUsername.length < 3) {
          setLocalError("EL USERNAME DEBE TENER AL MENOS 3 CARACTERES.");
          setLoading(false);
          return;
        }

        await signUp(formData.email, formData.password, {
          username: sanitizedUsername,
          fullName: sanitizedFullName,
        });
        setSuccessMsg("CUENTA CREADA. VERIFICA TU EMAIL.");
        setIsLogin(true);
      }
    } catch (err: any) {
      // 3. Handle Supabase's native rate limit error (Server-side)
      if (err.status === 429) {
          setLocalError("LÍMITE DE INTENTOS SUPERADO. Por seguridad, tu acceso ha sido bloqueado temporalmente.");
      } else {
          setLocalError(err?.message || "ERROR DE CONEXIÓN.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getThemeColor = () => isForgotPassword ? '#a855f7' : (isLogin ? '#00d2ff' : '#00ff88');

  return (
    <div className="w-full max-w-md mx-auto p-4 animate-in fade-in duration-500">
      <div className="relative overflow-hidden bg-black/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent" style={{ color: getThemeColor() }}></div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-orbitron font-bold tracking-widest uppercase text-white">
            {isForgotPassword ? 'Reset Access' : (isLogin ? 'INICIAR SESIÓN' : 'CREAR CUENTA')}
          </h2>
          {localError && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] uppercase rounded-xl">{localError}</div>}
          {successMsg && <div className="mt-4 p-3 bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] text-[10px] uppercase rounded-xl">{successMsg}</div>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && !isForgotPassword && (
            <div className="space-y-4">
              <input required name="fullName" placeholder="NOMBRE COMPLETO" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-[#00ff88] outline-none" />
              <input required name="username" placeholder="USERNAME" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-[#00ff88] outline-none" />
            </div>
          )}
          
          <input required type="email" name="email" placeholder="EMAIL" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-current" style={{ color: getThemeColor() }} />
          
          {!isForgotPassword && (
            <div className="space-y-4">
              <div className="relative">
                <input 
                  required 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  placeholder="CONTRASEÑA" 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pr-10 text-xs text-white outline-none focus:border-current" 
                  style={{ borderColor: getThemeColor() + '44' }} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-white transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}

          <button disabled={loading} className="w-full py-4 rounded-xl font-orbitron font-bold text-[11px] uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3" style={{ backgroundColor: getThemeColor(), color: '#000' }}>
            {loading ? 'SINCRONIZANDO...' : (isForgotPassword ? 'ENVIAR LINK' : (isLogin ? 'INICIAR SESIÓN' : 'CREAR CUENTA'))}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-white/5 flex flex-col items-center gap-5">
          <button 
            onClick={() => { setIsLogin(!isLogin); setIsForgotPassword(false); }} 
            className="text-[10px] font-orbitron font-bold uppercase text-[#00ff88] transition-all hover:scale-105"
          >
            {isLogin ? <span className="flex items-center gap-2">¿NUEVO AQUÍ? REGÍSTRATE 🚀</span> : "¿YA ERES MIEMBRO? LOGUÉATE"}
          </button>
          
          {isLogin && (
            <button 
              onClick={() => { setIsForgotPassword(true); setIsLogin(false); }}
              className="text-[12px] font-bold text-[#a855f7] hover:text-white uppercase flex items-center gap-2 transition-colors"
            >
              <span>❓</span> ¿Olvidaste tu contraseña?
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModule;