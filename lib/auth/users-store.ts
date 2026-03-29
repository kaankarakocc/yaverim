/**
 * User store — file-based (development) → Prisma-ready (production)
 *
 * HOW IT WORKS NOW:
 *   Users are stored in /data/users.json. This file is gitignored in
 *   production. Passwords are bcrypt-hashed (never stored in plain text).
 *
 * HOW TO UPGRADE TO PRISMA:
 *   1. Connect DATABASE_URL in .env.local
 *   2. Run: npx prisma migrate dev
 *   3. Replace every function below with the equivalent Prisma query.
 *      The function signatures stay the same — calling code never changes.
 *
 * User shape (also reflected in prisma/schema.prisma User model):
 *   id           cuid
 *   email        unique
 *   name         optional display name
 *   passwordHash bcrypt hash — null for OAuth-only users
 *   provider     "credentials" | "google" | "github"
 *   createdAt    ISO string
 */

import fs   from "fs";
import path from "path";
import { randomUUID } from "crypto";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface StoredUser {
  id:           string;
  email:        string;
  name:         string | null;
  passwordHash: string | null;
  provider:     "credentials" | "google" | "github";
  createdAt:    string;
}

/* ─── File path ──────────────────────────────────────────────────────────── */

const DATA_DIR  = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

function readAll(): StoredUser[] {
  try {
    if (!fs.existsSync(USERS_FILE)) return [];
    const raw = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

function writeAll(users: StoredUser[]): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

/* ─── CRUD ───────────────────────────────────────────────────────────────── */

export function findByEmail(email: string): StoredUser | null {
  const users = readAll();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function findById(id: string): StoredUser | null {
  return readAll().find((u) => u.id === id) ?? null;
}

export function createUser(data: {
  email:        string;
  name?:        string;
  passwordHash: string | null;
  provider:     StoredUser["provider"];
}): StoredUser {
  const users = readAll();

  if (users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
    throw new Error("Bu e-posta adresi zaten kayıtlı.");
  }

  const user: StoredUser = {
    id:           randomUUID(),
    email:        data.email.toLowerCase(),
    name:         data.name ?? null,
    passwordHash: data.passwordHash,
    provider:     data.provider,
    createdAt:    new Date().toISOString(),
  };

  writeAll([...users, user]);
  return user;
}

export function upsertOAuthUser(data: {
  email:    string;
  name?:    string;
  provider: "google" | "github";
}): StoredUser {
  const users  = readAll();
  const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());

  if (existing) {
    // Update name if it changed
    if (data.name && data.name !== existing.name) {
      const updated = { ...existing, name: data.name };
      writeAll(users.map((u) => (u.id === existing.id ? updated : u)));
      return updated;
    }
    return existing;
  }

  const user: StoredUser = {
    id:           randomUUID(),
    email:        data.email.toLowerCase(),
    name:         data.name ?? null,
    passwordHash: null,
    provider:     data.provider,
    createdAt:    new Date().toISOString(),
  };

  writeAll([...users, user]);
  return user;
}

export function updateUserName(id: string, name: string): StoredUser | null {
  const users = readAll();
  const idx   = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], name };
  writeAll(users);
  return users[idx];
}

export function getAllUsers(): StoredUser[] {
  return readAll();
}
