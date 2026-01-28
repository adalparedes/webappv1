
import { supabase } from './supabaseClient';

export interface CreditPack {
  code: string;
  name: string;
  price_usd: number;
  credits: number;
  is_active: boolean;
  sort_order: number;
}

export interface ApplyCreditResult {
  success: boolean;
  error?: string;
  newBalance?: number;
}

/**
 * Registra y procesa una transacción exitosa de créditos.
 * CRITICAL: Valida los datos contra la tabla 'credit_packs' para evitar inyecciones fraudulentas desde el cliente.
 * 
 * @param userId ID del usuario en Supabase Auth
 * @param packCode Código único del paquete (ej: 'BASE_100')
 * @param paymentMethod Método utilizado ('card', 'crypto', etc.)
 * @param externalRef Referencia de la pasarela (Stripe ID, NOWPayments ID)
 */
export async function processSuccessfulTransaction(
  userId: string,
  packCode: string,
  paymentMethod: string,
  externalRef: string
): Promise<ApplyCreditResult> {
  if (!userId) throw new Error('[SEC_ERROR]: ID de usuario no proporcionado.');

  try {
    // 1. Obtener la fuente de verdad del paquete de créditos directamente de la DB
    const { data: pack, error: packError } = await supabase
      .from('credit_packs')
      .select('credits, price_usd, name')
      .eq('code', packCode)
      .single();

    if (packError || !pack) {
      throw new Error(`[SEC_ERROR]: El paquete ${packCode} no es un nodo válido en el sistema.`);
    }

    // 2. Insertar el registro de la transacción exitosa en el ledger
    const { error: txError } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: userId,
        pack_code: packCode,
        credits_delta: pack.credits,
        amount_usd: pack.price_usd,
        payment_method: paymentMethod,
        status: 'success',
        external_ref: externalRef,
        metadata: { 
          processed_at: new Date().toISOString(), 
          source: 'adal_core_v3_secure_helper',
          pack_name: pack.name 
        }
      });

    if (txError) throw new Error(`[DB_ERROR]: Fallo al registrar la transacción en el ledger: ${txError.message}`);

    // 3. Obtener el perfil actual para asegurar una suma atómica correcta
    const { data: profile, error: profileFetchError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (profileFetchError) throw new Error(`[DB_ERROR]: No se pudo recuperar el perfil del nodo ${userId} para inyección.`);

    const currentCredits = profile?.credits || 0;
    const newBalance = currentCredits + pack.credits;

    // 4. Actualizar el perfil con el nuevo balance de créditos calculado
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credits: newBalance })
      .eq('id', userId);

    if (updateError) throw new Error(`[DB_ERROR]: Error al inyectar créditos en el perfil: ${updateError.message}`);

    console.log(`[CORE_SYNC] Sincronización exitosa: +${pack.credits} CR inyectados en nodo ${userId}. Ref: ${externalRef}`);
    
    return { 
      success: true, 
      newBalance 
    };

  } catch (err: any) {
    console.error('[CREDITS_CORE_FATAL]:', err.message);
    return { 
      success: false, 
      error: err.message || 'Error desconocido en el núcleo de créditos.' 
    };
  }
}

/**
 * Helper existente para iniciar procesos de recarga (soporta estados pendientes).
 */
export async function applyCreditPack(
  userId: string,
  packCode: string,
  paymentMethod: string,
  externalRef?: string
): Promise<ApplyCreditResult> {
  if (!userId) return { success: false, error: 'Sesión de usuario no válida.' };

  try {
    // Si es un método que ya confirmó éxito (como el callback de Stripe), procesamos directamente
    if (paymentMethod === 'card' && externalRef) {
      return await processSuccessfulTransaction(userId, packCode, paymentMethod, externalRef);
    }

    // Para métodos manuales o asíncronos (Wire/SPEI), registramos como 'pending'
    const { data: pack } = await supabase
      .from('credit_packs')
      .select('credits, price_usd')
      .eq('code', packCode)
      .single();

    if (!pack) throw new Error('Nodo de paquete no encontrado en el sistema.');

    const { error: txError } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: userId,
        pack_code: packCode,
        credits_delta: pack.credits,
        amount_usd: pack.price_usd,
        payment_method: paymentMethod,
        status: 'pending',
        external_ref: externalRef || `REQ_${Date.now()}`
      });

    if (txError) throw txError;

    return { success: true };
  } catch (err: any) {
    console.error('[Credits] Initiation Failure:', err);
    return { success: false, error: err.message || 'Error en el núcleo de créditos.' };
  }
}
