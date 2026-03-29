import Link from "next/link";
import { auth } from "@/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Erişim Reddedildi — Yaverim",
  robots: { index: false, follow: false },
};

export default async function AccessDeniedPage() {
  const session = await auth();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#f8fafc" }}
    >
      <div
        className="max-w-md w-full rounded-2xl border p-8 text-center"
        style={{ background: "#ffffff", borderColor: "#e2e8f0" }}
      >
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: "#fef2f2" }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.5" />
            <rect x="8" y="11" width="8" height="6" rx="1" stroke="#ef4444" strokeWidth="1.5" />
            <path d="M10 11V8.5a2 2 0 0 1 4 0V11" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold mb-2" style={{ color: "#0f172a" }}>
          Erişim Reddedildi
        </h1>

        <p className="text-sm mb-6" style={{ color: "#64748b" }}>
          {session?.user?.email ? (
            <>
              <strong style={{ color: "#334155" }}>{session.user.email}</strong>
              {" "}hesabının yönetici yetkisi bulunmuyor.
            </>
          ) : (
            "Bu sayfayı görüntülemek için yönetici hesabıyla giriş yapmanız gerekiyor."
          )}
        </p>

        {/* Instructions */}
        <div
          className="rounded-xl p-4 text-left mb-6"
          style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
        >
          <p className="text-xs font-semibold mb-2" style={{ color: "#334155" }}>
            Yönetici erişimi almak için:
          </p>
          <ol className="flex flex-col gap-2 text-xs" style={{ color: "#64748b" }}>
            <li className="flex gap-2">
              <span className="font-bold flex-shrink-0" style={{ color: "#2563eb" }}>1.</span>
              <span>
                <code
                  className="font-mono px-1 py-0.5 rounded"
                  style={{ background: "#f1f5f9", color: "#0f172a" }}
                >
                  .env.local
                </code>
                {" "}dosyasına şunu ekle:
              </span>
            </li>
            <li className="ml-5">
              <code
                className="font-mono text-xs px-2 py-1 rounded block"
                style={{ background: "#f1f5f9", color: "#0f172a", border: "1px solid #e2e8f0" }}
              >
                ADMIN_EMAILS=sen@mail.com
              </code>
            </li>
            <li className="flex gap-2">
              <span className="font-bold flex-shrink-0" style={{ color: "#2563eb" }}>2.</span>
              <span>Sunucuyu yeniden başlat ve aynı e-posta ile giriş yap.</span>
            </li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {!session ? (
            <Link
              href="/login?callbackUrl=/admin"
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-center"
              style={{ background: "#2563eb", color: "#ffffff" }}
            >
              Giriş Yap
            </Link>
          ) : (
            <p className="text-xs" style={{ color: "#94a3b8" }}>
              Farklı hesapla dene:{" "}
              <Link href="/api/auth/signout?callbackUrl=/admin" style={{ color: "#2563eb" }}>
                Çıkış Yap
              </Link>
            </p>
          )}
          <Link
            href="/"
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-center border"
            style={{ borderColor: "#e2e8f0", color: "#64748b" }}
          >
            ← Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
  );
}
