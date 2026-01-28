import { supabase } from './supabaseClient';
import { ENV } from './env';

export type StripeProductType = 'membership' | 'credit_pack' | 'physical_product' | 'service';

interface StripeCheckoutOptions {
  userId: string;
  userEmail: string;
  items: Array<{
    id: string;
    type: StripeProductType;
    quantity: number;
    name?: string;
    price?: number;
  }>;
  // Compatibilidad con el flujo de Membresía/Dashboard
  serviceId?: string;
  packageIndex?: number;
  isPricingPlan?: boolean;
}

export async function initiateStripeCheckout(options: StripeCheckoutOptions) {
  const { userId, userEmail, items, serviceId, packageIndex, isPricingPlan } = options;
  
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error("ACCESO_RESTRINGIDO: Re-inicia sesión para procesar pagos.");
    }

    // Calcular el total en USD basado en los items enviados
    const amountUsd = Array.isArray(items)
      ? items.reduce((acc, item) => {
          const price = typeof item.price === 'number' ? item.price : 0;
          const qty = typeof item.quantity === 'number' ? item.quantity : 1;
          return acc + price * qty;
        }, 0)
      : 0;

    console.log(`[STRIPE_INVOKE] Conectando con Vercel API Gateway para monto: $${amountUsd}...`);

    // Llamada directa al API Route de Vercel
    const response = await fetch('/api/create-stripe-session', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        userId,
        userEmail,
        serviceId: serviceId || (items.length === 1 ? items[0].id : 'multi_item'),
        packageIndex,
        isPricingPlan,
        amountUsd, // 👈 Inyectar el monto total calculado en el frontend
        products: items.map(i => ({
          sku: i.id,
          qty: i.quantity,
          category: i.type,
          name: i.name || i.id,
          price: i.price || 0
        }))
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || "Error al generar sesión de pago.");
    }

    const result = await response.json();
    
    if (result.url) {
      window.location.href = result.url;
      return { success: true };
    } else {
      throw new Error("No se recibió una URL de redirección válida.");
    }
    
  } catch (error: any) {
    console.error('[STRIPE_FATAL_ERROR]:', error.message);
    alert(`❌ PASARELA ERROR: ${error.message}`);
    return { success: false, error: error.message };
  }
}