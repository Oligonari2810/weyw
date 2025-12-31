import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { hash, code } = body;

    if (!hash) {
      return NextResponse.json(
        { error: "Hash de pago requerido" },
        { status: 400 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://weyw.vercel.app";

    // Crear Checkout Session dinámico
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Depósito WEYW - Reserva de Vuelo',
              description: `Reserva ${code || hash}`,
            },
            unit_amount: 9900, // US$99.00 en centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${siteUrl}/success/${hash}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/pay/${hash}?code=${code}&canceled=true`,
      metadata: {
        payment_hash: hash,
        reservation_code: code || '',
      },
      customer_email: body.email,
    });

    console.log("💳 Checkout Session creado:", {
      sessionId: session.id,
      hash,
      code,
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Error creando Checkout Session:", error);
    return NextResponse.json(
      { error: "Error al crear sesión de pago" },
      { status: 500 }
    );
  }
}
