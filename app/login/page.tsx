import { auth }  from "@/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { LoginPageClient } from "./LoginPageClient";

export const metadata: Metadata = {
  title: "Giriş Yap",
  description: "Yaverim hesabınıza Google ile giriş yapın.",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  let session;
  try {
    session = await auth();
  } catch {
    // AUTH_SECRET missing or misconfigured — show login page normally
  }
  const params = await searchParams;

  if (session?.user) {
    redirect(params.callbackUrl ?? "/account");
  }

  return (
    <LoginPageClient
      callbackUrl={params.callbackUrl}
      error={params.error}
      googleAvailable={!!(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET)}
      githubAvailable={!!(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET)}
    />
  );
}
