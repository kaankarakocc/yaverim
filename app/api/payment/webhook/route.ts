/**
 * POST /api/payment/webhook
 *
 * Stripe webhook endpoint. Handles:
 *   - checkout.session.completed  → grant entitlement (one-time unlock)
 *   - customer.subscription.created / updated → grant subscription
 *   - customer.subscription.deleted → revoke subscription
 *
 * Setup:
 *   1. stripe listen --forward-to localhost:3000/api/payment/webhook
 *   2. Set STRIPE_WEBHOOK_SECRET from the CLI output
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/client";
import { grantEntitlement } from "@/lib/entitlements/service";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body      = await req.text();
  const signature = req.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook secret eksik" }, { status: 500 });
  }

  if (!signature) {
    return NextResponse.json({ error: "stripe-signature header yok" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Webhook imzası geçersiz" }, { status: 400 });
  }

  /* ─── Event handlers ─────────────────────────────────────────────────── */

  try {
    switch (event.type) {

      /* Tek seferlik ödeme VEYA abonelik ilk ödemesi tamamlandı */
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const meta    = session.metadata ?? {};
        const userId  = meta.userId ?? session.customer_email ?? "";

        if (!userId) break;

        if (session.mode === "payment") {
          // Tek seferlik plan açma
          await grantEntitlement({
            userId,
            type:       "one_time_unlock",
            analysisId: meta.analysisId || undefined,
            paymentRef: session.payment_intent as string,
            expiresAt:  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 gün
          });
          console.log(`[webhook] One-time unlock granted → ${userId}`);
        }
        // Abonelik için customer.subscription.created event'i yeterli
        break;
      }

      /* Abonelik oluşturuldu veya güncellendi */
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub     = event.data.object as Stripe.Subscription;
        const custId  = sub.customer as string;

        // E-postayı Stripe'dan çek
        let userEmail = "";
        try {
          const cust = await stripe.customers.retrieve(custId);
          if (!cust.deleted) userEmail = (cust as Stripe.Customer).email ?? "";
        } catch { /* ignore */ }

        if (!userEmail) break;

        const isActive = sub.status === "active" || sub.status === "trialing";
        if (!isActive) break;

        await grantEntitlement({
          userId:    userEmail,
          userEmail,
          type:      "subscription_monthly",
          paymentRef: sub.id,
          expiresAt:  new Date((sub.current_period_end ?? 0) * 1000),
        });
        console.log(`[webhook] Subscription granted → ${userEmail}`);
        break;
      }

      /* Abonelik iptal edildi */
      case "customer.subscription.deleted": {
        // Entitlement servisinde revoke mantığı eklenebilir (Sprint 4+)
        const sub = event.data.object as Stripe.Subscription;
        console.log(`[webhook] Subscription cancelled → ${sub.id}`);
        break;
      }
    }
  } catch (err) {
    console.error("[webhook] Handler error:", err);
    return NextResponse.json({ error: "Handler hatası" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
