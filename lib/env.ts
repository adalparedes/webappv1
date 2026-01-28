/**
 * Adal Paredes AI Core - Environment Configuration
 */

const cleanEnv = (value: any): string => {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/['"]/g, '');
};

const getEnv = (key: string, fallback: string = ''): string => {
  try {
    // Para entornos de cliente (Vite)
    const viteVal = (import.meta as any).env?.[key];
    if (viteVal !== undefined) return cleanEnv(viteVal);

    return fallback;
  } catch (e) {
    return fallback;
  }
};

export const ENV = {
  // PUBLIC KEYS - SAFE FOR CLIENT
  SUPABASE_URL: getEnv('VITE_SUPABASE_URL', 'https://eziklndqndztjsxbozfc.supabase.co'),
  SUPABASE_ANON_KEY: getEnv('VITE_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6aWtsbmRxbmR6dGpzeGJvemZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NTY5MjUsImV4cCI6MjA4MzQzMjkyNX0.5hIdEdaNOCHIfUhRX2Fx8cyS68bKzTrt3wYw9M1cioc'),
  SITE_URL: getEnv('VITE_SITE_URL', 'https://webapp-adalparedes.vercel.app'),
  
  // SECRET KEYS (e.g., AI and Payment keys) are now exclusively handled on the server-side (/api routes).
  // They are intentionally removed from this client-side configuration to prevent security vulnerabilities.
};

export const isSupabaseLinked = (): boolean => {
  return !!ENV.SUPABASE_URL && !!ENV.SUPABASE_ANON_KEY;
};