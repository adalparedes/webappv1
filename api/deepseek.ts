// @ts-ignore
import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  console.log(`[API_DEEPSEEK_INVOKED] Method: ${req.method}`);
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
      console.error('[API_DEEPSEEK_ERROR] Las variables de entorno de Supabase no están configuradas en el servidor.');
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
    
    const { system, userContent } = await req.json();

    if (!userContent) {
      return new Response(JSON.stringify({ error: 'Parámetros incorrectos para este endpoint.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      const errorMessage = `La API key para 'deepseek' no está configurada. Agrega la variable de entorno DEEPSEEK_API_KEY en Vercel.`;
      return new Response(JSON.stringify({ error: 'API_KEY_MISSING', message: errorMessage }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    
    const messages = [
        { role: 'system', content: system },
        { role: 'user', content: userContent }
    ];

    const aiResponse = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        stream: true,
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok || !aiResponse.body) {
      try {
        const errorJson = await aiResponse.json();
        const externalMessage = errorJson?.error?.message || JSON.stringify(errorJson);
        return new Response(JSON.stringify({
          error: 'EXTERNAL_API_ERROR',
          message: `La API de 'deepseek' falló (${aiResponse.status}): ${externalMessage}`,
        }), { status: 502, headers: { 'Content-Type': 'application/json' } });
      } catch (e) {
        const errorText = await aiResponse.text();
        return new Response(JSON.stringify({
          error: 'EXTERNAL_API_ERROR',
          message: `La API de 'deepseek' falló (${aiResponse.status}): ${errorText}`,
        }), { status: 502, headers: { 'Content-Type': 'application/json' } });
      }
    }

    const decoder = new TextDecoder();
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const decodedChunk = decoder.decode(chunk, { stream: true });
        const lines = decodedChunk.split('\n').filter(line => line.trim().startsWith('data: '));

        for (const line of lines) {
          const message = line.replace(/^data: /, '');
          if (message === '[DONE]') {
            controller.terminate();
            return;
          }
          try {
            const json = JSON.parse(message);
            const content = json.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          } catch (error) {}
        }
      },
    });

    return new Response(aiResponse.body.pipeThrough(transformStream), {
      headers: { 
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error(`[API_DEEPSEEK_PROXY_ERROR]`, error);
    return new Response(JSON.stringify({ error: 'Fallo crítico en el proxy de DeepSeek', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
