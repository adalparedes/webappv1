// @ts-ignore
import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  console.log(`[API_OPENAI_INVOKED] Method: ${req.method}`);
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
      console.error('[API_OPENAI_ERROR] Las variables de entorno de Supabase no están configuradas en el servidor.');
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

    const { system, userContent, attachment } = await req.json();

    if (!userContent && !attachment) {
      return new Response(JSON.stringify({ error: 'Parámetros incorrectos para este endpoint.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      const errorMessage = `La API key para 'openai' no está configurada. Agrega la variable de entorno OPENAI_API_KEY en Vercel.`;
      return new Response(JSON.stringify({ error: 'API_KEY_MISSING', message: errorMessage }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    
    let messages;
    if (attachment) {
        messages = [
            { role: 'system', content: system },
            { 
                role: 'user', 
                content: [
                    { type: 'text', text: userContent },
                    { type: 'image_url', image_url: { url: `data:${attachment.mimeType};base64,${attachment.data}` } }
                ]
            }
        ];
    } else {
        messages = [
            { role: 'system', content: system },
            { role: 'user', content: userContent }
        ];
    }

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
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
          message: `La API de 'openai' falló (${aiResponse.status}): ${externalMessage}`,
        }), { status: 502, headers: { 'Content-Type': 'application/json' } });
      } catch (e) {
        const errorText = await aiResponse.text();
        return new Response(JSON.stringify({
          error: 'EXTERNAL_API_ERROR',
          message: `La API de 'openai' falló (${aiResponse.status}): ${errorText}`,
        }), { status: 502, headers: { 'Content-Type': 'application/json' } });
      }
    }

    const decoder = new TextDecoder();
    let buffer = '';

    const transformStream = new TransformStream({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        
        let boundary;
        while ((boundary = buffer.indexOf('\n')) !== -1) {
            const line = buffer.substring(0, boundary).trim();
            buffer = buffer.substring(boundary + 1);

            if (line.startsWith('data: ')) {
                const message = line.substring('data: '.length);
                if (message.trim() === '[DONE]') {
                    controller.terminate();
                    return;
                }
                try {
                    const json = JSON.parse(message);
                    const content = json.choices[0]?.delta?.content;
                    if (content) {
                        controller.enqueue(new TextEncoder().encode(content));
                    }
                } catch (error) {
                    console.warn('[OPENAI_PROXY] SSE parse error on line:', message);
                }
            }
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
    console.error(`[API_OPENAI_PROXY_ERROR]`, error);
    return new Response(JSON.stringify({ error: 'Fallo crítico en el proxy de OpenAI', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}