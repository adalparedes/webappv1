import { supabase } from './supabaseClient';
import { ChatMessage } from '../types';

const validateSecureSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    throw new Error("SESIÓN_EXPIRADA: Reautenticación requerida.");
  }
  return session;
};

export const getConversationLimit = (tier: string | null, isAdmin: boolean): number | null => {
  if (isAdmin) return null; 
  
  const plan = (tier || 'free').toLowerCase();
  switch (plan) {
    case 'free': 
    case 'piojoso': 
      return 5; // ANTES: 3
    case 'bronze': 
    case 'novato': 
    case 'novata':
      return 20; // ANTES: 12
    case 'silver': 
    case 'jefe': 
    case 'patrona':
      return 50; // ANTES: 40
    case 'gold': 
    case 'rey': 
    case 'reina':
    case 'premium':
      return 100; // ANTES: 90
    default: 
      return 5; 
  }
};

export const chatService = {
  async fetchConversations(userId: string, limit: number | null) {
    await validateSecureSession();
    
    let query = supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .eq('archived', false)
      .order('created_at', { ascending: false });
    
    if (limit !== null) query = query.limit(limit);
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async fetchMessages(conversationId: string) {
    await validateSecureSession();

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (error) {
      if (error.code === 'PGRST116') throw new Error("CONVERSACIÓN_INEXISTENTE");
      throw error;
    }

    return data.map(m => ({
      id: m.id.toString(),
      role: m.sender as 'user' | 'assistant',
      content: m.content,
      timestamp: new Date(m.created_at).getTime(),
      model: m.model
    }));
  },

  async createConversation(userId: string, title: string, tier: string | null, isAdmin: boolean) {
    const session = await validateSecureSession();
    
    if (session.user.id !== userId) {
      throw new Error("DETECCIÓN_DE_SUPLANTACIÓN");
    }

    const cleanTitle = (title || 'Nuevo Comando')
      .replace(/<[^>]*>?/gm, '')
      .replace(/[^\x20-\x7E\u00C0-\u00FF]/g, '')
      .substring(0, 40)
      .trim();

    const limit = getConversationLimit(tier, isAdmin);
    
    if (limit !== null) {
      const { count, error: countError } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('archived', false);
      
      if (countError) throw countError;

      if (count !== null && count >= limit) {
        const { data: oldestConversations, error: fetchOldestError } = await supabase
          .from('conversations')
          .select('id')
          .eq('user_id', userId)
          .eq('archived', false)
          .order('created_at', { ascending: true })
          .limit(1);

        if (fetchOldestError) {
          throw new Error("LÍMITE_ALCANZADO: Error al verificar el historial antiguo.");
        }
        
        if (oldestConversations && oldestConversations.length > 0) {
          const oldestId = oldestConversations[0].id;
          console.log(`[CONV_LIMIT] Límite (${limit}) alcanzado. Archivando la conversación más antigua: ${oldestId}`);
          
          // MEJORA: En lugar de borrar, archivamos la conversación.
          const { error: archiveError } = await supabase
            .from('conversations')
            .update({ archived: true })
            .eq('id', oldestId);
          
          if (archiveError) {
            throw new Error("LÍMITE_ALCANZADO: Fallo al archivar el historial antiguo.");
          }
        }
      }
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        title: cleanTitle,
        is_favorite: false,
        archived: false
      })
      .select()
      .single();

    if (error) {
      if (error.message.includes('RLS') || error.code === '42501') {
        throw new Error("OPERACIÓN_BLOQUEADA_POR_SEGURIDAD");
      }
      throw error;
    }
    return data;
  },

  async saveMessage(userId: string, conversationId: string, msg: ChatMessage) {
    const session = await validateSecureSession();

    if (session.user.id !== userId) {
      throw new Error("FALLO_INTEGRIDAD_USUARIO");
    }
    
    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender: msg.role,
        content: msg.content,
        model: msg.model || 'GEMINI'
      });
    
    if (error) {
      if (error.message.includes('credits') || error.code === '42501') {
        throw new Error("SALDO_INSUFICIENTE_O_ERROR_DE_PERMISOS");
      }
      throw new Error("ERROR_REGISTRO_DATOS");
    }
  },

  async deleteConversation(userId: string, conversationId: string) {
    const session = await validateSecureSession();
    if (session.user.id !== userId) throw new Error("OPERACIÓN_NO_AUTORIZADA");

    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId)
      .eq('user_id', userId);

    if (error) {
      throw new Error("FALLO_PURGA_MEMORIA");
    }
    return true;
  }
};