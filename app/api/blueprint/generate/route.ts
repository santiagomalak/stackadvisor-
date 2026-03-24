import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'edge';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { answers } = await request.json();

    if (!answers) {
      return new Response(JSON.stringify({ error: 'Answers required' }), { status: 400 });
    }

    const infraBudget = answers.infra_budget || '$0 (solo free tiers)';
    const teamSize    = answers.team        || 'Solo (soy el único dev)';
    const isSolo      = teamSize.toLowerCase().includes('solo') || teamSize.includes('único');

    const prompt = `Sos un arquitecto de software senior especializado en proyectos para startups y devs independientes.
Basándote en las respuestas del cliente, generá un Blueprint de desarrollo completo y detallado en español.

=== RESPUESTAS DEL CLIENTE ===
Proyecto: ${answers.project_name || 'Sin nombre'}
Descripción: ${answers.project_desc || ''}
Problema que resuelve: ${answers.main_problem || ''}
Usuario objetivo: ${answers.target_user || ''}
Competidores/referencias: ${answers.competitors || ''}
Features principales: ${answers.core_features || ''}
Autenticación: ${answers.auth_type || ''}
Pagos: ${answers.payments || ''} - Plataforma: ${answers.payment_platform || ''}
Tiempo real: ${answers.realtime || ''}
Subida de archivos: ${answers.file_upload || ''}
Roles de usuario: ${answers.roles || ''}
Plataforma: ${answers.platform || ''}
Estado del código: ${answers.existing_code || ''}
Equipo: ${teamSize}
Horas por semana: ${answers.dev_hours || ''}
Fecha de lanzamiento: ${answers.launch_date || ''}
Monetización: ${answers.monetization || ''}
Usuarios esperados (3 meses): ${answers.mvp_users || ''}
Presupuesto infra/mes declarado: ${infraBudget}
Presupuesto total: ${answers.total_budget || ''}
Mayor miedo: ${answers.biggest_fear || ''}
Intentos anteriores: ${answers.tried_before || ''}
Dudas técnicas: ${answers.specific_doubts || ''}
Contexto extra: ${answers.extra_context || ''}

=== INSTRUCCIONES CRÍTICAS ===
1. Sé específico, concreto y accionable. Usá el nombre del proyecto. Evitá respuestas genéricas.
2. Costos anclados al presupuesto declarado: "${infraBudget}". Tres escenarios: MVP, Crecimiento, Escala.
3. Adaptá el plan al equipo: "${teamSize}". ${isSolo ? 'Dev solo: simplicidad, sin over-engineering.' : 'Incluí git workflow y coordinación.'}
4. Plan realista con las horas disponibles: "${answers.dev_hours || 'no especificado'}".

Respondé en Markdown con estas secciones exactas:

# Blueprint de Desarrollo — ${answers.project_name || '[nombre del proyecto]'}

## 1. Resumen Ejecutivo
## 2. Stack Tecnológico Recomendado
## 3. Arquitectura del Sistema
## 4. Estructura de Carpetas
## 5. Esquema de Base de Datos
## 6. Plan de Desarrollo — Semana a Semana
## 7. Prompts Listos para IA (mínimo 10, copiables directo en Cursor/Claude)
## 8. Estimación de Costos (tabla: Servicio | MVP | Crecimiento | Escala)
## 9. Riesgos y Cómo Mitigarlos (top 5, con estrategia de mitigación)
## 10. Primeros 3 Pasos Para HOY (con comandos o links exactos)`;

    const model  = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContentStream(prompt);

    const encoder = new TextEncoder();
    const stream  = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) controller.enqueue(encoder.encode(text));
          }
        } catch (e) {
          controller.error(e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: any) {
    console.error('Blueprint generate error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
