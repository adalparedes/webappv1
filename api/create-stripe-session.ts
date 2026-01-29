import Stripe from 'stripe';
// @ts-ignore - This module is resolved by the Vercel runtime environment
import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

/**
 * FUENTE DE VERDAD DE PRECIOS - REFORZADA
 */
const PRICING_PLANS = [
  { id: 'FREE', name: 'Plan Piojoso', price_usd: 0 },
  { id: 'NOVATO', name: 'Plan Novato / Novata', price_usd: 19.99 },
  { id: 'JEFE', name: 'Plan Jefe / Patrona', price_usd: 49.99 },
  { id: 'PREMIUM', name: 'Plan Rey / Reina', price_usd: 99.00 }
];

// FIX: Se crea una fuente de verdad local para los paquetes de créditos.
// Esto soluciona el error de "Paquete no encontrado" al eliminar la consulta a Supabase,
// que fallaba por políticas de RLS en el entorno del servidor.
const CREDIT_PACKS = [
  { code: 'mini_boost', name: 'Mini Boost', price_usd: 4.97 },
  { code: 'carga_media', name: 'Carga Media', price_usd: 9.97 },
  { code: 'pro_boost', name: 'Pro Boost', price_usd: 19.97 },
  { code: 'legend_boost', name: 'Legend Boost', price_usd: 49.97 },
];

const PHYSICAL_PRODUCTS = [
  { id: 'p1', name: 'Hacker Hoodie V2', price: 59.99 },
  { id: 'p2', name: 'AP Tech Cap', price: 24.99 },
];

const SERVICES: Record<string, { name: string, price_usd: number }> = {
  'SVC_WEB/APP_DEVELOPMENT': { name: 'Web/App Development', price_usd: 1500 },
  'SVC_TECH_CONSULTATION': { name: 'Tech Consultation', price_usd: 150 },
  'SVC_CYBERSECURITY_ADVISORY': { name: 'Cybersecurity Advisory', price_usd: 1200 },
};

const stripeSecret = process.env.STRIPE_KEY;
const siteUrl = process.env.VITE_SITE_URL || 'https://webapp-adalparedes.vercel.app';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const stripe = stripeSecret ? new Stripe(stripeSecret, {
  apiVersion: '2024-06-20' as any,
  // @ts-ignore
  httpClient: Stripe.createFetchHttpClient()
}) : null;

const allowedOrigins = [
    'https://adalparedes.com', 
    'https://webapp-adalparedes.vercel.app', 
    'http://localhost:3000', 
    'http://localhost:5173'
];

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

  if (!stripe) {
    return new Response(JSON.stringify({ error: 'Config Error', message: 'STRIPE_KEY missing.' }), { status: 500, headers: corsHeaders });
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

    const { userId, userEmail, products, amountUsd } = await req.json();

    if (authUser.id !== userId) {
      return new Response(JSON.stringify({ error: 'FORBIDDEN', message: 'Intento de suplantación de identidad detectado.' }), { status: 403, headers: corsHeaders });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return new Response(JSON.stringify({ error: 'BAD_REQUEST', message: 'No se proporcionaron productos en la solicitud.' }), { status: 400, headers: corsHeaders });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let calculatedTotal = 0;

    for (const item of products) {
      const { sku, qty, category, price: clientPrice } = item;
      let serverPrice = 0;
      let productName = '';
      
      switch(category) {
        case 'membership':
          const plan = PRICING_PLANS.find(p => p.id === sku);
          if (!plan) throw new Error(`Plan de membresía inválido: ${sku}`);
          serverPrice = plan.price_usd;
          productName = plan.name;
          break;
        case 'credit_pack':
          // FIX: Se reemplaza la consulta a Supabase por una búsqueda en la constante local.
          // Esto resuelve el error de RLS y asegura que el precio es verificado por el servidor.
          const pack = CREDIT_PACKS.find(p => p.code.toLowerCase() === sku.toLowerCase());
          if (!pack) {
            console.error(`[STRIPE_SESSION_ERROR] Paquete de créditos inválido o no encontrado en la configuración local: ${sku}`);
            throw new Error(`Paquete de créditos inválido o no encontrado: ${sku}`);
          }
          serverPrice = pack.price_usd;
          productName = pack.name;
          break;
        case 'physical_product':
          const product = PHYSICAL_PRODUCTS.find(p => p.id === sku);
          if (!product) throw new Error(`Producto físico inválido: ${sku}`);
          serverPrice = product.price;
          productName = product.name;
          break;
        case 'service':
          const service = SERVICES[sku];
          if (!service) throw new Error(`Servicio inválido: ${sku}`);
          const basePrice = service.price_usd;
          // El descuento se aplica en el frontend y se valida aquí para evitar manipulación
          const discountedPrice = basePrice * 0.90; 
          if (Math.abs(clientPrice - discountedPrice) < 0.01) {
            serverPrice = discountedPrice;
          } else {
             serverPrice = basePrice;
          }
          productName = service.name;
          break;
        default:
          throw new Error(`Categoría de producto desconocida: ${category}`);
      }

      calculatedTotal += serverPrice * (qty || 1);
      line_items.push({
        price_data: { currency: 'usd', unit_amount: Math.round(serverPrice * 100), product_data: { name: productName, description: `SKU: ${sku}` }, },
        quantity: qty || 1,
      });
    }
    
    if (amountUsd && Math.abs(calculatedTotal - amountUsd) > 0.05) {
       console.warn(`[STRIPE_AUDIT] Discrepancia en monto: Frontend $${amountUsd} vs Backend $${calculatedTotal}`);
    }

    if (calculatedTotal < 0.50) {
        return new Response(JSON.stringify({ error: 'INVALID_AMOUNT', message: `El monto total debe ser al menos $0.50 USD.`}), { status: 400, headers: corsHeaders });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      customer_email: userEmail,
      success_url: `${siteUrl}/dashboard?payment=success&gateway=stripe`,
      cancel_url: `${siteUrl}/dashboard?payment=cancel&gateway=stripe`,
      metadata: { userId: userId, skus: products.map((p: any) => `${p.sku}x${p.qty || 1}`).join(','), },
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json'} });
  } catch (err: any) {
    console.error('[STRIPE_FATAL_ERROR]:', err);
    return new Response(JSON.stringify({ error: 'Stripe API Error', message: err.message || 'Error en la comunicación con Stripe.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json'} });
  }
}