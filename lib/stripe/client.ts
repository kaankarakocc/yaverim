import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set. Add it to .env.local");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

/* ─── Price IDs (from Stripe Dashboard > Products) ──────────────────────── */

export const PRICE_IDS = {
  oneTime:     process.env.STRIPE_PRICE_ONE_TIME_UNLOCK         ?? "",
  monthly:     process.env.STRIPE_PRICE_SUBSCRIPTION_MONTHLY    ?? "",
  annual:      process.env.STRIPE_PRICE_SUBSCRIPTION_ANNUAL     ?? "",
} as const;

export type PlanKey = keyof typeof PRICE_IDS;

/* ─── App URL ────────────────────────────────────────────────────────────── */

export function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "https://yaverim.io";
}
