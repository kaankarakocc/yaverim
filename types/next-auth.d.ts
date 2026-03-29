/**
 * Augment NextAuth types to include user.id in sessions.
 * NextAuth v5 uses token.sub as the stable user identifier (Google sub claim).
 */

import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      /** Stable user identifier (Google sub or provider account id) */
      id: string;
    } & DefaultSession["user"];
  }
}
