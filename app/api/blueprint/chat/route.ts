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

    const systemContext = `Sos un experto en desarrollo de software y arquitectura de sistemas, especializado en ayudar a devs independientes y startups a implementar sus proyectos.

Tu rol: ayudar a implementar el proyecto paso a paso, resolver dudas técnicas concretas, dar código funcional cuando se pide, y guiar cuando se trabe.

Reglas de respuesta:
- Siempre en español
- Directo al punto, sin introducción innecesaria
- Si la pregunta es técnica, incluí código concreto (no pseudocódigo)
- Si hay varias opciones, recomendá una y justificá brevemente
- Máximo 3-4 párrafos de texto, sin límite en el código
- Usá el contexto del Blueprint para dar respuestas específicas al proyecto, no genéricas

=== BLUEPRINT DEL PROYECTO (resumen) ===
${blueprint ? blueprint.slice(0, 4000) : 'No disponible'}

=== DATOS DEL PROYECTO ===
Nombre: ${answers?.project_name || 'No especificado'}
Plataforma: ${answers?.platform || 'No especificado'}
Estado del código: ${answers?.existing_code || 'No especificado'}
Equipo: ${answers?.team || 'No especificado'}
Horas/semana: ${answers?.dev_hours || 'No especificado'}
Presupuesto infra: ${answers?.infra_budget || 'No especificado'}
Pagos: ${answers?.payments || 'No'} - ${answers?.payment_platform || ''}
Autenticación: ${answers?.auth_type || 'No especificado'}`;

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
