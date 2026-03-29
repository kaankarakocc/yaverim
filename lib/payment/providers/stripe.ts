/**
 * Stripe payment provider implementation.
 *
 * To activate:
 *   1. `npm install stripe`
 *   2. Set STRIPE_SECRET_KEY in .env.local
 *   3. Set STRIPE_WEBHOOK_SECRET for webhook verification
 *   4. Set STRIPE_PRICE_* env vars with your actual Stripe price IDs
 *   5. Switch the factory in lib/payment/service.ts to use this provider
 *
 * Stripe Checkout flow:
 *   createCheckout → user redirected to Stripe hosted page → payment →
 *   redirect to successUrl?session_id=cs_xxx → verifyPayment(cs_xxx) →
 *   grant entitlement
 */

import type {
  PaymentProvider,
  CreateCheckoutParams,
  CheckoutSession,
  PaymentVerification,
  SubscriptionDetails,
} from "@/lib/payment/types";

/**
 * Stripe provider stub.
 *
 * All methods throw until the Stripe npm package is installed and
 * STRIPE_SECRET_KEY is configured. The interface contract is complete —
 * implementation is straightforward once dependencies are in place.
 */
export class StripePaymentProvider implements PaymentProvider {
  readonly name = "stripe";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private stripe: any = null;

  private getClient() {
    if (this.stripe) return this.stripe;
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error(
        "[StripePaymentProvider] STRIPE_SECRET_KEY is not set. " +
        "Add it to .env.local or use the mock provider in development."
      );
    }
    // Dynamic import to avoid hard dependency when Stripe is not installed
    // Replace with: import Stripe from "stripe"; this.stripe = new Stripe(secretKey, { apiVersion: "2024-12-18.acacia" });
    throw new Error(
      "[StripePaymentProvider] Run `npm install stripe` to enable Stripe integration."
    );
  }

  async createCheckout(params: CreateCheckoutParams): Promise<CheckoutSession> {
    const stripe = this.getClient();

    const session = await stripe.checkout.sessions.create({
      mode:          params.priceId.includes("sub") ? "subscription" : "payment",
      payment_method_types: ["card"],
      line_items: [{ price: params.priceId, quantity: 1 }],
      success_url: params.successUrl,
      cancel_url:  params.cancelUrl,
      customer_email: params.customerEmail,
      metadata:    { userId: params.userId ?? "", ...params.metadata },
    });

    return {
      id:       session.id,
      url:      session.url!,
      status:   "created",
      amount:   session.amount_total ?? undefined,
      currency: session.currency ?? undefined,
    };
  }

  async verifyPayment(sessionId: string): Promise<PaymentVerification> {
    const stripe = this.getClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return {
      verified:        session.payment_status === "paid",
      paymentIntentId: typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id,
      customerId: typeof session.customer === "string"
        ? session.customer
        : session.customer?.id,
      metadata: session.metadata ?? {},
    };
  }

  async createPortalSession(customerId: string, returnUrl: string): Promise<string> {
    const stripe = this.getClient();
    const portal = await stripe.billingPortal.sessions.create({
      customer:   customerId,
      return_url: returnUrl,
    });
    return portal.url;
  }

  async cancelSubscription(subscriptionId: string, atPeriodEnd = true): Promise<void> {
    const stripe = this.getClient();
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: atPeriodEnd,
    });
  }

  async getSubscription(subscriptionId: string): Promise<SubscriptionDetails | null> {
    const stripe = this.getClient();
    try {
      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      return {
        id:               sub.id,
        status:           sub.status,
        currentPeriodEnd: new Date(sub.current_period_end * 1000),
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        priceId:          sub.items.data[0]?.price?.id ?? "",
      };
    } catch {
      return null;
    }
  }
}
