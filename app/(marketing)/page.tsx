import type { Metadata } from "next";

import { Hero }            from "@/components/hero/Hero";
import { OnboardingEntry } from "@/components/onboarding/OnboardingEntry";
import { HowItWorks }      from "@/components/sections/HowItWorks";
import { ResultPreview }   from "@/components/sections/ResultPreview";
import { Top10Section }    from "@/components/sections/Top10Section";
import { PremiumValue }    from "@/components/sections/PremiumValue";
import { TrustPrinciples } from "@/components/sections/TrustPrinciples";
import { SeoDiscovery }    from "@/components/sections/SeoDiscovery";

export const metadata: Metadata = {
  title: "Yaverim — Sana yarayanı bulur",
  description:
    "Hedeflerine, bütçene ve çalışma düzenine uygun yapay zekâ araçlarını ve uygulanabilir çözüm planlarını keşfet.",
};

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* 2. Mini onboarding entry */}
      <OnboardingEntry />

      {/* 3. Nasıl çalışır */}
      <HowItWorks />

      {/* 4. Örnek sonuç deneyimi */}
      <ResultPreview />

      {/* 5. Top 10 */}
      <Top10Section />

      {/* 6. Premium değer */}
      <PremiumValue />

      {/* 7. Güven ilkeleri */}
      <TrustPrinciples />

      {/* 8. SEO keşif blokları */}
      <SeoDiscovery />
    </>
  );
}
