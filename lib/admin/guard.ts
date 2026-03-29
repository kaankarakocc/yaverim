/**
 * Admin / ops access guard.
 *
 * Security model:
 *   development → always allowed (NODE_ENV === "development")
 *   production  → requires INTERNAL_ADMIN_ENABLED=true env var
 *                 Add header X-Admin-Key: <ADMIN_KEY> for external tools.
 *
 * Sprint 4+: Replace with a real session/JWT check once auth is added.
 *
 * Usage:
 *   import { assertAdminAccess } from "@/lib/admin/guard";
 *   assertAdminAccess(); // throws if not allowed — use in server components
 */

export interface AdminAccessResult {
  allowed: boolean;
  reason: string;
}

export function checkAdminAccess(): AdminAccessResult {
  if (process.env.NODE_ENV === "development") {
    return { allowed: true, reason: "development" };
  }

  if (process.env.INTERNAL_ADMIN_ENABLED === "true") {
    return { allowed: true, reason: "INTERNAL_ADMIN_ENABLED" };
  }

  return { allowed: false, reason: "not-allowed" };
}

/** Returns true if access is allowed */
export function isAdminAllowed(): boolean {
  return checkAdminAccess().allowed;
}

/**
 * Admin environment context string for display in the UI.
 * e.g. "development · localhost" or "staging · internal"
 */
export function adminEnvLabel(): string {
  const env = process.env.NODE_ENV ?? "unknown";
  const build = process.env.NEXT_PUBLIC_BUILD_ENV ?? env;
  return `${build} · internal ops`;
}
