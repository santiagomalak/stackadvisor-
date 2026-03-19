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
  const techStack = [
    { label: 'Frontend', value: data.frontend },
    { label: 'Backend',  value: data.backend  },
    { label: 'Base de datos', value: data.database },
    { label: 'Hosting',  value: data.hosting  },
  ].filter(t => t.value);

  const techHtml = techStack.map(t => `
    <td style="padding:0 6px 0 0;">
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:8px 14px;white-space:nowrap;">
        <div style="font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:2px;">${t.label}</div>
        <div style="font-size:13px;font-weight:700;color:#0f172a;">${t.value}</div>
      </div>
    </td>
  `).join('');

  const reasonsHtml = data.reasons.slice(0, 4).map(r => `
    <tr>
      <td style="padding:6px 0;vertical-align:top;">
        <span style="color:#1d4ed8;font-weight:700;margin-right:8px;">✓</span>
        <span style="font-size:14px;color:#334155;line-height:1.5;">${r}</span>
      </td>
    </tr>
  `).join('');

  const roadmapHtml = data.roadmap.slice(0, 4).map((w, idx) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;vertical-align:top;">
        <div style="display:inline-block;background:#eff6ff;color:#1d4ed8;font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;margin-bottom:4px;">Semana ${idx + 1}</div>
        <div style="font-size:13px;font-weight:700;color:#0f172a;margin-bottom:2px;">${w.title || ''}</div>
        <div style="font-size:12px;color:#64748b;">${(w.tasks || []).slice(0, 2).join(' · ')}</div>
      </td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title>Tu stack recomendado — StackAdvisor</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;-webkit-font-smoothing:antialiased;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f5f9;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

  <!-- Header -->
  <tr><td style="background:linear-gradient(135deg,#0f172a 0%,#1e40af 100%);border-radius:16px 16px 0 0;padding:40px 48px 36px;text-align:center;">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#93c5fd;margin-bottom:20px;">Recomendación personalizada</div>
    <div style="font-size:30px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;margin-bottom:6px;">Stack<span style="color:#38bdf8;">Advisor</span></div>
    <div style="font-size:14px;color:rgba(255,255,255,0.55);">El motor de recomendación de tech stacks</div>
  </td></tr>

  <!-- Body -->
  <tr><td style="background:#ffffff;padding:40px 48px;">

    <!-- Stack name -->
    <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#1d4ed8;margin-bottom:8px;">Tu stack recomendado</div>
    <div style="font-size:28px;font-weight:900;color:#0f172a;margin-bottom:10px;letter-spacing:-0.5px;">${data.stackName}</div>
    <div style="font-size:14px;color:#64748b;line-height:1.7;margin-bottom:28px;">${data.stackDesc}</div>

    <!-- Tech stack -->
    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
      <tr>${techHtml}</tr>
    </table>

    <!-- Divider -->
    <div style="height:1px;background:#f1f5f9;margin-bottom:28px;"></div>

    <!-- Por qué -->
    <div style="font-size:13px;font-weight:700;color:#0f172a;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.04em;">Por qué este stack es el indicado</div>
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:28px;">
      ${reasonsHtml}
    </table>

    <!-- Divider -->
    <div style="height:1px;background:#f1f5f9;margin-bottom:28px;"></div>

    <!-- Roadmap -->
    <div style="font-size:13px;font-weight:700;color:#0f172a;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.04em;">Tu plan de desarrollo</div>
    <div style="font-size:12px;color:#94a3b8;margin-bottom:16px;">Primeras semanas de trabajo concreto</div>
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:28px;">
      ${roadmapHtml}
    </table>

    <!-- Costo estimado -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:36px;">
      <tr>
        <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 20px;">
          <span style="font-size:12px;font-weight:600;color:#64748b;">Costo estimado de infraestructura — </span>
          <span style="font-size:12px;font-weight:700;color:#0f172a;">${data.estimatedCost}</span>
        </td>
      </tr>
    </table>

    <!-- CTA -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr><td style="background:#0f172a;border-radius:14px;padding:32px 36px;text-align:center;">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#475569;margin-bottom:12px;">Siguiente nivel</div>
        <div style="font-size:20px;font-weight:900;color:#ffffff;margin-bottom:10px;letter-spacing:-0.3px;">Blueprint completo de tu proyecto</div>
        <div style="font-size:13px;color:#94a3b8;line-height:1.6;margin-bottom:24px;max-width:380px;margin-left:auto;margin-right:auto;">
          Arquitectura detallada · 30+ prompts para IA · Plan semana a semana · Sesión 1:1 de 30 minutos
        </div>
        <a href="https://stackadvisor-nu.vercel.app/blueprint"
           style="display:inline-block;background:#1d4ed8;color:#ffffff;font-size:14px;font-weight:700;padding:14px 36px;border-radius:10px;text-decoration:none;letter-spacing:0.01em;">
          Ver Blueprint completo →
        </a>
        <div style="margin-top:14px;font-size:12px;color:#334155;">$30 LATAM · $40 Global · Garantía de 7 días</div>
      </td></tr>
    </table>

  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#f8fafc;border-radius:0 0 16px 16px;border-top:1px solid #e2e8f0;padding:24px 48px;text-align:center;">
    <div style="font-size:13px;font-weight:600;color:#0f172a;margin-bottom:4px;">StackAdvisor</div>
    <div style="font-size:12px;color:#94a3b8;margin-bottom:10px;">El motor de recomendación de tech stacks para startups y devs.</div>
    <div style="font-size:11px;color:#cbd5e1;">Recibiste este email porque lo pediste en stackadvisor-nu.vercel.app · <a href="mailto:noreply@resend.dev" style="color:#cbd5e1;">Cancelar suscripción</a></div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
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
