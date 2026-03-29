/**
 * Next.js 16+ proxy (formerly middleware) — route protection.
 *
 * Protected routes:
 *   /account/**  → must be signed in
 *   /admin/**    → must be signed in AND have isAdmin: true
 *
 * isAdmin is stored in the JWT (set in auth.ts jwt callback).
 * No DB call happens here — pure edge-speed JWT check.
 *
 * Access-denied destination: /access-denied
 */

import { auth }         from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  let session;
  try {
    session = await auth();
  } catch {
    // AUTH_SECRET missing — allow through, page-level guards handle it
  }

  /* ── /account/** — must be signed in ── */
  if (pathname.startsWith("/account") && !session?.user) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  /* ── /admin/** — must be signed in AND be admin ── */
  if (pathname.startsWith("/admin")) {
    // Not signed in
    if (!session?.user) {
      const loginUrl = new URL("/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Signed in but not admin
    if (!session.user.isAdmin) {
      return NextResponse.redirect(new URL("/access-denied", req.nextUrl.origin));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};
