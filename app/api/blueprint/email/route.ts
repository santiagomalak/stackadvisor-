import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const WHATSAPP = 'https://wa.me/5493834553249?text=Hola%20Santiago%2C%20compr%C3%A9%20el%20Blueprint%20de%20StackAdvisor%20y%20quiero%20coordinar%20mi%20sesi%C3%B3n%201%3A1';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://stackadvisor-nu.vercel.app';

function buildBlueprintEmail(projectName: string, blueprint: string): string {
  // Convert simple markdown to plain-email-safe HTML for the preview block
  const escaped = blueprint
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Tu Blueprint de ${projectName} — StackAdvisor</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;-webkit-font-smoothing:antialiased;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f5f9;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

  <!-- Header -->
  <tr><td style="background:linear-gradient(135deg,#0f172a 0%,#1e40af 100%);border-radius:16px 16px 0 0;padding:40px 48px 36px;text-align:center;">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#93c5fd;margin-bottom:16px;">Blueprint Premium</div>
    <div style="font-size:30px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;margin-bottom:6px;">Stack<span style="color:#38bdf8;">Advisor</span></div>
    <div style="font-size:13px;color:rgba(255,255,255,0.55);">Tu plan de desarrollo personalizado está listo</div>
  </td></tr>

  <!-- Body -->
  <tr><td style="background:#ffffff;padding:40px 48px;">

    <!-- Title -->
    <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#1d4ed8;margin-bottom:8px;">Tu Blueprint</div>
    <div style="font-size:26px;font-weight:900;color:#0f172a;margin-bottom:10px;letter-spacing:-0.5px;">${projectName} 🎉</div>
    <div style="font-size:14px;color:#64748b;line-height:1.7;margin-bottom:28px;">
      Tu Blueprint completo ya está generado. Incluye tu stack recomendado, arquitectura del sistema, plan semana a semana, prompts para IA y estimación de costos — todo personalizado a tu proyecto.
    </div>

    <!-- Notice -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:32px;">
      <tr><td style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:14px 18px;">
        <div style="font-size:13px;color:#1e40af;line-height:1.6;">
          <strong>📌 Acceso permanente:</strong> Tu Blueprint está guardado en el navegador donde lo generaste. También podés buscarlo en este email cuando lo necesites.
        </div>
      </td></tr>
    </table>

    <!-- CTAs -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:36px;">
      <tr>
        <td style="padding-right:8px;" width="50%">
          <a href="${APP_URL}/blueprint/result"
             style="display:block;background:#1d4ed8;color:#ffffff;font-size:13px;font-weight:700;padding:14px 20px;border-radius:10px;text-decoration:none;text-align:center;">
            📄 Ver mi Blueprint →
          </a>
        </td>
        <td width="50%">
          <a href="${WHATSAPP}"
             style="display:block;background:#16a34a;color:#ffffff;font-size:13px;font-weight:700;padding:14px 20px;border-radius:10px;text-decoration:none;text-align:center;">
            💬 Coordinar sesión 1:1 →
          </a>
        </td>
      </tr>
    </table>

    <div style="height:1px;background:#f1f5f9;margin-bottom:32px;"></div>

    <!-- What's included -->
    <div style="font-size:13px;font-weight:700;color:#0f172a;margin-bottom:16px;text-transform:uppercase;letter-spacing:0.04em;">Qué incluye tu Blueprint</div>
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:32px;">
      ${[
        'Stack tecnológico recomendado con justificación',
        'Arquitectura del sistema y estructura de carpetas',
        'Esquema de base de datos',
        'Plan de desarrollo semana a semana',
        'Más de 10 prompts listos para Cursor / Claude',
        'Estimación de costos: MVP · Crecimiento · Escala',
        'Top 5 riesgos y cómo mitigarlos',
        'Primeros 3 pasos concretos para hoy',
      ].map(item => `
      <tr>
        <td style="padding:5px 0;vertical-align:top;">
          <span style="color:#1d4ed8;font-weight:700;margin-right:8px;">✓</span>
          <span style="font-size:13px;color:#334155;line-height:1.5;">${item}</span>
        </td>
      </tr>`).join('')}
    </table>

    <div style="height:1px;background:#f1f5f9;margin-bottom:32px;"></div>

    <!-- Session reminder -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:32px;">
      <tr><td style="background:#0f172a;border-radius:14px;padding:28px 32px;text-align:center;">
        <div style="font-size:18px;font-weight:900;color:#ffffff;margin-bottom:8px;">Sesión 1:1 incluida</div>
        <div style="font-size:13px;color:#94a3b8;line-height:1.6;margin-bottom:20px;">
          30 minutos con Santiago para revisar tu Blueprint, resolver tus dudas más complejas y arrancar con confianza.
        </div>
        <a href="${WHATSAPP}"
           style="display:inline-block;background:#16a34a;color:#ffffff;font-size:13px;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;">
          💬 Coordinar por WhatsApp →
        </a>
      </td></tr>
    </table>

    <div style="height:1px;background:#f1f5f9;margin-bottom:32px;"></div>

    <!-- Blueprint content -->
    <div style="font-size:13px;font-weight:700;color:#0f172a;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.04em;">Tu Blueprint completo</div>
    <div style="font-size:12px;color:#94a3b8;margin-bottom:16px;">Copiá y guardalo donde prefieras</div>
    <div style="background:#0f172a;border-radius:12px;padding:24px;overflow:hidden;">
      <pre style="margin:0;font-family:'Courier New',Courier,monospace;font-size:11px;color:#e2e8f0;line-height:1.6;white-space:pre-wrap;word-break:break-word;">${escaped}</pre>
    </div>

  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#f8fafc;border-radius:0 0 16px 16px;border-top:1px solid #e2e8f0;padding:24px 48px;text-align:center;">
    <div style="font-size:13px;font-weight:600;color:#0f172a;margin-bottom:4px;">StackAdvisor</div>
    <div style="font-size:12px;color:#94a3b8;margin-bottom:10px;">El Blueprint de tu proyecto, generado con IA.</div>
    <div style="font-size:11px;color:#cbd5e1;">
      ¿Preguntas? Respondé este email o escribí a <a href="${WHATSAPP}" style="color:#1d4ed8;text-decoration:none;">WhatsApp</a>
    </div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const { email, projectName, blueprint } = await request.json();

    if (!email || !blueprint) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    const name = projectName || 'tu proyecto';
    const html = buildBlueprintEmail(name, blueprint);

    const { error } = await resend.emails.send({
      from: 'StackAdvisor <onboarding@resend.dev>',
      to: email,
      subject: `Tu Blueprint de ${name} está listo — StackAdvisor`,
      html,
    });

    if (error) {
      console.error('Resend blueprint email error:', error);
      return NextResponse.json({ error: 'Error enviando email' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
