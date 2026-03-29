import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToolsPageClient } from "./ToolsPageClient";
import { getTools } from "@/lib/tools/store";

export const metadata: Metadata = {
  title: "Tüm Yapay Zekâ Araçları | Yaverim",
  description:
    "Kategoriye göre filtrele, puanlara bak ve sana en uygun yapay zekâ aracını keşfet. 30+ araç, editoryal bağımsız skor.",
};

export default function ToolsPage() {
  const tools = getTools();
  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1 bg-white">
        <ToolsPageClient tools={tools} />
      </main>
      <Footer />
    </>
  );
}
