import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/** Simple client-side validation rules (same rules enforced on server) */
export const PASSWORD_RULES = {
  minLength: 8,
  message:   "En az 8 karakter olmalı.",
};
