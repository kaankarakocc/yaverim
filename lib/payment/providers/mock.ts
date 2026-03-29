/**
 * Mock payment provider — always succeeds.
 *
 * Used when:
 *   - NODE_ENV=development and STRIPE_SECRET_KEY is not set
 *   - Running tests
 *
 * Behaviour:
 *   - createCheckout: returns an immediate redirect to `successUrl`
 *     (no real payment page — simulates instant payment)
 *   - verifyPayment:  always returns verified: true
 *   - No real money moves
 */

import type {
  PaymentProvider,
  CreateCheckoutParams,
  CheckoutSession,
  PaymentVerification,
  SubscriptionDetails,
} from "@/lib/payment/types";

export class MockPaymentProvider implements PaymentProvider {
  readonly name = "mock";

  async createCheckout(params: CreateCheckoutParams): Promise<CheckoutSession> {
    const mockSessionId = `mock_cs_${Date.now()}`;

    // In mock mode, redirect directly to success URL
    const successUrl = params.successUrl.replace(
      "{CHECKOUT_SESSION_ID}",
      mockSessionId
    );

    return {
      id:       mockSessionId,
      url:      successUrl,
      status:   "created",
      amount:   params.priceId.includes("monthly") ? 29900 : params.priceId.includes("annual") ? 24900 * 12 : 4900,
      currency: "try",
    };
  }

  async verifyPayment(sessionId: string): Promise<PaymentVerification> {
    return {
      verified:       true,
      paymentIntentId: `mock_pi_${sessionId}`,
      customerId:      `mock_cus_${Date.now()}`,
      metadata:        {},
    };
  }

  async createPortalSession(
    _customerId: string,
    returnUrl: string
  ): Promise<string> {
    return returnUrl;
  }

  async cancelSubscription(_subscriptionId: string): Promise<void> {
    // no-op in mock
  }

  async getSubscription(subscriptionId: string): Promise<SubscriptionDetails | null> {
    if (!subscriptionId) return null;
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);
    return {
      id:               subscriptionId,
      status:           "active",
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: false,
      priceId:          "mock_price_sub_monthly",
    };
  }
}
