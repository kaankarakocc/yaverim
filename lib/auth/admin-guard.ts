/**
 * Admin access guard — session-based.
 *
 * Who is admin?
 *   - Set ADMIN_EMAILS in .env.local (comma-separated):
 *       ADMIN_EMAILS=you@example.com,partner@example.com
 *   - In development with NO ADMIN_EMAILS set → all signed-in users get admin
 *     access (dev convenience, safe because NODE_ENV=development never runs in prod).
 *   - In production with NO ADMIN_EMAILS set → nobody gets admin access (fail-safe).
 *
 * Usage:
 *   isAdminEmail("you@example.com") → true / false
 *   getAdminEmails()                → string[]
 */

export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;

  const list = getAdminEmails();

  // Development fallback — no list set yet → any logged-in user is admin
  if (list.length === 0 && process.env.NODE_ENV === "development") {
    return true;
  }

  return list.includes(email.toLowerCase());
}
