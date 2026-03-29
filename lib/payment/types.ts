/**
 * Payment service types — provider-agnostic interface.
 *
 * Any payment provider (Stripe, Lemon Squeezy, Paddle, etc.) must implement
 * the `PaymentProvider` interface. The app calls only this interface so that
 * switching providers is a one-file change.
 */

/* ─── Checkout ───────────────────────────────────────────────────────────── */

export interface CreateCheckoutParams {
  /**
   * Provider-specific price identifier.
   * Stripe:       price_xxxxx
   * Lemon Squeezy: variant_id (number as string)
   */
  priceId: string;

  /**
   * URL the user is redirected to on successful payment.
   * Include `{CHECKOUT_SESSION_ID}` to capture the session id from Stripe.
   */
  successUrl: string;

  /** URL the user is redirected to if they abandon checkout. */
  cancelUrl: string;

  /** Authenticated user id — attached to the payment for entitlement grant. */
  userId?: string;

  /** Free-form metadata forwarded to the provider (e.g. analysisId). */
  metadata?: Record<string, string>;

  /** Pre-fill customer email if known. */
  customerEmail?: string;
}

export interface CheckoutSession {
  /** Provider checkout session id (used to verify payment later). */
  id: string;

  /** Redirect the user to this URL to complete payment. */
  url: string;

  status: "created" | "completed" | "expired" | "canceled";

  /** Gross amount in smallest currency unit (e.g. kuruş for TRY). */
  amount?: number;

  /** ISO 4217 currency code. */
  currency?: string;
}

/* ─── Payment verification ────────────────────────────────────────────────── */

export interface PaymentVerification {
  verified: boolean;

  /** Provider payment intent id — stored as Entitlement.paymentRef. */
  paymentIntentId?: string;

  /** Provider customer id — used for portal/subscription management. */
  customerId?: string;

  /** Metadata sent during checkout creation, echoed back after verification. */
  metadata?: Record<string, string>;
}

/* ─── Subscription management ────────────────────────────────────────────── */

export interface SubscriptionDetails {
  id: string;
  status: "active" | "canceled" | "past_due" | "trialing" | "unpaid";
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  priceId: string;
}

/* ─── Provider interface ─────────────────────────────────────────────────── */

export interface PaymentProvider {
  readonly name: string;

  /** Create a hosted checkout session and return the URL to redirect to. */
  createCheckout(params: CreateCheckoutParams): Promise<CheckoutSession>;

  /**
   * Verify a completed checkout session.
   * Called from the success redirect URL to confirm payment before granting access.
   */
  verifyPayment(sessionId: string): Promise<PaymentVerification>;

  /**
   * Return a URL to the provider's customer portal (for subscription management).
   * Only supported by subscription-capable providers.
   */
  createPortalSession?(
    customerId: string,
    returnUrl: string
  ): Promise<string>;

  /**
   * Cancel an active subscription.
   * `atPeriodEnd = true` lets the subscription run until the next billing cycle.
   */
  cancelSubscription?(
    subscriptionId: string,
    atPeriodEnd?: boolean
  ): Promise<void>;

  /** Fetch current subscription details. */
  getSubscription?(subscriptionId: string): Promise<SubscriptionDetails | null>;
}

/* ─── Price catalog ─────────────────────────────────────────────────────── */

/**
 * Yaverim product pricing catalog.
 * Set env vars to override with real provider price IDs.
 */
export const PRICE_IDS = {
  /**
   * One-time unlock for a single premium analysis result.
   * Stripe price: STRIPE_PRICE_ONE_TIME_UNLOCK
   */
  ONE_TIME_UNLOCK: process.env.STRIPE_PRICE_ONE_TIME_UNLOCK ?? "mock_price_one_time_unlock",

  /**
   * Monthly subscription — access to all premium analyses.
   * Stripe price: STRIPE_PRICE_SUBSCRIPTION_MONTHLY
   */
  SUBSCRIPTION_MONTHLY: process.env.STRIPE_PRICE_SUBSCRIPTION_MONTHLY ?? "mock_price_sub_monthly",

  /**
   * Annual subscription — discounted vs. monthly.
   * Stripe price: STRIPE_PRICE_SUBSCRIPTION_ANNUAL
   */
  SUBSCRIPTION_ANNUAL: process.env.STRIPE_PRICE_SUBSCRIPTION_ANNUAL ?? "mock_price_sub_annual",
} as const;
