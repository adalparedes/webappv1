import { ENV } from './env';
import { supabase } from './supabaseClient';

export type PaymentCategory = 'credits' | 'membership' | 'merch' | 'service';

interface NOWPaymentsOptions {
  userId: string;
  amount: number;
  orderId: string;
  orderDescription: string;
  category: PaymentCategory;
}

export async function createNowPaymentsInvoice({ 
  userId, 
  amount, 
  orderId, 
  orderDescription, 
  category 
}: NOWPaymentsOptions) {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error("ACCESO_RESTRINGIDO: Re-inicia sesión para procesar pagos.");
    }

    const prefixMap = {
      membership: 'MEM',
      credits: 'CRE',
      merch: 'MER',
      service: 'SER'
    };

    const prefix = prefixMap[category];
    const taggedOrderId = `${prefix}_${userId.substring(0, 8)}_${orderId}`;
    const baseUrl = ENV.SITE_URL.endsWith('/') ? ENV.SITE_URL : `${ENV.SITE_URL}/`;
    
    // Todas las solicitudes deben pasar por el API Route seguro para no exponer la Key.
    const apiRes = await fetch(`${window.location.origin}/api/crypto`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        userId: userId,
        price_amount: Number(amount.toFixed(2)), // Enviar el monto original al backend
        price_currency: 'usd',
        order_id: taggedOrderId,
        order_description: `[ADAL_CORE] ${orderDescription}`,
        category: category, // Enviar la categoría para que el backend aplique el descuento
        success_url: `${baseUrl}dashboard?payment=success&type=${category}`,
        cancel_url: `${baseUrl}dashboard?payment=cancel`,
      })
    });

    if (!apiRes.ok) {
      const errorData = await apiRes.json();
      throw new Error(errorData.message || 'Fallo en la comunicación con el nodo Crypto.');
    }

    const data = await apiRes.json();
    if (data.invoice_url) {
      window.location.href = data.invoice_url;
    } else {
      throw new Error(data.message || 'No se pudo generar el enlace de pago Crypto.');
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('[NOWPAYMENTS_ERROR]:', error.message);
    alert(`❌ CRYPTO ERROR: ${error.message}`);
    return { success: false, error: error.message };
  }
}