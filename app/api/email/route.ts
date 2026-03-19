import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function buildEmailHtml(data: {
  email: string;
  stackName: string;
  stackDesc: string;
  reasons: string[];
  roadmap: { week: string; title: string; tasks: string[] }[];
  estimatedCost: string;
  frontend: string;
  backend: string;
  database: string;
  hosting: string;
}) {
  const reasonsHtml = data.reasons
    .slice(0, 4)
    .map(r => `<li style="margin-bottom:6px;color:#475569;">${r}</li>`)
    .join('');

  const roadmapHtml = data.roadmap
    .slice(0, 4)
    .map(w => `
      <div style="margin-bottom:12px;padding:12px 16px;background:#f8fafc;border-radius:8px;border-left:3px solid #1d4ed8;">
        <div style="font-weight:700;font-size:13px;color:#1d4ed8;margin-bottom:4px;">${w.week} — ${w.title}</div>
        <div style="font-size:12px;color:#64748b;">${w.tasks.slice(0, 2).join(' · ')}</div>
      </div>
    `).join('');

  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',system-ui,sans-serif;">

<div style="max-width:580px;margin:32px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#1e3a5f,#1d4ed8);padding:36px 40px;text-align:center;">
    <div style="display:inline-block;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);color:#7dd3fc;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:4px 14px;border-radius:999px;margin-bottom:16px;">Tu recomendación personalizada</div>
    <h1 style="margin:0;color:white;font-size:26px;font-weight:900;letter-spacing:-0.5px;">Stack<span style="color:#38bdf8;">Advisor</span></h1>
    <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:14px;">Tu plan de desarrollo está listo</p>
  </div>

  <!-- Stack recomendado -->
  <div style="padding:32px 40px 0;">
    <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#1d4ed8;">Stack recomendado para vos</p>
    <h2 style="margin:0 0 8px;font-size:24px;font-weight:900;color:#0f172a;">${data.stackName}</h2>
    <p style="margin:0 0 20px;font-size:14px;color:#64748b;line-height:1.6;">${data.stackDesc}</p>

    <!-- Tech pills -->
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px;">
      ${[
        { label: 'Frontend', value: data.frontend },
        { label: 'Backend', value: data.backend },
        { label: 'DB', value: data.database },
        { label: 'Hosting', value: data.hosting },
      ].map(t => `
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:6px 12px;">
          <div style="font-size:10px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:0.05em;">${t.label}</div>
          <div style="font-size:12px;font-weight:600;color:#0f172a;">${t.value}</div>
        </div>
      `).join('')}
    </div>

    <!-- Por qué -->
    <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#0f172a;">¿Por qué este stack es perfecto para vos?</p>
    <ul style="margin:0 0 24px;padding-left:18px;">
      ${reasonsHtml}
    </ul>

    <div style="height:1px;background:#e2e8f0;margin-bottom:24px;"></div>

    <!-- Roadmap -->
    <p style="margin:0 0 14px;font-size:13px;font-weight:700;color:#0f172a;">Tu roadmap — primeras 4 semanas</p>
    ${roadmapHtml}

    <!-- Costo -->
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px 18px;margin-bottom:24px;">
      <span style="font-size:12px;font-weight:700;color:#15803d;">💰 Costo estimado de infraestructura: </span>
      <span style="font-size:12px;color:#166534;">${data.estimatedCost}</span>
    </div>
  </div>

  <!-- CTA Blueprint -->
  <div style="margin:0 40px 32px;background:linear-gradient(135deg,#1e3a5f,#1d4ed8);border-radius:12px;padding:28px 32px;text-align:center;">
    <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:0.08em;">¿Querés ir más profundo?</p>
    <h3 style="margin:0 0 10px;color:white;font-size:18px;font-weight:900;">Obtené el Blueprint completo</h3>
    <p style="margin:0 0 20px;color:rgba(255,255,255,0.75);font-size:13px;line-height:1.6;">Arquitectura detallada, estructura de carpetas, 30+ prompts de IA, plan semana a semana, estimación de costos real y sesión 1:1 de 30 min.</p>
    <a href="https://stackadvisor-nu.vercel.app/blueprint" style="display:inline-block;background:#22c55e;color:white;font-weight:700;font-size:15px;padding:14px 32px;border-radius:10px;text-decoration:none;">
      Obtener mi Blueprint →
    </a>
    <p style="margin:12px 0 0;font-size:11px;color:rgba(255,255,255,0.4);">$30 LATAM · $40 Global · Garantía 7 días</p>
  </div>

  <!-- Footer -->
  <div style="padding:0 40px 32px;text-align:center;border-top:1px solid #e2e8f0;padding-top:20px;">
    <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">StackAdvisor · El motor de recomendación de tech stacks</p>
    <p style="margin:0;font-size:11px;color:#cbd5e1;">Recibiste este email porque lo solicitaste en stackadvisor-nu.vercel.app</p>
  </div>

</div>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, stack, reasons, roadmap } = body;

    if (!email || !stack) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    const html = buildEmailHtml({
      email,
      stackName: stack.name,
      stackDesc: stack.description,
      reasons: reasons || stack.bestFor?.map((b: string) => `Ideal para: ${b}`) || [],
      roadmap: roadmap || [],
      estimatedCost: stack.estimatedCost || 'Gratis para empezar',
      frontend: stack.technologies?.frontend || '',
      backend: stack.technologies?.backend || '',
      database: stack.technologies?.database || '',
      hosting: stack.technologies?.hosting || '',
    });

    const { error } = await resend.emails.send({
      from: 'StackAdvisor <onboarding@resend.dev>',
      to: email,
      subject: `Tu stack recomendado: ${stack.name} — StackAdvisor`,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Error enviando email' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
