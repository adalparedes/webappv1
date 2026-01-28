import { supabase } from '../lib/supabaseClient';

/**
 * Removes conversations that haven't been updated in over 90 days.
 * Includes throttling to run only once every 24 hours per user.
 */
export async function cleanupOldConversations(userId: string) {
  if (!userId) return;

  const STORAGE_KEY = `adal_cleanup_timestamp_${userId}`;
  const lastRun = localStorage.getItem(STORAGE_KEY);
  const now = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  // Throttle: Don't run if it was executed in the last 24 hours
  if (lastRun && now - Number(lastRun) < ONE_DAY_MS) {
    return;
  }

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);

  try {
    /**
     * Delete operation respects RLS. 
     * Cascade deletion in the DB ensures messages are also removed.
     */
    const { error, count } = await supabase
      .from('conversations')
      .delete({ count: 'exact' })
      .eq('user_id', userId)
      .lte('updated_at', cutoff.toISOString());

    if (error) {
      console.error('[Purge] Error during data cleanup:', error.message);
    } else if (count && count > 0) {
      console.log(`[Purge] Successfully removed ${count} stale conversations (90+ days old).`);
    }

    // Set timestamp to mark successful run attempt
    localStorage.setItem(STORAGE_KEY, String(now));
  } catch (err) {
    console.error('[Purge] Unexpected error during cleanup execution:', err);
  }
}
