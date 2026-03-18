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
Equipo: ${answers.team || ''}
Horas por semana: ${answers.dev_hours || ''}
Fecha de lanzamiento: ${answers.launch_date || ''}
Monetización: ${answers.monetization || ''}
Usuarios esperados (3 meses): ${answers.mvp_users || ''}
Presupuesto infra/mes: ${answers.infra_budget || ''}
Presupuesto total: ${answers.total_budget || ''}
Mayor miedo: ${answers.biggest_fear || ''}
Intentos anteriores: ${answers.tried_before || ''}
Dudas técnicas: ${answers.specific_doubts || ''}
Contexto extra: ${answers.extra_context || ''}

=== INSTRUCCIONES ===
Generá un Blueprint completo con estas secciones. Sé específico, concreto y accionable.
Usá el nombre del proyecto cuando esté disponible. Evitá respuestas genéricas.

Formato de respuesta en Markdown:

# Blueprint de Desarrollo — [nombre del proyecto]

## 1. Resumen Ejecutivo
(2-3 párrafos explicando el proyecto, su potencial y la estrategia recomendada)

## 2. Stack Tecnológico Recomendado
(Lista detallada de cada tecnología con justificación específica para ESTE proyecto)

## 3. Arquitectura del Sistema
(Diagrama en texto ASCII o descripción detallada del flujo de datos y componentes)

## 4. Estructura de Carpetas
(Estructura completa lista para copiar con descripción de cada carpeta/archivo importante)

## 5. Esquema de Base de Datos
(Tablas/colecciones principales con sus campos y relaciones)

## 6. Plan de Desarrollo — Semana a Semana
(Plan detallado adaptado a las horas disponibles y fecha de lanzamiento)

## 7. Prompts Listos para IA
(Mínimo 8 prompts específicos para Cursor/Claude organizados por fase del proyecto)

## 8. Estimación de Costos
(Desglose mensual por servicio desde $0 hasta la escala proyectada)

## 9. Riesgos y Cómo Mitigarlos
(Top 5 riesgos específicos de este proyecto con estrategia de mitigación)

## 10. Primeros 3 Pasos Para HOY
(Acciones concretas e inmediatas para arrancar hoy mismo)`;

    const result = await model.generateContent(prompt);
    const blueprint = result.response.text();

    return NextResponse.json({ blueprint });
  } catch (error: any) {
    console.error('Gemini error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
