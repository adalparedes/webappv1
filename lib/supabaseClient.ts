import { createClient } from '@supabase/supabase-js';
import { ENV } from './env';

/**
 * Supabase Client Core Initialization
 * Sincronizado con Vercel Production Environment
 */

const supabaseUrl = ENV.SUPABASE_URL;
const supabaseKey = ENV.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'ap_core_session_v6'
  },
  global: {
    headers: { 'x-application-name': 'adal-paredes-ai-core' }
  }
});