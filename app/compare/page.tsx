import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ComparePageClient } from "./ComparePageClient";
import { getTools } from "@/lib/tools/store";

export const metadata: Metadata = {
  title: "Araç Karşılaştır | Yaverim",
  description:
    "İki yapay zekâ aracını tüm skor eksenlerinde yan yana karşılaştır. Fiyat, Türkçe desteği, kullanım kolaylığı ve daha fazlası.",
};

export default function ComparePage() {
  const tools = getTools();
  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1 bg-white">
        <Suspense>
          <ComparePageClient tools={tools} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
