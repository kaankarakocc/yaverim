import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "@/components/auth/SessionProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yaverim.io"),
  title: {
    default: "Yaverim — Sana yarayanı bulur",
    template: "%s | Yaverim",
  },
  description:
    "Hedeflerine, bütçene ve çalışma düzenine uygun yapay zekâ araçlarını ve uygulanabilir çözüm planlarını keşfet.",
  keywords: [
    "yapay zekâ araçları",
    "AI tools",
    "AI önerileri",
    "yapay zeka öneri",
    "Türkçe AI",
    "AI karşılaştırma",
  ],
  authors: [{ name: "Yaverim" }],
  creator: "Yaverim",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://yaverim.io",
    siteName: "Yaverim",
    title: "Yaverim — Sana yarayanı bulur",
    description:
      "Hedeflerine, bütçene ve çalışma düzenine uygun yapay zekâ araçlarını keşfet.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yaverim — Sana yarayanı bulur",
    description:
      "Hedeflerine, bütçene ve çalışma düzenine uygun yapay zekâ araçlarını keşfet.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={inter.variable}>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
