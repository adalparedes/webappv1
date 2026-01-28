import React, { useState, useEffect } from 'react';
import ModalContainer from './ModalContainer';
import { User } from '../../types';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

interface UserProfileProps {
  user: User;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onClose }) => {
  const { session, isGuest, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTx, setLoadingTx] = useState(true);
  const [errorTx, setErrorTx] = useState<string | null>(null);

  const badges = [
    { id: 'early_adopter', icon: '🚀', name: 'Early Adopter', color: '#00d2ff', desc: 'Pionero del Core V1' },
    { id: 'power_node', icon: '⚡', name: 'Power Node', color: '#00ff88', desc: '+500 comandos ejecutados' },
    { id: 'premium_king', icon: '👑', name: 'Rey/Reina', color: '#ffcc00', desc: 'Suscripción Élite activa' },
    { id: 'bug_hunter', icon: '🕵️', name: 'Bug Hunter', color: '#ff3131', desc: 'Reportó vulnerabilidades' },
    { id: 'crypto_whale', icon: '🐋', name: 'Whale Node', color: '#627eea', desc: 'Inversor de alto volumen' },
    { id: 'verified', icon: '🛡️', name: 'Verified', color: '#ffffff', desc: 'Identidad confirmada' },
    { id: 'tech_master', icon: '🧠', name: 'Tech Master', color: '#a855f7', desc: 'Conocimiento experto' },
    { id: 'social_sync', icon: '🤝', name: 'Social Sync', color: '#ff3e8d', desc: 'Miembro activo Discord' },
    { id: 'data_miner', icon: '⛏️', name: 'Data Miner', color: '#f7931a', desc: 'Extracción de intel avanzada' },
    { id: 'speed_demon', icon: '💨', name: 'Speed Demon', color: '#00f2ea', desc: 'Uso de modelos flash' },
    { id: 'loyal_user', icon: '💎', name: 'Legacy Node', color: '#b9f2ff', desc: '+1 año de antigüedad' },
    { id: 'beta_tester', icon: '🧪', name: 'Beta Tester', color: '#9dff00', desc: 'Acceso a Labs activo' }
  ];

  const [editData, setEditData] = useState({
    username: user.username,
    fullName: user.fullName,
    gender: user.gender,
    ageRange: user.ageRange
  });

  useEffect(() => {
    const fetchLedger = async () => {
      setLoadingTx(true);
      setErrorTx(null);
      if (isGuest || !session?.user?.id) {
        setLoadingTx(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('credit_transactions')
          .select('id, pack_code, credits_delta, amount_usd, payment_method, status, created_at')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(10);
        if (error) throw error;
        setTransactions(data || []);
      } catch (err) {
        console.error("[PROFILE_LEDGER] Error:", err);
        setErrorTx("No se pudo cargar el historial de transacciones.");
      } finally {
        setLoadingTx(false);
      }
    };
    fetchLedger();
  }, [session, isGuest]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('profiles').update({
        username: editData.username,
        full_name: editData.fullName,
        gender: editData.gender,
        age_range: editData.ageRange
      }).eq('id', session.user.id);
      if (error) throw error;
      await refreshProfile();
      setIsEditing(false);
    } catch (err: any) { 
      alert(err.message);
    } finally { 
      setLoading(false); 
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success': return 'text-[#00ff88] bg-[#00ff88]/10 border-[#00ff88]/20';
      case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'failed':
      case 'error': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-400 bg-white/5 border-white/10';
    }
  };

  return (
    <ModalContainer title={isEditing ? "Configuración de Nodo" : "Identidad & Méritos"} onClose={onClose}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-[#00d2ff] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative w-32 h-32 rounded-full bg-black border-2 border-[#00d2ff]/30 flex items-center justify-center text-5xl font-orbitron font-bold text-[#00d2ff] shadow-[0_0_40px_rgba(0,210,255,0.1)] overflow-hidden">
               {user.username.substring(0, 1).toUpperCase()}
               <div className="absolute bottom-0 w-full bg-[#00d2ff]/20 py-1">
                  <span className="text-[8px] font-bold text-[#00d2ff] uppercase tracking-tighter">Verified</span>
               </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-orbitron font-bold text-white uppercase tracking-tight">{user.username}</h3>
            <p className="text-[10px] text-[#00ff88] font-mono font-bold uppercase tracking-[0.3em] mt-1">{user.membership} NODE</p>
          </div>

          <div className="w-full space-y-4 pt-4 border-t border-white/5">
             <span className="text-[9px] font-orbitron font-bold text-gray-500 uppercase tracking-[0.2em]">Vitrina de Mérito (12/12)</span>
             <div className="grid grid-cols-4 gap-2">
                {badges.map(badge => (
                  <div key={badge.id} className="relative group/badge cursor-help">
                    <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-lg hover:border-current hover:bg-current/10 transition-all hover:scale-110 active:scale-90" style={{ color: badge.color }}>
                       {badge.icon}
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-32 p-3 bg-black border border-white/20 rounded-xl opacity-0 group-hover/badge:opacity-100 transition-all pointer-events-none z-[100] shadow-[0_10px_30px_rgba(0,0,0,0.8)] scale-90 group-hover/badge:scale-100">
                       <p className="text-[9px] font-orbitron font-bold text-white uppercase leading-tight mb-1">{badge.name}</p>
                       <p className="text-[8px] text-gray-400 font-mono leading-relaxed">{badge.desc}</p>
                       <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-black border-r border-b border-white/20 rotate-45"></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 font-mono text-[9px] uppercase hover:text-white transition-all">
              [ EDITAR IDENTIDAD ]
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4 animate-in fade-in duration-300">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Username</label>
                  <input value={editData.username} onChange={e => setEditData({...editData, username: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs text-white focus:border-[#00d2ff] outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Nombre Completo</label>
                  <input value={editData.fullName} onChange={e => setEditData({...editData, fullName: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs text-white focus:border-[#00d2ff] outline-none" />
                </div>
              </div>
              <button disabled={loading} className="w-full py-4 bg-[#00d2ff] text-black font-orbitron font-bold text-[10px] uppercase rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(0,210,255,0.2)] flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    SINCRONIZANDO...
                  </>
                ) : 'ACTUALIZAR DATOS'}
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="w-full py-2 text-[9px] font-mono text-gray-600 uppercase">Cancelar</button>
            </form>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-4xl group-hover:opacity-10 transition-opacity">💎</div>
                  <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest block mb-1">Balance Actual</span>
                  <div className="text-2xl font-orbitron font-bold text-[#00ff88]">{user.balance.toFixed(0)} <span className="text-[10px] opacity-60">CRED</span></div>
                </div>
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-4xl group-hover:opacity-10 transition-opacity">🛰️</div>
                  <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest block mb-1">Status de Enlace</span>
                  <div className="text-2xl font-orbitron font-bold text-white uppercase opacity-80">{user.membership}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse shadow-[0_0_8px_#00ff88]"></span>
                    <h4 className="text-[10px] font-orbitron font-bold text-white uppercase tracking-widest">Ledger de Actividad</h4>
                  </div>
                </div>

                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                  {loadingTx ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-14 bg-white/5 border border-white/5 animate-pulse rounded-xl"></div>
                      ))}
                    </div>
                  ) : errorTx ? (
                    <div className="py-10 text-center text-red-500 font-mono text-[9px] uppercase border border-dashed border-red-500/30 rounded-xl italic">
                      {errorTx}
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="py-10 text-center text-gray-600 font-mono text-[9px] uppercase border border-dashed border-white/5 rounded-xl italic">
                      No se detectan registros recientes de capital.
                    </div>
                  ) : (
                    transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-all">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-white uppercase truncate max-w-[150px]">{tx.pack_code?.replace(/_/g, ' ') || 'TOP-UP'}</span>
                          <span className="text-[8px] text-gray-600 font-mono uppercase">{tx.payment_method} &bull; {new Date(tx.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-[#00ff88]">+ {tx.credits_delta} CR <span className="text-gray-500 font-mono">(${tx.amount_usd})</span></div>
                          <div className={`mt-1 text-[7px] font-mono uppercase px-1.5 py-0.5 rounded border inline-block ${getStatusColor(tx.status)}`}>{tx.status}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalContainer>
  );
};

export default UserProfile;