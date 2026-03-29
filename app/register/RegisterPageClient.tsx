"use client";

import { useState, useTransition } from "react";
import { signIn }                  from "next-auth/react";
import Link                        from "next/link";
import { Logo }                    from "@/components/common/Logo";
import { registerAction }          from "./actions";

/* ─── Password strength indicator ───────────────────────────────────────── */
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const checks = [
    { label: "8+ karakter", ok: password.length >= 8 },
    { label: "Büyük harf",   ok: /[A-Z]/.test(password) },
    { label: "Rakam",        ok: /[0-9]/.test(password) },
  ];

  const score = checks.filter((c) => c.ok).length;
  const colors = ["#ef4444", "#f97316", "#22c55e"];
  const labels = ["Zayıf", "Orta", "Güçlü"];

  return (
    <div className="flex flex-col gap-1.5 mt-1">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-colors duration-300"
            style={{ backgroundColor: i < score ? colors[score - 1] : "#e2e8f0" }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: score > 0 ? colors[score - 1] : "#94a3b8" }}>
          {score > 0 ? labels[score - 1] : ""}
        </span>
        <div className="flex gap-2">
          {checks.map((c) => (
            <span
              key={c.label}
              className="text-[10px]"
              style={{ color: c.ok ? "#22c55e" : "#94a3b8" }}
            >
              {c.ok ? "✓" : "·"} {c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Props ──────────────────────────────────────────────────────────────── */
interface Props {
  callbackUrl?:     string;
  googleAvailable?: boolean;
  githubAvailable?: boolean;
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export function RegisterPageClient({ callbackUrl, googleAvailable = true, githubAvailable = true }: Props) {
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [error,    setError]    = useState<string | null>(null);
  const [done,     setDone]     = useState(false);

  const [isPending, startTransition] = useTransition();

  const destination = callbackUrl ?? "/account";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await registerAction(fd);
      if (!result.success) {
        setError(result.error ?? "Bilinmeyen hata.");
        return;
      }
      // Auto sign-in after registration
      setDone(true);
      const res = await signIn("credentials", {
        email,
        password,
        callbackUrl: destination,
        redirect: false,
      });
      if (res?.url) window.location.href = res.url;
    });
  }

  /* Success screen */
  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: "#f8fafc" }}>
        <div
          className="w-full max-w-sm rounded-2xl p-8 text-center flex flex-col items-center gap-4"
          style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
            style={{ backgroundColor: "#dcfce7" }}
          >
            ✓
          </div>
          <div>
            <h2 className="text-lg font-bold mb-1" style={{ color: "#0f172a" }}>Hesabın oluşturuldu!</h2>
            <p className="text-sm" style={{ color: "#64748b" }}>Giriş yapılıyor…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8fafc" }}>
      {/* Top bar */}
      <div className="h-16 px-6 flex items-center" style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0" }}>
        <Link href="/"><Logo size="md" /></Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-1.5" style={{ color: "#0f172a" }}>
              Ücretsiz hesap oluştur
            </h1>
            <p className="text-sm" style={{ color: "#64748b" }}>
              Kart bilgisi gerekmez. Anında başla.
            </p>
          </div>

          {/* Benefits */}
          <div className="flex flex-col gap-2 mb-6">
            {[
              "Analizlerini kaydet ve sonra tekrar aç",
              "Pro planı satın al ve hemen eriş",
              "Araç güncelleme bildirimleri al",
            ].map((b) => (
              <div key={b} className="flex items-center gap-2.5 text-xs" style={{ color: "#475569" }}>
                <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold" style={{ backgroundColor: "#dcfce7", color: "#16a34a" }}>
                  ✓
                </span>
                {b}
              </div>
            ))}
          </div>

          {/* Social */}
          <div className="flex flex-col gap-2 mb-4">
            {googleAvailable && (
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: destination })}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-md"
                style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", color: "#334155" }}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google ile kayıt ol
              </button>
            )}
            {githubAvailable && (
              <button
                type="button"
                onClick={() => signIn("github", { callbackUrl: destination })}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-md"
                style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", color: "#334155" }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden>
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                GitHub ile kayıt ol
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="relative flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ backgroundColor: "#e2e8f0" }} />
            <span className="text-xs flex-shrink-0" style={{ color: "#94a3b8" }}>veya e-posta ile</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "#e2e8f0" }} />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-xl px-4 py-3" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>
              <p className="text-sm font-medium" style={{ color: "#dc2626" }}>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input type="hidden" name="name"     value={name}     readOnly />
            <input type="hidden" name="email"    value={email}    readOnly />
            <input type="hidden" name="password" value={password} readOnly />
            <input type="hidden" name="confirm"  value={confirm}  readOnly />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: "#475569" }}>Ad Soyad <span style={{ color: "#94a3b8", fontWeight: 400 }}>(opsiyonel)</span></label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{ border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", color: "#0f172a" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                onBlur={(e)  => (e.currentTarget.style.borderColor = "#e2e8f0")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: "#475569" }}>E-posta *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ornek@mail.com"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{ border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", color: "#0f172a" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                onBlur={(e)  => (e.currentTarget.style.borderColor = "#e2e8f0")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: "#475569" }}>Şifre *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="En az 8 karakter"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{ border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", color: "#0f172a" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                onBlur={(e)  => (e.currentTarget.style.borderColor = "#e2e8f0")}
              />
              <PasswordStrength password={password} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: "#475569" }}>Şifre tekrar *</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="Şifreyi tekrar girin"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  border: `1px solid ${confirm && confirm !== password ? "#fca5a5" : "#e2e8f0"}`,
                  backgroundColor: "#f8fafc",
                  color: "#0f172a",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                onBlur={(e)  => (e.currentTarget.style.borderColor = confirm && confirm !== password ? "#fca5a5" : "#e2e8f0")}
              />
              {confirm && confirm !== password && (
                <p className="text-xs" style={{ color: "#ef4444" }}>Şifreler eşleşmiyor</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending || !email || !password || password !== confirm || password.length < 8}
              className="w-full py-2.5 rounded-xl text-sm font-bold mt-1 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
            >
              {isPending ? "Hesap oluşturuluyor…" : "Hesap oluştur"}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm mt-5" style={{ color: "#64748b" }}>
            Hesabın var mı?{" "}
            <Link href="/login" className="font-semibold transition-colors hover:text-blue-700" style={{ color: "#2563eb" }}>
              Giriş yap
            </Link>
          </p>

          <p className="text-center text-xs mt-3" style={{ color: "#94a3b8" }}>
            Kayıt olarak{" "}
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
