/**
 * Auth.js (NextAuth v5) configuration — Yaverim
 *
 * Providers:
 *   - Google OAuth   (primary social)
 *   - GitHub OAuth   (secondary social)
 *   - Credentials    (email + password — own user store)
 *
 * User persistence:
 *   NOW:    /data/users.json (file-based, dev-friendly)
 *   FUTURE: Replace store functions with Prisma queries + PrismaAdapter
 *
 * Required env vars (.env.local):
 *   AUTH_SECRET           — openssl rand -base64 32
 *   AUTH_GOOGLE_ID        — Google OAuth client ID
 *   AUTH_GOOGLE_SECRET    — Google OAuth client secret
 *   AUTH_GITHUB_ID        — GitHub OAuth App client ID
 *   AUTH_GITHUB_SECRET    — GitHub OAuth App client secret
 */

import NextAuth, { type DefaultSession } from "next-auth";
import Google      from "next-auth/providers/google";
import GitHub      from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { findByEmail, upsertOAuthUser } from "@/lib/auth/users-store";
import { verifyPassword }               from "@/lib/auth/password";
import { isAdminEmail }                 from "@/lib/auth/admin-guard";

/* ─── Type augmentation ──────────────────────────────────────────────────── */

declare module "next-auth" {
  interface Session {
    user: {
      id:       string;
      provider: string;
      isAdmin:  boolean;
    } & DefaultSession["user"];
  }
}

/* ─── Config ─────────────────────────────────────────────────────────────── */

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    /* ── Google ── */
    Google({
      clientId:     process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),

    /* ── GitHub ── */
    GitHub({
      clientId:     process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),

    /* ── Credentials (email + password) ── */
    Credentials({
      name: "E-posta ve Şifre",
      credentials: {
        email:    { label: "E-posta", type: "email"    },
        password: { label: "Şifre",  type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = String(credentials.email).toLowerCase().trim();
        const user  = findByEmail(email);

        if (!user || !user.passwordHash) return null;

        const valid = await verifyPassword(String(credentials.password), user.passwordHash);
        if (!valid) return null;

        return {
          id:    user.id,
          email: user.email,
          name:  user.name ?? undefined,
        };
      },
    }),
  ],

  secret: process.env.AUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge:   30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, account, profile, user }) {
      // Persist provider + stable user id on first sign-in
      if (account) {
        token.provider = account.provider;

        // For OAuth providers, upsert the user in our store
        if (
          (account.provider === "google" || account.provider === "github") &&
          profile?.email
        ) {
          const stored = upsertOAuthUser({
            email:    profile.email,
            name:     String(profile.name ?? ""),
            provider: account.provider as "google" | "github",
          });
          token.sub = stored.id;
          token.email = profile.email;
        }

        // For credentials, user.id is already set from authorize()
        if (account.provider === "credentials" && user?.id) {
          token.sub   = user.id;
          token.email = user.email;
        }
      }

      // Recompute admin flag on every token refresh
      token.isAdmin = isAdminEmail(token.email as string | undefined);

      return token;
    },

    session({ session, token }) {
      if (token.sub)      session.user.id       = token.sub;
      if (token.provider) session.user.provider = String(token.provider);
      session.user.isAdmin = Boolean(token.isAdmin);
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error:  "/login",
  },
});
