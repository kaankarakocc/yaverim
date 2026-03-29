/**
 * Server-side session helpers.
 *
 * Use these in Server Components and Server Actions.
 * For Client Components, use `useSession()` from next-auth/react.
 */

import { auth }  from "@/auth";
import type { Session } from "next-auth";

export type AuthUser = NonNullable<Session["user"]>;

/**
 * Returns the current session, or null if not authenticated.
 * Safe to call in Server Components — reads from the JWT cookie.
 */
export async function getSession(): Promise<Session | null> {
  const session = await auth();
  return session ?? null;
}

/**
 * Returns only the user object, or null.
 * Convenience wrapper to avoid null-chaining on every call.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Returns user.id or null.
 * Useful for DB queries that require userId.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id ?? null;
}
