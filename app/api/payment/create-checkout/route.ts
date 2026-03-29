/**
 * POST /api/payment/create-checkout
 *
 * Creates a Stripe Checkout Session for one-time unlock or subscription.
 * Returns { url } — the client redirects to this URL.
 *
 * Body: { plan: "one-time" | "subscription", analysisId?: string, queryString?: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe, PRICE_IDS, appUrl } from "@/lib/stripe/client";

export async function POST(req: NextRequest) {
  try {
    /* ── Auth check ─────────────────────────────────────────────────────── */
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Giriş yapman gerekiyor." }, { status: 401 });
    }

    const body = await req.json();
    const plan: "one-time" | "subscription" = body.plan ?? "one-time";
    const analysisId: string = body.analysisId ?? "";
    const queryString: string = body.queryString ?? "";

    const base   = appUrl();
    const successQs = queryString ? `${queryString}&` : "";
    const successUrl = `${base}/premium?${successQs}session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl  = `${base}/premium/unlock${queryString ? `?${queryString}` : ""}`;

    /* ── Validate price IDs ─────────────────────────────────────────────── */
    const priceId = plan === "subscription" ? PRICE_IDS.monthly : PRICE_IDS.oneTime;

    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe fiyat ID'si ayarlanmamış. STRIPE_PRICE_* env değerlerini kontrol et." },
        { status: 500 }
      );
    }

    /* ── Create Checkout Session ────────────────────────────────────────── */
    const checkoutSession = await stripe.checkout.sessions.create({
      mode:       plan === "subscription" ? "subscription" : "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: session.user.email,
      success_url: successUrl,
      cancel_url:  cancelUrl,
      metadata: {
        userId:     session.user.email,
        plan,
        analysisId: analysisId || "",
      },
      payment_intent_data: plan === "one-time" ? {
        metadata: {
          userId:     session.user.email,
          plan,
          analysisId: analysisId || "",
        },
      } : undefined,
      locale: "tr",
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: checkoutSession.url });

  } catch (err: unknown) {
    console.error("[create-checkout] Error:", err);
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
