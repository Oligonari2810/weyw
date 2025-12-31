import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseServerClient } from "@/lib/supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature provided" },
        { status: 400 }
      );
    }

    // Verificar el webhook
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Manejar eventos de pago completado
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Extraer metadata del payment link o session
      const paymentHash = session.metadata?.payment_hash || session.id.substring(0, 20);
      const customerEmail = session.customer_email || session.customer_details?.email;

      console.log("💰 Pago completado:", {
        sessionId: session.id,
        paymentHash,
        email: customerEmail,
        amount: session.amount_total,
      });

      // Crear/actualizar registro en Supabase
      const supabase = getSupabaseServerClient();
      
      const { data, error } = await supabase
        .from("weyw_bookings")
        .upsert({
          payment_hash: paymentHash,
          stripe_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent as string,
          deposit_paid: true,
          deposit_amount: session.amount_total ? session.amount_total / 100 : 99, // Convertir centavos a dólares
          customer_email: customerEmail,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "payment_hash",
        });

      if (error) {
        console.error("Error guardando en Supabase:", error);
        return NextResponse.json(
          { error: "Database error", details: error.message },
          { status: 500 }
        );
      }

      console.log("✅ Registro creado/actualizado en Supabase:", data);
    }

    return NextResponse.json({ received: true, event: event.type });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
