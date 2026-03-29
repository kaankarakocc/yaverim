"use client";

import { useState }        from "react";
import { signIn }          from "next-auth/react";
import Link                from "next/link";
import { Logo }            from "@/components/common/Logo";

/* ─── Error map ──────────────────────────────────────────────────────────── */
const ERROR_MESSAGES: Record<string, string> = {
  OAuthSignin:           "Sosyal giriş başlatılamadı. Tekrar deneyin.",
  OAuthCallback:         "Doğrulama sırasında hata oluştu.",
  OAuthAccountNotLinked: "Bu e-posta başka bir hesaba bağlı.",
  CredentialsSignin:     "E-posta veya şifre hatalı.",
  default:               "Giriş sırasında bir hata oluştu.",
};

/* ─── Social button ──────────────────────────────────────────────────────── */
function SocialButton({
  provider, label, icon, available, callbackUrl,
}: {
  provider: string;
  label: string;
  icon: React.ReactNode;
  available: boolean;
  callbackUrl: string;
}) {
  if (!available) {
    return (
      <div
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm cursor-not-allowed"
        style={{ backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0", color: "#94a3b8" }}
      >
        {icon}
        {label}
        <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#fef3c7", color: "#d97706" }}>
          Yakında
        </span>
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={() => signIn(provider, { callbackUrl })}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-md"
      style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", color: "#334155" }}
    >
      {icon}
      {label}
    </button>
  );
}

/* ─── Google icon ────────────────────────────────────────────────────────── */
const GoogleIcon = (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

/* ─── GitHub icon ────────────────────────────────────────────────────────── */
const GitHubIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

/* ─── Props ──────────────────────────────────────────────────────────────── */
interface Props {
  callbackUrl?:      string;
  error?:            string;
  googleAvailable?:  boolean;
  githubAvailable?:  boolean;
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export function LoginPageClient({
  callbackUrl,
  error,
  googleAvailable = true,
  githubAvailable = true,
}: Props) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const destination = callbackUrl ?? "/account";
  const initError   = error ? (ERROR_MESSAGES[error] ?? ERROR_MESSAGES.default) : null;

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl: destination,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setFormError(ERROR_MESSAGES.CredentialsSignin);
    } else if (res?.url) {
      window.location.href = res.url;
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8fafc" }}>
      {/* Top bar */}
      <div className="h-16 px-6 flex items-center" style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0" }}>
        <Link href="/"><Logo size="md" /></Link>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-1.5" style={{ color: "#0f172a" }}>
              Hesabına giriş yap
            </h1>
            <p className="text-sm" style={{ color: "#64748b" }}>
              Analizlerini kaydet, Pro plana eriş.
            </p>
          </div>

          {/* Error banner */}
          {(initError ?? formError) && (
            <div className="mb-5 rounded-xl px-4 py-3" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>
              <p className="text-sm font-medium" style={{ color: "#dc2626" }}>
                {initError ?? formError}
              </p>
            </div>
          )}

          <div
            className="rounded-2xl p-6 flex flex-col gap-4"
            style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
          >
            {/* Social buttons */}
            <SocialButton
              provider="google"
              label="Google ile devam et"
              icon={GoogleIcon}
              available={googleAvailable}
              callbackUrl={destination}
            />
            <SocialButton
              provider="github"
              label="GitHub ile devam et"
              icon={GitHubIcon}
              available={githubAvailable}
              callbackUrl={destination}
            />

            {/* Divider */}
            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px" style={{ backgroundColor: "#e2e8f0" }} />
              <span className="text-xs flex-shrink-0" style={{ color: "#94a3b8" }}>veya e-posta ile</span>
              <div className="flex-1 h-px" style={{ backgroundColor: "#e2e8f0" }} />
            </div>

            {/* Email + password form */}
            <form onSubmit={handleCredentials} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold" style={{ color: "#475569" }}>
                  E-posta
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="ornek@mail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#f8fafc",
                    color: "#0f172a",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = "#e2e8f0")}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold" style={{ color: "#475569" }}>
                    Şifre
                  </label>
                  <Link href="/forgot-password" className="text-xs transition-colors hover:text-blue-700" style={{ color: "#2563eb" }}>
                    Şifremi unuttum
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#f8fafc",
                    color: "#0f172a",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = "#e2e8f0")}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full py-2.5 rounded-xl text-sm font-bold transition-opacity disabled:opacity-50"
                style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
              >
                {loading ? "Giriş yapılıyor…" : "Giriş yap"}
              </button>
            </form>
          </div>

          {/* Register link */}
          <p className="text-center text-sm mt-5" style={{ color: "#64748b" }}>
            Hesabın yok mu?{" "}
            <Link
              href={`/register${destination !== "/account" ? `?callbackUrl=${encodeURIComponent(destination)}` : ""}`}
              className="font-semibold transition-colors hover:text-blue-700"
              style={{ color: "#2563eb" }}
            >
              Ücretsiz kayıt ol
            </Link>
          </p>

          {/* Legal */}
          <p className="text-center text-xs mt-4" style={{ color: "#94a3b8" }}>
            Giriş yaparak{" "}
            <Link href="/gizlilik" className="underline underline-offset-2 hover:text-slate-600">
              Gizlilik Politikası
            </Link>
            &rsquo;nı kabul edersiniz.
          </p>
        </div>
      </div>
    </div>
  );
}
