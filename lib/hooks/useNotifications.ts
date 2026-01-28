
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { AppNotification } from '../../types';
import { useAuth } from '../../context/AuthContext';

export function useNotifications() {
  const { session } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (fetchError) throw fetchError;
      setNotifications(data || []);
    } catch (err: any) {
      const msg = err?.message || 'Error de conexión con el nodo de alertas.';
      console.warn('[Notifications] Fetch fail:', msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [session]);

  const markAsRead = useCallback(async (id?: string) => {
    if (!session?.user?.id) return;

    try {
      let query = supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', session.user.id);

      if (id) {
        query = query.eq('id', id);
      } else {
        query = query.eq('is_read', false);
      }

      const { error: updateError } = await query;
      if (updateError) throw updateError;

      setNotifications(prev => 
        prev.map(n => (id ? n.id === id : !n.is_read) ? { ...n, is_read: true } : n)
      );
    } catch (err: any) {
      console.error('[Notifications] Mark read error:', err?.message || err);
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchNotifications();

      const channel = supabase
        .channel(`notifications_realtime_${session.user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${session.user.id}`,
          },
          (payload) => {
            setNotifications(prev => [payload.new as AppNotification, ...prev].slice(0, 20));
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session, fetchNotifications]);

  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.is_read).length, 
    [notifications]
  );

  return {
    notifications,
    unreadCount,
    loading,
    error,
    reload: fetchNotifications,
    markAsRead
  };
}
