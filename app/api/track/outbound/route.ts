/**
 * GET /api/track/outbound?tool=slug&url=https://...&src=/results
 *
 * Logs the affiliate click and redirects the user to the destination URL.
 * Used on every outbound tool link so we can track which tools get clicks.
 *
 * Usage (in components):
 *   href={`/api/track/outbound?tool=${slug}&url=${encodeURIComponent(url)}&src=${encodeURIComponent(pathname)}`}
 */
import { NextRequest, NextResponse } from "next/server";
import { auth }               from "@/auth";
import { logAffiliateClick }  from "@/lib/revenue/store";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const toolSlug  = searchParams.get("tool")  ?? "";
  const url       = searchParams.get("url")   ?? "";
  const sourcePage = searchParams.get("src")  ?? "/";
  const toolName  = searchParams.get("name")  ?? toolSlug;

  // Validate destination — only allow http/https
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  // Get user id if logged in (fire-and-forget — don't block the redirect)
  let userId: string | null = null;
  try {
    const session = await auth();
    userId = session?.user?.id ?? null;
  } catch {
    // not logged in — that's fine
  }

  // Log asynchronously — don't await to keep redirect instant
  try {
    logAffiliateClick({ toolSlug, toolName, userId, sourcePage, url });
  } catch {
    // logging failure should never block the user
  }

  // Redirect to the actual destination
  return NextResponse.redirect(url, { status: 302 });
}
