import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { answers } = await request.json();

    if (!answers) {
      return NextResponse.json({ error: 'Answers required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Parse infra budget range for cost anchoring
    const infraBudget = answers.infra_budget || '$0 (solo free tiers)';
    const mvpUsers = answers.mvp_users || 'No tengo idea';
    const teamSize = answers.team || 'Solo (soy el único dev)';
    const isSolo = teamSize.toLowerCase().includes('solo') || teamSize.includes('único');

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
Usuarios esperados (3 meses): ${mvpUsers}
Presupuesto infra/mes declarado: ${infraBudget}
Presupuesto total: ${answers.total_budget || ''}
Mayor miedo: ${answers.biggest_fear || ''}
Intentos anteriores: ${answers.tried_before || ''}
Dudas técnicas: ${answers.specific_doubts || ''}
Contexto extra: ${answers.extra_context || ''}

=== INSTRUCCIONES CRÍTICAS ===
1. Sé específico, concreto y accionable. Usá el nombre del proyecto. Evitá respuestas genéricas.
2. En la sección de costos: los números DEBEN ser consistentes con el presupuesto declarado ("${infraBudget}").
   Si el usuario declaró "$0 (solo free tiers)", mostrá cómo llegar a $0/mes con free tiers reales.
   Si declaró "$10-30/mes", el stack MVP no puede costar más de eso.
   Mostrá tres escenarios: MVP (según su presupuesto), Crecimiento (2-3x usuarios) y Escala (10x usuarios).
   Listá cada servicio con su costo real exacto en USD.
3. En la sección de equipo y plan: adaptá el ritmo y las herramientas al tamaño del equipo ("${teamSize}").
   ${isSolo ? 'Es un dev solo: priorizá simplicidad, evitá over-engineering, herramientas sin overhead de coordinación.' : 'Incluí recomendaciones de git workflow, code review, y coordinación de equipo.'}
4. El plan de desarrollo debe ser realista con las horas disponibles ("${answers.dev_hours || 'no especificado'}").

Formato de respuesta en Markdown:

# Blueprint de Desarrollo — ${answers.project_name || '[nombre del proyecto]'}

## 1. Resumen Ejecutivo
(2-3 párrafos: qué es el proyecto, el potencial real del mercado, y la estrategia recomendada)

## 2. Stack Tecnológico Recomendado
(Cada tecnología con: nombre, por qué es la mejor opción para ESTE proyecto, y alternativas descartadas)

## 3. Arquitectura del Sistema
(Diagrama ASCII o descripción del flujo de datos entre componentes: cliente → API → DB → servicios externos)

## 4. Estructura de Carpetas
(Árbol de directorios completo, listo para copiar, con una línea explicando qué va en cada carpeta/archivo)

## 5. Esquema de Base de Datos
(Tablas/colecciones con campos, tipos, y relaciones. Indicar índices importantes.)

## 6. Plan de Desarrollo — Semana a Semana
(Semanas numeradas, adaptado a "${answers.dev_hours || 'horas disponibles'}" y fecha objetivo "${answers.launch_date || 'sin fecha fija'}". Qué entregar al final de cada semana.)

## 7. Prompts Listos para IA
(Mínimo 10 prompts específicos para Cursor/Claude, organizados por fase. Cada prompt debe ser copiable directamente.)

## 8. Estimación de Costos
IMPORTANTE: Usar como base el presupuesto declarado: "${infraBudget}"
Mostrar tabla con tres columnas: Servicio | MVP (mes 1-3) | Crecimiento (mes 4-6) | Escala (mes 7-12)
Cada fila: nombre del servicio, plan/tier específico, costo en USD.
Última fila: TOTAL por escenario.
Nota si algún servicio tiene free tier aprovechable.

## 9. Riesgos y Cómo Mitigarlos
(Top 5 riesgos específicos de este proyecto. Formato: Riesgo → Probabilidad → Impacto → Estrategia de mitigación)

## 10. Primeros 3 Pasos Para HOY
(Tres acciones concretas e inmediatas, con comandos o links exactos donde aplique)`;

    const result = await model.generateContent(prompt);
    const blueprint = result.response.text();

    return NextResponse.json({ blueprint });
  } catch (error: any) {
    console.error('Gemini error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
