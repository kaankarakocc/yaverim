"use client";

/**
 * Thin wrapper around NextAuth's SessionProvider.
 * Must be rendered in a Client Component boundary.
 * Placed in the root layout to make useSession() available app-wide.
 */

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
