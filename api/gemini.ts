// @ts-ignore
import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  console.log(`[API_GEMINI_INVOKED] Method: ${req.method}`);
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // BLINDAJE DE CONFIGURACIÓN: Verificar que las variables de Supabase existan en el entorno del servidor.
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('[API_GEMINI_ERROR] Las variables de entorno de Supabase no están configuradas en el servidor.');
      return new Response(JSON.stringify({ 
        error: 'SERVER_CONFIG_ERROR', 
        message: 'Error de configuración del servidor: Faltan las credenciales de Supabase. El administrador ha sido notificado.' 
      }), { status: 500 });
    }
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // BLINDAJE DE SEGURIDAD: Validar el token de sesión del usuario.
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ error: 'AUTH_ERROR', message: 'Token de autenticación no proporcionado.' }), { status: 401 });
    }
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authUser) {
      return new Response(JSON.stringify({ error: 'AUTH_ERROR', message: 'Token de sesión inválido o expirado.' }), { status: 401 });
    }

    const { model, system, userContent, attachment } = await req.json();

    if (model !== 'gemini' || (!userContent && !attachment)) {
      return new Response(JSON.stringify({ error: 'Parámetros incorrectos para este endpoint.' }), { status: 400 });
    }

    const { GoogleGenAI } = await import('@google/genai');
    
    // FIX: The project is configured to use GEMINI_API_KEY, not a generic API_KEY.
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const errorMessage = `La API key para 'gemini' no está configurada. Agrega la variable de entorno GEMINI_API_KEY en Vercel.`;
      return new Response(JSON.stringify({ error: 'API_KEY_MISSING', message: errorMessage }), { status: 500 });
    }
    
    const ai = new GoogleGenAI({ apiKey });
    
    const contents = attachment 
      ? { parts: [{ inlineData: { mimeType: attachment.mimeType, data: attachment.data } }, { text: userContent }] }
      : userContent;

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: { systemInstruction: system, temperature: 0.7 }
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of responseStream) {
          if (chunk.text) {
            controller.enqueue(new TextEncoder().encode(chunk.text));
          }
        }
        controller.close();
      }
    });

    return new Response(readableStream, {
      headers: { 
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error(`[API_GEMINI_PROXY_ERROR]`, error);
    return new Response(JSON.stringify({ error: 'Fallo crítico en el proxy de Gemini', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}