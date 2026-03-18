import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const MAX_MESSAGES = 50;

export async function POST(request: NextRequest) {
  try {
    const { message, history, blueprint, answers, messageCount } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    if (messageCount >= MAX_MESSAGES) {
      return NextResponse.json({
        error: 'limit_reached',
        reply: `Alcanzaste el límite de ${MAX_MESSAGES} mensajes incluidos en tu Blueprint. Para seguir recibiendo ayuda, podés coordinar una sesión adicional con nuestro equipo.`,
      }, { status: 429 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemContext = `Sos un experto en desarrollo de software y arquitectura de sistemas.
Tenés acceso al Blueprint completo del proyecto del cliente y a sus respuestas del cuestionario.
Tu rol es ayudarlo a implementar su proyecto paso a paso, responder dudas técnicas específicas y guiarlo cuando se trabe.
Respondé siempre en español, de forma clara, directa y con ejemplos de código cuando sea relevante.
Máximo 3 párrafos por respuesta + código si aplica. No des vueltas.

=== BLUEPRINT DEL PROYECTO ===
${blueprint ? blueprint.slice(0, 3000) : 'No disponible'}

=== DATOS DEL PROYECTO ===
Nombre: ${answers?.project_name || 'No especificado'}
Stack: ${answers?.platform || 'No especificado'}
Nivel del dev: ${answers?.existing_code || 'No especificado'}
Horas/semana: ${answers?.dev_hours || 'No especificado'}`;

    // Build chat history for context
    const chatHistory = (history || []).slice(-10).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemContext }] },
        { role: 'model', parts: [{ text: 'Entendido. Estoy listo para ayudarte con tu proyecto. ¿En qué estás trabajando?' }] },
        ...chatHistory,
      ],
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    return NextResponse.json({
      reply,
      messagesUsed: messageCount + 1,
      messagesRemaining: MAX_MESSAGES - (messageCount + 1),
    });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
