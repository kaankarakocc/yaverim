"use server";

import { findByEmail, createUser } from "@/lib/auth/users-store";
import { hashPassword, PASSWORD_RULES } from "@/lib/auth/password";

export interface RegisterResult {
  success: boolean;
  error?:  string;
}

export async function registerAction(formData: FormData): Promise<RegisterResult> {
  const name     = String(formData.get("name")     ?? "").trim();
  const email    = String(formData.get("email")    ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");
  const confirm  = String(formData.get("confirm")  ?? "");

  /* ── Validation ── */
  if (!email || !password) {
    return { success: false, error: "E-posta ve şifre zorunludur." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Geçerli bir e-posta adresi girin." };
  }

  if (password.length < PASSWORD_RULES.minLength) {
    return { success: false, error: PASSWORD_RULES.message };
  }

  if (password !== confirm) {
    return { success: false, error: "Şifreler eşleşmiyor." };
  }

  /* ── Duplicate check ── */
  if (findByEmail(email)) {
    return { success: false, error: "Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin." };
  }

  /* ── Create ── */
  try {
    const passwordHash = await hashPassword(password);
    createUser({ email, name: name || undefined, passwordHash, provider: "credentials" });
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err instanceof Error ? err.message : err) };
  }
}
