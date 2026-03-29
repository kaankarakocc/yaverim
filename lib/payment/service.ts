/**
 * Payment service factory.
 *
 * Selects the correct provider based on environment:
 *   - STRIPE_SECRET_KEY set  → Stripe (production)
 *   - Otherwise              → Mock  (development / testing)
 *
 * Usage (Server Components / Server Actions):
 *   import { getPaymentService } from "@/lib/payment/service";
 *   const payment = getPaymentService();
 *   const checkout = await payment.createCheckout({ ... });
 *   redirect(checkout.url);
 */

import type { PaymentProvider } from "./types";
import { MockPaymentProvider }  from "./providers/mock";
import { StripePaymentProvider } from "./providers/stripe";

/* ─── Factory ────────────────────────────────────────────────────────────── */

let _instance: PaymentProvider | null = null;

export function getPaymentService(): PaymentProvider {
  if (_instance) return _instance;

  if (process.env.STRIPE_SECRET_KEY) {
    _instance = new StripePaymentProvider();
  } else {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[payment/service] STRIPE_SECRET_KEY not set in production — " +
        "falling back to MockPaymentProvider. Set the key to enable real payments."
      );
    }
    _instance = new MockPaymentProvider();
  }

  return _instance;
}

/* ─── Convenience re-exports ─────────────────────────────────────────────── */

export type { PaymentProvider, CreateCheckoutParams, CheckoutSession, PaymentVerification }
  from "./types";
export { PRICE_IDS } from "./types";
