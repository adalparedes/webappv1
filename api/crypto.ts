// @ts-ignore - This module is resolved by the Vercel runtime environment
import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

const allowedOrigins = [
  'https://adalparedes.com',
  'https://webapp-adalparedes.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
];

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function getCorsHeaders(origin: string | null): Record<string, string> {
    const headers: Record<string, string> = {
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    if (origin && allowedOrigins.includes(origin)) {
        headers['Access-Control-Allow-Origin'] = origin;
    }
    return headers;
}

export default async function handler(req: Request) {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: corsHeaders });
  }

  if (!process.env.NOW_PAYMENTS_API_KEY) {
    return new Response(JSON.stringify({ error: 'Config Error', message: 'NOW_PAYMENTS_API_KEY is missing.' }), { status: 500, headers: corsHeaders });
  }

  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ error: 'AUTH_ERROR', message: 'Token de autenticación no proporcionado.' }), { status: 401, headers: corsHeaders });
    }

    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authUser) {
      return new Response(JSON.stringify({ error: 'AUTH_ERROR', message: 'Token de sesión inválido o expirado.' }), { status: 401, headers: corsHeaders });
    }
    
    const { userId, price_amount, category, ...invoiceData } = await req.json();

    if (authUser.id !== userId) {
      return new Response(JSON.stringify({ error: 'FORBIDDEN', message: 'Intento de suplantación de identidad detectado.' }), { status: 403, headers: corsHeaders });
    }

    let finalAmount = price_amount;
    let finalDescription = invoiceData.order_description || '';

    if (finalAmount <= 0) {
        return new Response(JSON.stringify({ error: 'INVALID_AMOUNT', message: 'El monto debe ser mayor a 0.' }), { status: 400, headers: corsHeaders });
    }

    if (category === 'credits' || category === 'membership') {
      const discount = 0.15; // 15% OFF
      finalAmount = price_amount * (1 - discount);
      finalDescription += " [15% CRYPTO DISCOUNT APPLIED]";
      console.log(`[NOWPAYMENTS_PROMO_SERVER] Aplicando incentivo del 15% en ${category}. De $${price_amount} a $${finalAmount.toFixed(2)}`);
    }

    const formattedAmount = Number(finalAmount.toFixed(2));
    
    const siteUrl = process.env.SITE_URL || 'https://webapp-adalparedes.vercel.app';
    const baseUrl = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`;

    const response = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.NOW_PAYMENTS_API_KEY as string,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...invoiceData,
        price_amount: formattedAmount,
        order_description: finalDescription,
        success_url: `${baseUrl}dashboard?payment=success&type=${category}`,
        cancel_url: `${baseUrl}dashboard?payment=cancel`,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
        console.error('NOWPayments API Error:', data);
        throw new Error(data.message || `NOWPayments API Error: ${response.status}`);
    }

    return new Response(JSON.stringify(data), { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json'} });

  } catch (err: any) {
    console.error('NOWPayments error:', err);
    return new Response(JSON.stringify({ error: 'Crypto Gateway Error', message: err.message || 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json'} });
  }
}