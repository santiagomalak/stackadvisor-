import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stackName, stackId, answers } = body;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: Number(process.env.BLUEPRINT_PRICE_USD) || 4900,
            product_data: {
              name: 'Blueprint Completo — StackAdvisor',
              description: `Plan de desarrollo milimétrico para ${stackName || 'tu stack'}. Incluye arquitectura, prompts, roadmap detallado y consulta 1:1.`,
              images: [],
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        stackId: stackId || '',
        stackName: stackName || '',
        answers: answers ? JSON.stringify(answers).slice(0, 500) : '',
      },
      success_url: `${appUrl}/blueprint/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/blueprint`,
      locale: 'es',
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
