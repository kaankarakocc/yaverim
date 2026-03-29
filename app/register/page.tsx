import type { Metadata }    from "next";
import { auth }             from "@/auth";
import { redirect }         from "next/navigation";
import { RegisterPageClient } from "./RegisterPageClient";

export const metadata: Metadata = {
  title: "Ücretsiz Kayıt Ol | Yaverim",
  description: "Yaverim hesabı oluşturun. Kart bilgisi gerekmez.",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function RegisterPage({ searchParams }: PageProps) {
  let session;
  try { session = await auth(); } catch { /* env not set */ }

  const params = await searchParams;
  if (session?.user) redirect(params.callbackUrl ?? "/account");

  return (
    <RegisterPageClient
      callbackUrl={params.callbackUrl}
      googleAvailable={!!(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET)}
      githubAvailable={!!(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET)}
    />
  );
}
