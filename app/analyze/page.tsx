import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export const metadata: Metadata = {
  title: "Analizi Başlat",
  description:
    "Durumunu anlat, sana en uygun yapay zekâ araçlarını ve planını bul. 2 dakika, 6 adım.",
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ type?: string }>;
}

export default async function AnalyzePage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1">
        <OnboardingFlow initialType={params.type} />
      </main>
    </>
  );
}
